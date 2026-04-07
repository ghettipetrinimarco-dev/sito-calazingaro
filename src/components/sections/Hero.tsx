"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative flex flex-col overflow-hidden" style={{ height: "100svh", minHeight: "600px" }}>
      {/* Background: gradiente Adriatico (rimpiazzato da video drone in produzione) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(175deg, #2d5a7a 0%, #3a8fa8 18%, #4ba3bc 30%, #5bbcd4 45%, #7acfdf 58%, #b8d9c8 68%, #d4c5a0 78%, #c8b892 88%, #a89060 100%)",
        }}
      />

      {/* Overlay per leggibilità testo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.04) 40%, rgba(0,0,0,0.12) 60%, rgba(0,0,0,0.68) 100%)",
        }}
      />

      {/* Contenuto — posizionato in basso */}
      <div className="relative flex-1 flex flex-col justify-end px-6 md:px-10 pb-10 md:pb-14">
        <motion.p
          className="text-[0.55rem] tracking-[0.22em] uppercase mb-3"
          style={{ color: "rgba(255,255,255,0.5)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Beach Club & Ristorante · Milano Marittima
        </motion.p>

        <motion.h1
          className="italic font-light text-white leading-none mb-6"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.8rem, 10vw, 6rem)",
          }}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          Il mare.<br />
          La tavola.<br />
          <span className="hidden md:inline">Milano Marittima.</span>
          <span className="md:hidden">Milano<br />Marittima.</span>
        </motion.h1>

        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <Link
            href="#prenota"
            className="text-[0.62rem] tracking-widest uppercase bg-white px-5 py-3 rounded-sm transition-opacity hover:opacity-85"
            style={{ color: "var(--color-ink)" }}
          >
            Prenota ora
          </Link>
          <span
            className="text-[0.55rem] tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            ↓ scopri
          </span>
        </motion.div>
      </div>
    </section>
  )
}
