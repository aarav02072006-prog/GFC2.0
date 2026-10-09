tCREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_active_idx ON sessions(token_hash, expires_at) WHERE revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL,
  price numeric(12,2) NOT NULL CHECK (price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category_id);
CREATE TABLE IF NOT EXISTS product_images (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE, url text NOT NULL, alt_text text NOT NULL DEFAULT '', sort_order integer NOT NULL DEFAULT 0);

CREATE TABLE IF NOT EXISTS carts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS cart_items (cart_id uuid NOT NULL REFERENCES carts(id) ON DELETE CASCADE, product_id uuid NOT NULL REFERENCES products(id), quantity integer NOT NULL CHECK (quantity > 0), PRIMARY KEY (cart_id, product_id));
CREATE TABLE IF NOT EXISTS addresses (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, full_name text NOT NULL, line1 text NOT NULL, city text NOT NULL, postal_code text NOT NULL, country text NOT NULL DEFAULT 'IN', created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS orders (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id), address_id uuid REFERENCES addresses(id), status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','cancelled','fulfilled')), total numeric(12,2) NOT NULL CHECK (total >= 0), idempotency_key text NOT NULL UNIQUE, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS order_items (order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE, product_id uuid REFERENCES products(id), product_name text NOT NULL, unit_price numeric(12,2) NOT NULL, quantity integer NOT NULL CHECK (quantity > 0), PRIMARY KEY (order_id, product_id));
CREATE TABLE IF NOT EXISTS payments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE, provider text NOT NULL, provider_reference text, status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','authorized','paid','failed','refunded')), created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS wishlists (user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE, created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id, product_id));
