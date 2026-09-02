"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

export interface TrendPoint {
  label: string;
  value: number;
}

/**
 * An inline-SVG line chart. Hand-drawn rather than pulled from a charting
 * library because the only thing it must do, invert the Y axis for rank data,
 * is exactly what charting defaults fight you on, and because a 4kB component
 * beats a 400kB dependency for one chart.
 *
 * `invert` is the important prop: with rank data a LOWER value is better, so
 * the series has to be flipped for "up" on screen to mean "up" in reality.
 */
export function TrendLine({
  points,
  invert = false,
  height = 180,
  tone = "var(--color-primary)",
  showArea = true,
  valueSuffix = "",
  className,
}: {
  points: TrendPoint[];
  invert?: boolean;
  height?: number;
  tone?: string;
  showArea?: boolean;
  valueSuffix?: string;
  className?: string;
}) {
  const gradientId = useId();

  if (points.length < 2) {
    return (
      <div
        className={cn("grid place-items-center text-[12px] text-muted-foreground", className)}
        style={{ height }}
      >
        –
      </div>
    );
  }

  const width = 600;
  const padding = { top: 14, right: 8, bottom: 22, left: 8 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const values = points.map((point) => point.value);
  let min = Math.min(...values);
  let max = Math.max(...values);
  // A flat series would divide by zero; give it a nominal band instead.
  if (min === max) {
    min -= 1;
    max += 1;
  }

  const x = (index: number) =>
    padding.left + (index / (points.length - 1)) * plotWidth;

  const y = (value: number) => {
    const ratio = (value - min) / (max - min);
    // Inverted: the smallest value (best rank) is drawn at the top.
    const normalized = invert ? ratio : 1 - ratio;
    return padding.top + normalized * plotHeight;
  };

  const line = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${x(index)} ${y(point.value)}`)
    .join(" ");

  const area = `${line} L${x(points.length - 1)} ${padding.top + plotHeight} L${x(0)} ${
    padding.top + plotHeight
  } Z`;

  const last = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("w-full", className)}
      style={{ height }}
      role="img"
      aria-label={`Trend ending at ${last.value}${valueSuffix}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tone} stopOpacity="0.18" />
          <stop offset="100%" stopColor={tone} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Horizontal rules at quarter marks: read the level without an axis. */}
      {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
        <line
          key={fraction}
          x1={padding.left}
          x2={width - padding.right}
          y1={padding.top + fraction * plotHeight}
          y2={padding.top + fraction * plotHeight}
          stroke="var(--color-border)"
          strokeWidth="1"
        />
      ))}

      {showArea ? <path d={area} fill={`url(#${gradientId})`} /> : null}

      <path
        d={line}
        fill="none"
        stroke={tone}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      <circle
        cx={x(points.length - 1)}
        cy={y(last.value)}
        r="3.5"
        fill={tone}
        stroke="var(--color-card)"
        strokeWidth="2"
      />

      {points.map((point, index) => (
        <text
          key={point.label + index}
          x={x(index)}
          y={height - 6}
          textAnchor={index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"}
          className="numeric"
          fontSize="10"
          fill="var(--color-muted-foreground)"
        >
          {point.label}
        </text>
      ))}
    </svg>
  );
}
