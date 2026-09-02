const EN = "en-US";

export function shortDate(input: Date | string): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat(EN, { day: "2-digit", month: "short" }).format(date);
}

export function fullDate(input: Date | string): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat(EN, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/** "3h ago" style relative time, anchored to `now` so it is testable. */
export function timeAgo(input: Date | string, now: Date = new Date()): string {
  const date = typeof input === "string" ? new Date(input) : input;
  const minutes = Math.floor((now.getTime() - date.getTime()) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return fullDate(date);
}
