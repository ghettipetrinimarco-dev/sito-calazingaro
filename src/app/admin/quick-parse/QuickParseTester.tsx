"use client"

import { useMemo, useState } from "react"
import {
  AlertCircle,
  CalendarDays,
  Check,
  Clock,
  Loader2,
  MessageSquareText,
  PencilLine,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react"
import type { QuickReservationDraft } from "@/lib/quick-reservation-parser"

const examples = [
  "Rossi 4 domani sera fuori",
  "franco domani tavolo 7 3 21",
  "Rossi domani alle 21 per 4 persone",
  "domani sera 4 fuori vista mare",
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

function formatItalianDate(value: string | null) {
  if (!value) return "Da scegliere"

  const [year, month, day] = value.split("-")
  if (!year || !month || !day) return value

  return `${day}/${month}/${year}`
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

  const confidenceTone = useMemo(() => {
    if (!draft) return "border-stone-200 bg-stone-100 text-stone-600"
    if (draft.confidence === "alta") return "border-emerald-200 bg-emerald-50 text-emerald-800"
    if (draft.confidence === "media") return "border-amber-200 bg-amber-50 text-amber-800"
    return "border-red-200 bg-red-50 text-red-800"
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
    <div className="min-h-[100dvh] bg-[#f6f4ef] px-4 py-4 text-stone-950 md:px-6 md:py-6">
      <div className="mx-auto max-w-[1380px] overflow-hidden rounded-[8px] border border-stone-200 bg-[#fbfaf7] shadow-[0_24px_80px_-48px_rgba(28,25,23,0.45)]">
        <header className="flex flex-col gap-4 border-b border-stone-200 bg-[#26231f] px-5 py-5 text-white md:flex-row md:items-center md:justify-between md:px-7">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/45">Cala Zingaro admin</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Nuova prenotazione</h1>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-white/70">Playground</span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-white/70">Non salva dati</span>
          </div>
        </header>

        <div className="grid min-h-[calc(100dvh-120px)] lg:grid-cols-[0.95fr_1.05fr]">
          <section className="border-b border-stone-200 p-5 md:p-7 lg:border-b-0 lg:border-r">
            <div className="mb-7 max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600">
                <Sparkles className="size-3.5" />
                Inserimento rapido
              </div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Scrivi come in chat.</h2>
              <p className="mt-3 max-w-[54ch] text-sm leading-6 text-stone-600">
                Il sistema prepara una bozza leggibile. Lo staff controlla e poi decide se salvarla nel gestionale.
              </p>
            </div>

            <label htmlFor="quick-reservation" className="mb-2 block text-sm font-semibold text-stone-800">
              Messaggio ricevuto
            </label>
          <textarea
            id="quick-reservation"
            value={text}
            onChange={(event) => setText(event.target.value)}
              className="min-h-36 w-full resize-none rounded-[8px] border border-stone-200 bg-white p-4 text-lg leading-relaxed text-stone-950 outline-none transition focus:border-stone-500 focus:ring-4 focus:ring-stone-950/5"
            placeholder="Rossi 4 domani sera fuori"
          />

          <button
            type="button"
            onClick={() => void handleParse()}
            disabled={isLoading}
              className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-[#26231f] px-5 text-sm font-semibold text-white transition hover:bg-[#37322d] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <PencilLine className="size-4" />}
              Prepara bozza
          </button>

            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Esempi rapidi</p>
              <div className="grid gap-2">
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => void handleParse(example)}
                    className="group flex items-center gap-3 rounded-[8px] border border-stone-200 bg-white px-3 py-3 text-left text-sm text-stone-700 transition hover:border-stone-400 hover:bg-stone-50 active:translate-y-px"
              >
                    <MessageSquareText className="size-4 shrink-0 text-stone-400 transition group-hover:text-stone-700" />
                    <span>{example}</span>
              </button>
            ))}
              </div>
            </div>
          </section>

          <section className="bg-white p-5 md:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-stone-400">Anteprima</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Prenotazione pronta</h2>
              </div>
              <span className={`rounded-full border px-3 py-1.5 text-xs font-medium ${confidenceTone}`}>
                {draft ? `Confidenza ${confidenceLabel}` : "In attesa"}
              </span>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-[8px] border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                {error}
              </div>
            )}

            {!draft && !error && (
              <div className="flex min-h-96 items-center justify-center rounded-[8px] border border-dashed border-stone-200 bg-stone-50/80 p-8 text-center">
                <div className="max-w-sm">
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-white text-stone-400 shadow-sm">
                    <PencilLine className="size-5" />
                  </div>
                  <p className="text-sm font-medium text-stone-700">Nessuna bozza generata</p>
                  <p className="mt-1 text-sm leading-6 text-stone-500">
                    Scrivi un messaggio o scegli un esempio per vedere la prenotazione compilata.
                  </p>
                </div>
              </div>
            )}

            {draft && (
              <div className="grid gap-4">
                <div className="rounded-[8px] border border-stone-200 bg-[#fbfaf7] p-4 md:p-5">
                  <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">Cliente</p>
                      <p className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">{draft.nome ?? "Da inserire"}</p>
                    </div>
                    <div className="flex min-w-20 items-center justify-center gap-2 rounded-[8px] bg-[#26231f] px-3 py-2 text-sm font-semibold text-white">
                      <Users className="size-4" />
                      {draft.coperti ?? "-"}
                    </div>
                  </div>

                  <div className="grid divide-y divide-stone-200 md:grid-cols-3 md:divide-x md:divide-y-0">
                    <div className="py-4 md:px-4 md:pl-0">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                        <CalendarDays className="size-4" />
                        Data
                      </div>
                      <p className="mt-2 text-lg font-semibold">{formatItalianDate(draft.data)}</p>
                    </div>
                    <div className="py-4 md:px-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                        <UserRound className="size-4" />
                        Servizio
                      </div>
                      <p className="mt-2 text-lg font-semibold">{formatFascia(draft.fascia)}</p>
                    </div>
                    <div className="py-4 md:pl-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                        <Clock className="size-4" />
                        Orario
                      </div>
                      <p className="mt-2 text-lg font-semibold">{draft.orario ?? "Non preciso"}</p>
                    </div>
                  </div>

                  <div className="rounded-[8px] border border-stone-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">Note</p>
                    <p className="mt-2 min-h-6 text-sm leading-6 text-stone-700">{draft.note ?? "Nessuna nota"}</p>
                  </div>
                </div>

                {draft.missingFields.length > 0 ? (
                  <div className="rounded-[8px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    Mancano: {draft.missingFields.map(formatMissingField).join(", ")}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-[8px] border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-900">
                    <Check className="size-4" />
                    Bozza completa. Prossimo step: trasformarla in salvataggio reale.
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
