"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import "react-calendar/dist/Calendar.css";
import { format, startOfDay, addDays } from "date-fns";
import { fr, enUS, es } from "date-fns/locale";
import { supabase } from "@/app/utils/supabaseClient";
import { parseDateLocal } from "@/app/utils/dateUtils";
import { EventCard, Event } from "./EventCard";
import TagChip from "./TagChip";
import { groupByDay } from "@/app/utils/dateUtils";

export default function EventListWithCalendar() {
  const t = useTranslations("eventList");
  const locale = useLocale();
  const calendarLocale = locale === "fr" ? fr : locale === "es" ? es : enUS;
  const [showCalendar, setShowCalendar] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const today = startOfDay(new Date());

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
        setEvents(
          mapped.filter((e) =>
            parseDateLocal(e.end_date ?? e.date) >= today
          )
        );
      }
    };

    fetchEvents();
  }, []);

  let filteredEvents = events;
  if (selectedTags.length > 0) {
    filteredEvents = filteredEvents.filter((event) =>
      event.tags?.some((tag) => selectedTags.includes(tag))
    );
  }


  const allGrouped = groupByDay(filteredEvents);
  const upcomingGrouped = Object.fromEntries(
    Object.entries(allGrouped).filter(
      ([date]) => parseDateLocal(date) >= today
    )
  );
  let grouped = upcomingGrouped;
  if (selectedDate) {
    const key = format(selectedDate, "yyyy-MM-dd");
    grouped = { [key]: allGrouped[key] ?? [] };
  }

  const sortedDates = Object.keys(grouped).sort(
    (a, b) =>
      parseDateLocal(a).getTime() - parseDateLocal(b).getTime()
  );

  return (
    
    <div className="p-4 max-w-2xl mx-auto">
       <p className="text-gray-700 dark:text-gray-300 mb-6">{t('description')}</p>
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

      <div className="mb-4 text-sm flex gap-3">
        {/* <span className="mr-2">{t("filterByTag")}: </span> */}
        {[
          "artsy",
          "chill",
          "party",
        ].map((tag) => (
          <TagChip
            key={tag}
            tag={tag}
            selected={selectedTags.includes(tag)}
            onToggle={() =>
              setSelectedTags((prev) =>
                prev.includes(tag)
                  ? prev.filter((t) => t !== tag)
                  : [...prev, tag]
              )
            }
          />
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
            }).format(parseDateLocal(date))}
          </h2>
          <ul className="space-y-4">
            {grouped[date].map((event) => (
              <li key={event.id}>
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
