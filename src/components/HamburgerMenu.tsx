'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import LanguageSwitcher from './LanguageSwitcher'

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)
  const t = useTranslations('nav')

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        className="p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <span className="block w-5 border-b border-current mb-1" />
        <span className="block w-5 border-b border-current mb-1" />
        <span className="block w-5 border-b border-current" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-md rounded-md p-4 z-50 space-y-2 text-sm">
          <Link href="/" className="block hover:text-pink-600 dark:hover:text-pink-400" onClick={() => setOpen(false)}>
            {t('home')}
          </Link>
          <Link href="/submit" className="block hover:text-pink-600 dark:hover:text-pink-400" onClick={() => setOpen(false)}>
            {t('submit')}
          </Link>
          <Link href="/contact" className="block hover:text-pink-600 dark:hover:text-pink-400" onClick={() => setOpen(false)}>
            {t('contact')}
          </Link>
          <LanguageSwitcher className="relative" />
        </div>
      )}
    </div>
  )
}
