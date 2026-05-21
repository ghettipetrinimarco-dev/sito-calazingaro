"use client"

import { Search, X } from "lucide-react"

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchInput({ value, onChange, placeholder = "Cerca nome, note, tavolo" }: Props) {
  return (
    <label className="relative block w-full md:w-80">
      <span className="sr-only">{placeholder}</span>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
        style={{ color: "var(--adm-muted)" }}
      />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="admin-input h-11 w-full pl-10 pr-9 text-sm"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Cancella ricerca"
          className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full transition hover:bg-[var(--adm-sand)]"
          style={{ color: "var(--adm-muted)" }}
        >
          <X className="size-3.5" />
        </button>
      )}
    </label>
  )
}
