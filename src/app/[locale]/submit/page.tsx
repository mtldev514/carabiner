"use client"; // ← seulement si tu es en App Router
import { v4 as uuidv4 } from "uuid"; // npm install uuid
import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useTranslations } from "next-intl";

const uploadImages = async (eventId: string, images: File[]) => {
  const uploads = images.map(async (image, index) => {
    const fileExt = image.type?.split("/").pop() || "jpg";
    const fileName = `${eventId}/${uuidv4()}.${fileExt}`;
    console.log("Uploading file:", fileName);
    console.log(image instanceof File); // true

    const { data, error } = await supabase.storage
      .from("event-photos")
      .upload(fileName, image, { upsert: true });

    if (error) {
      console.error("Upload error:", error.message);
    } else {
      console.log("File uploaded:", fileName);
      
      await supabase.from("event_images").insert({
        event_id: eventId,
        file_name: fileName,
        order_index: index,
      });
    }
  });

  await Promise.all(uploads);
};

export default function SubmitEventPage() {
  const [images, setImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const t = useTranslations("submit");

  const [form, setForm] = useState({
    title: "",
    description_fr: "",
    description_en: "",
    date: "",
    end_date: "",
    location: "",
    event_url: "",
    tags: [] as string[],
    website: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      setImageError("Au moins une image est requise.");
      return;
    }
    setLoading(true);

    const response = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await response.json();

    setLoading(false);
    if (result.success) {
      setSuccess(true);
      const { data, error } = await supabase
        .from("events")
        .insert([
          {
            title: form.title,
            description_fr: form.description_fr,
            description_en: form.description_en,
            date: new Date(form.date),
            end_date: form.end_date ? new Date(form.end_date) : null,
            location: form.location,
            ticket_url: form.event_url,
            tags: form.tags,
          },
        ])
        .select()
        .single();
      if (!error && data?.id) {
        setSuccess(true);
        await uploadImages(data.id, images);
        setForm({
          title: "",
          description_fr: "",
          description_en: "",
          date: "",
          end_date: "",
          location: "",
          event_url: "",
          tags: [],
          website: "",
        });
      } else {
        alert(error?.message);
      }
    } else {
      alert("Submission blocked. Please try again later.");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder={t("form.titlePlaceholder")}
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
        />
        <input
          type="file"
          accept="image/*"
          multiple
          required
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length > 15) {
              setImageError("Vous pouvez ajouter jusqu’à 15 images maximum.");
            } else if (files.length === 0) {
              setImageError("Au moins une image est requise.");
            } else {
              setImages(files);
              setImageError(null);
            }
          }}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
        />

        {imageError && <p className="text-red-500 text-sm">{imageError}</p>}

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {images.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                className="h-24 object-cover rounded border dark:border-gray-600"
              />
            ))}
          </div>
        )}
        <textarea
          name="description_fr"
          placeholder={t("form.description_fr_Placeholder")}
          value={form.description_fr}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
        />
        <textarea
          name="description_en"
          placeholder={t("form.description_en_Placeholder")}
          value={form.description_en}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
        />
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
        />
        <input
          type="datetime-local"
          name="end_date"
          value={form.end_date}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
        />
        <input
          type="text"
          name="location"
          placeholder={t("form.locationPlaceholder")}
          value={form.location}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
        />
        <input
          type="url"
          name="event_url"
          placeholder={t("form.eventUrlPlaceholder")}
          value={form.event_url}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
        />

        <div className="flex space-x-4 text-sm">
          <span>{t("form.tagsLabel")}: </span>
          {["artsy", "chill", "party"].map((tag) => (
            <label key={tag} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={form.tags.includes(tag)}
                onChange={() =>
                  setForm((prev) => ({
                    ...prev,
                    tags: prev.tags.includes(tag)
                      ? prev.tags.filter((t) => t !== tag)
                      : [...prev.tags, tag],
                  }))
                }
              />
              <span>#{tag}</span>
            </label>
          ))}
        </div>

        <input
          type="text"
          name="website"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black dark:bg-gray-900 text-white py-2 rounded hover:bg-gray-800 dark:hover:bg-gray-700"
        >
          {loading ? t("form.loading") : t("form.submitButton")}
        </button>
        {success && (
          <p className="text-green-600 dark:text-green-400 mt-2">{t("form.successMessage")}</p>
        )}
      </form>
    </div>
  );
}
