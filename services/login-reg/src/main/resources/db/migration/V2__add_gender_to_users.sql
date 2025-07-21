-- Add gender column to users table
ALTER TABLE users ADD COLUMN gender VARCHAR(10);

-- Add a comment to describe the column
COMMENT ON COLUMN users.gender IS 'Optional gender field - values: male, female, other';

-- Create index for gender if needed for reporting
-- CREATE INDEX idx_users_gender ON users(gender);
