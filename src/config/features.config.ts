/**
 * Feature flags. Toggle features on/off without touching component code.
 *
 * Each flag has a default below and can be overridden at runtime via a
 * matching `NEXT_PUBLIC_FEATURE_*` env var (set in `.env`).
 *   - "true" or "1" -> enabled
 *   - "false" or "0" -> disabled
 *   - unset         -> default value
 */

const envFlag = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined || value === "") return fallback;
  return value === "true" || value === "1";
};

export const FEATURES = {
  /** Diagonal "Up to 15% off" ribbon on the home page hero. */
  discountBanner: envFlag(process.env.NEXT_PUBLIC_FEATURE_DISCOUNT_BANNER, false),
} as const;
