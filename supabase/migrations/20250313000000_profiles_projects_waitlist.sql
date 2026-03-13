-- LaunchList: profiles (extends auth.users), projects, waitlist_entries
-- Uses Supabase Auth for users; profiles store display name and preferences.

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  recipient_email text NOT NULL,
  slug text NOT NULL UNIQUE,
  button_color text NOT NULL DEFAULT '#D6FF2A',
  logo_url text,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  deleted_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_projects_owner ON public.projects(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS public.waitlist_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  email text NOT NULL,
  ip_hash text,
  user_agent text,
  referrer text,
  metadata jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_entries_project_email ON public.waitlist_entries(project_id, lower(email));
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_project ON public.waitlist_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_created ON public.waitlist_entries(created_at);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update own
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Projects: owner full access
CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = owner_user_id AND deleted_at IS NULL);

CREATE POLICY "Users can insert own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = owner_user_id);

CREATE POLICY "Users can delete own projects (soft delete)"
  ON public.projects FOR DELETE
  USING (auth.uid() = owner_user_id);

-- Public can read project by slug for public page (no auth)
CREATE POLICY "Public can view public projects by slug"
  ON public.projects FOR SELECT
  USING (is_public = true AND deleted_at IS NULL);

-- Waitlist entries: only project owner can read/export; insert is via Edge Function (service role or anon with policy)
CREATE POLICY "Project owners can view waitlist entries"
  ON public.waitlist_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = waitlist_entries.project_id AND p.owner_user_id = auth.uid()
    )
  );

-- Allow anon insert for join (rate limiting done in Edge Function)
CREATE POLICY "Anyone can join waitlist (insert)"
  ON public.waitlist_entries FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = waitlist_entries.project_id AND p.is_public = true AND p.deleted_at IS NULL
    )
  );

CREATE POLICY "Project owners can delete waitlist entries"
  ON public.waitlist_entries FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = waitlist_entries.project_id AND p.owner_user_id = auth.uid()
    )
  );

-- Trigger to keep updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
