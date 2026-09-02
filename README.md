<div align="center">

# Zirve

**Average position is not a metric. The clicks you can win are.**

SEO rank tracking and technical site audit, scored against a click-through
curve instead of an arithmetic mean.

[Türkçe](#türkçe) · [English](#english)

[**Canlı demo / Live demo →**](https://zirve-peach.vercel.app)

[![live](https://img.shields.io/badge/demo-zirve-1f2328?style=flat-square)](https://zirve-peach.vercel.app)
[![ci](https://img.shields.io/github/actions/workflow/status/akkzylmaz-eng/zirve/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/akkzylmaz-eng/zirve/actions)

</div>

---

## English

### The idea

Almost every rank tracker leads with *average position*, and average position
is a bad number. It weights a #1 for a 200-volume phrase exactly the same as a
#40 for a 90,000-volume one, and it goes *up* when you add ambitious new
keywords to your set, which is the opposite of what happened.

Zirve throws it out. Every headline figure in the product is built on an
organic click-through curve, so a position is only ever worth the traffic it
can actually earn:

```
visibility = Σ(volume × ctr(position)) / Σ(volume × ctr(1))
```

The denominator is fixed by the keyword set rather than by how you happen to
rank today, which makes the score comparable week over week and across
competitors tracking the same phrases. Adding a huge phrase you rank nowhere
for correctly *drops* it.

### What it does

| | |
|---|---|
| **Visibility scoring** | Share of the clicks your set could earn, plus the headroom left on the table. |
| **Position distribution** | Six bands instead of an average, because 11 → 9 crosses onto page one and roughly doubles clicks while 44 → 42 changes nothing. |
| **Cannibalization detection** | Clusters phrases by token overlap and flags intents served by more than one of your own URLs. Invisible from a rank table, since every row looks healthy alone. |
| **Audit by impact** | Findings ordered by what they cost the health score, not by their severity label. A critical on two pages ranks below a warning on three hundred. |
| **Reachable opportunities** | Upside discounted by difficulty and distance, so the list points at what you can win this quarter rather than at the impossible head term. |
| **Shareable views** | Every filter lives in the URL; the screen you are looking at is a link. |

### Running it

```bash
npm install
npm run dev      # → http://localhost:3000
```

There is nothing to configure. The app boots on a bundled 24-keyword fixture
set that deliberately includes unranked phrases, two genuine cannibalization
clusters and a spread across every position band, so each view has something
real to say. Wiring up a data source (see `.env.example`) swaps the fixtures
for live data; nothing downstream changes, because everything consumes the same
`Keyword[]`.

```bash
npm run check    # typecheck + lint + tests
npm test         # 99 unit tests over the domain logic
```

### How it is built

```
src/
  config/          site identity, navigation, data sources: three small
                   modules rather than one god-object
  content/         marketing copy, kept out of the components
  data/            fixtures: keywords, audit findings, workspace
  features/
    keywords/
      lib/         ctr-curve · visibility · distribution · cannibalization
                   opportunities · filters · export-csv · rank
      components/  rank-grid · keyword-panel · position-delta ·
                   distribution-bar · cannibalization-list
    audit/
      lib/health   weighted, crawl-size-normalised scoring
  components/      shell · charts · ui primitives
  lib/             cn · i18n · formatters
tests/             99 tests, all against the pure domain layer
```

A few decisions worth naming:

- **The domain layer is pure functions.** Visibility, health, clustering and
  opportunity ranking are all plain functions over plain data, with no React,
  no fetch and no framework. That is why it is testable, and the tests
  earned their keep: they caught five real bugs during the build, including an
  inverted delta in bucket movement and a Unicode normalisation bug that split
  Turkish words in the tokenizer.
- **Rank inversion lives in one place.** A lower position number is better, so
  a *negative* delta is a gain. That inversion is easy to get backwards at a
  call site, so `features/keywords/lib/rank.ts` owns it and the UI never
  re-derives it. Nothing in the app prints a bare signed integer for a rank
  change; it prints `▲3`.
- **Charts are hand-written inline SVG.** The one thing they must do, invert
  the Y axis for rank series, is exactly what charting library defaults fight
  you on, and a 4 kB component beats a 400 kB dependency for two chart types.
- **View state is URL state.** Search, filters and sort are serialised into
  query params (defaults omitted, so clean views get clean URLs) and read back
  with `useSearchParams`.
- **The language preference is an external store.** It lives in localStorage
  and can change from another tab, so it is read through `useSyncExternalStore`
  with a server snapshot rather than `useState` plus an effect.

### Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
Vitest. No database required.

---

## Türkçe

### Fikir

Neredeyse her sıralama takip aracı **ortalama pozisyonu** öne çıkarır ve
ortalama pozisyon kötü bir sayıdır. 200 aramalık bir kelimedeki 1. sırayı,
90.000 aramalık bir kelimedeki 40. sırayla aynı ağırlıkta sayar; üstelik sete
iddialı yeni kelimeler eklediğinde *yükselir*. Oysa olan bunun tam tersidir.

Zirve bu metriği tamamen bırakır. Üründeki her ana sayı, organik tıklama
oranı eğrisi üzerine kurulur; böylece bir pozisyon ancak gerçekten
kazandırabileceği trafik kadar değerli olur:

```
görünürlük = Σ(hacim × ctr(pozisyon)) / Σ(hacim × ctr(1))
```

Paydadaki tavan, bugün nasıl sıralandığına değil kelime setine bağlıdır. Bu
yüzden puan hafta hafta ve aynı kelimeleri takip eden rakiplerle
karşılaştırılabilir kalır. Hiç sıralanmadığın büyük bir kelimeyi sete eklemek
puanı düşürür; doğrusu da budur.

### Neler yapıyor

| | |
|---|---|
| **Görünürlük puanı** | Setinin kazanabileceği tıklamanın ne kadarını aldığın ve masada kalan pay. |
| **Pozisyon dağılımı** | Ortalama yerine altı bant. 11 → 9 sayfa bire geçiştir ve tıklamayı yaklaşık ikiye katlar; 44 → 42 hiçbir şey değiştirmez. |
| **Yamyamlık tespiti** | Kelimeleri token örtüşmesine göre kümeler ve birden fazla kendi URL'inin hizmet ettiği niyetleri işaretler. Sıralama tablosundan görünmez, çünkü tek tek her satır sağlıklı durur. |
| **Etkiye göre denetim** | Bulgular etiketlerine göre değil, sağlık puanına maliyetlerine göre sıralanır. İki sayfadaki kritik hata, üç yüz sayfadaki uyarıdan sonra gelir. |
| **Ulaşılabilir fırsatlar** | Kazanç, zorluk ve mesafeyle indirgenir; liste imkansız kelimeyi değil bu çeyrek kazanabileceğini gösterir. |
| **Paylaşılabilir görünümler** | Her filtre URL'de yaşar; baktığın ekran bir linktir. |

### Çalıştırma

```bash
npm install
npm run dev      # → http://localhost:3000
```

Yapılandırılacak bir şey yok. Uygulama, 24 kelimelik paketlenmiş bir veri
setiyle açılır; set kasıtlı olarak sırasız kelimeler, iki gerçek yamyamlık
kümesi ve her pozisyon bandına yayılmış kayıtlar içerir, böylece her ekranın
söyleyecek gerçek bir şeyi olur. Bir veri kaynağı bağladığında
(bkz. `.env.example`) demo veri canlı veriyle değişir; alt katmanlarda hiçbir
şey değişmez, çünkü her şey aynı `Keyword[]` tipini tüketir.

```bash
npm run check    # tip kontrolü + lint + testler
npm test         # alan mantığı üzerinde 99 birim testi
```

### Nasıl kurulu

Birkaç kararı ayrıca söylemeye değer:

- **Alan katmanı saf fonksiyonlardan oluşur.** Görünürlük, sağlık, kümeleme ve
  fırsat sıralamasının hepsi React'sız, fetch'siz, framework'süz, düz veri
  üzerinde çalışan düz fonksiyonlardır. Test edilebilir olmalarının sebebi budur ve
  testler hakkını verdi: geliştirme sırasında beşi gerçek olan hataları
  yakaladılar; bunlardan biri bant hareketinde ters çevrilmiş bir delta,
  diğeri tokenizer'da Türkçe kelimeleri bölen bir Unicode normalizasyon
  hatasıydı.
- **Sıralama tersliği tek bir yerde yaşar.** Düşük pozisyon numarası daha
  iyidir, dolayısıyla *negatif* delta bir kazançtır. Bu terslik çağrı
  noktasında kolayca ters çevrilir, bu yüzden `features/keywords/lib/rank.ts`
  sahipliği alır ve arayüz bunu bir daha türetmez. Uygulamada hiçbir yerde
  sıralama değişimi için çıplak işaretli sayı yazılmaz; `▲3` yazılır.
- **Grafikler elle yazılmış inline SVG.** Yapmaları gereken tek özel iş,
  sıralama serisi için Y eksenini ters çevirmek, grafik kütüphanelerinin
  varsayılanlarıyla en çok çatıştığın yerdir; iki grafik türü için 4 kB'lık bir
  bileşen, 400 kB'lık bir bağımlılığı yener.
- **Görünüm durumu URL durumudur.** Arama, filtreler ve sıralama query
  parametrelerine yazılır (varsayılanlar atlanır, böylece temiz görünümler
  temiz URL alır).
- **Dil tercihi harici bir store.** localStorage'da yaşar ve başka bir
  sekmeden değişebilir; bu yüzden `useState` + effect yerine sunucu
  anlık görüntüsü olan `useSyncExternalStore` ile okunur.

### Teknoloji

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
Vitest. Veritabanı gerekmez.

## Lisans / License

Tüm hakları saklıdır. Bu depo, kaynak kodu okunup incelenebilsin diye
yayımlanmıştır; açık kaynak değildir. Ayrıntılar için `LICENSE` dosyasına bakın.

All rights reserved. This repository is published so its source can be read and
evaluated; it is not open-source software. See `LICENSE` for the details.

---

<div align="center">
<sub>Built by <a href="https://github.com/akkzylmaz-eng">Vyesna</a></sub>
</div>
