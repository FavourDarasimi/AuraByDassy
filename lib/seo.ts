import type { Metadata } from "next";

export const SITE_NAME = "AuraByDassy";
export const SITE_DESCRIPTION =
  "Premium clothing, accessories, shoes, and perfumes. Curated in Nigeria, delivered to your door.";
export const SITE_URL = "https://aurabyadassy.com";
export const SITE_LOGO = "/icon.svg";

export const SITE_KEYWORDS = [
  "AuraByDassy",
  "Nigerian fashion brand",
  "premium clothing Nigeria",
  "luxury fashion Africa",
  "online clothing store Nigeria",
  "buy clothes online Nigeria",
  "African fashion",
  "Lagos fashion",
  "women's fashion Nigeria",
  "men's clothing Nigeria",
  "accessories Nigeria",
  "Nigerian luxury brand",
];

export function buildMetadata(overrides: {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
}): Metadata {
  const url = overrides.path ? `${SITE_URL}${overrides.path}` : SITE_URL;

  return {
    title: overrides.title,
    description: overrides.description,
    alternates: { canonical: url },
    openGraph: {
      title: overrides.title,
      description: overrides.description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: overrides.ogImage
        ? [{ url: overrides.ogImage, width: 1200, height: 630 }]
        : [{ url: `${SITE_URL}${SITE_LOGO}`, width: 40, height: 40 }],
    },
    twitter: {
      card: "summary_large_image",
      title: overrides.title,
      description: overrides.description,
      images: overrides.ogImage
        ? [overrides.ogImage]
        : [`${SITE_URL}${SITE_LOGO}`],
    },
  };
}
