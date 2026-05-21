"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Mic, MicOff } from "lucide-react"

// Tipi minimi per Web Speech API (TypeScript non li include nativamente)
interface SpeechRecognitionResult {
  isFinal: boolean
  [index: number]: { transcript: string }
}
interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: { length: number; [index: number]: SpeechRecognitionResult }
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: Event) => void) | null
  onend: (() => void) | null
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

function getRecognitionCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null
  const ctor =
    (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition ??
    (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition
  return ctor ?? null
}

interface Props {
  onTranscript: (transcript: string) => void
  className?: string
}

export default function VoiceInput({ onTranscript, className }: Props) {
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  useEffect(() => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) return
    setSupported(true)
  }, [])

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {
        // già fermato
      }
    }
    setListening(false)
  }, [])

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) return
    const recognition = new Ctor()
    recognition.lang = "it-IT"
    recognition.continuous = false
    recognition.interimResults = true

    let finalTranscript = ""

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript = result[0].transcript
        if (result.isFinal) finalTranscript += transcript
        else interim += transcript
      }
      const composed = (finalTranscript + interim).trim()
      if (composed) onTranscript(composed)
    }

    recognition.onerror = () => {
      setListening(false)
    }

    recognition.onend = () => {
      setListening(false)
      recognitionRef.current = null
    }

    recognitionRef.current = recognition
    setListening(true)
    try {
      recognition.start()
    } catch {
      setListening(false)
    }
  }, [onTranscript])

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  if (!supported) {
    return (
      <button
        type="button"
        disabled
        title="Il tuo browser non supporta la dettatura vocale (usa Chrome o Safari)"
        aria-label="Dettatura non supportata"
        className={`grid size-10 place-items-center rounded-full border opacity-40 ${className ?? ""}`}
        style={{ borderColor: "var(--adm-line)", color: "var(--adm-muted)" }}
      >
        <MicOff className="size-4" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={listening ? stop : start}
      aria-label={listening ? "Ferma dettatura" : "Avvia dettatura vocale"}
      aria-pressed={listening}
      className={`relative grid size-10 place-items-center rounded-full border transition ${className ?? ""}`}
      style={{
        borderColor: listening ? "var(--adm-busy)" : "var(--adm-line)",
        background: listening ? "var(--adm-busy)" : "white",
        color: listening ? "white" : "var(--adm-text)",
      }}
    >
      <Mic className="size-4" />
      {listening && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{
            border: "2px solid var(--adm-busy)",
            animation: "voice-pulse 1.4s ease-out infinite",
          }}
        />
      )}
      <style jsx>{`
        @keyframes voice-pulse {
          0% { transform: scale(1); opacity: 0.7; }
          80% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </button>
  )
}
