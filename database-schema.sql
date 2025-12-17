-- Bev's Bakery Database Schema
-- PostgreSQL Schema Export
-- Generated for easy deployment to other backends

-- Table: users
-- Stores admin user credentials
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Table: orders
-- Stores customer orders from the website
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  cake_quantity INTEGER NOT NULL DEFAULT 0,
  sorrel_quantity INTEGER NOT NULL DEFAULT 0,
  special_requests TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);

-- Optional: Insert default admin user (password should be hashed in production)
-- INSERT INTO users (username, password) VALUES ('admin', 'hashed_password_here');

-- Notes:
-- 1. Product prices are calculated in the application:
--    - Christmas Fruit Cake: £15.00 each
--    - Bottle of Sorrel: £5.00 each
-- 2. Status field can be: 'pending', 'completed', 'cancelled'
-- 3. In production, implement proper password hashing (bcrypt, argon2)
-- 4. Consider adding foreign key constraints if implementing user authentication
