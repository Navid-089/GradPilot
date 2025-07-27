-- Password Reset Tokens Table Migration
-- This script creates the password_reset_tokens table for handling password reset functionality

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_password_reset_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_password_reset_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_expiry ON password_reset_tokens(expiry_date);
CREATE INDEX IF NOT EXISTS idx_password_reset_used ON password_reset_tokens(used);

-- Comment for documentation
COMMENT ON TABLE password_reset_tokens IS 'Stores password reset tokens with expiration and usage tracking';
COMMENT ON COLUMN password_reset_tokens.token IS 'Unique token for password reset, typically UUID';
COMMENT ON COLUMN password_reset_tokens.user_id IS 'References the user requesting password reset';
COMMENT ON COLUMN password_reset_tokens.expiry_date IS 'Token expiration timestamp (typically 1 hour from creation)';
COMMENT ON COLUMN password_reset_tokens.used IS 'Tracks if token has been used to prevent reuse';
COMMENT ON COLUMN password_reset_tokens.created_at IS 'Timestamp when token was created';
