// Prenotazione pubblica (spiaggia o ristorante)
// Usa RPC crea_prenotazione con pg_advisory_xact_lock (anti race condition)

import { NextResponse } from "next/server"

export async function POST() {
  // TODO: implementare
  return NextResponse.json({ ok: true })
}
