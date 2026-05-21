"use client"

import type { ServiceFilter as ServiceFilterValue } from "../_state/types"

interface Props {
  value: ServiceFilterValue
  onChange: (value: ServiceFilterValue) => void
  options?: { value: ServiceFilterValue; label: string }[]
  layout?: "row" | "stack"
}

const defaultOptions: { value: ServiceFilterValue; label: string }[] = [
  { value: "all", label: "Tutto" },
  { value: "pranzo", label: "Pranzo" },
  { value: "cena", label: "Cena" },
]

export default function ServiceFilter({
  value,
  onChange,
  options = defaultOptions,
  layout = "row",
}: Props) {
  const wrapperClass =
    layout === "row" ? "grid grid-cols-3 gap-2" : "grid grid-cols-3 gap-2 lg:grid-cols-1"

  return (
    <div className={wrapperClass}>
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className="h-10 rounded-[4px] text-[0.72rem] tracking-[0.04em] transition"
            style={{
              background: active ? "var(--adm-text)" : "white",
              color: active ? "var(--adm-sand)" : "var(--adm-text)",
              border: active ? "1px solid var(--adm-text)" : "1px solid var(--adm-line)",
              fontFamily: "var(--font-quicksand)",
              fontWeight: 500,
            }}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
