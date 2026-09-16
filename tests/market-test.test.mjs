import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createMockD1() {
  const sqlite = new DatabaseSync(':memory:');
  return {
    _sqlite: sqlite,
    prepare(sql) {
      return {
        _params: [],
        bind(...args) {
          this._params = args;
          return this;
        },
        async run() {
          const stmt = sqlite.prepare(sql);
          const info = stmt.run(...this._params);
          return { success: true, meta: { changes: info.changes } };
        },
        async first() {
          const stmt = sqlite.prepare(sql);
          return stmt.get(...this._params) || null;
        },
        async all() {
          const stmt = sqlite.prepare(sql);
          const rows = stmt.all(...this._params);
          return { results: rows || [] };
        }
      };
    },
    async exec(sql) {
      sqlite.exec(sql);
      return { success: true };
    }
  };
}

let db;
let mockEnv;
let workerModule;

describe('KundiKamado Netherlands Market Test Suite', () => {
  before(async () => {
    const schemaSql = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf8');
    db = createMockD1();
    db._sqlite.exec(schemaSql);

    mockEnv = {
      DB: db,
      ADMIN_PASSWORD: 'test-admin-pwd',
      NOTIFY_EMAIL: 'info@kundikamado.hu',
      STORE_NAME: 'KundiKamado Nederland'
    };

    workerModule = (await import('../worker.js')).default;
  });

  describe('1. Size-Specific Accessory Matrix & Pricing', () => {
    const sizeAccessories = {
      cover: { '18': 39, '21': 45, '23': 49, '27': 59 },
      rotisserie: { '18': 139, '21': 159, '23': 159, '27': 189 },
      'cast-iron-halfmoon': { '18': 49, '21': 59, '23': 69, '27': 79 },
      'pizza-stone': { '18': 49, '21': 59, '23': 69, '27': 79 }
    };

    test('Cover prices scale with kamado size', () => {
      assert.equal(sizeAccessories.cover['18'], 39);
      assert.equal(sizeAccessories.cover['21'], 45);
      assert.equal(sizeAccessories.cover['23'], 49);
      assert.equal(sizeAccessories.cover['27'], 59);
    });

    test('Rotisserie prices scale with kamado size', () => {
      assert.equal(sizeAccessories.rotisserie['18'], 139);
      assert.equal(sizeAccessories.rotisserie['21'], 159);
      assert.equal(sizeAccessories.rotisserie['23'], 159);
      assert.equal(sizeAccessories.rotisserie['27'], 189);
    });

    test('Cast iron and Pizza stone prices match agreed matrix', () => {
      ['18', '21', '23', '27'].forEach(sz => {
        assert.ok(sizeAccessories['cast-iron-halfmoon'][sz] > 0);
        assert.ok(sizeAccessories['pizza-stone'][sz] > 0);
      });
      assert.equal(sizeAccessories['cast-iron-halfmoon']['23'], 69);
      assert.equal(sizeAccessories['pizza-stone']['23'], 69);
    });
  });

  describe('2. Funnel Tracking & Cart Telemetry via Worker API', () => {
    const sessionId = 'test_session_nl_001';

    test('POST /api/market-test/track registers page_view visitor', async () => {
      const req = new Request('http://localhost/api/market-test/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          eventType: 'page_view',
          payload: { path: '/' }
        })
      });

      const res = await workerModule.fetch(req, mockEnv);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.ok, true);

      const session = await db.prepare('SELECT * FROM market_sessions WHERE session_id = ?').bind(sessionId).first();
      assert.ok(session);
      assert.equal(session.reached_cart, 0);
      assert.equal(session.reached_checkout, 0);
      assert.equal(session.reached_intent, 0);
    });

    test('POST /api/market-test/cart-update registers cart reach & abandoned item', async () => {
      const items = [
        { id: 'kamado_23_black_bubble', type: 'kamado', name: 'KundiKamado 23″', price: 1019, qty: 1 },
        { id: 'acc_rotisserie_23', type: 'accessory', name: 'Draaispit / Rotisserie', price: 159, qty: 1 }
      ];

      const req = new Request('http://localhost/api/market-test/cart-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          items,
          totalAmount: 1178,
          lastStep: 'cart'
        })
      });

      const res = await workerModule.fetch(req, mockEnv);
      assert.equal(res.status, 200);

      const session = await db.prepare('SELECT * FROM market_sessions WHERE session_id = ?').bind(sessionId).first();
      assert.equal(session.reached_cart, 1);
      assert.equal(session.reached_checkout, 0);

      const abandoned = await db.prepare('SELECT * FROM abandoned_carts WHERE session_id = ?').bind(sessionId).first();
      assert.ok(abandoned);
      assert.equal(abandoned.total_amount_eur, 1178);
      assert.equal(abandoned.converted_to_intent, 0);
    });

    test('POST /api/market-test/track registers checkout_start step', async () => {
      const req = new Request('http://localhost/api/market-test/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          eventType: 'checkout_start',
          payload: { totalAmount: 1178 }
        })
      });

      const res = await workerModule.fetch(req, mockEnv);
      assert.equal(res.status, 200);

      const session = await db.prepare('SELECT * FROM market_sessions WHERE session_id = ?').bind(sessionId).first();
      assert.equal(session.reached_checkout, 1);
    });
  });

  describe('3. Purchase Intent Submission & VIP Notice', () => {
    const sessionId = 'test_session_nl_001';

    test('POST /api/market-test/purchase-intent stores lead and marks session converted', async () => {
      const intentPayload = {
        sessionId,
        customer: {
          name: 'Pieter van Dijk',
          email: 'pieter@example.nl',
          phone: '0612345678',
          street: 'Keizersgracht',
          houseNumber: '101',
          postalCode: '1015 CJ',
          city: 'Amsterdam',
          country: 'NL'
        },
        paymentMethod: 'ideal',
        modelId: '23',
        sizeInch: '23',
        colorId: 'black',
        colorName: 'Onyx Zwart',
        texture: 'Bubble Glaze (Ambachtelijk reliëf)',
        items: [
          { id: 'kamado_23', type: 'kamado', name: 'KundiKamado 23″', price: 1019, qty: 1 },
          { id: 'acc_rotisserie_23', type: 'accessory', name: 'Rotisserie', price: 159, qty: 1 },
          { id: 'acc_cover_23', type: 'accessory', name: 'Beschermhoes', price: 49, qty: 1 }
        ],
        accessories: [
          { name: 'Rotisserie', qty: 1, price: 159 },
          { name: 'Beschermhoes', qty: 1, price: 49 }
        ],
        subtotalEur: 1227,
        shippingFeeEur: 0,
        totalAmountEur: 1227
      };

      const req = new Request('http://localhost/api/market-test/purchase-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intentPayload)
      });

      const res = await workerModule.fetch(req, mockEnv);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.ok(data.ok);
      assert.ok(data.intentId.startsWith('intent_'));

      const intentRow = await db.prepare('SELECT * FROM purchase_intents WHERE id = ?').bind(data.intentId).first();
      assert.ok(intentRow);
      assert.equal(intentRow.email, 'pieter@example.nl');
      assert.equal(intentRow.size_inch, '23');
      assert.equal(intentRow.total_amount_eur, 1227);

      const session = await db.prepare('SELECT * FROM market_sessions WHERE session_id = ?').bind(sessionId).first();
      assert.equal(session.reached_intent, 1);

      const abandoned = await db.prepare('SELECT * FROM abandoned_carts WHERE session_id = ?').bind(sessionId).first();
      assert.equal(abandoned.converted_to_intent, 1);
    });
  });

  describe('4. Admin Analytics Dashboard API (/admin/market-test)', () => {
    test('GET /api/market-test/stats rejects unauthorized request', async () => {
      const req = new Request('http://localhost/api/market-test/stats', {
        method: 'GET'
      });
      const res = await workerModule.fetch(req, mockEnv);
      assert.equal(res.status, 401);
    });

    test('GET /api/market-test/stats returns complete metrics with correct password', async () => {
      const req = new Request('http://localhost/api/market-test/stats', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer test-admin-pwd' }
      });
      const res = await workerModule.fetch(req, mockEnv);
      assert.equal(res.status, 200);
      const stats = await res.json();

      assert.ok(stats.overview);
      assert.equal(stats.overview.totalVisitors, 1);
      assert.equal(stats.overview.totalCarts, 1);
      assert.equal(stats.overview.totalCheckouts, 1);
      assert.equal(stats.overview.totalIntents, 1);
      assert.equal(stats.overview.hypotheticalRevenue, 1227);
      assert.equal(stats.overview.averageOrderValue, 1227);
      assert.equal(stats.overview.totalKamadoUnits, 1);

      assert.ok(stats.funnel);
      assert.equal(stats.funnel.cartRate, 1.0);
      assert.equal(stats.funnel.intentRate, 1.0);

      assert.ok(stats.models);
      const m23 = stats.models.find(m => m.size === '23');
      assert.equal(m23.count, 1);
      assert.equal(m23.revenue, 1019);

      assert.ok(stats.accessories.length > 0);
      assert.equal(stats.intents.length, 1);
      assert.equal(stats.intents[0].email, 'pieter@example.nl');
    });

    test('GET /api/market-test/export-intents.csv outputs valid CSV', async () => {
      const req = new Request('http://localhost/api/market-test/export-intents.csv?token=test-admin-pwd', {
        method: 'GET'
      });
      const res = await workerModule.fetch(req, mockEnv);
      assert.equal(res.status, 200);
      assert.ok(res.headers.get('Content-Type').includes('text/csv'));
      const text = await res.text();
      assert.ok(text.includes('pieter@example.nl'));
      assert.ok(text.includes('1227'));
      assert.ok(text.includes('23 inch'));
    });
  });

  describe('5. Abandoned Carts & Separate Tracking', () => {
    test('Abandoned cart remains logged separately if intent not completed', async () => {
      const abSessionId = 'test_ab_session_999';

      await workerModule.fetch(new Request('http://localhost/api/market-test/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: abSessionId, eventType: 'page_view' })
      }), mockEnv);

      await workerModule.fetch(new Request('http://localhost/api/market-test/cart-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: abSessionId,
          items: [{ id: 'kamado_27', name: 'KundiKamado 27″', price: 1319, qty: 1 }],
          totalAmount: 1319,
          lastStep: 'checkout',
          email: 'abandoned_user@example.nl',
          name: 'Klaas Bakker'
        })
      }), mockEnv);

      const statsRes = await workerModule.fetch(new Request('http://localhost/api/market-test/stats', {
        headers: { 'Authorization': 'Bearer test-admin-pwd' }
      }), mockEnv);
      const stats = await statsRes.json();

      assert.equal(stats.overview.totalAbandoned, 1);
      assert.equal(stats.overview.lostRevenue, 1319);
      assert.equal(stats.abandoned.length, 1);
      assert.equal(stats.abandoned[0].email, 'abandoned_user@example.nl');
      assert.equal(stats.abandoned[0].last_step, 'checkout');
    });
  });

  describe('6. Web Page Routing', () => {
    test('GET / serves Dutch storefront HTML', async () => {
      const req = new Request('http://localhost/', { method: 'GET' });
      const res = await workerModule.fetch(req, mockEnv);
      assert.equal(res.status, 200);
      assert.ok(res.headers.get('Content-Type').includes('text/html'));
      const body = await res.text();
      assert.ok(body.includes('KundiKamado Nederland'));
      assert.ok(body.includes('Doorgaan naar betaling'));
      assert.ok(body.includes('Marktintroductie'));
    });

    test('GET /admin/market-test serves Admin Dashboard HTML', async () => {
      const req = new Request('http://localhost/admin/market-test', { method: 'GET' });
      const res = await workerModule.fetch(req, mockEnv);
      assert.equal(res.status, 200);
      assert.ok(res.headers.get('Content-Type').includes('text/html'));
      const body = await res.text();
      assert.ok(body.includes('Marktvalidatie Dashboard'));
      assert.ok(body.includes('Aankoopintenties'));
    });
  });
});
