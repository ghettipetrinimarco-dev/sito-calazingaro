"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import Image from "next/image"
import { Phone, MapPin, ArrowUpRight } from "lucide-react"
import TransitionLink from "@/components/transitions/TransitionLink"

const voci = [
  { label: "Ristorante", href: "/ristorante" },
  { label: "Spiaggia", href: "/spiaggia" },
  { label: "Menu", href: "/menu" },
  { label: "Vini", href: "/vini" },
  { label: "Eventi", href: "/eventi" },
  { label: "Gallery", href: "/gallery" },
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
      delay: 0.08 + i * 0.07,
      type: "spring",
      stiffness: 100,
      damping: 15,
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
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ pointerEvents: isOpen ? "auto" : "none" }}
    >
      {/* Background separato dal pannello: fade puro (opacity → GPU only).
          Il blur rasterizza UNA volta e rimane fisso — nessun re-raster per frame.
          Se fosse dentro il pannello che scorre, il browser ridisegnerebbe
          blur(16px) su tutta la texture ad ogni frame → jank. */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Image
              src="/Ambiente/Cala-Zingaro-Ambiente-1.webp"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              style={{
                filter: "blur(16px) brightness(0.35) saturate(0.6)",
                transform: "scale(1.1)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(12, 8, 6, 0.84)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute inset-0 flex flex-col"
          // y: puro transform → GPU layer → 60fps garantiti.
          // willChange: "transform" promuove il panel a layer composito prima dell'animazione.
          // Il background è ora in un layer separato (fade only) → nessun blur da
          // rasterizzare durante lo slide.
          // stiffness 380 / damping 45: sopra la soglia di smorzamento critico (2√380 ≈ 39)
          // → nessun overshoot, nessuna striscia, arrivo netto.
          initial={{ y: "-100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", stiffness: 380, damping: 45 }}
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
              <motion.div
                className="hidden md:flex flex-col gap-5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18, type: "spring", stiffness: 100, damping: 15 }}
              >
                <a
                  href="tel:+393791203796"
                  className="flex items-center gap-3 hover:opacity-70 transition-opacity"
                  style={{ color: "rgba(255, 248, 240, 0.85)" }}
                >
                  <Phone size={14} strokeWidth={1.5} className="opacity-40 shrink-0" />
                  <span
                    style={{
                      fontFamily: "var(--font-quicksand)",
                      fontSize: "0.82rem",
                      letterSpacing: "0.03em",
                    }}
                  >
                    +39 379 1203796
                  </span>
                </a>
                <div
                  className="flex items-start gap-3"
                  style={{ color: "rgba(255, 248, 240, 0.85)" }}
                >
                  <MapPin size={14} strokeWidth={1.5} className="opacity-40 mt-0.5 shrink-0" />
                  <span
                    style={{
                      fontFamily: "var(--font-quicksand)",
                      fontSize: "0.82rem",
                      letterSpacing: "0.03em",
                      lineHeight: 1.6,
                    }}
                  >
                    Traversa XIX Pineta<br />
                    Milano Marittima (RA)
                  </span>
                </div>
              </motion.div>

              {/* Colonna centrale — voci menu */}
              <nav className="flex flex-col items-center gap-1 text-center">
                {voci.map((voce, i) => (
                  <motion.div
                    key={voce.href}
                    className="group"
                    variants={voceVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    whileTap="hover"
                    custom={i}
                  >
                    <TransitionLink
                      href={voce.href}
                      onClick={onClose}
                      className="block py-1.5 relative"
                      style={{
                        fontFamily: "var(--font-yanone)",
                        fontWeight: 200,
                        fontSize: "clamp(2rem, 8vw, 3rem)",
                        color: "rgba(255, 248, 240, 0.92)",
                        lineHeight: 1.15,
                        letterSpacing: "0.02em",
                        display: "inline-block",
                      }}
                    >
                      {voce.label}
                      <span
                        className="absolute left-0 right-0 bottom-0.5 block origin-center scale-x-0 group-hover:scale-x-100 group-active:scale-x-100 transition-transform duration-[150ms]"
                        style={{ height: 1.5, backgroundColor: "rgba(255, 248, 240, 0.6)" }}
                      />
                    </TransitionLink>
                  </motion.div>
                ))}

                {/* CTA Prenota — mobile only */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 100, damping: 15 }}
                  className="mt-8 md:hidden"
                >
                  <a
                    href="#prenota"
                    onClick={onClose}
                    className="inline-block text-[0.62rem] tracking-widest uppercase px-6 py-3 rounded-full transition-opacity hover:opacity-70"
                    style={{
                      border: "1px solid rgba(255, 248, 240, 0.3)",
                      color: "rgba(255, 248, 240, 0.9)",
                      backgroundColor: "rgba(255, 248, 240, 0.08)",
                    }}
                  >
                    Prenota ora
                  </a>
                </motion.div>
              </nav>

              {/* Colonna destra — social + prenota (solo desktop) */}
              <motion.div
                className="hidden md:flex flex-col items-end gap-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18, type: "spring", stiffness: 100, damping: 15 }}
              >
                <div className="flex flex-col items-end gap-3">
                  <a
                    href="https://www.instagram.com/calazingaro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                    style={{ color: "rgba(255, 248, 240, 0.85)" }}
                  >
                    <span style={{ fontFamily: "var(--font-quicksand)", fontSize: "0.82rem", letterSpacing: "0.03em" }}>
                      Instagram
                    </span>
                    <ArrowUpRight size={14} strokeWidth={1.5} className="opacity-40" />
                  </a>
                  <a
                    href="https://www.facebook.com/calazingaro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                    style={{ color: "rgba(255, 248, 240, 0.85)" }}
                  >
                    <span style={{ fontFamily: "var(--font-quicksand)", fontSize: "0.82rem", letterSpacing: "0.03em" }}>
                      Facebook
                    </span>
                    <ArrowUpRight size={14} strokeWidth={1.5} className="opacity-40" />
                  </a>
                </div>
                <a
                  href="#prenota"
                  onClick={onClose}
                  className="inline-block text-[0.62rem] tracking-widest uppercase px-6 py-3 rounded-full transition-opacity hover:opacity-70"
                  style={{
                    border: "1px solid rgba(255, 248, 240, 0.3)",
                    color: "rgba(255, 248, 240, 0.9)",
                    backgroundColor: "rgba(255, 248, 240, 0.08)",
                  }}
                >
                  Prenota ora
                </a>
              </motion.div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  )
}
