import { cn } from "@/lib/cn";
import { formatDelta, trendOf } from "../lib/rank";

const TONE = {
  climbed: "text-up",
  dropped: "text-down",
  flat: "text-muted-foreground",
} as const;

/**
 * The position-change pill. It never prints a bare signed integer: in rank data
 * "-3" is a three-position *gain*, and every reader who has not internalised
 * that reads it as a loss. An arrow plus a magnitude cannot be misread.
 */
export function PositionDelta({
  delta,
  className,
  showZero = true,
}: {
  delta: number;
  className?: string;
  showZero?: boolean;
}) {
  const trend = trendOf(delta);
  if (trend === "flat" && !showZero) return null;

  const description =
    trend === "climbed"
      ? `climbed ${Math.abs(delta)} positions`
      : trend === "dropped"
        ? `dropped ${Math.abs(delta)} positions`
        : "no change";

  return (
    <span
      className={cn("numeric text-[12px] font-semibold", TONE[trend], className)}
      title={description}
    >
      <span aria-hidden>{formatDelta(delta)}</span>
      <span className="sr-only">{description}</span>
    </span>
  );
}

/** The position number itself, greyed out when the keyword does not rank. */
export function PositionValue({
  position,
  className,
}: {
  position: number | null;
  className?: string;
}) {
  if (position === null) {
    return (
      <span className={cn("numeric text-[13px] text-muted-foreground/60", className)}>
        –
      </span>
    );
  }
  return (
    <span
      className={cn(
        "numeric inline-grid h-6 min-w-6 place-items-center rounded-sm px-1.5 text-[12.5px] font-semibold",
        position <= 3
          ? "bg-primary text-primary-foreground"
          : position <= 10
            ? "bg-primary-soft text-primary"
            : "bg-muted text-foreground",
        className,
      )}
    >
      {position}
    </span>
  );
}
