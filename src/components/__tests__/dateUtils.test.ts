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
})

