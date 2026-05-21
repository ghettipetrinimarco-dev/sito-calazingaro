"use client"

import { useState } from "react"
import { Cog, Clock, Layers, RotateCcw, Star, Trash2, Users } from "lucide-react"
import type {
  AdminShift,
  AdminTable,
  GuestProfile,
  TurnTimePolicy,
  VipLevel,
  ZoneKey,
} from "../_state/types"
import TablesEditor from "./settings/TablesEditor"
import ShiftsEditor from "./settings/ShiftsEditor"
import TurnTimeEditor from "./settings/TurnTimeEditor"
import GuestsEditor from "./settings/GuestsEditor"

interface AdminConfig {
  tables: AdminTable[]
  shifts: AdminShift[]
  turnTime: TurnTimePolicy
}

interface Props {
  config: AdminConfig
  guests: GuestProfile[]
  isLoaded: boolean
  upsertTable: (table: AdminTable) => void
  deleteTable: (id: string) => void
  updateShift: (shift: AdminShift) => void
  updateTurnTime: (policy: TurnTimePolicy) => void
  resetConfig: () => void
  resetReservations: () => void
  setVipLevel: (guestId: string, level: VipLevel) => void
  deleteGuest: (id: string) => void
}

type SettingsSection = "tables" | "shifts" | "turnTime" | "guests"

const SECTIONS: { value: SettingsSection; label: string; icon: typeof Layers }[] = [
  { value: "tables", label: "Tavoli", icon: Layers },
  { value: "shifts", label: "Turni", icon: Clock },
  { value: "turnTime", label: "Tempi di permanenza", icon: Cog },
  { value: "guests", label: "Clienti", icon: Users },
]

export default function SettingsView({
  config,
  guests,
  isLoaded,
  upsertTable,
  deleteTable,
  updateShift,
  updateTurnTime,
  resetConfig,
  resetReservations,
  setVipLevel,
  deleteGuest,
}: Props) {
  const [section, setSection] = useState<SettingsSection>("tables")
  const [confirmReset, setConfirmReset] = useState<"config" | "reservations" | null>(null)

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="admin-panel flex flex-col gap-4 p-5 md:flex-row md:items-end md:justify-between md:p-6">
        <div>
          <p
            className="text-[0.62rem] uppercase tracking-[0.22em]"
            style={{ color: "var(--adm-accent-deep)", fontFamily: "var(--font-quicksand)" }}
          >
            Configurazione
          </p>
          <h2
            className="mt-1.5 leading-none"
            style={{
              fontFamily: "var(--font-yanone)",
              fontSize: "2.3rem",
              fontWeight: 300,
              color: "var(--adm-text)",
              letterSpacing: "-0.01em",
            }}
          >
            Impostazioni
          </h2>
          <p
            className="mt-1 text-[0.85rem]"
            style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
          >
            Tavoli, turni, tempi di permanenza e clienti — la base operativa del gestionale
          </p>
        </div>

        <div className="flex items-center gap-2">
          {confirmReset === "reservations" ? (
            <>
              <button
                type="button"
                onClick={() => {
                  resetReservations()
                  setConfirmReset(null)
                }}
                className="h-9 rounded-full px-3 text-[0.7rem] tracking-[0.06em]"
                style={{
                  background: "var(--adm-busy)",
                  color: "white",
                  fontFamily: "var(--font-quicksand)",
                  fontWeight: 600,
                }}
              >
                Conferma reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(null)}
                className="h-9 rounded-full border bg-white px-3 text-[0.7rem]"
                style={{
                  borderColor: "var(--adm-line)",
                  color: "var(--adm-text)",
                  fontFamily: "var(--font-quicksand)",
                  fontWeight: 500,
                }}
              >
                Annulla
              </button>
            </>
          ) : confirmReset === "config" ? (
            <>
              <button
                type="button"
                onClick={() => {
                  resetConfig()
                  setConfirmReset(null)
                }}
                className="h-9 rounded-full px-3 text-[0.7rem] tracking-[0.06em]"
                style={{
                  background: "var(--adm-busy)",
                  color: "white",
                  fontFamily: "var(--font-quicksand)",
                  fontWeight: 600,
                }}
              >
                Conferma reset config
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(null)}
                className="h-9 rounded-full border bg-white px-3 text-[0.7rem]"
                style={{
                  borderColor: "var(--adm-line)",
                  color: "var(--adm-text)",
                  fontFamily: "var(--font-quicksand)",
                  fontWeight: 500,
                }}
              >
                Annulla
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setConfirmReset("reservations")}
                title="Ripristina prenotazioni demo"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border bg-white px-3 text-[0.66rem] uppercase tracking-[0.1em] transition"
                style={{
                  borderColor: "var(--adm-line)",
                  color: "var(--adm-text)",
                  fontFamily: "var(--font-quicksand)",
                  fontWeight: 500,
                }}
              >
                <RotateCcw className="size-3.5" />
                Reset prenotazioni
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset("config")}
                title="Ripristina tavoli/turni/tempi di default"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border bg-white px-3 text-[0.66rem] uppercase tracking-[0.1em] transition"
                style={{
                  borderColor: "var(--adm-line)",
                  color: "var(--adm-busy)",
                  fontFamily: "var(--font-quicksand)",
                  fontWeight: 500,
                }}
              >
                <Trash2 className="size-3.5" />
                Reset config
              </button>
            </>
          )}
        </div>
      </header>

      {/* Sezioni */}
      <nav
        className="admin-panel flex items-center gap-1 overflow-x-auto p-1.5"
        role="tablist"
        aria-label="Sezioni impostazioni"
      >
        {SECTIONS.map(({ value, label, icon: Icon }) => {
          const active = section === value
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSection(value)}
              className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full px-3.5 text-[0.74rem] transition"
              style={{
                background: active ? "var(--adm-text)" : "transparent",
                color: active ? "var(--adm-sand)" : "var(--adm-text)",
                fontFamily: "var(--font-quicksand)",
                fontWeight: active ? 600 : 500,
              }}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          )
        })}
      </nav>

      {/* Body sezione */}
      <div className="admin-panel p-5 md:p-6">
        {!isLoaded ? (
          <p
            className="text-center text-[0.85rem]"
            style={{ color: "var(--adm-muted)", fontFamily: "var(--font-quicksand)" }}
          >
            Caricamento configurazione…
          </p>
        ) : section === "tables" ? (
          <TablesEditor
            tables={config.tables}
            onUpsert={upsertTable}
            onDelete={deleteTable}
          />
        ) : section === "shifts" ? (
          <ShiftsEditor shifts={config.shifts} onUpdate={updateShift} />
        ) : section === "turnTime" ? (
          <TurnTimeEditor policy={config.turnTime} onUpdate={updateTurnTime} />
        ) : (
          <GuestsEditor
            guests={guests}
            onSetVip={setVipLevel}
            onDelete={deleteGuest}
          />
        )}
      </div>

      {/* Spazio extra per evitare overlap con icone */}
      <span hidden>
        <Star aria-hidden="true" />
      </span>
    </div>
  )
}

export type { ZoneKey }
