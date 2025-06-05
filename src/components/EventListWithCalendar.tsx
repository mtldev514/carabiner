"use client";

import { SetStateAction, useEffect, useState } from "react";
import Calendar from "react-calendar";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import "react-calendar/dist/Calendar.css";
import { format, startOfDay } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { supabase } from "@/app/utils/supabaseClient";
import {EventCard, Event} from "./EventCard";


export default function EventListWithCalendar() {
  const t = useTranslations("eventList");
  const locale = useLocale();
  const calendarLocale = locale === "fr" ? fr : enUS;
  const [showCalendar, setShowCalendar] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("approved", true)
        .order("date", { ascending: true });

      if (data) {
        const today = startOfDay(new Date());
        const mapped = data.map((e) => ({ ...e, event_url: e.ticket_url }));
        setEvents(mapped.filter((e) => new Date(e.date) >= today));
      }
    };

    fetchEvents();
  }, []);

  let filteredEvents = events;
  if (selectedDate) {
    filteredEvents = filteredEvents.filter(
      (event) =>
        format(new Date(event.date), "yyyy-MM-dd") ===
        format(selectedDate, "yyyy-MM-dd")
    );
  }
  if (selectedTags.length > 0) {
    filteredEvents = filteredEvents.filter((event) =>
      event.tags?.some((tag) => selectedTags.includes(tag))
    );
  }

  const grouped = filteredEvents.reduce<Record<string, Event[]>>(
    (acc, event) => {
      const dateKey = format(new Date(event.date), "yyyy-MM-dd");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(event);
      return acc;
    },
    {}
  );

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {selectedDate && (
        <button
          className="text-sm text-blue-600 dark:text-blue-400 underline mb-4"
          onClick={() => setSelectedDate(null)}
        >
          {t("viewAllEvents")}
        </button>
      )}

      {/*
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="mb-4 text-sm text-blue-600 dark:text-blue-400 underline"
      >
        {showCalendar ? t("hideCalendar") : t("showCalendar")}
      </button>
      */}

      <div className="mb-4 text-sm">
        {/* <span className="mr-2">{t("filterByTag")}: </span> */}
        {[
          "artsy",
          "chill",
          "party",
        ].map((tag) => (
          <label key={tag} className="mr-3">
            <input
              type="checkbox"
              className="mr-1"
              checked={selectedTags.includes(tag)}
              onChange={() =>
                setSelectedTags((prev) =>
                  prev.includes(tag)
                    ? prev.filter((t) => t !== tag)
                    : [...prev, tag]
                )
              }
            />
            #{tag}
          </label>
        ))}
      </div>

      {/*
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
      */}

      {sortedDates.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">{t("noEvents")}</p>
      )}

      {sortedDates.map((date) => (
        <div key={date} className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-pink-600 dark:text-pink-400">
            {new Intl.DateTimeFormat(locale, {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(date))}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grouped[date].map((event) => (
              <li key={event.id} className="flex justify-center">
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
