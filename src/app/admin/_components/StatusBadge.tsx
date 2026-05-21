import type { ReservationStatus } from "../_state/types"

interface Props {
  status: ReservationStatus
}

const labels: Record<ReservationStatus, string> = {
  confirmed: "Prenotata",
  arrived: "In sala",
  completed: "Chiusa",
  cancelled: "Annullata",
}

const palette: Record<ReservationStatus, { bg: string; fg: string }> = {
  confirmed: { bg: "rgba(72,111,122,0.16)", fg: "var(--adm-info)" },
  arrived: { bg: "rgba(91,122,74,0.18)", fg: "var(--adm-ok)" },
  completed: { bg: "rgba(38,35,31,0.08)", fg: "var(--adm-muted)" },
  cancelled: { bg: "rgba(138,74,58,0.16)", fg: "var(--adm-busy)" },
}

export default function StatusBadge({ status }: Props) {
  const { bg, fg } = palette[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.14em]"
      style={{
        background: bg,
        color: fg,
        fontFamily: "var(--font-quicksand)",
        fontWeight: 600,
      }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ background: "currentColor" }}
      />
      {labels[status]}
    </span>
  )
}
