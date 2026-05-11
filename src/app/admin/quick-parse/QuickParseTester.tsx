"use client"

import { useMemo, useState } from "react"
import { AlertCircle, Check, Clock, Loader2, PencilLine, Users } from "lucide-react"
import type { QuickReservationDraft } from "@/lib/quick-reservation-parser"

const examples = [
  "Rossi 4 domani sera fuori",
  "Bianchi 2 sabato 20:30 anniversario",
  "Verdi domani pranzo",
  "Neri 3 oggi 13:00",
]

interface QuickParseResponse {
  ok: boolean
  draft?: QuickReservationDraft
  error?: string
}

function formatFascia(value: QuickReservationDraft["fascia"]) {
  if (value === "pranzo") return "Pranzo"
  if (value === "cena") return "Cena"
  return "Da scegliere"
}

function formatMissingField(value: string) {
  const labels: Record<string, string> = {
    nome: "nome",
    data: "data",
    fascia: "pranzo/cena",
    coperti: "coperti",
  }

  return labels[value] ?? value
}

export default function QuickParseTester() {
  const [text, setText] = useState(examples[0])
  const [draft, setDraft] = useState<QuickReservationDraft | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const confidenceLabel = useMemo(() => {
    if (!draft) return null
    if (draft.confidence === "alta") return "Alta"
    if (draft.confidence === "media") return "Media"
    return "Bassa"
  }, [draft])

  async function handleParse(value = text) {
    const nextText = value.trim()
    if (!nextText) return

    setText(nextText)
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/prenotazioni/quick-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: nextText }),
      })
      const result = (await response.json()) as QuickParseResponse

      if (!response.ok || !result.ok || !result.draft) {
        setDraft(null)
        setError(result.error ?? "Errore interpretazione")
        return
      }

      setDraft(result.draft)
    } catch {
      setDraft(null)
      setError("Server non raggiungibile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 pb-10 pt-32 md:px-8 md:pt-36" style={{ backgroundColor: "var(--color-sand)" }}>
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded border border-black/10 bg-white/45 p-5 md:p-6">
          <p className="mb-3 text-[0.7rem] uppercase tracking-[0.22em]" style={{ color: "var(--color-muted)" }}>
            Inserimento rapido
          </p>
          <h1 className="title-display mb-5 text-5xl md:text-7xl">Test prenotazioni</h1>

          <label htmlFor="quick-reservation" className="mb-2 block text-sm font-medium">
            Frase ricevuta
          </label>
          <textarea
            id="quick-reservation"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="min-h-32 w-full resize-none rounded border border-black/15 bg-white p-4 text-base outline-none transition focus:border-black"
            placeholder="Rossi 4 domani sera fuori"
          />

          <button
            type="button"
            onClick={() => void handleParse()}
            disabled={isLoading}
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded bg-black px-5 text-sm font-medium text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <PencilLine className="size-4" />}
            Interpreta frase
          </button>

          <div className="mt-6 grid gap-2">
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => void handleParse(example)}
                className="rounded border border-black/10 bg-white/60 px-3 py-2 text-left text-sm transition hover:border-black/30 hover:bg-white"
              >
                {example}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded border border-black/10 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.22em]" style={{ color: "var(--color-muted)" }}>
                Bozza generata
              </p>
              <h2 className="mt-1 text-2xl font-medium">Card modificabile</h2>
            </div>
            {draft && (
              <span className="rounded-full border border-black/10 px-3 py-1 text-xs">
                Confidenza {confidenceLabel}
              </span>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-3 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {error}
            </div>
          )}

          {!draft && !error && (
            <div className="rounded border border-dashed border-black/15 p-8 text-center text-sm" style={{ color: "var(--color-muted)" }}>
              Premi il bottone per vedere la bozza.
            </div>
          )}

          {draft && (
            <div className="grid gap-4">
              <div className="rounded border border-black/10 bg-sand-light p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                      Nome
                    </p>
                    <p className="mt-1 text-3xl font-medium">{draft.nome ?? "Da inserire"}</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm">
                    <Users className="size-4" />
                    {draft.coperti ?? "-"}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded bg-white p-3">
                    <p className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--color-muted)" }}>
                      Data
                    </p>
                    <p className="mt-1 font-medium">{draft.data ?? "Da scegliere"}</p>
                  </div>
                  <div className="rounded bg-white p-3">
                    <p className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--color-muted)" }}>
                      Fascia
                    </p>
                    <p className="mt-1 font-medium">{formatFascia(draft.fascia)}</p>
                  </div>
                  <div className="rounded bg-white p-3">
                    <p className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--color-muted)" }}>
                      Orario
                    </p>
                    <p className="mt-1 flex items-center gap-2 font-medium">
                      <Clock className="size-4" />
                      {draft.orario ?? "Non preciso"}
                    </p>
                  </div>
                </div>

                {draft.note && (
                  <div className="mt-3 rounded bg-white p-3">
                    <p className="text-xs uppercase tracking-[0.15em]" style={{ color: "var(--color-muted)" }}>
                      Note
                    </p>
                    <p className="mt-1">{draft.note}</p>
                  </div>
                )}
              </div>

              {draft.missingFields.length > 0 ? (
                <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  Mancano: {draft.missingFields.map(formatMissingField).join(", ")}
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                  <Check className="size-4" />
                  Bozza completa, pronta per il salvataggio.
                </div>
              )}

              <pre className="max-h-72 overflow-auto rounded bg-black p-4 text-xs text-white">
                {JSON.stringify(draft, null, 2)}
              </pre>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
