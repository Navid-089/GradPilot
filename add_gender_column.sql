-- Manual database migration script
-- Run this SQL script in your PostgreSQL database to add the gender column

-- Add gender column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(10);

-- Add a comment to describe the column
COMMENT ON COLUMN users.gender IS 'Optional gender field - values: male, female, other';

-- Verify the column was added
SELECT column_name, data_type, is_nullable, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'gender';
