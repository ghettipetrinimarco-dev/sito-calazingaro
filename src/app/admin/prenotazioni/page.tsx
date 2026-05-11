import type { Metadata } from "next"
import ReservationsManager from "./ReservationsManager"

export const metadata: Metadata = {
  title: "Gestione prenotazioni",
}

export default function AdminReservationsPage() {
  return <ReservationsManager />
}
