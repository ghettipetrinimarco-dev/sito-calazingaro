"use client"

import { CheckCircle2, ClockArrowDown, Users, UtensilsCrossed } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Stat {
  label: string
  value: number | string
  hint?: string
  icon: LucideIcon
  tone?: "default" | "ok" | "info"
}

interface Props {
  prenotazioniAttive: number
  copertiTotali: number
  copertiSeduti: number
  inSala: number
  daArrivare: number
  arrivatiTurno: number // arrived + completed
}

export default function ServiceStatsBar({
  prenotazioniAttive,
  copertiTotali,
  copertiSeduti,
  inSala,
  daArrivare,
  arrivatiTurno,
}: Props) {
  const stats: Stat[] = [
    {
      label: "Prenotazioni",
      value: prenotazioniAttive,
      hint: `${copertiTotali} coperti totali`,
      icon: UtensilsCrossed,
      tone: "default",
    },
    {
      label: "In sala",
      value: inSala,
      hint: inSala > 0 ? `${copertiSeduti} coperti seduti` : "Nessun tavolo seduto",
      icon: Users,
      tone: "ok",
    },
    {
      label: "In arrivo",
      value: daArrivare,
      hint: daArrivare === 0 ? "Tutti arrivati" : "Da accogliere",
      icon: ClockArrowDown,
      tone: "info",
    },
    {
      label: "Tasso arrivi",
      value:
        prenotazioniAttive === 0
          ? "—"
          : `${Math.round((arrivatiTurno / prenotazioniAttive) * 100)}%`,
      hint: prenotazioniAttive > 0 ? `${arrivatiTurno}/${prenotazioniAttive}` : "Nessun dato",
      icon: CheckCircle2,
      tone: "default",
    },
  ]

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ label, value, hint, icon: Icon, tone = "default" }) => (
        <div
          key={label}
          className="admin-panel flex flex-col gap-2 px-4 py-3.5"
        >
          <div className="flex items-center gap-2">
            <Icon
              className="size-3.5"
              style={{
                color:
                  tone === "ok" ? "var(--adm-ok)" : tone === "info" ? "var(--adm-info)" : "var(--adm-accent-deep)",
              }}
            />
            <p
              className="text-[0.6rem] uppercase tracking-[0.22em]"
              style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
            >
              {label}
            </p>
          </div>
          <p
            className="leading-none"
            style={{
              fontFamily: "var(--font-yanone)",
              fontSize: "2.4rem",
              fontWeight: 300,
              color: "var(--adm-text)",
              letterSpacing: "-0.01em",
            }}
          >
            {value}
          </p>
          {hint && (
            <p
              className="text-[0.72rem]"
              style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
            >
              {hint}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
