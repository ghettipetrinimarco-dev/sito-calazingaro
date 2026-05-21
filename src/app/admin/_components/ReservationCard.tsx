"use client"

import { useState } from "react"
import {
  Check,
  Edit3,
  RotateCcw,
  Trash2,
  UserRoundCheck,
  Users,
  X,
} from "lucide-react"
import type { AdminReservation, ReservationStatus } from "../_state/types"
import StatusBadge from "./StatusBadge"
import TagPill from "./TagPill"

interface Props {
  reservation: AdminReservation
  variant?: "agenda" | "service"
  onUpdateStatus: (id: string, status: ReservationStatus) => void
  onPatch: (id: string, partial: Partial<Pick<AdminReservation, "table" | "notes">>) => void
}

const sourceLabels: Record<AdminReservation["source"], string> = {
  telefono: "Tel",
  whatsapp: "WA",
  manuale: "Manuale",
}

function getServiceLabel(value: AdminReservation["service"]) {
  return value === "pranzo" ? "Pranzo" : "Cena"
}

export default function ReservationCard({
  reservation,
  variant = "agenda",
  onUpdateStatus,
  onPatch,
}: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [editTable, setEditTable] = useState(reservation.table ?? "")
  const [editNotes, setEditNotes] = useState(reservation.notes ?? "")

  const isCancelled = reservation.status === "cancelled"
  const isCompleted = reservation.status === "completed"
  const isActive = !isCancelled && !isCompleted

  function startEditing() {
    setEditTable(reservation.table ?? "")
    setEditNotes(reservation.notes ?? "")
    setIsEditing(true)
  }

  function saveEditing() {
    onPatch(reservation.id, {
      table: editTable.trim() || null,
      notes: editNotes.trim() || null,
    })
    setIsEditing(false)
  }

  return (
    <article
      className="admin-panel p-3 md:p-4 transition"
      style={{
        opacity: isCancelled ? 0.55 : 1,
        borderColor: confirmCancel ? "rgba(138,74,58,0.55)" : undefined,
      }}
    >
      <div className="grid gap-4 xl:grid-cols-[88px_minmax(0,1fr)_auto] xl:items-start">
        {/* Orario */}
        <div
          className="rounded-[4px] border bg-white px-3 py-2 text-center"
          style={{ borderColor: "var(--adm-line)" }}
        >
          <p
            className="text-[0.58rem] uppercase tracking-[0.18em]"
            style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
          >
            {getServiceLabel(reservation.service)}
          </p>
          <p
            className="mt-1.5 text-lg tabular-nums"
            style={{ color: "var(--adm-text)", fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace", fontWeight: 500 }}
          >
            {reservation.time ?? "--:--"}
          </p>
        </div>

        {/* Dettagli */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
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
              {reservation.name}
            </h3>
            <StatusBadge status={reservation.status} />
            <span
              className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.62rem] tabular-nums"
              style={{
                background: "rgba(20,17,13,0.05)",
                color: "var(--adm-muted)",
                fontFamily: "var(--font-quicksand)",
                fontWeight: 500,
              }}
            >
              <Users className="size-3.5" />
              {reservation.guestsRange
                ? `${reservation.guestsRange.min}-${reservation.guestsRange.max}`
                : reservation.guests}
            </span>
            {reservation.tags && reservation.tags.length > 0 && (
              <>
                {reservation.tags.map((tag) => (
                  <TagPill key={tag} tag={tag} size="sm" />
                ))}
              </>
            )}
          </div>

          {isEditing ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-[140px_1fr]">
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
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[0.82rem]">
              <span
                className="rounded-[4px] px-2.5 py-1.5"
                style={{
                  background: reservation.table ? "rgba(20,17,13,0.05)" : "transparent",
                  border: reservation.table ? "none" : "1px dashed var(--adm-line-strong)",
                  color: reservation.table ? "var(--adm-text)" : "var(--adm-muted)",
                  fontStyle: reservation.table ? "normal" : "italic",
                  fontFamily: "var(--font-quicksand)",
                }}
              >
                {reservation.table ? `Tavolo ${reservation.table}` : "Tavolo da assegnare"}
              </span>
              {reservation.notes && (
                <span
                  className="rounded-[4px] px-2.5 py-1.5"
                  style={{
                    background: "rgba(200,168,122,0.12)",
                    color: "var(--adm-text)",
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "0.92rem",
                  }}
                >
                  {reservation.notes}
                </span>
              )}
              <span
                className="ml-auto text-[0.58rem] uppercase tracking-[0.18em]"
                style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
              >
                {sourceLabels[reservation.source]}
              </span>
            </div>
          )}
        </div>

        {/* Azioni */}
        <div className="flex flex-wrap gap-2 xl:flex-col xl:items-stretch xl:min-w-[140px]">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={saveEditing}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[4px] px-3 text-[0.72rem] tracking-[0.06em] transition"
                style={{
                  background: "var(--adm-text)",
                  color: "var(--adm-sand)",
                  fontFamily: "var(--font-quicksand)",
                  fontWeight: 500,
                }}
              >
                <Check className="size-4" />
                Salva
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[4px] border bg-white px-3 text-[0.72rem] tracking-[0.06em] transition hover:bg-[var(--adm-sand)]"
                style={{
                  borderColor: "var(--adm-line)",
                  color: "var(--adm-text)",
                  fontFamily: "var(--font-quicksand)",
                  fontWeight: 500,
                }}
              >
                <X className="size-4" />
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
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[4px] px-3 text-[0.72rem] tracking-[0.06em] transition"
                style={{
                  background: "var(--adm-busy)",
                  color: "white",
                  fontFamily: "var(--font-quicksand)",
                  fontWeight: 500,
                }}
              >
                <Trash2 className="size-4" />
                Conferma
              </button>
              <button
                type="button"
                onClick={() => setConfirmCancel(false)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[4px] border bg-white px-3 text-[0.72rem] tracking-[0.06em] transition hover:bg-[var(--adm-sand)]"
                style={{
                  borderColor: "var(--adm-line)",
                  color: "var(--adm-text)",
                  fontFamily: "var(--font-quicksand)",
                  fontWeight: 500,
                }}
              >
                <X className="size-4" />
                No
              </button>
            </>
          ) : isCancelled ? (
            <button
              type="button"
              onClick={() => onUpdateStatus(reservation.id, "confirmed")}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-[4px] border bg-white px-3 text-[0.72rem] tracking-[0.06em] transition hover:bg-[var(--adm-sand)]"
              style={{
                borderColor: "var(--adm-line)",
                color: "var(--adm-text)",
                fontFamily: "var(--font-quicksand)",
                fontWeight: 500,
              }}
            >
              <RotateCcw className="size-4" />
              Ripristina
            </button>
          ) : (
            <>
              {reservation.status === "confirmed" && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(reservation.id, "arrived")}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-[4px] px-3 text-[0.72rem] tracking-[0.06em] transition"
                  style={{
                    background: "var(--adm-ok)",
                    color: "white",
                    fontFamily: "var(--font-quicksand)",
                    fontWeight: 500,
                  }}
                >
                  <UserRoundCheck className="size-4" />
                  Arrivato
                </button>
              )}
              {reservation.status === "arrived" && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(reservation.id, "completed")}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-[4px] px-3 text-[0.72rem] tracking-[0.06em] transition"
                  style={{
                    background: "var(--adm-text)",
                    color: "var(--adm-sand)",
                    fontFamily: "var(--font-quicksand)",
                    fontWeight: 500,
                  }}
                >
                  <Check className="size-4" />
                  Chiudi tavolo
                </button>
              )}
              {variant === "agenda" && isActive && (
                <button
                  type="button"
                  onClick={startEditing}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-[4px] border bg-white px-3 text-[0.72rem] tracking-[0.06em] transition hover:bg-[var(--adm-sand)]"
                  style={{
                    borderColor: "var(--adm-line)",
                    color: "var(--adm-text)",
                    fontFamily: "var(--font-quicksand)",
                    fontWeight: 500,
                  }}
                >
                  <Edit3 className="size-4" />
                  Modifica
                </button>
              )}
              {isActive && (
                <button
                  type="button"
                  onClick={() => setConfirmCancel(true)}
                  aria-label="Annulla prenotazione"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-[4px] border bg-white px-3 text-[0.72rem] tracking-[0.06em] transition"
                  style={{
                    borderColor: "rgba(138,74,58,0.3)",
                    color: "var(--adm-busy)",
                    fontFamily: "var(--font-quicksand)",
                    fontWeight: 500,
                  }}
                >
                  <Trash2 className="size-4" />
                  Annulla
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  )
}
