export function parseDateLocal(dateStr: string): Date {
  if (!dateStr) return new Date(NaN);
  return dateStr.includes('T') ? new Date(dateStr) : new Date(`${dateStr}T00:00:00`);
}

