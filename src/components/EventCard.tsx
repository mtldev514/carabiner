import Image from "next/image";
import ImageCarousel from "./ImageCarousel";
import { supabase } from "@/app/utils/supabaseClient";
import { useEffect, useState } from "react";

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
};



export  function EventCard({ event }: { event: Event }) {
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
    <div className="p-4 rounded-lg shadow-md border border-gray-200 bg-white">
      {imageUrls.length > 0 && (
        <div className="mb-4">
          <ImageCarousel imageUrls={imageUrls} />
        </div>
      )}
      <h3 className="text-xl font-semibold mb-1 text-pink-700">{event.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{event.location}</p>
      <p className="text-sm text-gray-700 mb-2">
        {new Date(event.date).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <p className="text-sm text-gray-800 whitespace-pre-line">
        {event.description}
      </p>
    </div>
  );
}
