CREATE TABLE IF NOT EXISTS payments (
 id UUID PRIMARY KEY,
 customer_name VARCHAR(160) NOT NULL,
 customer_email VARCHAR(200) NOT NULL,
 amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
 status VARCHAR(20) NOT NULL CHECK (status IN ('pending','success','failed')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);
