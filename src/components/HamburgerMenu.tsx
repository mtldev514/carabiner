'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)
  const locale = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        className="px-2 py-1 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {locale.toUpperCase()}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-md rounded-md p-4 z-50 space-y-2 text-sm">
          <LanguageSwitcher onSwitch={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}
