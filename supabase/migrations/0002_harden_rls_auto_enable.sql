-- Revoke public EXECUTE on the Supabase-generated rls_auto_enable() utility.
-- It is an internal function and must not be callable via the REST API.
revoke execute on function public.rls_auto_enable() from anon, authenticated;
