-- KundiKamado Netherlands Market Demand Test Database Schema

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  model_code TEXT,
  badge_nl TEXT,
  price_eur INTEGER NOT NULL,
  orig_price_eur INTEGER,
  body_dia TEXT,
  grate_nl TEXT,
  people_nl TEXT,
  weight_net TEXT,
  weight_gross TEXT,
  assembled_size TEXT,
  desc_nl TEXT,
  image_key TEXT,
  featured INTEGER DEFAULT 0,
  stock_status TEXT DEFAULT 'in_stock',
  display_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS accessories (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  name_nl TEXT NOT NULL,
  price_eur INTEGER NOT NULL,
  is_size_dependent INTEGER DEFAULT 0,
  size_prices_json TEXT, -- e.g. {"18":39,"21":45,"23":49,"27":59}
  desc_nl TEXT,
  image_key TEXT,
  display_order INTEGER DEFAULT 0
);

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

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- SEED PRODUCTS (EUR Kamado pricing)
INSERT OR REPLACE INTO products (
  id, name, model_code, badge_nl, price_eur, orig_price_eur,
  body_dia, grate_nl, people_nl, weight_net, weight_gross, assembled_size,
  desc_nl, image_key, featured, stock_status, display_order
) VALUES
(
  '18', 'KundiKamado 18″', 'AU-18OR', 'Compact & Familie',
  699, 898,
  '45.0 cm (17.7″)', '38.5 cm (15.1″)', '2–4 personen',
  '59.5 kg', '69.0 kg', '118 × 65 × 116.5 cm',
  'Compacte Mullite keramische kamado van topklasse. Compleet All-Inclusive pakket met Air Hinge veerscharnier, multi-level Divide & Conquer kooksysteem, gietijzeren rooster, handige aslade, rookhout-inlaat en weersbestendige beschermhoes.',
  'images/kamado_18_front.jpg,images/kamado_divide_open.jpg,images/kamado_detail_vent.jpg,images/kamado_detail_hinge.jpg,images/kamado_bbq_lifestyle.jpg',
  0, 'in_stock', 1
),
(
  '21', 'KundiKamado 21″', 'AU-21OR', 'Veelzijdig & Familie+',
  889, 1108,
  '53.6 cm (21.1″)', '47.5 cm (18.7″)', '4–6 personen',
  '75.0 kg', '85.0 kg', '129.6 × 73 × 125.9 cm',
  'Het ideale allround formaat! Royaal kookoppervlak voor familie en vrienden, inclusief compleet multi-level kooksysteem, gietijzeren halve maan roosters en luxe afwerking.',
  'images/kamado_21_front.jpg,images/kamado_divide_open.jpg,images/kamado_detail_vent.jpg,images/kamado_detail_hinge.jpg,images/kamado_bbq_lifestyle.jpg',
  0, 'in_stock', 2
),
(
  '23', 'KundiKamado 23″', 'AU-23OR', '🔥 Bestseller / Meest Gekozen',
  1019, 1178,
  '59.5 cm (23.5″)', '52.3 cm (20.6″)', '4–8 personen (Ideaal)',
  '89.0 kg', '99.0 kg', '136 × 80 × 126.8 cm',
  'De populairste kamado maat van Nederland! Uitstekende capaciteit voor meerdere hele kippen, ribs, briskets of pizza tegelijk. Volledig All-Inclusive geleverd met onderstel en zijtafels.',
  'images/kamado_23_front.jpg,images/kamado_divide_open.jpg,images/kamado_detail_vent.jpg,images/kamado_detail_hinge.jpg,images/kamado_bbq_lifestyle.jpg',
  1, 'in_stock', 3
),
(
  '27', 'KundiKamado 27″', 'AU-27OR', 'Reus / HoReCa & Heavy Duty',
  1319, 1410,
  '67.7 cm (26.6″)', '57.5 cm (22.6″)', '6–12+ personen',
  '94.6 kg', '105.0 kg', '144.7 × 89 × 131 cm',
  'Enorme capaciteit voor grote gezelschappen, feesten en horecagebruik. 57.5 cm rvs kookrooster, geavanceerde dubbele ventilatieschuif en gewichtsloze dekselopening.',
  'images/kamado_27_front.jpg,images/kamado_divide_open.jpg,images/kamado_detail_vent.jpg,images/kamado_detail_hinge.jpg,images/kamado_bbq_lifestyle.jpg',
  0, 'in_stock', 4
);

-- SEED ACCESSORIES WITH SIZE-DEPENDENT MATRIX
INSERT OR REPLACE INTO accessories (
  id, category, name_nl, price_eur, is_size_dependent, size_prices_json, desc_nl, image_key, display_order
) VALUES
(
  'cover', 'protection',
  'Premium All-Weather Beschermhoes',
  49, 1, '{"18":39,"21":45,"23":49,"27":59}',
  'Zware kwaliteit waterdichte en UV-bestendige hoes, op maat gemaakt voor het gekozen formaat kamado.',
  'images/cover.webp', 1
),
(
  'rotisserie', 'tools',
  'Draaispit / Rotisserie met motor (230V / Batterij)',
  159, 1, '{"18":139,"21":159,"23":159,"27":189}',
  'Spitring met krachtige motor voor gelijkmatige rotatie en ultiem malse, sappige braadstukken en gevogelte.',
  'images/rotisserie.webp', 2
),
(
  'cast-iron-halfmoon', 'cooking',
  'Gietijzeren Halve Maan Rooster & Plancha',
  69, 1, '{"18":49,"21":59,"23":69,"27":79}',
  'Tweezijdig bruikbaar: één geribbelde zijde voor steaks en grillstrepen, één vlakke bakplaat voor burgers, vis en groenten.',
  'images/divide.webp', 3
),
(
  'pizza-stone', 'cooking',
  'Cordieriet Pizzasteen (Extra Dik)',
  69, 1, '{"18":49,"21":59,"23":69,"27":79}',
  'Bestand tegen extreme hitte tot 400°C voor de perfecte krokante Napolitaanse pizzabodem en versgebakken desembrood.',
  'images/pizza.webp', 4
),
(
  'electric-starter', 'tools',
  'Elektrische Houtskoolaansteker (2000W, CE)',
  59, 0, NULL,
  'Binnen 60-90 seconden gloeiende kolen met hete lucht, zonder chemicaliën of aanmaakblokjes.',
  'images/heat.webp', 5
),
(
  'bbq-gloves', 'protection',
  'Hittebestendige Siliconen BBQ Handschoenen (350°C)',
  32, 0, NULL,
  'Optimale bescherming tot 350°C met antislip grip voor het veilig verplaatsen van hete roosters en pannen.',
  'images/cover.webp', 6
),
(
  'meat-claws', 'tools',
  'Pulled Pork Vleesklauwen Set',
  16, 0, NULL,
  'Voedselveilig en oersterk hulpmiddel om pulled pork, kip of beef in seconden moeiteloos uit elkaar te trekken.',
  'images/ash.webp', 7
),
(
  'grid-clip', 'tools',
  'RVS Roostertang & Lifter',
  14, 0, NULL,
  'Stevige tang om hete grillroosters en gietijzeren onderdelen veilig uit de kamado te tillen.',
  'images/cast-iron.webp', 8
),
(
  'ash-collector-kit', 'tools',
  'RVS Aslade & Schraper Set',
  22, 0, NULL,
  'Sluit perfect aan op de onderste luchtschuif voor schoon en stofvrij verwijderen van as.',
  'images/ash.webp', 9
);

-- SETTINGS
INSERT OR REPLACE INTO site_settings (key, value) VALUES
('brand_name', 'KundiKamado Nederland'),
('contact_email', 'info@kundikamado.hu'),
('support_phone', '+31 (0)20 890 5321'),
('free_shipping_min', '0'),
('promo_banner_nl', '🇳🇱 Tijdelijke introductie in Nederland: All-Inclusive Premium Pakket + Gratis Palletlevering');

