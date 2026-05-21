import type { ReservationTag } from "@/lib/quick-reservation-parser"
import { Cake, Heart, Leaf, Baby, Wheat, Trees, Home, Sun, Sparkles } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Style {
  label: string
  icon: LucideIcon
  bg: string
  fg: string
  borderColor?: string
}

const TAG_STYLES: Record<ReservationTag, Style> = {
  anniversario: {
    label: "Anniversario",
    icon: Heart,
    bg: "rgba(200,168,122,0.18)",
    fg: "var(--adm-accent-deep)",
  },
  compleanno: {
    label: "Compleanno",
    icon: Cake,
    bg: "rgba(200,168,122,0.18)",
    fg: "var(--adm-accent-deep)",
  },
  allergia: {
    label: "Allergia",
    icon: Sparkles,
    bg: "rgba(138,74,58,0.14)",
    fg: "var(--adm-busy)",
  },
  celiaco: {
    label: "Celiaco",
    icon: Wheat,
    bg: "rgba(138,74,58,0.14)",
    fg: "var(--adm-busy)",
  },
  vegano: {
    label: "Vegano",
    icon: Leaf,
    bg: "rgba(91,122,74,0.16)",
    fg: "var(--adm-ok)",
  },
  vegetariano: {
    label: "Vegetariano",
    icon: Leaf,
    bg: "rgba(91,122,74,0.16)",
    fg: "var(--adm-ok)",
  },
  bambini: {
    label: "Bambini",
    icon: Baby,
    bg: "rgba(72,111,122,0.16)",
    fg: "var(--adm-info)",
  },
  passeggino: {
    label: "Passeggino",
    icon: Baby,
    bg: "rgba(72,111,122,0.16)",
    fg: "var(--adm-info)",
  },
  seggiolone: {
    label: "Seggiolone",
    icon: Baby,
    bg: "rgba(72,111,122,0.16)",
    fg: "var(--adm-info)",
  },
  esterno: {
    label: "Esterno",
    icon: Sun,
    bg: "rgba(91,122,74,0.14)",
    fg: "var(--adm-ok)",
  },
  "vista-mare": {
    label: "Vista mare",
    icon: Sun,
    bg: "rgba(91,122,74,0.14)",
    fg: "var(--adm-ok)",
  },
  terrazza: {
    label: "Terrazza",
    icon: Trees,
    bg: "rgba(91,122,74,0.14)",
    fg: "var(--adm-ok)",
  },
  veranda: {
    label: "Veranda",
    icon: Trees,
    bg: "rgba(91,122,74,0.14)",
    fg: "var(--adm-ok)",
  },
  interno: {
    label: "Interno",
    icon: Home,
    bg: "rgba(38,35,31,0.06)",
    fg: "var(--adm-muted)",
  },
}

interface Props {
  tag: ReservationTag
  size?: "sm" | "md"
}

export default function TagPill({ tag, size = "sm" }: Props) {
  const style = TAG_STYLES[tag]
  if (!style) return null
  const { label, icon: Icon, bg, fg } = style
  const isSm = size === "sm"
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full ${
        isSm ? "gap-1 px-2 py-0.5 text-[0.62rem]" : "gap-1.5 px-2.5 py-1 text-[0.7rem]"
      }`}
      style={{
        background: bg,
        color: fg,
        fontFamily: "var(--font-quicksand)",
        fontWeight: 600,
        letterSpacing: "0.04em",
      }}
    >
      <Icon className={isSm ? "size-3" : "size-3.5"} />
      {label}
    </span>
  )
}

export { TAG_STYLES }
