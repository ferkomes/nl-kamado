async function getInventory(db) {
  if (!db) throw new Error('Inventory database unavailable');
  await db.prepare('CREATE TABLE IF NOT EXISTS product_inventory (model_key TEXT NOT NULL, color TEXT NOT NULL, quantity INTEGER NOT NULL CHECK(quantity >= 0), PRIMARY KEY(model_key, color))').run();
  const placeholders = [], bindings = [];
  for (const [key, colors] of Object.entries(INVENTORY_SEED.stock)) {
    for (const [color, qty] of Object.entries(colors)) { placeholders.push('(?, ?, ?)'); bindings.push(key, color, qty); }
  }
  // Initial import only. Later admin edits, including zero, are never overwritten.
  await db.prepare('INSERT OR IGNORE INTO product_inventory (model_key, color, quantity) VALUES ' + placeholders.join(',')).bind(...bindings).run();
  const rows = await db.prepare('SELECT model_key, color, quantity FROM product_inventory').all();
  const stock = {};
  for (const row of rows.results) (stock[row.model_key] ||= {})[row.color] = row.quantity;
  return { colors: INVENTORY_SEED.colors, stock };
}

async function updateInventory(db, change) {
  if (!Object.prototype.hasOwnProperty.call(INVENTORY_SEED.stock, change.modelKey || '') ||
      !Object.prototype.hasOwnProperty.call(INVENTORY_SEED.stock[change.modelKey], change.color || '') ||
      !Number.isInteger(change.quantity) || change.quantity < 0 || change.quantity > 100000) {
    throw new Error('Invalid model, colour or quantity');
  }
  await getInventory(db);
  const result = await db.prepare('UPDATE product_inventory SET quantity = ? WHERE model_key = ? AND color = ? AND quantity = ?')
    .bind(change.quantity, change.modelKey, change.color, change.previousQuantity).run();
  if (!result.meta.changes) return { ok: false, conflict: true };
  return { ok: true };
}
