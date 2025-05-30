'use client' // ← seulement si tu es en App Router

import { useState } from 'react'
import { supabase } from '../../utils/supabaseClient'
import { useTranslations } from 'next-intl'

export default function SubmitEventPage() {
  const t = useTranslations('submit')

  const [form, setForm] = useState({
    title: '',
    description_fr: '',
    date: '',
    location: '',
    ticket_url: ''
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('events').insert([
      {
        title: form.title,
        description_fr: form.description_fr,
        date: new Date(form.date),
        location: form.location,
        ticket_url: form.ticket_url
      }
    ])
    setLoading(false)
    if (!error) {
      setSuccess(true)
      setForm({ title: '', description_fr: '', date: '', location: '', ticket_url: '' })
    } else {
      alert(error.message)
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder={t('form.titlePlaceholder')}
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description_fr"
          placeholder={t('form.descriptionPlaceholder')}
          value={form.description_fr}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="location"
          placeholder={t('form.locationPlaceholder')}
          value={form.location}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="url"
          name="ticket_url"
          placeholder={t('form.ticketUrlPlaceholder')}
          value={form.ticket_url}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          {loading ? t('form.loading') : t('form.submitButton')}
        </button>
        {success && <p className="text-green-600 mt-2">{t('form.successMessage')}</p>}
      </form>
    </div>
  )
}