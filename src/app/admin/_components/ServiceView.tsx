"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  Check,
  ChevronDown,
  Edit3,
  Replace,
  RotateCcw,
  Square,
  Trash2,
  Undo2,
} from "lucide-react"
import type {
  AdminReservation,
  AdminTable,
  ReservationStatus,
  ReservationTag,
  ServiceFilter as ServiceFilterValue,
} from "../_state/types"
import {
  formatItalianDate,
  formatItalianDay,
  inferCurrentService,
} from "../_state/dateUtils"
import DayPicker from "./DayPicker"

// Tag che richiedono attenzione in cucina (allergeni veri, NON preferenze)
const URGENT_TAGS: ReservationTag[] = ["allergia", "celiaco"]

const TAG_LABEL: Record<ReservationTag, string> = {
  anniversario: "Anniversario",
  compleanno: "Compleanno",
  allergia: "Allergia",
  celiaco: "Celiaco",
  vegano: "Vegano",
  vegetariano: "Vegetariano",
  bambini: "Bambini",
  passeggino: "Passeggino",
  seggiolone: "Seggiolone",
  esterno: "Esterno",
  "vista-mare": "Vista mare",
  terrazza: "Terrazza",
  veranda: "Veranda",
  interno: "Interno",
}

interface Props {
  reservations: AdminReservation[]
  today: string
  isLoaded: boolean
  onUpdateStatus: (id: string, status: ReservationStatus) => void
  onPatch: (id: string, partial: Partial<Pick<AdminReservation, "table" | "notes">>) => void
  tables: AdminTable[]
  getTableById: (id: string | null) => AdminTable | null
  durationFor: (partySize: number) => number
  maxCoversFor: (date: string, service: "pranzo" | "cena") => number | null
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
  maxCoversFor,
}: Props) {
  const [selectedDate, setSelectedDate] = useState(today)
  const [serviceFilter, setServiceFilter] = useState<ServiceFilterValue>("all")
  // Undo banner: l'ultima azione fatta entro 5s può essere annullata
  const [lastAction, setLastAction] = useState<{
    id: string
    fromStatus: ReservationStatus
    toStatus: ReservationStatus
    name: string
    at: number
  } | null>(null)
  const [fattiOpen, setFattiOpen] = useState(false)
  // Menu azioni secondarie (annulla / cambia tavolo / modifica note) — aperto via long-press o right-click
  const [menuFor, setMenuFor] = useState<{ id: string; x: number; y: number } | null>(null)

  useEffect(() => {
    setServiceFilter(inferCurrentService())
  }, [])

  // Pulisce la banner undo dopo 5s
  useEffect(() => {
    if (!lastAction) return
    const id = setTimeout(() => setLastAction(null), 5000)
    return () => clearTimeout(id)
  }, [lastAction])

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
      mancano: sortByTime(active.filter((item) => item.status === "confirmed")),
      inSala: sortByTime(active.filter((item) => item.status === "arrived")),
      fatti: sortByTime(active.filter((item) => item.status === "completed")),
    }
  }, [dayItems])

  const stats = useMemo(() => {
    const active = dayItems.filter((item) => item.status !== "cancelled")
    return {
      totale: active.length,
      coperti: active.reduce((sum, item) => sum + item.guests, 0),
      coperti_seduti: grouped.inSala.reduce((sum, item) => sum + item.guests, 0),
      mancano: grouped.mancano.length,
      inSala: grouped.inSala.length,
      fatti: grouped.fatti.length,
    }
  }, [dayItems, grouped])

  const showingToday = selectedDate === today
  const maxCovers =
    serviceFilter !== "all" ? maxCoversFor(selectedDate, serviceFilter) ?? undefined : undefined

  // Avanzamento ciclico stato — tap sulla checkbox
  function advance(reservation: AdminReservation) {
    const from = reservation.status
    let to: ReservationStatus | null = null
    if (from === "confirmed") to = "arrived"
    else if (from === "arrived") to = "completed"
    if (!to) return
    setLastAction({
      id: reservation.id,
      fromStatus: from,
      toStatus: to,
      name: reservation.name,
      at: Date.now(),
    })
    onUpdateStatus(reservation.id, to)
  }

  function undoLast() {
    if (!lastAction) return
    onUpdateStatus(lastAction.id, lastAction.fromStatus)
    setLastAction(null)
  }

  // ─── Menu azioni secondarie ──────────────────────────────────────
  // Reservation puntata dal menu (lookup ogni render — semplice e safe)
  const menuReservation = menuFor
    ? dayItems.find((r) => r.id === menuFor.id) ?? null
    : null

  function openMenu(reservationId: string, x: number, y: number) {
    // Posiziono il menu vicino al punto cliccato ma evito che esca dal viewport
    const maxX = typeof window !== "undefined" ? window.innerWidth - 240 : x
    const maxY = typeof window !== "undefined" ? window.innerHeight - 220 : y
    setMenuFor({
      id: reservationId,
      x: Math.min(x, maxX),
      y: Math.min(y, maxY),
    })
  }
  function closeMenu() {
    setMenuFor(null)
  }

  function actionCancel() {
    if (!menuReservation) return
    setLastAction({
      id: menuReservation.id,
      fromStatus: menuReservation.status,
      toStatus: "cancelled",
      name: menuReservation.name,
      at: Date.now(),
    })
    onUpdateStatus(menuReservation.id, "cancelled")
    closeMenu()
  }

  function actionChangeTable() {
    if (!menuReservation) return
    const next = window.prompt(
      `Tavolo per ${menuReservation.name} (es. T3, lascia vuoto per togliere)`,
      menuReservation.table ?? ""
    )
    if (next == null) return
    onPatch(menuReservation.id, { table: next.trim() || null })
    closeMenu()
  }

  function actionEditNotes() {
    if (!menuReservation) return
    const next = window.prompt(`Note per ${menuReservation.name}`, menuReservation.notes ?? "")
    if (next == null) return
    onPatch(menuReservation.id, { notes: next.trim() || null })
    closeMenu()
  }

  // ESC chiude il menu
  useEffect(() => {
    if (!menuFor) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [menuFor])

  return (
    <div className="space-y-4">
      {/* HEADER compatto */}
      <header className="admin-panel flex flex-wrap items-center gap-3 px-4 py-2.5">
        <div className="flex items-baseline gap-2.5">
          <h2
            className="leading-none"
            style={{
              fontFamily: "var(--font-yanone)",
              fontSize: "1.65rem",
              fontWeight: 300,
              color: "var(--adm-text)",
              letterSpacing: "-0.005em",
            }}
          >
            {formatItalianDay(selectedDate)}
            {serviceFilter !== "all" && (
              <span style={{ color: "var(--adm-accent-deep)" }}>
                {` · ${serviceFilter === "pranzo" ? "Pranzo" : "Cena"}`}
              </span>
            )}
          </h2>
          <span
            className="tabular-nums"
            style={{
              fontSize: "0.8rem",
              color: "var(--adm-muted)",
              fontFamily: "var(--font-quicksand)",
            }}
          >
            {formatItalianDate(selectedDate)}
          </span>
          {showingToday && (
            <span
              className="inline-flex items-center gap-1.5"
              style={{
                fontSize: "0.66rem",
                letterSpacing: "0.18em",
                color: "var(--adm-ok)",
                fontFamily: "var(--font-quicksand)",
                fontWeight: 700,
              }}
            >
              <span
                className="animate-pulse"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--adm-ok)",
                  display: "inline-block",
                }}
              />
              LIVE
            </span>
          )}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div
            className="flex items-center rounded-full p-1"
            style={{ background: "rgba(20,17,13,0.05)" }}
          >
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
                  className="h-8 rounded-full px-3 text-[0.74rem] transition"
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

          {!showingToday && (
            <button
              type="button"
              onClick={() => setSelectedDate(today)}
              className="h-8 rounded-full border px-3 text-[0.7rem] uppercase tracking-[0.12em] transition"
              style={{
                borderColor: "var(--adm-accent)",
                background: "rgba(200,168,122,0.16)",
                color: "var(--adm-accent-deep)",
                fontFamily: "var(--font-quicksand)",
                fontWeight: 500,
              }}
            >
              Oggi
            </button>
          )}

          <details className="relative">
            <summary
              className="cursor-pointer list-none inline-flex h-8 items-center rounded-full border px-3 text-[0.7rem] uppercase tracking-[0.12em] transition"
              style={{
                borderColor: "var(--adm-line)",
                color: "var(--adm-text)",
                fontFamily: "var(--font-quicksand)",
                fontWeight: 500,
              }}
            >
              Giorno
            </summary>
            <div className="absolute right-0 z-10 mt-2 w-[260px]">
              <DayPicker value={selectedDate} today={today} onChange={setSelectedDate} />
            </div>
          </details>
        </div>
      </header>

      {/* STATS BAR essenziale: solo le 3 cose che gli interessano davvero */}
      <div className="admin-panel flex flex-wrap items-center gap-x-7 gap-y-2 px-4 py-3">
        <KpiInline
          label="Mancano"
          value={stats.mancano}
          hint={
            stats.totale > 0
              ? `su ${stats.totale} prenotaz.`
              : null
          }
          tone="info"
        />
        <KpiInline
          label="In sala"
          value={stats.inSala}
          hint={
            stats.inSala > 0
              ? `${stats.coperti_seduti} seduti`
              : null
          }
          tone="ok"
        />
        <KpiInline label="Fatti" value={stats.fatti} />
        <KpiInline
          label="Coperti"
          value={stats.coperti}
          hint={maxCovers ? `su ${maxCovers}` : null}
        />
      </div>

      {/* CARICAMENTO / VUOTO */}
      {!isLoaded && (
        <div
          className="admin-panel p-4 text-center"
          style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
        >
          Caricamento servizio…
        </div>
      )}

      {isLoaded && stats.totale === 0 && (
        <div
          className="admin-panel p-8 text-center"
          style={{
            color: "var(--adm-muted)",
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontStyle: "italic",
            fontSize: "1.1rem",
          }}
        >
          {showingToday
            ? "Per ora la sala è libera. Le prenotazioni compariranno qui."
            : "Cambia turno o data per vedere altre prenotazioni."}
        </div>
      )}

      {/* SPUNTALISTA */}
      {isLoaded && stats.totale > 0 && (
        <div className="space-y-4">
          {/* MANCANO */}
          <Section
            title="Mancano"
            count={grouped.mancano.length}
            tone="info"
            emptyText="Tutti gli ospiti sono arrivati"
          >
            {grouped.mancano.map((reservation) => (
              <SpuntaRow
                key={reservation.id}
                reservation={reservation}
                status="confirmed"
                onTap={() => advance(reservation)}
                onLongPress={(x, y) => openMenu(reservation.id, x, y)}
              />
            ))}
          </Section>

          {/* IN SALA */}
          <Section
            title="In sala"
            count={grouped.inSala.length}
            tone="ok"
            emptyText="Nessun tavolo seduto al momento"
          >
            {grouped.inSala.map((reservation) => (
              <SpuntaRow
                key={reservation.id}
                reservation={reservation}
                status="arrived"
                onTap={() => advance(reservation)}
                onLongPress={(x, y) => openMenu(reservation.id, x, y)}
              />
            ))}
          </Section>

          {/* FATTI — collassabile */}
          {grouped.fatti.length > 0 && (
            <section className="admin-panel">
              <button
                type="button"
                onClick={() => setFattiOpen((v) => !v)}
                className="flex w-full items-center justify-between px-4 py-3"
                aria-expanded={fattiOpen}
              >
                <div className="flex items-baseline gap-2">
                  <h3
                    style={{
                      fontFamily: "var(--font-yanone)",
                      fontSize: "1.3rem",
                      fontWeight: 300,
                      color: "var(--adm-muted)",
                      lineHeight: 1,
                    }}
                  >
                    Fatti
                  </h3>
                  <span
                    className="tabular-nums"
                    style={{
                      color: "var(--adm-muted)",
                      fontFamily: "var(--font-quicksand)",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    {grouped.fatti.length}
                  </span>
                </div>
                <ChevronDown
                  className="size-4 transition"
                  style={{
                    color: "var(--adm-muted)",
                    transform: fattiOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>
              {fattiOpen && (
                <div className="px-2 pb-2">
                  {grouped.fatti.map((reservation) => (
                    <SpuntaRow
                      key={reservation.id}
                      reservation={reservation}
                      status="completed"
                      onUndo={() => onUpdateStatus(reservation.id, "arrived")}
                    />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      )}

      {/* MENU azioni secondarie (annulla / cambia tavolo / modifica note) */}
      {menuFor && menuReservation && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={closeMenu}
            onContextMenu={(event) => {
              event.preventDefault()
              closeMenu()
            }}
          />
          <div
            className="fixed z-50 rounded-[8px] border shadow-2xl overflow-hidden"
            style={{
              top: menuFor.y,
              left: menuFor.x,
              background: "var(--adm-sand-2)",
              borderColor: "var(--adm-line-strong)",
              minWidth: 240,
              fontFamily: "var(--font-quicksand)",
            }}
            role="menu"
          >
            <div
              className="px-4 py-3 border-b"
              style={{ borderColor: "var(--adm-line)" }}
            >
              <p
                className="leading-none"
                style={{
                  fontFamily: "var(--font-yanone)",
                  fontSize: "1.2rem",
                  fontWeight: 400,
                  color: "var(--adm-text)",
                }}
              >
                {menuReservation.name}
              </p>
              <p
                className="tabular-nums"
                style={{
                  fontSize: "0.78rem",
                  color: "var(--adm-muted)",
                  marginTop: 4,
                }}
              >
                {menuReservation.time ?? "—"} · {menuReservation.guests}p
                {menuReservation.table && ` · T${menuReservation.table}`}
              </p>
            </div>
            <button
              type="button"
              onClick={actionChangeTable}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[var(--adm-sand)]"
              style={{ fontSize: "0.92rem", color: "var(--adm-text)" }}
              role="menuitem"
            >
              <Replace className="size-4" style={{ color: "var(--adm-muted)" }} />
              Cambia tavolo
            </button>
            <button
              type="button"
              onClick={actionEditNotes}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[var(--adm-sand)]"
              style={{ fontSize: "0.92rem", color: "var(--adm-text)" }}
              role="menuitem"
            >
              <Edit3 className="size-4" style={{ color: "var(--adm-muted)" }} />
              Modifica note
            </button>
            <button
              type="button"
              onClick={actionCancel}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition border-t hover:bg-[var(--adm-busy-bg,rgba(138,74,58,0.08))]"
              style={{
                fontSize: "0.92rem",
                color: "var(--adm-busy)",
                borderColor: "var(--adm-line)",
                fontWeight: 600,
              }}
              role="menuitem"
            >
              <Trash2 className="size-4" />
              Annulla prenotazione
            </button>
          </div>
        </>
      )}

      {/* UNDO banner (5s) — si vede sopra tutto quando hai appena fatto un'azione */}
      {lastAction && (
        <div
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-3 shadow-lg flex items-center gap-3"
          style={{
            background: "var(--adm-text)",
            color: "var(--adm-sand)",
            fontFamily: "var(--font-quicksand)",
          }}
          role="status"
        >
          <span style={{ fontSize: "0.88rem", fontWeight: 500 }}>
            {lastAction.name}{" "}
            {lastAction.toStatus === "arrived"
              ? "segnato in sala"
              : lastAction.toStatus === "completed"
              ? "segnato come fatto"
              : lastAction.toStatus === "cancelled"
              ? "annullato"
              : "aggiornato"}
          </span>
          <button
            type="button"
            onClick={undoLast}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 transition"
            style={{
              borderColor: "rgba(244,242,237,0.4)",
              color: "var(--adm-sand)",
              fontSize: "0.82rem",
              fontWeight: 600,
            }}
          >
            <Undo2 className="size-3.5" />
            Annulla
          </button>
        </div>
      )}
    </div>
  )
}

// ─── KPI inline per la stats bar ───
function KpiInline({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string
  value: number | string
  hint?: string | null
  tone?: "default" | "ok" | "info" | "warn"
}) {
  const valueColor =
    tone === "ok"
      ? "var(--adm-ok)"
      : tone === "info"
      ? "var(--adm-info)"
      : tone === "warn"
      ? "var(--adm-busy)"
      : "var(--adm-text)"
  return (
    <div className="flex items-baseline gap-1.5">
      <span
        style={{
          fontSize: "0.64rem",
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "var(--adm-muted)",
          fontFamily: "var(--font-quicksand)",
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      <span
        className="tabular-nums"
        style={{
          fontFamily: "var(--font-yanone)",
          fontSize: "1.4rem",
          fontWeight: 400,
          color: valueColor,
          lineHeight: 1,
          letterSpacing: "-0.005em",
        }}
      >
        {value}
      </span>
      {hint && (
        <span
          style={{
            fontSize: "0.72rem",
            color: "var(--adm-muted)",
            fontFamily: "var(--font-quicksand)",
          }}
        >
          {hint}
        </span>
      )}
    </div>
  )
}

// ─── Sezione contenitore (Mancano / In sala) ───
function Section({
  title,
  count,
  tone,
  emptyText,
  children,
}: {
  title: string
  count: number
  tone: "ok" | "info"
  emptyText: string
  children: React.ReactNode
}) {
  const toneColor = tone === "ok" ? "var(--adm-ok)" : "var(--adm-info)"
  const toneBg = tone === "ok" ? "rgba(91,122,74,0.14)" : "rgba(72,111,122,0.14)"
  return (
    <section className="admin-panel">
      <header className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--adm-line)" }}>
        <div className="flex items-baseline gap-2.5">
          <h3
            className="leading-none"
            style={{
              fontFamily: "var(--font-yanone)",
              fontSize: "1.5rem",
              fontWeight: 300,
              color: "var(--adm-text)",
              letterSpacing: "-0.005em",
            }}
          >
            {title}
          </h3>
          <span
            className="rounded-full px-2 py-0.5 text-[0.72rem] tabular-nums"
            style={{
              background: toneBg,
              color: toneColor,
              fontFamily: "var(--font-quicksand)",
              fontWeight: 700,
            }}
          >
            {count}
          </span>
        </div>
      </header>
      {count === 0 ? (
        <p
          className="px-4 py-6 text-center"
          style={{
            color: "var(--adm-muted)",
            fontStyle: "italic",
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "1rem",
          }}
        >
          {emptyText}
        </p>
      ) : (
        <div>{children}</div>
      )}
    </section>
  )
}

// ─── Riga Spuntalista — il pezzo critico ───
function SpuntaRow({
  reservation,
  status,
  onTap,
  onUndo,
  onLongPress,
}: {
  reservation: AdminReservation
  status: "confirmed" | "arrived" | "completed"
  onTap?: () => void
  onUndo?: () => void
  onLongPress?: (x: number, y: number) => void
}) {
  const urgentTags = (reservation.tags ?? []).filter((t) => URGENT_TAGS.includes(t))
  const normalTags = (reservation.tags ?? []).filter((t) => !URGENT_TAGS.includes(t))

  const isFatti = status === "completed"
  const isInSala = status === "arrived"

  const nameColor = isFatti ? "var(--adm-muted)" : "var(--adm-text)"
  const nameDecoration = isFatti ? "line-through" : "none"

  // Long-press: timer su pointerdown, cancellato su move/up/cancel
  const longPressTimer = useRef<number | null>(null)
  function clearLongPress() {
    if (longPressTimer.current != null) {
      window.clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }
  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!onLongPress) return
    // Solo tap primario (dito o tasto sinistro). Right-click gestito da onContextMenu.
    if (event.pointerType === "mouse" && event.button !== 0) return
    const { clientX, clientY } = event
    clearLongPress()
    longPressTimer.current = window.setTimeout(() => {
      onLongPress(clientX, clientY)
      longPressTimer.current = null
    }, 500)
  }
  function handleContextMenu(event: React.MouseEvent<HTMLDivElement>) {
    if (!onLongPress) return
    event.preventDefault()
    clearLongPress()
    onLongPress(event.clientX, event.clientY)
  }

  return (
    <div
      className="grid items-center gap-3 border-b px-4 py-4 transition select-none"
      style={{
        gridTemplateColumns: "minmax(72px,auto) 1fr 60px",
        borderColor: "var(--adm-line)",
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={clearLongPress}
      onPointerMove={clearLongPress}
      onPointerCancel={clearLongPress}
      onPointerLeave={clearLongPress}
      onContextMenu={handleContextMenu}
    >
      {/* ORARIO grosso */}
      <span
        className="tabular-nums"
        style={{
          fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
          fontSize: "1.25rem",
          fontWeight: 500,
          color: isFatti ? "var(--adm-muted)" : "var(--adm-text)",
        }}
      >
        {reservation.time ?? "—"}
      </span>

      {/* CORPO: warning + nome + meta inline */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {urgentTags.length > 0 && !isFatti && (
          <span
            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5"
            style={{
              background: "var(--adm-busy)",
              color: "white",
              fontSize: "0.7rem",
              fontFamily: "var(--font-quicksand)",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
            aria-label="Attenzione allergeni"
          >
            ⚠ {urgentTags.map((t) => TAG_LABEL[t]).join(" · ")}
          </span>
        )}
        <span
          style={{
            fontFamily: "var(--font-yanone)",
            fontSize: "1.6rem",
            fontWeight: 300,
            color: nameColor,
            letterSpacing: "-0.005em",
            lineHeight: 1.05,
            textDecoration: nameDecoration,
          }}
        >
          {reservation.name}
        </span>
        <span
          style={{
            color: "var(--adm-muted)",
            fontFamily: "var(--font-quicksand)",
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          {reservation.guestsRange
            ? `${reservation.guestsRange.min}-${reservation.guestsRange.max}p`
            : `${reservation.guests}p`}
          {reservation.table && (
            <span style={{ color: "var(--adm-accent-deep)", fontWeight: 700 }}>{` · T${reservation.table}`}</span>
          )}
        </span>
        {normalTags.length > 0 && (
          <span
            style={{
              color: "var(--adm-muted)",
              fontFamily: "var(--font-quicksand)",
              fontSize: "0.82rem",
            }}
          >
            {normalTags.map((t) => TAG_LABEL[t]).join(" · ")}
          </span>
        )}
        {reservation.notes && (
          <span
            style={{
              color: "var(--adm-muted)",
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontStyle: "italic",
              fontSize: "0.92rem",
            }}
          >
            “{reservation.notes}”
          </span>
        )}
      </div>

      {/* CHECKBOX grossa — touch target 52px */}
      {isFatti ? (
        <button
          type="button"
          onClick={onUndo}
          aria-label="Riporta in sala"
          className="inline-flex h-13 w-13 items-center justify-center rounded-[8px] border transition"
          style={{
            width: 52,
            height: 52,
            borderColor: "var(--adm-line)",
            background: "transparent",
            color: "var(--adm-muted)",
          }}
        >
          <RotateCcw className="size-5" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onTap}
          aria-label={isInSala ? "Segna come fatto" : "Segna come arrivato"}
          className="inline-flex items-center justify-center rounded-[8px] border-2 transition"
          style={{
            width: 52,
            height: 52,
            borderColor: isInSala ? "var(--adm-ok)" : "var(--adm-line-strong)",
            background: isInSala ? "var(--adm-ok)" : "white",
            color: isInSala ? "white" : "var(--adm-muted)",
          }}
        >
          {isInSala ? <Check className="size-6" strokeWidth={3} /> : <Square className="size-6" />}
        </button>
      )}
    </div>
  )
}
