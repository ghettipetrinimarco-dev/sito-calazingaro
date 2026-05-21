"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import type { AdminTable, ZoneKey } from "../../_state/types"

interface Props {
  tables: AdminTable[]
  onUpsert: (table: AdminTable) => void
  onDelete: (id: string) => void
}

const ZONE_OPTIONS: { value: ZoneKey; label: string }[] = [
  { value: "interno", label: "Interno" },
  { value: "esterno", label: "Esterno" },
  { value: "terrazza", label: "Terrazza" },
  { value: "veranda", label: "Veranda" },
]

function sortTables(items: AdminTable[]): AdminTable[] {
  return [...items].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
}

export default function TablesEditor({ tables, onUpsert, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const sorted = sortTables(tables)

  function handleAddNew() {
    const nextOrder = (sorted[sorted.length - 1]?.order ?? 0) + 1
    onUpsert({
      id: crypto.randomUUID(),
      name: `T${nextOrder}`,
      minSeats: 2,
      maxSeats: 4,
      zone: "interno",
      active: true,
      order: nextOrder,
    })
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p
            className="text-[0.62rem] uppercase tracking-[0.22em]"
            style={{ color: "var(--adm-accent-deep)", fontFamily: "var(--font-quicksand)" }}
          >
            Sala
          </p>
          <p
            className="mt-1 text-[1rem]"
            style={{ color: "var(--adm-text)", fontFamily: "var(--font-quicksand)" }}
          >
            {sorted.length} tavoli configurati — capienza totale{" "}
            <strong style={{ color: "var(--adm-accent-deep)" }}>
              {sorted.filter((t) => t.active).reduce((sum, t) => sum + t.maxSeats, 0)} coperti
            </strong>
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddNew}
          className="inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-[0.7rem] tracking-[0.06em]"
          style={{
            background: "var(--adm-accent)",
            color: "var(--adm-ink)",
            fontFamily: "var(--font-quicksand)",
            fontWeight: 600,
          }}
        >
          <Plus className="size-3.5" />
          Aggiungi tavolo
        </button>
      </div>

      <div className="grid gap-2">
        {/* Header */}
        <div
          className="hidden md:grid items-center gap-3 px-3 text-[0.6rem] uppercase tracking-[0.18em]"
          style={{
            gridTemplateColumns: "minmax(80px,120px) minmax(120px,160px) minmax(120px,160px) minmax(120px,160px) auto 40px",
            color: "var(--adm-muted)",
            fontFamily: "var(--font-quicksand)",
          }}
        >
          <span>Nome</span>
          <span>Coperti min</span>
          <span>Coperti max</span>
          <span>Zona</span>
          <span>Attivo</span>
          <span />
        </div>

        {sorted.map((table) => {
          const isDeleting = confirmDelete === table.id
          return (
            <div
              key={table.id}
              className="grid items-center gap-3 rounded-[6px] border bg-white p-3 md:gap-3"
              style={{
                borderColor: isDeleting ? "rgba(138,74,58,0.55)" : "var(--adm-line)",
                gridTemplateColumns:
                  "minmax(80px,120px) minmax(120px,160px) minmax(120px,160px) minmax(120px,160px) auto 40px",
              }}
            >
              <input
                type="text"
                value={table.name}
                aria-label="Nome tavolo"
                onChange={(e) => onUpsert({ ...table, name: e.target.value })}
                className="admin-input h-9 px-2.5 text-sm"
              />
              <input
                type="number"
                value={table.minSeats}
                aria-label="Coperti minimi"
                min={1}
                max={20}
                onChange={(e) => onUpsert({ ...table, minSeats: Math.max(1, Number(e.target.value)) })}
                className="admin-input h-9 px-2.5 text-sm tabular-nums"
              />
              <input
                type="number"
                value={table.maxSeats}
                aria-label="Coperti massimi"
                min={1}
                max={30}
                onChange={(e) => onUpsert({ ...table, maxSeats: Math.max(1, Number(e.target.value)) })}
                className="admin-input h-9 px-2.5 text-sm tabular-nums"
              />
              <select
                value={table.zone}
                aria-label="Zona"
                onChange={(e) => onUpsert({ ...table, zone: e.target.value as ZoneKey })}
                className="admin-input h-9 px-2.5 text-sm"
              >
                {ZONE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <label
                className="inline-flex items-center gap-2 text-[0.78rem]"
                style={{ color: "var(--adm-text)", fontFamily: "var(--font-quicksand)" }}
              >
                <input
                  type="checkbox"
                  checked={table.active}
                  onChange={(e) => onUpsert({ ...table, active: e.target.checked })}
                  className="size-4 accent-[var(--adm-accent)]"
                />
                {table.active ? "Attivo" : "Inattivo"}
              </label>
              {isDeleting ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(table.id)
                      setConfirmDelete(null)
                    }}
                    aria-label="Conferma elimina"
                    className="grid size-8 place-items-center rounded-full"
                    style={{ background: "var(--adm-busy)", color: "white" }}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(table.id)}
                  aria-label={`Elimina ${table.name}`}
                  className="grid size-8 place-items-center rounded-full border bg-white transition hover:bg-[var(--adm-sand)]"
                  style={{ borderColor: "var(--adm-line)", color: "var(--adm-muted)" }}
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
