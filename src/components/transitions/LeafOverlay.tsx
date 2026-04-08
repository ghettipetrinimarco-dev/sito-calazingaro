"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import { usePageTransition } from "@/contexts/TransitionContext"

const LEAF_PATH =
  "M523,982 C523,982,593,812,714,635 C835,458,893,296,846,183 L778,197 L818,126 C818,126,711,28,510,76 C309,124,196,236,196,236 L247,262 L183,310 C183,310,210,432,267,522 L315,502 L266,610 C266,610,344,763,428,874 C512,985,523,982,523,982 Z"

// Easing ease-in per entrata (parte lento, arriva veloce) → senso di momentum
const EASE_IN: [number, number, number, number] = [0.4, 0, 1, 1]
// Easing ease-out per uscita (parte veloce, decelera) → senso di eleganza
const EASE_OUT: [number, number, number, number] = [0, 0, 0.6, 1]

export default function LeafOverlay() {
  const router = useRouter()
  const pathname = usePathname()
  const { state, onCoveringComplete, onRevealComplete, setPhase } = usePageTransition()
  const { phase, targetHref } = state

  // Rileva il cambio di pathname → nuova pagina montata → inizia rivelazione
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
      <motion.div
        style={{ willChange: "transform" }}
        // Parte da sinistra, fuori schermo
        initial={{ x: "-140vw", rotate: -35 }}
        animate={
          isCovering
            ? // Centro: copre lo schermo, leggera inclinazione residua
              { x: "0vw", rotate: -5 }
            : // Esce a destra, fuori schermo
              { x: "140vw", rotate: 30 }
        }
        transition={
          isCovering
            ? { duration: 0.32, ease: EASE_IN }
            : { duration: 0.32, ease: EASE_OUT }
        }
        onAnimationComplete={
          phase === "covering"
            ? handleCoveringComplete
            : phase === "revealing"
            ? handleRevealComplete
            : undefined
        }
      >
        {/*
          150vmax garantisce che la foglia (larga ~66% del viewBox) copra
          l'intera viewport in qualsiasi orientamento del dispositivo
        */}
        <svg
          viewBox="0 0 1000 1000"
          style={{ width: "150vmax", height: "150vmax", display: "block" }}
          aria-hidden="true"
        >
          <path d={LEAF_PATH} fill="#1A1A1A" />
        </svg>
      </motion.div>
    </div>
  )
}
