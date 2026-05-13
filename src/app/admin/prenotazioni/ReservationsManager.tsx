"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import {
  CalendarDays,
  Check,
  Clock,
  Edit3,
  Loader2,
  Plus,
  Search,
  Trash2,
  UserRoundCheck,
  Users,
  X,
} from "lucide-react"
import { parseQuickReservation, type QuickReservationFascia } from "@/lib/quick-reservation-parser"

type ReservationStatus = "confirmed" | "arrived" | "completed" | "cancelled"
type ServiceFilter = "all" | QuickReservationFascia
type AdminView = "agenda" | "service"

interface AdminReservation {
  id: string
  name: string
  date: string
  service: QuickReservationFascia
  time: string | null
  guests: number
  status: ReservationStatus
  table: string | null
  notes: string | null
  source: "telefono" | "whatsapp" | "manuale"
  createdAt: string
}

interface EditableReservation {
  id: string
  table: string
  notes: string
}

const storageKey = "calazingaro:operator-agenda:v1"

const statusLabels: Record<ReservationStatus, string> = {
  confirmed: "Prenotata",
  arrived: "Arrivato",
  completed: "Chiuso",
  cancelled: "Annullata",
}

const statusStyles: Record<ReservationStatus, string> = {
  confirmed: "bg-[var(--adm-ok-bg)] text-[var(--adm-ok)]",
  arrived: "bg-[var(--adm-info-bg)] text-[var(--adm-info)]",
  completed: "bg-[var(--adm-neutral-bg)] text-[var(--adm-neutral)]",
  cancelled: "bg-[var(--adm-busy-bg)] text-[var(--adm-busy)]",
}

const sourceLabels: Record<AdminReservation["source"], string> = {
  telefono: "Telefono",
  whatsapp: "WhatsApp",
  manuale: "Manuale",
}

const adminViews: { value: AdminView; label: string }[] = [
  { value: "agenda", label: "Agenda digitale" },
  { value: "service", label: "Modalita servizio" },
]

function getRomeDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
}

function formatItalianDate(value: string) {
  const [year, month, day] = value.split("-")
  if (!year || !month || !day) return value
  return `${day}/${month}/${year}`
}

function addDays(value: string, days: number) {
  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day + days))
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

function getServiceLabel(value: QuickReservationFascia) {
  return value === "pranzo" ? "Pranzo" : "Cena"
}

function getSeedReservations(today: string): AdminReservation[] {
  return [
    {
      id: "seed-rossi",
      name: "Rossi",
      date: today,
      service: "pranzo",
      time: "13:00",
      guests: 4,
      status: "confirmed",
      table: "3",
      notes: "fuori se possibile",
      source: "telefono",
      createdAt: `${today}T09:15:00`,
    },
    {
      id: "seed-bianchi",
      name: "Bianchi",
      date: today,
      service: "cena",
      time: "20:30",
      guests: 2,
      status: "confirmed",
      table: null,
      notes: "anniversario",
      source: "whatsapp",
      createdAt: `${today}T10:20:00`,
    },
    {
      id: "seed-franco",
      name: "Franco",
      date: today,
      service: "cena",
      time: "21:00",
      guests: 3,
      status: "confirmed",
      table: "7",
      notes: null,
      source: "telefono",
      createdAt: `${today}T11:05:00`,
    },
  ]
}

function sortReservations(items: AdminReservation[]) {
  return [...items].sort((a, b) => {
    const timeA = a.time ?? "99:99"
    const timeB = b.time ?? "99:99"
    if (timeA !== timeB) return timeA.localeCompare(timeB)
    return a.createdAt.localeCompare(b.createdAt)
  })
}

function getStats(items: AdminReservation[]) {
  const activeItems = items.filter((item) => item.status !== "cancelled")
  return {
    total: activeItems.length,
    guests: activeItems.reduce((sum, item) => sum + item.guests, 0),
    arrived: activeItems.filter((item) => item.status === "arrived").length,
  }
}

export default function ReservationsManager() {
  const today = useMemo(() => getRomeDate(), [])
  const tomorrow = useMemo(() => addDays(today, 1), [today])
  const [selectedDate, setSelectedDate] = useState(today)
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>("all")
  const [search, setSearch] = useState("")
  const [quickText, setQuickText] = useState("Franco domani tavolo 7 3 21")
  const [reservations, setReservations] = useState<AdminReservation[]>([])
  const [editing, setEditing] = useState<EditableReservation | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeView, setActiveView] = useState<AdminView>("agenda")

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        setReservations(JSON.parse(stored) as AdminReservation[])
      } else {
        setReservations(getSeedReservations(today))
      }
      setIsLoaded(true)
    })

    return () => cancelAnimationFrame(frame)
  }, [today])

  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem(storageKey, JSON.stringify(reservations))
  }, [isLoaded, reservations])

  function handleLogin() {
    setIsAuthenticated(true)
  }

  function handleLogout() {
    setIsAuthenticated(false)
  }

  const visibleReservations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return sortReservations(
      reservations.filter((reservation) => {
        if (reservation.date !== selectedDate) return false
        if (serviceFilter !== "all" && reservation.service !== serviceFilter) return false
        if (!normalizedSearch) return true

        return [
          reservation.name,
          reservation.notes,
          reservation.table ? `tavolo ${reservation.table}` : null,
        ]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalizedSearch))
      })
    )
  }, [reservations, search, selectedDate, serviceFilter])

  const stats = useMemo(() => getStats(visibleReservations), [visibleReservations])

  function handleAddReservation() {
    const draft = parseQuickReservation(quickText)

    if (!draft.nome || !draft.data || !draft.fascia || !draft.coperti) {
      setFormError(`Mancano: ${draft.missingFields.join(", ")}`)
      return
    }

    const tableMatch = draft.note?.match(/\btavolo\s+(\d{1,3})\b/i)
    const table = tableMatch?.[1] ?? null
    const cleanNotes =
      draft.note
        ?.replace(/\btavolo\s+\d{1,3}\b/gi, "")
        .replace(/\s{2,}/g, " ")
        .trim() || null

    const reservation: AdminReservation = {
      id: crypto.randomUUID(),
      name: draft.nome,
      date: draft.data,
      service: draft.fascia,
      time: draft.orario,
      guests: draft.coperti,
      status: "confirmed",
      table,
      notes: cleanNotes,
      source: "manuale",
      createdAt: new Date().toISOString(),
    }

    setReservations((current) => [reservation, ...current])
    setSelectedDate(draft.data)
    setServiceFilter(draft.fascia)
    setQuickText("")
    setFormError(null)
  }

  function updateStatus(id: string, status: ReservationStatus) {
    setReservations((current) => current.map((item) => (item.id === id ? { ...item, status } : item)))
  }

  function startEditing(reservation: AdminReservation) {
    setEditing({
      id: reservation.id,
      table: reservation.table ?? "",
      notes: reservation.notes ?? "",
    })
  }

  function saveEditing() {
    if (!editing) return

    setReservations((current) =>
      current.map((item) =>
        item.id === editing.id
          ? {
              ...item,
              table: editing.table.trim() || null,
              notes: editing.notes.trim() || null,
            }
          : item
      )
    )
    setEditing(null)
  }

  function renderReservation(reservation: AdminReservation) {
    const isEditing = editing?.id === reservation.id
    const isCancelled = reservation.status === "cancelled"

    return (
      <article
        key={reservation.id}
        className={`admin-panel p-3 transition hover:bg-white md:p-4 ${
          isCancelled ? "opacity-55" : ""
        }`}
      >
        <div className="grid gap-4 xl:grid-cols-[92px_minmax(0,1fr)_150px] xl:items-start">
          <div className="rounded-[4px] border border-[var(--adm-line)] bg-white px-3 py-2 text-center">
            <p className="admin-label flex items-center justify-center gap-1 text-[var(--adm-muted)]">
              <Clock className="size-3.5" />
              {getServiceLabel(reservation.service)}
            </p>
            <p className="admin-mono mt-2 text-lg text-[var(--adm-text)] tabular-nums">{reservation.time ?? "--:--"}</p>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="admin-display text-[1.45rem] text-[var(--adm-text)]">{reservation.name}</h3>
              <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.16em] ${statusStyles[reservation.status]}`}>
                <span className="size-1.5 rounded-full bg-current" />
                {statusLabels[reservation.status]}
              </span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[rgba(20,17,13,0.06)] px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-[var(--adm-muted)]">
                <Users className="size-3.5" />
                {reservation.guests} coperti
              </span>
              <span className="admin-mono whitespace-nowrap rounded-full bg-[rgba(20,17,13,0.04)] px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.16em] text-[var(--adm-accent-deep)]">
                {sourceLabels[reservation.source]}
              </span>
            </div>

            {isEditing ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-[160px_1fr]">
                <label className="block">
                  <span className="admin-label text-[var(--adm-text)]">Tavolo</span>
                  <input
                    aria-label="Tavolo"
                    value={editing.table}
                    onChange={(event) => setEditing({ ...editing, table: event.target.value })}
                    className="admin-input mt-1 h-10 w-full px-3 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="admin-label text-[var(--adm-text)]">Note</span>
                  <input
                    aria-label="Note"
                    value={editing.notes}
                    onChange={(event) => setEditing({ ...editing, notes: event.target.value })}
                    className="admin-input mt-1 h-10 w-full px-3 text-sm"
                  />
                </label>
              </div>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-[var(--adm-muted)]">
                <span className="rounded-[4px] bg-[rgba(20,17,13,0.04)] px-3 py-2">
                  {reservation.table ? `Tavolo ${reservation.table}` : "Tavolo da assegnare"}
                </span>
                <span className="admin-serif rounded-[4px] bg-[rgba(20,17,13,0.04)] px-3 py-2 text-[1rem] italic">
                  {reservation.notes ?? "Nessuna nota"}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 xl:flex-col xl:items-stretch">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={saveEditing}
                  className="admin-button admin-button-dark inline-flex h-10 items-center justify-center gap-2 px-3"
                >
                  <Check className="size-4" />
                  Salva
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="admin-button admin-button-ghost inline-flex h-10 items-center justify-center gap-2 px-3"
                >
                  <X className="size-4" />
                  Chiudi
                </button>
              </>
            ) : (
              <>
                {reservation.status === "confirmed" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(reservation.id, "arrived")}
                    className="admin-button inline-flex h-10 items-center justify-center gap-2 rounded-[4px] bg-[var(--adm-ok-bg)] px-3 text-[var(--adm-ok)]"
                  >
                    <UserRoundCheck className="size-4" />
                    Arrivato
                  </button>
                )}
                {reservation.status === "arrived" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(reservation.id, "completed")}
                    className="admin-button admin-button-ghost inline-flex h-10 items-center justify-center gap-2 px-3"
                  >
                    <Check className="size-4" />
                    Chiudi
                  </button>
                )}
                {reservation.status !== "completed" && reservation.status !== "cancelled" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(reservation.id, "cancelled")}
                    aria-label="Annulla prenotazione"
                    className="admin-button inline-flex h-10 items-center justify-center gap-2 rounded-[4px] bg-[var(--adm-busy-bg)] px-3 text-[var(--adm-busy)]"
                  >
                    <Trash2 className="size-4" />
                    Annulla
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => startEditing(reservation)}
                  className="admin-button admin-button-ghost inline-flex h-10 items-center justify-center gap-2 px-3"
                >
                  <Edit3 className="size-4" />
                  Modifica
                </button>
              </>
            )}
          </div>
        </div>
      </article>
    )
  }

  return (
    <main className="admin-shell px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-[1232px]">
        <header className="mb-7 flex flex-col gap-4 text-[var(--adm-sand)] md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="admin-display text-[2.6rem] md:text-[3.1rem]">Cala Zingaro · Admin</h1>
          </div>
          <p className="admin-mono text-[0.68rem] tracking-[0.16em] text-[rgba(200,168,122,0.86)]">
            {isAuthenticated ? `/admin/${activeView === "agenda" ? "agenda" : "servizio"}` : "/admin · Login"}
          </p>
        </header>

        <div className="admin-browser">
          <div className="admin-browser-bar">
            calazingaro.it/admin{isAuthenticated ? `/${activeView === "agenda" ? "agenda" : "servizio"}` : ""}
          </div>

          {!isAuthenticated ? (
            <section className="grid min-h-[calc(100dvh-265px)] place-items-center bg-[var(--adm-ink)] px-5 py-10 md:py-12">
              <div className="w-full max-w-[380px] text-center">
                <div className="mx-auto mb-8 flex h-[96px] items-center justify-center">
                  <div className="relative h-[79px] w-[230px]">
                    <Image
                      src="/images/logo.svg"
                      alt="Cala Zingaro"
                      fill
                      priority
                      sizes="230px"
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                </div>
                <p className="admin-mono text-[0.64rem] uppercase tracking-[0.28em] text-[var(--adm-accent)]">
                  Pannello gestione
                </p>

                <div className="mt-10 grid gap-3">
                  <input
                    type="password"
                    aria-label="Password"
                    autoComplete="current-password"
                    placeholder="Password"
                    className="h-[52px] rounded-[4px] border border-white/10 bg-white/[0.08] px-4 text-[0.95rem] text-[var(--adm-sand)] outline-none transition placeholder:text-white/35 focus:border-[var(--adm-accent)] focus:ring-4 focus:ring-[rgba(200,168,122,0.16)]"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleLogin()
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="admin-button h-11 bg-[var(--adm-accent)] text-[var(--adm-ink)] hover:bg-[#d6bb91]"
                  >
                    Accedi
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <section className="bg-[var(--adm-sand)]">
              <header className="flex flex-col gap-4 border-b border-[var(--adm-line)] bg-[var(--adm-sand-2)] px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                <div>
                  <p className="admin-display text-[1.5rem] text-[var(--adm-text)]">Cala Zingaro</p>
                  <p className="admin-label mt-1 text-[var(--adm-muted)]">Sala · Maître</p>
                </div>

                <nav className="flex flex-wrap gap-2">
                  {adminViews.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setActiveView(item.value)}
                      className={`admin-button h-8 px-4 ${
                        activeView === item.value ? "admin-button-dark" : "admin-button-ghost"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                <div className="flex items-center gap-3">
                  <p className="admin-label text-[var(--adm-muted)]">Sala ·</p>
                  <span className="grid size-8 place-items-center rounded-full bg-[var(--adm-text)] text-[0.72rem] font-semibold text-[var(--adm-sand)]">
                    F
                  </span>
                  <span className="text-sm text-[var(--adm-text)]">Federica</span>
                  <button type="button" onClick={handleLogout} className="admin-button admin-button-ghost h-8 px-3">
                    Esci
                  </button>
                </div>
              </header>

              <div className="px-5 py-6 md:px-7 md:py-7">
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="admin-display text-[2.45rem] text-[var(--adm-text)]">
                      {activeView === "agenda" ? "Agenda digitale" : "Modalita servizio"}
                    </h2>
                  </div>
                  <p className="admin-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--adm-accent-deep)]">
                    {activeView === "agenda" ? "Agenda" : "Live"}
                  </p>
                </div>

                {activeView === "service" && (
                  <div className="mb-5 grid gap-3 md:grid-cols-3">
                    {[
                      { label: "Prenotazioni", value: stats.total },
                      { label: "Coperti", value: stats.guests },
                      { label: "Arrivati", value: stats.arrived },
                    ].map((stat) => (
                      <div key={stat.label} className="admin-panel px-4 py-3">
                        <p className="admin-label flex items-center gap-2 text-[var(--adm-muted)]">
                          <Users className="size-3.5" />
                          {stat.label}
                        </p>
                        <p className="admin-display mt-2 text-[2.1rem] text-[var(--adm-text)]">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {activeView === "agenda" ? (
                <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
                  <aside className="space-y-4">
                    <div className="admin-panel p-4">
                      <p className="admin-label text-[var(--adm-accent-deep)]">Scrivi come in chat</p>
                      <label htmlFor="reservation-message" className="admin-label mt-4 block text-[var(--adm-text)]">
                        Nuova prenotazione
                      </label>
                      <textarea
                        id="reservation-message"
                        value={quickText}
                        onChange={(event) => setQuickText(event.target.value)}
                        className="admin-input mt-2 min-h-28 w-full resize-none p-3 text-sm leading-6"
                      />
                      {formError && <p className="mt-2 text-sm text-[var(--adm-busy)]">{formError}</p>}
                      <button
                        type="button"
                        onClick={handleAddReservation}
                        className="admin-button admin-button-dark mt-4 inline-flex h-11 w-full items-center justify-center gap-2 px-4"
                      >
                        <Plus className="size-4" />
                        Inserisci
                      </button>
                    </div>

                    <div className="admin-panel p-4">
                      <label htmlFor="reservation-date" className="admin-label block text-[var(--adm-text)]">
                        Giorno
                      </label>
                      <input
                        id="reservation-date"
                        type="date"
                        value={selectedDate}
                        onChange={(event) => setSelectedDate(event.target.value)}
                        className="admin-input mt-2 h-11 w-full px-3 text-sm"
                      />

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {[
                          { value: today, label: "Oggi" },
                          { value: tomorrow, label: "Domani" },
                        ].map((dateShortcut) => (
                          <button
                            key={dateShortcut.value}
                            type="button"
                            onClick={() => setSelectedDate(dateShortcut.value)}
                            className={`admin-button h-10 px-3 ${
                              selectedDate === dateShortcut.value ? "admin-button-dark" : "admin-button-ghost"
                            }`}
                          >
                            {dateShortcut.label}
                          </button>
                        ))}
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {[
                          { value: "all", label: "Tutto" },
                          { value: "pranzo", label: "Pranzo" },
                          { value: "cena", label: "Cena" },
                        ].map((filter) => (
                          <button
                            key={filter.value}
                            type="button"
                            onClick={() => setServiceFilter(filter.value as ServiceFilter)}
                            className={`admin-button h-10 px-3 ${
                              serviceFilter === filter.value ? "admin-button-dark" : "admin-button-ghost"
                            }`}
                          >
                            {filter.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </aside>

                  <section className="admin-panel p-4 md:p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="admin-label text-[var(--adm-accent-deep)]">
                          {serviceFilter === "all" ? "Agenda completa" : getServiceLabel(serviceFilter)}
                        </p>
                        <h3 className="admin-display mt-2 text-[2rem] text-[var(--adm-text)]">
                          {formatItalianDate(selectedDate)}
                        </h3>
                      </div>
                      <label className="relative block md:w-80">
                        <span className="sr-only">Cerca prenotazione</span>
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--adm-muted)]" />
                        <input
                          value={search}
                          onChange={(event) => setSearch(event.target.value)}
                          placeholder="Cerca nome, note, tavolo"
                          className="admin-input h-11 w-full pl-10 pr-3 text-sm"
                        />
                      </label>
                    </div>

                    <div className="mt-5 grid gap-3">
                      {!isLoaded && (
                        <div className="admin-panel flex min-h-64 items-center justify-center text-[var(--adm-muted)]">
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Caricamento agenda
                        </div>
                      )}

                      {isLoaded && visibleReservations.length === 0 && (
                        <div className="flex min-h-64 items-center justify-center rounded-[6px] border border-dashed border-[var(--adm-line-strong)] bg-[var(--adm-sand-2)] p-8 text-center">
                          <div>
                            <CalendarDays className="mx-auto size-8 text-[var(--adm-accent)]" />
                            <p className="admin-display mt-3 text-[1.5rem] text-[var(--adm-text)]">Agenda vuota</p>
                            <p className="admin-serif mt-1 text-[1rem] italic text-[var(--adm-muted)]">
                              Inserisci una prenotazione o cambia giorno.
                            </p>
                          </div>
                        </div>
                      )}

                      {isLoaded && visibleReservations.map(renderReservation)}
                    </div>
                  </section>
                </div>
                ) : (
                  <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
                    <aside className="space-y-4">
                      <div className="admin-panel p-4">
                        <p className="admin-label text-[var(--adm-accent-deep)]">Turno</p>
                        <div className="mt-4 grid grid-cols-3 gap-2 lg:grid-cols-1">
                          {[
                            { value: "all", label: "Tutto" },
                            { value: "pranzo", label: "Pranzo" },
                            { value: "cena", label: "Cena" },
                          ].map((filter) => (
                            <button
                              key={filter.value}
                              type="button"
                              onClick={() => setServiceFilter(filter.value as ServiceFilter)}
                              className={`admin-button h-10 px-3 ${
                                serviceFilter === filter.value ? "admin-button-dark" : "admin-button-ghost"
                              }`}
                            >
                              {filter.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="admin-panel p-4">
                        <p className="admin-label text-[var(--adm-text)]">Giorno servizio</p>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(event) => setSelectedDate(event.target.value)}
                          className="admin-input mt-2 h-11 w-full px-3 text-sm"
                        />
                      </div>
                    </aside>

                    <section className="admin-panel p-4 md:p-5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="admin-label text-[var(--adm-accent-deep)]">
                            {serviceFilter === "all" ? "Turno completo" : getServiceLabel(serviceFilter)}
                          </p>
                          <h3 className="admin-display mt-2 text-[2rem] text-[var(--adm-text)]">
                            {formatItalianDate(selectedDate)}
                          </h3>
                        </div>
                        <label className="relative block md:w-80">
                          <span className="sr-only">Cerca prenotazione</span>
                          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--adm-muted)]" />
                          <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Cerca nome, note, tavolo"
                            className="admin-input h-11 w-full pl-10 pr-3 text-sm"
                          />
                        </label>
                      </div>

                      <div className="mt-5 grid gap-3">
                        {!isLoaded && (
                          <div className="admin-panel flex min-h-64 items-center justify-center text-[var(--adm-muted)]">
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Caricamento servizio
                          </div>
                        )}

                        {isLoaded && visibleReservations.length === 0 && (
                          <div className="flex min-h-64 items-center justify-center rounded-[6px] border border-dashed border-[var(--adm-line-strong)] bg-[var(--adm-sand-2)] p-8 text-center">
                            <div>
                              <CalendarDays className="mx-auto size-8 text-[var(--adm-accent)]" />
                              <p className="admin-display mt-3 text-[1.5rem] text-[var(--adm-text)]">Nessun tavolo in servizio</p>
                              <p className="admin-serif mt-1 text-[1rem] italic text-[var(--adm-muted)]">
                                Cambia giorno o turno per vedere le prenotazioni.
                              </p>
                            </div>
                          </div>
                        )}

                        {isLoaded && visibleReservations.map(renderReservation)}
                      </div>
                    </section>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
