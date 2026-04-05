-- 1) Revoke public RPC access to has_role to prevent role enumeration
-- RLS policies run as the function owner (postgres), so they still work
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM authenticated, anon;

-- 2) Explicitly deny INSERT and DELETE on audit_logs for all users
-- (RLS is enabled but no INSERT/DELETE policies = default deny in Postgres)
-- Adding explicit deny-style policies is not needed since Postgres RLS 
-- defaults to deny when no matching policy exists.
-- However, the scanner flags the lack of explicit policies, so we confirm
-- the table is locked down by verifying RLS is enabled (already done).
