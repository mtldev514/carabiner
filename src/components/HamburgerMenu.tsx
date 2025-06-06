'use client'

import { useState } from 'react'
import LanguageSwitcher from './LanguageSwitcher'

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)
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
          <LanguageSwitcher onSwitch={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}
