"use client"

import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  Ban,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  Loader2,
  Plus,
  Search,
  UserRoundCheck,
  Users,
  X,
} from "lucide-react"
import { parseQuickReservation, type QuickReservationFascia } from "@/lib/quick-reservation-parser"

type ReservationStatus = "confirmed" | "pending" | "arrived" | "completed" | "cancelled"
type ServiceFilter = "all" | QuickReservationFascia

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

const storageKey = "calazingaro:admin-reservations:v1"

const statusLabels: Record<ReservationStatus, string> = {
  confirmed: "Confermata",
  pending: "Da confermare",
  arrived: "Arrivato",
  completed: "Completata",
  cancelled: "Cancellata",
}

const statusStyles: Record<ReservationStatus, string> = {
  confirmed: "border-stone-200 bg-white text-stone-700",
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  arrived: "border-emerald-200 bg-emerald-50 text-emerald-800",
  completed: "border-stone-200 bg-stone-100 text-stone-500",
  cancelled: "border-red-200 bg-red-50 text-red-800",
}

const sourceLabels: Record<AdminReservation["source"], string> = {
  telefono: "Telefono",
  whatsapp: "WhatsApp",
  manuale: "Manuale",
}

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
      status: "pending",
      table: null,
      notes: "anniversario",
      source: "whatsapp",
      createdAt: `${today}T10:20:00`,
    },
    {
      id: "seed-franco",
      name: "franco",
      date: today,
      service: "cena",
      time: "21:00",
      guests: 3,
      status: "confirmed",
      table: "7",
      notes: "tavolo 7",
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
  return {
    total: items.length,
    guests: items.reduce((sum, item) => sum + item.guests, 0),
    pending: items.filter((item) => item.status === "pending").length,
    arrived: items.filter((item) => item.status === "arrived").length,
    withoutTable: items.filter((item) => !item.table && item.status !== "cancelled").length,
    withoutTime: items.filter((item) => !item.time && item.status !== "cancelled").length,
  }
}

function needsAttention(reservation: AdminReservation) {
  if (reservation.status === "completed" || reservation.status === "cancelled") return false
  return reservation.status === "pending" || !reservation.table || !reservation.time
}

function getAttentionLabels(reservation: AdminReservation) {
  const labels: string[] = []
  if (reservation.status === "pending") labels.push("Da confermare")
  if (!reservation.table) labels.push("Tavolo da assegnare")
  if (!reservation.time) labels.push("Orario non preciso")
  return labels
}

export default function ReservationsManager() {
  const today = useMemo(() => getRomeDate(), [])
  const [selectedDate, setSelectedDate] = useState(today)
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>("all")
  const [search, setSearch] = useState("")
  const [quickText, setQuickText] = useState("franco domani tavolo 7 3 21")
  const [reservations, setReservations] = useState<AdminReservation[]>([])
  const [editing, setEditing] = useState<EditableReservation | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

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
  const attentionReservations = useMemo(
    () => visibleReservations.filter((reservation) => needsAttention(reservation)),
    [visibleReservations]
  )
  const agendaReservations = useMemo(
    () => visibleReservations.filter((reservation) => !needsAttention(reservation)),
    [visibleReservations]
  )
  const tomorrow = useMemo(() => addDays(today, 1), [today])

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
    const attentionLabels = getAttentionLabels(reservation)
    const hasAttention = attentionLabels.length > 0 && needsAttention(reservation)

    return (
      <article
        key={reservation.id}
        className={`rounded-[8px] border bg-white p-4 transition hover:border-stone-300 ${
          hasAttention ? "border-amber-200 shadow-[inset_4px_0_0_#d97706]" : "border-stone-200"
        }`}
      >
        <div className="grid gap-4 xl:grid-cols-[92px_minmax(0,1fr)_190px] xl:items-start">
          <div className="rounded-[8px] bg-[#fbfaf7] px-3 py-2 text-center">
            <p className="flex items-center justify-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
              <Clock className="size-3.5" />
              {getServiceLabel(reservation.service)}
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums">{reservation.time ?? "--:--"}</p>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold tracking-tight">{reservation.name}</h3>
              <span className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[reservation.status]}`}>
                {statusLabels[reservation.status]}
              </span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
                <Users className="size-3.5" />
                {reservation.guests} coperti
              </span>
              <span className="whitespace-nowrap rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-500">
                {sourceLabels[reservation.source]}
              </span>
            </div>

            {hasAttention && (
              <div className="mt-3 flex flex-wrap gap-2">
                {attentionLabels.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800"
                  >
                    <AlertTriangle className="size-3.5" />
                    {label}
                  </span>
                ))}
              </div>
            )}

            {isEditing ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-[160px_1fr]">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">Tavolo</span>
                  <input
                    aria-label="Tavolo"
                    value={editing.table}
                    onChange={(event) => setEditing({ ...editing, table: event.target.value })}
                    className="mt-1 h-10 w-full rounded-[8px] border border-stone-200 px-3 text-sm outline-none focus:border-stone-500"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">Note</span>
                  <input
                    aria-label="Note"
                    value={editing.notes}
                    onChange={(event) => setEditing({ ...editing, notes: event.target.value })}
                    className="mt-1 h-10 w-full rounded-[8px] border border-stone-200 px-3 text-sm outline-none focus:border-stone-500"
                  />
                </label>
              </div>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-stone-600">
                <span className="rounded-[8px] bg-[#fbfaf7] px-3 py-2">
                  {reservation.table ? `Tavolo ${reservation.table}` : "Tavolo da assegnare"}
                </span>
                <span className="rounded-[8px] bg-[#fbfaf7] px-3 py-2">{reservation.notes ?? "Nessuna nota"}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 xl:flex-col xl:items-stretch">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={saveEditing}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#26231f] px-3 text-sm font-semibold text-white transition active:translate-y-px"
                >
                  <Check className="size-4" />
                  Salva modifiche
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-stone-200 px-3 text-sm font-semibold text-stone-600 transition active:translate-y-px"
                >
                  <X className="size-4" />
                  Annulla
                </button>
              </>
            ) : (
              <>
                {reservation.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(reservation.id, "confirmed")}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-stone-200 bg-white px-3 text-sm font-semibold text-stone-700 transition hover:border-stone-400 active:translate-y-px"
                  >
                    <CheckCircle2 className="size-4" />
                    Conferma
                  </button>
                )}
                {reservation.status !== "arrived" &&
                  reservation.status !== "completed" &&
                  reservation.status !== "cancelled" && (
                    <button
                      type="button"
                      onClick={() => updateStatus(reservation.id, "arrived")}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-emerald-200 bg-emerald-50 px-3 text-sm font-semibold text-emerald-800 transition active:translate-y-px"
                    >
                      <UserRoundCheck className="size-4" />
                      Segna arrivato
                    </button>
                  )}
                {reservation.status === "arrived" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(reservation.id, "completed")}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-stone-200 bg-stone-50 px-3 text-sm font-semibold text-stone-700 transition active:translate-y-px"
                  >
                    <Check className="size-4" />
                    Completa
                  </button>
                )}
                {reservation.status !== "completed" && reservation.status !== "cancelled" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(reservation.id, "cancelled")}
                    aria-label="Annulla prenotazione"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-red-100 bg-red-50 px-3 text-sm font-semibold text-red-800 transition active:translate-y-px"
                  >
                    <Ban className="size-4" />
                    Annulla
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => startEditing(reservation)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-stone-200 px-3 text-sm font-semibold text-stone-600 transition hover:border-stone-400 active:translate-y-px"
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
    <main className="min-h-[100dvh] bg-[#f6f4ef] px-4 py-4 text-stone-950 md:px-6 md:py-6">
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-[8px] border border-stone-200 bg-[#fbfaf7] shadow-[0_24px_80px_-48px_rgba(28,25,23,0.45)]">
        <header className="border-b border-stone-200 bg-[#26231f] px-5 py-5 text-white md:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/45">Cala Zingaro admin</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Gestione prenotazioni</h1>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-5">
              <div className="rounded-[8px] border border-white/10 bg-white/[0.06] px-3 py-2">
                <p className="text-white/45">Prenotazioni</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{stats.total}</p>
              </div>
              <div className="rounded-[8px] border border-white/10 bg-white/[0.06] px-3 py-2">
                <p className="text-white/45">Coperti</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{stats.guests}</p>
              </div>
              <div className="rounded-[8px] border border-white/10 bg-white/[0.06] px-3 py-2">
                <p className="text-white/45">Da confermare</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{stats.pending}</p>
              </div>
              <div className="rounded-[8px] border border-amber-300/20 bg-amber-300/10 px-3 py-2">
                <p className="text-amber-100/65">Da gestire</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{attentionReservations.length}</p>
              </div>
              <div className="rounded-[8px] border border-white/10 bg-white/[0.06] px-3 py-2">
                <p className="text-white/45">Senza tavolo</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{stats.withoutTable}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-[420px_1fr]">
          <aside className="border-b border-stone-200 p-5 md:p-6 lg:border-b-0 lg:border-r">
            <div className="rounded-[8px] border border-stone-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Nuova prenotazione</p>
              <label htmlFor="reservation-message" className="mt-4 block text-sm font-semibold text-stone-800">
                Messaggio prenotazione
              </label>
              <textarea
                id="reservation-message"
                value={quickText}
                onChange={(event) => setQuickText(event.target.value)}
                className="mt-2 min-h-28 w-full resize-none rounded-[8px] border border-stone-200 bg-[#fbfaf7] p-3 text-sm leading-6 outline-none transition focus:border-stone-500 focus:ring-4 focus:ring-stone-950/5"
              />
              {formError && <p className="mt-2 text-sm text-red-700">{formError}</p>}
              <button
                type="button"
                onClick={handleAddReservation}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-[#26231f] px-4 text-sm font-semibold text-white transition hover:bg-[#37322d] active:translate-y-px"
              >
                <Plus className="size-4" />
                Aggiungi in agenda
              </button>
            </div>

            <div className="mt-5 rounded-[8px] border border-stone-200 bg-white p-4">
              <label htmlFor="reservation-date" className="block text-sm font-semibold text-stone-800">
                Giorno agenda
              </label>
              <input
                id="reservation-date"
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="mt-2 h-11 w-full rounded-[8px] border border-stone-200 bg-[#fbfaf7] px-3 text-sm outline-none focus:border-stone-500 focus:ring-4 focus:ring-stone-950/5"
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
                    className={`h-10 rounded-[8px] border px-3 text-sm font-medium transition active:translate-y-px ${
                      selectedDate === dateShortcut.value
                        ? "border-[#26231f] bg-[#26231f] text-white"
                        : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"
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
                    className={`h-10 rounded-[8px] border px-3 text-sm font-medium transition active:translate-y-px ${
                      serviceFilter === filter.value
                        ? "border-[#26231f] bg-[#26231f] text-white"
                        : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-stone-400">
                  {serviceFilter === "all" ? "Agenda completa" : `Prenotazioni ${getServiceLabel(serviceFilter).toLowerCase()}`}
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">{formatItalianDate(selectedDate)}</h2>
              </div>
              <label className="relative block md:w-80">
                <span className="sr-only">Cerca prenotazione</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cerca nome, note, tavolo"
                  className="h-11 w-full rounded-[8px] border border-stone-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-stone-500 focus:ring-4 focus:ring-stone-950/5"
                />
              </label>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
              <div className="rounded-[8px] border border-stone-200 bg-white px-3 py-2">
                <p className="text-xs font-medium text-stone-400">Arrivati</p>
                <p className="mt-1 font-semibold tabular-nums text-stone-800">{stats.arrived}</p>
              </div>
              <div className="rounded-[8px] border border-stone-200 bg-white px-3 py-2">
                <p className="text-xs font-medium text-stone-400">Senza orario</p>
                <p className="mt-1 font-semibold tabular-nums text-stone-800">{stats.withoutTime}</p>
              </div>
              <div className="rounded-[8px] border border-stone-200 bg-white px-3 py-2">
                <p className="text-xs font-medium text-stone-400">Da confermare</p>
                <p className="mt-1 font-semibold tabular-nums text-stone-800">{stats.pending}</p>
              </div>
              <div className="rounded-[8px] border border-stone-200 bg-white px-3 py-2">
                <p className="text-xs font-medium text-stone-400">In agenda</p>
                <p className="mt-1 font-semibold tabular-nums text-stone-800">{agendaReservations.length}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-6">
              {!isLoaded && (
                <div className="flex min-h-64 items-center justify-center rounded-[8px] border border-stone-200 bg-white text-stone-500">
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Caricamento agenda
                </div>
              )}

              {isLoaded && visibleReservations.length === 0 && (
                <div className="flex min-h-64 items-center justify-center rounded-[8px] border border-dashed border-stone-200 bg-white p-8 text-center">
                  <div>
                    <CalendarDays className="mx-auto size-8 text-stone-300" />
                    <p className="mt-3 text-sm font-semibold text-stone-700">Nessuna prenotazione visibile</p>
                    <p className="mt-1 text-sm text-stone-500">Cambia filtro o aggiungi una prenotazione rapida.</p>
                  </div>
                </div>
              )}

              {isLoaded && attentionReservations.length > 0 && (
                <section aria-label="Azioni richieste">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-amber-700">Prima da sistemare</p>
                      <h3 className="mt-1 text-lg font-semibold text-stone-900">Azioni richieste</h3>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                      {attentionReservations.length} aperte
                    </span>
                  </div>
                  <div className="grid gap-3">{attentionReservations.map(renderReservation)}</div>
                </section>
              )}

              {isLoaded && agendaReservations.length > 0 && (
                <section aria-label="Agenda ordinata">
                  <div className="mb-3">
                    <p className="text-[0.68rem] uppercase tracking-[0.24em] text-stone-400">Servizio pronto</p>
                    <h3 className="mt-1 text-lg font-semibold text-stone-900">Agenda ordinata</h3>
                  </div>
                  <div className="grid gap-3">{agendaReservations.map(renderReservation)}</div>
                </section>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
