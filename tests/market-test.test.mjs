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
          this._params = args.map(v => v === undefined ? null : v);
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

describe('SmokeyKamado Netherlands Market Test Suite', () => {
  before(async () => {
    const schemaSql = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf8');
    db = createMockD1();
    db._sqlite.exec(schemaSql);

    mockEnv = {
      DB: db,
      ADMIN_PASSWORD: 'test-admin-pwd',
      SITE_URL: 'https://smokeykamado.nl',
      STORE_NAME: 'SmokeyKamado Nederland'
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

    test('POST /api/market-test/track registers page_view visitor with source attribution', async () => {
      const req = new Request('http://localhost/api/market-test/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          eventType: 'page_view',
          payload: { path: '/', source: 'Facebook Ad', initialColor: 'Black' }
        })
      });

      const res = await workerModule.fetch(req, mockEnv);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.ok, true);

      const session = await db.prepare('SELECT * FROM market_sessions WHERE session_id = ?').bind(sessionId).first();
      assert.ok(session);
      assert.equal(session.source, 'Facebook Ad');
      assert.equal(session.reached_cart, 0);
      assert.equal(session.reached_checkout, 0);
      assert.equal(session.reached_intent, 0);
    });

    test('POST /api/market-test/cart-update registers cart reach & abandoned item', async () => {
      const items = [
        { id: 'kamado_23', type: 'kamado', name: 'SmokeyKamado 23″', price: 1019, qty: 1 },
        { id: 'acc_rotisserie_23', type: 'accessory', name: 'Rotisserie (23″)', price: 159, qty: 1 }
      ];

      const req = new Request('http://localhost/api/market-test/cart-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          items,
          totalAmount: 1178,
          lastStep: 'cart',
          source: 'Facebook Ad'
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

  describe('3. Purchase Intent Submission & Regional Capture', () => {
    const sessionId = 'test_session_nl_001';

    test('POST /api/market-test/purchase-intent stores lead with models, colors and prices', async () => {
      const intentPayload = {
        sessionId,
        customer: {
          name: 'Pieter van Dijk',
          email: 'pieter@example.nl',
          phone: '0612345678',
          postalCode: '1015 CR',
          city: 'Amsterdam',
          country: 'NL'
        },
        paymentMethod: 'ideal',
        source: 'Facebook Ad',
        landingPage: '/',
        initialColor: 'Black',
        finalColor: 'Blue',
        modelName: '23" Premium',
        sizeInch: '23',
        items: [
          { id: 'kamado_23', type: 'kamado', name: '23" Premium', colorName: 'Blue', price: 1019, qty: 1 },
          { id: 'acc_rotisserie_23', type: 'accessory', name: 'Rotisserie 23"', price: 159, qty: 1 },
          { id: 'acc_pizza_23', type: 'accessory', name: 'Pizza Stone 23"', price: 69, qty: 1 }
        ],
        accessories: [
          { name: 'Rotisserie 23"', qty: 1, price: 159 },
          { name: 'Pizza Stone 23"', qty: 1, price: 69 }
        ],
        kamadoPriceEur: 1019,
        accessoriesPriceEur: 228,
        totalAmountEur: 1247
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
      assert.equal(intentRow.model_name, '23" Premium');
      assert.equal(intentRow.final_color, 'Blue');
      assert.equal(intentRow.source, 'Facebook Ad');
      assert.equal(intentRow.postal_code, '1015 CR');
      assert.equal(intentRow.total_amount_eur, 1376);

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

    test('GET /api/market-test/stats returns 6 Big Numbers & Breakdowns', async () => {
      const req = new Request('http://localhost/api/market-test/stats', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer test-admin-pwd' }
      });
      const res = await workerModule.fetch(req, mockEnv);
      assert.equal(res.status, 200);
      const stats = await res.json();

      // Verify top 6 big numbers:
      assert.ok(stats.kpis);
      assert.equal(stats.kpis.visitors, 1);
      assert.equal(stats.kpis.addToCart, 1);
      assert.equal(stats.kpis.checkout, 1);
      assert.equal(stats.kpis.purchaseIntent, 1);
      assert.equal(stats.kpis.conversionPct, 1.0);
      assert.equal(stats.kpis.potentialRevenue, 1376);

      // Models breakdown: 18 Basic, 18 Premium, 21, 23, 27
      assert.ok(stats.models);
      const m23 = stats.models.find(m => m.key === '23');
      assert.equal(m23.count, 1);

      // Colors breakdown:
      assert.ok(stats.colors);
      const blueColor = stats.colors.find(c => c.key === 'Blue');
      assert.equal(blueColor.count, 1);

      // Accessories:
      assert.ok(stats.accessories.length >= 2);

      // Concrete Configurations:
      assert.ok(stats.configurations.length > 0);
      assert.ok(stats.configurations[0].description.includes('23'));
      assert.ok(stats.configurations[0].description.includes('Blue'));

      // Intents feed:
      assert.equal(stats.intents.length, 1);
      assert.equal(stats.intents[0].email, 'pieter@example.nl');
      assert.equal(stats.intents[0].source, 'Facebook Ad');
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
      assert.ok(text.includes('Facebook Ad'));
      assert.ok(text.includes('1376'));
    });
  });

  describe('5. Abandoned Carts & Separate Tracking', () => {
    test('Abandoned cart remains logged separately if intent not completed', async () => {
      const abSessionId = 'test_ab_session_999';

      await workerModule.fetch(new Request('http://localhost/api/market-test/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: abSessionId, eventType: 'page_view', payload: { source: 'Google Search' } })
      }), mockEnv);

      await workerModule.fetch(new Request('http://localhost/api/market-test/cart-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: abSessionId,
          items: [{ id: 'kamado_27', name: 'SmokeyKamado 27″', price: 1319, qty: 1 }],
          totalAmount: 1319,
          lastStep: 'checkout',
          email: 'abandoned_user@example.nl',
          source: 'Google Search'
        })
      }), mockEnv);

      const statsRes = await workerModule.fetch(new Request('http://localhost/api/market-test/stats', {
        headers: { 'Authorization': 'Bearer test-admin-pwd' }
      }), mockEnv);
      const stats = await statsRes.json();

      assert.equal(stats.abandoned.length, 1);
      assert.equal(stats.abandoned[0].email, 'abandoned_user@example.nl');
      assert.equal(stats.abandoned[0].source, 'Google Search');
    });
  });

  describe('6. Web Page Routing', () => {
    test('GET / serves Dutch storefront with non-binding interest submission', async () => {
      const req = new Request('http://localhost/', { method: 'GET' });
      const res = await workerModule.fetch(req, mockEnv);
      assert.equal(res.status, 200);
      assert.ok(res.headers.get('Content-Type').includes('text/html'));
      const body = await res.text();
      assert.ok(body.includes('SmokeyKamado Nederland'));
      assert.ok(body.includes('Interesse vrijblijvend versturen'));
      assert.ok(!body.includes('Marktintroductie:'));
    });

    test('GET /admin/market-test serves Admin Dashboard HTML', async () => {
      const req = new Request('http://localhost/admin/market-test', { method: 'GET' });
      const res = await workerModule.fetch(req, mockEnv);
      assert.equal(res.status, 200);
      assert.ok(res.headers.get('Content-Type').includes('text/html'));
      const body = await res.text();
      assert.ok(body.includes('Market Demand Analytics'));
      assert.ok(body.includes('Visitors'));
      assert.ok(body.includes('Potential Revenue'));
    });
  describe('7. Admin Intent Deletion & Recalibration', () => {
    test('DELETE /api/market-test/intent rejects unauthorized requests', async () => {
      const req = new Request('http://localhost/api/market-test/intent?id=test_intent_123', {
        method: 'DELETE'
      });
      const res = await workerModule.fetch(req, mockEnv);
      assert.equal(res.status, 401);
    });

    test('DELETE /api/market-test/intent removes test lead and recalibrates stats', async () => {
      // 1. Submit a test intent to delete
      const testSessionId = 'test_del_session_888';
      const intentPayload = {
        sessionId: testSessionId,
        customer: {
          name: 'Test Tester',
          email: 'test_delete_me@example.nl',
          phone: '0699999999',
          postalCode: '1000 AA',
          city: 'Amsterdam',
          country: 'NL'
        },
        paymentMethod: 'ideal',
        source: 'Test Search',
        landingPage: '/',
        initialColor: 'Black',
        finalColor: 'Black',
        modelName: '18" Basic',
        sizeInch: '18',
        items: [{ id: 'kamado_18', type: 'kamado', name: '18" Basic', price: 599, qty: 1 }],
        accessories: [],
        kamadoPriceEur: 599,
        accessoriesPriceEur: 0,
        totalAmountEur: 599
      };

      const createRes = await workerModule.fetch(new Request('http://localhost/api/market-test/purchase-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intentPayload)
      }), mockEnv);
      const createData = await createRes.json();
      assert.ok(createData.intentId);

      // Verify it exists
      const beforeRow = await db.prepare('SELECT * FROM purchase_intents WHERE id = ?').bind(createData.intentId).first();
      assert.ok(beforeRow);

      // 2. Delete the intent as admin
      const delReq = new Request(`http://localhost/api/market-test/intent?id=${createData.intentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer test-admin-pwd' }
      });
      const delRes = await workerModule.fetch(delReq, mockEnv);
      assert.equal(delRes.status, 200);
      const delData = await delRes.json();
      assert.equal(delData.ok, true);

      // 3. Verify it is gone from database
      const afterRow = await db.prepare('SELECT * FROM purchase_intents WHERE id = ?').bind(createData.intentId).first();
      assert.equal(afterRow, null);
    });
  });

  describe('8. SEO, Robots.txt, Sitemap and Schema.org Structured Data', () => {
    test('GET /robots.txt serves valid robots directives pointing to sitemap', async () => {
      const req = new Request('http://localhost/robots.txt', { method: 'GET' });
      const res = await workerModule.fetch(req, mockEnv);
      assert.equal(res.status, 200);
      assert.ok(res.headers.get('Content-Type').includes('text/plain'));
      const text = await res.text();
      assert.ok(text.includes('User-agent: *'));
      assert.ok(text.includes('Disallow: /admin'));
      assert.ok(text.includes('Sitemap: https://smokeykamado.nl/sitemap.xml'));
    });

    test('GET /sitemap.xml serves valid XML sitemap with hreflangs', async () => {
      const req = new Request('http://localhost/sitemap.xml', { method: 'GET' });
      const res = await workerModule.fetch(req, mockEnv);
      assert.equal(res.status, 200);
      assert.ok(res.headers.get('Content-Type').includes('application/xml'));
      const text = await res.text();
      assert.ok(text.includes('<loc>https://smokeykamado.nl/</loc>'));
      assert.ok(text.includes('hreflang="nl"'));
      assert.ok(text.includes('hreflang="en"'));
    });

    test('GET / contains Dutch search metadata and an honest collection schema', async () => {
      const req = new Request('http://localhost/', { method: 'GET' });
      const res = await workerModule.fetch(req, mockEnv);
      assert.equal(res.status, 200);
      const body = await res.text();
      assert.ok(body.includes('Kamado BBQ kopen? Vergelijk 18–27 inch | SmokeyKamado'));
      assert.ok(body.includes('application/ld+json'));
      assert.ok(body.includes('"@type":"ItemList"'));
      assert.ok(!body.includes('"@type":"AggregateOffer"'));
      assert.ok(body.includes('Veelgestelde Vragen over de Kamado BBQ'));
    });
  });
});
});

describe('Regression: isolated owner notifications and reliable demand counts', () => {
  let env;
  let worker;
  const payload = () => ({
    sessionId: 'regression-session',
    customer: { email: 'buyer@example.nl', name: 'Buyer' },
    sizeInch: '23', finalColor: 'Red', totalAmountEur: 1,
    items: [{ id: 'kamado_23', type: 'kamado', name: '23 Premium', sizeInch: '23', colorName: 'Blue', price: 1019, qty: 1 }],
    accessories: [{ name: 'Phantom accessory', price: 999, qty: 1 }]
  });
  const submit = data => worker.fetch(new Request('https://example.test/api/market-test/purchase-intent', {
    method: 'POST', body: JSON.stringify(data)
  }), env);

  before(async () => {
    env = { DB: createMockD1(), ADMIN_PASSWORD: 'regression-password' };
    worker = (await import('../worker.js')).default;
  });

  test('common passwords never grant stats, export or delete access; missing secret fails closed', async () => {
    for (const token of ['admin', 'kamado', 'kundikamado', 'craftkamado']) {
      for (const [route, method] of [['stats', 'GET'], ['export-intents.csv', 'GET'], ['intent?id=anything', 'DELETE']]) {
        const response = await worker.fetch(new Request('https://example.test/api/market-test/' + route, {
          method, headers: { Authorization: 'Bearer ' + token }
        }), env);
        assert.equal(response.status, 401);
      }
    }
    assert.equal((await worker.fetch(new Request('https://example.test/api/market-test/stats?token=admin'), {})).status, 401);
  });

  test('rejects empty baskets, invalid email and negative quantities before storing', async () => {
    for (const data of [{ ...payload(), items: [] }, { ...payload(), customer: { email: 'bad' } },
      { ...payload(), items: [{ ...payload().items[0], qty: -1 }] }]) {
      assert.equal((await submit(data)).status, 400);
    }
    assert.equal((await env.DB.prepare('SELECT COUNT(*) AS n FROM purchase_intents').first()).n, 0);
  });

  test('uses basket totals and color, records missing telemetry, persists notification failure', async () => {
    const result = await (await submit(payload())).json();
    assert.equal(result.ok, true);
    const row = await env.DB.prepare('SELECT * FROM purchase_intents WHERE id = ?').bind(result.intentId).first();
    assert.equal(row.total_amount_eur, 1148);
    assert.equal(row.accessories_price_eur, 0);
    assert.equal(row.final_color, 'Blue');
    assert.equal(row.notification_sent, 0);
    assert.equal(row.notification_error, 'MAIL_NOT_CONFIGURED');
    const session = await env.DB.prepare('SELECT * FROM market_sessions WHERE session_id = ?').bind(payload().sessionId).first();
    assert.equal(session.reached_intent, 1);
    assert.equal(session.reached_checkout, 1);
  });

  test('concurrent retries keep one lead and the same intent identifier', async () => {
    const responses = await Promise.all([submit(payload()), submit(payload())]);
    const [a, b] = await Promise.all(responses.map(r => r.json()));
    assert.equal(a.intentId, b.intentId);
    assert.equal(a.duplicate, true);
    assert.equal((await env.DB.prepare('SELECT COUNT(*) AS n FROM purchase_intents').first()).n, 1);
  });

  test('telemetry cannot mark a session as converted without a saved lead', async () => {
    const response = await worker.fetch(new Request('https://example.test/api/market-test/track', {
      method: 'POST', body: JSON.stringify({ sessionId: 'fake', eventType: 'purchase_intent' })
    }), env);
    assert.equal(response.status, 400);
  });

  test('clearing a basket removes its abandoned cart', async () => {
    for (const items of [payload().items, []]) {
      const response = await worker.fetch(new Request('https://example.test/api/market-test/cart-update', {
        method: 'POST', body: JSON.stringify({ sessionId: 'empty-cart', items, totalAmount: 1019 })
      }), env);
      assert.equal(response.status, 200);
    }
    assert.equal(await env.DB.prepare('SELECT * FROM abandoned_carts WHERE session_id = ?').bind('empty-cart').first(), null);
  });

  test('accessory-only intent does not count as a 23-inch kamado', async () => {
    await submit({ ...payload(), sessionId: 'accessories', items: [{ type: 'accessory', name: 'Cover', price: 49, qty: 1 }] });
    const response = await worker.fetch(new Request('https://example.test/api/market-test/stats', {
      headers: { Authorization: 'Bearer regression-password' }
    }), env);
    const stats = await response.json();
    assert.equal(stats.kpis.purchaseIntent, 2);
    assert.equal(stats.models.find(m => m.key === '23').count, 1);
  });

  test('mail reuses the shared sender only through the dedicated NL route', async () => {
    const vm = await import('node:vm');
    const source = fs.readFileSync(path.join(__dirname, '../server/email-service.js'), 'utf8');
    const calls = [];
    let reply = { success: true, recipient: 'ferkomes@gmail.com' };
    const context = { module: { exports: {} }, AbortSignal,
      fetch: () => { throw Error('No direct Mailjet or public fallback allowed'); }
    };
    vm.runInNewContext(source, context);
    const send = context.module.exports.sendPurchaseIntentNotification;
    const mailEnv = { NOTIFY_EMAIL: 'wrong@example.test', MAIL_SENDER: {
      fetch: async (url, options) => {
        calls.push({ url, data: JSON.parse(options.body) });
        return Response.json(reply);
      }
    } };
    assert.equal((await send(mailEnv, payload())).success, true);
    assert.equal(calls[0].url, 'https://mail-sender/nl-kamado/intent');
    assert.equal(calls[0].data.targetEmail, 'ferkomes@gmail.com');
    assert.equal(calls[0].data.customerEmail, 'buyer@example.nl');
    reply = { success: false, error: 'MAIL_PROVIDER_ERROR' };
    assert.equal((await send(mailEnv, payload())).success, false);
    reply = { success: true, recipient: 'wrong@example.test' };
    assert.equal((await send(mailEnv, payload())).success, false);
    mailEnv.MAIL_SENDER.fetch = async () => { throw Error('Unavailable'); };
    assert.equal((await send(mailEnv, payload())).error, 'MAIL_SEND_FAILED');
    assert.equal((await send({}, payload())).error, 'MAIL_NOT_CONFIGURED');
    assert.equal(calls.length, 3);
  });
});


test('test domain works with SmokeyKamado branding before DNS migration', async () => {
  const worker = (await import('../worker.js')).default;
  const env = { SITE_URL: 'https://nl-kamado.ferkomes.workers.dev' };
  for (const route of ['/', '/robots.txt', '/sitemap.xml']) {
    const response = await worker.fetch(new Request('https://nl-kamado.ferkomes.workers.dev' + route), env);
    const text = await response.text();
    assert.equal(response.status, 200);
    assert.ok(text.includes(env.SITE_URL));
    assert.ok(!text.includes('https://smokeykamado.nl'));
    if (route === '/') assert.ok(text.includes('SmokeyKamado'));
  }
});

test('generated storefront scripts parse and premium collection has four sizes and complete equipment', async () => {
  const vm = await import('node:vm');
  const worker = (await import('../worker.js')).default;
  const html = await (await worker.fetch(new Request('https://example.test/'), {})).text();
  for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (match[1].includes('ld+json')) JSON.parse(match[2]);
    else new vm.Script(match[2]);
  }
  assert.equal((html.match(/class="size-tab product-card/g) || []).length, 4);
  assert.equal((html.match(/class="equipment-number"/g) || []).length, 15);
  assert.ok(html.indexOf('id="sizeTabs"') < html.indexOf('id="configCard"'));
});

test('every kamado and accessory has a directly accessible product page with its own metadata', async () => {
  const worker = (await import('../worker.js')).default;
  const vm = await import('node:vm');
  const paths = ['/kamados/18-premium', '/kamados/21', '/kamados/23', '/kamados/27',
    '/accessories/cover', '/accessories/rotisserie', '/accessories/cast-iron-halfmoon',
    '/accessories/pizza-stone', '/accessories/electric-starter', '/accessories/bbq-gloves'];
  for (const path of paths) {
    const response = await worker.fetch(new Request('https://example.test' + path), {});
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes('rel="canonical" href="https://example.test' + path + '"'));
    assert.ok(html.includes('class="page-' + (path.startsWith('/kamados') ? 'kamado' : 'accessory') + '"'));
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    assert.equal(schema['@graph'].find(node => node['@type'] === 'Product').url, 'https://example.test' + path);
    for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
      if (!match[1].includes('ld+json')) new vm.Script(match[2]);
    }
  }
  const missing = await worker.fetch(new Request('https://example.test/kamados/99'), {});
  assert.equal(missing.status, 404);
  const sitemap = await (await worker.fetch(new Request('https://example.test/sitemap.xml'), {})).text();
  for (const path of paths) assert.ok(sitemap.includes('https://example.test' + path));
});

test('inventory imports 139 units once, protects edits, hides sold-out variants and does not consume stock for intents', async () => {
  const worker = (await import('../worker.js')).default;
  const env = { DB: createMockD1(), ADMIN_PASSWORD: 'inventory-test' };
  const get = async () => (await worker.fetch(new Request('https://example.test/api/inventory'), env)).json();
  const update = (body, authorized = true) => worker.fetch(new Request('https://example.test/api/inventory', {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...(authorized ? { Authorization: 'Bearer inventory-test' } : {}) }, body: JSON.stringify(body)
  }), env);
  let stock = (await get()).stock;
  assert.equal(Object.values(stock).flatMap(Object.values).reduce((sum, n) => sum + n, 0), 139);
  assert.deepEqual(stock['18_basic'], { Black: 6, Red: 6 });
  assert.equal(stock['27'].Orange, undefined);
  assert.equal((await update({ modelKey: '18_basic', color: 'Red', quantity: 0, previousQuantity: 6 }, false)).status, 401);
  assert.equal((await update({ modelKey: '18_basic', color: 'Red', quantity: -1, previousQuantity: 6 })).status, 400);
  assert.equal((await update({ modelKey: '18_basic', color: 'Red', quantity: 0, previousQuantity: 6 })).status, 200);
  assert.equal((await update({ modelKey: '18_basic', color: 'Red', quantity: 4, previousQuantity: 6 })).status, 409);
  assert.equal((await get()).stock['18_basic'].Red, 0, 'reload does not restore initial stock');
  const payload = { sessionId: 'inventory-lead', customer: { email: 'inventory@example.nl' }, sizeInch: '18',
    items: [{ id: 'kamado_18_basic', modelKey: '18_basic', type: 'kamado', name: '18 Basic', price: 599, qty: 1, colorName: 'Not selected' }] };
  const submit = () => worker.fetch(new Request('https://example.test/api/market-test/purchase-intent', { method: 'POST', body: JSON.stringify(payload) }), env);
  assert.equal((await submit()).status, 200);
  assert.equal((await get()).stock['18_basic'].Black, 6, 'demand test does not decrement stock');
  const lead = await env.DB.prepare('SELECT final_color FROM purchase_intents WHERE session_id = ?').bind('inventory-lead').first();
  assert.equal(lead.final_color, 'Not selected');
  await update({ modelKey: '18_basic', color: 'Black', quantity: 0, previousQuantity: 6 });
  payload.sessionId = 'sold-out';
  assert.equal((await submit()).status, 400, 'old carts cannot submit a sold-out model');
  const basicPage = await worker.fetch(new Request('https://example.test/kamados/18-basic'), env);
  assert.equal(basicPage.status, 200);
  assert.match(await basicPage.text(), /SmokeyKamado 18″ Basic/);
});

test('support links serve both languages without a database or real purchase promises', async () => {
  const worker = (await import('../worker.js')).default;
  const home = await (await worker.fetch(new Request('https://example.test/'), {})).text();
  assert.match(home, /mailto:info@smokeykamado.nl/);
  for (const route of ['shipping', 'warranty', 'returns']) {
    assert.match(home, new RegExp('href="/support/' + route + '"'));
    for (const lang of ['nl', 'en']) {
      const response = await worker.fetch(new Request(`https://example.test/support/${route}?lang=${lang}`), {});
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.match(html, new RegExp('<html lang="' + lang + '"'));
      assert.match(html, /info@smokeykamado.nl/);
      assert.match(html, /geen bestellingen|no orders/);
    }
  }
  assert.doesNotMatch(home, /Gratis Bezorging|Free insured pallet|levenslange garantie/);
});

test('delivery rates are server-calculated for 18/27 and accessories, included in stored totals and email', async () => {
  const worker = (await import('../worker.js')).default;
  const db = createMockD1();
  // Exercise an existing database upgrade without discarding an existing record.
  db._sqlite.exec(`CREATE TABLE purchase_intents (id TEXT PRIMARY KEY, session_id TEXT, created_at TEXT, email TEXT, name TEXT, phone TEXT, postal_code TEXT, city TEXT, country TEXT, source TEXT, landing_page TEXT, initial_color TEXT, final_color TEXT, model_name TEXT, size_inch TEXT, items_json TEXT, accessories_json TEXT, kamado_price_eur REAL, accessories_price_eur REAL, total_amount_eur REAL, payment_method_intent TEXT, notification_sent INTEGER, notification_error TEXT);
  INSERT INTO purchase_intents(id,total_amount_eur) VALUES('legacy',42);`);
  for (const [key, size, price, shipping] of [['18_basic','18',549,99], ['27','27',1199,129], ['accessory','',49,7.95]]) {
    let notification;
    const env = { DB: db, MAIL_SENDER: { fetch: async (_url, options) => {
      notification = JSON.parse(options.body);
      return Response.json({success:true,recipient:'ferkomes@gmail.com'});
    } } };
    const item = {id:key,modelKey:key,type:size ? 'kamado' : 'accessory',name:key,sizeInch:size,price,qty:1};
    const response = await worker.fetch(new Request('https://example.test/api/market-test/purchase-intent', {method:'POST',body:JSON.stringify({sessionId:key,customer:{email:'buyer@example.nl'},items:[item],shippingAmountEur:0,totalAmountEur:1})}),env);
    assert.equal(response.status,200,await response.clone().text());
    const row = db._sqlite.prepare('SELECT * FROM purchase_intents WHERE session_id=?').get(key);
    assert.equal(row.shipping_amount_eur,shipping);
    assert.equal(row.total_amount_eur,price+shipping);
    assert.match(notification.message,/Bezorging \(indicatief\): €/);
    assert.equal(notification.targetEmail,'ferkomes@gmail.com');
  }
  assert.equal(db._sqlite.prepare("SELECT total_amount_eur FROM purchase_intents WHERE id='legacy'").get().total_amount_eur,42);
});

test('media configuration authenticates writes, validates URLs, persists ordered placements and detects conflicts', async () => {
  const worker = (await import('../worker.js')).default;
  const env = { DB: createMockD1(), ADMIN_PASSWORD: 'media-test-secret' };
  const post = (data, token = 'media-test-secret') => worker.fetch(new Request('https://example.test/api/media', {method:'POST',headers:{Authorization:'Bearer '+token},body:JSON.stringify(data)}),env);
  const read = async () => (await worker.fetch(new Request('https://example.test/api/media'),env)).json();
  assert.deepEqual((await read()).placements,{});
  const data = {placement:'/kamados/27',revision:0,urls:['https://youtu.be/abcdefghijk','https://www.youtube.com/shorts/12345678901']};
  assert.equal((await post(data,'wrong')).status,401);
  for (const url of ['javascript:alert(1)','https://youtube.com.evil.test/watch?v=abcdefghijk','https://example.com/abcdefghijk','https://youtube.com/watch?v=bad','https://user@youtube.com/watch?v=abcdefghijk']) {
    assert.equal((await post({...data,urls:[url]})).status,400);
  }
  assert.equal((await post({...data,placement:'/unknown'})).status,400);
  assert.equal((await post({...data,urls:Array(6).fill(data.urls[0])})).status,400);
  assert.equal((await post(data)).status,200);
  assert.deepEqual((await read()).placements['/kamados/27'].videos,['abcdefghijk','12345678901']);
  assert.equal((await post(data)).status,409);
  assert.equal((await post({placement:'/',revision:0,urls:[data.urls[0]]})).status,200);
  assert.equal((await post({...data,revision:1,urls:[]})).status,200);
  const result = await read();
  assert.deepEqual(result.placements['/kamados/27'].videos,[]);
  assert.equal(result.placements['/'].videos.length,1);
  assert.equal(Object.keys(result.locations).length,12);
});

test('preview domain stays noindex until permanent-domain canonical configuration is ready', async () => {
  const worker = (await import('../worker.js')).default;
  for (const path of ['/', '/kamados/27']) {
    const preview = await worker.fetch(new Request('https://nl-kamado.ferkomes.workers.dev'+path),{SITE_URL:'https://smokeykamado.nl'});
    assert.match(preview.headers.get('X-Robots-Tag'),/noindex/);
    const pending = await worker.fetch(new Request('https://smokeykamado.nl'+path),{SITE_URL:'https://nl-kamado.ferkomes.workers.dev'});
    assert.match(pending.headers.get('X-Robots-Tag'),/noindex/);
    const ready = await worker.fetch(new Request('https://smokeykamado.nl'+path),{SITE_URL:'https://smokeykamado.nl'});
    assert.equal(ready.headers.get('X-Robots-Tag'),null);
  }
  const sitemap = await (await worker.fetch(new Request('https://smokeykamado.nl/sitemap.xml'),{SITE_URL:'https://smokeykamado.nl'})).text();
  assert.match(sitemap,/https:\/\/smokeykamado.nl\/kamados\/27/);
  assert.doesNotMatch(sitemap,/<lastmod>|workers.dev/);
});

test('SEO: canonical language variants, crawlable accessories, unique H1s and complete reciprocal sitemap', async () => {
  const worker = (await import('../worker.js')).default;
  const env={SITE_URL:'https://smokeykamado.nl'};
  const get=async path=>(await worker.fetch(new Request('https://smokeykamado.nl'+path),env)).text();
  const home=await get('/');
  const visible=home.slice(home.indexOf('<body'),home.indexOf('<script>',home.indexOf('<body')));
  assert.ok(visible.indexOf('id="collectie"')<visible.indexOf('id="accessoires"'));
  assert.ok(visible.indexOf('id="accessoires"')<visible.indexOf('id="modellen"'));
  assert.equal((visible.match(/<h1\b/g)||[]).length,1);
  assert.match(visible,/href="\/accessories\/rotisserie"/);
  assert.match(visible,/href="\/kamados\/18-basic"/);
  assert.doesNotMatch(visible,/Jan van der Meer|30%|40%/);
  for(const path of ['/','/kamados/27','/kamados/18-basic','/accessories/pizza-stone']) {
    for(const lang of ['nl','en']) {
      const url=path+(lang==='en'?'?lang=en':'');
      const html=await get(url);
      assert.match(html,new RegExp('<html lang="'+lang+'"'));
      assert.ok(html.includes('rel="canonical" href="https://smokeykamado.nl'+url+'"'));
      assert.ok(html.includes('hreflang="en" href="https://smokeykamado.nl'+path+'?lang=en"'));
      const body=html.slice(html.indexOf('<body'),html.indexOf('<script>',html.indexOf('<body')));
      assert.equal((body.match(/<h1\b/g)||[]).length,1,url);
      if(lang==='en') assert.match(body,/View details/);
      const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
      assert.ok(schema['@graph']);
      assert.doesNotMatch(JSON.stringify(schema),/AggregateOffer|aggregateRating|InStock/);
    }
  }
  const map=await get('/sitemap.xml');assert.equal((map.match(/<loc>/g)||[]).length,24);
  assert.doesNotMatch(map,/workers.dev|lang=nl|\/admin|\/api/);
  const redirect=await worker.fetch(new Request('https://smokeykamado.nl/kamados/27/?lang=en'),env);
  assert.equal(redirect.status,301);assert.equal(redirect.headers.get('Location'),'https://smokeykamado.nl/kamados/27?lang=en');
});


test('kamado details lead with the selected product while the homepage keeps accessories below the collection', async () => {
  const worker = (await import('../worker.js')).default;
  for (const key of ['18-basic', '18-premium', '21', '23', '27']) {
    for (const lang of ['nl', 'en']) {
      const html = await (await worker.fetch(new Request('https://smokeykamado.nl/kamados/' + key + '?lang=' + lang), {})).text();
      assert.ok(html.indexOf('id="modellen"') < html.indexOf('id="accessoires"'), key + ' ' + lang);
      assert.equal((html.match(/<section id="accessoires"/g) || []).length, 1);
    }
  }
  const home = await (await worker.fetch(new Request('https://smokeykamado.nl/'), {})).text();
  assert.ok(home.indexOf('id="collectie"') < home.indexOf('id="accessoires"'));
  assert.ok(home.indexOf('id="accessoires"') < home.indexOf('id="modellen"'));
});

test('introductory prices and RRP agree across all product pages and override stale submitted prices', async () => {
  const worker = (await import('../worker.js')).default;
  const env={DB:createMockD1()};
  for (const [key,price,rrp] of [['18_basic',549,599],['18_premium',799,849],['21',949,1099],['23',1049,1199],['27',1199,1399]]) {
    for(const lang of ['nl','en']) {
      const html=await (await worker.fetch(new Request('https://smokeykamado.nl/kamados/'+key.replace('_','-')+'?lang='+lang),env)).text();
      assert.match(html,new RegExp('id="activeModelPrice">€'+price));
      assert.match(html,new RegExp('id="modelRrp">(?:Recommended list price|Adviesprijs): €'+rrp));
      assert.match(html,/id="modelPriceLabel">(?:Introductieprijs|Introductory price)/);
    }
    const response=await worker.fetch(new Request('https://smokeykamado.nl/api/market-test/purchase-intent',{method:'POST',body:JSON.stringify({sessionId:'intro-'+key,customer:{email:'test@example.nl'},items:[{id:'kamado_'+key,modelKey:key,type:'kamado',name:key,sizeInch:key.slice(0,2),price:1,qty:1}]})}),env);
    assert.equal(response.status,200);
    const row=await env.DB.prepare('SELECT kamado_price_eur,total_amount_eur FROM purchase_intents WHERE session_id=?').bind('intro-'+key).first();
    assert.equal(row.kamado_price_eur,price);assert.equal(row.total_amount_eur,price+(key==='27'?129:99));
  }
});
