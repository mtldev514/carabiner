'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'


export default function LanguageSwitcher({
  className = '',
  onSwitch,
}: {
  className?: string
  onSwitch?: () => void
}) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const otherLocale = locale === 'fr' ? 'en' : 'fr'
  const flag = otherLocale === 'fr' ? '🏳️‍⚜️' : '🇨🇦'

  const switchTo = () => {
    const newPath = pathname.replace(/^\/(fr|en)/, `/${otherLocale}`)
    router.replace(newPath)
    onSwitch?.()
  }

  return (
    <button
      onClick={switchTo}
      className={`block hover:text-pink-600 dark:hover:text-pink-400 ${className}`}
    >
      {flag} {otherLocale.toUpperCase()}
    </button>
  )
}
