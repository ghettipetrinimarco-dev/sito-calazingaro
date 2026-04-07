"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"

export default function Hero() {
  const { scrollY } = useScroll()

  // Sfasamento matematico dell'emersione degli elementi (Scroll-Driven Stagger)
  const subtitleOpacity = useTransform(scrollY, [0, 100], [0, 1])
  const subtitleY = useTransform(scrollY, [0, 100], [30, 0])
  
  const titleOpacity = useTransform(scrollY, [40, 180], [0, 1])
  const titleY = useTransform(scrollY, [40, 180], [50, 0])
  
  const buttonsOpacity = useTransform(scrollY, [80, 220], [0, 1])
  const buttonsY = useTransform(scrollY, [80, 220], [40, 0])

  return (
    <section className="relative flex flex-col overflow-hidden" style={{ minHeight: "100svh" }}>
      {/* Background: gradiente Adriatico */}
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
      <div className="relative flex-1 flex flex-col justify-end px-6 md:px-10 pt-28 pb-8 md:pb-14">
        
        <motion.p
          className="text-[0.55rem] tracking-[0.22em] uppercase mb-3"
          style={{ 
            color: "rgba(255,255,255,0.5)",
            opacity: subtitleOpacity,
            y: subtitleY
          }}
        >
          Beach Club & Ristorante · Milano Marittima
        </motion.p>

        <motion.h1
          className="italic font-light text-white leading-none mb-6"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.8rem, 10vw, 6rem)",
            opacity: titleOpacity,
            y: titleY
          }}
        >
          Il mare.<br />
          La tavola.<br />
          <span className="hidden md:inline">Milano Marittima.</span>
          <span className="md:hidden">Milano<br />Marittima.</span>
        </motion.h1>

        <motion.div
          className="flex items-center gap-4"
          style={{
            opacity: buttonsOpacity,
            y: buttonsY
          }}
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
