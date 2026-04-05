-- 20260405190000_security_advisor_cleanup.sql
-- Runs after earlier migrations and enforces final Security Advisor state.

-- =========================================
-- 1) audit_logs: no client-side integrity tampering
-- =========================================
ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_logs FORCE ROW LEVEL SECURITY;

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'audit_logs'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.audit_logs;', pol.policyname);
  END LOOP;
END $$;

-- Block all client writes explicitly.
REVOKE INSERT, UPDATE, DELETE ON public.audit_logs FROM anon, authenticated;

CREATE POLICY "Users can read own audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert audit logs"
ON public.audit_logs
FOR INSERT
TO service_role
WITH CHECK (true);

GRANT SELECT ON public.audit_logs TO authenticated;

-- =========================================
-- 2) user_roles: reset policies to safe minimum
-- =========================================
ALTER TABLE IF EXISTS public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_roles FORCE ROW LEVEL SECURITY;

DO $$
DECLARE
  pol record;
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

CREATE POLICY "Users can view own role rows"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM anon, authenticated;
GRANT SELECT ON public.user_roles TO authenticated;

-- =========================================
-- 3) has_role RPC exposure: deny direct client execution
-- =========================================
-- If any has_role overload exists in public, remove execute from client roles.
DO $$
DECLARE
  fn record;
BEGIN
  FOR fn IN
    SELECT p.oid::regprocedure AS signature
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'has_role'
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC;', fn.signature);
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM anon, authenticated;', fn.signature);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role;', fn.signature);
  END LOOP;
END $$;
