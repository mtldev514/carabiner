"use client";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useTranslations, useLocale } from "next-intl";
import TagChip from "@/components/TagChip";

const uploadImages = async (eventId: string, images: File[]) => {
  const uploads = images.map(async (image, index) => {
    const fileExt = image.type?.split("/").pop() || "jpg";
    const fileName = `${eventId}/${uuidv4()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("event-photos")
      .upload(fileName, image, { upsert: true });

    if (error) {
      console.error("Upload error:", error.message);
    } else {

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
  const locale = useLocale();

  const [form, setForm] = useState({
    title: "",
    description_fr: "",
    description_en: "",
    description_es: "",
    date: "",
    end_date: "",
    city: "",
    address: "",
    address_visibility: "public" as "public" | "ticket_holder",
    event_url: "",
    tags: [] as string[],
    website: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [addressQuery, setAddressQuery] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);

  useEffect(() => {
    if (form.address_visibility === "public" && addressQuery.length > 3) {
      const controller = new AbortController();
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
          addressQuery
        )}`,
        { signal: controller.signal, headers: { "Accept-Language": locale } }
      )
        .then((res) => res.json())
        .then((data) => setAddressSuggestions(data))
        .catch(() => {});
      return () => controller.abort();
    }
    setAddressSuggestions([]);
  }, [addressQuery, form.address_visibility]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      setImageError(t("form.imageRequiredError"));
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
      const insertData: Record<string, any> = {
        title: form.title,
        description_fr: form.description_fr,
        description_en: form.description_en,
        description_es: form.description_es,
        date: new Date(form.date),
        end_date: form.end_date ? new Date(form.end_date) : null,
        city: form.city,
        address_visibility: form.address_visibility,
        ticket_url: form.event_url,
        tags: form.tags,
      };
      if (form.address_visibility === "public") {
        insertData.address = form.address;
      }

      const { data, error } = await supabase
        .from("events")
        .insert([insertData])
        .select()
        .single();
      if (!error && data?.id) {
        setSuccess(true);
        await uploadImages(data.id, images);
        setForm({
          title: "",
          description_fr: "",
          description_en: "",
          description_es: "",
          date: "",
          end_date: "",
          city: "",
          address: "",
          address_visibility: "public",
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
              setImageError(t("form.imageLimitError"));
            } else if (files.length === 0) {
              setImageError(t("form.imageRequiredError"));
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

        <textarea
          name="description_es"
          placeholder={t("form.description_es_Placeholder")}
          value={form.description_es}
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
        <select
          name="address_visibility"
          value={form.address_visibility}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="public">{t("form.addressVisibilityPublic")}</option>
          <option value="ticket_holder">
            {t("form.addressVisibilityTicketHolder")}
          </option>
        </select>
        {form.address_visibility === "public" && (
          <>
            <input
              type="text"
              name="address"
              list="address-suggestions"
              placeholder={t("form.addressPlaceholder")}
              value={form.address}
              onChange={(e) => {
                setForm({ ...form, address: e.target.value });
                setAddressQuery(e.target.value);
                const match = addressSuggestions.find(
                  (s) => s.display_name === e.target.value
                );
                if (match) {
                  const c =
                    match.address.city ||
                    match.address.town ||
                    match.address.village ||
                    match.address.hamlet ||
                    "";
                  setForm((prev) => ({ ...prev, city: c }));
                }
              }}
              required
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
            />
            <datalist id="address-suggestions">
              {addressSuggestions.map((s, i) => (
                <option key={i} value={s.display_name} />
              ))}
            </datalist>
          </>
        )}
        <input
          type="text"
          name="city"
          placeholder={t("form.cityPlaceholder")}
          value={form.city}
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

        <div className="flex items-center gap-4 text-sm">
          <span>{t("form.tagsLabel")}: </span>
          {["artsy", "chill", "party"].map((tag) => (
            <TagChip
              key={tag}
              tag={tag}
              selected={form.tags.includes(tag)}
              onToggle={() =>
                setForm((prev) => ({
                  ...prev,
                  tags: prev.tags.includes(tag)
                    ? prev.tags.filter((t) => t !== tag)
                    : [...prev.tags, tag],
                }))
              }
            />
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
          <p className="text-green-600 dark:text-green-400 mt-2">
            {t("form.successMessage")}
          </p>
        )}
      </form>
    </div>
  );
}
