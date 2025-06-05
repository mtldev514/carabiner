import { render, screen } from '@testing-library/react'
import { useLocale, useTranslations } from 'next-intl'
import { EventCard, Event } from '../EventCard'

jest.mock('next-intl', () => ({
  useLocale: jest.fn(),
  useTranslations: () => (key: string) => key,
}))

jest.mock('@/app/utils/supabaseClient', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: async () => ({ data: [], error: null }),
        }),
      }),
    }),
    storage: { from: () => ({ getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
  },
}))

const mockEvent: Event = {
  id: '1',
  title: 'Test Event',
  description_en: 'Desc EN',
  description_fr: 'Desc FR',
  description_es: 'Desc ES',
  date: '2024-01-01T10:00:00Z',
  city: 'MTL',
  address_visibility: 'public',
}

describe('EventCard', () => {
  it('renders title and description', async () => {
    ;(useLocale as jest.Mock).mockReturnValue('en')

    render(<EventCard event={mockEvent} />)

    expect(screen.getByText('Test Event')).toBeInTheDocument()
    expect(await screen.findByText('Desc EN')).toBeInTheDocument()
  })
})
