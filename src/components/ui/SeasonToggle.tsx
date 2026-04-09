"use client"

import { useId, useState } from "react"
import { m, AnimatePresence } from "framer-motion"

interface SeasonToggleProps {
  value: "estate" | "inverno"
  onChange: (s: "estate" | "inverno") => void
}

const EASE = [0.22, 1, 0.36, 1] as const

export default function SeasonToggle({ value, onChange }: SeasonToggleProps) {
  const uid = useId()
  const filterId = `st-chalk-${uid}`

  return (
    <div className="inline-flex items-center mb-8">
      {(["estate", "inverno"] as const).map((season) => {
        const active = value === season

        return (
          <button
            key={season}
            onClick={() => onChange(season)}
            className="relative px-5 py-2 transition-opacity duration-300"
            style={{
              opacity: active ? 1 : 0.35,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "6px 16px",
            }}
          >
            {/* Ovale chalk — visibile solo se attivo */}
            <AnimatePresence>
              {active && (
                <m.svg
                  key="oval"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
                  viewBox="0 0 100 32"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <defs>
                    <filter id={filterId} x="-10%" y="-30%" width="120%" height="160%">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.035 0.12"
                        numOctaves={4}
                        seed={9}
                        result="wave"
                      />
                      <feDisplacementMap
                        in="SourceGraphic"
                        in2="wave"
                        scale={2.5}
                        xChannelSelector="R"
                        yChannelSelector="G"
                      />
                    </filter>
                  </defs>
                  <path
                    d="M 7,16 C 6,7 18,2 50,2 C 82,2 94,7 94,16 C 94,25 82,30 50,30 C 18,30 6,25 7,16 Z"
                    stroke="currentColor"
                    strokeWidth={1.4}
                    strokeLinecap="round"
                    fill="none"
                    filter={`url(#${filterId})`}
                  />
                </m.svg>
              )}
            </AnimatePresence>

            <span
              className="relative"
              style={{
                fontFamily: "var(--font-quicksand)",
                fontSize: "0.85rem",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--color-text)",
              }}
            >
              {season}
            </span>
          </button>
        )
      })}
    </div>
  )
}
