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
  it('changes language and updates router path', () => {
    const replace = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ replace })
    ;(usePathname as jest.Mock).mockReturnValue('/en/about')
    ;(useLocale as jest.Mock).mockReturnValue('en')

    render(<LanguageSwitcher />)

    fireEvent.click(screen.getByRole('button', { name: /en/i }))
    fireEvent.click(screen.getByRole('button', { name: /français/i }))

    expect(replace).toHaveBeenCalledWith('/fr/about')
  })
})
