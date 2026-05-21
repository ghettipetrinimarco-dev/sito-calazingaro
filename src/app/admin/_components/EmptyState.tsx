import { CalendarDays } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Props {
  title: string
  description?: string
  icon?: LucideIcon
}

export default function EmptyState({ title, description, icon: Icon = CalendarDays }: Props) {
  return (
    <div
      className="flex min-h-56 items-center justify-center rounded-[6px] border border-dashed p-8 text-center"
      style={{
        borderColor: "var(--adm-line-strong)",
        background: "var(--adm-sand-2)",
      }}
    >
      <div>
        <Icon className="mx-auto size-7" style={{ color: "var(--adm-accent)" }} />
        <p
          className="mt-3 leading-none"
          style={{
            fontFamily: "var(--font-yanone)",
            fontSize: "1.4rem",
            fontWeight: 300,
            color: "var(--adm-text)",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </p>
        {description && (
          <p
            className="mt-1.5 text-[0.92rem] italic"
            style={{
              color: "var(--adm-muted)",
              fontFamily: "var(--font-cormorant), Georgia, serif",
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
