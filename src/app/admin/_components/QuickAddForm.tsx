"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowLeftRight, Calendar, Clock, Plus, Sparkles, Users, UtensilsCrossed } from "lucide-react"
import {
  parseQuickReservation,
  type QuickReservationDraft,
} from "@/lib/quick-reservation-parser"
import { formatItalianDate, formatItalianDay } from "../_state/dateUtils"
import type { AdminReservation, AdminTable, ReservationSource } from "../_state/types"
import { addMinutesToTime } from "../_state/dateUtils"
import VoiceInput from "./VoiceInput"
import TagPill from "./TagPill"

interface Props {
  onSubmit: (reservation: AdminReservation) => void
  onAfterSubmit?: (reservation: AdminReservation) => void
  // Fase 1: nuovi pezzi del modello dati
  durationFor: (partySize: number) => number
  getTableByName: (name: string | null) => AdminTable | null
  ensureGuest: (data: { name: string; phone?: string | null; tags?: AdminReservation["tags"] }) => string
}

const PLACEHOLDER =
  "Es. Famiglia Verdi sabato alle 21 siamo 18 — vista mare, due celiaci"

function extractTable(note: string | null): { table: string | null; cleanNote: string | null } {
  if (!note) return { table: null, cleanNote: null }
  const match = note.match(/\btavolo\s+(\d{1,3})\b/i)
  const table = match?.[1] ?? null
  const cleaned =
    note
      .replace(/\btavolo\s+\d{1,3}\b/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim() || null
  return { table, cleanNote: cleaned }
}

function describeMissing(missing: QuickReservationDraft["missingFields"]): string {
  const labels: Record<(typeof missing)[number], string> = {
    nome: "nome",
    data: "giorno",
    fascia: "turno (pranzo/cena)",
    coperti: "numero coperti",
  }
  return missing.map((field) => labels[field]).join(", ")
}

interface ChipFieldProps {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  empty?: boolean
  ambiguous?: boolean
}

function ChipField({ label, value, icon: Icon, empty, ambiguous }: ChipFieldProps) {
  const borderStyle = ambiguous
    ? "1px dashed var(--adm-accent-deep)"
    : empty
    ? "1px dashed var(--adm-line-strong)"
    : "1px solid var(--adm-line)"
  return (
    <div
      className="inline-flex min-w-[100px] flex-col rounded-[6px] bg-white px-3 py-2"
      style={{ border: borderStyle }}
    >
      <div
        className="flex items-center gap-1.5 text-[0.58rem] uppercase tracking-[0.18em]"
        style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
      >
        <Icon className="size-3" />
        {label}
      </div>
      <p
        className="mt-1 leading-none tabular-nums"
        style={{
          fontSize: empty ? "1rem" : "1.1rem",
          color: empty ? "var(--adm-muted)" : "var(--adm-text)",
          fontFamily: "var(--font-quicksand)",
          fontWeight: empty ? 400 : 600,
          fontStyle: empty ? "italic" : "normal",
        }}
      >
        {value}
      </p>
    </div>
  )
}

export default function QuickAddForm({
  onSubmit,
  onAfterSubmit,
  durationFor,
  getTableByName,
  ensureGuest,
}: Props) {
  const [text, setText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [swapped, setSwapped] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const rawPreview = useMemo<QuickReservationDraft | null>(() => {
    if (!text.trim()) return null
    return parseQuickReservation(text)
  }, [text])

  // Quando l'utente preme "scambia": invertiamo orario ↔ coperti
  const preview = useMemo<QuickReservationDraft | null>(() => {
    if (!rawPreview) return null
    if (!swapped) return rawPreview
    // Per scambiare: il coperti diventa l'ora (HH:00), l'orario diventa il numero di coperti
    const newOrario = rawPreview.coperti !== null ? `${String(rawPreview.coperti).padStart(2, "0")}:00` : null
    const newCoperti = rawPreview.orario !== null ? Number(rawPreview.orario.split(":")[0]) : null
    return {
      ...rawPreview,
      orario: newOrario,
      coperti: newCoperti,
      orarioAmbiguo: false,
      copertiAmbiguo: false,
      // ricalcola missing
      missingFields: [
        ...(!rawPreview.nome ? (["nome"] as const) : []),
        ...(!rawPreview.data ? (["data"] as const) : []),
        ...(!rawPreview.fascia ? (["fascia"] as const) : []),
        ...(newCoperti === null ? (["coperti"] as const) : []),
      ],
    }
  }, [rawPreview, swapped])

  // Reset swap quando cambia il testo
  useEffect(() => {
    setSwapped(false)
  }, [text])

  const isReady = preview !== null && preview.missingFields.length === 0
  const canSwap =
    rawPreview !== null &&
    rawPreview.orario !== null &&
    rawPreview.coperti !== null &&
    (rawPreview.orarioAmbiguo || rawPreview.copertiAmbiguo)

  function handleSubmit() {
    if (!preview) {
      setError("Scrivi una prenotazione per iniziare")
      return
    }
    if (preview.missingFields.length > 0) {
      setError(`Manca ${describeMissing(preview.missingFields)}`)
      return
    }

    const { table, cleanNote } = extractTable(preview.note)
    const tableEntity = getTableByName(table)
    const duration = durationFor(preview.coperti!)
    const startsAt = preview.orario
    const endsAt = startsAt ? addMinutesToTime(startsAt, duration) : null
    const guestProfileId = ensureGuest({
      name: preview.nome!,
      phone: preview.telefono ?? null,
      tags: preview.tags,
    })

    const reservation: AdminReservation = {
      id: crypto.randomUUID(),
      name: preview.nome!,
      date: preview.data!,
      service: preview.fascia!,
      time: startsAt,
      startsAt,
      endsAt,
      turnDuration: 0, // 0 = usa policy (override solo se utente lo modifica esplicitamente)
      guests: preview.coperti!,
      guestsRange: preview.copertiRange,
      status: "confirmed",
      tableId: tableEntity?.id ?? null,
      table: tableEntity?.name ?? table,
      notes: cleanNote,
      tags: preview.tags,
      source: "manuale" satisfies ReservationSource,
      guestProfileId,
      createdAt: new Date().toISOString(),
    }

    onSubmit(reservation)
    onAfterSubmit?.(reservation)
    setText("")
    setError(null)
    setSwapped(false)
  }

  function handleVoice(transcript: string) {
    setText(transcript)
    if (error) setError(null)
    // Focus alla textarea così l'utente può eventualmente correggere
    requestAnimationFrame(() => textareaRef.current?.focus())
  }

  const copertiValue = (() => {
    if (!preview) return "—"
    if (preview.coperti === null) return "—"
    if (preview.copertiRange) return `${preview.copertiRange.min}-${preview.copertiRange.max}`
    return String(preview.coperti)
  })()

  return (
    <div className="admin-panel p-4 md:p-5">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p
            className="text-[0.58rem] uppercase tracking-[0.18em]"
            style={{ color: "var(--adm-accent-deep)", fontFamily: "var(--font-quicksand)" }}
          >
            Inserimento rapido
          </p>
          <h2
            className="mt-1.5 leading-none"
            style={{
              fontFamily: "var(--font-yanone)",
              fontSize: "1.65rem",
              fontWeight: 300,
              color: "var(--adm-text)",
            }}
          >
            Nuova prenotazione
          </h2>
        </div>
        <span
          className="hidden md:inline-flex items-center gap-1.5 px-2 py-1 text-[0.62rem]"
          style={{
            color: "var(--adm-muted)",
            fontFamily: "var(--font-quicksand)",
            fontWeight: 500,
          }}
        >
          <Sparkles className="size-3" />
          Riconosce linguaggio naturale
        </span>
      </div>

      <div className="relative mt-4">
        <textarea
          ref={textareaRef}
          id="quick-add-input"
          value={text}
          onChange={(event) => {
            setText(event.target.value)
            if (error) setError(null)
          }}
          placeholder={PLACEHOLDER}
          aria-label="Inserisci prenotazione"
          className="admin-input w-full resize-y p-3.5 pr-14 text-[0.95rem] leading-7"
          style={{ minHeight: 112, fontFamily: "var(--font-quicksand)" }}
        />
        <div className="absolute right-3 top-3">
          <VoiceInput onTranscript={handleVoice} />
        </div>
      </div>

      {preview && (
        <div
          className="mt-4 rounded-[8px] border p-4"
          style={{
            borderColor: isReady ? "rgba(91,122,74,0.45)" : "rgba(141,107,63,0.35)",
            background: isReady ? "rgba(91,122,74,0.05)" : "rgba(141,107,63,0.04)",
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <p
              className="text-[0.6rem] uppercase tracking-[0.22em]"
              style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
            >
              Anteprima
            </p>
            {canSwap && (
              <button
                type="button"
                onClick={() => setSwapped((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.66rem] transition"
                style={{
                  borderColor: "var(--adm-accent-deep)",
                  color: "var(--adm-accent-deep)",
                  background: swapped ? "rgba(200,168,122,0.18)" : "white",
                  fontFamily: "var(--font-quicksand)",
                  fontWeight: 600,
                }}
                title="Scambia orario e coperti se il parser ha invertito"
              >
                <ArrowLeftRight className="size-3" />
                {swapped ? "Ripristina" : "Scambia orario ↔ coperti"}
              </button>
            )}
          </div>

          {/* Nome grande */}
          <p
            className="mt-2 leading-none"
            style={{
              fontFamily: "var(--font-yanone)",
              fontSize: "1.85rem",
              fontWeight: 300,
              color: "var(--adm-text)",
              letterSpacing: "-0.01em",
            }}
          >
            {preview.nome ?? <span style={{ color: "var(--adm-muted)" }}>Nome mancante</span>}
          </p>

          {/* Chip grandi: data · turno · orario · coperti */}
          <div className="mt-3 flex flex-wrap gap-2">
            <ChipField
              label="Giorno"
              icon={Calendar}
              value={
                preview.data
                  ? `${formatItalianDay(preview.data)} ${formatItalianDate(preview.data).slice(0, 5)}`
                  : "—"
              }
              empty={!preview.data}
            />
            <ChipField
              label="Turno"
              icon={UtensilsCrossed}
              value={preview.fascia === "pranzo" ? "Pranzo" : preview.fascia === "cena" ? "Cena" : "—"}
              empty={!preview.fascia}
            />
            <ChipField
              label="Orario"
              icon={Clock}
              value={preview.orario ?? "—"}
              empty={!preview.orario}
              ambiguous={preview.orarioAmbiguo}
            />
            <ChipField
              label="Coperti"
              icon={Users}
              value={copertiValue}
              empty={preview.coperti === null}
              ambiguous={preview.copertiAmbiguo}
            />
          </div>

          {/* Tag + note */}
          {(preview.tags.length > 0 || preview.note) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {preview.tags.map((tag) => (
                <TagPill key={tag} tag={tag} size="md" />
              ))}
              {preview.note && (
                <span
                  className="rounded-[4px] px-2 py-1 text-[0.88rem] italic"
                  style={{
                    color: "var(--adm-muted)",
                    background: "rgba(38,35,31,0.04)",
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                  }}
                >
                  {preview.note}
                </span>
              )}
            </div>
          )}

          {preview.missingFields.length > 0 && (
            <p
              className="mt-3 text-[0.82rem]"
              style={{ color: "var(--adm-accent-deep)", fontFamily: "var(--font-quicksand)" }}
            >
              Manca {describeMissing(preview.missingFields)}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isReady}
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[6px] text-[0.86rem] tracking-[0.06em] transition disabled:cursor-not-allowed disabled:opacity-45 md:h-14 md:text-[0.92rem]"
            style={{
              background: isReady ? "var(--adm-accent)" : "var(--adm-text)",
              color: isReady ? "var(--adm-ink)" : "var(--adm-sand)",
              fontFamily: "var(--font-quicksand)",
              fontWeight: 600,
            }}
            onMouseEnter={(event) => {
              if (isReady) event.currentTarget.style.background = "#d6bb91"
            }}
            onMouseLeave={(event) => {
              if (isReady) event.currentTarget.style.background = "var(--adm-accent)"
            }}
          >
            <Plus className="size-4" />
            Inserisci prenotazione
          </button>
        </div>
      )}

      {!preview && error && (
        <p
          className="mt-3 text-[0.85rem]"
          style={{ color: "var(--adm-busy)", fontFamily: "var(--font-quicksand)" }}
          role="alert"
        >
          {error}
        </p>
      )}

      {!preview && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled
          className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[6px] text-[0.86rem] tracking-[0.06em] disabled:opacity-30"
          style={{
            background: "var(--adm-text)",
            color: "var(--adm-sand)",
            fontFamily: "var(--font-quicksand)",
            fontWeight: 600,
          }}
        >
          <Plus className="size-4" />
          Inserisci prenotazione
        </button>
      )}
    </div>
  )
}
