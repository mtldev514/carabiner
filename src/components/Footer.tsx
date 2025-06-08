import React from 'react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="text-center p-4 border-t dark:border-gray-800 mt-6 text-sm">
      © <span suppressHydrationWarning>{year}</span> Carabiner.gay
    </footer>
  )
}
