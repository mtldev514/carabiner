import { render, screen, fireEvent } from '@testing-library/react'
import SubmitEventPage from '../page'
import { useTranslations, useLocale } from 'next-intl'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}))

jest.mock('@/app/utils/supabaseClient', () => ({
  supabase: {
    from: () => ({
      insert: () => ({ select: () => ({ single: async () => ({ data: { id: 1 }, error: null }) }) }),
    }),
    storage: { from: () => ({ upload: async () => ({ data: {}, error: null }) }) },
  },
}))

global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve({ success: true }) })
) as any

describe('SubmitEventPage', () => {
  it('shows image required error', async () => {
    render(<SubmitEventPage />)

    fireEvent.change(screen.getByLabelText('form.titlePlaceholder'), { target: { value: 'Test' } })
    fireEvent.change(screen.getByLabelText('form.startDateLabel'), { target: { value: '2024-01-01T10:00' } })
    fireEvent.change(screen.getByLabelText('form.cityPlaceholder'), { target: { value: 'MTL' } })

    fireEvent.submit(screen.getByRole('button', { name: 'form.submitButton' }))

    expect(await screen.findByText('form.imageRequiredError')).toBeInTheDocument()
  })
})
