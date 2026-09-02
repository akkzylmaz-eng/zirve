/**
 * Crawl fixtures. `affected` counts are what drive the health score, so they
 * are sized against `pagesCrawled` rather than picked to look dramatic.
 */
import type { AuditIssue, CrawlSummary } from "@/features/audit/types";

export const crawl: CrawlSummary = {
  pagesCrawled: 1840,
  crawledAt: "2026-06-14T07:40:00Z",
};

export const auditIssues: AuditIssue[] = [
  {
    id: "iss-01",
    title: { tr: "Bozuk iç bağlantılar (4xx)", en: "Broken internal links (4xx)" },
    guidance: {
      tr: "Bu bağlantılar var olmayan sayfalara gidiyor. Hem tarama bütçesini harcıyor hem de bağlantı değerini boşa akıtıyor. Hedefi güncelle veya bağlantıyı kaldır.",
      en: "These links point at pages that no longer exist. They burn crawl budget and leak link equity. Update the target or remove the link.",
    },
    severity: "critical", category: "links", affected: 18, sample: "/pricing/legacy",
  },
  {
    id: "iss-02",
    title: { tr: "Eksik başlık etiketi", en: "Missing title tag" },
    guidance: {
      tr: "Başlık etiketi olmayan sayfa için Google kendi başlığını uyduruyor ve bu neredeyse her zaman daha kötü oluyor. 50–60 karakterlik benzersiz bir başlık yaz.",
      en: "With no title tag Google invents one, and it is almost always worse than yours. Write a unique 50–60 character title.",
    },
    severity: "critical", category: "meta", affected: 7, sample: "/blog/2024-recap",
  },
  {
    id: "iss-03",
    title: { tr: "Yönlendirilen sayfaya kanonik", en: "Canonical points to a redirect" },
    guidance: {
      tr: "Kanonik etiket yönlendirilen bir URL'yi gösteriyor. Google sinyali görmezden gelip kendi kanoniğini seçiyor. Doğrudan nihai URL'yi göster.",
      en: "The canonical tag points at a URL that redirects, so Google ignores the signal and picks its own. Point it straight at the final URL.",
    },
    severity: "critical", category: "indexing", affected: 5, sample: "/docs/getting-started",
  },
  {
    id: "iss-04",
    title: { tr: "Yavaş sayfalar (LCP > 4s)", en: "Slow pages (LCP > 4s)" },
    guidance: {
      tr: "En büyük içerik ögesi 4 saniyeden geç çiziliyor. Genellikle sebep sıkıştırılmamış hero görseli veya render'ı bloke eden script. Görseli boyutlandır, scripti ertele.",
      en: "The largest contentful paint lands after 4s. Usually an uncompressed hero image or a render-blocking script. Resize the image, defer the script.",
    },
    severity: "warning", category: "speed", affected: 31, sample: "/features/automation",
  },
  {
    id: "iss-05",
    title: { tr: "Yinelenen meta açıklama", en: "Duplicate meta description" },
    guidance: {
      tr: "Aynı açıklama birden fazla sayfada. Sıralamayı doğrudan düşürmez ama arama sonucunda tıklama oranını düşürür.",
      en: "The same description on multiple pages. It will not drop your rank directly, but it lowers click-through from the results page.",
    },
    severity: "warning", category: "meta", affected: 24, sample: "/blog/*",
  },
  {
    id: "iss-06",
    title: { tr: "Eksik görsel alt metni", en: "Missing image alt text" },
    guidance: {
      tr: "Alt metni olmayan görseller ekran okuyucular için erişilemez ve görsel aramada çıkmaz. Ne gösterdiğini yaz, anahtar kelime doldurma.",
      en: "Images without alt text are unreachable for screen readers and invisible in image search. Describe what is shown; do not stuff keywords.",
    },
    severity: "warning", category: "accessibility", affected: 96, sample: "/templates",
  },
  {
    id: "iss-07",
    title: { tr: "İnce içerik (300 kelime altı)", en: "Thin content (under 300 words)" },
    guidance: {
      tr: "Bu sayfalar bir arama niyetini karşılayacak kadar içerik taşımıyor. Ya genişlet ya da güçlü bir sayfayla birleştir.",
      en: "These pages do not carry enough substance to satisfy a search intent. Either expand them or merge them into a stronger page.",
    },
    severity: "warning", category: "content", affected: 42, sample: "/integrations/zapier",
  },
  {
    id: "iss-08",
    title: { tr: "H1 başlığı yok", en: "No H1 heading" },
    guidance: {
      tr: "H1, sayfanın konusunu bildiren en net sinyal. Sayfa başına tam olarak bir tane olmalı.",
      en: "The H1 is the clearest signal of what a page is about. There should be exactly one per page.",
    },
    severity: "notice", category: "content", affected: 12, sample: "/integrations",
  },
  {
    id: "iss-09",
    title: { tr: "Kanonik etiket eksik", en: "Missing canonical tag" },
    guidance: {
      tr: "Kanonik olmadan parametreli URL'ler ayrı sayfa sayılabilir ve sinyaller bölünür. Kendine referans veren bir kanonik ekle.",
      en: "Without a canonical, parameterised URLs can be treated as separate pages and signals get split. Add a self-referencing canonical.",
    },
    severity: "notice", category: "indexing", affected: 41, sample: "/docs/*",
  },
  {
    id: "iss-10",
    title: { tr: "Uzun yönlendirme zinciri", en: "Long redirect chain" },
    guidance: {
      tr: "Üç ve daha fazla adımlık zincirler her adımda değer kaybediyor ve mobilde gecikme ekliyor. Doğrudan nihai hedefe yönlendir.",
      en: "Chains of three or more hops lose value at each step and add latency on mobile. Redirect straight to the final destination.",
    },
    severity: "notice", category: "links", affected: 9, sample: "/old/help",
  },
];

export default auditIssues;
