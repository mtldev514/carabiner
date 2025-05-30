import { NextIntlClientProvider, useTranslations } from 'next-intl'
import '../globals.css'
import Link from 'next/link'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export const metadata = {
  title: 'Carabiner',
  description: 'Calendrier communautaire queer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('nav')
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
      <NextIntlClientProvider>
      <LanguageSwitcher />
        <main className="flex-1">{children}</main>

        {/* Navbar en bas */}
        <nav className="fixed bottom-0 w-full bg-white border-t shadow-md flex justify-around py-2 text-sm">
          <Link href="/" className="text-black hover:font-semibold">
          🏠 {t('home')} {/* Translated text for 'home' */}
          </Link>
          <Link href="/submit" className="text-black hover:font-semibold">
          ➕ {t('submit')} {/* Translated text for 'submit' */}
          </Link>
        </nav>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
