import type { Metadata } from "next";
/**
 * Type: Instrument Sans for the interface, Instrument Serif for display, and
 * IBM Plex Mono for every number in the product. The serif is the deliberate
 * choice: in an app made almost entirely of dense tables it is what stops a
 * heading from reading as just another row of bold UI text.
 */
import { Instrument_Sans, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/i18n/language-provider";
import { site } from "@/config/site";
import { DEFAULT_LANGUAGE } from "@/lib/i18n/config";

const sans = Instrument_Sans({
  variable: "--font-sans-app",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const display = Instrument_Serif({
  variable: "--font-display-app",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono-app",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} · ${site.tagline[DEFAULT_LANGUAGE]}`,
    template: `%s · ${site.name}`,
  },
  description: site.description[DEFAULT_LANGUAGE],
  applicationName: site.name,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={DEFAULT_LANGUAGE}
      suppressHydrationWarning
      className={`h-full ${sans.variable} ${display.variable} ${mono.variable}`}
    >
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
