import { startOfDay, addDays, format } from 'date-fns'
import type { Event } from '@/components/EventCard'

export function parseDateLocal(dateStr: string): Date {
  if (!dateStr) return new Date(NaN);
  return dateStr.includes('T') ? new Date(dateStr) : new Date(`${dateStr}T00:00:00`);
}

export function groupByDay(evts: Event[]) {
  return evts.reduce<Record<string, Event[]>>((acc, event) => {
    const startDate = parseDateLocal(event.date)
    const endDate = event.end_date ? parseDateLocal(event.end_date) : startDate

    const start = startOfDay(startDate)
    let end = startOfDay(endDate)

    const skipEndDay =
      event.end_date && endDate.getHours() < 8 && start.getTime() !== end.getTime()

    if (skipEndDay) {
      end = addDays(end, -1)
    }

    for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
      const key = format(d, 'yyyy-MM-dd')
      if (!acc[key]) acc[key] = []
      acc[key].push(event)
    }

    return acc
  }, {})
}

export function appendLocalOffset(dateStr: string): string {
  const d = new Date(dateStr);
  const offset = d.getTimezoneOffset();
  const sign = offset > 0 ? '-' : '+';
  const abs = Math.abs(offset);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `${dateStr}${sign}${hh}:${mm}`;
}

export function toDatetimeLocal(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}


