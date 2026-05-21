"use client"

import { AnimatePresence, m } from "framer-motion"
import { useState } from "react"
import LoginGate from "./_components/LoginGate"
import AdminTopBar from "./_components/AdminTopBar"
import AgendaView from "./_components/AgendaView"
import ServiceView from "./_components/ServiceView"
import SettingsView from "./_components/SettingsView"
import { useReservations } from "./_state/useReservations"
import { useAdminConfig } from "./_state/useAdminConfig"
import { useGuestProfiles } from "./_state/useGuestProfiles"
import type { AdminTab } from "./_state/types"

export default function AdminShell() {
  const [authenticated, setAuthenticated] = useState(false)
  const [tab, setTab] = useState<AdminTab>("agenda")
  const reservationsHook = useReservations()
  const configHook = useAdminConfig()
  const guestsHook = useGuestProfiles()

  if (!authenticated) {
    return (
      <main className="admin-shell">
        <LoginGate onEnter={() => setAuthenticated(true)} />
      </main>
    )
  }

  return (
    <main className="admin-shell">
      <AdminTopBar tab={tab} onChangeTab={setTab} onLogout={() => setAuthenticated(false)} />
      <div className="mx-auto max-w-[1280px] px-5 py-6 md:px-7 md:py-8">
        <AnimatePresence mode="wait">
          <m.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            {tab === "agenda" && (
              <AgendaView
                reservations={reservationsHook.reservations}
                today={reservationsHook.today}
                isLoaded={reservationsHook.isLoaded && configHook.isLoaded && guestsHook.isLoaded}
                onAdd={reservationsHook.add}
                onUpdateStatus={reservationsHook.updateStatus}
                onPatch={reservationsHook.patch}
                durationFor={configHook.durationFor}
                getTableByName={configHook.getTableByName}
                ensureGuest={guestsHook.ensureFromReservation}
              />
            )}
            {tab === "service" && (
              <ServiceView
                reservations={reservationsHook.reservations}
                today={reservationsHook.today}
                isLoaded={reservationsHook.isLoaded && configHook.isLoaded}
                onUpdateStatus={reservationsHook.updateStatus}
                onPatch={reservationsHook.patch}
                tables={configHook.config.tables}
                getTableById={configHook.getTableById}
                durationFor={configHook.durationFor}
              />
            )}
            {tab === "settings" && (
              <SettingsView
                config={configHook.config}
                guests={guestsHook.guests}
                isLoaded={configHook.isLoaded && guestsHook.isLoaded}
                upsertTable={configHook.upsertTable}
                deleteTable={configHook.deleteTable}
                updateShift={configHook.updateShift}
                updateTurnTime={configHook.updateTurnTime}
                resetConfig={configHook.resetToDefault}
                resetReservations={reservationsHook.resetToSeed}
                setVipLevel={guestsHook.setVipLevel}
                deleteGuest={guestsHook.delete}
              />
            )}
          </m.div>
        </AnimatePresence>
      </div>
    </main>
  )
}
