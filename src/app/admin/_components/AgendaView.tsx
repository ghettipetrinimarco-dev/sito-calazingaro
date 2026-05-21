"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type {
  AdminReservation,
  AdminTable,
  ReservationStatus,
  ServiceFilter as ServiceFilterValue,
} from "../_state/types"
import { addDays, formatItalianDate, formatItalianDay } from "../_state/dateUtils"
import ServiceFilter from "./ServiceFilter"
import SearchInput from "./SearchInput"
import QuickAddForm from "./QuickAddForm"
import GroupedReservationList from "./GroupedReservationList"

interface Props {
  reservations: AdminReservation[]
  today: string
  isLoaded: boolean
  onAdd: (reservation: AdminReservation) => void
  onUpdateStatus: (id: string, status: ReservationStatus) => void
  onPatch: (id: string, partial: Partial<Pick<AdminReservation, "table" | "notes">>) => void
  // Fase 1: durata da policy + lookup tavolo + ensure guest profile
  durationFor: (partySize: number) => number
  getTableByName: (name: string | null) => AdminTable | null
  ensureGuest: (data: { name: string; phone?: string | null; tags?: AdminReservation["tags"] }) => string
}

function sortByTime(items: AdminReservation[]): AdminReservation[] {
  return [...items].sort((a, b) => {
    const aTime = a.time ?? "99:99"
    const bTime = b.time ?? "99:99"
    if (aTime !== bTime) return aTime.localeCompare(bTime)
    return a.createdAt.localeCompare(b.createdAt)
  })
}

export default function AgendaView({
  reservations,
  today,
  isLoaded,
  onAdd,
  onUpdateStatus,
  onPatch,
  durationFor,
  getTableByName,
  ensureGuest,
}: Props) {
  const [selectedDate, setSelectedDate] = useState(today)
  const [serviceFilter, setServiceFilter] = useState<ServiceFilterValue>("all")
  const [search, setSearch] = useState("")

  const visible = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return sortByTime(
      reservations.filter((item) => {
        if (item.date !== selectedDate) return false
        if (serviceFilter !== "all" && item.service !== serviceFilter) return false
        if (!normalizedSearch) return true
        const haystack = [
          item.name,
          item.notes,
          item.table ? `tavolo ${item.table}` : null,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
        return haystack.includes(normalizedSearch)
      })
    )
  }, [reservations, search, selectedDate, serviceFilter])

  const isToday = selectedDate === today

  function handleAdd(reservation: AdminReservation) {
    onAdd(reservation)
    setSelectedDate(reservation.date)
    setServiceFilter(reservation.service)
  }

  return (
    <div className="space-y-6">
      {/* HERO — Quick Add a piena larghezza */}
      <QuickAddForm
        onSubmit={handleAdd}
        durationFor={durationFor}
        getTableByName={getTableByName}
        ensureGuest={ensureGuest}
      />

      {/* TOOLBAR — barra orizzontale unificata: giorno + turno + search */}
      <div className="admin-panel flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:gap-5 lg:p-3 lg:pl-5">
        {/* Selettore giorno inline */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-baseline gap-2">
            <p
              className="leading-none"
              style={{
                fontFamily: "var(--font-yanone)",
                fontSize: "1.85rem",
                fontWeight: 300,
                color: "var(--adm-text)",
                letterSpacing: "-0.01em",
              }}
            >
              {formatItalianDay(selectedDate)}
            </p>
            <span
              className="text-[0.82rem] tabular-nums"
              style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
            >
              {formatItalianDate(selectedDate)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedDate((current) => addDays(current, -1))}
              aria-label="Giorno precedente"
              className="grid size-9 place-items-center rounded-[6px] border bg-white transition hover:bg-[var(--adm-sand)]"
              style={{ borderColor: "var(--adm-line)", color: "var(--adm-text)" }}
            >
              <ChevronLeft className="size-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              aria-label="Seleziona giorno"
              className="admin-input h-9 px-2 text-[0.85rem] tabular-nums"
              style={{ minWidth: 140 }}
            />
            <button
              type="button"
              onClick={() => setSelectedDate((current) => addDays(current, 1))}
              aria-label="Giorno successivo"
              className="grid size-9 place-items-center rounded-[6px] border bg-white transition hover:bg-[var(--adm-sand)]"
              style={{ borderColor: "var(--adm-line)", color: "var(--adm-text)" }}
            >
              <ChevronRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate(today)}
              disabled={isToday}
              className="h-9 rounded-full border px-3 text-[0.66rem] uppercase tracking-[0.16em] transition disabled:opacity-45"
              style={{
                borderColor: isToday ? "var(--adm-accent)" : "var(--adm-line)",
                color: isToday ? "var(--adm-accent-deep)" : "var(--adm-text)",
                background: isToday ? "rgba(200,168,122,0.16)" : "white",
                fontFamily: "var(--font-quicksand)",
                fontWeight: 500,
              }}
            >
              Oggi
            </button>
          </div>
        </div>

        {/* Separatore verticale + turno */}
        <span
          className="hidden lg:block h-9 w-px"
          style={{ background: "var(--adm-line)" }}
          aria-hidden="true"
        />

        <div className="flex items-center gap-2">
          <span
            className="hidden md:inline text-[0.6rem] uppercase tracking-[0.22em]"
            style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
          >
            Turno
          </span>
          <div className="flex items-center rounded-full p-1" style={{ background: "rgba(20,17,13,0.05)" }}>
            {(
              [
                { value: "all" as const, label: "Tutto" },
                { value: "pranzo" as const, label: "Pranzo" },
                { value: "cena" as const, label: "Cena" },
              ] satisfies { value: ServiceFilterValue; label: string }[]
            ).map((option) => {
              const active = serviceFilter === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setServiceFilter(option.value)}
                  className="h-7 rounded-full px-3 text-[0.72rem] transition"
                  style={{
                    background: active ? "var(--adm-text)" : "transparent",
                    color: active ? "var(--adm-sand)" : "var(--adm-text)",
                    fontFamily: "var(--font-quicksand)",
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Search pushed right */}
        <div className="lg:ml-auto">
          <SearchInput value={search} onChange={setSearch} />
        </div>
      </div>

      {/* LISTA — full width, label discreta sopra */}
      <section>
        <div className="mb-3 flex items-baseline gap-2 px-1">
          <p
            className="text-[0.62rem] uppercase tracking-[0.22em]"
            style={{ color: "var(--adm-accent-deep)", fontFamily: "var(--font-quicksand)" }}
          >
            {serviceFilter === "all"
              ? "Tutte le prenotazioni"
              : serviceFilter === "pranzo"
              ? "Pranzo"
              : "Cena"}
          </p>
          <span
            className="text-[0.78rem]"
            style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
          >
            {visible.length} {visible.length === 1 ? "prenotazione" : "prenotazioni"}
          </span>
        </div>

        <GroupedReservationList
          reservations={visible}
          variant="agenda"
          isLoaded={isLoaded}
          emptyTitle="Nessuna prenotazione"
          emptyDescription={
            search
              ? "Nessun risultato per la ricerca."
              : "Inserisci la prima nel form qui sopra, o cambia giorno."
          }
          onUpdateStatus={onUpdateStatus}
          onPatch={onPatch}
        />
      </section>
    </div>
  )
}
