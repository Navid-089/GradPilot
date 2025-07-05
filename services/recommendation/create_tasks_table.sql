-- Create tasks table for GradPilot recommendation service
CREATE TABLE IF NOT EXISTS tasks (
    task_id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    task_type VARCHAR(20) NOT NULL,
    university_id BIGINT,
    professor_id BIGINT,
    scholarship_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint to users table
    CONSTRAINT fk_tasks_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Ensure only one ID is set based on task type
    CONSTRAINT check_task_type_ids CHECK (
        (task_type = 'UNIVERSITY' AND university_id IS NOT NULL AND professor_id IS NULL AND scholarship_id IS NULL) OR
        (task_type = 'PROFESSOR' AND professor_id IS NOT NULL AND university_id IS NULL AND scholarship_id IS NULL) OR
        (task_type = 'SCHOLARSHIP' AND scholarship_id IS NOT NULL AND university_id IS NULL AND professor_id IS NULL)
    )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_task_type ON tasks(task_type);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_university_id ON tasks(university_id);
CREATE INDEX IF NOT EXISTS idx_tasks_professor_id ON tasks(professor_id);
CREATE INDEX IF NOT EXISTS idx_tasks_scholarship_id ON tasks(scholarship_id);

-- Create unique constraint to prevent duplicate saves
CREATE UNIQUE INDEX IF NOT EXISTS idx_tasks_unique_user_item ON tasks(user_id, task_type, COALESCE(university_id, professor_id, scholarship_id)); 