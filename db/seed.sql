INSERT INTO categories (name, slug) VALUES
  ('Electronics', 'electronics'),
  ('Computers & Accessories', 'computers-accessories'),
  ('Audio', 'audio'),
  ('Fashion', 'fashion'),
  ('Home & Living', 'home-living'),
  ('Books', 'books'),
  ('Sports & Fitness', 'sports-fitness')
ON CONFLICT (slug) DO NOTHING;

WITH catalog(slug, name, description, price, stock, category_slug, image_url, sort_order) AS (
  VALUES
    ('nova-smartphone', 'Nova X5 Smartphone', 'A bright OLED display, reliable camera, and all-day battery for everyday use.', 24999.00, 18, 'electronics', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', 1),
    ('pixel-tablet', 'PixelTab 11', 'A lightweight tablet for reading, streaming, and creative work.', 31999.00, 12, 'electronics', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80', 2),
    ('charge-hub', 'Six-Port USB-C Charging Hub', 'Fast, compact charging for phones, tablets, and accessories.', 1899.00, 45, 'electronics', 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80', 3),
    ('smart-lamp', 'Aurora Smart Lamp', 'Warm, dimmable ambient lighting with a simple desk-friendly design.', 2499.00, 26, 'electronics', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80', 4),
    ('mechanical-keyboard', 'Maple Mechanical Keyboard', 'A tactile wireless keyboard with quiet switches and a compact layout.', 5499.00, 20, 'computers-accessories', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80', 5),
    ('ergonomic-mouse', 'Arc Ergonomic Mouse', 'A comfortable precision mouse made for long work sessions.', 1799.00, 34, 'computers-accessories', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80', 6),
    ('desk-stand', 'Aluminium Laptop Stand', 'Elevate your screen for a cleaner and more comfortable desk setup.', 2299.00, 30, 'computers-accessories', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80', 7),
    ('webcam-pro', 'ClearView HD Webcam', 'Sharp video and clear microphones for calls, classes, and streaming.', 3299.00, 16, 'computers-accessories', 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80', 8),
    ('noise-cancel-headphones', 'QuietTone ANC Headphones', 'Comfortable over-ear headphones with focused noise cancellation.', 7999.00, 14, 'audio', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 9),
    ('studio-earbuds', 'Studio Wireless Earbuds', 'Pocket-sized earbuds with balanced sound and a charging case.', 3499.00, 38, 'audio', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80', 10),
    ('bluetooth-speaker', 'Field Notes Bluetooth Speaker', 'A portable speaker with room-filling sound and a durable shell.', 4299.00, 22, 'audio', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80', 11),
    ('vinyl-turntable', 'Oakline Record Player', 'A simple belt-drive turntable for relaxed listening at home.', 8999.00, 8, 'audio', 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=800&q=80', 12),
    ('linen-overshirt', 'Everyday Linen Overshirt', 'Breathable linen layering with a relaxed unisex fit.', 1899.00, 25, 'fashion', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80', 13),
    ('canvas-sneakers', 'Canvas Court Sneakers', 'Minimal canvas sneakers with a flexible rubber sole.', 2199.00, 31, 'fashion', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80', 14),
    ('leather-wallet', 'Slim Leather Wallet', 'A compact vegetable-tanned wallet with room for daily essentials.', 1299.00, 42, 'fashion', 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80', 15),
    ('cotton-backpack', 'Daybreak Cotton Backpack', 'A roomy everyday backpack with padded laptop storage.', 2699.00, 19, 'fashion', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', 16),
    ('ceramic-mug', 'Hand-thrown Ceramic Mug', 'A sturdy glazed mug made for coffee, tea, and slow mornings.', 699.00, 50, 'home-living', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80', 17),
    ('linen-cushion', 'Textured Linen Cushion', 'A soft neutral cushion that adds warmth to a sofa or reading chair.', 999.00, 28, 'home-living', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80', 18),
    ('desk-organizer', 'Bamboo Desk Organizer', 'Keep stationery, cables, and small tools neatly in reach.', 849.00, 33, 'home-living', 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80', 19),
    ('scented-candle', 'Cedar & Citrus Candle', 'A clean-burning soy candle with a bright, woody fragrance.', 799.00, 36, 'home-living', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80', 20),
    ('pour-over-set', 'Morning Pour-over Set', 'A ceramic dripper and matching server for slow coffee rituals.', 1599.00, 17, 'home-living', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', 21),
    ('atomic-habits', 'Atomic Habits', 'A practical guide to building better habits through small changes.', 599.00, 44, 'books', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80', 22),
    ('design-everyday', 'The Design of Everyday Things', 'A thoughtful introduction to human-centred product design.', 799.00, 21, 'books', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80', 23),
    ('indian-cookbook', 'The Everyday Indian Kitchen', 'Approachable recipes for flavourful home cooking.', 699.00, 27, 'books', 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80', 24),
    ('travel-journal', 'Clothbound Travel Journal', 'A durable lined journal for notes, sketches, and plans.', 499.00, 39, 'books', 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80', 25),
    ('yoga-mat', 'Cork Alignment Yoga Mat', 'A supportive non-slip mat for yoga, stretching, and mobility.', 2199.00, 23, 'sports-fitness', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80', 26),
    ('steel-bottle', 'Insulated Steel Bottle', 'A leak-resistant bottle that keeps drinks cool throughout the day.', 1199.00, 48, 'sports-fitness', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80', 27),
    ('resistance-bands', 'Strength Resistance Bands', 'A versatile set of bands for strength and mobility workouts.', 899.00, 35, 'sports-fitness', 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&q=80', 28),
    ('running-cap', 'Lightweight Running Cap', 'Breathable quick-dry protection for morning runs and hikes.', 749.00, 29, 'sports-fitness', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80', 29),
    ('foam-roller', 'Recovery Foam Roller', 'Firm textured foam for post-workout recovery and mobility.', 1399.00, 20, 'sports-fitness', 'https://images.unsplash.com/photo-1591343395082-e120087004b4?w=800&q=80', 30)
)
INSERT INTO products (category_id, slug, name, description, price, stock)
SELECT c.id, catalog.slug, catalog.name, catalog.description, catalog.price, catalog.stock
FROM catalog JOIN categories c ON c.slug = catalog.category_slug
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, stock = EXCLUDED.stock, category_id = EXCLUDED.category_id, updated_at = now();

WITH catalog(slug, image_url, sort_order) AS (
  VALUES
    ('nova-smartphone','https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',1), ('pixel-tablet','https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',2), ('charge-hub','https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80',3), ('smart-lamp','https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',4), ('mechanical-keyboard','https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',5), ('ergonomic-mouse','https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80',6), ('desk-stand','https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',7), ('webcam-pro','https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80',8), ('noise-cancel-headphones','https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',9), ('studio-earbuds','https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',10), ('bluetooth-speaker','https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',11), ('vinyl-turntable','https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=800&q=80',12), ('linen-overshirt','https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80',13), ('canvas-sneakers','https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80',14), ('leather-wallet','https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',15), ('cotton-backpack','https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',16), ('ceramic-mug','https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',17), ('linen-cushion','https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80',18), ('desk-organizer','https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80',19), ('scented-candle','https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80',20), ('pour-over-set','https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',21), ('atomic-habits','https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',22), ('design-everyday','https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80',23), ('indian-cookbook','https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80',24), ('travel-journal','https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80',25), ('yoga-mat','https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80',26), ('steel-bottle','https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',27), ('resistance-bands','https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&q=80',28), ('running-cap','https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',29), ('foam-roller','https://images.unsplash.com/photo-1591343395082-e120087004b4?w=800&q=80',30)
)
INSERT INTO product_images (product_id, url, alt_text, sort_order)
SELECT p.id, c.image_url, p.name, c.sort_order FROM catalog c JOIN products p ON p.slug = c.slug
WHERE NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.product_id = p.id);
