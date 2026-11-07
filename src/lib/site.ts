import type { Locale } from "@/i18n/config";

// Set NEXT_PUBLIC_SITE_URL in production so canonical, hreflang, sitemap and
// Open Graph URLs resolve to the real domain.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

export const SITE_NAME = "ROCK TV";

export function localeUrl(locale: Locale, hash = ""): string {
  return `${SITE_URL}/${locale}${hash}`;
}

export function youtubeThumb(id: string, quality: "hq" | "mq" | "maxres" = "hq") {
  const file = quality === "maxres" ? "maxresdefault" : `${quality}default`;
  return `https://i.ytimg.com/vi/${id}/${file}.jpg`;
}

/** `origin` enables the iframe postMessage API so the page hears player errors. */
export function youtubeEmbed(id: string, { autoplay = true, origin }: { autoplay?: boolean; origin?: string } = {}) {
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  if (origin) {
    params.set("enablejsapi", "1");
    params.set("origin", origin);
  }
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export function youtubeWatch(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
}
