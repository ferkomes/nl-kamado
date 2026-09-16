/**
 * Market Test Tracking, D1 Database Storage, and Metrics Aggregator
 */

const { sendPurchaseIntentNotification } = require('./email-service.js');

async function ensureTables(db) {
  if (!db) return;
  // Safety idempotent creation
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS market_sessions (
      session_id TEXT PRIMARY KEY,
      ip_hash TEXT,
      user_agent TEXT,
      referer TEXT,
      created_at TEXT NOT NULL,
      last_active_at TEXT NOT NULL,
      reached_cart INTEGER DEFAULT 0,
      reached_checkout INTEGER DEFAULT 0,
      reached_intent INTEGER DEFAULT 0
    );
  `).run();

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS market_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      payload_json TEXT,
      created_at TEXT NOT NULL
    );
  `).run();

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS purchase_intents (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      street TEXT NOT NULL,
      house_number TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      city TEXT NOT NULL,
      country TEXT DEFAULT 'NL',
      payment_method_intent TEXT,
      model_id TEXT,
      size_inch TEXT,
      color_id TEXT,
      color_name TEXT,
      texture TEXT,
      items_json TEXT NOT NULL,
      accessories_json TEXT,
      subtotal_eur REAL NOT NULL,
      shipping_fee_eur REAL NOT NULL DEFAULT 0,
      total_amount_eur REAL NOT NULL,
      customer_notes TEXT,
      notification_sent INTEGER DEFAULT 0,
      notification_error TEXT
    );
  `).run();

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS abandoned_carts (
      session_id TEXT PRIMARY KEY,
      updated_at TEXT NOT NULL,
      email TEXT,
      name TEXT,
      phone TEXT,
      items_json TEXT NOT NULL,
      total_amount_eur REAL NOT NULL,
      last_step TEXT NOT NULL DEFAULT 'cart',
      converted_to_intent INTEGER DEFAULT 0
    );
  `).run();
}

async function trackEvent(db, { sessionId, eventType, payload = {}, ip = '', userAgent = '', referer = '' }) {
  if (!db || !sessionId) return;
  await ensureTables(db);
  const now = new Date().toISOString();

  // 1. Session upsert
  const reachedCart = eventType === 'add_to_cart' || eventType === 'open_cart' ? 1 : 0;
  const reachedCheckout = eventType === 'checkout_start' ? 1 : 0;
  const reachedIntent = eventType === 'purchase_intent' ? 1 : 0;

  await db.prepare(`
    INSERT INTO market_sessions (session_id, ip_hash, user_agent, referer, created_at, last_active_at, reached_cart, reached_checkout, reached_intent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(session_id) DO UPDATE SET
      last_active_at = excluded.last_active_at,
      reached_cart = MAX(market_sessions.reached_cart, excluded.reached_cart),
      reached_checkout = MAX(market_sessions.reached_checkout, excluded.reached_checkout),
      reached_intent = MAX(market_sessions.reached_intent, excluded.reached_intent)
  `).bind(sessionId, ip, userAgent, referer, now, now, reachedCart, reachedCheckout, reachedIntent).run();

  // 2. Record individual event
  await db.prepare(`
    INSERT INTO market_events (session_id, event_type, payload_json, created_at)
    VALUES (?, ?, ?, ?)
  `).bind(sessionId, eventType, JSON.stringify(payload), now).run();
}

async function updateCart(db, { sessionId, items = [], totalAmount = 0, lastStep = 'cart', email = null, name = null, phone = null }) {
  if (!db || !sessionId) return;
  await ensureTables(db);
  const now = new Date().toISOString();

  const isCheckout = lastStep === 'checkout';

  // Mark session reached flags
  await db.prepare(`
    UPDATE market_sessions
    SET last_active_at = ?,
        reached_cart = 1,
        reached_checkout = CASE WHEN ? = 1 THEN 1 ELSE reached_checkout END
    WHERE session_id = ?
  `).bind(now, isCheckout ? 1 : 0, sessionId).run();

  // Upsert into abandoned_carts
  if (items && items.length > 0) {
    await db.prepare(`
      INSERT INTO abandoned_carts (session_id, updated_at, email, name, phone, items_json, total_amount_eur, last_step, converted_to_intent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
      ON CONFLICT(session_id) DO UPDATE SET
        updated_at = excluded.updated_at,
        email = COALESCE(excluded.email, abandoned_carts.email),
        name = COALESCE(excluded.name, abandoned_carts.name),
        phone = COALESCE(excluded.phone, abandoned_carts.phone),
        items_json = excluded.items_json,
        total_amount_eur = excluded.total_amount_eur,
        last_step = excluded.last_step
      WHERE abandoned_carts.converted_to_intent = 0
    `).bind(sessionId, now, email, name, phone, JSON.stringify(items), totalAmount, lastStep).run();
  }
}

async function recordPurchaseIntent(env, intentData) {
  const db = env.DB;
  if (!db) throw new Error('Database binding DB is missing');
  await ensureTables(db);

  const intentId = 'intent_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  const now = new Date().toISOString();

  const cust = intentData.customer || {};
  const items = intentData.items || [];
  const accessories = intentData.accessories || [];

  // 1. Insert into purchase_intents
  await db.prepare(`
    INSERT INTO purchase_intents (
      id, session_id, created_at, email, name, phone,
      street, house_number, postal_code, city, country,
      payment_method_intent, model_id, size_inch, color_id, color_name, texture,
      items_json, accessories_json, subtotal_eur, shipping_fee_eur, total_amount_eur,
      customer_notes, notification_sent
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, 0
    )
  `).bind(
    intentId,
    intentData.sessionId,
    now,
    cust.email || '',
    cust.name || '',
    cust.phone || '',
    cust.street || '',
    cust.houseNumber || '',
    cust.postalCode || '',
    cust.city || '',
    cust.country || 'NL',
    intentData.paymentMethod || 'ideal',
    intentData.modelId || '',
    intentData.sizeInch || '',
    intentData.colorId || '',
    intentData.colorName || '',
    intentData.texture || '',
    JSON.stringify(items),
    JSON.stringify(accessories),
    intentData.subtotalEur || intentData.totalAmountEur || 0,
    intentData.shippingFeeEur || 0,
    intentData.totalAmountEur || 0,
    intentData.notes || ''
  ).run();

  // 2. Update session flags
  await db.prepare(`
    UPDATE market_sessions
    SET reached_cart = 1,
        reached_checkout = 1,
        reached_intent = 1,
        last_active_at = ?
    WHERE session_id = ?
  `).bind(now, intentData.sessionId).run();

  // 3. Mark abandoned cart converted
  await db.prepare(`
    UPDATE abandoned_carts
    SET converted_to_intent = 1,
        email = ?,
        name = ?,
        phone = ?
    WHERE session_id = ?
  `).bind(cust.email, cust.name, cust.phone, intentData.sessionId).run();

  // 4. Send email notification asynchronously
  try {
    const notifyResult = await sendPurchaseIntentNotification(env, {
      id: intentId,
      ...intentData
    });
    if (notifyResult.success) {
      await db.prepare(`UPDATE purchase_intents SET notification_sent = 1 WHERE id = ?`).bind(intentId).run();
    }
  } catch (err) {
    console.error('Failed to notify owner for intent:', err);
    await db.prepare(`UPDATE purchase_intents SET notification_error = ? WHERE id = ?`).bind(err.message, intentId).run();
  }

  return { ok: true, intentId };
}

async function getMarketStats(db) {
  if (!db) throw new Error('Database binding DB is missing');
  await ensureTables(db);

  // 1. Session & Funnel counts
  const sessionRow = await db.prepare(`
    SELECT
      COUNT(*) AS total_visitors,
      SUM(CASE WHEN reached_cart = 1 THEN 1 ELSE 0 END) AS total_carts,
      SUM(CASE WHEN reached_checkout = 1 THEN 1 ELSE 0 END) AS total_checkouts,
      SUM(CASE WHEN reached_intent = 1 THEN 1 ELSE 0 END) AS total_intents
    FROM market_sessions
  `).first() || {};

  const totalVisitors = Number(sessionRow.total_visitors || 0);
  const totalCarts = Number(sessionRow.total_carts || 0);
  const totalCheckouts = Number(sessionRow.total_checkouts || 0);
  const totalIntents = Number(sessionRow.total_intents || 0);

  // Funnel calculations
  const cartRate = totalVisitors > 0 ? totalCarts / totalVisitors : 0;
  const cartDropoff = totalVisitors > 0 ? (totalVisitors - totalCarts) / totalVisitors : 0;

  const checkoutRate = totalCarts > 0 ? totalCheckouts / totalCarts : 0;
  const checkoutDropoff = totalCarts > 0 ? (totalCarts - totalCheckouts) / totalCarts : 0;

  const intentRate = totalCheckouts > 0 ? totalIntents / totalCheckouts : 0;
  const intentDropoff = totalCheckouts > 0 ? (totalCheckouts - totalIntents) / totalCheckouts : 0;

  const overallConversionRate = totalVisitors > 0 ? totalIntents / totalVisitors : 0;

  // 2. Revenue & Units from purchase_intents
  const revRow = await db.prepare(`
    SELECT
      COUNT(*) AS intent_count,
      COALESCE(SUM(total_amount_eur), 0) AS total_revenue
    FROM purchase_intents
  `).first() || {};

  const hypotheticalRevenue = Number(revRow.total_revenue || 0);
  const intentCount = Number(revRow.intent_count || 0);
  const averageOrderValue = intentCount > 0 ? hypotheticalRevenue / intentCount : 0;

  // 3. Abandoned carts
  const abRow = await db.prepare(`
    SELECT
      COUNT(*) AS ab_count,
      COALESCE(SUM(total_amount_eur), 0) AS lost_revenue
    FROM abandoned_carts
    WHERE converted_to_intent = 0
  `).first() || {};

  const totalAbandoned = Number(abRow.ab_count || 0);
  const lostRevenue = Number(abRow.lost_revenue || 0);

  // 4. Model / Size breakdown
  const modelStats = [
    { size: '18', price: 699, count: 0, revenue: 0, share: 0 },
    { size: '21', price: 889, count: 0, revenue: 0, share: 0 },
    { size: '23', price: 1019, count: 0, revenue: 0, share: 0 },
    { size: '27', price: 1319, count: 0, revenue: 0, share: 0 }
  ];

  const modelRows = await db.prepare(`
    SELECT size_inch, COUNT(*) as cnt
    FROM purchase_intents
    WHERE size_inch IS NOT NULL AND size_inch != ''
    GROUP BY size_inch
  `).all();

  let totalKamadoUnits = 0;
  (modelRows.results || []).forEach(r => {
    const found = modelStats.find(m => m.size === String(r.size_inch));
    if (found) {
      found.count = Number(r.cnt);
      found.revenue = found.count * found.price;
      totalKamadoUnits += found.count;
    }
  });

  modelStats.forEach(m => {
    m.share = totalKamadoUnits > 0 ? m.count / totalKamadoUnits : 0;
  });

  // 5. Colors & Finish breakdown
  const colorRows = await db.prepare(`
    SELECT color_name, texture, COUNT(*) as cnt
    FROM purchase_intents
    WHERE color_name IS NOT NULL AND color_name != ''
    GROUP BY color_name, texture
    ORDER BY cnt DESC
  `).all();

  const colors = (colorRows.results || []).map(r => ({
    name: `${r.color_name} (${r.texture})`,
    count: Number(r.cnt),
    share: totalKamadoUnits > 0 ? Number(r.cnt) / totalKamadoUnits : 0
  }));

  // 6. Accessories attachment stats
  const allIntents = await db.prepare(`SELECT items_json, accessories_json, size_inch FROM purchase_intents`).all();
  const accMap = new Map();

  (allIntents.results || []).forEach(row => {
    try {
      const items = JSON.parse(row.items_json || '[]');
      items.forEach(item => {
        if (item.type === 'accessory') {
          const accKey = item.name;
          const current = accMap.get(accKey) || { name: accKey, count: 0, revenue: 0 };
          current.count += item.qty || 1;
          current.revenue += (item.price || 0) * (item.qty || 1);
          accMap.set(accKey, current);
        }
      });
    } catch (e) {}
  });

  const accessories = Array.from(accMap.values()).map(a => ({
    ...a,
    attachRate: totalKamadoUnits > 0 ? a.count / totalKamadoUnits : 0
  })).sort((a, b) => b.count - a.count);

  // 7. Combinations matrix
  const combMap = new Map();
  (allIntents.results || []).forEach(row => {
    try {
      const items = JSON.parse(row.items_json || '[]');
      const kamado = items.find(i => i.type === 'kamado');
      if (kamado) {
        const accNames = items.filter(i => i.type === 'accessory').map(i => i.name).sort().join(' + ');
        const combKey = `${kamado.sizeInch}″ (${kamado.colorName} / ${kamado.textureName})` + (accNames ? ` + ${accNames}` : ' (Alleen Kamado)');
        const curr = combMap.get(combKey) || { description: combKey, count: 0, totalValue: 0 };
        curr.count += 1;
        curr.totalValue += items.reduce((s, i) => s + (i.price * i.qty), 0);
        combMap.set(combKey, curr);
      }
    } catch (e) {}
  });

  const combinations = Array.from(combMap.values()).sort((a, b) => b.count - a.count).slice(0, 10);

  // 8. Timeline (Daily)
  const timelineRows = await db.prepare(`
    SELECT
      substr(created_at, 1, 10) as day,
      COUNT(DISTINCT session_id) as visitors,
      SUM(CASE WHEN reached_cart = 1 THEN 1 ELSE 0 END) as carts,
      SUM(CASE WHEN reached_checkout = 1 THEN 1 ELSE 0 END) as checkouts,
      SUM(CASE WHEN reached_intent = 1 THEN 1 ELSE 0 END) as intents
    FROM market_sessions
    GROUP BY day
    ORDER BY day DESC
    LIMIT 30
  `).all();

  // Join day revenue from purchase_intents
  const dailyRevRows = await db.prepare(`
    SELECT substr(created_at, 1, 10) as day, SUM(total_amount_eur) as rev
    FROM purchase_intents
    GROUP BY day
  `).all();
  const dailyRevMap = new Map((dailyRevRows.results || []).map(r => [r.day, Number(r.rev)]));

  const timeline = (timelineRows.results || []).map(t => {
    const v = Number(t.visitors || 0);
    const i = Number(t.intents || 0);
    return {
      date: t.day,
      visitors: v,
      carts: Number(t.carts || 0),
      checkouts: Number(t.checkouts || 0),
      intents: i,
      conversionRate: v > 0 ? i / v : 0,
      revenue: dailyRevMap.get(t.day) || 0
    };
  });

  // 9. Recent Intents (up to 50)
  const recentIntents = await db.prepare(`
    SELECT * FROM purchase_intents ORDER BY created_at DESC LIMIT 50
  `).all();

  // 10. Recent Abandoned (up to 50)
  const recentAbandoned = await db.prepare(`
    SELECT * FROM abandoned_carts WHERE converted_to_intent = 0 ORDER BY updated_at DESC LIMIT 50
  `).all();

  return {
    overview: {
      totalVisitors,
      totalCarts,
      cartConversionRate: cartRate,
      totalCheckouts,
      checkoutConversionRate: checkoutRate,
      totalIntents,
      overallConversionRate,
      hypotheticalRevenue,
      averageOrderValue,
      totalKamadoUnits,
      totalAbandoned,
      lostRevenue
    },
    funnel: {
      visitors: totalVisitors,
      carts: totalCarts,
      cartRate,
      cartDropoff,
      checkouts: totalCheckouts,
      checkoutRate,
      checkoutDropoff,
      intents: totalIntents,
      intentRate,
      intentDropoff
    },
    models: modelStats,
    colors,
    accessories,
    combinations,
    timeline,
    intents: recentIntents.results || [],
    abandoned: recentAbandoned.results || []
  };
}

async function exportIntentsCsv(db) {
  if (!db) return '';
  await ensureTables(db);
  const rows = await db.prepare(`SELECT * FROM purchase_intents ORDER BY created_at DESC`).all();

  const headers = [
    'ID', 'Aangemaakt Op', 'Naam', 'E-mail', 'Telefoon', 'Straat', 'Huisnummer',
    'Postcode', 'Woonplaats', 'Land', 'Betaalmethode', 'Model Formaat', 'Kleur',
    'Afwerking', 'Accessoires', 'Totaal EUR', 'Melding Verzonden'
  ];

  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const lines = [headers.join(',')];

  (rows.results || []).forEach(r => {
    let accSummary = '';
    try {
      const accList = JSON.parse(r.accessories_json || '[]');
      accSummary = accList.map(a => `${a.qty}x ${a.name}`).join('; ');
    } catch (e) {}

    lines.push([
      escapeCsv(r.id),
      escapeCsv(r.created_at),
      escapeCsv(r.name),
      escapeCsv(r.email),
      escapeCsv(r.phone),
      escapeCsv(r.street),
      escapeCsv(r.house_number),
      escapeCsv(r.postal_code),
      escapeCsv(r.city),
      escapeCsv(r.country),
      escapeCsv(r.payment_method_intent),
      escapeCsv(r.size_inch ? `${r.size_inch} inch` : ''),
      escapeCsv(r.color_name),
      escapeCsv(r.texture),
      escapeCsv(accSummary),
      escapeCsv(r.total_amount_eur),
      escapeCsv(r.notification_sent ? 'Ja' : 'Nee')
    ].join(','));
  });

  return lines.join('\r\n');
}

module.exports = {
  trackEvent,
  updateCart,
  recordPurchaseIntent,
  getMarketStats,
  exportIntentsCsv
};
