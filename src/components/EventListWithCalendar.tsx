"use client";

import { SetStateAction, useEffect, useState } from "react";
import Calendar from "react-calendar";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { supabase } from "@/app/utils/supabaseClient";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
};

export default function EventListWithCalendar() {
  const t = useTranslations("eventList"); // Utilisation des traductions pour le namespace 'eventList'
  const locale = useLocale();
  const calendarLocale = locale === "fr" ? fr : enUS;
  const [showCalendar, setShowCalendar] = useState(false);

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("approved", true)
        .order("date", { ascending: true });

      if (data) setEvents(data);
    };

    fetchEvents();
  }, []);

  const filteredEvents = selectedDate
    ? events.filter(
        (event) =>
          format(new Date(event.date), "yyyy-MM-dd") ===
          format(selectedDate, "yyyy-MM-dd")
      )
    : events;

  const grouped = filteredEvents.reduce<Record<string, Event[]>>(
    (acc, event) => {
      const dateKey = format(new Date(event.date), "yyyy-MM-dd");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(event);
      return acc;
    },
    {}
  );

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {selectedDate && (
        <button
          className="text-sm text-blue-600 underline mb-4"
          onClick={() => setSelectedDate(null)}
        >
          {t("viewAllEvents")}{" "}
          {/* Traduction pour "Voir tous les événements" */}
        </button>
      )}

      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="mb-4 text-sm text-blue-600 underline"
      >
        {showCalendar ? t("hideCalendar") : t("showCalendar")}{" "}
        {/* Traduction pour "Masquer le calendrier" et "Afficher le calendrier" */}
      </button>

      <AnimatePresence initial={false}>
        {showCalendar && (
          <motion.div
            key="calendar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden mb-6"
          >
            <Calendar
              locale={locale}
              onClickDay={(value) => setSelectedDate(value)}
              className="rounded-md shadow"
              formatShortWeekday={(locale, date) =>
                new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
                  date
                )
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
      {sortedDates.length === 0 && (
        <p className="text-center text-gray-500">
          {t("noEvents")}{" "}
          {/* Traduction pour "Aucun événement à cette date." */}
        </p>
      )}

      {sortedDates.map((date) => (
        <div key={date} className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-pink-600">
            {new Intl.DateTimeFormat(locale, {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(date))}
          </h2>
          <ul className="space-y-2">
            {grouped[date].map((event) => (
              <li
                key={event.id}
                className="p-3 rounded-md bg-white shadow border-l-4 border-pink-500"
              >
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-gray-600">{event.location}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
