"use client"

import { useEffect, useRef, useState } from "react"
import { m, AnimatePresence, type Variants } from "framer-motion"
import { Phone, MapPin } from "lucide-react"
import TransitionLink from "@/components/transitions/TransitionLink"
import { useId } from "react"
import { usePathname } from "next/navigation"
import { usePageTransition } from "@/contexts/TransitionContext"

function ChalkUnderline({ visible }: { visible: boolean }) {
  const id = useId()
  return (
    <svg
      aria-hidden="true"
      className="absolute left-0 w-full overflow-visible pointer-events-none"
      style={{ bottom: -4, height: 5, opacity: visible ? 0.8 : 0, transition: "opacity 0.2s" }}
      viewBox="0 0 100 3"
      preserveAspectRatio="none"
      fill="none"
    >
      <defs>
        <filter id={id} x="-5%" y="-400%" width="110%" height="900%">
          <feTurbulence type="fractalNoise" baseFrequency="0.025 0.5" numOctaves={3} seed={14} result="wave" />
          <feDisplacementMap in="SourceGraphic" in2="wave" scale={1.5} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <path
        d="M 0,2 C 25,1.5 50,2.5 75,1.8 C 88,1.5 95,2 100,1.5"
        stroke="rgba(255,255,255,1)"
        strokeWidth={1.8}
        strokeLinecap="round"
        fill="none"
        filter={`url(#${id})`}
      />
    </svg>
  )
}

const voci = [
  { label: "Il Luogo", href: "/", anchor: "scopri" },
  { label: "Spiaggia", href: "/spiaggia" },
  { label: "Ristorante", href: "/ristorante" },
  { label: "Eventi", href: "/eventi" },
  { label: "Contatti", href: "/contatti" },
]

// Entrance: stiffness 100/15 (apparizioni) — TASTE_RULES
// Hover: stiffness 380/22 (interazioni veloci)
const voceVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.25 + i * 0.06,
      type: "spring",
      stiffness: 120,
      damping: 18,
    },
  }),
  hover: {
    scale: 1.12,
    transition: {
      type: "spring",
      stiffness: 380,
      damping: 22,
    },
  },
}

function MenuVoce({ href, anchor, label, onClose }: { href: string; anchor?: string; label: string; onClose: () => void }) {
  const [hovered, setHovered] = useState(false)
  const { startTransition } = usePageTransition()
  const pathname = usePathname()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onClose()
    if (anchor) {
      // Se siamo già sulla homepage, scroll diretto
      if (pathname === "/") {
        setTimeout(() => {
          document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" })
        }, 300)
      } else {
        // Vai alla homepage poi scrolla
        startTransition("/")
        setTimeout(() => {
          document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" })
        }, 800)
      }
    } else {
      if (href !== pathname) startTransition(href)
    }
  }

  return (
    <span
      className="relative inline-block py-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <a
        href={anchor ? `${href}#${anchor}` : href}
        onClick={handleClick}
        style={{
          fontFamily: "var(--font-yanone)",
          fontWeight: 300,
          fontSize: "clamp(2.6rem, 11vw, 3rem)",
          color: "rgba(255, 248, 240, 0.92)",
          lineHeight: 1.15,
          letterSpacing: "0.02em",
          display: "inline-block",
        }}
      >
        {label}
      </a>
      <ChalkUnderline visible={hovered} />
    </span>
  )
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Fix scroll lock iOS Safari.
  // savedScroll è un ref per evitare il bug: il cleanup del precedente effect
  // cancella body.style.top prima che il ramo else riesca a leggerlo.
  const savedScroll = useRef(0)

  useEffect(() => {
    if (isOpen) {
      savedScroll.current = window.scrollY
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.top = `-${savedScroll.current}px`
      document.body.style.width = "100%"
    } else {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      window.scrollTo(0, savedScroll.current)
    }
    return () => {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
    }
  }, [isOpen])

  // Chiusura con Escape
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

  return (
    // Wrapper fisso sempre montato: overflow-hidden clippa fisicamente l'overshoot
    // senza usare clipPath (che non è GPU-accelerated e causa jank).
    // pointer-events:none quando chiuso per non bloccare interazioni sulla pagina.
    <div
      className="fixed inset-0 z-50"
      style={{
        pointerEvents: isOpen ? "auto" : "none",
        visibility: isOpen ? "visible" : "hidden",
        clipPath: "inset(0)",
      }}
    >
      {/* Background separato dal pannello: fade puro (opacity → GPU only).
          Il blur rasterizza UNA volta e rimane fisso — nessun re-raster per frame.
          Se fosse dentro il pannello che scorre, il browser ridisegnerebbe
          blur(16px) su tutta la texture ad ogni frame → jank. */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            style={{
              backgroundColor: "rgba(6, 4, 3, 0.82)",
              backdropFilter: "blur(14px) saturate(0.6)",
              WebkitBackdropFilter: "blur(14px) saturate(0.6)",
            }}
          />
        )}
      </AnimatePresence>

    <AnimatePresence>
      {isOpen && (
        <m.div
          className="absolute inset-0 flex flex-col"
          initial={{ y: "-100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ type: "tween", duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          style={{ willChange: "transform" }}
          onClick={(e) => {
            // Chiude se il click non è su (o dentro) un elemento interattivo.
            // closest() risale il DOM → tolleranza naturale: anche pochi px fuori
            // dal bounding box di un link/button non trovano ancestor interattivo.
            const target = e.target as HTMLElement
            if (!target.closest("a, button, input, textarea, select")) {
              onClose()
            }
          }}
        >
          {/* Contenuto sopra lo sfondo */}
          <div className="relative z-10 flex flex-col h-full">

            {/* Griglia principale: 1 col mobile / 3 col desktop */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center px-8 md:px-16 gap-8">

              {/* Colonna sinistra — info (solo desktop) */}
              <m.div
                className="hidden md:flex flex-col gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18, type: "spring", stiffness: 100, damping: 15 }}
              >
                <a
                  href="tel:+393791203796"
                  className="hover:opacity-60 transition-opacity"
                  style={{ color: "rgba(255, 248, 240, 0.92)" }}
                >
                  <span style={{
                    fontFamily: "var(--font-yanone)",
                    fontWeight: 300,
                    fontSize: "clamp(1.2rem, 2.2vw, 1.7rem)",
                    letterSpacing: "0.03em",
                    lineHeight: 1.1,
                  }}>
                    +39 379 1203796
                  </span>
                </a>
                <div style={{ color: "rgba(255, 248, 240, 0.92)" }}>
                  <span style={{
                    fontFamily: "var(--font-yanone)",
                    fontWeight: 300,
                    fontSize: "clamp(1.2rem, 2.2vw, 1.7rem)",
                    letterSpacing: "0.03em",
                    lineHeight: 1.3,
                    display: "block",
                  }}>
                    Traversa XIX Pineta<br />
                    Milano Marittima
                  </span>
                </div>
              </m.div>

              {/* Colonna centrale — voci menu */}
              <nav className="flex flex-col items-center gap-1 text-center md:text-center">
                {voci.map((voce, i) => (
                  <m.div
                    key={voce.href}
                    variants={voceVariants}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                  >
                    <m.div whileHover="hover" whileTap="hover">
                      <MenuVoce href={voce.href} anchor={"anchor" in voce ? voce.anchor : undefined} onClose={onClose} label={voce.label} />
                    </m.div>

                    {/* Sotto-link (es. Ristorante) — solo desktop */}
                    {"sub" in voce && voce.sub && (
                      <div className="hidden md:flex items-center justify-center gap-6 mt-1 mb-1">
                        {voce.sub.map((s, si) => (
                          <span key={s.href} className="flex items-center gap-6">
                            {si > 0 && (
                              <span style={{ color: "rgba(255,248,240,0.2)", fontSize: "0.55rem" }}>·</span>
                            )}
                            <TransitionLink
                              href={s.href}
                              onClick={onClose}
                              className="hover:opacity-100 transition-opacity"
                              style={{
                                fontFamily: "var(--font-yanone)",
                                fontWeight: 200,
                                fontSize: "clamp(0.9rem, 2vw, 1.2rem)",
                                letterSpacing: "0.12em",
                                color: "rgba(255, 248, 240, 0.4)",
                                fontStyle: "italic",
                              }}
                            >
                              {s.label}
                            </TransitionLink>
                          </span>
                        ))}
                      </div>
                    )}

                  </m.div>
                ))}
              </nav>

              {/* Colonna destra — prenotazioni (solo desktop) */}
              <m.div
                className="hidden md:flex flex-col items-end gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.28, type: "spring", stiffness: 100, damping: 15 }}
              >
                <p style={{ fontFamily: "var(--font-quicksand)", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,248,240,0.35)", marginBottom: 4 }}>
                  Prenota
                </p>
                {[
                  { label: "Ristorante", href: "#prenota" },
                  { label: "Lettini", href: "#prenota-spiaggia" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-center gap-2 hover:opacity-60 transition-opacity"
                    style={{ color: "rgba(255, 248, 240, 0.92)" }}
                  >
                    <span style={{
                      fontFamily: "var(--font-yanone)",
                      fontWeight: 300,
                      fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                      letterSpacing: "0.03em",
                      lineHeight: 1.1,
                    }}>
                      → {item.label}
                    </span>
                  </a>
                ))}
              </m.div>

            </div>

            {/* Footer mobile — prenotazioni + telefono */}
            <m.div
              className="md:hidden flex flex-col items-center gap-5 pb-10 px-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, type: "spring", stiffness: 100, damping: 15 }}
            >
              {/* Label + separatore */}
              <div className="flex items-center gap-4 w-full px-6">
                <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,248,240,0.12)" }} />
                <p style={{ fontFamily: "var(--font-quicksand)", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,248,240,0.35)" }}>
                  Prenota
                </p>
                <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,248,240,0.12)" }} />
              </div>

              {/* Links */}
              <div className="flex items-center gap-8">
                {[
                  { label: "→ Ristorante", href: "#prenota" },
                  { label: "→ Lettini", href: "#prenota-spiaggia" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="hover:opacity-60 transition-opacity"
                    style={{ color: "rgba(255, 248, 240, 0.92)" }}
                  >
                    <span style={{
                      fontFamily: "var(--font-yanone)",
                      fontWeight: 300,
                      fontSize: "1.5rem",
                      letterSpacing: "0.03em",
                      lineHeight: 1,
                    }}>
                      {item.label}
                    </span>
                  </a>
                ))}
              </div>

              {/* Telefono */}
              <a
                href="tel:+393791203796"
                className="hover:opacity-60 transition-opacity"
                style={{ color: "rgba(255,248,240,0.35)" }}
              >
                <span style={{
                  fontFamily: "var(--font-quicksand)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                }}>
                  +39 379 1203796
                </span>
              </a>
            </m.div>

          </div>
        </m.div>
      )}
    </AnimatePresence>
    </div>
  )
}
