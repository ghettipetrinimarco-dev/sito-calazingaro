"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { AdminReservation, AdminTable, ReservationStatus } from "../_state/types"
import { addMinutesToTime, getRomeTime, timeToMinutes } from "../_state/dateUtils"

interface Props {
  reservations: AdminReservation[]
  showingToday: boolean
  tables: AdminTable[]
  getTableById: (id: string | null) => AdminTable | null
  durationFor: (partySize: number) => number
  onClickReservation?: (id: string) => void
}

const STATUS_COLOR: Record<ReservationStatus, { bg: string; border: string; fg: string }> = {
  confirmed: {
    bg: "rgba(72,111,122,0.18)",
    border: "rgba(72,111,122,0.55)",
    fg: "var(--adm-info)",
  },
  arrived: {
    bg: "rgba(91,122,74,0.22)",
    border: "rgba(91,122,74,0.6)",
    fg: "var(--adm-ok)",
  },
  completed: {
    bg: "rgba(38,35,31,0.08)",
    border: "rgba(38,35,31,0.25)",
    fg: "var(--adm-muted)",
  },
  cancelled: {
    bg: "rgba(138,74,58,0.12)",
    border: "rgba(138,74,58,0.45)",
    fg: "var(--adm-busy)",
  },
}

interface Row {
  key: string
  label: string
  table: AdminTable | null
  items: EnrichedReservation[]
}

interface EnrichedReservation {
  reservation: AdminReservation
  startMin: number
  endMin: number
  durationMin: number
}

// Calcola la fine reale di una prenotazione: usa endsAt se c'è, altrimenti calcola da turn time
function enrichReservation(
  reservation: AdminReservation,
  durationFor: (n: number) => number
): EnrichedReservation | null {
  const startMin = timeToMinutes(reservation.startsAt ?? reservation.time)
  if (startMin == null) return null
  const dur = reservation.turnDuration > 0
    ? reservation.turnDuration
    : durationFor(reservation.guests)
  const endsAt = reservation.endsAt ?? addMinutesToTime(reservation.startsAt ?? reservation.time ?? "00:00", dur)
  const endMin = timeToMinutes(endsAt) ?? startMin + dur
  return { reservation, startMin, endMin, durationMin: endMin - startMin }
}

function getTimeRange(items: EnrichedReservation[]): { start: number; end: number } {
  if (items.length === 0) return { start: 12 * 60, end: 23 * 60 }
  const starts = items.map((e) => e.startMin)
  const ends = items.map((e) => e.endMin)
  const min = Math.min(...starts)
  const max = Math.max(...ends)
  const start = Math.max(0, Math.floor((min - 30) / 60) * 60)
  const end = Math.min(24 * 60, Math.ceil((max + 30) / 60) * 60)
  return { start, end }
}

function minToHHMM(m: number): string {
  const hh = Math.floor(m / 60)
  const mm = m % 60
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`
}

function buildRows(
  enriched: EnrichedReservation[],
  tables: AdminTable[],
  getTableById: (id: string | null) => AdminTable | null
): Row[] {
  const byTableId = new Map<string, EnrichedReservation[]>()
  const unassigned: EnrichedReservation[] = []

  for (const e of enriched) {
    const tableId = e.reservation.tableId
    // Backward compat: prova lookup per nome se manca tableId
    let resolvedTable = getTableById(tableId)
    if (!resolvedTable && e.reservation.table) {
      const name = e.reservation.table.toLowerCase()
      resolvedTable = tables.find((t) => t.name.toLowerCase() === name) ?? null
    }
    if (resolvedTable) {
      const arr = byTableId.get(resolvedTable.id) ?? []
      arr.push(e)
      byTableId.set(resolvedTable.id, arr)
    } else {
      unassigned.push(e)
    }
  }

  // Mostra TUTTI i tavoli attivi configurati (anche se vuoti), ordinati per `order`
  const sortedTables = tables
    .filter((t) => t.active || byTableId.has(t.id))
    .sort((a, b) => a.order - b.order)

  const rows: Row[] = sortedTables.map((table) => ({
    key: table.id,
    label: table.name,
    table,
    items: byTableId.get(table.id) ?? [],
  }))

  if (unassigned.length > 0) {
    rows.push({ key: "unassigned", label: "Da assegnare", table: null, items: unassigned })
  }

  return rows
}

export default function ServiceTimeline({
  reservations,
  showingToday,
  tables,
  getTableById,
  durationFor,
  onClickReservation,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [nowMin, setNowMin] = useState<number | null>(null)

  useEffect(() => {
    if (!showingToday) {
      setNowMin(null)
      return
    }
    const update = () => setNowMin(timeToMinutes(getRomeTime()))
    update()
    const interval = window.setInterval(update, 60_000)
    return () => window.clearInterval(interval)
  }, [showingToday])

  const enriched = useMemo(
    () =>
      reservations
        .filter((r) => r.status !== "cancelled")
        .map((r) => enrichReservation(r, durationFor))
        .filter((e): e is EnrichedReservation => e !== null),
    [reservations, durationFor]
  )

  const range = useMemo(() => getTimeRange(enriched), [enriched])
  const rows = useMemo(
    () => buildRows(enriched, tables, getTableById),
    [enriched, tables, getTableById]
  )

  const totalMin = range.end - range.start
  const hourSlots = useMemo(() => {
    const slots: number[] = []
    for (let m = range.start; m <= range.end; m += 60) slots.push(m)
    return slots
  }, [range])

  if (enriched.length === 0) return null

  const occupiedCount = rows.filter((r) => r.table && r.items.length > 0).length

  return (
    <div className="admin-panel overflow-hidden" ref={containerRef}>
      <div className="flex items-baseline justify-between gap-4 px-4 pt-4 md:px-5">
        <div>
          <p
            className="text-[0.6rem] uppercase tracking-[0.22em]"
            style={{ color: "var(--adm-accent-deep)", fontFamily: "var(--font-quicksand)" }}
          >
            Flusso del servizio
          </p>
          <p
            className="mt-1 text-[0.78rem]"
            style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
          >
            {occupiedCount}/{rows.filter((r) => r.table).length} tavoli occupati
            {showingToday && nowMin != null && ` · adesso ${minToHHMM(nowMin)}`}
          </p>
        </div>
        <div
          className="hidden md:flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.14em]"
          style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: "var(--adm-info)" }} /> Prenotata
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: "var(--adm-ok)" }} /> In sala
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: "var(--adm-muted)" }} /> Chiusa
          </span>
        </div>
      </div>

      <div className="mt-3 overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
        <div style={{ minWidth: "min(900px, 100%)", paddingBottom: 12 }}>
          {/* Header ore */}
          <div
            className="relative grid border-b"
            style={{
              gridTemplateColumns: "96px 1fr",
              borderColor: "var(--adm-line)",
            }}
          >
            <div />
            <div className="relative h-8">
              {hourSlots.map((m) => {
                const left = ((m - range.start) / totalMin) * 100
                return (
                  <span
                    key={m}
                    className="absolute -translate-x-1/2 text-[0.66rem] tabular-nums"
                    style={{
                      left: `${left}%`,
                      top: 6,
                      color: "var(--adm-muted)",
                      fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
                    }}
                  >
                    {minToHHMM(m)}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Righe tavoli */}
          {rows.map((row, rowIndex) => (
            <div
              key={row.key}
              className="grid items-center border-b"
              style={{
                gridTemplateColumns: "96px 1fr",
                borderColor: "var(--adm-line)",
                background: rowIndex % 2 === 0 ? "transparent" : "rgba(20,17,13,0.02)",
              }}
            >
              <div
                className="px-4 py-2 text-[0.78rem]"
                style={{
                  color: !row.table ? "var(--adm-muted)" : "var(--adm-text)",
                  fontFamily: "var(--font-quicksand)",
                  fontWeight: 600,
                  fontStyle: !row.table ? "italic" : "normal",
                }}
              >
                <div className="leading-tight">{row.label}</div>
                {row.table && (
                  <div
                    className="text-[0.6rem]"
                    style={{ color: "var(--adm-muted)", fontWeight: 500 }}
                  >
                    {row.table.minSeats}-{row.table.maxSeats}p · {row.table.zone}
                  </div>
                )}
              </div>
              <div className="relative h-12 px-1">
                {/* Linee verticali ogni ora */}
                {hourSlots.slice(1, -1).map((m) => {
                  const left = ((m - range.start) / totalMin) * 100
                  return (
                    <span
                      key={m}
                      aria-hidden="true"
                      className="pointer-events-none absolute top-0 h-full w-px"
                      style={{ left: `${left}%`, background: "rgba(20,17,13,0.04)" }}
                    />
                  )
                })}

                {/* Linea ora corrente */}
                {nowMin != null && nowMin >= range.start && nowMin <= range.end && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 h-full w-[2px] rounded-full"
                    style={{
                      left: `${((nowMin - range.start) / totalMin) * 100}%`,
                      background: "var(--adm-accent)",
                      boxShadow: "0 0 0 3px rgba(200,168,122,0.18)",
                    }}
                  />
                )}

                {/* Blocchi prenotazione */}
                {row.items.map((e) => {
                  const r = e.reservation
                  const left = ((e.startMin - range.start) / totalMin) * 100
                  const widthPct = (e.durationMin / totalMin) * 100
                  const colors = STATUS_COLOR[r.status]

                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => onClickReservation?.(r.id)}
                      className="absolute top-1.5 bottom-1.5 flex items-center gap-1.5 truncate rounded-[5px] border px-2 text-left transition hover:translate-y-[-1px]"
                      style={{
                        left: `${left}%`,
                        width: `${widthPct}%`,
                        minWidth: 56,
                        background: colors.bg,
                        borderColor: colors.border,
                        color: colors.fg,
                        fontFamily: "var(--font-quicksand)",
                        fontWeight: 600,
                        fontSize: "0.74rem",
                      }}
                      title={`${r.name} · ${minToHHMM(e.startMin)}-${minToHHMM(e.endMin)} · ${r.guests} coperti`}
                    >
                      <span className="truncate">{r.name}</span>
                      <span className="ml-auto tabular-nums opacity-75">
                        {r.guestsRange
                          ? `${r.guestsRange.min}-${r.guestsRange.max}p`
                          : `${r.guests}p`}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex md:hidden items-center justify-center gap-3 border-t px-4 py-2 text-[0.6rem] uppercase tracking-[0.14em]"
        style={{ borderColor: "var(--adm-line)", color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
      >
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full" style={{ background: "var(--adm-info)" }} /> Prenotata
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full" style={{ background: "var(--adm-ok)" }} /> In sala
        </span>
      </div>
    </div>
  )
}
