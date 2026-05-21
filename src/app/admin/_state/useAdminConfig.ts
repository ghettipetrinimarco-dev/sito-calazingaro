"use client"

import { useCallback, useEffect, useState } from "react"
import type {
  AdminShift,
  AdminTable,
  DayOfWeek,
  TurnTimePolicy,
  ZoneKey,
} from "./types"

const CONFIG_KEY = "calazingaro:admin-config:v1"

interface AdminConfig {
  tables: AdminTable[]
  shifts: AdminShift[]
  turnTime: TurnTimePolicy
}

function defaultTables(): AdminTable[] {
  return [
    { id: "table-1", name: "T1", minSeats: 2, maxSeats: 4, zone: "interno", active: true, order: 1 },
    { id: "table-2", name: "T2", minSeats: 2, maxSeats: 4, zone: "interno", active: true, order: 2 },
    { id: "table-3", name: "T3", minSeats: 2, maxSeats: 6, zone: "interno", active: true, order: 3 },
    { id: "table-4", name: "T4", minSeats: 4, maxSeats: 8, zone: "interno", active: true, order: 4 },
    { id: "table-5", name: "T5", minSeats: 2, maxSeats: 4, zone: "esterno", active: true, order: 5 },
    { id: "table-6", name: "T6", minSeats: 2, maxSeats: 4, zone: "esterno", active: true, order: 6 },
    { id: "table-7", name: "T7", minSeats: 4, maxSeats: 6, zone: "terrazza", active: true, order: 7 },
    { id: "table-8", name: "T8", minSeats: 4, maxSeats: 8, zone: "terrazza", active: true, order: 8 },
    { id: "table-9", name: "T9", minSeats: 2, maxSeats: 4, zone: "veranda", active: true, order: 9 },
  ]
}

function defaultShifts(): AdminShift[] {
  // Settimana standard: lunedì chiuso, da martedì a domenica pranzo + cena
  // Adattabile dal gestore in Impostazioni
  const shifts: AdminShift[] = []
  const days: DayOfWeek[] = [0, 2, 3, 4, 5, 6]  // dom, mar, mer, gio, ven, sab — lun chiuso
  for (const day of days) {
    shifts.push({
      id: `shift-${day}-pranzo`,
      day,
      service: "pranzo",
      openTime: "12:30",
      closeTime: "15:00",
      lastSeating: "14:00",
      maxCovers: 60,
      active: true,
    })
    shifts.push({
      id: `shift-${day}-cena`,
      day,
      service: "cena",
      openTime: "19:30",
      closeTime: "23:00",
      lastSeating: "22:00",
      maxCovers: 80,
      active: true,
    })
  }
  // Lunedì chiuso
  shifts.push({
    id: "shift-1-pranzo",
    day: 1,
    service: "pranzo",
    openTime: "12:30",
    closeTime: "15:00",
    lastSeating: "14:00",
    maxCovers: 0,
    active: false,
  })
  shifts.push({
    id: "shift-1-cena",
    day: 1,
    service: "cena",
    openTime: "19:30",
    closeTime: "23:00",
    lastSeating: "22:00",
    maxCovers: 0,
    active: false,
  })
  return shifts
}

function defaultTurnTime(): TurnTimePolicy {
  return {
    byPartySize: {
      1: 75,
      2: 90,
      3: 90,
      4: 105,
      5: 120,
      6: 120,
      7: 150,
      8: 150,
    },
    defaultDuration: 90,
  }
}

function defaultConfig(): AdminConfig {
  return {
    tables: defaultTables(),
    shifts: defaultShifts(),
    turnTime: defaultTurnTime(),
  }
}

interface UseAdminConfigResult {
  config: AdminConfig
  isLoaded: boolean
  // Tables
  upsertTable: (table: AdminTable) => void
  deleteTable: (id: string) => void
  reorderTables: (ids: string[]) => void
  // Shifts
  updateShift: (shift: AdminShift) => void
  // Turn time
  updateTurnTime: (policy: TurnTimePolicy) => void
  // Reset
  resetToDefault: () => void
  // Helpers
  getTableById: (id: string | null) => AdminTable | null
  getTableByName: (name: string | null) => AdminTable | null
  durationFor: (partySize: number) => number
  shiftFor: (date: string, service: "pranzo" | "cena") => AdminShift | null
  zoneLabel: (zone: ZoneKey) => string
}

const ZONE_LABELS: Record<ZoneKey, string> = {
  interno: "Interno",
  esterno: "Esterno",
  terrazza: "Terrazza",
  veranda: "Veranda",
}

export function useAdminConfig(): UseAdminConfigResult {
  const [config, setConfig] = useState<AdminConfig>(() => defaultConfig())
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CONFIG_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as AdminConfig
        setConfig(parsed)
      } else {
        setConfig(defaultConfig())
      }
    } catch {
      setConfig(defaultConfig())
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    try {
      window.localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
    } catch {
      // localStorage pieno o disabilitato — è demo, ignoriamo
    }
  }, [isLoaded, config])

  const upsertTable = useCallback((table: AdminTable) => {
    setConfig((current) => {
      const exists = current.tables.some((t) => t.id === table.id)
      const tables = exists
        ? current.tables.map((t) => (t.id === table.id ? table : t))
        : [...current.tables, table]
      return { ...current, tables }
    })
  }, [])

  const deleteTable = useCallback((id: string) => {
    setConfig((current) => ({
      ...current,
      tables: current.tables.filter((t) => t.id !== id),
    }))
  }, [])

  const reorderTables = useCallback((ids: string[]) => {
    setConfig((current) => {
      const map = new Map(current.tables.map((t) => [t.id, t]))
      const ordered = ids
        .map((id, index) => {
          const t = map.get(id)
          return t ? { ...t, order: index + 1 } : null
        })
        .filter((t): t is AdminTable => t !== null)
      // Aggiungo eventuali tavoli non presenti negli ids (safety)
      const missing = current.tables.filter((t) => !ids.includes(t.id))
      return { ...current, tables: [...ordered, ...missing] }
    })
  }, [])

  const updateShift = useCallback((shift: AdminShift) => {
    setConfig((current) => ({
      ...current,
      shifts: current.shifts.map((s) => (s.id === shift.id ? shift : s)),
    }))
  }, [])

  const updateTurnTime = useCallback((policy: TurnTimePolicy) => {
    setConfig((current) => ({ ...current, turnTime: policy }))
  }, [])

  const resetToDefault = useCallback(() => {
    setConfig(defaultConfig())
  }, [])

  const getTableById = useCallback(
    (id: string | null) => {
      if (!id) return null
      return config.tables.find((t) => t.id === id) ?? null
    },
    [config.tables]
  )

  const getTableByName = useCallback(
    (name: string | null) => {
      if (!name) return null
      const target = name.trim().toLowerCase()
      return (
        config.tables.find(
          (t) =>
            t.name.toLowerCase() === target ||
            t.name.toLowerCase() === `t${target}` ||
            t.name.toLowerCase().replace(/^t/, "") === target
        ) ?? null
      )
    },
    [config.tables]
  )

  const durationFor = useCallback(
    (partySize: number): number => {
      const policy = config.turnTime
      // Cerca match esatto, poi il valore più alto definito
      if (policy.byPartySize[partySize]) return policy.byPartySize[partySize]
      const keys = Object.keys(policy.byPartySize)
        .map(Number)
        .sort((a, b) => a - b)
      // Per party size > max definito, usa quello più alto
      const maxKey = keys[keys.length - 1]
      if (partySize > maxKey) return policy.byPartySize[maxKey]
      // Per party size < min definito, usa quello più basso
      const minKey = keys[0]
      if (partySize < minKey) return policy.byPartySize[minKey]
      // Interpolazione: cerca chiave più vicina <= partySize
      const closest = keys.filter((k) => k <= partySize).pop()
      if (closest != null && policy.byPartySize[closest]) return policy.byPartySize[closest]
      return policy.defaultDuration
    },
    [config.turnTime]
  )

  const shiftFor = useCallback(
    (date: string, service: "pranzo" | "cena"): AdminShift | null => {
      const [y, m, d] = date.split("-").map(Number)
      if (!y || !m || !d) return null
      // getUTCDay con noon trick per evitare DST issues
      const dayOfWeek = new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay() as DayOfWeek
      return (
        config.shifts.find((s) => s.day === dayOfWeek && s.service === service) ?? null
      )
    },
    [config.shifts]
  )

  const zoneLabel = useCallback((zone: ZoneKey) => ZONE_LABELS[zone], [])

  return {
    config,
    isLoaded,
    upsertTable,
    deleteTable,
    reorderTables,
    updateShift,
    updateTurnTime,
    resetToDefault,
    getTableById,
    getTableByName,
    durationFor,
    shiftFor,
    zoneLabel,
  }
}

export { CONFIG_KEY, defaultConfig }
