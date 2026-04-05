-- Dream customer named profiles
CREATE TABLE IF NOT EXISTS dream_customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  answers JSONB DEFAULT '{}' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dream_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own dream customers"
  ON dream_customers FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER dream_customers_updated_at
  BEFORE UPDATE ON dream_customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
