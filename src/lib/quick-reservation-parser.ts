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
  copertiRange: { min: number; max: number } | null
  telefono: string | null
  note: string | null
  tags: ReservationTag[]
  missingFields: QuickReservationMissingField[]
  confidence: QuickReservationConfidence
  // True quando l'orario è stato indovinato senza marker espliciti
  // (utile per offrire "scambia orario ↔ coperti" nella UI)
  orarioAmbiguo: boolean
  copertiAmbiguo: boolean
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
const IGNORED_NOTE_WORDS = new Set(["alle", "alla", "al", "per", "persona", "persone", "coperto", "coperti", "pax", "ore", "h", "siamo", "verso", "ospiti", "ospite", "adulti", "adulto", "tra", "fra", "da", "a", "e"])
// Marker che indicano "il numero che segue è un orario"
const TIME_MARKER_BEFORE = new Set(["alle", "ore", "h", "verso", "alle:", "ore:"])
// Marker che indicano "il numero adiacente è un conteggio coperti"
const COUNT_MARKER_BEFORE = new Set(["siamo", "in"])
const COUNT_MARKER_AFTER = new Set(["persone", "persona", "coperti", "coperto", "pax", "ospiti", "ospite", "adulti", "adulto"])
// Dizionario tag — chiave normalizzata che matcha l'input → categoria tag
// Lo stesso testo può attivare più tag (es. "anniversario allergico al glutine")
export type ReservationTag =
  | "anniversario"
  | "compleanno"
  | "allergia"
  | "celiaco"
  | "vegano"
  | "vegetariano"
  | "bambini"
  | "passeggino"
  | "seggiolone"
  | "esterno"
  | "vista-mare"
  | "interno"
  | "terrazza"
  | "veranda"

const TAG_PATTERNS: { tag: ReservationTag; patterns: RegExp[] }[] = [
  { tag: "anniversario", patterns: [/\banniversario\b/i] },
  { tag: "compleanno", patterns: [/\bcompleanno\b/i, /\bbirthday\b/i] },
  {
    tag: "allergia",
    patterns: [/\ballergi(a|e|co|ca|ci|che)\b/i, /\bintoll(eranza|eranze|erante|eranti)\b/i],
  },
  { tag: "celiaco", patterns: [/\bceliac(o|a|i|he)\b/i, /\bsenza\s+glutine\b/i, /\bgluten[\s-]?free\b/i] },
  { tag: "vegano", patterns: [/\bvegan[oai]?\b/i] },
  { tag: "vegetariano", patterns: [/\bvegetarian[oai]?\b/i] },
  { tag: "bambini", patterns: [/\bbambin[oi]\b/i, /\bbimb[oi]\b/i, /\bbambine\b/i, /\bbimbe\b/i] },
  { tag: "passeggino", patterns: [/\bpassegg(ino|ini)\b/i] },
  { tag: "seggiolone", patterns: [/\bseggiolon[ei]\b/i] },
  { tag: "esterno", patterns: [/\bfuori\b/i, /\besterno\b/i] },
  { tag: "vista-mare", patterns: [/\bvista\s+mare\b/i, /\bvista[\s-]mare\b/i, /\bsul\s+mare\b/i] },
  { tag: "interno", patterns: [/\bdentro\b/i, /\binterno\b/i, /\bsala\b/i] },
  { tag: "terrazza", patterns: [/\bterrazz(a|e)\b/i] },
  { tag: "veranda", patterns: [/\bverand(a|e)\b/i] },
]

export function extractTags(input: string): ReservationTag[] {
  const found = new Set<ReservationTag>()
  for (const { tag, patterns } of TAG_PATTERNS) {
    if (patterns.some((pattern) => pattern.test(input))) found.add(tag)
  }
  return Array.from(found)
}

const NOTE_HINT_WORDS = new Set([
  "allergia",
  "allergie",
  "anniversario",
  "bambini",
  "bambino",
  "bimbi",
  "bimbo",
  "compleanno",
  "dentro",
  "fuori",
  "mare",
  "passeggino",
  "seggiolone",
  "tav",
  "table",
  "tavolo",
  "terrazza",
  "veranda",
  "vista",
])

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

function isTableReference(tokens: string[], index: number): boolean {
  const previousToken = tokens[index - 1]
  return previousToken === "tavolo" || previousToken === "tav" || previousToken === "table"
}

function hasOtherSmallNumber(rawTokens: string[], currentIndex: number): boolean {
  return rawTokens.some((token, index) => {
    if (index === currentIndex) return false
    if (token.includes(":") || token.includes(".")) return false

    const match = token.match(/^\d{1,2}$/)
    if (!match) return false

    const value = Number(match[0])
    return value >= 1 && value <= 30
  })
}

function isPrecededByTimeMarker(tokens: string[], index: number): boolean {
  // "alle 21" / "ore 21" / "h 21" / "verso 21"
  const prev = tokens[index - 1]
  if (prev && TIME_MARKER_BEFORE.has(prev)) return true
  // "per le 21" — pattern a 2 token
  const prev2 = tokens[index - 2]
  if (prev === "le" && prev2 === "per") return true
  if (prev === "ore" && prev2 === "alle") return true
  return false
}

function isCopertiContext(tokens: string[], index: number): { marker: boolean; after: boolean } {
  const prev = tokens[index - 1]
  const next = tokens[index + 1]
  if (prev && COUNT_MARKER_BEFORE.has(prev)) return { marker: true, after: false }
  if (next && COUNT_MARKER_AFTER.has(next)) return { marker: true, after: true }
  return { marker: false, after: false }
}

// Cerca un orario esplicito (con marker o HH:MM). Affidabile, non ambiguo.
function parseTimeExplicit(rawTokens: string[], tokens: string[]): { orario: string | null; consumed: Set<number>; ambiguo: boolean } {
  const consumed = new Set<number>()

  // 1) HH:MM o HH.MM è inequivocabile
  for (const [index, token] of rawTokens.entries()) {
    const match = token.match(/^([01]?\d|2[0-3])[:.]([0-5]\d)$/)
    if (!match) continue
    consumed.add(index)
    return {
      orario: `${match[1].padStart(2, "0")}:${match[2]}`,
      consumed,
      ambiguo: false,
    }
  }

  // 2) Numero preceduto da marker tempo ("alle 21", "ore 19", "h 20", "verso 20", "per le 21")
  for (const [index, token] of rawTokens.entries()) {
    if (isTableReference(tokens, index)) continue
    const match = token.match(/^\d{1,2}$/)
    if (!match) continue
    if (!isPrecededByTimeMarker(tokens, index)) continue
    const value = Number(match[0])
    if (value < 0 || value > 23) continue
    consumed.add(index)
    return {
      orario: `${String(value).padStart(2, "0")}:00`,
      consumed,
      ambiguo: false,
    }
  }

  return { orario: null, consumed, ambiguo: false }
}

// Euristica: numero "secco" che sembra un orario (18-23 cena, 12-15 pranzo se c'è altro numero piccolo)
function parseTimeFallback(
  rawTokens: string[],
  tokens: string[],
  alreadyConsumed: Set<number>,
  hasCopertiAlready: boolean
): { orario: string | null; consumed: Set<number>; ambiguo: boolean } {
  const consumed = new Set<number>()

  for (const [index, token] of rawTokens.entries()) {
    if (alreadyConsumed.has(index)) continue
    if (isTableReference(tokens, index)) continue
    // Numero in contesto coperti esplicito: non è un orario
    if (isCopertiContext(tokens, index).marker) continue

    const match = token.match(/^\d{1,2}$/)
    if (!match) continue

    const value = Number(match[0])
    const isDinnerHour = value >= 18 && value <= 23
    const isLunchHourWithCopertiNearby = value >= 12 && value <= 15 && hasOtherSmallNumber(rawTokens, index)

    if (!isDinnerHour && !isLunchHourWithCopertiNearby) continue

    // Edge case: se ci sono già coperti chiari (via marker) e questo numero potrebbe essere coperti aggiuntivi,
    // lo prendiamo lo stesso come orario perché è il valore "secco" tipico.
    void hasCopertiAlready

    consumed.add(index)
    return {
      orario: `${String(value).padStart(2, "0")}:00`,
      consumed,
      ambiguo: true, // numero secco senza marker — l'utente può aver voluto coperti
    }
  }

  return { orario: null, consumed, ambiguo: false }
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

// Range coperti: "10-12", "tra 10 e 12", "da 10 a 12"
function parseCopertiRange(
  rawTokens: string[],
  tokens: string[],
  alreadyConsumed: Set<number>
): { coperti: number | null; range: { min: number; max: number } | null; consumed: Set<number> } {
  const consumed = new Set<number>()

  // "10-12" compatto in un singolo token
  for (const [index, token] of rawTokens.entries()) {
    if (alreadyConsumed.has(index)) continue
    const match = token.match(/^(\d{1,2})[-–](\d{1,2})$/)
    if (!match) continue
    const min = Number(match[1])
    const max = Number(match[2])
    if (min < 1 || max < 1 || min > 30 || max > 30 || min >= max) continue
    consumed.add(index)
    return { coperti: max, range: { min, max }, consumed }
  }

  // "tra 10 e 12" / "fra 10 e 12" / "da 10 a 12"
  for (let i = 0; i < tokens.length - 3; i++) {
    if (alreadyConsumed.has(i) || alreadyConsumed.has(i + 1) || alreadyConsumed.has(i + 3)) continue
    const start = tokens[i]
    const middle = tokens[i + 2]
    if (!start || !middle) continue
    const startsRange = (start === "tra" || start === "fra") && middle === "e"
    const startsDaA = start === "da" && middle === "a"
    if (!startsRange && !startsDaA) continue

    const minMatch = rawTokens[i + 1]?.match(/^\d{1,2}$/)
    const maxMatch = rawTokens[i + 3]?.match(/^\d{1,2}$/)
    if (!minMatch || !maxMatch) continue
    const min = Number(minMatch[0])
    const max = Number(maxMatch[0])
    if (min < 1 || max < 1 || min > 30 || max > 30 || min >= max) continue

    consumed.add(i + 1)
    consumed.add(i + 3)
    return { coperti: max, range: { min, max }, consumed }
  }

  return { coperti: null, range: null, consumed }
}

// Coperti via marker espliciti: "siamo 4" / "in 4" / "4 persone" / "4 pax" / "4 coperti"
function parseCopertiFromMarkers(
  rawTokens: string[],
  tokens: string[],
  alreadyConsumed: Set<number>
): { coperti: number | null; consumed: Set<number> } {
  const consumed = new Set<number>()

  for (const [index, token] of rawTokens.entries()) {
    if (alreadyConsumed.has(index)) continue
    if (isTableReference(tokens, index)) continue
    const match = token.match(/^\d{1,2}$/)
    if (!match) continue
    if (!isCopertiContext(tokens, index).marker) continue

    const value = Number(match[0])
    if (value < 1 || value > 30) continue

    consumed.add(index)
    return { coperti: value, consumed }
  }

  return { coperti: null, consumed }
}

function parseCoperti(rawTokens: string[], tokens: string[], alreadyConsumed: Set<number>): { coperti: number | null; consumed: Set<number>; ambiguo: boolean } {
  const consumed = new Set<number>()

  for (const [index, token] of rawTokens.entries()) {
    if (alreadyConsumed.has(index)) continue
    if (isTableReference(tokens, index)) continue
    if (token.includes(":") || token.includes(".")) continue
    // Salta numeri preceduti da marker tempo non già consumati (errore di parsing)
    if (isPrecededByTimeMarker(tokens, index)) continue

    const match = token.match(/^\d{1,2}$/)
    if (!match) continue

    const value = Number(match[0])
    if (value < 1 || value > 30) continue

    consumed.add(index)
    return {
      coperti: value,
      consumed,
      ambiguo: value >= 18 && value <= 23, // potrebbe essere un orario cena travestito
    }
  }

  return { coperti: null, consumed, ambiguo: false }
}

function parseTelefono(rawTokens: string[]): { telefono: string | null; consumed: Set<number> } {
  for (let startIndex = 0; startIndex < rawTokens.length; startIndex++) {
    const consumed = new Set<number>()
    const parts: string[] = []

    for (let index = startIndex; index < rawTokens.length; index++) {
      const cleaned = rawTokens[index].replace(/[^\d+]/g, "")
      if (!cleaned) break
      if (cleaned.includes("+") && cleaned !== "+39") break

      parts.push(cleaned)
      consumed.add(index)

      const digits = parts.join("").replace(/^\+39/, "").replace(/\D/g, "")
      if (digits.length >= 8 && digits.length <= 12) {
        return {
          telefono: parts.join("").replace(/\s/g, ""),
          consumed,
        }
      }

      if (digits.length > 12) break
    }
  }

  return { telefono: null, consumed: new Set<number>() }
}

function isPotentialNameToken(value: string): boolean {
  return /^[A-ZÀ-ÖØ-Þ]/.test(value)
}

function isNumberToken(value: string): boolean {
  return /^\d{1,2}$/.test(value)
}

function isLowercaseNameCandidate(token: string): boolean {
  if (!/^[a-zà-öø-ÿ]{2,}$/i.test(token)) return false
  if (DATE_WORDS.has(token)) return false
  if (DINNER_WORDS.has(token)) return false
  if (LUNCH_WORDS.has(token)) return false
  if (IGNORED_NOTE_WORDS.has(token)) return false
  if (NOTE_HINT_WORDS.has(token)) return false
  if (WEEKDAYS[token] !== undefined) return false
  return true
}

function parseNome(rawTokens: string[], tokens: string[], consumed: Set<number>): { nome: string | null; consumed: Set<number> } {
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

  const afterNumberIndex = tokens.findIndex((token, index) => {
    if (consumed.has(index)) return false
    if (!isLowercaseNameCandidate(token)) return false

    const previousIndex = index - 1
    return previousIndex >= 0 && consumed.has(previousIndex) && isNumberToken(rawTokens[previousIndex])
  })

  if (afterNumberIndex >= 0) {
    return {
      nome: rawTokens[afterNumberIndex],
      consumed: new Set([afterNumberIndex]),
    }
  }

  const beforeNumberIndex = tokens.findIndex((token, index) => {
    if (consumed.has(index)) return false
    if (!isLowercaseNameCandidate(token)) return false

    const nextIndex = index + 1
    return nextIndex < rawTokens.length && consumed.has(nextIndex) && isNumberToken(rawTokens[nextIndex])
  })

  if (beforeNumberIndex >= 0) {
    return {
      nome: rawTokens[beforeNumberIndex],
      consumed: new Set([beforeNumberIndex]),
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

function computeMissingFields(draft: Pick<QuickReservationDraft, "nome" | "data" | "fascia" | "coperti">): QuickReservationMissingField[] {
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

  // 1) Marker espliciti (più affidabili): orario via "alle/ore/h/verso/per le", coperti via "siamo/in/persone/pax/coperti"
  const parsedTimeExplicit = parseTimeExplicit(rawTokens, tokens)
  const parsedDate = parseDate(tokens, referenceDate)
  const parsedTelefono = parseTelefono(rawTokens)

  const consumedSoFar = new Set<number>([
    ...parsedTimeExplicit.consumed,
    ...parsedDate.consumed,
    ...parsedTelefono.consumed,
  ])

  const parsedRange = parseCopertiRange(rawTokens, tokens, consumedSoFar)
  for (const i of parsedRange.consumed) consumedSoFar.add(i)

  const parsedCopertiMarker = parseCopertiFromMarkers(rawTokens, tokens, consumedSoFar)
  for (const i of parsedCopertiMarker.consumed) consumedSoFar.add(i)

  // 2) Fallback euristici per orario e coperti, sui token non ancora consumati
  let orario = parsedTimeExplicit.orario
  let orarioAmbiguo = parsedTimeExplicit.ambiguo
  let timeConsumed = parsedTimeExplicit.consumed

  if (!orario) {
    const fallback = parseTimeFallback(rawTokens, tokens, consumedSoFar, parsedCopertiMarker.coperti !== null || parsedRange.coperti !== null)
    orario = fallback.orario
    orarioAmbiguo = fallback.ambiguo
    timeConsumed = new Set<number>([...timeConsumed, ...fallback.consumed])
    for (const i of fallback.consumed) consumedSoFar.add(i)
  }

  const parsedFascia = parseFascia(tokens, orario)
  for (const i of parsedFascia.consumed) consumedSoFar.add(i)

  let coperti = parsedCopertiMarker.coperti ?? parsedRange.coperti
  let copertiAmbiguo = false
  let copertiConsumed = new Set<number>([...parsedCopertiMarker.consumed, ...parsedRange.consumed])

  if (coperti === null) {
    const fallbackCoperti = parseCoperti(rawTokens, tokens, consumedSoFar)
    coperti = fallbackCoperti.coperti
    copertiAmbiguo = fallbackCoperti.ambiguo
    copertiConsumed = new Set<number>([...copertiConsumed, ...fallbackCoperti.consumed])
    for (const i of fallbackCoperti.consumed) consumedSoFar.add(i)
  }

  const consumed = new Set<number>([
    ...timeConsumed,
    ...parsedDate.consumed,
    ...parsedFascia.consumed,
    ...parsedTelefono.consumed,
    ...copertiConsumed,
  ])

  const parsedNome = parseNome(rawTokens, tokens, consumed)
  for (const index of parsedNome.consumed) consumed.add(index)

  const noteTokens = rawTokens.filter((_, index) => {
    if (consumed.has(index)) return false
    const token = tokens[index]
    return !DATE_WORDS.has(token) && !DINNER_WORDS.has(token) && !LUNCH_WORDS.has(token) && !IGNORED_NOTE_WORDS.has(token)
  })

  const tags = extractTags(trimmedInput)

  const baseDraft = {
    input: trimmedInput,
    nome: parsedNome.nome,
    data: parsedDate.data,
    fascia: parsedFascia.fascia,
    orario,
    coperti,
    copertiRange: parsedRange.range,
    telefono: parsedTelefono.telefono,
    note: noteTokens.length > 0 ? noteTokens.join(" ") : null,
    tags,
  }

  const missingFields = computeMissingFields(baseDraft)

  return {
    ...baseDraft,
    orarioAmbiguo,
    copertiAmbiguo,
    missingFields,
    confidence: computeConfidence(missingFields),
  }
}
