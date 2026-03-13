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

-- RPC: return public project by slug with waitlist count (for public page).
CREATE OR REPLACE FUNCTION public.get_public_waitlist_page(p_slug text)
RETURNS TABLE(project json, waitlist_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    to_json(p.*) AS project,
    (SELECT count(*)::bigint FROM public.waitlist_entries w WHERE w.project_id = p.id) AS waitlist_count
  FROM public.projects p
  WHERE p.slug = p_slug
    AND p.is_public = true
    AND p.deleted_at IS NULL
  LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_waitlist_page(text) TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_waitlist_page(text) TO authenticated;
