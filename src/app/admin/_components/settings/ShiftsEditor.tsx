"use client"

import type { AdminShift, DayOfWeek } from "../../_state/types"

interface Props {
  shifts: AdminShift[]
  onUpdate: (shift: AdminShift) => void
}

const DAY_LABELS: Record<DayOfWeek, string> = {
  0: "Domenica",
  1: "Lunedì",
  2: "Martedì",
  3: "Mercoledì",
  4: "Giovedì",
  5: "Venerdì",
  6: "Sabato",
}

const WEEK_ORDER: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0]

export default function ShiftsEditor({ shifts, onUpdate }: Props) {
  return (
    <div>
      <div className="mb-4">
        <p
          className="text-[0.62rem] uppercase tracking-[0.22em]"
          style={{ color: "var(--adm-accent-deep)", fontFamily: "var(--font-quicksand)" }}
        >
          Settimana tipo
        </p>
        <p
          className="mt-1 text-[1rem]"
          style={{ color: "var(--adm-text)", fontFamily: "var(--font-quicksand)" }}
        >
          Orari di apertura per ciascun giorno, pranzo e cena. Disattiva il check per chiudere il turno.
        </p>
      </div>

      <div className="grid gap-2">
        {/* Header */}
        <div
          className="hidden md:grid items-center gap-3 px-3 text-[0.6rem] uppercase tracking-[0.18em]"
          style={{
            gridTemplateColumns: "120px 80px 80px 80px 80px 110px auto",
            color: "var(--adm-muted)",
            fontFamily: "var(--font-quicksand)",
          }}
        >
          <span>Giorno · Turno</span>
          <span>Apertura</span>
          <span>Chiusura</span>
          <span>Ultima prenot.</span>
          <span>Max coperti</span>
          <span>Attivo</span>
          <span />
        </div>

        {WEEK_ORDER.flatMap((day) =>
          ["pranzo", "cena"].map((service) => {
            const shift = shifts.find((s) => s.day === day && s.service === service)
            if (!shift) return null
            return (
              <div
                key={shift.id}
                className="grid items-center gap-3 rounded-[6px] border bg-white p-3"
                style={{
                  borderColor: "var(--adm-line)",
                  opacity: shift.active ? 1 : 0.55,
                  gridTemplateColumns: "120px 80px 80px 80px 80px 110px auto",
                }}
              >
                <div>
                  <p
                    className="text-[0.78rem]"
                    style={{
                      color: "var(--adm-text)",
                      fontFamily: "var(--font-quicksand)",
                      fontWeight: 600,
                    }}
                  >
                    {DAY_LABELS[day]}
                  </p>
                  <p
                    className="text-[0.66rem] uppercase tracking-[0.18em]"
                    style={{
                      color: shift.service === "pranzo" ? "var(--adm-info)" : "var(--adm-accent-deep)",
                      fontFamily: "var(--font-quicksand)",
                    }}
                  >
                    {shift.service}
                  </p>
                </div>
                <input
                  type="time"
                  value={shift.openTime}
                  onChange={(e) => onUpdate({ ...shift, openTime: e.target.value })}
                  className="admin-input h-9 px-2 text-sm tabular-nums"
                />
                <input
                  type="time"
                  value={shift.closeTime}
                  onChange={(e) => onUpdate({ ...shift, closeTime: e.target.value })}
                  className="admin-input h-9 px-2 text-sm tabular-nums"
                />
                <input
                  type="time"
                  value={shift.lastSeating}
                  onChange={(e) => onUpdate({ ...shift, lastSeating: e.target.value })}
                  className="admin-input h-9 px-2 text-sm tabular-nums"
                />
                <input
                  type="number"
                  value={shift.maxCovers}
                  min={0}
                  max={500}
                  onChange={(e) => onUpdate({ ...shift, maxCovers: Math.max(0, Number(e.target.value)) })}
                  className="admin-input h-9 px-2 text-sm tabular-nums"
                />
                <label
                  className="inline-flex items-center gap-2 text-[0.78rem]"
                  style={{ color: "var(--adm-text)", fontFamily: "var(--font-quicksand)" }}
                >
                  <input
                    type="checkbox"
                    checked={shift.active}
                    onChange={(e) => onUpdate({ ...shift, active: e.target.checked })}
                    className="size-4 accent-[var(--adm-accent)]"
                  />
                  {shift.active ? "Aperto" : "Chiuso"}
                </label>
                <span />
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
