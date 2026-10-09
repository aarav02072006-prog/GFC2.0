INSERT INTO categories (name, slug) VALUES
  ('Footwear', 'footwear'), ('Accessories', 'accessories'), ('Electronics', 'electronics'), ('Home', 'home')
ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (category_id, slug, name, description, price, stock)
SELECT c.id, v.slug, v.name, v.description, v.price, v.stock
FROM (VALUES
  ('minimal-sneakers','Minimal Sneakers','Lightweight everyday sneakers.',2499.00,18),
  ('everyday-backpack','Everyday Backpack','A durable everyday backpack.',1799.00,24),
  ('wireless-headphones','Wireless Headphones','Immersive sound for every day.',2999.00,15),
  ('ceramic-mug','Ceramic Mug','A sturdy mug for slow mornings.',699.00,40)
) AS v(slug,name,description,price,stock)
JOIN categories c ON c.slug = CASE WHEN v.slug = 'minimal-sneakers' THEN 'footwear' WHEN v.slug = 'everyday-backpack' THEN 'accessories' WHEN v.slug = 'wireless-headphones' THEN 'electronics' ELSE 'home' END
ON CONFLICT (slug) DO NOTHING;
