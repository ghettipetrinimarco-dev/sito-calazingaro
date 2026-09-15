"use client"

import { CheckCircle2, ClockArrowDown, Users, UtensilsCrossed } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Stat {
  label: string
  value: number | string
  hint?: string
  icon: LucideIcon
  tone?: "default" | "ok" | "info" | "warn"
}

interface Props {
  prenotazioniAttive: number
  copertiTotali: number
  copertiSeduti: number
  inSala: number
  daArrivare: number
  arrivatiTurno: number // arrived + completed
  maxCovers?: number // capienza totale del turno (da Shift)
}

export default function ServiceStatsBar({
  prenotazioniAttive,
  copertiTotali,
  copertiSeduti,
  inSala,
  daArrivare,
  arrivatiTurno,
  maxCovers,
}: Props) {
  // Tono "warn" se siamo oltre 85% della capienza
  const capacityRatio = maxCovers && maxCovers > 0 ? copertiTotali / maxCovers : 0
  const capacityWarn = capacityRatio >= 0.85

  const prenotazioniHint = maxCovers && maxCovers > 0
    ? `${copertiTotali}/${maxCovers} coperti · ${Math.round(capacityRatio * 100)}%`
    : `${copertiTotali} coperti totali`

  const stats: Stat[] = [
    {
      label: "Prenotazioni",
      value: prenotazioniAttive,
      hint: prenotazioniHint,
      icon: UtensilsCrossed,
      tone: capacityWarn ? "warn" : "default",
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
                  tone === "ok"
                    ? "var(--adm-ok)"
                    : tone === "info"
                    ? "var(--adm-info)"
                    : tone === "warn"
                    ? "var(--adm-busy)"
                    : "var(--adm-accent-deep)",
              }}
            />
            <p
              className="text-[0.6rem] uppercase tracking-[0.22em]"
              style={{
                color: tone === "warn" ? "var(--adm-busy)" : "var(--adm-muted)",
                fontFamily: "var(--font-quicksand)",
              }}
            >
              {label}
              {tone === "warn" && (
                <span aria-hidden="true" className="ml-1">
                  ⚠
                </span>
              )}
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
