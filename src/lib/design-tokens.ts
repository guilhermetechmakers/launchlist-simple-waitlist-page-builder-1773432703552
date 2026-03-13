/**
 * Design system tokens — single source of truth for colors and defaults.
 * Values align with CSS custom properties in src/index.css (--primary, --accent, etc.).
 */

/** Neon CTA primary — matches --primary (214 255 42) */
export const NEON_PRIMARY_HEX = "#D6FF2A";

/** Coral accent for secondary data highlights — matches --accent (255 122 90) */
export const CORAL_ACCENT_HEX = "#FF7A5A";

/** Default button color for waitlist CTA (uses neon primary) */
export const DEFAULT_BUTTON_COLOR = NEON_PRIMARY_HEX;
