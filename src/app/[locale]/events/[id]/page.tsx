"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { supabase } from "../../../utils/supabaseClient";
import { parseDateLocal } from "../../../utils/dateUtils";
import ImageCarousel from "@/components/ImageCarousel";
import { Event } from "@/components/EventCard";
import Link from "next/link";

export default function EventDetailPage({ params }: any) {
  const { id, locale } = params as { id: string; locale: string };
  const t = useTranslations("eventDetail");
  const tCard = useTranslations("eventCard");
  const [event, setEvent] = useState<Event | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data } = await supabase.from("events").select("*").eq("id", id).single();
      if (data) {
        setEvent({
          id: data.id,
          title: data.title,
          description_en: data.description_en || "",
          description_fr: data.description_fr || "",
          description_es: data.description_es || "",
          date: data.date,
          end_date: data.end_date,
          city: data.city,
          address: data.address,
          address_visibility: data.address_visibility,
          tags: data.tags,
          event_url: data.ticket_url,
        });

        const { data: imgs } = await supabase
          .from("event_images")
          .select("file_name")
          .eq("event_id", id)
          .order("order_index", { ascending: true });

        if (imgs) {
          const urls = imgs.map((img) =>
            supabase.storage.from("event-photos").getPublicUrl(img.file_name).data.publicUrl
          );
          setImageUrls(urls);
        }
      }
    };
    fetchEvent();
  }, [id]);

  if (!event) {
    return <div className="p-4">Loading...</div>;
  }

  const descriptionField =
    locale === "fr" ? "description_fr" : locale === "es" ? "description_es" : "description_en";
  const description = [
    descriptionField,
    "description_en",
    "description_fr",
    "description_es",
  ]
    .filter((field, index, self) => self.indexOf(field) === index)
    .map((field) => event[field as keyof Event] as string)
    .find((desc) => desc && desc.trim()) || "";

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Link href={`/${locale}`} className="text-sm text-blue-600 dark:text-blue-400 underline mb-4 block">
        {t("back")}
      </Link>
      {imageUrls.length > 0 && (
        <div className="mb-4">
          <ImageCarousel imageUrls={imageUrls} />
        </div>
      )}
      <h1 className="text-2xl font-bold mb-1 text-pink-700 dark:text-pink-300">{event.title}</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        {event.address_visibility === "public" ? event.address : event.city}
      </p>
      {event.address_visibility === "ticket_holder" && (
        <p className="text-xs italic text-gray-500 dark:text-gray-400 mb-2">{tCard("privateAddressNote")}</p>
      )}
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
        {parseDateLocal(event.date).toLocaleString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
        {event.end_date && (
          <> - {parseDateLocal(event.end_date).toLocaleString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}</>
        )}
      </p>
      <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line mb-4">
        {description}
      </p>
      {event.event_url && (
        <a href={event.event_url} target="_blank" rel="noopener noreferrer" className="text-pink-700 dark:text-pink-300 underline block mb-2">
          {t("tickets")}
        </a>
      )}
      {event.tags && event.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
