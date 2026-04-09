"use client"

import { useEffect, useRef } from "react"
import { m } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import { usePageTransition } from "@/contexts/TransitionContext"

const LEAF_PATH =
  "M523,982 C523,982,593,812,714,635 C835,458,893,296,846,183 L778,197 L818,126 C818,126,711,28,510,76 C309,124,196,236,196,236 L247,262 L183,310 C183,310,210,432,267,522 L315,502 L266,610 C266,610,344,763,428,874 C512,985,523,982,523,982 Z"

// Easing cinematico identico per entrata e uscita
const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]

// La foglia occupa ~66% larghezza e ~96% altezza del viewBox 1000×1000.
// Base SVG: 90vmin. A scale 10 → foglia larga 0.66 × 90vmin × 10 = 594vmin >> viewport.
// Garantisce copertura totale su mobile, laptop e 4K.
const SVG_SIZE = "90vmin"
const SCALE_PEAK = 10
const SCALE_SMALL = 0.14 // visibile ma piccola al bordo

// x di partenza: foglia centrata a -42vw → sul bordo sinistro a qualsiasi larghezza
const X_START = "-42vw"
const X_END = "42vw"

export default function LeafOverlay() {
  const router = useRouter()
  const pathname = usePathname()
  const { state, onCoveringComplete, onRevealComplete, setPhase } = usePageTransition()
  const { phase, targetHref } = state

  const prevPathname = useRef(pathname)
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname
      if (phase === "waiting") {
        setPhase("revealing")
      }
    }
  }, [pathname, phase, setPhase])

  const handleCoveringComplete = () => {
    if (phase !== "covering") return
    router.push(targetHref)
    onCoveringComplete()
  }

  const handleRevealComplete = () => {
    if (phase !== "revealing") return
    onRevealComplete()
  }

  if (phase === "idle") return null

  const isCovering = phase === "covering" || phase === "waiting"

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ pointerEvents: "auto" }}
    >
      <m.div
        style={{ willChange: "transform" }}
        // Parte piccola dal bordo sinistro, inclinata
        initial={{ x: X_START, scale: SCALE_SMALL, rotate: -40 }}
        animate={
          isCovering
            ? // Centro: massima scala, copre tutto lo schermo, leggera inclinazione
              { x: "0vw", scale: SCALE_PEAK, rotate: -8 }
            : // Esce a destra, torna piccola, inclinazione opposta
              { x: X_END, scale: SCALE_SMALL, rotate: 35 }
        }
        transition={{
          duration: isCovering ? 0.38 : 0.33,
          ease: EASE,
        }}
        onAnimationComplete={
          phase === "covering"
            ? handleCoveringComplete
            : phase === "revealing"
            ? handleRevealComplete
            : undefined
        }
      >
        <svg
          viewBox="0 0 1000 1000"
          style={{ width: SVG_SIZE, height: SVG_SIZE, display: "block" }}
          aria-hidden="true"
        >
          <path d={LEAF_PATH} fill="#1A1A1A" />
        </svg>
      </m.div>
    </div>
  )
}
