"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useLanguage } from "@/components/i18n/language-provider";
import { marketingNav } from "@/config/navigation";

export function MarketingNav() {
  const { t, ui } = useLanguage();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1100px] items-center gap-6 px-6">
        <Link href="/" aria-label="Zirve">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {marketingNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(item.label)}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LanguageToggle className="hidden sm:inline-flex" />
          <ThemeToggle />
          <Link href="/dashboard">
            <Button size="sm">{ui.openDashboard}</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
