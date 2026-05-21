"use client"

import Image from "next/image"
import { LogOut } from "lucide-react"
import type { AdminTab } from "../_state/types"

interface Props {
  tab: AdminTab
  onChangeTab: (tab: AdminTab) => void
  onLogout: () => void
}

const tabs: { value: AdminTab; label: string }[] = [
  { value: "agenda", label: "Agenda" },
  { value: "service", label: "Servizio" },
  { value: "settings", label: "Impostazioni" },
]

export default function AdminTopBar({ tab, onChangeTab, onLogout }: Props) {
  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur"
      style={{
        background: "rgba(20,17,13,0.82)",
        borderColor: "rgba(200,168,122,0.18)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-3 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-[104px]">
            <Image
              src="/images/logo.svg"
              alt="Cala Zingaro"
              fill
              sizes="104px"
              className="object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
        </div>

        <nav className="ml-auto flex items-center gap-1 rounded-[6px] p-1" style={{ background: "rgba(255,255,255,0.05)" }}>
          {tabs.map((item) => {
            const active = item.value === tab
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onChangeTab(item.value)}
                className="h-8 rounded-[5px] px-3 text-[0.72rem] tracking-[0.02em] transition md:px-4"
                style={{
                  background: active ? "var(--adm-accent)" : "transparent",
                  color: active ? "var(--adm-ink)" : "rgba(244,242,237,0.7)",
                  fontFamily: "var(--font-quicksand)",
                  fontWeight: active ? 600 : 500,
                }}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="flex items-center">
          <button
            type="button"
            onClick={onLogout}
            aria-label="Esci"
            className="inline-flex h-8 items-center gap-1.5 rounded-[5px] border px-2.5 text-[0.66rem] uppercase tracking-[0.08em] transition"
            style={{
              borderColor: "rgba(244,242,237,0.18)",
              color: "rgba(244,242,237,0.78)",
              fontFamily: "var(--font-quicksand)",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.borderColor = "rgba(244,242,237,0.4)"
              event.currentTarget.style.color = "var(--adm-sand)"
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.borderColor = "rgba(244,242,237,0.18)"
              event.currentTarget.style.color = "rgba(244,242,237,0.78)"
            }}
          >
            <LogOut className="size-3.5" />
            Esci
          </button>
        </div>
      </div>
    </header>
  )
}
