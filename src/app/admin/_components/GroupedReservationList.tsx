"use client"

import { useMemo } from "react"
import type { AdminReservation, ReservationStatus } from "../_state/types"
import CompactReservationRow from "./CompactReservationRow"
import EmptyState from "./EmptyState"

interface Props {
  reservations: AdminReservation[]
  variant?: "agenda" | "service"
  isLoaded: boolean
  emptyTitle?: string
  emptyDescription?: string
  groupBy?: "time-slot" | "hour"
  onUpdateStatus: (id: string, status: ReservationStatus) => void
  onPatch: (id: string, partial: Partial<Pick<AdminReservation, "table" | "notes">>) => void
}

interface Group {
  label: string
  key: string
  items: AdminReservation[]
}

// Raggruppa per fascia 30-min ("13:00" / "13:30") o per ora piena ("13:00")
function groupByTime(items: AdminReservation[], mode: "time-slot" | "hour"): Group[] {
  const buckets = new Map<string, AdminReservation[]>()
  const noTime: AdminReservation[] = []

  for (const reservation of items) {
    if (!reservation.time) {
      noTime.push(reservation)
      continue
    }
    const [hh, mm] = reservation.time.split(":").map(Number)
    let key: string
    if (mode === "hour") {
      key = `${String(hh).padStart(2, "0")}:00`
    } else {
      // 30-min slot
      const slotMin = mm < 30 ? "00" : "30"
      key = `${String(hh).padStart(2, "0")}:${slotMin}`
    }
    const arr = buckets.get(key) ?? []
    arr.push(reservation)
    buckets.set(key, arr)
  }

  const sortedKeys = Array.from(buckets.keys()).sort()
  const groups: Group[] = sortedKeys.map((key) => ({
    key,
    label: key,
    items: (buckets.get(key) ?? []).sort((a, b) =>
      (a.time ?? "").localeCompare(b.time ?? "")
    ),
  }))

  if (noTime.length > 0) {
    groups.push({ key: "no-time", label: "Senza orario", items: noTime })
  }

  return groups
}

export default function GroupedReservationList({
  reservations,
  variant = "agenda",
  isLoaded,
  emptyTitle = "Nessuna prenotazione",
  emptyDescription = "Cambia giorno o inserisci una nuova prenotazione.",
  groupBy = "time-slot",
  onUpdateStatus,
  onPatch,
}: Props) {
  const groups = useMemo(() => groupByTime(reservations, groupBy), [reservations, groupBy])

  if (!isLoaded) {
    return <EmptyState title="Caricamento" description="Sto recuperando l'agenda…" />
  }

  if (reservations.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <section key={group.key}>
          <div className="mb-2 flex items-center gap-3">
            <p
              className="text-[0.78rem] tabular-nums"
              style={{
                fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
                color: "var(--adm-accent-deep)",
                fontWeight: 500,
                letterSpacing: "0.02em",
              }}
            >
              {group.label}
            </p>
            <span
              className="h-px flex-1"
              style={{ background: "var(--adm-line)" }}
            />
            <span
              className="text-[0.62rem] uppercase tracking-[0.16em] tabular-nums"
              style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
            >
              {group.items.length} {group.items.length === 1 ? "tavolo" : "tavoli"}
            </span>
          </div>
          <div className="grid gap-2">
            {group.items.map((reservation) => (
              <CompactReservationRow
                key={reservation.id}
                reservation={reservation}
                variant={variant}
                onUpdateStatus={onUpdateStatus}
                onPatch={onPatch}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
