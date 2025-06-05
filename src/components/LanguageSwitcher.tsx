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

  const locales = ['fr', 'en', 'es'] as const
  const otherLocales = locales.filter((l) => l !== locale)

  const switchTo = (target: string) => {
    const regex = new RegExp(`^/(${locales.join('|')})`)
    const newPath = pathname.replace(regex, `/${target}`)
    router.replace(newPath)
    onSwitch?.()
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      {otherLocales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchTo(loc)}
          className="hover:text-pink-600 dark:hover:text-pink-400"
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
