'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/utils/supabaseClient'
import { Event } from './EventCard'
import DiapoEventCard from './DiapoEventCard'
import { startOfDay } from 'date-fns'

export default function EventGrid() {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('approved', true)
        .order('date', { ascending: true })

      if (data) {
        const today = startOfDay(new Date())
        const mapped = (data as Event[]).map((e) => ({
          ...e,
          event_url: (e as any).ticket_url,
        }))
        setEvents(
          mapped.filter((e) => new Date(e.end_date ?? e.date) >= today)
        )
      }
    }
    fetchEvents()
  }, [])

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {events.map((event) => (
          <DiapoEventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
