"use client"

import { useEffect, useMemo, useState } from "react"
import { ClockArrowDown, UserRoundCheck, CheckCircle2 } from "lucide-react"
import type {
  AdminReservation,
  AdminTable,
  ReservationStatus,
  ServiceFilter as ServiceFilterValue,
} from "../_state/types"
import {
  formatItalianDate,
  formatItalianDay,
  inferCurrentService,
} from "../_state/dateUtils"
import DayPicker from "./DayPicker"
import CompactReservationRow from "./CompactReservationRow"
import ServiceTimeline from "./ServiceTimeline"
import ServiceFilter from "./ServiceFilter"
import ServiceStatsBar from "./ServiceStatsBar"
import EmptyState from "./EmptyState"

interface Props {
  reservations: AdminReservation[]
  today: string
  isLoaded: boolean
  onUpdateStatus: (id: string, status: ReservationStatus) => void
  onPatch: (id: string, partial: Partial<Pick<AdminReservation, "table" | "notes">>) => void
  tables: AdminTable[]
  getTableById: (id: string | null) => AdminTable | null
  durationFor: (partySize: number) => number
}

function sortByTime(items: AdminReservation[]): AdminReservation[] {
  return [...items].sort((a, b) => {
    const aTime = a.time ?? "99:99"
    const bTime = b.time ?? "99:99"
    if (aTime !== bTime) return aTime.localeCompare(bTime)
    return a.createdAt.localeCompare(b.createdAt)
  })
}

export default function ServiceView({
  reservations,
  today,
  isLoaded,
  onUpdateStatus,
  onPatch,
  tables,
  getTableById,
  durationFor,
}: Props) {
  // In servizio: data sempre oggi by default, ma utente può cambiarla
  const [selectedDate, setSelectedDate] = useState(today)
  const [serviceFilter, setServiceFilter] = useState<ServiceFilterValue>("all")

  // Auto-select turno corrente al mount (in base all'ora italiana)
  useEffect(() => {
    setServiceFilter(inferCurrentService())
  }, [])

  const dayItems = useMemo(() => {
    return reservations.filter((item) => {
      if (item.date !== selectedDate) return false
      if (serviceFilter !== "all" && item.service !== serviceFilter) return false
      return true
    })
  }, [reservations, selectedDate, serviceFilter])

  const grouped = useMemo(() => {
    const active = dayItems.filter((item) => item.status !== "cancelled")
    return {
      inArrivo: sortByTime(active.filter((item) => item.status === "confirmed")),
      inSala: sortByTime(active.filter((item) => item.status === "arrived")),
      chiuse: sortByTime(active.filter((item) => item.status === "completed")),
    }
  }, [dayItems])

  const stats = useMemo(() => {
    const active = dayItems.filter((item) => item.status !== "cancelled")
    const inSalaItems = active.filter((item) => item.status === "arrived")
    const arrivatiTurno = active.filter(
      (item) => item.status === "arrived" || item.status === "completed"
    ).length
    return {
      prenotazioniAttive: active.length,
      copertiTotali: active.reduce((sum, item) => sum + item.guests, 0),
      copertiSeduti: inSalaItems.reduce((sum, item) => sum + item.guests, 0),
      inSala: inSalaItems.length,
      arrivatiTurno,
      daArrivare: active.filter((item) => item.status === "confirmed").length,
    }
  }, [dayItems])

  const showingToday = selectedDate === today

  return (
    <div className="space-y-5">
      {/* Header servizio */}
      <header className="admin-panel flex flex-col gap-4 p-4 md:flex-row md:items-end md:justify-between md:p-5">
        <div>
          <p
            className="text-[0.6rem] uppercase tracking-[0.22em]"
            style={{ color: "var(--adm-accent-deep)", fontFamily: "var(--font-quicksand)" }}
          >
            {showingToday ? "Modalità servizio · Live" : "Modalità servizio"}
          </p>
          <h2
            className="mt-1.5 leading-none"
            style={{
              fontFamily: "var(--font-yanone)",
              fontSize: "2.3rem",
              fontWeight: 300,
              color: "var(--adm-text)",
              letterSpacing: "-0.01em",
            }}
          >
            {formatItalianDay(selectedDate)}
            {serviceFilter !== "all" && (
              <span style={{ color: "var(--adm-accent-deep)" }}>
                {" · "}
                {serviceFilter === "pranzo" ? "Pranzo" : "Cena"}
              </span>
            )}
          </h2>
          <p
            className="mt-1 text-[0.85rem] tabular-nums"
            style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
          >
            {formatItalianDate(selectedDate)}
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-3 md:items-end">
          <ServiceFilter value={serviceFilter} onChange={setServiceFilter} />
          <div className="flex flex-wrap items-center justify-end gap-2 text-[0.7rem]">
            {!showingToday && (
              <button
                type="button"
                onClick={() => setSelectedDate(today)}
                className="h-8 rounded-full border px-3 text-[0.66rem] uppercase tracking-[0.16em] transition"
                style={{
                  borderColor: "var(--adm-accent)",
                  background: "rgba(200,168,122,0.16)",
                  color: "var(--adm-accent-deep)",
                  fontFamily: "var(--font-quicksand)",
                  fontWeight: 500,
                }}
              >
                Torna a oggi
              </button>
            )}
            <details className="relative">
              <summary
                className="cursor-pointer list-none rounded-full border px-3 py-1.5 text-[0.66rem] uppercase tracking-[0.16em] transition"
                style={{
                  borderColor: "var(--adm-line)",
                  color: "var(--adm-text)",
                  fontFamily: "var(--font-quicksand)",
                  fontWeight: 500,
                }}
              >
                Cambia giorno
              </summary>
              <div className="absolute right-0 z-10 mt-2 w-[260px]">
                <DayPicker value={selectedDate} today={today} onChange={setSelectedDate} />
              </div>
            </details>
          </div>
        </div>
      </header>

      {/* Stats */}
      <ServiceStatsBar
        prenotazioniAttive={stats.prenotazioniAttive}
        copertiTotali={stats.copertiTotali}
        copertiSeduti={stats.copertiSeduti}
        inSala={stats.inSala}
        daArrivare={stats.daArrivare}
        arrivatiTurno={stats.arrivatiTurno}
      />

      {/* Timeline orizzontale */}
      {isLoaded && stats.prenotazioniAttive > 0 && (
        <ServiceTimeline
          reservations={dayItems}
          showingToday={showingToday}
          tables={tables}
          getTableById={getTableById}
          durationFor={durationFor}
        />
      )}

      {/* Liste */}
      {!isLoaded && (
        <div className="admin-panel p-5">
          <EmptyState title="Caricamento" description="Sto recuperando il servizio…" />
        </div>
      )}

      {isLoaded && stats.prenotazioniAttive === 0 && (
        <div className="admin-panel p-5">
          <EmptyState
            title="Nessuna prenotazione"
            description={
              showingToday
                ? "Per ora la sala è libera. Quando arrivano comparirà qui."
                : "Cambia turno o data per vedere altre prenotazioni."
            }
          />
        </div>
      )}

      {isLoaded && stats.prenotazioniAttive > 0 && (
        <div className="grid gap-5 xl:grid-cols-2">
          {/* In arrivo */}
          <section className="admin-panel p-4 md:p-5">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClockArrowDown className="size-4" style={{ color: "var(--adm-info)" }} />
                <h3
                  className="leading-none"
                  style={{
                    fontFamily: "var(--font-yanone)",
                    fontSize: "1.5rem",
                    fontWeight: 300,
                    color: "var(--adm-text)",
                  }}
                >
                  In arrivo
                </h3>
              </div>
              <span
                className="rounded-full px-2.5 py-0.5 text-[0.7rem] tabular-nums"
                style={{
                  background: "rgba(72,111,122,0.14)",
                  color: "var(--adm-info)",
                  fontFamily: "var(--font-quicksand)",
                  fontWeight: 600,
                }}
              >
                {grouped.inArrivo.length}
              </span>
            </header>
            <div className="mt-3 grid gap-2.5">
              {grouped.inArrivo.length === 0 ? (
                <p
                  className="rounded-[4px] border border-dashed px-3 py-4 text-center text-[0.85rem]"
                  style={{
                    borderColor: "var(--adm-line)",
                    color: "var(--adm-muted)",
                    fontStyle: "italic",
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                  }}
                >
                  Tutti gli ospiti sono arrivati
                </p>
              ) : (
                grouped.inArrivo.map((reservation) => (
                  <CompactReservationRow
                    key={reservation.id}
                    reservation={reservation}
                    variant="service"
                    onUpdateStatus={onUpdateStatus}
                    onPatch={onPatch}
                  />
                ))
              )}
            </div>
          </section>

          {/* In sala */}
          <section className="admin-panel p-4 md:p-5">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserRoundCheck className="size-4" style={{ color: "var(--adm-ok)" }} />
                <h3
                  className="leading-none"
                  style={{
                    fontFamily: "var(--font-yanone)",
                    fontSize: "1.5rem",
                    fontWeight: 300,
                    color: "var(--adm-text)",
                  }}
                >
                  In sala
                </h3>
              </div>
              <span
                className="rounded-full px-2.5 py-0.5 text-[0.7rem] tabular-nums"
                style={{
                  background: "rgba(91,122,74,0.16)",
                  color: "var(--adm-ok)",
                  fontFamily: "var(--font-quicksand)",
                  fontWeight: 600,
                }}
              >
                {grouped.inSala.length}
              </span>
            </header>
            <div className="mt-3 grid gap-2.5">
              {grouped.inSala.length === 0 ? (
                <p
                  className="rounded-[4px] border border-dashed px-3 py-4 text-center text-[0.85rem]"
                  style={{
                    borderColor: "var(--adm-line)",
                    color: "var(--adm-muted)",
                    fontStyle: "italic",
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                  }}
                >
                  Nessun tavolo seduto al momento
                </p>
              ) : (
                grouped.inSala.map((reservation) => (
                  <CompactReservationRow
                    key={reservation.id}
                    reservation={reservation}
                    variant="service"
                    onUpdateStatus={onUpdateStatus}
                    onPatch={onPatch}
                  />
                ))
              )}
            </div>
          </section>

          {/* Chiusi */}
          {grouped.chiuse.length > 0 && (
            <section className="admin-panel p-4 md:p-5 xl:col-span-2">
              <header className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4" style={{ color: "var(--adm-muted)" }} />
                  <h3
                    className="leading-none"
                    style={{
                      fontFamily: "var(--font-yanone)",
                      fontSize: "1.3rem",
                      fontWeight: 300,
                      color: "var(--adm-muted)",
                    }}
                  >
                    Chiusi
                  </h3>
                </div>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[0.7rem] tabular-nums"
                  style={{
                    background: "rgba(38,35,31,0.07)",
                    color: "var(--adm-muted)",
                    fontFamily: "var(--font-quicksand)",
                    fontWeight: 600,
                  }}
                >
                  {grouped.chiuse.length}
                </span>
              </header>
              <div className="mt-3 grid gap-2.5">
                {grouped.chiuse.map((reservation) => (
                  <CompactReservationRow
                    key={reservation.id}
                    reservation={reservation}
                    variant="service"
                    onUpdateStatus={onUpdateStatus}
                    onPatch={onPatch}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
