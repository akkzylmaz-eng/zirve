import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { site } from "@/config/site";
import { MarketingNav } from "./marketing-nav";

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <MarketingNav />
      <main className="flex-1">{children}</main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-[12px] text-muted-foreground">
              © {new Date().getFullYear()} {site.legalName}
            </span>
          </div>
          <div className="flex items-center gap-5 text-[12.5px] text-muted-foreground">
            <Link href="/login" className="transition-colors hover:text-foreground">
              Sign in
            </Link>
            <a
              href={site.studio.url}
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors hover:text-foreground"
            >
              {site.studio.name}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
