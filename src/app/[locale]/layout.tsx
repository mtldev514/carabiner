import { NextIntlClientProvider } from "next-intl";
import "../globals.css";
import HamburgerMenu from "@/components/HamburgerMenu";
import Footer from "@/components/Footer";
import "keen-slider/keen-slider.min.css";
import Link from "next/link";

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
  return (
    <html lang={params.locale}>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider>
          <main className="flex-1">
            <nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 shadow-md mb-6 border-b dark:border-gray-800">
              <Link href={`/${params.locale}`} className="text-xl font-semibold tracking-tight">
                Carabiner
              </Link>
              <HamburgerMenu />
            </nav>

            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
