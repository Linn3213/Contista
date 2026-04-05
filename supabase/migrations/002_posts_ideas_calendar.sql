-- Saved posts (finished drafts / published content)
CREATE TABLE IF NOT EXISTS saved_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  platform TEXT DEFAULT 'linkedin',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','idea','published','scheduled')),
  purpose TEXT,
  audience TEXT,
  tone TEXT,
  dream_customer_id UUID REFERENCES dream_customers(id) ON DELETE SET NULL,
  scheduled_date DATE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own posts"
  ON saved_posts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER saved_posts_updated_at
  BEFORE UPDATE ON saved_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
