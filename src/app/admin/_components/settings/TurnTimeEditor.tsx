"use client"

import type { TurnTimePolicy } from "../../_state/types"

interface Props {
  policy: TurnTimePolicy
  onUpdate: (policy: TurnTimePolicy) => void
}

const PARTY_SIZES = [1, 2, 3, 4, 5, 6, 7, 8]

export default function TurnTimeEditor({ policy, onUpdate }: Props) {
  function updateMinutes(partySize: number, minutes: number) {
    const safe = Math.max(15, Math.min(minutes, 360))
    onUpdate({
      ...policy,
      byPartySize: { ...policy.byPartySize, [partySize]: safe },
    })
  }

  return (
    <div>
      <div className="mb-4">
        <p
          className="text-[0.62rem] uppercase tracking-[0.22em]"
          style={{ color: "var(--adm-accent-deep)", fontFamily: "var(--font-quicksand)" }}
        >
          Permanenza media
        </p>
        <p
          className="mt-1 text-[1rem]"
          style={{ color: "var(--adm-text)", fontFamily: "var(--font-quicksand)" }}
        >
          Quanto resta un tavolo in base al numero di coperti. Usato per calcolare l'orario di fine
          prenotazione e disegnare la timeline servizio.
        </p>
      </div>

      <div
        className="grid gap-2 md:grid-cols-4"
      >
        {PARTY_SIZES.map((size) => {
          const current = policy.byPartySize[size] ?? policy.defaultDuration
          return (
            <label
              key={size}
              className="flex flex-col gap-1.5 rounded-[6px] border bg-white p-3"
              style={{ borderColor: "var(--adm-line)" }}
            >
              <span
                className="text-[0.6rem] uppercase tracking-[0.22em]"
                style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
              >
                {size}
                {size === 8 ? "+" : ""} coperti
              </span>
              <div className="flex items-baseline gap-2">
                <input
                  type="number"
                  value={current}
                  min={15}
                  max={360}
                  step={5}
                  onChange={(e) => updateMinutes(size, Number(e.target.value))}
                  className="admin-input h-10 w-20 px-2.5 text-base tabular-nums"
                />
                <span
                  className="text-[0.78rem]"
                  style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
                >
                  min
                </span>
                <span
                  className="ml-auto text-[0.72rem] tabular-nums"
                  style={{ color: "var(--adm-accent-deep)", fontFamily: "var(--font-quicksand)" }}
                >
                  ≈ {Math.floor(current / 60)}h {current % 60}m
                </span>
              </div>
            </label>
          )
        })}
      </div>

      <div
        className="mt-4 rounded-[6px] border p-3"
        style={{ borderColor: "var(--adm-line)", background: "rgba(200,168,122,0.08)" }}
      >
        <p
          className="text-[0.78rem]"
          style={{ color: "var(--adm-text)", fontFamily: "var(--font-quicksand)" }}
        >
          <strong style={{ color: "var(--adm-accent-deep)" }}>Suggerimento:</strong> il pattern usato
          dai gestionali professionali (Resy, SevenRooms, OpenTable) è{" "}
          <strong>1-2 coperti = 75-90 min</strong>, <strong>3-4 = 90-105 min</strong>,{" "}
          <strong>5-6 = 105-120 min</strong>, <strong>7+ = 120-150 min</strong>. Aggiusta in base alla tua
          esperienza di sala.
        </p>
      </div>
    </div>
  )
}
