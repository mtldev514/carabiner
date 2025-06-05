"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../utils/supabaseClient"
import { EventCard } from "@/components/EventCard"
import { useTranslations } from "next-intl"

interface PendingEvent {
  id: string
  title: string
  description_fr?: string
  description_en?: string
  description?: string
  date: string
  location: string
  tags?: string[]
  ticket_url?: string
}

export default function AdminPage() {
  const router = useRouter()
  const t = useTranslations("admin")
  const [events, setEvents] = useState<PendingEvent[]>([])

  useEffect(() => {
    if (process.env.VERCEL_ENV === "production") {
      router.replace("/")
      return
    }

    const fetchEvents = async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("approved", false)
        .order("date", { ascending: true })
      if (data) setEvents(data as PendingEvent[])
    }

    fetchEvents()
  }, [router])

  if (process.env.VERCEL_ENV === "production") {
    return null
  }

  const approve = async (id: string) => {
    await supabase.from("events").update({ approved: true }).eq("id", id)
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
      {events.length === 0 && (
        <p className="text-gray-600">{t("noPending")}</p>
      )}
      {events.map((event) => (
        <div key={event.id} className="mb-6">
          <EventCard
            event={{
              id: event.id,
              title: event.title,
              description_en: event.description_en|| "",
              description_fr: event.description_fr  || "",
              date: event.date,
              location: event.location,
              tags: event.tags,
              event_url: event.ticket_url,
            }}
          />
          <button
            onClick={() => approve(event.id)}
            className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
          >
            {t("approveButton")}
          </button>
        </div>
      ))}
    </div>
  )
}
