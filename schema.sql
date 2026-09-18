-- SmokeyKamado Netherlands Market Demand Test Database Schema

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

CREATE TABLE IF NOT EXISTS market_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload_json TEXT,
  created_at TEXT NOT NULL
);

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
  shipping_amount_eur REAL NOT NULL DEFAULT 0,
  total_amount_eur REAL NOT NULL DEFAULT 0,
  payment_method_intent TEXT,
  notification_sent INTEGER DEFAULT 0,
  notification_error TEXT
);

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

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS product_media (placement TEXT PRIMARY KEY, videos_json TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1);
