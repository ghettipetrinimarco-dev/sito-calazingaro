import { NextRequest, NextResponse } from "next/server"
import { parseQuickReservation } from "@/lib/quick-reservation-parser"

interface QuickParseBody {
  text?: unknown
}

export async function POST(req: NextRequest) {
  let body: QuickParseBody

  try {
    body = (await req.json()) as QuickParseBody
  } catch {
    return NextResponse.json({ error: "JSON non valido" }, { status: 400 })
  }

  if (typeof body.text !== "string") {
    return NextResponse.json({ error: "Testo mancante" }, { status: 400 })
  }

  const text = body.text.trim()
  if (text.length === 0) {
    return NextResponse.json({ error: "Testo mancante" }, { status: 400 })
  }

  if (text.length > 300) {
    return NextResponse.json({ error: "Testo troppo lungo" }, { status: 400 })
  }

  return NextResponse.json({
    ok: true,
    draft: parseQuickReservation(text),
  })
}
