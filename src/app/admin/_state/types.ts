// Tipi per l'admin demo (no backend, solo localStorage)
import type { QuickReservationFascia, ReservationTag } from "@/lib/quick-reservation-parser"

export type ReservationStatus = "confirmed" | "arrived" | "completed" | "cancelled"
export type ReservationSource = "telefono" | "whatsapp" | "manuale"
export type ServiceFilter = "all" | QuickReservationFascia
export type AdminTab = "agenda" | "service" | "settings"
export type ZoneKey = "interno" | "esterno" | "terrazza" | "veranda"
export type VipLevel = "none" | "regular" | "vip"

// -----------------------------------------------------------------------------
// TAVOLO — entità sostituisce la stringa "T3" del vecchio modello
// -----------------------------------------------------------------------------
export interface AdminTable {
  id: string
  name: string         // "T1", "Terrazza-A"
  minSeats: number     // capienza minima accettabile (sotto = spreco)
  maxSeats: number     // capienza massima
  zone: ZoneKey
  active: boolean      // false = nascosto dalla sala (es. tavolo in manutenzione)
  order: number        // posizione visiva in lista/timeline
}

// -----------------------------------------------------------------------------
// TURNO — orari di apertura per giorno-settimana × servizio
// -----------------------------------------------------------------------------
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6  // 0=domenica, 6=sabato
export interface AdminShift {
  id: string
  day: DayOfWeek
  service: QuickReservationFascia
  openTime: string     // "12:00"
  closeTime: string    // "15:30"
  lastSeating: string  // "14:30" (ultima ora prenotabile)
  maxCovers: number    // capienza totale del turno (sala)
  active: boolean      // false = chiuso quel giorno
}

// -----------------------------------------------------------------------------
// TURN TIME POLICY — quanto dura un tavolo in base ai coperti
// -----------------------------------------------------------------------------
export interface TurnTimePolicy {
  // Esempio: { 1: 75, 2: 90, 3: 90, 4: 105, 5: 120, 6: 120, 7: 150, 8: 150 }
  // Le chiavi sono party size esatte; per party > max si usa il valore più alto
  byPartySize: Record<number, number>
  defaultDuration: number // fallback in minuti
}

// -----------------------------------------------------------------------------
// GUEST PROFILE — CRM ospite persistente
// -----------------------------------------------------------------------------
export interface GuestProfile {
  id: string
  name: string
  phone: string | null
  email: string | null
  visitCount: number
  lastVisit: string | null      // YYYY-MM-DD
  vipLevel: VipLevel
  persistentTags: ReservationTag[]
  notes: string                 // note libere (allergie, preferenze)
  noShowCount: number
  createdAt: string
}

// -----------------------------------------------------------------------------
// PRENOTAZIONE — estesa con startsAt/endsAt/tableId/guestProfileId
// -----------------------------------------------------------------------------
export interface AdminReservation {
  id: string
  name: string
  date: string                  // YYYY-MM-DD
  service: QuickReservationFascia
  time: string | null           // alias di startsAt per backward compat — HH:MM
  startsAt: string | null       // HH:MM
  endsAt: string | null         // HH:MM, calcolato da turn time policy
  turnDuration: number          // minuti, override del default (0 = usa policy)
  guests: number
  guestsRange: { min: number; max: number } | null
  status: ReservationStatus
  tableId: string | null        // riferimento ad AdminTable.id
  table: string | null          // backward compat: stringa display (denormalizzato)
  notes: string | null
  tags: ReservationTag[]
  source: ReservationSource
  guestProfileId: string | null // riferimento a GuestProfile.id
  createdAt: string             // ISO
}

export type { QuickReservationFascia, ReservationTag }
