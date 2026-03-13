/**
 * Slug generation for waitlist URLs.
 * Normalizes to [a-z0-9-] only; used for public URL paths.
 */

const SLUG_REGEX = /^[a-z0-9-]+$/;

/**
 * Generates a URL-safe slug from a product name.
 * - Lowercases, replaces spaces/special chars with single hyphens
 * - Output contains only [a-z0-9-]
 */
export function slugify(text: string): string {
  if (text == null || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    || "waitlist";
}

/**
 * Validates that a slug contains only allowed characters [a-z0-9-].
 */
export function isValidSlug(slug: string): boolean {
  if (slug == null || typeof slug !== "string") return false;
  return SLUG_REGEX.test(slug) && slug.length > 0;
}

/**
 * Returns a validation error message for slug, or null if valid.
 */
export function getSlugError(slug: string): string | null {
  if (slug == null || typeof slug !== "string" || slug.length === 0) {
    return "URL slug is required";
  }
  if (!SLUG_REGEX.test(slug)) {
    return "Only lowercase letters, numbers, and hyphens allowed";
  }
  return null;
}
