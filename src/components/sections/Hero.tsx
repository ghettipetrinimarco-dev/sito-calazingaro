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

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Contenuto — appare al primo scroll */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 pb-10 md:pb-16">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="text-white leading-none mb-6 md:mb-8"
          style={{
            fontFamily: "var(--font-yanone)",
            fontWeight: 300,
            fontSize: "clamp(3rem, 11vw, 8rem)",
            letterSpacing: "-0.01em",
          }}
        >
          The place<br />not to be sad.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.9, ease: EASE, delay: visible ? 0.15 : 0 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5"
        >
          <p
            className="text-[0.6rem] tracking-[0.22em] uppercase"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Beach Club & Ristorante · Milano Marittima
          </p>

          <div className="flex items-center gap-5">
            <TransitionLink
              href="#prenota"
              className="text-[0.62rem] tracking-widest uppercase bg-white px-5 py-3 transition-opacity hover:opacity-85"
              style={{ color: "var(--color-ink)" }}
            >
              Prenota ora
            </TransitionLink>
            <a
              href="#scopri"
              className="text-[0.6rem] tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              ↓ scopri
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
