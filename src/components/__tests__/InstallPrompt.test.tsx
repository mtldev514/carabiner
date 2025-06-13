import { render, screen, act } from '@testing-library/react'
import InstallPrompt from '../InstallPrompt'

jest.mock('next-intl', () => ({
  useTranslations: () => (id: string) => id
}))

describe('InstallPrompt', () => {
  it('shows banner after beforeinstallprompt on mobile', () => {
    Object.defineProperty(window, 'navigator', {
      value: { userAgent: 'iPhone' },
      configurable: true
    })

    render(<InstallPrompt />)
    const event = new CustomEvent('beforeinstallprompt')
    Object.assign(event, { prompt: jest.fn(), userChoice: Promise.resolve() })
    act(() => {
      window.dispatchEvent(event)
    })
    expect(screen.getByText('message')).toBeInTheDocument()
  })
})
