"use client"

import { useId } from "react"
import { m, AnimatePresence } from "framer-motion"

// TASTE_RULES: stiffness 260 / damping 20 per interazioni
const springInteraction = { type: "spring" as const, stiffness: 260, damping: 20 }

interface MenuToggleProps {
  isOpen: boolean
  onToggle: () => void
  scrolled: boolean
}

export default function MenuToggle({ isOpen, onToggle, scrolled }: MenuToggleProps) {
  const uid = useId()
  const hId = `${uid}-chalk-h`
  const xId = `${uid}-chalk-x`

  // Allineato al centro verticale dell'header: scrolled 64px→32px, !scrolled 108px→54px
  const topPx = scrolled ? 32 : 54

  return (
    <button
      onClick={onToggle}
      aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
      className="fixed right-6 md:right-10 z-[9000]"
      style={{
        top: topPx,
        transform: "translateY(-50%)",
        // Bianco sull'hero, var(--color-text) sulla navbar; quando aperto sempre warm-white
        color: isOpen ? "rgba(255, 248, 240, 0.95)" : scrolled ? "var(--color-text)" : "#fff",
        transition: "color 0.5s cubic-bezier(0.22, 1, 0.36, 1), top 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        touchAction: "manipulation",
        // Area tap 44×44 per accessibilità touch
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 44,
        height: 44,
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!isOpen ? (
          // ── HAMBURGER ──
          <m.span
            key="hamburger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            style={{ display: "block", width: 24, height: 24 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              width="24"
              height="24"
            >
              <defs>
                {/*
                  Solo displacement: sposta i pixel del tracciato lungo noise fractal →
                  bordi irregolari come gesso, senza toccare colore o alpha.
                  La porosità era la causa del mix bianco/nero: rimossa.
                */}
                <filter id={hId} x="-20%" y="-60%" width="140%" height="220%">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.04 0.12"
                    numOctaves={4}
                    seed={3}
                    result="wave"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="wave"
                    scale={1.8}
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>
              </defs>
              <g
                filter={`url(#${hId})`}
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                fill="none"
              >
                <path d="M 2.2 5.5 C 6.8 5.2, 13.1 5.8, 21.8 5.4" />
                <path d="M 2.1 12.0 C 6.9 12.3, 13.2 11.7, 21.9 12.1" />
                <path d="M 2.3 18.5 C 6.7 18.2, 13.0 18.7, 21.7 18.3" />
              </g>
            </svg>
          </m.span>
        ) : (
          // ── CHIUDI X ──
          <m.span
            key="close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            style={{ display: "block", width: 24, height: 24 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              width="24"
              height="24"
            >
              <defs>
                <filter id={xId} x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.04 0.12"
                    numOctaves={4}
                    seed={5}
                    result="wave"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="wave"
                    scale={1.8}
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>
              </defs>
              <g
                filter={`url(#${xId})`}
                stroke="currentColor"
                strokeWidth={1.7}
                strokeLinecap="round"
                fill="none"
              >
                <path d="M 4.1 4.0 C 8.2 8.3, 13.8 13.7, 19.9 20.1" />
                <path d="M 19.9 4.0 C 15.8 8.3, 10.2 13.7, 4.1 20.1" />
              </g>
            </svg>
          </m.span>
        )}
      </AnimatePresence>
    </button>
  )
}
