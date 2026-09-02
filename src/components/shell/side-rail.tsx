"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appNav } from "@/config/navigation";
import { site } from "@/config/site";
import { Logo } from "@/components/ui/logo";
import { Icon } from "@/components/ui/icon";
import { useLanguage } from "@/components/i18n/language-provider";
import { cn } from "@/lib/cn";

/**
 * The persistent left rail. It stays a rail rather than a collapsible drawer
 * because there are only four destinations. A toggle would cost a click to
 * save nothing.
 */
export function SideRail({ badges }: { badges?: Partial<Record<string, number>> }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className="hidden w-[218px] shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link href="/dashboard" aria-label={site.name}>
          <Logo />
        </Link>
      </div>

      <div className="flex flex-col gap-0.5 p-2">
        {appNav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const badge = item.badge ? badges?.[item.badge] : undefined;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13.5px] transition-colors",
                active
                  ? "bg-primary-soft font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon name={item.icon} className="h-[15px] w-[15px]" />
              <span>{t(item.label)}</span>
              {badge ? (
                <span className="numeric ml-auto rounded-sm bg-critical-soft px-1.5 py-px text-[10.5px] font-semibold text-critical">
                  {badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto border-t border-border p-3">
        <PropertyCard />
      </div>
    </nav>
  );
}

function PropertyCard() {
  const { ui } = useLanguage();
  return (
    <div className="rounded-md border border-border px-2.5 py-2">
      <p className="eyebrow">{ui.property}</p>
      <p className="numeric mt-1 truncate text-[12.5px] font-medium">
        {site.trackedProperty}
      </p>
      <p className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-up pulse-dot" />
        {ui.demoBadge}
      </p>
    </div>
  );
}
