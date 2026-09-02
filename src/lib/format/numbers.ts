const EN = "en-US";

/** 75220 → "75,220" */
export function integer(value: number): string {
  return new Intl.NumberFormat(EN).format(Math.round(value));
}

/** 75220 → "75.2K", 1_400_000 → "1.40M". Used for search volumes. */
export function compact(value: number, digits = 2): string {
  const abs = Math.abs(value);
  if (abs >= 1e9) return `${(value / 1e9).toFixed(digits)}B`;
  if (abs >= 1e6) return `${(value / 1e6).toFixed(digits)}M`;
  if (abs >= 1e3) return `${(value / 1e3).toFixed(digits === 2 ? 1 : digits)}K`;
  return integer(value);
}

/** Always shows a sign: 3.1 → "+3.1%", -0.8 → "-0.8%". */
export function signedPercent(value: number, digits = 1): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(digits)}%`;
}

/** Percentage points rather than percent, for visibility deltas. */
export function points(value: number, digits = 1): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(digits)}pt`;
}

export function money(value: number, currency = "USD"): string {
  return new Intl.NumberFormat(EN, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}
