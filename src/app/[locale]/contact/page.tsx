'use client'

import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function ContactPage() {
  const t = useTranslations('contact')

  return (
    <div>

      <div className="max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
        <p className="text-gray-700 mb-6">{t('description')}</p>
        <p className="text-gray-600">{t('email')}</p>
      </div>
    </div>
  )
}
