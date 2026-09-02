import { cn } from "@/lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

/**
 * Zirve's surface primitive. Deliberately not a "Card": panels are ruled
 * containers with a header rail, and content inside them is separated by
 * hairlines rather than by padding and shadow.
 */
export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <section className={cn("panel overflow-hidden", className)} {...props} />;
}

export function PanelHeader({
  title,
  hint,
  action,
  className,
}: {
  title: ReactNode;
  hint?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex items-start justify-between gap-4 border-b border-border px-4 py-3",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="text-[13.5px] font-semibold tracking-tight">{title}</h2>
        {hint ? (
          <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{hint}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function PanelBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />;
}
