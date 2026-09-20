-- Barka Nour - Donation, Kiwi & Reward System Migration
-- Extends 001_initial_schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Donations
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_number TEXT NOT NULL UNIQUE,
  donor_name TEXT NOT NULL,
  donor_phone TEXT NOT NULL,
  donor_email TEXT,
  governorate TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  method TEXT NOT NULL CHECK (method IN ('depot','collecte')),
  category TEXT CHECK (category IN ('Bébé','Fille','Garçon','Femme','Homme','Mixte','Autre')),
  age_range TEXT CHECK (age_range IN ('0–2 ans','3–5 ans','6–8 ans','9–12 ans','13–16 ans','Adulte','Autre')),
  clothing_types JSONB DEFAULT '[]'::jsonb,
  approximate_pieces INT,
  description TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  collection_date DATE,
  collection_time TEXT,
  collection_fee DECIMAL(10,3),
  collection_approved BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','under_review','collection_requested','collection_scheduled','received','sorting','evaluated','accepted','partially_accepted','rejected','kiwi_validated','completed','cancelled')),
  pieces_declared INT,
  pieces_received INT,
  pieces_accepted INT,
  pieces_rejected INT,
  kiwi_total INT,
  donor_id UUID,
  idempotency_key TEXT UNIQUE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_donations_number ON donations(donation_number);
CREATE INDEX idx_donations_phone ON donations(donor_phone);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created ON donations(created_at DESC);

-- Donation status history
CREATE TABLE donation_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_donation_status_donation ON donation_status_history(donation_id);

-- Donation lot evaluations - default efficient
CREATE TABLE donation_lot_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
  condition TEXT NOT NULL CHECK (condition IN ('Excellent','Très bon état','Bon état','Non accepté')),
  standard_qty INT NOT NULL DEFAULT 0 CHECK (standard_qty >= 0),
  good_qty INT NOT NULL DEFAULT 0 CHECK (good_qty >= 0),
  premium_qty INT NOT NULL DEFAULT 0 CHECK (premium_qty >= 0),
  rejected_qty INT NOT NULL DEFAULT 0 CHECK (rejected_qty >= 0),
  breakdown JSONB DEFAULT '[]'::jsonb,
  total_kiwi INT NOT NULL,
  evaluated_by UUID,
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT
);
CREATE INDEX idx_lot_eval_donation ON donation_lot_evaluations(donation_id);

-- Donation individual items - optional
CREATE TABLE donation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
  clothing_type TEXT NOT NULL,
  category TEXT,
  age_range TEXT,
  condition TEXT NOT NULL,
  quality TEXT NOT NULL CHECK (quality IN ('Standard','Bonne','Premium')),
  defect TEXT NOT NULL,
  kiwi_value INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','converted_to_product','converted_to_pack')),
  converted_product_id UUID,
  converted_pack_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_donation_items_donation ON donation_items(donation_id);

-- Kiwi accounts - by phone
CREATE TABLE kiwi_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id TEXT NOT NULL,
  donor_phone TEXT NOT NULL UNIQUE,
  balance INT NOT NULL DEFAULT 0 CHECK (balance >= 0),
  total_earned INT NOT NULL DEFAULT 0,
  total_used INT NOT NULL DEFAULT 0,
  total_renounced INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_kiwi_phone ON kiwi_accounts(donor_phone);

-- Kiwi transactions ledger - traceability
CREATE TABLE kiwi_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id TEXT NOT NULL,
  donation_id UUID REFERENCES donations(id) ON DELETE SET NULL,
  reward_redemption_id UUID,
  type TEXT NOT NULL CHECK (type IN ('donation_reward','reward_redemption','kiwi_adjustment','kiwi_cancellation','voluntary_renunciation','administrative_correction')),
  amount INT NOT NULL,
  balance_before INT NOT NULL,
  balance_after INT NOT NULL,
  reason TEXT NOT NULL,
  admin_id TEXT,
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_kiwi_txn_donor ON kiwi_transactions(donor_id);
CREATE INDEX idx_kiwi_txn_donation ON kiwi_transactions(donation_id);
CREATE INDEX idx_kiwi_txn_created ON kiwi_transactions(created_at DESC);

-- Kiwi rules - configurable
CREATE TABLE kiwi_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clothing_type TEXT NOT NULL,
  quality TEXT NOT NULL,
  condition TEXT,
  kiwi_value INT NOT NULL CHECK (kiwi_value > 0),
  min_kiwi INT,
  max_kiwi INT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reward catalog
CREATE TABLE reward_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  kiwi_cost INT NOT NULL CHECK (kiwi_cost > 0),
  category TEXT NOT NULL CHECK (category IN ('physical','discount','delivery_benefit','special')),
  eligibility TEXT,
  stock INT,
  age_range TEXT,
  donation_category TEXT,
  image_url TEXT,
  expiration_at TIMESTAMPTZ,
  shipping_rule TEXT NOT NULL CHECK (shipping_rule IN ('with_order','hold_until_order','separate_configurable','free','donor_paid')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_reward_active ON reward_catalog(is_active) WHERE is_active = true;

-- Reward redemptions
CREATE TABLE reward_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id TEXT NOT NULL,
  reward_id UUID NOT NULL REFERENCES reward_catalog(id),
  kiwi_cost INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','shipped_with_order','shipped_separate','held','cancelled','completed')),
  shipping_method TEXT CHECK (shipping_method IN ('with_existing_order','hold_until_next','separate')),
  existing_order_id UUID,
  shipping_fee DECIMAL(10,3),
  tracking_number TEXT,
  notes TEXT,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_redemption_donor ON reward_redemptions(donor_id);
CREATE INDEX idx_redemption_reward ON reward_redemptions(reward_id);

-- Donor preferences - optional
CREATE TABLE donor_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id TEXT NOT NULL UNIQUE,
  age_ranges JSONB DEFAULT '[]'::jsonb,
  categories JSONB DEFAULT '[]'::jsonb,
  reward_types JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Collection configs
CREATE TABLE collection_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  min_pieces INT,
  free_threshold INT,
  fee_amount DECIMAL(10,3),
  zones JSONB DEFAULT '[]'::jsonb,
  grouped_days JSONB DEFAULT '[]'::jsonb,
  methods JSONB NOT NULL DEFAULT '["depot","collecte"]'::jsonb,
  requires_approval BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Donation inventory linkage - accepted inventory to product/pack
CREATE TABLE donation_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id UUID NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
  product_id UUID,
  pack_id TEXT,
  quantity INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'hold' CHECK (status IN ('hold','converted_to_product','converted_to_pack','sold','used_as_reward')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_donations_updated BEFORE UPDATE ON donations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_kiwi_accounts_updated BEFORE UPDATE ON kiwi_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_kiwi_rules_updated BEFORE UPDATE ON kiwi_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_reward_catalog_updated BEFORE UPDATE ON reward_catalog FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_reward_redemptions_updated BEFORE UPDATE ON reward_redemptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_donor_preferences_updated BEFORE UPDATE ON donor_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_collection_configs_updated BEFORE UPDATE ON collection_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Prevent negative Kiwi balance
CREATE OR REPLACE FUNCTION prevent_negative_kiwi() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.balance < 0 THEN
    RAISE EXCEPTION 'Kiwi balance cannot be negative for donor %', NEW.donor_phone;
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_kiwi_balance_check BEFORE UPDATE ON kiwi_accounts FOR EACH ROW EXECUTE FUNCTION prevent_negative_kiwi();

-- Seed Kiwi rules
INSERT INTO kiwi_rules (clothing_type, quality, kiwi_value, is_active) VALUES
('T-shirt', 'Standard', 1, true),
('T-shirt', 'Bonne', 2, true),
('T-shirt', 'Premium', 3, true),
('Pantalon', 'Standard', 2, true),
('Pantalon', 'Bonne', 3, true),
('Jean', 'Standard', 2, true),
('Jean', 'Bonne', 3, true),
('Robe', 'Standard', 2, true),
('Robe', 'Bonne', 3, true),
('Robe', 'Premium', 5, true),
('Veste', 'Standard', 3, true),
('Veste', 'Premium', 5, true),
('Manteau', 'Standard', 3, true),
('Manteau', 'Premium', 5, true),
('all', 'Standard', 1, true),
('all', 'Bonne', 2, true),
('all', 'Premium', 4, true)
ON CONFLICT DO NOTHING;

-- Seed rewards
INSERT INTO reward_catalog (name, description, kiwi_cost, category, age_range, donation_category, stock, shipping_rule, is_active) VALUES
('Pièce Fille — 6 ans', 'Vêtement fille 6 ans sélectionné selon disponibilité. Nous vous proposerons les récompenses disponibles correspondant à vos préférences.', 20, 'physical', '6–8 ans', 'Fille', 5, 'with_order', true),
('Pièce Garçon — 10 ans', 'Vêtement garçon 9-12 ans, qualité vérifiée.', 20, 'physical', '9–12 ans', 'Garçon', 3, 'with_order', true),
('Avantage client — 10% réduction', 'Réduction 10% sur prochaine commande éligible, valable 30 jours.', 15, 'discount', NULL, NULL, NULL, 'free', true),
('Livraison offerte', 'Livraison gratuite pour prochaine commande.', 12, 'delivery_benefit', NULL, NULL, NULL, 'free', true)
ON CONFLICT DO NOTHING;

-- Seed collection config
INSERT INTO collection_configs (min_pieces, free_threshold, fee_amount, zones, grouped_days, methods, requires_approval) VALUES
(10, 20, 5.000, '["Tunis","Ariana","Ben Arous"]'::jsonb, '["Lundi","Jeudi"]'::jsonb, '["depot","collecte"]'::jsonb, true)
ON CONFLICT DO NOTHING;
