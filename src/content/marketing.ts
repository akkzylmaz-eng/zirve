import type { Localized } from "@/lib/i18n/config";

export interface FeatureCopy {
  icon: string;
  title: Localized;
  body: Localized;
}

export interface PricingTier {
  name: string;
  price: string;
  period: Localized;
  tagline: Localized;
  features: Localized[];
  cta: Localized;
  featured?: boolean;
}

export interface FaqEntry {
  question: Localized;
  answer: Localized;
}

export const hero = {
  eyebrow: {
    tr: "Sıralama takibi · teknik denetim",
    en: "Rank tracking · technical audit",
  } satisfies Localized,
  title: {
    tr: "Ortalama pozisyon bir metrik değil.",
    en: "Average position is not a metric.",
  } satisfies Localized,
  accent: {
    tr: "Kazanabildiğin tıklama öyle.",
    en: "The clicks you can win are.",
  } satisfies Localized,
  subtitle: {
    tr: "Zirve her kelimeyi tıklama eğrisine göre puanlar: 90 bin aramalık bir kelimede 8. sıra, 200 aramalıkta 1. sıradan çok daha değerlidir. Panelde gördüğün her sayı bu mantıkla hesaplanır.",
    en: "Zirve scores every keyword against a click-through curve: position 8 on a 90k-volume phrase is worth far more than position 1 on a 200-volume one. Every number on the dashboard is built that way.",
  } satisfies Localized,
  primaryCta: { tr: "Paneli aç", en: "Open the dashboard" } satisfies Localized,
  secondaryCta: { tr: "Nasıl hesaplıyor?", en: "How it scores" } satisfies Localized,
};

export const features: FeatureCopy[] = [
  {
    icon: "trending-up",
    title: { tr: "Görünürlük puanı", en: "Visibility score" },
    body: {
      tr: "Kelime setinin kazanabileceği toplam tıklamanın ne kadarını aldığını ölçer. Tavan sabit olduğu için puan hafta hafta ve rakiplerle karşılaştırılabilir kalır.",
      en: "Measures how much of the clicks your keyword set could earn you actually take. The ceiling is fixed by the set, so the score stays comparable week to week and against rivals.",
    },
  },
  {
    icon: "bar-chart-3",
    title: { tr: "Pozisyon dağılımı", en: "Position distribution" },
    body: {
      tr: "Ortalama yerine bantlar: İlk 3, 4–10, 11–20, 21–50, 50+. Kelimelerin sayfa bire geçip geçmediğini ortalama saklar, dağılım gösterir.",
      en: "Bands instead of an average: top 3, 4–10, 11–20, 21–50, 50+. An average hides keywords crossing onto page one; the distribution shows it.",
    },
  },
  {
    icon: "git-merge",
    title: { tr: "Yamyamlık tespiti", en: "Cannibalization detection" },
    body: {
      tr: "Aynı niyet için yarışan kendi sayfalarını bulur. Satır satır bakınca hepsi sağlıklı görünür; sorunu ancak niyete göre gruplayınca görürsün.",
      en: "Finds your own pages competing for one intent. Row by row they all look healthy; the problem is only visible once you group by intent.",
    },
  },
  {
    icon: "scan-search",
    title: { tr: "Etkiye göre denetim", en: "Audit by impact" },
    body: {
      tr: "Teknik bulgular önem sırasına değil, maliyetine göre dizilir. İki sayfadaki kritik hata, üç yüz sayfadaki uyarıdan sonra gelir.",
      en: "Technical findings are ordered by what they cost, not by their label. A critical on two pages ranks below a warning on three hundred.",
    },
  },
  {
    icon: "target",
    title: { tr: "Ulaşılabilir fırsatlar", en: "Reachable opportunities" },
    body: {
      tr: "Ham hacim her zaman imkansız kelimeyi gösterir. Zirve zorluk ve mesafeyi indirger, bu çeyrek gerçekten kazanabileceğin kelimeleri öne çıkarır.",
      en: "Raw volume always points at the impossible head term. Zirve discounts difficulty and distance, surfacing what you can actually win this quarter.",
    },
  },
  {
    icon: "link-2",
    title: { tr: "Paylaşılabilir görünümler", en: "Shareable views" },
    body: {
      tr: "Her filtre URL'de yaşar. Baktığın ekranı olduğu gibi kopyalayıp ekibine gönderebilirsin.",
      en: "Every filter lives in the URL. Copy whatever you are looking at and send that exact view to your team.",
    },
  },
];

export const pricing: PricingTier[] = [
  {
    name: "Solo",
    price: "$0",
    period: { tr: "/ay", en: "/mo" },
    tagline: { tr: "Tek site, başlangıç için.", en: "One site, to get going." },
    features: [
      { tr: "100 takip edilen kelime", en: "100 tracked keywords" },
      { tr: "Haftalık sıralama taraması", en: "Weekly rank checks" },
      { tr: "Temel teknik denetim", en: "Basic technical audit" },
      { tr: "CSV dışa aktarma", en: "CSV export" },
    ],
    cta: { tr: "Ücretsiz başla", en: "Start free" },
  },
  {
    name: "Studio",
    price: "$39",
    period: { tr: "/ay", en: "/mo" },
    tagline: { tr: "Büyüyen ekipler için.", en: "For growing teams." },
    features: [
      { tr: "1.000 takip edilen kelime", en: "1,000 tracked keywords" },
      { tr: "Günlük sıralama taraması", en: "Daily rank checks" },
      { tr: "Tam site taraması", en: "Full site crawl" },
      { tr: "Yamyamlık tespiti", en: "Cannibalization detection" },
      { tr: "Rakip görünürlüğü", en: "Competitor visibility" },
    ],
    cta: { tr: "Studio'yu dene", en: "Try Studio" },
    featured: true,
  },
  {
    name: "Agency",
    price: "$129",
    period: { tr: "/ay", en: "/mo" },
    tagline: { tr: "Portföy yöneten ajanslar için.", en: "For agencies with a portfolio." },
    features: [
      { tr: "10.000 takip edilen kelime", en: "10,000 tracked keywords" },
      { tr: "Sınırsız proje", en: "Unlimited projects" },
      { tr: "Beyaz etiketli raporlar", en: "White-label reports" },
      { tr: "API erişimi", en: "API access" },
      { tr: "Öncelikli destek", en: "Priority support" },
    ],
    cta: { tr: "İletişime geç", en: "Talk to us" },
  },
];

export const faq: FaqEntry[] = [
  {
    question: {
      tr: "Denemek için API anahtarı gerekiyor mu?",
      en: "Do I need API keys to try it?",
    },
    answer: {
      tr: "Hayır. Zirve, 24 kelimelik gerçekçi bir veri setiyle demo modunda açılır; iki tane kasıtlı yamyamlık kümesi ve sırasız kelimeler dahil. DataForSEO veya Search Console anahtarlarını ekleyince demo veri gerçek sıralamalarla değişir.",
      en: "No. Zirve boots in demo mode on a realistic 24-keyword set, including two deliberate cannibalization clusters and some unranked phrases. Add DataForSEO or Search Console keys and the fixtures are replaced with real rankings.",
    },
  },
  {
    question: {
      tr: "Görünürlük puanı tam olarak nasıl hesaplanıyor?",
      en: "How exactly is the visibility score calculated?",
    },
    answer: {
      tr: "Her kelimenin hacmi, bulunduğu pozisyonun tıklama oranıyla çarpılır ve toplanır. Bu toplam, aynı kelimelerin tamamı 1. sırada olsaydı elde edilecek tıklamaya bölünür. Tavan kelime setine bağlı olduğu için, sıralaman değişmeden puan da değişmez.",
      en: "Each keyword's volume is multiplied by the CTR of its position and summed, then divided by what the same set would earn if every phrase sat at position 1. Because the ceiling depends on the set and not on how you rank, the score cannot drift on its own.",
    },
  },
  {
    question: {
      tr: "Neden negatif değişim iyi bir şey?",
      en: "Why is a negative change a good thing?",
    },
    answer: {
      tr: "SEO'da düşük pozisyon numarası daha iyidir; 14. sıradan 9'a çıkmak −5'lik bir değişimdir. Bu yüzden Zirve hiçbir yerde çıplak işaretli sayı göstermez, yön okuyla birlikte büyüklük gösterir: ▲5.",
      en: "In SEO a lower position number is better, so climbing from 14 to 9 is a change of −5. That is why Zirve never prints a bare signed number: it shows a direction arrow with a magnitude, ▲5.",
    },
  },
  {
    question: {
      tr: "Site sağlığı puanı ne anlama geliyor?",
      en: "What does the site health score mean?",
    },
    answer: {
      tr: "Ham bulgu sayısı değil, tarama boyutuna göre normalize edilmiş ağırlıklı bir ceza. 400 eksik alt metni olan bir site felaket gibi görünmez; para kazandıran sayfalarındaki üç kritik hata ise görünür.",
      en: "Not a raw issue count but a weighted penalty normalised by crawl size. A site with 400 missing alt attributes does not read as catastrophic, while three criticals on your money pages do.",
    },
  },
  {
    question: { tr: "Teknoloji ne?", en: "What is the stack?" },
    answer: {
      tr: "Next.js 16 App Router, React 19, Tailwind v4 ve TypeScript. Grafikler bağımlılık değil, elle yazılmış inline SVG. Alan mantığı saf fonksiyonlarda ve Vitest ile test ediliyor.",
      en: "Next.js 16 App Router, React 19, Tailwind v4 and TypeScript. The charts are hand-written inline SVG, not a dependency. The domain logic lives in pure functions covered by Vitest.",
    },
  },
];
