/**
 * Optional data sources. Zirve runs entirely on the bundled fixtures when none
 * of these are configured. `isConfigured` is what the settings page reads to
 * show a live/demo badge per source.
 */
export interface DataSource {
  key: string;
  name: string;
  envVars: string[];
  docsUrl: string;
  /** What this source replaces once it is wired up. */
  replaces: { tr: string; en: string };
}

export const dataSources: DataSource[] = [
  {
    key: "dataforseo",
    name: "DataForSEO",
    envVars: ["DATAFORSEO_LOGIN", "DATAFORSEO_PASSWORD"],
    docsUrl: "https://docs.dataforseo.com/v3/",
    replaces: {
      tr: "SERP pozisyonları, arama hacmi ve kelime zorluğu.",
      en: "SERP positions, search volume and keyword difficulty.",
    },
  },
  {
    key: "search-console",
    name: "Google Search Console",
    envVars: ["GSC_CLIENT_ID", "GSC_CLIENT_SECRET", "GSC_REFRESH_TOKEN"],
    docsUrl: "https://developers.google.com/webmaster-tools/search-console-api-original",
    replaces: {
      tr: "Doğrulanmış mülkün için gerçek gösterim, tıklama ve ortalama pozisyon.",
      en: "Real impressions, clicks and average position for your verified property.",
    },
  },
  {
    key: "crawler",
    name: "Site Crawler",
    envVars: ["CRAWLER_API_URL", "CRAWLER_API_KEY"],
    docsUrl: "https://crawlee.dev/docs/quick-start",
    replaces: {
      tr: "Teknik denetim bulguları ve taranan sayfa sayısı.",
      en: "Technical audit findings and the crawled page count.",
    },
  },
  {
    key: "supabase",
    name: "Supabase",
    envVars: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
    docsUrl: "https://supabase.com/dashboard/project/_/settings/api",
    replaces: {
      tr: "Kimlik doğrulama ve sıralama geçmişinin kalıcı saklanması.",
      en: "Authentication and durable storage of rank history.",
    },
  },
];

/** True when every env var a source needs is present at build/runtime. */
export function isConfigured(source: DataSource): boolean {
  return source.envVars.every((key) => Boolean(process.env[key]));
}

/** Demo mode = no source is fully configured. */
export function isDemoMode(): boolean {
  return !dataSources.some(isConfigured);
}
