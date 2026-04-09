"use client"

import { useState, useEffect } from "react"
import { motion, useScroll } from "framer-motion"
import TransitionLink from "@/components/transitions/TransitionLink"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function Hero() {
  const [visible, setVisible] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    return scrollY.on("change", (v) => {
      if (v > 10) setVisible(true)
      else if (v < 5) setVisible(false)
    })
  }, [scrollY])

  return (
    <section className="relative overflow-hidden" style={{ height: "100svh" }}>

      {/* Video fullscreen */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center center" }}
      >
        <source src="/Video/Cala-Zingaro-Landing-Page-Video2.mp4" type="video/mp4" />
      </video>

      {/* Overlay base — basso per il testo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Vignettatura in alto — per il logo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 18%, rgba(0,0,0,0) 35%)",
        }}
      />

      {/* Contenuto — appare al primo scroll */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 pb-16 md:pb-24">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="text-white leading-none mb-10 md:mb-12"
          style={{
            fontFamily: "var(--font-yanone)",
            fontWeight: 300,
            fontSize: "clamp(3rem, 9vw, 7rem)",
            letterSpacing: "-0.01em",
          }}
        >
          The place<br />not to be sad.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.9, ease: EASE, delay: visible ? 0.15 : 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"
        >
          <p
            className="text-xs tracking-[0.22em] uppercase"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Beach Club & Ristorante · Milano Marittima
          </p>

          <TransitionLink
            href="#prenota"
            className="group relative inline-flex items-center justify-center px-10 py-4"
          >
            {/* Ovale organico SVG — si illumina all'hover */}
            <svg
              className="absolute inset-0 w-full h-full overflow-visible transition-opacity duration-500 opacity-60 group-hover:opacity-100"
              viewBox="0 0 148 42"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 10,23 C 9,11 28,3 58,2 C 80,1 100,2 120,6 C 138,10 146,16 144,24 C 142,34 126,40 94,41 C 62,42 28,41 14,35 C 5,31 7,30 10,23 Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span
              className="relative text-xs tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.92)" }}
            >
              Prenota ora
            </span>
          </TransitionLink>
        </motion.div>

      </div>
    </section>
  )
}
