-- ============================================================================
-- QR MENU PRO - SUPABASE DATABASE SCHEMA
-- ============================================================================
-- Complete schema for multi-tenant restaurant management SaaS
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. RESTAURANTS & MULTI-TENANCY
-- ============================================================================

CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'India',
  postal_code VARCHAR(20),
  logo_url TEXT,
  cover_image_url TEXT,
  description TEXT,
  website VARCHAR(255),
  currency VARCHAR(3) DEFAULT 'INR',
  timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
  subscription_plan VARCHAR(50) DEFAULT 'starter', -- starter, growth, pro
  subscription_status VARCHAR(50) DEFAULT 'active', -- active, inactive, trial, suspended
  trial_ends_at TIMESTAMP,
  subscription_started_at TIMESTAMP DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  verification_token_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS restaurant_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  auth_user_id UUID NOT NULL, -- Links to Supabase auth.users
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'owner', -- owner, manager, staff
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(restaurant_id, email)
);

CREATE INDEX idx_restaurant_users_restaurant_id ON restaurant_users(restaurant_id);
CREATE INDEX idx_restaurant_users_auth_user_id ON restaurant_users(auth_user_id);

-- ============================================================================
-- 2. OUTLETS (MULTIPLE LOCATIONS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS outlets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE, -- For public menu URL: /m/{slug}
  address TEXT NOT NULL,
  city VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(255),
  latitude FLOAT,
  longitude FLOAT,
  opening_time TIME DEFAULT '09:00:00',
  closing_time TIME DEFAULT '22:00:00',
  is_open_today BOOLEAN DEFAULT TRUE,
  seating_capacity INT,
  manager_name VARCHAR(255),
  manager_phone VARCHAR(20),
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_outlets_restaurant_id ON outlets(restaurant_id);
CREATE INDEX idx_outlets_slug ON outlets(slug);

-- ============================================================================
-- 3. MENU STRUCTURE (CATEGORIES & DISHES)
-- ============================================================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  icon_name VARCHAR(100), -- lucide icon names
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(outlet_id, name)
);

CREATE INDEX idx_categories_outlet_id ON categories(outlet_id);

CREATE TABLE IF NOT EXISTS dishes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_vegan BOOLEAN DEFAULT FALSE,
  is_gluten_free BOOLEAN DEFAULT FALSE,
  contains_nuts BOOLEAN DEFAULT FALSE,
  contains_dairy BOOLEAN DEFAULT FALSE,
  preparation_time_minutes INT DEFAULT 15,
  spice_level INT DEFAULT 1, -- 1-5 scale
  is_available BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  rating FLOAT DEFAULT 0,
  rating_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  cart_add_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_dishes_outlet_id ON dishes(outlet_id);
CREATE INDEX idx_dishes_category_id ON dishes(category_id);
CREATE INDEX idx_dishes_is_available ON dishes(is_available);

CREATE TABLE IF NOT EXISTS dish_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL, -- e.g., "Small", "Medium", "Large"
  price_modifier DECIMAL(10, 2) DEFAULT 0,
  display_order INT DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_dish_variants_dish_id ON dish_variants(dish_id);

-- ============================================================================
-- 4. QR CODES & TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  table_number VARCHAR(50) NOT NULL,
  qr_code_deep_link TEXT NOT NULL UNIQUE, -- /m/{outlet_slug}?table={table_number}
  qr_code_image_url TEXT, -- Stored in Supabase Storage
  qr_code_pdf_url TEXT,
  capacity INT DEFAULT 2,
  location_area VARCHAR(100), -- e.g., "Indoor", "Outdoor", "Bar"
  is_active BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(outlet_id, table_number)
);

CREATE INDEX idx_tables_outlet_id ON tables(outlet_id);

-- ============================================================================
-- 5. CUSTOMERS & PHONE/EMAIL CAPTURE
-- ============================================================================

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  phone_number VARCHAR(20),
  email_address VARCHAR(255),
  customer_token VARCHAR(255) UNIQUE, -- Stored in customer's localStorage
  full_name VARCHAR(255),
  first_visit_at TIMESTAMP DEFAULT NOW(),
  last_visit_at TIMESTAMP DEFAULT NOW(),
  total_orders INT DEFAULT 0,
  total_spent DECIMAL(12, 2) DEFAULT 0,
  lifetime_value DECIMAL(12, 2) DEFAULT 0,
  opted_for_updates BOOLEAN DEFAULT FALSE,
  opted_for_marketing BOOLEAN DEFAULT FALSE,
  notification_status VARCHAR(50) DEFAULT 'pending', -- pending, verified, unsubscribed
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  UNIQUE(phone_number, restaurant_id)
);

CREATE INDEX idx_customers_restaurant_id ON customers(restaurant_id);
CREATE INDEX idx_customers_phone_number ON customers(phone_number);
CREATE INDEX idx_customers_email_address ON customers(email_address);
CREATE INDEX idx_customers_customer_token ON customers(customer_token);

-- ============================================================================
-- 6. ORDERS & ORDER ITEMS
-- ============================================================================

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
  table_number VARCHAR(50),
  order_number VARCHAR(50) NOT NULL UNIQUE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, preparing, served, completed, cancelled
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
  subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
  tax DECIMAL(12, 2) DEFAULT 0,
  discount DECIMAL(12, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  special_instructions TEXT,
  estimated_preparation_time INT, -- in minutes
  accepted_at TIMESTAMP,
  started_preparing_at TIMESTAMP,
  served_at TIMESTAMP,
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  cancelled_reason TEXT,
  customer_phone VARCHAR(20),
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  source VARCHAR(50) DEFAULT 'qr_menu', -- qr_menu, whatsapp, website
  user_agent TEXT,
  ip_address INET,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_outlet_id ON orders(outlet_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE RESTRICT,
  dish_variant_id UUID REFERENCES dish_variants(id) ON DELETE SET NULL,
  dish_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  special_instructions TEXT,
  item_total DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_dish_id ON order_items(dish_id);

-- ============================================================================
-- 7. ANALYTICS & EVENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL, -- menu_viewed, category_viewed, dish_viewed, item_added_to_cart, order_placed
  customer_token VARCHAR(255), -- Links to customers.customer_token
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  dish_id UUID REFERENCES dishes(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}', -- Additional event data
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_outlet_id ON analytics_events(outlet_id);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_customer_token ON analytics_events(customer_token);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dish_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's restaurant
CREATE OR REPLACE FUNCTION get_user_restaurant_id()
RETURNS UUID AS $$
  SELECT restaurant_id FROM restaurant_users 
  WHERE auth_user_id = auth.uid()
  LIMIT 1
$$ LANGUAGE SQL STABLE;

-- Restaurants: Users can view/edit only their own restaurant
CREATE POLICY restaurants_select_own ON restaurants
  FOR SELECT USING (
    id = get_user_restaurant_id() OR
    auth.role() = 'service_role'
  );

CREATE POLICY restaurants_update_own ON restaurants
  FOR UPDATE USING (
    id = get_user_restaurant_id() AND
    auth.role() != 'anon'
  );

-- Restaurant Users: Staff can only view their own restaurant's users
CREATE POLICY restaurant_users_select_own ON restaurant_users
  FOR SELECT USING (
    restaurant_id = get_user_restaurant_id() OR
    auth.role() = 'service_role'
  );

-- Outlets: Authenticated users can view only their restaurant's outlets
CREATE POLICY outlets_select_own ON outlets
  FOR SELECT USING (
    restaurant_id = get_user_restaurant_id() OR
    auth.role() = 'service_role'
  );

-- Public outlets (by slug) can be viewed by anyone for menu viewing
CREATE POLICY outlets_select_public ON outlets
  FOR SELECT USING (
    is_active = TRUE AND
    restaurant_id = ANY(
      SELECT restaurant_id FROM outlets WHERE restaurant_id IS NOT NULL
    )
  )
  WITH CHECK (false);

-- Categories: Authenticated users view only their restaurant's categories
CREATE POLICY categories_select_own ON categories
  FOR SELECT USING (
    outlet_id IN (
      SELECT id FROM outlets WHERE restaurant_id = get_user_restaurant_id()
    ) OR
    auth.role() = 'service_role'
  );

-- Categories: Public read via outlet slug
CREATE POLICY categories_select_public ON categories
  FOR SELECT USING (
    is_active = TRUE
  )
  WITH CHECK (false);

-- Dishes: Similar policies as categories
CREATE POLICY dishes_select_own ON dishes
  FOR SELECT USING (
    outlet_id IN (
      SELECT id FROM outlets WHERE restaurant_id = get_user_restaurant_id()
    ) OR
    auth.role() = 'service_role'
  );

CREATE POLICY dishes_select_public ON dishes
  FOR SELECT USING (
    is_available = TRUE
  )
  WITH CHECK (false);

-- Tables: Only restaurant staff can view/manage
CREATE POLICY tables_select_own ON tables
  FOR SELECT USING (
    outlet_id IN (
      SELECT id FROM outlets WHERE restaurant_id = get_user_restaurant_id()
    ) OR
    auth.role() = 'service_role'
  );

-- Customers: Only restaurant staff can view
CREATE POLICY customers_select_own ON customers
  FOR SELECT USING (
    restaurant_id = get_user_restaurant_id() OR
    auth.role() = 'service_role'
  );

-- Orders: Restaurant staff and related customers can view
CREATE POLICY orders_select_own ON orders
  FOR SELECT USING (
    outlet_id IN (
      SELECT id FROM outlets WHERE restaurant_id = get_user_restaurant_id()
    ) OR
    auth.role() = 'service_role'
  );

-- Analytics: Only restaurant staff can view
CREATE POLICY analytics_events_select_own ON analytics_events
  FOR SELECT USING (
    outlet_id IN (
      SELECT id FROM outlets WHERE restaurant_id = get_user_restaurant_id()
    ) OR
    auth.role() = 'service_role'
  );

-- ============================================================================
-- 9. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER restaurants_updated_at BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER restaurant_users_updated_at BEFORE UPDATE ON restaurant_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER outlets_updated_at BEFORE UPDATE ON outlets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER dishes_updated_at BEFORE UPDATE ON dishes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER tables_updated_at BEFORE UPDATE ON tables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER dish_variants_updated_at BEFORE UPDATE ON dish_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update customer's last visit and total orders
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    UPDATE customers
    SET 
      last_visit_at = NOW(),
      total_orders = total_orders + 1,
      total_spent = total_spent + NEW.total_amount,
      lifetime_value = lifetime_value + NEW.total_amount
    WHERE id = NEW.customer_id;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customer_stats_on_order
AFTER UPDATE ON orders
  FOR EACH ROW WHEN (OLD.status != NEW.status AND NEW.status = 'completed')
  EXECUTE FUNCTION update_customer_stats();

-- Update dish view/cart counts
CREATE OR REPLACE FUNCTION update_dish_stats(p_dish_id UUID, p_event_type VARCHAR)
RETURNS VOID AS $$
BEGIN
  IF p_event_type = 'dish_viewed' THEN
    UPDATE dishes SET view_count = view_count + 1 WHERE id = p_dish_id;
  ELSIF p_event_type = 'item_added_to_cart' THEN
    UPDATE dishes SET cart_add_count = cart_add_count + 1 WHERE id = p_dish_id;
  END IF;
END;
$$ language 'plpgsql';

-- ============================================================================
-- 10. DEMO DATA (SEED)
-- ============================================================================

-- Insert sample restaurant
INSERT INTO restaurants (name, email, phone, city, country, currency, subscription_plan, subscription_status, is_verified)
VALUES ('The Delhi Bistro', 'owner@delhbistro.com', '+919876543210', 'Delhi', 'India', 'INR', 'growth', 'active', TRUE)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- End of Schema
-- ============================================================================
