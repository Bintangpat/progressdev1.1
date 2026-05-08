-- ============================================
-- DevProgress — Add task_status column
-- Run this in Supabase SQL Editor
-- ============================================

-- Create task_status enum
CREATE TYPE task_status AS ENUM (
  'direncanakan',
  'dalam_pengerjaan',
  'sedang_direview',
  'pengujian',
  'selesai'
);

-- Add status column to tasks
ALTER TABLE tasks ADD COLUMN status task_status DEFAULT 'direncanakan';

-- Migrate existing completed tasks
UPDATE tasks SET status = 'selesai' WHERE is_completed = TRUE;

-- Index for filtering by status
CREATE INDEX idx_tasks_status ON tasks(status);
