import { parseDateLocal } from '@/app/utils/dateUtils'

describe('parseDateLocal', () => {
  it('parses date without time as local midnight', () => {
    const d1 = parseDateLocal('2024-07-09')
    const d2 = parseDateLocal('2024-07-09T00:00:00')
    expect(d1.getFullYear()).toBe(d2.getFullYear())
    expect(d1.getMonth()).toBe(d2.getMonth())
    expect(d1.getDate()).toBe(d2.getDate())
    expect(d1.getHours()).toBe(0)
    expect(d1.getMinutes()).toBe(0)
  })

  it('parses date with time as local time', () => {
    const d = parseDateLocal('2025-06-28T22:15')
    const expected = new Date(2025, 5, 28, 22, 15)
    expect(d.getFullYear()).toBe(expected.getFullYear())
    expect(d.getMonth()).toBe(expected.getMonth())
    expect(d.getDate()).toBe(expected.getDate())
    expect(d.getHours()).toBe(expected.getHours())
    expect(d.getMinutes()).toBe(expected.getMinutes())
  })
})

