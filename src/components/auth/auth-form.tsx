"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { TextField, FieldLabel } from "@/components/ui/field";
import { Logo } from "@/components/ui/logo";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/components/i18n/language-provider";
import { site } from "@/config/site";

/**
 * Login and signup share one component because they differ by a single field.
 * No auth provider is wired up, so both paths do the same thing: drop the
 * visitor into the dashboard. The note at the bottom says so plainly rather
 * than pretending a real session was created.
 */
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { ui, language } = useLanguage();
  const [pending, setPending] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    router.push("/dashboard");
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-[340px]">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/">
              <Logo />
            </Link>
            <LanguageToggle />
          </div>

          <h1 className="font-display text-[28px] leading-tight">
            {mode === "login" ? ui.welcomeBack : ui.createAccount}
          </h1>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
            {ui.authBlurb}
          </p>

          <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4">
            {mode === "signup" ? (
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="name">{ui.fullName}</FieldLabel>
                <TextField id="name" name="name" autoComplete="name" required />
              </div>
            ) : null}

            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="email">{ui.email}</FieldLabel>
              <TextField
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="password">{ui.password}</FieldLabel>
              <TextField
                id="password"
                name="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
              />
            </div>

            <Button type="submit" size="lg" disabled={pending} className="mt-1">
              {mode === "login" ? ui.signIn : ui.getStarted}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[11.5px] text-muted-foreground">{ui.orContinueWith}</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => router.push("/dashboard")}
          >
            {ui.continueDemo}
          </Button>

          <p className="mt-6 text-center text-[12.5px] text-muted-foreground">
            {mode === "login" ? ui.noAccount : ui.haveAccount}{" "}
            <Link
              href={mode === "login" ? "/signup" : "/login"}
              className="font-medium text-primary hover:underline"
            >
              {mode === "login" ? ui.getStarted : ui.signIn}
            </Link>
          </p>

          <p className="mt-6 rounded-md border border-border bg-muted px-3 py-2 text-[11.5px] leading-relaxed text-muted-foreground">
            {ui.demoNote}
          </p>
        </div>
      </div>

      {/* The right panel states the product's one idea, so the sign-in screen is
          not a dead end for someone who arrived without context. */}
      <aside className="hidden flex-col justify-center border-l border-border bg-card px-12 lg:flex">
        <p className="eyebrow">{site.name}</p>
        <p className="mt-4 max-w-[420px] font-display text-[30px] leading-[1.2]">
          {language === "tr"
            ? "Ortalama pozisyon bir metrik değil. Kazanabildiğin tıklama öyle."
            : "Average position is not a metric. The clicks you can win are."}
        </p>
        <p className="mt-4 max-w-[400px] text-[13.5px] leading-relaxed text-muted-foreground">
          {language === "tr" ? site.description.tr : site.description.en}
        </p>
      </aside>
    </div>
  );
}
