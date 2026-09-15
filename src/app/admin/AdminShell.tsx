"use client"

import { AnimatePresence, m } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"
import LoginGate from "./_components/LoginGate"
import AdminTopBar from "./_components/AdminTopBar"
import AgendaView from "./_components/AgendaView"
import ServiceView from "./_components/ServiceView"
import SettingsView from "./_components/SettingsView"
import { useReservations } from "./_state/useReservations"
import { useAdminConfig } from "./_state/useAdminConfig"
import { useGuestProfiles } from "./_state/useGuestProfiles"
import type { AdminTab, ReservationStatus } from "./_state/types"

export default function AdminShell() {
  const [authenticated, setAuthenticated] = useState(false)
  const [tab, setTab] = useState<AdminTab>("agenda")
  const reservationsHook = useReservations()
  const configHook = useAdminConfig()
  const guestsHook = useGuestProfiles()

  // Wrap updateStatus: quando passa a "arrived" incrementa visitCount del guest collegato.
  // Pattern: hook isolati ma orchestrati qui per evitare cross-dipendenze.
  const handleUpdateStatus = useCallback(
    (id: string, status: ReservationStatus) => {
      reservationsHook.updateStatus(id, status)
      if (status !== "arrived") return
      const reservation = reservationsHook.reservations.find((r) => r.id === id)
      if (!reservation?.guestProfileId) return
      // Evita doppio incremento se passa arrived→completed→arrived
      if (reservation.status === "arrived" || reservation.status === "completed") return
      guestsHook.recordVisit(reservation.guestProfileId, reservation.date)
    },
    [reservationsHook, guestsHook]
  )

  // Backfill guest profiles per prenotazioni che ancora non li hanno (es. seed iniziale).
  // Gira UNA SOLA volta dopo il primo load. Crea il guest, collega il guestProfileId,
  // incrementa visitCount per prenotazioni arrived/completed (così la CRM non è vuota).
  const backfillRef = useRef(false)
  useEffect(() => {
    if (backfillRef.current) return
    if (!reservationsHook.isLoaded || !guestsHook.isLoaded) return
    const orphans = reservationsHook.reservations.filter((r) => !r.guestProfileId)
    if (orphans.length === 0) {
      backfillRef.current = true
      return
    }
    backfillRef.current = true

    // Dedupe per nome normalizzato.
    // React state non si aggiorna tra chiamate sincrone consecutive, quindi
    // chiamare ensureFromReservation N volte con stesso nome creerebbe N profili duplicati.
    // Risolvo a monte raggruppando le orphan per nome e chiamando ensure 1 volta per gruppo.
    const groups = new Map<string, { name: string; tags: typeof orphans[number]["tags"]; reservations: typeof orphans }>()
    for (const r of orphans) {
      const key = r.name.trim().toLowerCase()
      if (!key) continue
      const existing = groups.get(key)
      if (existing) {
        existing.reservations.push(r)
        existing.tags = Array.from(new Set([...existing.tags, ...r.tags]))
      } else {
        groups.set(key, { name: r.name, tags: [...r.tags], reservations: [r] })
      }
    }

    for (const group of groups.values()) {
      const guestId = guestsHook.ensureFromReservation({
        name: group.name,
        tags: group.tags,
      })
      for (const reservation of group.reservations) {
        reservationsHook.patch(reservation.id, { guestProfileId: guestId })
        if (reservation.status === "arrived" || reservation.status === "completed") {
          guestsHook.recordVisit(guestId, reservation.date)
        }
      }
    }
  }, [reservationsHook, guestsHook])

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
                onUpdateStatus={handleUpdateStatus}
                onPatch={reservationsHook.patch}
                durationFor={configHook.durationFor}
                getTableByName={configHook.getTableByName}
                ensureGuest={guestsHook.ensureFromReservation}
                isShiftActive={configHook.isShiftActive}
                lastSeatingFor={configHook.lastSeatingFor}
                lookupGuest={guestsHook.lookup}
              />
            )}
            {tab === "service" && (
              <ServiceView
                reservations={reservationsHook.reservations}
                today={reservationsHook.today}
                isLoaded={reservationsHook.isLoaded && configHook.isLoaded}
                onUpdateStatus={handleUpdateStatus}
                onPatch={reservationsHook.patch}
                tables={configHook.config.tables}
                getTableById={configHook.getTableById}
                durationFor={configHook.durationFor}
                maxCoversFor={configHook.maxCoversFor}
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
