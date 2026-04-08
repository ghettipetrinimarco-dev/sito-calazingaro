"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
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

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ backgroundColor: "var(--color-sand)" }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header del menu */}
          <div className="flex justify-between items-center px-6 py-4">
            <Image
              src="/images/logo.svg"
              alt="Cala Zingaro"
              width={120}
              height={52}
              className="object-contain"
              style={{ height: "40px", width: "auto" }}
            />
            <button
              onClick={onClose}
              aria-label="Chiudi menu"
              className="text-3xl leading-none"
              style={{ color: "var(--color-ink)" }}
            >
              ×
            </button>
          </div>

          {/* Voci — centrate */}
          <nav className="flex-1 flex flex-col justify-center items-center gap-1 text-center">
            {voci.map((voce, i) => (
              <motion.div
                key={voce.href}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.06 + i * 0.07,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover="hover"
                whileTap="hover"
              >
                <TransitionLink
                  href={voce.href}
                  onClick={onClose}
                  className="block py-1.5"
                  style={{
                    fontFamily: "var(--font-yanone)",
                    fontWeight: 200,
                    fontSize: "clamp(2rem, 8vw, 3rem)",
                    color: "var(--color-ink)",
                    lineHeight: 1.15,
                    letterSpacing: "0.02em",
                    display: "inline-block",
                    position: "relative",
                  }}
                >
                  {voce.label}
                  {/* Underline che cresce al hover/tap */}
                  <motion.span
                    variants={{ hover: { scaleX: 1 }, rest: { scaleX: 0 } }}
                    initial="rest"
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      position: "absolute",
                      bottom: 2,
                      left: 0,
                      right: 0,
                      height: 1.5,
                      backgroundColor: "var(--color-ink)",
                      transformOrigin: "left",
                      display: "block",
                    }}
                  />
                </TransitionLink>
              </motion.div>
            ))}

            {/* CTA Prenota */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.56, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8"
            >
              <a
                href="#prenota"
                onClick={onClose}
                className="inline-block text-[0.62rem] tracking-widest uppercase px-6 py-3 rounded-full transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: "var(--color-ink)",
                  color: "var(--color-sand)",
                }}
              >
                Prenota ora
              </a>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
