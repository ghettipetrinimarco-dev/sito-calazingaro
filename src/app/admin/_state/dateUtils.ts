// Utility data in timezone Italia
// Niente toISOString() per le date locali (sarebbe UTC)

export function getRomeDate(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
}

export function getRomeTime(): string {
  return new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date())
}

export function formatItalianDate(value: string): string {
  const [year, month, day] = value.split("-")
  if (!year || !month || !day) return value
  return `${day}/${month}/${year}`
}

export function formatItalianDay(value: string): string {
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return value
  const date = new Date(Date.UTC(year, month - 1, day, 12))
  const weekday = new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    weekday: "long",
  }).format(date)
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}`
}

export function addDays(value: string, days: number): string {
  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day + days))
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

// Turno auto: pranzo se ora < 17:00, altrimenti cena
export function inferCurrentService(): "pranzo" | "cena" {
  const time = getRomeTime()
  const hour = Number(time.split(":")[0])
  return hour < 17 ? "pranzo" : "cena"
}

// "HH:MM" → minuti dall'inizio giornata
export function timeToMinutes(time: string | null): number | null {
  if (!time) return null
  const [hh, mm] = time.split(":").map(Number)
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null
  return hh * 60 + mm
}

// Minuti → "HH:MM" (clampato a 0-23:59)
export function minutesToTime(min: number): string {
  const safe = Math.max(0, Math.min(min, 24 * 60 - 1))
  const hh = Math.floor(safe / 60)
  const mm = safe % 60
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`
}

// "20:00" + 90 min → "21:30"
export function addMinutesToTime(time: string, minutes: number): string {
  const base = timeToMinutes(time)
  if (base == null) return time
  return minutesToTime(base + minutes)
}

// Differenza in minuti tra due orari (anche over-midnight)
export function diffMinutes(start: string, end: string): number {
  const a = timeToMinutes(start)
  const b = timeToMinutes(end)
  if (a == null || b == null) return 0
  let diff = b - a
  if (diff < 0) diff += 24 * 60 // over-midnight
  return diff
}
