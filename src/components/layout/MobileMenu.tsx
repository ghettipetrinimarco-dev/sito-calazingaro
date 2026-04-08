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
          style={{ backgroundColor: "var(--color-night)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
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
              style={{ color: "var(--color-sand)" }}
            >
              ×
            </button>
          </div>

          {/* Voci */}
          <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
            {voci.map((voce, i) => (
              <motion.div
                key={voce.href}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.06, duration: 0.4 }}
              >
                <TransitionLink
                  href={voce.href}
                  onClick={onClose}
                  className="block py-1.5"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontWeight: 200,
                    fontSize: "clamp(2rem, 8vw, 3rem)",
                    color: "var(--color-sand)",
                    lineHeight: 1.15,
                    letterSpacing: "0.02em",
                  }}
                >
                  {voce.label}
                </TransitionLink>
              </motion.div>
            ))}

            {/* CTA Prenota */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-8"
            >
              <a
                href="#prenota"
                onClick={onClose}
                className="inline-block text-[0.62rem] tracking-widest uppercase px-6 py-3 rounded-full transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: "var(--color-sand)",
                  color: "var(--color-night)",
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
