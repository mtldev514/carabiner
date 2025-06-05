'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useState } from 'react'

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const otherLocale = locale === 'fr' ? 'en' : 'fr'
  const flag = locale === 'fr' ? '🇫🇷' : '🇬🇧'

  const switchTo = (newLocale: string) => {
    const newPath = pathname.replace(/^\/(fr|en)/, `/${newLocale}`)
    router.replace(newPath)
    setOpen(false)
  }

  return (
    <div className="absolute top-4 right-4 text-sm z-50">
      <button
        onClick={() => setOpen(!open)}
        className="bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-full px-3 py-1 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {flag} {locale.toUpperCase()}
      </button>

      {open && (
        <div className="mt-2 bg-white dark:bg-gray-800 border dark:border-gray-600 shadow-md rounded-md overflow-hidden absolute right-0">
          <button
            onClick={() => switchTo(otherLocale)}
            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 block w-full text-left"
          >
            {otherLocale === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
          </button>
        </div>
      )}
    </div>
  )
}
