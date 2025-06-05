'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/utils/supabaseClient'
import { Event } from './EventCard'

export default function DiapoEventCard({ event }: { event: Event }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchImage = async () => {
      const { data } = await supabase
        .from('event_images')
        .select('file_name')
        .eq('event_id', event.id)
        .order('order_index', { ascending: true })
        .limit(1)
        .single()

      if (data) {
        const url = supabase.storage
          .from('event-photos')
          .getPublicUrl(data.file_name).data.publicUrl
        setImageUrl(url)
      }
    }
    fetchImage()
  }, [event.id])

  const formattedDate = new Date(event.date).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col">
      <div className="relative w-full aspect-[4/5] mb-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
        {imageUrl ? (
          <Image src={imageUrl} alt={event.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            no image
          </div>
        )}
      </div>
      <h3 className="text-lg font-bold mb-1">{formattedDate}</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{event.title}</p>
      {event.tags && (
        <div className="mt-auto flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
