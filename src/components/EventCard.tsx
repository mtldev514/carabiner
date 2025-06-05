import Image from "next/image";
import ImageCarousel from "./ImageCarousel";
import { supabase } from "@/app/utils/supabaseClient";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export type Event = {
  id: string;
  title: string;
  description_en: string;
  description_fr: string;
  date: string;
  location: string;
  tags?: string[];
};




export  function EventCard({ event }: { event: Event }) {
  const locale = useLocale();
  const descriptionField = locale === "fr" ? "description_fr" : "description_en";
  const otherDescriptionField = locale === "fr" ? "description_en" : "description_fr";
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
    <div className="card">
      {imageUrls.length > 0 && (
        <div className="mb-4">
          <ImageCarousel imageUrls={imageUrls} />
        </div>
      )}
      <h3 className="text-xl font-semibold mb-1 text-[var(--color-accent)]">{event.title}</h3>
      <p className="text-sm mb-2">{event.location}</p>
      <p className="text-sm mb-2">
        {new Date(event.date).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <p className="text-sm whitespace-pre-line">
          {event[descriptionField] || event[otherDescriptionField]}
      </p>
      {event.tags && event.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="tag"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
