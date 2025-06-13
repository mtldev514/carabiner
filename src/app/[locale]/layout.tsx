import { NextIntlClientProvider } from "next-intl";
import "../globals.css";
import HamburgerMenu from "@/components/HamburgerMenu";
import AddEventButton from "@/components/AddEventButton";
import Footer from "@/components/Footer";
import InstallPrompt from "@/components/InstallPrompt";
import "keen-slider/keen-slider.min.css";
import Link from "next/link";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params

  return (
    <html lang={locale}>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider >
          <main className="flex-1">
            <nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 shadow-md mb-6 border-b dark:border-gray-800">
              <Link href={`/${locale}`} className="text-xl font-semibold tracking-tight">
                CARABINER.GAY
              </Link>
              <div className="flex items-center gap-4">
                <AddEventButton />
                <HamburgerMenu />
              </div>
            </nav>

            {children}
          </main>
          <InstallPrompt />
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
