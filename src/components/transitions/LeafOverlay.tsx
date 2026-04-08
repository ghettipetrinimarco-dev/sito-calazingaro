"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import { usePageTransition } from "@/contexts/TransitionContext"

const LEAF_PATH =
  "M523,982 C523,982,593,812,714,635 C835,458,893,296,846,183 L778,197 L818,126 C818,126,711,28,510,76 C309,124,196,236,196,236 L247,262 L183,310 C183,310,210,432,267,522 L315,502 L266,610 C266,610,344,763,428,874 C512,985,523,982,523,982 Z"

// Easing cinematico: accelerazione organica
const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]

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

  // Chiamato quando la copertura è completa
  const handleCoveringComplete = () => {
    if (phase !== "covering") return
    router.push(targetHref)
    onCoveringComplete()
  }

  // Chiamato quando la rivelazione è completa
  const handleRevealComplete = () => {
    if (phase !== "revealing") return
    onRevealComplete()
  }

  // Non renderizzare nulla quando inattivo
  if (phase === "idle") return null

  const isCovering = phase === "covering" || phase === "waiting"

  return (
    // pointer-events: auto blocca i click durante tutta la transizione
    <div className="fixed inset-0 z-[9999]" style={{ pointerEvents: "auto" }}>
      <div className="w-full h-full flex items-center justify-center">
        <motion.div
          style={{ willChange: "transform" }}
          initial={{ scale: 0, rotate: 0, x: 0, y: 0 }}
          animate={
            isCovering
              ? { scale: 80, rotate: 45, x: 0, y: 0 }
              : { scale: 0, rotate: -10, x: "-30vw", y: "30vh" }
          }
          transition={{
            duration: isCovering ? 0.85 : 0.75,
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
            style={{ width: "80vmin", height: "80vmin", display: "block" }}
            aria-hidden="true"
          >
            <path d={LEAF_PATH} fill="#1A1A1A" />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}
