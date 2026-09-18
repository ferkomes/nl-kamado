/**
 * Market Test Tracking, D1 Database Storage, and Metrics Aggregator
 */

const { sendPurchaseIntentNotification } = require('./email-service.js');

async function ensureTables(db) {
  if (!db) return;
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS market_sessions (
      session_id TEXT PRIMARY KEY,
      ip_hash TEXT,
      user_agent TEXT,
      referer TEXT,
      source TEXT,
      landing_page TEXT,
      initial_color TEXT,
      final_color TEXT,
      created_at TEXT NOT NULL,
      last_active_at TEXT NOT NULL,
      reached_cart INTEGER DEFAULT 0,
      reached_checkout INTEGER DEFAULT 0,
      reached_contact INTEGER DEFAULT 0,
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
      name TEXT,
      phone TEXT,
      postal_code TEXT,
      city TEXT,
      country TEXT DEFAULT 'NL',
      source TEXT DEFAULT 'Direct',
      landing_page TEXT,
      initial_color TEXT,
      final_color TEXT,
      model_name TEXT NOT NULL,
      size_inch TEXT NOT NULL,
      items_json TEXT NOT NULL,
      accessories_json TEXT,
      kamado_price_eur REAL NOT NULL DEFAULT 0,
      accessories_price_eur REAL NOT NULL DEFAULT 0,
      total_amount_eur REAL NOT NULL DEFAULT 0,
      payment_method_intent TEXT,
      notification_sent INTEGER DEFAULT 0,
      notification_error TEXT
    );
  `).run();

  const columns = await db.prepare('PRAGMA table_info(purchase_intents)').all();
  if (!columns.results.some(column => column.name === 'shipping_amount_eur')) {
    try { await db.prepare('ALTER TABLE purchase_intents ADD COLUMN shipping_amount_eur REAL NOT NULL DEFAULT 0').run(); }
    catch (error) {
      const updated = await db.prepare('PRAGMA table_info(purchase_intents)').all();
      if (!updated.results.some(column => column.name === 'shipping_amount_eur')) throw error;
    }
  }

  await db.prepare(`
    CREATE TABLE IF NOT EXISTS abandoned_carts (
      session_id TEXT PRIMARY KEY,
      updated_at TEXT NOT NULL,
      email TEXT,
      name TEXT,
      postal_code TEXT,
      city TEXT,
      source TEXT,
      items_json TEXT NOT NULL,
      total_amount_eur REAL NOT NULL,
      last_step TEXT NOT NULL DEFAULT 'cart',
      converted_to_intent INTEGER DEFAULT 0
    );
  `).run();
}

function detectTrafficSource(referer, urlParams = {}) {
  const utmSource = urlParams.utm_source;
  if (utmSource) {
    const med = urlParams.utm_medium ? ` / ${urlParams.utm_medium}` : '';
    return `${utmSource}${med}`;
  }
  if (!referer) return 'Direct';
  try {
    const refHost = new URL(referer).hostname.toLowerCase();
    if (refHost.includes('google')) return 'Google Search';
    if (refHost.includes('facebook') || refHost.includes('fb.me') || refHost.includes('meta')) return 'Facebook Ad';
    if (refHost.includes('instagram')) return 'Instagram';
    if (refHost.includes('tiktok')) return 'TikTok';
    if (refHost.includes('linkedin')) return 'LinkedIn';
    return refHost.replace('www.', '');
  } catch (e) {
    return referer.substring(0, 30);
  }
}

async function trackEvent(db, { sessionId, eventType, payload = {}, ip = '', userAgent = '', referer = '' }) {
  if (!db || !sessionId) return;
  await ensureTables(db);
  const now = new Date().toISOString();

  const source = payload.source || detectTrafficSource(referer, payload.urlParams || {});
  const landingPage = payload.landingPage || payload.path || '/';
  const initialColor = payload.initialColor || payload.color || null;
  const finalColor = payload.finalColor || payload.color || initialColor || null;

  const reachedCart = eventType === 'add_to_cart' ? 1 : 0;
  const reachedCheckout = eventType === 'checkout_start' ? 1 : 0;
  const reachedContact = eventType === 'contact_complete' ? 1 : 0;
  const reachedIntent = eventType === 'purchase_intent' ? 1 : 0;

  await db.prepare(`
    INSERT INTO market_sessions (
      session_id, ip_hash, user_agent, referer, source, landing_page,
      initial_color, final_color, created_at, last_active_at,
      reached_cart, reached_checkout, reached_contact, reached_intent
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?
    )
    ON CONFLICT(session_id) DO UPDATE SET
      last_active_at = excluded.last_active_at,
      final_color = COALESCE(excluded.final_color, market_sessions.final_color),
      reached_cart = MAX(market_sessions.reached_cart, excluded.reached_cart),
      reached_checkout = MAX(market_sessions.reached_checkout, excluded.reached_checkout),
      reached_contact = MAX(market_sessions.reached_contact, excluded.reached_contact),
      reached_intent = MAX(market_sessions.reached_intent, excluded.reached_intent)
  `).bind(
    sessionId ?? null, ip ?? null, userAgent ?? null, referer ?? null, source ?? "Direct", landingPage ?? "/",
    initialColor ?? null, finalColor ?? null, now, now,
    reachedCart ?? 0, reachedCheckout ?? 0, reachedContact ?? 0, reachedIntent ?? 0
  ).run();

  await db.prepare(`
    INSERT INTO market_events (session_id, event_type, payload_json, created_at)
    VALUES (?, ?, ?, ?)
  `).bind(sessionId, eventType, JSON.stringify(payload), now).run();
}

async function updateCart(db, { sessionId, items = [], totalAmount = 0, lastStep = 'cart', email = null, name = null, postalCode = null, city = null, source = null }) {
  if (!db || !sessionId) return;
  await ensureTables(db);
  const now = new Date().toISOString();

  const isCheckout = lastStep === 'checkout';
  const isContact = Boolean(email && email.includes('@'));
  if (items.length) {
    await trackEvent(db, { sessionId, eventType: 'add_to_cart', payload: { source } });
  }

  await db.prepare(`
    UPDATE market_sessions
    SET last_active_at = ?,
        reached_cart = CASE WHEN ? = 1 THEN 1 ELSE reached_cart END,
        reached_checkout = CASE WHEN ? = 1 THEN 1 ELSE reached_checkout END,
        reached_contact = CASE WHEN ? = 1 THEN 1 ELSE reached_contact END
    WHERE session_id = ?
  `).bind(now, items.length ? 1 : 0, isCheckout ? 1 : 0, isContact ? 1 : 0, sessionId).run();

  if (!items.length) {
    await db.prepare('DELETE FROM abandoned_carts WHERE session_id = ? AND converted_to_intent = 0').bind(sessionId).run();
  }
  if (items && items.length > 0) {
    await db.prepare(`
      INSERT INTO abandoned_carts (
        session_id, updated_at, email, name, postal_code, city, source, items_json, total_amount_eur, last_step, converted_to_intent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      ON CONFLICT(session_id) DO UPDATE SET
        updated_at = excluded.updated_at,
        email = COALESCE(excluded.email, abandoned_carts.email),
        name = COALESCE(excluded.name, abandoned_carts.name),
        postal_code = COALESCE(excluded.postal_code, abandoned_carts.postal_code),
        city = COALESCE(excluded.city, abandoned_carts.city),
        source = COALESCE(excluded.source, abandoned_carts.source),
        items_json = excluded.items_json,
        total_amount_eur = excluded.total_amount_eur,
        last_step = excluded.last_step
      WHERE abandoned_carts.converted_to_intent = 0
    `).bind(sessionId ?? null, now, email ?? null, name ?? null, postalCode ?? null, city ?? null, source ?? null, JSON.stringify(items || []), Number(totalAmount) || 0, lastStep || "cart").run();
  }
}

async function recordPurchaseIntent(env, intentData) {
  const db = env.DB;
  if (!db) throw new Error('Database binding DB is missing');
  await ensureTables(db);

  const now = new Date().toISOString();

  const cust = intentData.customer || {};
  const items = intentData.items || [];
  if (typeof intentData.sessionId !== 'string' || !intentData.sessionId || intentData.sessionId.length > 200 ||
      typeof cust.email !== 'string' || cust.email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(cust.email) ||
      !Array.isArray(items) || !items.length || items.length > 100 ||
      items.some(i => !i || !['kamado', 'accessory'].includes(i.type) ||
        typeof i.name !== 'string' || i.name.length > 300 ||
        !Number.isFinite(i.price) || i.price <= 0 || i.price > 10000 ||
        !Number.isInteger(i.qty) || i.qty < 1 || i.qty > 100) ||
      items.filter(i => i.type === 'kamado').length > 1) {
    throw new Error('Ongeldige contactgegevens of winkelwagen.');
  }
  // Validate live availability at submission, including carts saved before a stock edit.
  for (const item of items.filter(i => i.type === 'kamado')) {
    const key = item.modelKey || String(item.id || '').replace(/^kamado_/, '');
    if (Object.prototype.hasOwnProperty.call(INVENTORY_SEED.stock, key)) {
      item.price = PRODUCT_PAGES['/kamados/' + key.replace('_', '-')].price;
      const available = await getInventory(db);
      const total = Object.values(available.stock[key] || {}).reduce((sum, qty) => sum + qty, 0);
      if (total < item.qty) throw new Error('Dit model is niet meer beschikbaar. Kies een ander model.');
    } else {
      // Legacy clients without a catalog key still need a known model, not an arbitrary size.
      const legacyKey = String(item.sizeInch || intentData.sizeInch || '');
      const legacyModel = legacyKey === '18' ? (/basic/i.test(item.name) ? '18_basic' : '18_premium') : legacyKey;
      if (!Object.prototype.hasOwnProperty.call(INVENTORY_SEED.stock, legacyModel)) throw new Error('Onbekend model.');
      item.price = PRODUCT_PAGES['/kamados/' + legacyModel.replace('_', '-')].price;
      const available = await getInventory(db);
      if (Object.values(available.stock[legacyModel] || {}).reduce((sum, qty) => sum + qty, 0) < item.qty) throw new Error('Dit model is niet meer beschikbaar.');
    }
  }
  const accessories = items.filter(i => i.type === 'accessory');
  // Same session, customer and basket represent the same intent, including retries.
  const fingerprint = JSON.stringify([intentData.sessionId, cust.email.trim().toLowerCase(), items]);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(fingerprint));
  const intentId = 'intent_' + Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');

  // Find Kamado & separate prices
  const kamadoItem = items.find(i => i.type === 'kamado') || {};
  const kamadoPrice = (kamadoItem.price || 0) * (kamadoItem.qty || 1);
  const accPrice = accessories.reduce((sum, a) => sum + (a.price || 0) * (a.qty || 1), 0);
  const shippingPrice = shippingAmount(items);
  const totalAmount = Math.round((kamadoPrice + accPrice + shippingPrice) * 100) / 100;

  const modelName = kamadoItem.name || 'Accessories only';
  const sizeInch = String(kamadoItem.name ? (kamadoItem.sizeInch || intentData.sizeInch || '') : '');
  const initialColor = intentData.initialColor || intentData.colorName || 'Black';
  const finalColor = kamadoItem.name ? (kamadoItem.colorName || intentData.finalColor || intentData.colorName || 'Black') : '';
  const source = intentData.source || 'Direct';
  const landingPage = intentData.landingPage || '/';

  // Extract postal region (first 4 digits or prefix)
  const postalCode = (cust.postalCode || '').trim();
  const city = (cust.city || '').trim();

  // 1. Insert into purchase_intents
  const inserted = await db.prepare(`
    INSERT OR IGNORE INTO purchase_intents (
      id, session_id, created_at, email, name, phone,
      postal_code, city, country, source, landing_page,
      initial_color, final_color, model_name, size_inch,
      items_json, accessories_json,
      kamado_price_eur, accessories_price_eur, total_amount_eur, shipping_amount_eur,
      payment_method_intent, notification_sent
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?,
      ?, ?, ?, ?,
      ?, 0
    )
  `).bind(
    intentId,
    intentData.sessionId,
    now,
    cust.email || intentData.email || '',
    cust.name || '',
    cust.phone || '',
    postalCode,
    city,
    'NL',
    source,
    landingPage,
    initialColor,
    finalColor,
    modelName,
    sizeInch,
    JSON.stringify(items),
    JSON.stringify(accessories),
    kamadoPrice,
    accPrice,
    totalAmount,
    shippingPrice,
    intentData.paymentMethod || 'ideal'
  ).run();

  if (!inserted.meta.changes) return { ok: true, intentId, duplicate: true };

  // Checkout remains countable even if page-view telemetry failed or arrived later.
  await trackEvent(db, {
    sessionId: intentData.sessionId,
    eventType: 'purchase_intent',
    payload: { source, landingPage, initialColor, finalColor }
  });

  // 2. Update session
  await db.prepare(`
    UPDATE market_sessions
    SET reached_cart = 1,
        reached_checkout = 1,
        reached_contact = 1,
        reached_intent = 1,
        final_color = ?,
        last_active_at = ?
    WHERE session_id = ?
  `).bind(finalColor, now, intentData.sessionId).run();

  // 3. Mark abandoned cart converted
  await db.prepare(`
    UPDATE abandoned_carts
    SET converted_to_intent = 1,
        email = ?,
        name = ?,
        postal_code = ?,
        city = ?
    WHERE session_id = ?
  `).bind(cust.email || '', cust.name || '', postalCode, city, intentData.sessionId).run();

  // 4. Send email notification asynchronously
  try {
    const notifyResult = await sendPurchaseIntentNotification(env, {
      shippingAmountEur: shippingPrice,
      id: intentId,
      sessionId: intentData.sessionId,
      paymentMethod: intentData.paymentMethod,
      modelName,
      sizeInch,
      finalColor,
      initialColor,
      accessories,
      kamadoPriceEur: kamadoPrice,
      accessoriesPriceEur: accPrice,
      totalAmountEur: totalAmount,
      customer: cust,
      source,
      landingPage
    });
    if (!notifyResult.success) {
      await db.prepare('UPDATE purchase_intents SET notification_error = ? WHERE id = ?')
        .bind(notifyResult.error || 'MAIL_SEND_FAILED', intentId).run();
    }
    if (notifyResult.success) {
      await db.prepare(`UPDATE purchase_intents SET notification_sent = 1 WHERE id = ?`).bind(intentId).run();
    }
  } catch (err) {
    console.error('Failed to notify owner:', err);
    await db.prepare(`UPDATE purchase_intents SET notification_error = ? WHERE id = ?`).bind(err.message, intentId).run();
  }

  return { ok: true, intentId };
}

async function getMarketStats(db) {
  if (!db) throw new Error('Database binding DB is missing');
  await ensureTables(db);

  // 1. Funnel counts from market_sessions
  const sessionRow = await db.prepare(`
    SELECT
      COUNT(*) AS total_visitors,
      SUM(CASE WHEN reached_cart = 1 THEN 1 ELSE 0 END) AS total_carts,
      SUM(CASE WHEN reached_checkout = 1 THEN 1 ELSE 0 END) AS total_checkouts,
      SUM(CASE WHEN reached_contact = 1 THEN 1 ELSE 0 END) AS total_contacts,
      SUM(CASE WHEN reached_intent = 1 THEN 1 ELSE 0 END) AS total_intents
    FROM market_sessions
  `).first() || {};

  const visitors = Number(sessionRow.total_visitors || 0);
  const addToCart = Number(sessionRow.total_carts || 0);
  const checkouts = Number(sessionRow.total_checkouts || 0);
  const contacts = Number(sessionRow.total_contacts || 0);
  const purchaseIntents = Number(sessionRow.total_intents || 0);
  const conversionPct = visitors > 0 ? (purchaseIntents / visitors) : 0;

  // 2. Revenue & AOV
  const revRow = await db.prepare(`
    SELECT
      COUNT(*) AS intent_count,
      COALESCE(SUM(total_amount_eur), 0) AS potential_revenue,
      COALESCE(SUM(kamado_price_eur), 0) AS kamado_revenue,
      COALESCE(SUM(accessories_price_eur), 0) AS accessories_revenue
    FROM purchase_intents
  `).first() || {};

  const potentialRevenue = Number(revRow.potential_revenue || 0);
  const intentCount = Number(revRow.intent_count || 0);
  const aov = intentCount > 0 ? (potentialRevenue / intentCount) : 0;

  // 3. Models breakdown (18 Basic / 18 Premium / 21 / 23 / 27)
  const targetModels = [
    { key: '18_basic', name: '18″ Basic', size: '18', price: 549, count: 0, share: 0 },
    { key: '18_premium', name: '18″ Premium', size: '18', price: 799, count: 0, share: 0 },
    { key: '21', name: '21″ Veelzijdig', size: '21', price: 949, count: 0, share: 0 },
    { key: '23', name: '23″ Bestseller', size: '23', price: 1049, count: 0, share: 0 },
    { key: '27', name: '27″ HoReCa Reus', size: '27', price: 1199, count: 0, share: 0 }
  ];

  const allIntentsRows = await db.prepare(`SELECT * FROM purchase_intents ORDER BY created_at DESC`).all();
  const intentsList = allIntentsRows.results || [];

  intentsList.forEach(row => {
    const mName = (row.model_name || '').toLowerCase();
    const sz = String(row.size_inch || '');
    let found = null;
    if (sz === '18' && mName.includes('basic')) found = targetModels[0];
    else if (sz === '18') found = targetModels[1];
    else if (sz === '21') found = targetModels[2];
    else if (sz === '23') found = targetModels[3];
    else if (sz === '27') found = targetModels[4];

    if (found) found.count += 1;
  });

  const totalKamados = targetModels.reduce((sum, model) => sum + model.count, 0);
  targetModels.forEach(m => {
    m.share = totalKamados > 0 ? (m.count / totalKamados) : 0;
  });

  // 4. Colors breakdown (Black / Burgundy / Blue / Green / Orange / Beige / Yellow)
  const targetColors = [
    { key: 'Black', name: 'Black (Onyx Zwart)', hex: '#171717', count: 0, share: 0 },
    { key: 'Burgundy', name: 'Burgundy (Bordeaux Rood)', hex: '#781d2e', count: 0, share: 0 },
    { key: 'Blue', name: 'Blue (Marine Blauw)', hex: '#1b3f75', count: 0, share: 0 },
    { key: 'Green', name: 'Green (Bosgroen)', hex: '#235338', count: 0, share: 0 },
    { key: 'Orange', name: 'Orange (Smokey Oranje)', hex: '#df5417', count: 0, share: 0 },
    { key: 'Beige', name: 'Beige (Zand Beige)', hex: '#d6cbb6', count: 0, share: 0 },
    { key: 'Yellow', name: 'Yellow (Warm Okergeel)', hex: '#dca326', count: 0, share: 0 }
  ];

  intentsList.forEach(row => {
    const col = (row.final_color || row.initial_color || '').toLowerCase();
    if (!row.size_inch) return;
    const match = targetColors.find(c => col.includes(c.key.toLowerCase()) || col.includes(c.name.toLowerCase()));
    if (match) match.count += 1;
  });

  targetColors.forEach(c => {
    c.share = totalKamados > 0 ? (c.count / totalKamados) : 0;
  });

  // 5. Accessories breakdown (with size where applicable)
  const accStatsMap = new Map();
  intentsList.forEach(row => {
    try {
      const accList = JSON.parse(row.accessories_json || '[]');
      accList.forEach(a => {
        const itemKey = a.sizeInch ? `${a.name} (${a.sizeInch}″)` : a.name;
        const curr = accStatsMap.get(itemKey) || { name: itemKey, count: 0, revenue: 0 };
        curr.count += (a.qty || 1);
        curr.revenue += (a.price || 0) * (a.qty || 1);
        accStatsMap.set(itemKey, curr);
      });
    } catch (e) {}
  });

  const accessoriesStats = Array.from(accStatsMap.values()).map(a => ({
    ...a,
    attachRate: totalKamados > 0 ? (a.count / totalKamados) : 0
  })).sort((a, b) => b.count - a.count);

  // 6. Concrete Configurations Matrix
  // e.g. "23 Premium + Blue + Rotisserie + Pizza Stone — 14 db"
  const combMap = new Map();
  intentsList.forEach(row => {
    try {
      const items = JSON.parse(row.items_json || '[]');
      const kamado = items.find(i => i.type === 'kamado') || {};
      const modelLabel = kamado.name || `${row.size_inch}″ Premium`;
      const colorLabel = row.final_color || kamado.colorName || 'Black';
      const accLabels = (items.filter(i => i.type === 'accessory').map(i => i.name)).sort().join(' + ');

      const combKey = `${modelLabel} + ${colorLabel}` + (accLabels ? ` + ${accLabels}` : '');
      const curr = combMap.get(combKey) || { description: combKey, count: 0, totalValue: 0 };
      curr.count += 1;
      curr.totalValue += (row.total_amount_eur || 0);
      combMap.set(combKey, curr);
    } catch (e) {}
  });

  const configurations = Array.from(combMap.values()).sort((a, b) => b.count - a.count);

  // 7. Abandoned carts
  const abandonedRows = await db.prepare(`
    SELECT * FROM abandoned_carts WHERE converted_to_intent = 0 ORDER BY updated_at DESC LIMIT 50
  `).all();

  return {
    // 6 Big Numbers at the top:
    kpis: {
      visitors,
      addToCart,
      checkout: checkouts,
      purchaseIntent: purchaseIntents,
      conversionPct,
      potentialRevenue
    },
    // Detailed sections:
    models: targetModels,
    colors: targetColors,
    accessories: accessoriesStats,
    configurations,
    intents: intentsList,
    abandoned: abandonedRows.results || []
  };
}

async function exportIntentsCsv(db) {
  if (!db) return '';
  await ensureTables(db);
  const rows = await db.prepare(`SELECT * FROM purchase_intents ORDER BY created_at DESC`).all();

  const headers = [
    'Datum', 'Model', 'Kleur', 'Accessoires', 'Kamado Prijs EUR', 'Accessoires Prijs EUR',
    'Verzending EUR', 'Totaal EUR', 'Email', 'Naam', 'Telefoon', 'Regio', 'Bron (Source)', 'Landing Page'
  ];

  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const value = String(val);
    const safeValue = /^[\s]*[=+@-]/.test(value) ? "'" + value : value;
    return `"${safeValue.replace(/"/g, '""')}"`;
  };

  const lines = [headers.join(',')];

  (rows.results || []).forEach(r => {
    let accStr = '';
    try {
      const accList = JSON.parse(r.accessories_json || '[]');
      accStr = accList.map(a => `${a.name} ×${a.qty || 1}`).join('; ');
    } catch (e) {}

    lines.push([
      escapeCsv(r.created_at?.substring(0, 16).replace('T', ' ')),
      escapeCsv(r.model_name),
      escapeCsv(r.final_color || r.color_name),
      escapeCsv(accStr),
      escapeCsv(r.kamado_price_eur),
      escapeCsv(r.accessories_price_eur),
      escapeCsv(r.shipping_amount_eur),
      escapeCsv(r.total_amount_eur),
      escapeCsv(r.email),
      escapeCsv(r.name),
      escapeCsv(r.phone),
      escapeCsv(`${r.postal_code || ''} ${r.city || ''}`.trim()),
      escapeCsv(r.source),
      escapeCsv(r.landing_page)
    ].join(','));
  });

  return lines.join('\r\n');
}


async function deletePurchaseIntent(db, intentId) {
  if (!db || !intentId) return { ok: false, error: "Missing database or intentId" };
  await ensureTables(db);

  // Retrieve intent details before deletion to update sessions if needed
  const intentRow = await db.prepare("SELECT session_id, total_amount_eur FROM purchase_intents WHERE id = ?").bind(intentId).first();
  
  if (intentRow && intentRow.session_id) {
    const otherIntents = await db.prepare("SELECT COUNT(*) as c FROM purchase_intents WHERE session_id = ? AND id != ?").bind(intentRow.session_id, intentId).first();
    if (!otherIntents || otherIntents.c === 0) {
      // No remaining intents for this session, revert reached_intent flag
      await db.prepare("UPDATE market_sessions SET reached_intent = 0 WHERE session_id = ?").bind(intentRow.session_id).run();
      await db.prepare("UPDATE abandoned_carts SET converted_to_intent = 0 WHERE session_id = ?").bind(intentRow.session_id).run();
    }
  }

  await db.prepare("DELETE FROM purchase_intents WHERE id = ?").bind(intentId).run();
  return { ok: true, deletedId: intentId };
}

module.exports = {
  trackEvent,
  updateCart,
  recordPurchaseIntent,
  getMarketStats,
  exportIntentsCsv,
  deletePurchaseIntent
};
