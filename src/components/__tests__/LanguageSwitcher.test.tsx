import { render, screen, fireEvent } from '@testing-library/react'
import LanguageSwitcher from '../LanguageSwitcher'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}))

jest.mock('next-intl', () => ({
  useLocale: jest.fn(),
}))

describe('LanguageSwitcher', () => {
  it('switches locale when clicked', () => {
    const replace = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ replace })
    ;(usePathname as jest.Mock).mockReturnValue('/en/about')
    ;(useLocale as jest.Mock).mockReturnValue('en')

    render(<LanguageSwitcher />)

    fireEvent.click(screen.getByRole('button'))

    expect(replace).toHaveBeenCalledWith('/fr/about')
  })
})
