"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { addDays, formatItalianDay, formatItalianDate } from "../_state/dateUtils"

interface Props {
  value: string
  today: string
  onChange: (date: string) => void
  variant?: "full" | "compact"
}

export default function DayPicker({ value, today, onChange, variant = "full" }: Props) {
  const isToday = value === today
  const dayLabel = formatItalianDay(value)
  const dateLabel = formatItalianDate(value)

  if (variant === "compact") {
    return (
      <div
        className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderColor: "rgba(244,242,237,0.16)",
          color: "var(--adm-sand)",
          fontFamily: "var(--font-quicksand)",
        }}
      >
        <span className="text-[0.62rem] uppercase tracking-[0.2em]" style={{ color: "rgba(200,168,122,0.85)" }}>
          {dayLabel}
        </span>
        <span className="text-[0.78rem] tabular-nums">{dateLabel}</span>
      </div>
    )
  }

  return (
    <div className="admin-panel p-4">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p
            className="text-[0.6rem] uppercase tracking-[0.22em]"
            style={{ color: "var(--adm-accent-deep)", fontFamily: "var(--font-quicksand)" }}
          >
            Giorno
          </p>
          <p
            className="mt-2 leading-none"
            style={{
              fontFamily: "var(--font-yanone)",
              fontSize: "2rem",
              fontWeight: 300,
              color: "var(--adm-text)",
              letterSpacing: "-0.01em",
            }}
          >
            {dayLabel}
          </p>
          <p
            className="mt-1 text-[0.85rem] tabular-nums"
            style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
          >
            {dateLabel}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onChange(today)}
          disabled={isToday}
          className="h-7 rounded-full border px-3 text-[0.62rem] uppercase tracking-[0.2em] transition disabled:opacity-45"
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

      <div className="mt-4 grid grid-cols-[40px_minmax(0,1fr)_40px] gap-2">
        <button
          type="button"
          onClick={() => onChange(addDays(value, -1))}
          aria-label="Giorno precedente"
          className="grid h-10 place-items-center rounded-[4px] border bg-white transition hover:bg-[var(--adm-sand)]"
          style={{ borderColor: "var(--adm-line)", color: "var(--adm-text)" }}
        >
          <ChevronLeft className="size-4" />
        </button>
        <input
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label="Seleziona giorno"
          className="admin-input h-10 w-full px-3 text-center text-sm tabular-nums"
        />
        <button
          type="button"
          onClick={() => onChange(addDays(value, 1))}
          aria-label="Giorno successivo"
          className="grid h-10 place-items-center rounded-[4px] border bg-white transition hover:bg-[var(--adm-sand)]"
          style={{ borderColor: "var(--adm-line)", color: "var(--adm-text)" }}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
