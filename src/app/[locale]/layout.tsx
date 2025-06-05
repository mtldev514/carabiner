import { NextIntlClientProvider, useTranslations } from "next-intl";
import "../globals.css";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import "keen-slider/keen-slider.min.css";

export const metadata = {
  title: "Carabiner",
  description: "Calendrier communautaire queer",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const t = useTranslations("nav");
  return (
    <html lang={params.locale}>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider>
          <main className="flex-1">
            <nav className="flex justify-between items-center p-4 bg-[var(--color-bg)] shadow-md mb-6 border-b border-[var(--color-text)]">
              <div className="text-xl font-semibold tracking-tight">
                Carabiner
              </div>
              <div className="flex space-x-6 text-sm font-medium">
                <Link href="/" className="hover:text-[var(--color-accent)] transition underline">
                  {t("home")}
                </Link>
                <Link href="/submit" className="hover:text-[var(--color-accent)] transition underline">
                  {t("submit")}
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-[var(--color-accent)] transition underline"
                >
                  {t("contact")}
                </Link>
              </div>
              <div className="flex space-x-6 text-sm font-medium">
                <LanguageSwitcher />
              </div>
            </nav>

            {children}
          </main>
          <footer>
            Made with ❤️, rage, and DIY spirit in MTL. All art is human. All events are community.
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
