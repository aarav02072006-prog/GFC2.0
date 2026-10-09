-- Run after 002_supabase_custom_sessions.sql in the Supabase SQL Editor.

SELECT
  c.relname AS table_name,
  c.relrowsecurity AS rls_enabled,
  c.relforcerowsecurity AS rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('Users', 'sessions')
ORDER BY c.relname;

SELECT
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('Users', 'sessions')
ORDER BY table_name, ordinal_position;

SELECT
  c.conrelid::regclass AS table_name,
  c.conname AS constraint_name,
  pg_get_constraintdef(c.oid) AS definition
FROM pg_constraint c
WHERE c.conrelid = 'public.sessions'::regclass
ORDER BY c.conname;

SELECT
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'sessions'
ORDER BY policyname;

SELECT
  has_table_privilege('anon', 'public."Users"', 'SELECT') AS anon_can_select_users,
  has_table_privilege('authenticated', 'public."Users"', 'SELECT') AS authenticated_can_select_users,
  has_table_privilege('service_role', 'public."Users"', 'SELECT') AS service_role_can_select_users,
  has_table_privilege('service_role', 'public."Users"', 'INSERT') AS service_role_can_insert_users,
  has_table_privilege('service_role', 'public."Users"', 'UPDATE') AS service_role_can_update_users;

SELECT
  has_table_privilege('anon', 'public.sessions', 'SELECT') AS anon_can_select_sessions,
  has_table_privilege('authenticated', 'public.sessions', 'SELECT') AS authenticated_can_select_sessions,
  has_table_privilege('service_role', 'public.sessions', 'SELECT') AS service_role_can_select_sessions,
  has_table_privilege('service_role', 'public.sessions', 'INSERT') AS service_role_can_insert_sessions,
  has_table_privilege('service_role', 'public.sessions', 'UPDATE') AS service_role_can_update_sessions;

-- Optional, safe cleanup when run by an authorized server/DB administrator.
-- This permanently removes only expired or revoked session rows; omit it if session
-- history must be retained. It is not run automatically by the application.
-- DELETE FROM public.sessions
-- WHERE expires_at <= now() OR revoked_at IS NOT NULL;
