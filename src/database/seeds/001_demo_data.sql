-- Demo data Barka Nour - NO HUMAN IMAGES, object-only
-- 5 products artisanaux tunisiens

INSERT INTO store_settings (name, slug, description, email, currency) VALUES
('Barka Nour', 'barka-nour', 'Boutique tunisienne unique - artisanat authentique sans images humaines, objet-only', 'contact@barkanour.tn', 'TND')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO store_theme (primary_color, secondary_color, font_heading, font_body) VALUES
('#b8860b', '#1a1a1a', 'Fraunces', 'Geist')
ON CONFLICT DO NOTHING;

-- Categories
INSERT INTO categories (id, name, slug, description, sort_order) VALUES
(gen_random_uuid(), 'Textiles berbères', 'textiles-berberes', 'Tapis, coussins, tissage main', 1),
(gen_random_uuid(), 'Cuisine & Stockage', 'cuisine-stockage', 'Bocaux verre, rangement éco', 2),
(gen_random_uuid(), 'Accessoires éco', 'accessoires-eco', 'Tote bags, sacs bio coton', 3),
(gen_random_uuid(), 'Beauté naturelle', 'beaute-naturelle', 'Huiles, argan, naturel Tunisie', 4),
(gen_random_uuid(), 'Tech & Bureau', 'tech-bureau', 'Supports, accessoires bureau bambou', 5)
ON CONFLICT (slug) DO NOTHING;

-- Products - object-only descriptions explicitly no humans
-- Note: images field contains placeholder object-only references, not human photos
INSERT INTO products (name, slug, sku, short_description, description, price, compare_at_price, stock_quantity, low_stock_threshold, status, featured, images) VALUES
('Tapis Berbère Authentique - Laine Main', 'tapis-berbere-authentique-laine-main', 'BN-TAPIS-001',
 'Tapis tissé main, laine naturelle, motif berbère',
 'Tapis berbère authentique tissé main par artisans tunisiens, laine naturelle beige et ocre, 200x150cm. Photo objet-only: tapis posé à plat sur fond neutre sable clair, sans personnes, sans modèle humain, sans pieds, texture visible. Emballage rouleau kraft.',
 299.000, 399.000, 3, 5, 'active', true, '["tapis-flatlay-neutral.jpg"]'::jsonb),

('Bocaux Verre Éco - Set 3 Stockage', 'bocaux-verre-eco-set-3-stockage', 'BN-BOCAUX-001',
 'Set 3 bocaux verre hermétique, couvercle bambou',
 'Set 3 bocaux verre borosilicate hermétiques couvercle bambou naturel, 500ml/800ml/1200ml. Photo objet-only: bocaux alignés sur table bois clair, couvercles posés à côté, grains secs à l''intérieur, fond blanc cassé, sans mains humaines, sans personnes.',
 59.000, 79.000, 42, 10, 'active', true, '["bocaux-verre-set.jpg"]'::jsonb),

('Sac Tote Bio Coton - Édition Tunis', 'sac-tote-bio-coton-edition-tunis', 'BN-SAC-001',
 'Tote bag coton bio, impression olive minimaliste',
 'Sac tote coton biologique certifié, 38x42cm, anses longues, impression sérigraphie olive dorée Barka Nour. Photo objet-only: sac posé sur chaise bois clair ou accroché crochet neutre, vide, fond mur beige, sans modèle humain, sans épaule, sans personne.',
 45.000, NULL, 28, 8, 'active', true, '["tote-bag-flat.jpg"]'::jsonb),

('Huile Argan Pure - 100ml Tunisie', 'huile-argan-pure-100ml-tunisie', 'BN-ARGAN-001',
 'Huile argan pure pressée à froid, flacon verre ambré',
 'Huile d''argan pure 100% pressée à froid, flacon verre ambré 100ml avec pipette, origine Tunisie. Photo objet-only: flacon seul sur pierre claire + branche olive floue arrière-plan, sans mains, sans visage, sans personne, goutte huile sur bois.',
 35.500, 45.000, 15, 5, 'active', false, '["huile-argan-flacon.jpg"]'::jsonb),

('Support Smartphone Bambou - Bureau', 'support-smartphone-bambou-bureau', 'BN-SUPPORT-001',
 'Support téléphone bambou naturel, angle réglable',
 'Support smartphone et tablette bambou naturel verni, angle 30°, rainure câble, 12x8cm. Photo objet-only: support seul + smartphone posé dessus écran neutre, sur bureau bois clair avec plante petite floue, sans mains humaines, sans personne.',
 29.900, 39.900, 33, 10, 'active', true, '["support-bambou.jpg"]'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Coupons
INSERT INTO coupons (code, type, value, min_order_amount, usage_limit, is_active, expires_at) VALUES
('BIENVENUE10', 'percentage', 10, 50, 100, true, NOW() + INTERVAL '90 days'),
('LIVRAISONGRATUITE', 'fixed', 10, 150, 50, true, NOW() + INTERVAL '30 days')
ON CONFLICT (code) DO NOTHING;

-- Delivery configs - mock initially
INSERT INTO delivery_configs (provider, is_active, is_default, status, config) VALUES
('mock', true, true, 'mock', '{"fee_tunis": 7, "fee_other": 10, "free_threshold": 150}'::jsonb),
('mescolis', false, false, 'not_configured', '{}'::jsonb),
('aramex', false, false, 'not_configured', '{}'::jsonb),
('first_delivery', false, false, 'not_configured', '{}'::jsonb)
ON CONFLICT DO NOTHING;

-- Meta integration placeholder
INSERT INTO meta_integrations (status, is_active, config) VALUES
('not_configured', false, '{"events": ["PageView","ViewContent","Search","AddToCart","InitiateCheckout","AddPaymentInfo","Purchase","Lead"]}'::jsonb)
ON CONFLICT DO NOTHING;

-- Landing page example hero/text/product/collection/banner/CTA/image/FAQ/benefits/countdown
INSERT INTO landing_pages (title, slug, description, blocks, is_active) VALUES
('Nouveauté Tapis Berbère', 'tapis-berbere-nouveaute',
 'Landing collection tapis berbères artisanaux',
 '[
   {"type": "hero", "title": "Tapis Berbère Authentique", "subtitle": "Tissé main en Tunisie, laine naturelle, sans images humaines - objet-only", "cta": "Découvrir", "image": "tapis-hero-neutral.jpg"},
   {"type": "benefits", "items": [{"icon": "shield", "title": "Artisanat authentique"}, {"icon": "truck", "title": "Livraison 24-72h"}, {"icon": "banknote", "title": "Paiement livraison"}]},
   {"type": "product", "product_slug": "tapis-berbere-authentique-laine-main"},
   {"type": "faq", "items": [{"q": "Livraison?", "a": "24-72h, 7-10 TND, gratuit >=150 TND"}, {"q": "Retour?", "a": "7 jours"}]},
   {"type": "countdown", "end": "2026-12-31", "text": "Offre -25% se termine dans"}
 ]'::jsonb, true)
ON CONFLICT (slug) DO NOTHING;
