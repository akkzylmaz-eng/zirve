"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Panel } from "@/components/ui/panel";
import { DistributionBar } from "@/features/keywords/components/distribution-bar";
import { useLanguage } from "@/components/i18n/language-provider";
import { hero, features, pricing, faq } from "@/content/marketing";
import type { BucketSlice } from "@/features/keywords/lib/distribution";
import type { VisibilityReport } from "@/features/keywords/lib/visibility";
import { integer } from "@/lib/format/numbers";
import { cn } from "@/lib/cn";

export function LandingPage({
  report,
  slices,
  clusters,
  health,
  keywordCount,
}: {
  report: VisibilityReport;
  slices: BucketSlice[];
  clusters: number;
  health: number;
  keywordCount: number;
}) {
  const { t, ui, language } = useLanguage();
  const tr = language === "tr";

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="ruled-paper border-b border-border">
        <div className="mx-auto max-w-[1100px] px-6 py-20 lg:py-28">
          <p className="eyebrow">{t(hero.eyebrow)}</p>
          <h1 className="mt-4 max-w-[760px] font-display text-[42px] leading-[1.08] sm:text-[58px]">
            {t(hero.title)}
            <br />
            <span className="text-primary">{t(hero.accent)}</span>
          </h1>
          <p className="mt-6 max-w-[560px] text-[15px] leading-relaxed text-muted-foreground">
            {t(hero.subtitle)}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard">
              <Button size="lg">{t(hero.primaryCta)}</Button>
            </Link>
            <a href="#how">
              <Button size="lg" variant="outline">
                {t(hero.secondaryCta)}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Live numbers from the demo workspace ─────────────────────────── */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-px bg-border lg:grid-cols-4">
          <Metric
            value={`${report.score}%`}
            label={tr ? "Görünürlük" : "Visibility"}
            hint={tr ? `${keywordCount} kelime` : `${keywordCount} keywords`}
          />
          <Metric
            value={integer(report.headroom)}
            label={tr ? "Kaçan tıklama" : "Clicks on the table"}
            hint={tr ? "aylık" : "per month"}
          />
          <Metric
            value={String(clusters)}
            label={tr ? "Yamyamlık kümesi" : "Cannibal clusters"}
            hint={tr ? "tespit edildi" : "detected"}
          />
          <Metric
            value={String(health)}
            label={tr ? "Site sağlığı" : "Site health"}
            hint={tr ? "100 üzerinden" : "out of 100"}
          />
        </div>
      </section>

      {/* ── The one idea ─────────────────────────────────────────────────── */}
      <section id="how" className="border-b border-border">
        <div className="mx-auto grid max-w-[1100px] gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">{tr ? "Nasıl puanlıyor" : "How it scores"}</p>
            <h2 className="mt-3 font-display text-[32px] leading-tight">
              {tr
                ? "Bir pozisyon, ancak kazandırdığı tıklama kadar değerlidir."
                : "A position is only worth the clicks it earns."}
            </h2>
            <div className="mt-6 flex flex-col gap-4 text-[14px] leading-relaxed text-muted-foreground">
              <p>
                {tr
                  ? "Zirve her kelimenin hacmini, bulunduğu pozisyonun tıklama oranıyla çarpar. Sonra bunu, aynı kelimelerin tamamı birinci sırada olsaydı elde edilecek tıklamaya böler."
                  : "Zirve multiplies each keyword's volume by the click-through rate of its position, then divides by what the same set would earn if every phrase sat at position 1."}
              </p>
              <p>
                {tr
                  ? "Tavan kelime setine bağlı olduğu için puan haftadan haftaya ve aynı kelimeleri takip eden rakiplerle karşılaştırılabilir kalır. Sıralaman değişmeden puanın da değişmez."
                  : "Because that ceiling depends on the set and not on how you happen to rank, the score stays comparable week to week and against rivals tracking the same phrases. It cannot drift on its own."}
              </p>
            </div>
          </div>

          <Panel>
            <div className="border-b border-border px-4 py-3">
              <p className="eyebrow">
                {tr ? "Demo çalışma alanı · dağılım" : "Demo workspace · distribution"}
              </p>
            </div>
            <div className="p-4">
              <DistributionBar slices={slices} />
            </div>
          </Panel>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1100px] px-6 py-20">
          <h2 className="font-display text-[32px] leading-tight">
            {tr ? "Neler var" : "What is in it"}
          </h2>
          <div className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.icon}>
                <Icon name={feature.icon} className="h-[18px] w-[18px] text-primary" />
                <h3 className="mt-3 text-[15px] font-semibold">{t(feature.title)}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
                  {t(feature.body)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="border-b border-border">
        <div className="mx-auto max-w-[1100px] px-6 py-20">
          <h2 className="font-display text-[32px] leading-tight">
            {tr ? "Fiyatlandırma" : "Pricing"}
          </h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {pricing.map((tier) => (
              <Panel
                key={tier.name}
                className={cn(
                  "flex flex-col p-5",
                  tier.featured && "border-primary ring-1 ring-primary",
                )}
              >
                <p className="text-[13px] font-semibold">{tier.name}</p>
                <p className="mt-3 flex items-baseline gap-1">
                  <span className="numeric text-[32px] font-semibold leading-none">
                    {tier.price}
                  </span>
                  <span className="text-[13px] text-muted-foreground">
                    {t(tier.period)}
                  </span>
                </p>
                <p className="mt-2 text-[12.5px] text-muted-foreground">
                  {t(tier.tagline)}
                </p>
                <ul className="mt-5 flex flex-1 flex-col gap-2">
                  {tier.features.map((item) => (
                    <li key={item.en} className="flex items-start gap-2 text-[13px]">
                      <Check className="mt-[3px] h-3.5 w-3.5 shrink-0 text-primary" />
                      {t(item)}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="mt-6">
                  <Button
                    variant={tier.featured ? "primary" : "outline"}
                    className="w-full"
                  >
                    {t(tier.cta)}
                  </Button>
                </Link>
              </Panel>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="border-b border-border bg-card">
        <div className="mx-auto max-w-[720px] px-6 py-20">
          <h2 className="font-display text-[32px] leading-tight">
            {tr ? "Sık sorulanlar" : "Frequently asked"}
          </h2>
          <div className="mt-8 ruled border-t border-border">
            {faq.map((entry) => (
              <FaqRow key={entry.question.en} entry={entry} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Close ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1100px] px-6 py-20 text-center">
        <h2 className="mx-auto max-w-[520px] font-display text-[32px] leading-tight">
          {tr
            ? "Panel demo veriyle dolu ve hazır. Anahtar gerekmiyor."
            : "The dashboard is loaded with demo data and ready. No keys needed."}
        </h2>
        <Link href="/dashboard" className="mt-7 inline-block">
          <Button size="lg">{ui.openDashboard}</Button>
        </Link>
      </section>
    </>
  );
}

function Metric({
  value,
  label,
  hint,
}: {
  value: string;
  label: string;
  hint: string;
}) {
  return (
    <div className="bg-card px-6 py-7">
      <p className="numeric text-[30px] font-semibold leading-none">{value}</p>
      <p className="mt-2 text-[13px] font-medium">{label}</p>
      <p className="mt-0.5 text-[11.5px] text-muted-foreground">{hint}</p>
    </div>
  );
}

function FaqRow({ entry }: { entry: (typeof faq)[number] }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-[14px] font-medium">{t(entry.question)}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <p className="pb-4 text-[13.5px] leading-relaxed text-muted-foreground">
          {t(entry.answer)}
        </p>
      ) : null}
    </div>
  );
}
