CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

ALTER POLICY "profiles_read" ON public.profiles USING (id = auth.uid() OR private.has_role(auth.uid(), 'super_admin') OR private.has_role(auth.uid(), 'site_admin'));
ALTER POLICY "profiles_update" ON public.profiles USING (id = auth.uid() OR private.has_role(auth.uid(), 'super_admin') OR private.has_role(auth.uid(), 'site_admin')) WITH CHECK (id = auth.uid() OR private.has_role(auth.uid(), 'super_admin') OR private.has_role(auth.uid(), 'site_admin'));
ALTER POLICY "roles_read_own_or_super" ON public.user_roles USING (user_id = auth.uid() OR private.has_role(auth.uid(), 'super_admin'));
ALTER POLICY "states_super_write" ON public.states USING (private.has_role(auth.uid(), 'super_admin')) WITH CHECK (private.has_role(auth.uid(), 'super_admin'));
ALTER POLICY "locations_super_write" ON public.locations USING (private.has_role(auth.uid(), 'super_admin')) WITH CHECK (private.has_role(auth.uid(), 'super_admin'));
ALTER POLICY "sites_read" ON public.sites USING (private.has_role(auth.uid(), 'super_admin') OR EXISTS (SELECT 1 FROM public.site_admin_assignments a WHERE a.site_id = sites.id AND a.admin_id = auth.uid()) OR EXISTS (SELECT 1 FROM public.site_user_assignments u WHERE u.site_id = sites.id AND u.user_id = auth.uid()));
ALTER POLICY "sites_super_write" ON public.sites USING (private.has_role(auth.uid(), 'super_admin')) WITH CHECK (private.has_role(auth.uid(), 'super_admin'));
ALTER POLICY "admin_assignments_read" ON public.site_admin_assignments USING (admin_id = auth.uid() OR private.has_role(auth.uid(), 'super_admin'));
ALTER POLICY "admin_assignments_super_write" ON public.site_admin_assignments USING (private.has_role(auth.uid(), 'super_admin')) WITH CHECK (private.has_role(auth.uid(), 'super_admin'));
ALTER POLICY "user_assignments_read" ON public.site_user_assignments USING (user_id = auth.uid() OR private.has_role(auth.uid(), 'super_admin') OR EXISTS (SELECT 1 FROM public.site_admin_assignments a WHERE a.site_id = site_user_assignments.site_id AND a.admin_id = auth.uid()));
ALTER POLICY "user_assignments_admin_write" ON public.site_user_assignments USING (private.has_role(auth.uid(), 'super_admin') OR EXISTS (SELECT 1 FROM public.site_admin_assignments a WHERE a.site_id = site_user_assignments.site_id AND a.admin_id = auth.uid())) WITH CHECK (private.has_role(auth.uid(), 'super_admin') OR EXISTS (SELECT 1 FROM public.site_admin_assignments a WHERE a.site_id = site_user_assignments.site_id AND a.admin_id = auth.uid()));
ALTER POLICY "invoices_read" ON public.invoices USING (submitted_by = auth.uid() OR private.has_role(auth.uid(), 'super_admin') OR EXISTS (SELECT 1 FROM public.site_admin_assignments a WHERE a.site_id = invoices.site_id AND a.admin_id = auth.uid()));
ALTER POLICY "invoices_review" ON public.invoices USING (private.has_role(auth.uid(), 'super_admin') OR EXISTS (SELECT 1 FROM public.site_admin_assignments a WHERE a.site_id = invoices.site_id AND a.admin_id = auth.uid())) WITH CHECK (private.has_role(auth.uid(), 'super_admin') OR EXISTS (SELECT 1 FROM public.site_admin_assignments a WHERE a.site_id = invoices.site_id AND a.admin_id = auth.uid()));

DROP FUNCTION public.has_role(uuid, public.app_role);