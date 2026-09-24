"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { m } from "framer-motion"
import { X } from "lucide-react"

export default function PrenotaPage() {
  const router = useRouter()

  const handleClose = useCallback(() => {
    router.back()
  }, [router])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden" style={{ backgroundColor: "var(--color-sand)" }}>

      {/* X chiudi */}
      <button
        onClick={handleClose}
        aria-label="Chiudi"
        className="fixed top-5 right-5 z-50 p-2 hover:opacity-60 transition-opacity"
        style={{ color: "#111", touchAction: "manipulation" }}
      >
        <X strokeWidth={1.5} size={30} />
      </button>

      {/* Contenuto centrato */}
      <m.div
        className="flex flex-col items-center text-center px-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <div className="mb-10 md:mb-14">
          <Image
            src="/images/logo.svg"
            alt="Cala Zingaro"
            width={160}
            height={54}
            className="h-8 md:h-11 w-auto object-contain"
            style={{ filter: "none", opacity: 0.9 }}
            priority
          />
        </div>

        {/* Titolo */}
        <h1
          style={{
            fontFamily: "var(--font-yanone)",
            fontWeight: 200,
            fontSize: "clamp(3.5rem, 14vw, 8rem)",
            letterSpacing: "-0.01em",
            lineHeight: 0.95,
            color: "#111",
          }}
        >
          Presto<br />online.
        </h1>

        {/* Sottotitolo */}
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            fontFamily: "var(--font-quicksand)",
            fontSize: "0.82rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.35)",
            marginTop: "2rem",
          }}
        >
          Il sistema di prenotazione è in arrivo
        </m.p>

        {/* Contatto intanto */}
        <m.a
          href="tel:+393791203796"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="hover:opacity-60 transition-opacity"
          style={{
            fontFamily: "var(--font-yanone)",
            fontWeight: 300,
            fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
            color: "rgba(0,0,0,0.6)",
            marginTop: "2.5rem",
            letterSpacing: "0.02em",
          }}
        >
          → Chiama: +39 379 1203796
        </m.a>
      </m.div>

    </div>
  )
}
