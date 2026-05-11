export type QuickReservationFascia = "pranzo" | "cena"
export type QuickReservationConfidence = "alta" | "media" | "bassa"
export type QuickReservationMissingField = "nome" | "data" | "fascia" | "coperti"

export interface QuickReservationDraft {
  input: string
  nome: string | null
  data: string | null
  fascia: QuickReservationFascia | null
  orario: string | null
  coperti: number | null
  telefono: string | null
  note: string | null
  missingFields: QuickReservationMissingField[]
  confidence: QuickReservationConfidence
}

interface RomeDateParts {
  year: number
  month: number
  day: number
}

const WEEKDAYS: Record<string, number> = {
  domenica: 0,
  lunedi: 1,
  martedi: 2,
  mercoledi: 3,
  giovedi: 4,
  venerdi: 5,
  sabato: 6,
}

const DATE_WORDS = new Set(["oggi", "domani"])
const DINNER_WORDS = new Set(["sera", "cena", "stasera"])
const LUNCH_WORDS = new Set(["pranzo"])

function normalizeToken(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,;!?()[\]{}]/g, "")
}

function getRomeDateParts(date: Date): RomeDateParts {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)

  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return {
    year: Number(byType.year),
    month: Number(byType.month),
    day: Number(byType.day),
  }
}

function formatYmd(parts: RomeDateParts): string {
  return [
    String(parts.year).padStart(4, "0"),
    String(parts.month).padStart(2, "0"),
    String(parts.day).padStart(2, "0"),
  ].join("-")
}

function addDays(parts: RomeDateParts, days: number): RomeDateParts {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days, 12))
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  }
}

function weekdayOf(parts: RomeDateParts): number {
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 12)).getUTCDay()
}

function parseDate(tokens: string[], referenceDate: Date): { data: string | null; consumed: Set<number> } {
  const consumed = new Set<number>()
  const today = getRomeDateParts(referenceDate)

  for (const [index, token] of tokens.entries()) {
    if (token === "oggi" || token === "stasera") {
      consumed.add(index)
      return { data: formatYmd(today), consumed }
    }

    if (token === "domani") {
      consumed.add(index)
      return { data: formatYmd(addDays(today, 1)), consumed }
    }

    const weekday = WEEKDAYS[token]
    if (weekday !== undefined) {
      const currentWeekday = weekdayOf(today)
      const delta = (weekday - currentWeekday + 7) % 7
      consumed.add(index)
      return { data: formatYmd(addDays(today, delta)), consumed }
    }
  }

  return { data: null, consumed }
}

function parseTime(rawTokens: string[]): { orario: string | null; consumed: Set<number> } {
  const consumed = new Set<number>()

  for (const [index, token] of rawTokens.entries()) {
    const match = token.match(/^([01]?\d|2[0-3])[:.]([0-5]\d)$/)
    if (!match) continue

    consumed.add(index)
    return {
      orario: `${match[1].padStart(2, "0")}:${match[2]}`,
      consumed,
    }
  }

  return { orario: null, consumed }
}

function parseFascia(tokens: string[], orario: string | null): { fascia: QuickReservationFascia | null; consumed: Set<number> } {
  const consumed = new Set<number>()

  for (const [index, token] of tokens.entries()) {
    if (DINNER_WORDS.has(token)) {
      consumed.add(index)
      return { fascia: "cena", consumed }
    }

    if (LUNCH_WORDS.has(token)) {
      consumed.add(index)
      return { fascia: "pranzo", consumed }
    }
  }

  if (!orario) return { fascia: null, consumed }

  const hour = Number(orario.slice(0, 2))
  if (hour >= 18) return { fascia: "cena", consumed }
  if (hour >= 11 && hour < 16) return { fascia: "pranzo", consumed }

  return { fascia: null, consumed }
}

function parseCoperti(rawTokens: string[]): { coperti: number | null; consumed: Set<number> } {
  const consumed = new Set<number>()

  for (const [index, token] of rawTokens.entries()) {
    if (token.includes(":") || token.includes(".")) continue

    const match = token.match(/^\d{1,2}$/)
    if (!match) continue

    const value = Number(match[0])
    if (value < 1 || value > 30) continue

    consumed.add(index)
    return { coperti: value, consumed }
  }

  return { coperti: null, consumed }
}

function parseTelefono(input: string): string | null {
  const match = input.match(/(?:\+39\s*)?(?:\d\s*){8,12}/)
  if (!match) return null

  return match[0].replace(/\s/g, "")
}

function isPotentialNameToken(value: string): boolean {
  return /^[A-ZÀ-ÖØ-Þ]/.test(value)
}

function parseNome(rawTokens: string[], consumed: Set<number>): { nome: string | null; consumed: Set<number> } {
  const capitalizedIndexes: number[] = []

  for (const [index, token] of rawTokens.entries()) {
    if (consumed.has(index)) continue
    if (!isPotentialNameToken(token)) continue

    capitalizedIndexes.push(index)

    for (let nextIndex = index + 1; nextIndex < rawTokens.length; nextIndex++) {
      if (consumed.has(nextIndex)) break
      if (!isPotentialNameToken(rawTokens[nextIndex])) break
      capitalizedIndexes.push(nextIndex)
    }

    break
  }

  if (capitalizedIndexes.length > 0) {
    return {
      nome: capitalizedIndexes.map((index) => rawTokens[index]).join(" ").trim(),
      consumed: new Set(capitalizedIndexes),
    }
  }

  const nameIndexes: number[] = []

  for (const [index, token] of rawTokens.entries()) {
    if (consumed.has(index)) break
    if (normalizeToken(token) === "per") continue
    nameIndexes.push(index)
  }

  const nome = nameIndexes.map((index) => rawTokens[index]).join(" ").trim()
  return {
    nome: nome.length > 0 ? nome : null,
    consumed: new Set(nameIndexes),
  }
}

function computeMissingFields(draft: Omit<QuickReservationDraft, "missingFields" | "confidence">): QuickReservationMissingField[] {
  const missingFields: QuickReservationMissingField[] = []
  if (!draft.nome) missingFields.push("nome")
  if (!draft.data) missingFields.push("data")
  if (!draft.fascia) missingFields.push("fascia")
  if (!draft.coperti) missingFields.push("coperti")
  return missingFields
}

function computeConfidence(missingFields: QuickReservationMissingField[]): QuickReservationConfidence {
  if (missingFields.length === 0) return "alta"
  if (missingFields.length <= 1) return "media"
  return "bassa"
}

export function parseQuickReservation(input: string, referenceDate = new Date()): QuickReservationDraft {
  const trimmedInput = input.trim()
  const rawTokens = trimmedInput.split(/\s+/).filter(Boolean)
  const tokens = rawTokens.map(normalizeToken)

  const parsedTime = parseTime(rawTokens)
  const parsedDate = parseDate(tokens, referenceDate)
  const parsedFascia = parseFascia(tokens, parsedTime.orario)
  const parsedCoperti = parseCoperti(rawTokens)

  const consumed = new Set<number>([
    ...parsedTime.consumed,
    ...parsedDate.consumed,
    ...parsedFascia.consumed,
    ...parsedCoperti.consumed,
  ])

  const parsedNome = parseNome(rawTokens, consumed)
  for (const index of parsedNome.consumed) consumed.add(index)

  const noteTokens = rawTokens.filter((_, index) => {
    if (consumed.has(index)) return false
    const token = tokens[index]
    return !DATE_WORDS.has(token) && !DINNER_WORDS.has(token) && !LUNCH_WORDS.has(token)
  })

  const baseDraft = {
    input: trimmedInput,
    nome: parsedNome.nome,
    data: parsedDate.data,
    fascia: parsedFascia.fascia,
    orario: parsedTime.orario,
    coperti: parsedCoperti.coperti,
    telefono: parseTelefono(trimmedInput),
    note: noteTokens.length > 0 ? noteTokens.join(" ") : null,
  }

  const missingFields = computeMissingFields(baseDraft)

  return {
    ...baseDraft,
    missingFields,
    confidence: computeConfidence(missingFields),
  }
}
