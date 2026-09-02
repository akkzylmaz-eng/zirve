import { cn } from "@/lib/cn";
import { site } from "@/config/site";

/**
 * Zirve's mark: a summit. Three ridge lines rising left to right with a filled
 * peak at the apex: the shape a rank chart makes when a keyword climbs, read
 * as a mountain. Pure geometry, no gradients, so it stays crisp at 16px in a
 * browser tab.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-[22px] w-[22px] shrink-0", className)}
      fill="none"
      aria-hidden
    >
      {/* back ridge */}
      <path
        d="M2 19.5 L8.5 8 L12.5 14.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />
      {/* main summit */}
      <path
        d="M6.5 19.5 L15 4.5 L23 19.5 Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      {/* snow cap: the part you are climbing toward */}
      <path d="M12.1 10.2 L15 4.5 L17.9 10.2 L15 8.6 Z" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-primary", className)}>
      <LogoMark />
      {withWordmark ? (
        <span className="font-display text-[18px] font-semibold text-foreground">
          {site.name}
        </span>
      ) : null}
    </span>
  );
}
