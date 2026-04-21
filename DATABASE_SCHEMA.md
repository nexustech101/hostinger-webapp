# FinFlow Database Schema

This document describes the database schema required for FinFlow when integrated with Supabase or another PostgreSQL database.

## Overview

The FinFlow database consists of the following core tables:
- `users` - User accounts and authentication
- `wallets` - User financial wallets
- `payment_methods` - Saved payment methods
- `transactions` - All financial transactions
- `payments` - Payment processing records
- `audit_logs` - Security and compliance logging

## Table Definitions

### 1. Users Table

Stores user account information and authentication data.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20),
  business_name VARCHAR(255),
  
  -- Security
  email_verified BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_method VARCHAR(50),
  
  -- Settings
  preferred_currency VARCHAR(3) DEFAULT 'USD',
  preferred_theme VARCHAR(10) DEFAULT 'light',
  notification_email VARCHAR(255),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### 2. Wallets Table

Stores wallet information for each user.

```sql
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  balance DECIMAL(19, 4) DEFAULT 0,
  
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  
  -- For future feature: linked bank account
  linked_account_id VARCHAR(255),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_type CHECK (type IN ('primary', 'savings', 'business', 'general')),
  CONSTRAINT positive_balance CHECK (balance >= 0)
);

CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_wallets_user_id_active ON wallets(user_id) WHERE is_active = true;
```

### 3. Payment Methods Table

Stores saved payment methods for transactions.

```sql
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL, -- 'card', 'bank_account', 'paypal', 'cashapp', 'square'
  brand VARCHAR(50),
  name VARCHAR(100) NOT NULL,
  
  -- Tokenized payment info (never store raw card data)
  token VARCHAR(255) NOT NULL,
  last_four VARCHAR(4),
  expiry_date VARCHAR(7), -- For cards: MM/YY
  
  is_verified BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_type CHECK (type IN ('card', 'bank_account', 'paypal', 'cashapp', 'square'))
);

CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_verified ON payment_methods(user_id) WHERE is_verified = true;
```

### 4. Transactions Table

Records all financial transactions.

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE RESTRICT,
  
  description VARCHAR(500) NOT NULL,
  category VARCHAR(50) NOT NULL,
  amount DECIMAL(19, 4) NOT NULL,
  type VARCHAR(10) NOT NULL, -- 'credit' (income) or 'debit' (expense)
  
  status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'cancelled'
  
  -- Related payment (if from payment processing)
  related_payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  
  -- For transfers between wallets
  transfer_from_wallet_id UUID REFERENCES wallets(id) ON DELETE SET NULL,
  
  -- Metadata for categorization and reporting
  tags JSONB, -- JSON array of tags for further categorization
  notes TEXT,
  reference_number VARCHAR(100),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_type CHECK (type IN ('credit', 'debit')),
  CONSTRAINT positive_amount CHECK (amount > 0),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'failed', 'cancelled'))
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_status ON transactions(status) WHERE status != 'completed';
```

### 5. Payments Table

Records payment processing through payment gateways.

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  amount DECIMAL(19, 4) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  description TEXT,
  
  payment_method_id UUID NOT NULL REFERENCES payment_methods(id) ON DELETE RESTRICT,
  
  status VARCHAR(50) DEFAULT 'processing', -- 'processing', 'succeeded', 'failed', 'refunded', 'cancelled'
  
  -- Payment gateway references
  stripe_payment_intent_id VARCHAR(255), -- Stripe Payment Intent ID
  stripe_charge_id VARCHAR(255),         -- Stripe Charge ID
  
  -- For future payment gateway integration
  paypal_transaction_id VARCHAR(255),
  square_payment_id VARCHAR(255),
  
  error_message TEXT,
  
  -- Refund information
  refunded_amount DECIMAL(19, 4),
  refund_reason VARCHAR(255),
  refunded_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT positive_amount CHECK (amount > 0),
  CONSTRAINT valid_status CHECK (status IN ('processing', 'succeeded', 'failed', 'refunded', 'cancelled')),
  CONSTRAINT valid_refund CHECK (refunded_amount IS NULL OR (refunded_amount > 0 AND refunded_amount <= amount))
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status) WHERE status != 'succeeded';
CREATE INDEX idx_payments_stripe_id ON payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
```

### 6. Audit Logs Table

Records security and compliance-related actions.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  action VARCHAR(100) NOT NULL, -- 'login', 'logout', 'update_profile', 'add_payment_method', etc.
  resource_type VARCHAR(100),   -- 'user', 'wallet', 'payment_method', 'transaction', etc.
  resource_id VARCHAR(255),
  
  changes JSONB, -- Before/after values for auditing
  
  ip_address INET,
  user_agent TEXT,
  status VARCHAR(50) DEFAULT 'success', -- 'success', 'failed', 'warning'
  
  description TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
```

## Views (Optional but Recommended)

### User Financial Summary View

```sql
CREATE VIEW user_financial_summary AS
SELECT 
  u.id,
  u.email,
  COUNT(DISTINCT w.id) as wallet_count,
  COALESCE(SUM(w.balance), 0) as total_balance,
  COUNT(DISTINCT CASE WHEN t.type = 'credit' THEN t.id END) as total_income_count,
  COALESCE(SUM(CASE WHEN t.type = 'credit' THEN t.amount ELSE 0 END), 0) as total_income,
  COUNT(DISTINCT CASE WHEN t.type = 'debit' THEN t.id END) as total_expense_count,
  COALESCE(SUM(CASE WHEN t.type = 'debit' THEN t.amount ELSE 0 END), 0) as total_expenses,
  COUNT(DISTINCT t.id) as total_transactions,
  u.created_at
FROM users u
LEFT JOIN wallets w ON u.id = w.user_id AND w.is_active = true
LEFT JOIN transactions t ON u.id = t.user_id
GROUP BY u.id, u.email, u.created_at;
```

## Row Level Security (RLS) Policies

Enable RLS on sensitive tables for Supabase:

```sql
-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view their own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Users can only see their own wallets
CREATE POLICY "Users can view their wallets"
ON wallets FOR SELECT
USING (user_id = auth.uid());

-- Users can only see their own transactions
CREATE POLICY "Users can view their transactions"
ON transactions FOR SELECT
USING (user_id = auth.uid());

-- Similar policies for other tables...
```

## Indexes for Performance

Key indexes for performance optimization:

```sql
-- User queries
CREATE INDEX idx_users_email_active ON users(email) WHERE email_verified = true;

-- Wallet queries
CREATE INDEX idx_wallets_balance ON wallets(balance);

-- Transaction queries
CREATE INDEX idx_transactions_date_range ON transactions(created_at DESC) WHERE status = 'completed';
CREATE INDEX idx_transactions_user_wallet ON transactions(user_id, wallet_id);

-- Payment queries
CREATE INDEX idx_payments_status_date ON payments(status, created_at DESC);

-- Composite indexes for common queries
CREATE INDEX idx_transactions_user_date ON transactions(user_id, created_at DESC);
CREATE INDEX idx_transactions_wallet_date ON transactions(wallet_id, created_at DESC);
```

## Setup Instructions

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Create a new project
3. Set up PostgreSQL database
4. Save connection details

### 2. Initialize Database

1. Go to SQL Editor in Supabase Dashboard
2. Create a new query
3. Copy and run all SQL statements above
4. Run the schema creation scripts

### 3. Enable Authentication

In Supabase:
1. Go to Authentication settings
2. Enable Email/Password provider
3. Configure JWT expiration
4. Set up email templates

### 4. Configure Environment Variables

Create `.env.local`:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_jwt_secret
```

### 5. Set Up Stripe Integration

1. Create Stripe account
2. Configure webhook endpoints
3. Store API keys in environment variables

## Backup & Disaster Recovery

1. **Regular Backups**: Enable automated backups in Supabase
2. **Point-in-Time Recovery**: Keep backups for at least 30 days
3. **Database Monitoring**: Set up alerts for unusual activity
4. **Data Archival**: Archive old transactions periodically

## Performance Considerations

1. **Connection Pooling**: Use pgBouncer for connection management
2. **Query Optimization**: Monitor slow queries with pg_stat_statements
3. **Partitioning**: Consider partitioning large tables (transactions) by date
4. **Caching**: Implement Redis caching for frequently accessed data
5. **Replication**: Set up read replicas for analytics queries

## Security Best Practices

1. ✅ Use parameterized queries (avoid SQL injection)
2. ✅ Enable RLS for data isolation
3. ✅ Encrypt sensitive columns (payment tokens)
4. ✅ Audit all financial transactions
5. ✅ Regular security audits
6. ✅ PCI compliance for payment data
7. ✅ GDPR compliance for user data
8. ✅ Regular penetration testing

## Migration from Mock Data

When moving from mock data to real database:

1. Create actual database tables
2. Implement Supabase client initialization
3. Update route handlers to use database queries
4. Migrate existing data if needed
5. Test thoroughly before production deployment
6. Monitor performance and set up alerts

## Future Enhancements

1. **Materialized Views**: For complex reporting queries
2. **Full-Text Search**: For transaction search
3. **Graph Queries**: For relationship analysis
4. **Temporal Tables**: For audit trail
5. **Sharding**: For horizontal scaling

---

**Version:** 1.0  
**Last Updated:** January 2024
