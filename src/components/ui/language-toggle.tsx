"use client";

import { LANGUAGES, LANGUAGE_LABEL } from "@/lib/i18n/config";
import { useLanguage } from "@/components/i18n/language-provider";
import { cn } from "@/lib/cn";

export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border border-border p-[2px] text-[11px] font-semibold",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {LANGUAGES.map((candidate) => (
        <button
          key={candidate}
          onClick={() => setLanguage(candidate)}
          aria-pressed={language === candidate}
          className={cn(
            "cursor-pointer rounded-[3px] px-1.5 py-0.5 transition-colors",
            language === candidate
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {LANGUAGE_LABEL[candidate]}
        </button>
      ))}
    </div>
  );
}
