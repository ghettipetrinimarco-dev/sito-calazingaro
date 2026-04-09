"use client"

import Link from "next/link"
import { m } from "framer-motion"

export default function PrenotaSection() {
  return (
    <section
      id="prenota"
      className="py-24 md:py-32 px-6 md:px-10 text-center"
      style={{ backgroundColor: "var(--color-ink)" }}
    >
      <m.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          className="text-[0.58rem] tracking-[0.22em] uppercase mb-4"
          style={{ color: "rgba(244,242,237,0.3)" }}
        >
          Scegli la tua esperienza
        </p>
        <h2
          className="font-light uppercase tracking-wide text-white leading-none mb-4"
          style={{
            fontFamily: "var(--font-yanone)",
            fontSize: "clamp(2.5rem, 8vw, 5rem)",
          }}
        >
          Prenota<br />il tuo posto.
        </h2>
        <p
          className="text-sm mb-10"
          style={{ color: "rgba(244,242,237,0.4)" }}
        >
          Ristorante o spiaggia — ogni weekend a Milano Marittima.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto sm:max-w-none">
          <Link
            href="/ristorante#prenota"
            className="text-[0.68rem] tracking-widest uppercase px-8 py-4 rounded-sm transition-opacity hover:opacity-80"
            style={{ backgroundColor: "var(--color-sand)", color: "var(--color-ink)" }}
          >
            Tavolo al ristorante
          </Link>
          <Link
            href="/spiaggia#prenota"
            className="text-[0.68rem] tracking-widest uppercase px-8 py-4 rounded-sm border transition-opacity hover:opacity-80"
            style={{
              borderColor: "rgba(244,242,237,0.2)",
              color: "rgba(244,242,237,0.75)",
            }}
          >
            Ombrellone in spiaggia
          </Link>
        </div>

        <p className="mt-8 text-xs" style={{ color: "rgba(244,242,237,0.25)" }}>
          Oppure scrivici su{" "}
          <a
            href="https://wa.me/393791203796"
            className="underline hover:text-white/50 transition-colors"
          >
            WhatsApp
          </a>
        </p>
      </m.div>
    </section>
  )
}
