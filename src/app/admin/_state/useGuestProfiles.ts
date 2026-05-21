"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { GuestProfile, VipLevel, ReservationTag } from "./types"

const GUESTS_KEY = "calazingaro:admin-guests:v1"

function normalizePhone(phone: string | null): string | null {
  if (!phone) return null
  return phone.replace(/[\s\-().+]/g, "").replace(/^39/, "")
}

function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
}

interface LookupCriteria {
  name?: string | null
  phone?: string | null
  email?: string | null
}

interface UseGuestProfilesResult {
  guests: GuestProfile[]
  isLoaded: boolean
  lookup: (criteria: LookupCriteria) => GuestProfile | null
  upsert: (profile: GuestProfile) => void
  delete: (id: string) => void
  // Crea o aggiorna un profilo basato sui dati di una prenotazione, ritornando l'id
  ensureFromReservation: (data: {
    name: string
    phone?: string | null
    email?: string | null
    tags?: ReservationTag[]
    visitDate?: string
  }) => string
  // Segna una nuova visita (incrementa visit count + lastVisit)
  recordVisit: (guestId: string, visitDate: string) => void
  setVipLevel: (guestId: string, level: VipLevel) => void
}

export function useGuestProfiles(): UseGuestProfilesResult {
  const [guests, setGuests] = useState<GuestProfile[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(GUESTS_KEY)
      if (stored) setGuests(JSON.parse(stored) as GuestProfile[])
    } catch {
      // ignore
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    try {
      window.localStorage.setItem(GUESTS_KEY, JSON.stringify(guests))
    } catch {
      // ignore
    }
  }, [isLoaded, guests])

  const lookupIndex = useMemo(() => {
    const byPhone = new Map<string, GuestProfile>()
    const byEmail = new Map<string, GuestProfile>()
    const byName = new Map<string, GuestProfile>()
    for (const g of guests) {
      const ph = normalizePhone(g.phone)
      if (ph) byPhone.set(ph, g)
      if (g.email) byEmail.set(g.email.toLowerCase().trim(), g)
      byName.set(normalizeName(g.name), g)
    }
    return { byPhone, byEmail, byName }
  }, [guests])

  const lookup = useCallback(
    (criteria: LookupCriteria): GuestProfile | null => {
      const { name, phone, email } = criteria
      const ph = normalizePhone(phone ?? null)
      if (ph && lookupIndex.byPhone.has(ph)) return lookupIndex.byPhone.get(ph)!
      const em = email?.toLowerCase().trim()
      if (em && lookupIndex.byEmail.has(em)) return lookupIndex.byEmail.get(em)!
      if (name) {
        const norm = normalizeName(name)
        if (lookupIndex.byName.has(norm)) return lookupIndex.byName.get(norm)!
      }
      return null
    },
    [lookupIndex]
  )

  const upsert = useCallback((profile: GuestProfile) => {
    setGuests((current) => {
      const exists = current.some((g) => g.id === profile.id)
      return exists
        ? current.map((g) => (g.id === profile.id ? profile : g))
        : [...current, profile]
    })
  }, [])

  const deleteGuest = useCallback((id: string) => {
    setGuests((current) => current.filter((g) => g.id !== id))
  }, [])

  const ensureFromReservation = useCallback(
    (data: {
      name: string
      phone?: string | null
      email?: string | null
      tags?: ReservationTag[]
      visitDate?: string
    }): string => {
      const existing = lookup({ name: data.name, phone: data.phone, email: data.email })
      if (existing) {
        // Aggiorno il profilo esistente con eventuali nuovi tag persistenti
        // (allergie sono importanti da accumulare)
        const newPersistentTags = (data.tags ?? []).filter(
          (t) =>
            ["allergia", "celiaco", "vegano", "vegetariano"].includes(t) &&
            !existing.persistentTags.includes(t)
        )
        if (newPersistentTags.length > 0 || (data.phone && !existing.phone)) {
          const updated: GuestProfile = {
            ...existing,
            phone: data.phone ?? existing.phone,
            email: data.email ?? existing.email,
            persistentTags: [...existing.persistentTags, ...newPersistentTags],
          }
          upsert(updated)
        }
        return existing.id
      }

      // Crea nuovo profilo
      const id = crypto.randomUUID()
      const persistentTags = (data.tags ?? []).filter((t) =>
        ["allergia", "celiaco", "vegano", "vegetariano"].includes(t)
      )
      const newProfile: GuestProfile = {
        id,
        name: data.name,
        phone: data.phone ?? null,
        email: data.email ?? null,
        visitCount: 0,
        lastVisit: null,
        vipLevel: "none",
        persistentTags,
        notes: "",
        noShowCount: 0,
        createdAt: new Date().toISOString(),
      }
      setGuests((current) => [...current, newProfile])
      return id
    },
    [lookup, upsert]
  )

  const recordVisit = useCallback((guestId: string, visitDate: string) => {
    setGuests((current) =>
      current.map((g) =>
        g.id === guestId
          ? { ...g, visitCount: g.visitCount + 1, lastVisit: visitDate }
          : g
      )
    )
  }, [])

  const setVipLevel = useCallback((guestId: string, level: VipLevel) => {
    setGuests((current) =>
      current.map((g) => (g.id === guestId ? { ...g, vipLevel: level } : g))
    )
  }, [])

  return {
    guests,
    isLoaded,
    lookup,
    upsert,
    delete: deleteGuest,
    ensureFromReservation,
    recordVisit,
    setVipLevel,
  }
}

export { GUESTS_KEY }
