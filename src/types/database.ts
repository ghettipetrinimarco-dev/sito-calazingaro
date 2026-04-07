// Tipi del database Supabase — verificare sempre questi prima di scrivere query

export type StatoPrenotazione =
  | "pending"
  | "confirmed"
  | "rejected"
  | "arrived"
  | "completed"
  | "cancelled"

export type CanalePrenotazione = "online" | "telefono"

export type TipoPrenotazione = "spiaggia" | "ristorante"

export interface Reservation {
  id: string
  created_at: string
  nome: string
  cognome: string
  email: string
  telefono: string
  data: string // YYYY-MM-DD
  ora: string | null // HH:MM — solo per ristorante
  coperti: number
  tipo: TipoPrenotazione
  canale: CanalePrenotazione
  stato: StatoPrenotazione
  note: string | null
  tavolo_id: string | null
  time_slot_id: string | null
  servizio: string | null // es. "ombrellone_king", "ombrellone_standard", "lettino"
}

export interface Tavolo {
  id: string
  created_at: string
  nome: string
  capienza: number
  zona: string | null
  attivo: boolean
}

export interface TimeSlot {
  id: string
  ora_inizio: string // HH:MM
  ora_fine: string // HH:MM
  capacita_totale: number
  tipo: TipoPrenotazione
  attivo: boolean
}

export interface SalaLayout {
  id: string
  updated_at: string
  layout: TavoloPosition[]
}

export interface TavoloPosition {
  tavolo_id: string
  x: number
  y: number
  rotazione: number
}

export interface Settings {
  chiave: string
  valore: string
}

// Tipo per il database Supabase (usato nel client tipizzato)
export interface Database {
  public: {
    Tables: {
      reservations: {
        Row: Reservation
        Insert: Omit<Reservation, "id" | "created_at">
        Update: Partial<Omit<Reservation, "id" | "created_at">>
      }
      tavoli: {
        Row: Tavolo
        Insert: Omit<Tavolo, "id" | "created_at">
        Update: Partial<Omit<Tavolo, "id" | "created_at">>
      }
      time_slots: {
        Row: TimeSlot
        Insert: Omit<TimeSlot, "id">
        Update: Partial<TimeSlot>
      }
      sala_layouts: {
        Row: SalaLayout
        Insert: Omit<SalaLayout, "id" | "updated_at">
        Update: Partial<Omit<SalaLayout, "id">>
      }
      settings: {
        Row: Settings
        Insert: Settings
        Update: Partial<Settings>
      }
    }
    Functions: {
      crea_prenotazione: {
        Args: {
          p_nome: string
          p_cognome: string
          p_email: string
          p_telefono: string
          p_data: string
          p_coperti: number
          p_tipo: TipoPrenotazione
          p_canale: CanalePrenotazione
          p_note: string | null
          p_time_slot_id: string | null
          p_servizio: string | null
        }
        Returns: { id: string; stato: StatoPrenotazione }
      }
    }
  }
}
