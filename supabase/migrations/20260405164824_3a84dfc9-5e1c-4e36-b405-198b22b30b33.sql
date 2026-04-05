
-- 1. Fix audit_logs: Remove client-side INSERT, add server-side trigger instead
DROP POLICY IF EXISTS "Authenticated users can insert audit logs" ON public.audit_logs;

-- Create a restrictive INSERT policy that only allows service_role (server-side) inserts
-- By having no INSERT policy for authenticated users, client-side inserts are blocked by RLS

-- 2. Fix user_roles: Drop the overly broad ALL policy and replace with specific admin-only policies
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Only admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Fix saved_hooks: Add missing UPDATE policy
CREATE POLICY "Users can update own hooks"
  ON public.saved_hooks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
