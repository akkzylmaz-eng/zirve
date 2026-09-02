import { cn } from "@/lib/cn";

/**
 * A sparkline sized to sit inside a table row. Like TrendLine it takes
 * `invert` so rank series read the right way up, and it deliberately draws no
 * axis, label or dot; at this size they would be noise.
 */
export function MicroTrend({
  values,
  invert = false,
  tone = "var(--color-muted-foreground)",
  width = 68,
  height = 20,
  className,
}: {
  values: number[];
  invert?: boolean;
  tone?: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  if (values.length < 2) {
    return <span className={cn("inline-block text-muted-foreground", className)}>–</span>;
  }

  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) {
    min -= 1;
    max += 1;
  }

  const padding = 2;
  const path = values
    .map((value, index) => {
      const x = padding + (index / (values.length - 1)) * (width - padding * 2);
      const ratio = (value - min) / (max - min);
      const normalized = invert ? ratio : 1 - ratio;
      const y = padding + normalized * (height - padding * 2);
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      aria-hidden
    >
      <path
        d={path}
        fill="none"
        stroke={tone}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
