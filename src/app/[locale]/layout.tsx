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
            <nav
              className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-400 via-sky-400 to-fuchsia-500 dark:from-emerald-600 dark:via-sky-600 dark:to-fuchsia-600 shadow-md mb-6 border-b dark:border-gray-800 text-white rounded-b-lg nav-gradient"
            >
              <div className="text-xl font-semibold tracking-tight">
                Carabiner
              </div>
              <div className="flex space-x-6 text-sm font-medium">
                <Link href="/" className="hover:text-pink-600 dark:hover:text-pink-400 transition">
                  {t("home")}
                </Link>
                <Link href="/submit" className="hover:text-pink-600 dark:hover:text-pink-400 transition">
                  {t("submit")}
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-pink-600 dark:hover:text-pink-400 transition"
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
