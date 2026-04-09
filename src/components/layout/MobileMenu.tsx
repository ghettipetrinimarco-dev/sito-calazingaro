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
  scrolled: boolean
}

export default function MobileMenu({ isOpen, onClose, scrolled }: MobileMenuProps) {
  // Fix scroll lock iOS Safari: overflow hidden da solo non basta, serve position fixed
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
    } else {
      const savedTop = document.body.style.top
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      if (savedTop) window.scrollTo(0, -parseInt(savedTop, 10))
    }
    return () => {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
    }
  }, [isOpen])

  // Chiusura con tasto Escape
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

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
          {/* Logo */}
          <div className="flex items-center px-6 py-4">
            <Image
              src="/images/logo.svg"
              alt="Cala Zingaro"
              width={120}
              height={52}
              className="object-contain"
              style={{ height: "40px", width: "auto" }}
            />
          </div>

          {/* X — posizionata esattamente dove stava l'hamburger */}
          <button
            onClick={onClose}
            aria-label="Chiudi menu"
            className="fixed right-6 md:right-10 text-3xl leading-none -translate-y-1/2"
            style={{ top: scrolled ? 32 : 54, color: "var(--color-ink)" }}
          >
            ×
          </button>

          {/* Voci — centrate */}
          <nav className="flex-1 flex flex-col justify-center items-center gap-1 text-center">
            {voci.map((voce, i) => (
              <motion.div
                key={voce.href}
                className="group"
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 1.12 }}
                transition={{
                  delay: 0.06 + i * 0.07,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <TransitionLink
                  href={voce.href}
                  onClick={onClose}
                  className="block py-1.5 relative"
                  style={{
                    fontFamily: "var(--font-yanone)",
                    fontWeight: 200,
                    fontSize: "clamp(2rem, 8vw, 3rem)",
                    color: "var(--color-ink)",
                    lineHeight: 1.15,
                    letterSpacing: "0.02em",
                    display: "inline-block",
                  }}
                >
                  {voce.label}
                  {/* Underline — desktop: hover, mobile: active/tap */}
                  <span
                    className="absolute left-0 right-0 bottom-0.5 block origin-center scale-x-0 group-hover:scale-x-100 group-active:scale-x-100 transition-transform duration-[150ms]"
                    style={{ height: 1.5, backgroundColor: "var(--color-ink)" }}
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
