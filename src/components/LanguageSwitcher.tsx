'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'


export default function LanguageSwitcher({
  className = 'absolute top-4 right-4',
}: {
  className?: string
}) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const otherLocale = locale === 'fr' ? 'en' : 'fr'
  const flag = otherLocale === 'fr' ? '🇫🇷' : '🇬🇧'

  const switchTo = (newLocale: string) => {
    const newPath = pathname.replace(/^\/(fr|en)/, `/${newLocale}`)
    router.replace(newPath)
  }

  return (
    <button
      onClick={() => switchTo(otherLocale)}
      className={`bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-full px-3 py-1 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-sm z-50 ${className}`}
    >
      {flag} {otherLocale.toUpperCase()}
    </button>
  )
}
