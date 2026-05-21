import type { Metadata } from "next"
import AdminShell from "./AdminShell"

export const metadata: Metadata = {
  title: "Gestionale · Cala Zingaro",
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return <AdminShell />
}
