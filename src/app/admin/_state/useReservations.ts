"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { AdminReservation, ReservationStatus } from "./types"
import { addDays, addMinutesToTime, getRomeDate } from "./dateUtils"

const STORAGE_KEY = "calazingaro:admin:v4"
const LEGACY_V3_KEY = "calazingaro:admin:v3"
// v4 = aggiunti startsAt, endsAt, tableId, turnDuration, guestProfileId
// v3 = aveva tags + guestsRange (manca info temporale di fine)

// Duration di default usato dal seed (in realtà sarà sovrascritto dalla policy)
const SEED_DURATION = 90

function getSeed(today: string): AdminReservation[] {
  const yesterday = addDays(today, -1)
  const tomorrow = addDays(today, 1)
  const make = (
    partial: Omit<AdminReservation, "endsAt" | "turnDuration" | "tableId" | "guestProfileId" | "startsAt"> & {
      time: string | null
    }
  ): AdminReservation => ({
    ...partial,
    startsAt: partial.time,
    endsAt: partial.time ? addMinutesToTime(partial.time, SEED_DURATION) : null,
    turnDuration: 0, // 0 = usa policy
    tableId: null, // populated lazily by lookup in caller
    guestProfileId: null,
  })

  return [
    // Oggi pranzo
    make({
      id: "seed-1",
      name: "Rossi",
      date: today,
      service: "pranzo",
      time: "12:30",
      guests: 4,
      guestsRange: null,
      status: "arrived",
      table: "T3",
      notes: "fuori se possibile",
      tags: ["esterno"],
      source: "telefono",
      createdAt: `${today}T09:15:00`,
    }),
    make({
      id: "seed-2",
      name: "Bianchi",
      date: today,
      service: "pranzo",
      time: "13:00",
      guests: 2,
      guestsRange: null,
      status: "confirmed",
      table: null,
      notes: null,
      tags: [],
      source: "whatsapp",
      createdAt: `${today}T10:20:00`,
    }),
    make({
      id: "seed-3",
      name: "Famiglia Conti",
      date: today,
      service: "pranzo",
      time: "13:30",
      guests: 6,
      guestsRange: null,
      status: "confirmed",
      table: "T8",
      notes: "due bambini, seggiolone",
      tags: ["bambini", "seggiolone"],
      source: "manuale",
      createdAt: `${today}T11:05:00`,
    }),
    make({
      id: "seed-4",
      name: "Verdi",
      date: today,
      service: "pranzo",
      time: "14:00",
      guests: 3,
      guestsRange: null,
      status: "completed",
      table: "T5",
      notes: null,
      tags: [],
      source: "telefono",
      createdAt: `${today}T08:40:00`,
    }),

    // Oggi cena — incluso double seating su T2 (Franco esce, Bianchi 2 entra)
    make({
      id: "seed-5",
      name: "Franco",
      date: today,
      service: "cena",
      time: "19:30",
      guests: 2,
      guestsRange: null,
      status: "confirmed",
      table: "T2",
      notes: "anniversario",
      tags: ["anniversario"],
      source: "whatsapp",
      createdAt: `${today}T09:45:00`,
    }),
    make({
      id: "seed-6",
      name: "Marini",
      date: today,
      service: "cena",
      time: "20:30",
      guests: 4,
      guestsRange: null,
      status: "confirmed",
      table: null,
      notes: "un celiaco",
      tags: ["celiaco"],
      source: "telefono",
      createdAt: `${today}T10:30:00`,
    }),
    make({
      id: "seed-7",
      name: "De Luca",
      date: today,
      service: "cena",
      time: "21:00",
      guests: 5,
      guestsRange: null,
      status: "confirmed",
      table: "T7",
      notes: "tavolo vista mare",
      tags: ["vista-mare"],
      source: "manuale",
      createdAt: `${today}T11:10:00`,
    }),
    make({
      id: "seed-8",
      name: "Bianchi",
      date: today,
      service: "cena",
      time: "21:30",
      guests: 2,
      guestsRange: null,
      status: "confirmed",
      table: "T2",
      notes: "secondo turno",
      tags: [],
      source: "whatsapp",
      createdAt: `${today}T12:00:00`,
    }),
    make({
      id: "seed-8b",
      name: "Ferrari",
      date: today,
      service: "cena",
      time: "21:30",
      guests: 2,
      guestsRange: null,
      status: "confirmed",
      table: null,
      notes: null,
      tags: [],
      source: "whatsapp",
      createdAt: `${today}T12:30:00`,
    }),

    // Ieri (cronologia)
    make({
      id: "seed-9",
      name: "Galli",
      date: yesterday,
      service: "cena",
      time: "20:30",
      guests: 3,
      guestsRange: null,
      status: "completed",
      table: "T4",
      notes: null,
      tags: [],
      source: "telefono",
      createdAt: `${yesterday}T10:00:00`,
    }),

    // Domani
    make({
      id: "seed-10",
      name: "Ricci",
      date: tomorrow,
      service: "cena",
      time: "20:00",
      guests: 4,
      guestsRange: null,
      status: "confirmed",
      table: null,
      notes: "compleanno della nonna",
      tags: ["compleanno"],
      source: "whatsapp",
      createdAt: `${today}T14:20:00`,
    }),
    make({
      id: "seed-11",
      name: "Bruno",
      date: tomorrow,
      service: "pranzo",
      time: "13:00",
      guests: 12,
      guestsRange: { min: 10, max: 12 },
      status: "confirmed",
      table: null,
      notes: "gruppo aziendale",
      tags: [],
      source: "telefono",
      createdAt: `${today}T15:40:00`,
    }),
  ]
}

// Migration v3 → v4: aggiunge startsAt/endsAt/tableId/turnDuration/guestProfileId
type LegacyV3 = Omit<AdminReservation, "startsAt" | "endsAt" | "turnDuration" | "tableId" | "guestProfileId"> & {
  time: string | null
}

function migrateV3(legacy: LegacyV3[]): AdminReservation[] {
  return legacy.map((item) => ({
    ...item,
    startsAt: item.time,
    endsAt: item.time ? addMinutesToTime(item.time, SEED_DURATION) : null,
    turnDuration: 0,
    tableId: null,
    guestProfileId: null,
  }))
}

interface AddOptions {
  endsAt?: string | null
  turnDuration?: number
  tableId?: string | null
  guestProfileId?: string | null
}

interface UseReservationsResult {
  reservations: AdminReservation[]
  isLoaded: boolean
  today: string
  add: (reservation: AdminReservation, options?: AddOptions) => void
  remove: (id: string) => void
  updateStatus: (id: string, status: ReservationStatus) => void
  patch: (id: string, partial: Partial<AdminReservation>) => void
  resetToSeed: () => void
}

export function useReservations(): UseReservationsResult {
  const today = useMemo(() => getRomeDate(), [])
  const [reservations, setReservations] = useState<AdminReservation[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setReservations(JSON.parse(stored) as AdminReservation[])
      } else {
        // Migration v3 → v4: leggi se esiste vecchio formato
        const legacy = window.localStorage.getItem(LEGACY_V3_KEY)
        if (legacy) {
          const parsedLegacy = JSON.parse(legacy) as LegacyV3[]
          const migrated = migrateV3(parsedLegacy)
          setReservations(migrated)
        } else {
          setReservations(getSeed(today))
        }
      }
    } catch {
      setReservations(getSeed(today))
    }
    setIsLoaded(true)
  }, [today])

  useEffect(() => {
    if (!isLoaded) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations))
    } catch {
      // ignore
    }
  }, [isLoaded, reservations])

  const add = useCallback((reservation: AdminReservation) => {
    setReservations((current) => [reservation, ...current])
  }, [])

  const remove = useCallback((id: string) => {
    setReservations((current) => current.filter((item) => item.id !== id))
  }, [])

  const updateStatus = useCallback((id: string, status: ReservationStatus) => {
    setReservations((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item))
    )
  }, [])

  const patch = useCallback(
    (id: string, partial: Partial<AdminReservation>) => {
      setReservations((current) =>
        current.map((item) => (item.id === id ? { ...item, ...partial } : item))
      )
    },
    []
  )

  const resetToSeed = useCallback(() => {
    setReservations(getSeed(today))
  }, [today])

  return { reservations, isLoaded, today, add, remove, updateStatus, patch, resetToSeed }
}

export { STORAGE_KEY, LEGACY_V3_KEY }
