-- Add branding-related columns to projects for LaunchList branding customization.
-- social_image_url: OG/social preview image URL; public_link: canonical public page URL;
-- branding_version: incremented on publish for cache busting.

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS social_image_url text,
  ADD COLUMN IF NOT EXISTS public_link text,
  ADD COLUMN IF NOT EXISTS branding_version integer NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.projects.social_image_url IS 'Open Graph / social preview image URL (CDN)';
COMMENT ON COLUMN public.projects.public_link IS 'Canonical public waitlist page URL';
COMMENT ON COLUMN public.projects.branding_version IS 'Incremented on publish for cache invalidation';
