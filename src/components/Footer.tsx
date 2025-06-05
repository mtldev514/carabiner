import React from 'react'

export default function Footer() {
  return (
    <footer className="text-center p-4 border-t dark:border-gray-800 mt-6 text-sm">
      © {new Date().getFullYear()} Carabiner
    </footer>
  )
}
