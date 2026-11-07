import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { ROCK_GENRES, ROCK_LEGENDS, STREAM_SOURCE_URL } from "@/data/rockTvData";
import { SITE_NAME, SITE_URL, localeUrl } from "@/lib/site";

const LANG_TAG: Record<Locale, string> = { ro: "ro-RO", en: "en-US" };

export function StructuredData({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const pageUrl = localeUrl(locale);
  const orgId = `${SITE_URL}/#organization`;
  const siteId = `${SITE_URL}/#website`;
  const channelId = `${SITE_URL}/#channel`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: Object.values(LANG_TAG),
        publisher: { "@id": orgId },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: dict.meta.title,
        description: dict.meta.description,
        inLanguage: LANG_TAG[locale],
        isPartOf: { "@id": siteId },
        about: { "@id": channelId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE_URL}/images/hero-arena-stage.webp`,
          width: 1376,
          height: 768,
        },
        mainEntity: { "@id": `${pageUrl}#legends` },
      },
      {
        "@type": "TelevisionChannel",
        "@id": channelId,
        name: SITE_NAME,
        broadcastChannelId: "CH-01",
        broadcastServiceTier: "Free",
        inBroadcastLineup: {
          "@type": "BroadcastService",
          name: `${SITE_NAME} Live`,
          url: STREAM_SOURCE_URL,
          broadcaster: { "@id": orgId },
          broadcastDisplayName: SITE_NAME,
          inLanguage: LANG_TAG[locale],
          genre: ROCK_GENRES.map((g) => g.name[locale]),
        },
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#legends`,
        name: dict.legends.heading,
        itemListElement: ROCK_LEGENDS.map((legend, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": legend.kind,
            name: legend.name,
            description: legend.influenceStatement[locale],
            genre: "Rock",
            sameAs: [legend.wikipedia],
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped so "</script>" can never break out
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
