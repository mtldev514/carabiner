import { groupByDay } from '@/app/utils/dateUtils'
import type { Event } from '../EventCard'

describe('groupByDay', () => {
  const base: Omit<Event, 'date'> & Partial<Pick<Event, 'end_date'>> = {
    id: '1',
    title: '',
    description_en: '',
    description_fr: '',
    description_es: '',
    city: '',
    address_visibility: 'public',
  }

  it('excludes final day when event ends before 8am and started previous day', () => {
    const events: Event[] = [{
      ...base,
      date: '2024-07-09T23:00:00',
      end_date: '2024-07-10T07:00:00'
    }]
    const grouped = groupByDay(events)
    expect(Object.keys(grouped)).toEqual(['2024-07-09'])
  })

  it('includes final day when event ends after 8am', () => {
    const events: Event[] = [{
      ...base,
      date: '2024-07-09T23:00:00',
      end_date: '2024-07-10T08:30:00'
    }]
    const grouped = groupByDay(events)
    expect(Object.keys(grouped)).toEqual(['2024-07-09', '2024-07-10'])
  })
})
