"use client"

import { useEffect, useRef, type ReactNode } from "react"

// CSS per il bordo animato — iniettato una sola volta nel documento
const GLOW_STYLES = `
  [data-spotlight]::before,
  [data-spotlight]::after {
    pointer-events: none;
    content: "";
    position: absolute;
    inset: calc(var(--border-size) * -1);
    border: var(--border-size) solid transparent;
    border-radius: calc(var(--radius) * 1px);
    background-attachment: fixed;
    background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
    background-repeat: no-repeat;
    background-position: 50% 50%;
    mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
    mask-clip: padding-box, border-box;
    mask-composite: intersect;
  }

  [data-spotlight]::before {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
      calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
      rgba(0, 0, 0, 0.55) 0%,
      transparent 100%
    );
    filter: brightness(1.4);
  }

  [data-spotlight]::after {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.45) calc(var(--spotlight-size) * 0.45) at
      calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
      rgba(0, 0, 0, 0.12) 0%,
      transparent 100%
    );
  }

  [data-spotlight] [data-spotlight-inner] {
    position: absolute;
    inset: 0;
    will-change: filter;
    border-radius: calc(var(--radius) * 1px);
    filter: blur(calc(var(--border-size) * 10));
    background: none;
    pointer-events: none;
  }
`

let stylesInjected = false
// Ref counter per il listener globale: un solo listener per N card
let listenerCount = 0
let globalCleanup: (() => void) | null = null

function ensureGlobalListener() {
  listenerCount++
  if (listenerCount === 1) {
    const syncPointer = (e: PointerEvent) => {
      const cards = document.querySelectorAll<HTMLElement>("[data-spotlight]")
      const x = e.clientX.toFixed(1)
      const y = e.clientY.toFixed(1)
      cards.forEach((card) => {
        card.style.setProperty("--x", x)
        card.style.setProperty("--y", y)
      })
    }
    document.addEventListener("pointermove", syncPointer)
    globalCleanup = () => document.removeEventListener("pointermove", syncPointer)
  }
}

function releaseGlobalListener() {
  listenerCount--
  if (listenerCount === 0 && globalCleanup) {
    globalCleanup()
    globalCleanup = null
  }
}

interface SpotlightCardProps {
  children: ReactNode
  className?: string
}

export function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Inietta gli stili una sola volta
    if (!stylesInjected) {
      const style = document.createElement("style")
      style.textContent = GLOW_STYLES
      document.head.appendChild(style)
      stylesInjected = true
    }

    // Singolo listener globale condiviso da tutte le card
    ensureGlobalListener()
    return () => releaseGlobalListener()
  }, [])

  return (
    <div
      ref={cardRef}
      data-spotlight
      className={`relative overflow-hidden ${className}`}
      style={{
        "--border-size": "1.5px",
        "--radius": "0",
        "--spotlight-size": "220px",
        "--border": "rgba(0,0,0,0.12)",
        border: "var(--border-size) solid rgba(0,0,0,0.1)",
        backgroundImage:
          "radial-gradient(var(--spotlight-size) var(--spotlight-size) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px), rgba(0,0,0,0.05), transparent)",
        backgroundAttachment: "fixed",
      } as React.CSSProperties}
    >
      <div data-spotlight-inner />
      {children}
    </div>
  )
}
