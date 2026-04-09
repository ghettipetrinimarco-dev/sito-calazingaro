"use client"

import { useEffect } from "react"
import { m, useMotionValue, useTransform } from "framer-motion"

export default function Hero() {
  const scrollY = useMotionValue(0)

  useEffect(() => {
    const onScroll = () => scrollY.set(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [scrollY])

  // Appare: 0→60px
  // Resta visibile fino al 70% dell'altezza hero
  // Esce (sinistra + fade) nell'ultimo 30% prima che la sezione esca dal frame
  const opacity = useTransform(scrollY, (y) => {
    if (typeof window === "undefined") return 0
    if (y < 60) return y / 60
    const vh = window.innerHeight
    const exitStart = vh * 0.5
    const exitEnd = vh * 0.8
    if (y < exitStart) return 1
    return Math.max(1 - (y - exitStart) / (exitEnd - exitStart), 0)
  })

  const x = useTransform(scrollY, (y) => {
    if (typeof window === "undefined") return 0
    const vh = window.innerHeight
    const exitStart = vh * 0.5
    const exitEnd = vh * 0.8
    if (y < exitStart) return 0
    const progress = Math.min((y - exitStart) / (exitEnd - exitStart), 1)
    return progress * -200
  })

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

      {/* Tagline */}
      <div className="absolute inset-0 flex flex-col justify-end items-center px-6 md:px-12 pb-16 md:pb-24">
        <m.h1
          style={{
            opacity,
            x,
            fontFamily: "var(--font-yanone)",
            fontWeight: 300,
            fontSize: "clamp(2.2rem, 7vw, 5.5rem)",
            letterSpacing: "-0.01em",
          }}
          className="text-white leading-none text-center"
        >
          THE PLACE NOT TO BE SAD.
        </m.h1>
      </div>

    </section>
  )
}
