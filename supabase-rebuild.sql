-- ============================================================================
-- Bev's Bakery - Complete Database Schema for Supabase
-- ============================================================================
-- Production-ready SQL for rebuilding the entire database
-- Compatible with PostgreSQL 13+ (Supabase standard)
-- ============================================================================

-- ============================================================================
-- CLEANUP (Run this first if rebuilding an existing database)
-- ============================================================================
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;

-- ============================================================================
-- EXTENSIONS (Enable required PostgreSQL extensions)
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABLE: users
-- Description: Stores admin user credentials for backend access
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE users IS 'Admin users for Bev''s Bakery platform';
COMMENT ON COLUMN users.id IS 'Unique identifier (UUID)';
COMMENT ON COLUMN users.username IS 'Unique username for login';
COMMENT ON COLUMN users.password IS 'Hashed password (bcrypt recommended)';

-- ============================================================================
-- TABLE: orders
-- Description: Stores customer orders from the website
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  cake_quantity INTEGER NOT NULL DEFAULT 0 CHECK (cake_quantity >= 0),
  sorrel_quantity INTEGER NOT NULL DEFAULT 0 CHECK (sorrel_quantity >= 0),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT
);

COMMENT ON TABLE orders IS 'Customer orders for Bev''s Bakery products';
COMMENT ON COLUMN orders.id IS 'Unique order identifier (UUID)';
COMMENT ON COLUMN orders.name IS 'Customer full name';
COMMENT ON COLUMN orders.email IS 'Customer email address';
COMMENT ON COLUMN orders.phone IS 'Customer phone number';
COMMENT ON COLUMN orders.cake_quantity IS 'Number of Jamaican Christmas Fruit Cakes ordered';
COMMENT ON COLUMN orders.sorrel_quantity IS 'Number of bottles of Sorrel ordered';
COMMENT ON COLUMN orders.special_requests IS 'Custom delivery instructions or special requests';
COMMENT ON COLUMN orders.created_at IS 'Order creation timestamp';
COMMENT ON COLUMN orders.updated_at IS 'Last update timestamp';
COMMENT ON COLUMN orders.status IS 'Order status (pending, confirmed, completed, cancelled)';
COMMENT ON COLUMN orders.notes IS 'Internal admin notes about the order';

-- ============================================================================
-- INDEXES for Performance Optimization
-- ============================================================================

-- Orders table indexes
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_updated_at ON orders(updated_at DESC);

-- Users table indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ============================================================================
-- VIEW: orders_summary
-- Description: Summary statistics for admin dashboard
-- ============================================================================
CREATE OR REPLACE VIEW orders_summary AS
SELECT 
  COUNT(*) as total_orders,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
  COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_orders,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
  COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
  SUM(cake_quantity) as total_cakes,
  SUM(sorrel_quantity) as total_sorrels,
  (SUM(cake_quantity) * 15.00 + SUM(sorrel_quantity) * 5.00)::DECIMAL(10, 2) as estimated_revenue
FROM orders
WHERE created_at >= NOW() - INTERVAL '30 days';

-- ============================================================================
-- VIEW: orders_by_date
-- Description: Orders grouped by creation date (for analytics)
-- ============================================================================
CREATE OR REPLACE VIEW orders_by_date AS
SELECT 
  DATE(created_at) as order_date,
  COUNT(*) as order_count,
  SUM(cake_quantity) as cakes_ordered,
  SUM(sorrel_quantity) as sorrels_ordered,
  (SUM(cake_quantity) * 15.00 + SUM(sorrel_quantity) * 5.00)::DECIMAL(10, 2) as daily_revenue
FROM orders
GROUP BY DATE(created_at)
ORDER BY order_date DESC;

-- ============================================================================
-- FUNCTIONS: Utility Functions
-- ============================================================================

-- Function to calculate order total
CREATE OR REPLACE FUNCTION calculate_order_total(cake_qty INTEGER, sorrel_qty INTEGER)
RETURNS DECIMAL(10, 2) AS $$
BEGIN
  RETURN (cake_qty * 15.00 + sorrel_qty * 5.00)::DECIMAL(10, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS: Automatic Timestamp Management
-- ============================================================================

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for orders table
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (Optional, for Supabase auth integration)
-- ============================================================================

-- Enable RLS on orders table (optional)
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy to allow public inserts to orders (for website form submissions)
-- CREATE POLICY "Allow public inserts" ON orders
--   FOR INSERT
--   WITH CHECK (true);

-- Policy to allow authenticated users to select all orders (for admin)
-- CREATE POLICY "Allow authenticated select" ON orders
--   FOR SELECT
--   USING (auth.role() = 'authenticated');

-- ============================================================================
-- SAMPLE DATA (Optional - remove in production)
-- ============================================================================

-- Insert sample user (password should be hashed with bcrypt in production)
-- Example: Use bcrypt to hash a password, then insert the hash
-- INSERT INTO users (username, password)
-- VALUES ('admin', 'hashed_password_here')
-- ON CONFLICT (username) DO NOTHING;

-- Insert sample orders for testing
-- INSERT INTO orders (name, email, phone, cake_quantity, sorrel_quantity, special_requests, status)
-- VALUES 
--   ('John Doe', 'john@example.com', '555-0001', 2, 1, 'Deliver on Sunday morning', 'confirmed'),
--   ('Jane Smith', 'jane@example.com', '555-0002', 1, 2, 'Dairy-free sorrel preferred', 'pending'),
--   ('Bob Johnson', 'bob@example.com', '555-0003', 3, 0, NULL, 'completed')
-- ON CONFLICT DO NOTHING;

-- ============================================================================
-- NOTES FOR SUPABASE DEPLOYMENT
-- ============================================================================

-- 1. PASSWORDS:
--    - Do NOT store plain-text passwords
--    - Use a library like bcrypt, argon2, or scrypt
--    - Example Node.js: bcrypt.hash(password, 10)

-- 2. PRICING (configured in application):
--    - Jamaican Christmas Fruit Cake: $15.00 each
--    - Jamaican Sorrel Drink: $5.00 each

-- 3. ORDER STATUS VALUES:
--    - 'pending' - Order received, awaiting confirmation
--    - 'confirmed' - Order confirmed by admin
--    - 'completed' - Order fulfilled/delivered
--    - 'cancelled' - Order cancelled

-- 4. SUPABASE-SPECIFIC SETUP:
--    a. Enable Row Level Security (RLS) if using Supabase Auth
--    b. Create policies for public inserts (orders) and authenticated access (admin)
--    c. Use Supabase client libraries for connection management
--    d. Environment variables:
--       - SUPABASE_URL: Your Supabase project URL
--       - SUPABASE_ANON_KEY: Public anonymous key
--       - DATABASE_URL: Full PostgreSQL connection string (for server-side)

-- 5. BACKUPS:
--    - Enable automated backups in Supabase dashboard
--    - Set retention policy (recommended: 7+ days)

-- 6. MIGRATIONS:
--    - Use Drizzle Kit or similar for version control
--    - Keep this file in your repository

-- ============================================================================
-- TESTING QUERIES
-- ============================================================================

-- Get all pending orders:
-- SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at DESC;

-- Get order summary statistics:
-- SELECT * FROM orders_summary;

-- Get daily revenue:
-- SELECT * FROM orders_by_date;

-- Get orders by specific customer:
-- SELECT * FROM orders WHERE email = 'customer@example.com' ORDER BY created_at DESC;

-- Calculate revenue from a specific date range:
-- SELECT SUM(calculate_order_total(cake_quantity, sorrel_quantity)) as total_revenue
-- FROM orders WHERE created_at >= '2025-12-01' AND created_at < '2025-12-31';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
