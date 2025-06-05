export const formatDate = (date: string | Date, locale: string) =>
  new Date(date).toLocaleString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

export const descriptionFieldFor = (locale: string) =>
  locale === 'fr' ? 'description_fr' : locale === 'es' ? 'description_es' : 'description_en'

export const fallbackDescriptionFieldFor = (locale: string) =>
  locale === 'fr' ? 'description_en' : 'description_fr'
