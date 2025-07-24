-- Migration script to add payment functionality to GradPilot
-- Run this script to add the necessary tables and columns

-- Add last_payment column to users table
ALTER TABLE users 
ADD COLUMN last_payment TIMESTAMP WITH TIME ZONE;

-- Create payments table
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    transaction_id VARCHAR(255) NOT NULL UNIQUE,
    validation_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'BDT',
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    subscription_type VARCHAR(20) NOT NULL DEFAULT 'MONTHLY',
    subscription_start TIMESTAMP WITH TIME ZONE,
    subscription_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_subscription_end ON payments(subscription_end);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE payments IS 'Store payment transactions and subscription information';
COMMENT ON COLUMN payments.payment_status IS 'Payment status: PENDING, SUCCESS, FAILED, CANCELLED';
COMMENT ON COLUMN payments.subscription_type IS 'Subscription type: MONTHLY, YEARLY';
COMMENT ON COLUMN users.last_payment IS 'Timestamp of the last successful payment';

-- Insert sample pricing configuration (optional)
-- You can adjust these values as needed
INSERT INTO payments (user_id, transaction_id, amount, currency, payment_status, subscription_type, subscription_start, subscription_end, created_at, updated_at) VALUES 
(1, 'SAMPLE_TRANSACTION', 500.00, 'BDT', 'SUCCESS', 'MONTHLY', NOW(), NOW() + INTERVAL '1 month', NOW(), NOW())
ON CONFLICT (transaction_id) DO NOTHING;
