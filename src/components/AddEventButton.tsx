'use client'
import {useTranslations} from 'next-intl'
import {Link} from '@/i18n/navigation'

export default function AddEventButton({className = ''}: {className?: string}) {
  const t = useTranslations('nav')
  return (
    <Link href="/submit" className={`px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}>
      {t('addEvent')}
    </Link>
  )
}
