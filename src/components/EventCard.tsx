import Image from "next/image";
import ImageCarousel from "./ImageCarousel";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabaseClient";
import { parseDateLocal } from "@/app/utils/dateUtils";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export type Event = {
  id: string;
  title: string;
  description_en: string;
  description_fr: string;
  description_es: string;
  date: string;
  end_date?: string | null;
  city: string;
  address?: string | null;
  address_visibility: "public" | "ticket_holder";
  location?: string;
  tags?: string[];
  event_url?: string;
};




export  function EventCard({ event }: { event: Event }) {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const descriptionField =
    locale === "fr"
      ? "description_fr"
      : locale === "es"
      ? "description_es"
      : "description_en";
  const otherDescriptionField =
    locale === "fr" ? "description_en" : "description_fr";
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from("event_images")
        .select("file_name")
        .eq("event_id", event.id)
        .order("order_index", { ascending: true });

      if (data) {
        const urls = data.map((img) =>
          supabase.storage.from("event-photos").getPublicUrl(img.file_name).data.publicUrl
        );
        setImageUrls(urls);
      }
    };

    fetchImages();
  }, [event.id]);

  return (
    <div
      onClick={() => router.push(`/${locale}/events/${event.id}`)}
      className="p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer"
    >
      {imageUrls.length > 0 && (
        <div className="mb-4" onClick={(e) => e.stopPropagation()}>
          <ImageCarousel imageUrls={imageUrls} />
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-xl font-semibold mb-1 text-pink-700 dark:text-pink-300">
          {event.event_url ? (
            <a
              href={event.event_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="underline"
            >
              {event.title}
            </a>
          ) : (
            event.title
          )}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {event.address_visibility === "public" ? event.address : event.city}
        </p>
        {event.address_visibility === "ticket_holder" && (
          <p className="text-xs italic text-gray-500 dark:text-gray-400 mb-2">
            {t("eventCard.privateAddressNote")}
          </p>
        )}
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          {parseDateLocal(event.date).toLocaleString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
          {event.end_date && (
            <> -
              {parseDateLocal(event.end_date).toLocaleString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </>
          )}
        </p>
        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
          {event[descriptionField] || event[otherDescriptionField]}
        </p>
      </div>
      {event.tags && event.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
