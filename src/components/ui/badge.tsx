import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

type Tone =
  | "neutral"
  | "primary"
  | "up"
  | "down"
  | "critical"
  | "warn"
  | "notice";

const TONES: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary-soft text-primary",
  up: "bg-up-soft text-up",
  down: "bg-down-soft text-down",
  critical: "bg-critical-soft text-critical",
  warn: "bg-warn-soft text-warn",
  notice: "bg-notice-soft text-notice",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-sm px-1.5 py-0.5 text-[11px] font-medium",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
