export function parseDateLocal(dateStr: string): Date {
  if (!dateStr) return new Date(NaN);
  return dateStr.includes('T') ? new Date(dateStr) : new Date(`${dateStr}T00:00:00`);
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


