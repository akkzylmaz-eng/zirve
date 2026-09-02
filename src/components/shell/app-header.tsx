"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appNav } from "@/config/navigation";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useLanguage } from "@/components/i18n/language-provider";
import { cn } from "@/lib/cn";

/**
 * A slim header that names the current view and carries the global controls.
 * On mobile it also becomes the navigation, since the rail is hidden there.
 */
export function AppHeader() {
  const pathname = usePathname();
  const { t, ui } = useLanguage();

  const current = appNav.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
      <div className="flex h-14 items-center gap-3 px-4">
        <Link href="/dashboard" className="md:hidden" aria-label="Zirve">
          <Logo withWordmark={false} />
        </Link>

        <h1 className="font-display text-[17px] font-semibold">
          {current ? t(current.label) : ""}
        </h1>

        <div className="ml-auto flex items-center gap-1.5">
          <LanguageToggle />
          <ThemeToggle />
          <Link
            href="/settings"
            className="flex items-center gap-2 rounded-md border border-border py-1 pl-1 pr-2.5 text-[12.5px] font-medium transition-colors hover:bg-muted"
          >
            <span className="grid h-6 w-6 place-items-center rounded-[4px] bg-primary text-[11px] font-semibold text-primary-foreground">
              A
            </span>
            <span className="hidden sm:inline">{ui.account}</span>
          </Link>
        </div>
      </div>

      {/* Mobile navigation; the rail is desktop-only. */}
      <div className="flex gap-1 overflow-x-auto border-t border-border px-3 py-1.5 md:hidden">
        {appNav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-[12.5px] transition-colors",
                active
                  ? "bg-primary-soft font-medium text-primary"
                  : "text-muted-foreground",
              )}
            >
              <Icon name={item.icon} className="h-3.5 w-3.5" />
              {t(item.label)}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
