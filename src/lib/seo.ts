import type { Metadata } from "next";

/**
 * Builds canonical + hreflang alternates for a given path.
 * Next.js does not deep-merge `alternates` between layout and page metadata —
 * any page that sets its own canonical must re-declare `languages` too, or
 * the layout's hreflang tags silently disappear on that page.
 */
export function buildAlternates(path: string): Metadata["alternates"] {
  return {
    canonical: path,
    languages: {
      "en-US": path,
      "en-GB": path,
      en: path,
      "x-default": path,
    },
  };
}
