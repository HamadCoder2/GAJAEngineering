CREATE TYPE public.app_role AS ENUM ('super_admin', 'site_admin', 'site_user');
CREATE TYPE public.record_status AS ENUM ('active', 'inactive');
CREATE TYPE public.invoice_status AS ENUM ('pending', 'approved', 'rejected', 's3');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 2 AND 100),
  email text NOT NULL CHECK (char_length(email) <= 255),
  phone text CHECK (phone IS NULL OR phone ~ '^[0-9+ -]{7,20}$'),
  employee_id text UNIQUE,
  avatar_url text,
  status public.record_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE TABLE public.states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE CHECK (char_length(name) BETWEEN 2 AND 100),
  status public.record_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.states TO authenticated;
GRANT ALL ON public.states TO service_role;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id uuid NOT NULL REFERENCES public.states(id) ON DELETE RESTRICT,
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 180),
  status public.record_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (state_id, name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.locations TO authenticated;
GRANT ALL ON public.locations TO service_role;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid NOT NULL REFERENCES public.locations(id) ON DELETE RESTRICT,
  code text NOT NULL UNIQUE CHECK (char_length(code) BETWEEN 2 AND 30),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 180),
  status public.record_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sites TO authenticated;
GRANT ALL ON public.sites TO service_role;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.site_admin_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  site_id uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (admin_id, site_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_admin_assignments TO authenticated;
GRANT ALL ON public.site_admin_assignments TO service_role;
ALTER TABLE public.site_admin_assignments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.site_user_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  site_id uuid NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  assigned_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, site_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_user_assignments TO authenticated;
GRANT ALL ON public.site_user_assignments TO service_role;
ALTER TABLE public.site_user_assignments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text NOT NULL UNIQUE CHECK (char_length(invoice_number) BETWEEN 2 AND 60),
  site_id uuid NOT NULL REFERENCES public.sites(id) ON DELETE RESTRICT,
  submitted_by uuid NOT NULL,
  vendor text NOT NULL CHECK (char_length(vendor) BETWEEN 2 AND 150),
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  invoice_date date NOT NULL,
  description text CHECK (description IS NULL OR char_length(description) <= 1000),
  file_path text,
  status public.invoice_status NOT NULL DEFAULT 'pending',
  rejection_reason text CHECK (rejection_reason IS NULL OR char_length(rejection_reason) <= 500),
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER states_updated BEFORE UPDATE ON public.states FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER locations_updated BEFORE UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER sites_updated BEFORE UPDATE ON public.sites FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER invoices_updated BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "profiles_read" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'site_admin'));
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'site_admin')) WITH CHECK (id = auth.uid() OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'site_admin'));
CREATE POLICY "roles_read_own_or_super" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "states_read" ON public.states FOR SELECT TO authenticated USING (true);
CREATE POLICY "states_super_write" ON public.states FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin')) WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "locations_read" ON public.locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "locations_super_write" ON public.locations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin')) WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "sites_read" ON public.sites FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin') OR EXISTS (SELECT 1 FROM public.site_admin_assignments a WHERE a.site_id = id AND a.admin_id = auth.uid()) OR EXISTS (SELECT 1 FROM public.site_user_assignments u WHERE u.site_id = id AND u.user_id = auth.uid()));
CREATE POLICY "sites_super_write" ON public.sites FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin')) WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "admin_assignments_read" ON public.site_admin_assignments FOR SELECT TO authenticated USING (admin_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "admin_assignments_super_write" ON public.site_admin_assignments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin')) WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "user_assignments_read" ON public.site_user_assignments FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin') OR EXISTS (SELECT 1 FROM public.site_admin_assignments a WHERE a.site_id = site_id AND a.admin_id = auth.uid()));
CREATE POLICY "user_assignments_admin_write" ON public.site_user_assignments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin') OR EXISTS (SELECT 1 FROM public.site_admin_assignments a WHERE a.site_id = site_id AND a.admin_id = auth.uid())) WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR EXISTS (SELECT 1 FROM public.site_admin_assignments a WHERE a.site_id = site_id AND a.admin_id = auth.uid()));
CREATE POLICY "invoices_read" ON public.invoices FOR SELECT TO authenticated USING (submitted_by = auth.uid() OR public.has_role(auth.uid(), 'super_admin') OR EXISTS (SELECT 1 FROM public.site_admin_assignments a WHERE a.site_id = site_id AND a.admin_id = auth.uid()));
CREATE POLICY "invoices_create" ON public.invoices FOR INSERT TO authenticated WITH CHECK (submitted_by = auth.uid() AND EXISTS (SELECT 1 FROM public.site_user_assignments u WHERE u.site_id = site_id AND u.user_id = auth.uid()));
CREATE POLICY "invoices_review" ON public.invoices FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'super_admin') OR EXISTS (SELECT 1 FROM public.site_admin_assignments a WHERE a.site_id = site_id AND a.admin_id = auth.uid())) WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR EXISTS (SELECT 1 FROM public.site_admin_assignments a WHERE a.site_id = site_id AND a.admin_id = auth.uid()));

CREATE INDEX idx_locations_state ON public.locations(state_id);
CREATE INDEX idx_sites_location ON public.sites(location_id);
CREATE INDEX idx_admin_assignments_admin ON public.site_admin_assignments(admin_id);
CREATE INDEX idx_user_assignments_user ON public.site_user_assignments(user_id);
CREATE INDEX idx_invoices_submitter ON public.invoices(submitted_by);
CREATE INDEX idx_invoices_site_status ON public.invoices(site_id, status);