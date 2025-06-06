export function parseDateLocal(dateStr: string): Date {
  if (!dateStr) return new Date(NaN);

  if (dateStr.includes('T')) {
    const [datePart, timePart] = dateStr.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour = 0, minute = 0, second = 0] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hour, minute, second);
  }

  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

