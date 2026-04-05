-- Security hardening for Supabase Advisor findings
-- 1) Prevent self-escalation to admin via user_roles
-- 2) Ensure users can update their own saved_hooks

-- -----------------------------------------------------------------------------
-- user_roles: lock down writes from client roles
-- -----------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.user_roles ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_roles'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_roles;', pol.policyname);
  END LOOP;
END $$;

-- Users may only read their own roles.
CREATE POLICY "Users can view own role rows"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Block direct writes from anon/authenticated (service_role bypasses RLS).
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM anon, authenticated;
GRANT SELECT ON public.user_roles TO authenticated;

-- -----------------------------------------------------------------------------
-- saved_hooks: allow users to fully manage their own rows
-- -----------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.saved_hooks ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'saved_hooks'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.saved_hooks;', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "Users can read own saved hooks"
  ON public.saved_hooks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved hooks"
  ON public.saved_hooks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved hooks"
  ON public.saved_hooks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved hooks"
  ON public.saved_hooks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
