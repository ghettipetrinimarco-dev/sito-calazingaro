"use client"

import { useState } from "react"
import {
  Check,
  ChevronDown,
  Edit3,
  RotateCcw,
  Trash2,
  UserRoundCheck,
  Users,
} from "lucide-react"
import type { AdminReservation, ReservationStatus } from "../_state/types"
import StatusBadge from "./StatusBadge"
import TagPill from "./TagPill"

interface Props {
  reservation: AdminReservation
  variant?: "agenda" | "service"
  showTime?: boolean
  onUpdateStatus: (id: string, status: ReservationStatus) => void
  onPatch: (id: string, partial: Partial<Pick<AdminReservation, "table" | "notes">>) => void
}

export default function CompactReservationRow({
  reservation,
  variant = "agenda",
  showTime = true,
  onUpdateStatus,
  onPatch,
}: Props) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [editTable, setEditTable] = useState(reservation.table ?? "")
  const [editNotes, setEditNotes] = useState(reservation.notes ?? "")

  const isCancelled = reservation.status === "cancelled"
  const isCompleted = reservation.status === "completed"
  const isActive = !isCancelled && !isCompleted

  function save() {
    onPatch(reservation.id, {
      table: editTable.trim() || null,
      notes: editNotes.trim() || null,
    })
    setEditing(false)
  }

  return (
    <div
      className="group rounded-[6px] border bg-white transition"
      style={{
        borderColor: confirmCancel ? "rgba(138,74,58,0.55)" : "var(--adm-line)",
        opacity: isCancelled ? 0.6 : 1,
      }}
    >
      {/* Riga principale */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="grid w-full items-center gap-3 px-3 py-2.5 text-left md:grid-cols-[68px_minmax(0,1fr)_auto] md:px-4"
        aria-expanded={expanded}
      >
        {/* Orario */}
        {showTime && (
          <span
            className="text-[0.95rem] tabular-nums"
            style={{
              fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
              color: "var(--adm-text)",
              fontWeight: 500,
            }}
          >
            {reservation.time ?? "—"}
          </span>
        )}

        {/* Dati centrali */}
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span
            className="truncate"
            style={{
              fontFamily: "var(--font-yanone)",
              fontSize: "1.3rem",
              fontWeight: 300,
              color: "var(--adm-text)",
              letterSpacing: "-0.005em",
              lineHeight: 1,
            }}
          >
            {reservation.name}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.66rem] tabular-nums"
            style={{
              background: "rgba(20,17,13,0.05)",
              color: "var(--adm-muted)",
              fontFamily: "var(--font-quicksand)",
              fontWeight: 600,
            }}
          >
            <Users className="size-3" />
            {reservation.guestsRange
              ? `${reservation.guestsRange.min}-${reservation.guestsRange.max}`
              : reservation.guests}
          </span>
          {reservation.table && (
            <span
              className="rounded-full px-2 py-0.5 text-[0.66rem]"
              style={{
                background: "rgba(200,168,122,0.16)",
                color: "var(--adm-accent-deep)",
                fontFamily: "var(--font-quicksand)",
                fontWeight: 600,
              }}
            >
              T{reservation.table}
            </span>
          )}
          <StatusBadge status={reservation.status} />
          {reservation.tags?.map((tag) => (
            <TagPill key={tag} tag={tag} size="sm" />
          ))}
        </div>

        {/* Indicatore espansione */}
        <ChevronDown
          className="size-4 shrink-0 transition"
          style={{
            color: "var(--adm-muted)",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* Pannello espanso */}
      {expanded && (
        <div
          className="border-t px-3 py-3 md:px-4 md:py-4"
          style={{ borderColor: "var(--adm-line)" }}
        >
          {/* Edit form o dettagli */}
          {editing ? (
            <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
              <label className="block">
                <span
                  className="text-[0.6rem] uppercase tracking-[0.18em]"
                  style={{ color: "var(--adm-text)", fontFamily: "var(--font-quicksand)" }}
                >
                  Tavolo
                </span>
                <input
                  aria-label="Tavolo"
                  value={editTable}
                  onChange={(event) => setEditTable(event.target.value)}
                  className="admin-input mt-1 h-10 w-full px-3 text-sm"
                  inputMode="numeric"
                />
              </label>
              <label className="block">
                <span
                  className="text-[0.6rem] uppercase tracking-[0.18em]"
                  style={{ color: "var(--adm-text)", fontFamily: "var(--font-quicksand)" }}
                >
                  Note
                </span>
                <input
                  aria-label="Note"
                  value={editNotes}
                  onChange={(event) => setEditNotes(event.target.value)}
                  className="admin-input mt-1 h-10 w-full px-3 text-sm"
                />
              </label>
            </div>
          ) : (
            (reservation.notes || !reservation.table) && (
              <div className="flex flex-wrap items-center gap-2 text-[0.82rem]">
                {!reservation.table && (
                  <span
                    className="rounded-[4px] px-2.5 py-1.5"
                    style={{
                      border: "1px dashed var(--adm-line-strong)",
                      color: "var(--adm-muted)",
                      fontStyle: "italic",
                      fontFamily: "var(--font-quicksand)",
                    }}
                  >
                    Tavolo da assegnare
                  </span>
                )}
                {reservation.notes && (
                  <span
                    className="rounded-[4px] px-2.5 py-1.5"
                    style={{
                      background: "rgba(200,168,122,0.12)",
                      color: "var(--adm-text)",
                      fontFamily: "var(--font-cormorant), Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "1rem",
                    }}
                  >
                    {reservation.notes}
                  </span>
                )}
              </div>
            )
          )}

          {/* Azioni */}
          <div className="mt-3 flex flex-wrap gap-2">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={save}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-[4px] px-3 text-[0.72rem] tracking-[0.06em]"
                  style={{
                    background: "var(--adm-text)",
                    color: "var(--adm-sand)",
                    fontFamily: "var(--font-quicksand)",
                    fontWeight: 500,
                  }}
                >
                  <Check className="size-3.5" />
                  Salva
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-[4px] border bg-white px-3 text-[0.72rem] tracking-[0.06em]"
                  style={{
                    borderColor: "var(--adm-line)",
                    color: "var(--adm-text)",
                    fontFamily: "var(--font-quicksand)",
                    fontWeight: 500,
                  }}
                >
                  Annulla
                </button>
              </>
            ) : confirmCancel ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateStatus(reservation.id, "cancelled")
                    setConfirmCancel(false)
                  }}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-[4px] px-3 text-[0.72rem] tracking-[0.06em]"
                  style={{
                    background: "var(--adm-busy)",
                    color: "white",
                    fontFamily: "var(--font-quicksand)",
                    fontWeight: 500,
                  }}
                >
                  <Trash2 className="size-3.5" />
                  Conferma annulla
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmCancel(false)}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-[4px] border bg-white px-3 text-[0.72rem] tracking-[0.06em]"
                  style={{
                    borderColor: "var(--adm-line)",
                    color: "var(--adm-text)",
                    fontFamily: "var(--font-quicksand)",
                    fontWeight: 500,
                  }}
                >
                  No
                </button>
              </>
            ) : isCancelled ? (
              <button
                type="button"
                onClick={() => onUpdateStatus(reservation.id, "confirmed")}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-[4px] border bg-white px-3 text-[0.72rem] tracking-[0.06em]"
                style={{
                  borderColor: "var(--adm-line)",
                  color: "var(--adm-text)",
                  fontFamily: "var(--font-quicksand)",
                  fontWeight: 500,
                }}
              >
                <RotateCcw className="size-3.5" />
                Ripristina
              </button>
            ) : (
              <>
                {reservation.status === "confirmed" && (
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(reservation.id, "arrived")}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-[4px] px-3 text-[0.72rem] tracking-[0.06em]"
                    style={{
                      background: "var(--adm-ok)",
                      color: "white",
                      fontFamily: "var(--font-quicksand)",
                      fontWeight: 500,
                    }}
                  >
                    <UserRoundCheck className="size-3.5" />
                    Arrivato
                  </button>
                )}
                {reservation.status === "arrived" && (
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(reservation.id, "completed")}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-[4px] px-3 text-[0.72rem] tracking-[0.06em]"
                    style={{
                      background: "var(--adm-text)",
                      color: "var(--adm-sand)",
                      fontFamily: "var(--font-quicksand)",
                      fontWeight: 500,
                    }}
                  >
                    <Check className="size-3.5" />
                    Chiudi tavolo
                  </button>
                )}
                {variant === "agenda" && isActive && (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-[4px] border bg-white px-3 text-[0.72rem] tracking-[0.06em]"
                    style={{
                      borderColor: "var(--adm-line)",
                      color: "var(--adm-text)",
                      fontFamily: "var(--font-quicksand)",
                      fontWeight: 500,
                    }}
                  >
                    <Edit3 className="size-3.5" />
                    Modifica
                  </button>
                )}
                {isActive && (
                  <button
                    type="button"
                    onClick={() => setConfirmCancel(true)}
                    aria-label="Annulla prenotazione"
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-[4px] border bg-white px-3 text-[0.72rem] tracking-[0.06em]"
                    style={{
                      borderColor: "rgba(138,74,58,0.3)",
                      color: "var(--adm-busy)",
                      fontFamily: "var(--font-quicksand)",
                      fontWeight: 500,
                    }}
                  >
                    <Trash2 className="size-3.5" />
                    Annulla
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
