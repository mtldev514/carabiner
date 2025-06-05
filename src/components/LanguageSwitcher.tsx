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
        className="button rounded-full"
      >
        {flag} {locale.toUpperCase()}
      </button>

      {open && (
        <div className="mt-2 bg-[var(--color-card-bg)] border border-[var(--color-text)] shadow-md rounded-md overflow-hidden absolute right-0">
          <button
            onClick={() => switchTo(otherLocale)}
            className="px-4 py-2 hover:bg-[var(--color-link)]/20 block w-full text-left"
          >
            {otherLocale === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
          </button>
        </div>
      )}
    </div>
  )
}
