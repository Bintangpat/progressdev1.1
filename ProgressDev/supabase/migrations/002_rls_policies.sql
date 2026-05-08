-- ============================================
-- DevProgress — Row Level Security Policies
-- Run AFTER 001_initial_schema.sql
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- profiles policies
-- ============================================
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- projects policies
-- ============================================
-- Developer can CRUD own projects
CREATE POLICY "Owner can do everything with own projects"
  ON projects FOR ALL
  USING (auth.uid() = user_id);

-- Public can view projects via slug (for public page)
CREATE POLICY "Anyone can view project by slug"
  ON projects FOR SELECT
  USING (true);

-- ============================================
-- tasks policies
-- ============================================
-- Developer can manage tasks in their projects
CREATE POLICY "Owner can manage tasks"
  ON tasks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Public can view tasks (for public project page)
CREATE POLICY "Anyone can view tasks"
  ON tasks FOR SELECT
  USING (true);

-- ============================================
-- checklist_items policies
-- ============================================
CREATE POLICY "Owner can manage checklist items"
  ON checklist_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN projects ON projects.id = tasks.project_id
      WHERE tasks.id = checklist_items.task_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view checklist items"
  ON checklist_items FOR SELECT
  USING (true);

-- ============================================
-- task_screenshots policies
-- ============================================
CREATE POLICY "Owner can manage screenshots"
  ON task_screenshots FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      JOIN projects ON projects.id = tasks.project_id
      WHERE tasks.id = task_screenshots.task_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view screenshots"
  ON task_screenshots FOR SELECT
  USING (true);

-- ============================================
-- comments policies
-- ============================================
-- Anyone can read comments on any project
CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  USING (true);

-- Anyone can add comments (public feature)
CREATE POLICY "Anyone can add comments"
  ON comments FOR INSERT
  WITH CHECK (true);

-- Only project owner can delete comments
CREATE POLICY "Owner can delete comments"
  ON comments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = comments.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- ============================================
-- Storage: screenshots bucket
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('screenshots', 'screenshots', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Authenticated users can upload screenshots"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'screenshots'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view screenshots"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'screenshots');

CREATE POLICY "Authenticated users can delete their screenshots"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'screenshots'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
