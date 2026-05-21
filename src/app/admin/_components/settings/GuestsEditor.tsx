"use client"

import { useMemo, useState } from "react"
import { Star, Trash2 } from "lucide-react"
import type { GuestProfile, VipLevel } from "../../_state/types"
import TagPill from "../TagPill"

interface Props {
  guests: GuestProfile[]
  onSetVip: (id: string, level: VipLevel) => void
  onDelete: (id: string) => void
}

const VIP_OPTIONS: { value: VipLevel; label: string }[] = [
  { value: "none", label: "—" },
  { value: "regular", label: "Habitué" },
  { value: "vip", label: "VIP" },
]

export default function GuestsEditor({ guests, onSetVip, onDelete }: Props) {
  const [search, setSearch] = useState("")
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = q
      ? guests.filter(
          (g) =>
            g.name.toLowerCase().includes(q) ||
            g.phone?.toLowerCase().includes(q) ||
            g.email?.toLowerCase().includes(q)
        )
      : guests
    return [...list].sort((a, b) => b.visitCount - a.visitCount || a.name.localeCompare(b.name))
  }, [guests, search])

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p
            className="text-[0.62rem] uppercase tracking-[0.22em]"
            style={{ color: "var(--adm-accent-deep)", fontFamily: "var(--font-quicksand)" }}
          >
            Anagrafica clienti
          </p>
          <p
            className="mt-1 text-[1rem]"
            style={{ color: "var(--adm-text)", fontFamily: "var(--font-quicksand)" }}
          >
            {guests.length} {guests.length === 1 ? "cliente" : "clienti"} registrati — segna gli habitué
          </p>
        </div>
        <input
          type="search"
          placeholder="Cerca cliente"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-input h-9 w-56 px-3 text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <p
          className="rounded-[6px] border border-dashed p-6 text-center text-[0.9rem]"
          style={{
            borderColor: "var(--adm-line-strong)",
            color: "var(--adm-muted)",
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontStyle: "italic",
          }}
        >
          {search
            ? "Nessun cliente trovato per la ricerca."
            : "Ancora nessun cliente in anagrafica. Inserisci una prenotazione per crearne uno."}
        </p>
      ) : (
        <div className="grid gap-2">
          {filtered.map((guest) => {
            const isDeleting = confirmDelete === guest.id
            return (
              <div
                key={guest.id}
                className="grid items-center gap-3 rounded-[6px] border bg-white p-3"
                style={{
                  borderColor: isDeleting ? "rgba(138,74,58,0.55)" : "var(--adm-line)",
                  gridTemplateColumns: "minmax(0,1fr) auto auto",
                }}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="text-[1rem]"
                      style={{
                        color: "var(--adm-text)",
                        fontFamily: "var(--font-quicksand)",
                        fontWeight: 600,
                      }}
                    >
                      {guest.name}
                    </span>
                    {guest.vipLevel === "vip" && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.62rem] uppercase tracking-[0.14em]"
                        style={{
                          background: "var(--adm-accent)",
                          color: "var(--adm-ink)",
                          fontFamily: "var(--font-quicksand)",
                          fontWeight: 700,
                        }}
                      >
                        <Star className="size-3" />
                        VIP
                      </span>
                    )}
                    {guest.vipLevel === "regular" && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.62rem] uppercase tracking-[0.14em]"
                        style={{
                          background: "rgba(200,168,122,0.2)",
                          color: "var(--adm-accent-deep)",
                          fontFamily: "var(--font-quicksand)",
                          fontWeight: 600,
                        }}
                      >
                        Habitué
                      </span>
                    )}
                    <span
                      className="text-[0.66rem] uppercase tracking-[0.14em] tabular-nums"
                      style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
                    >
                      {guest.visitCount} {guest.visitCount === 1 ? "visita" : "visite"}
                      {guest.lastVisit && ` · ultima ${guest.lastVisit}`}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {guest.phone && (
                      <span
                        className="text-[0.78rem]"
                        style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
                      >
                        {guest.phone}
                      </span>
                    )}
                    {guest.email && (
                      <span
                        className="text-[0.78rem]"
                        style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
                      >
                        {guest.email}
                      </span>
                    )}
                    {guest.persistentTags.map((tag) => (
                      <TagPill key={tag} tag={tag} size="sm" />
                    ))}
                  </div>
                </div>

                <select
                  value={guest.vipLevel}
                  aria-label="Livello VIP"
                  onChange={(e) => onSetVip(guest.id, e.target.value as VipLevel)}
                  className="admin-input h-9 px-2.5 text-sm"
                >
                  {VIP_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {isDeleting ? (
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(guest.id)
                      setConfirmDelete(null)
                    }}
                    aria-label="Conferma elimina"
                    className="grid size-8 place-items-center rounded-full"
                    style={{ background: "var(--adm-busy)", color: "white" }}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(guest.id)}
                    aria-label={`Elimina ${guest.name}`}
                    className="grid size-8 place-items-center rounded-full border bg-white"
                    style={{ borderColor: "var(--adm-line)", color: "var(--adm-muted)" }}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
