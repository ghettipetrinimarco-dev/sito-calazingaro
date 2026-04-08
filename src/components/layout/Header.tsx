"use client"

import { useState, useEffect, useLayoutEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useScroll } from "framer-motion"
import { Menu } from "lucide-react"

import MobileMenu from "./MobileMenu"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  // Reset immediato a "top" ad ogni navigazione, prima del paint
  useLayoutEffect(() => {
    setScrolled(false)
    window.scrollTo(0, 0)
  }, [pathname])

  // Aggiorna lo stato in base allo scroll reale
  useEffect(() => {
    return scrollY.on("change", (v) => {
      if (v > 120) setScrolled(true)
      else if (v < 60) setScrolled(false)
    })
  }, [scrollY])

  if (pathname === "/menu") return null

  const transition = "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)"

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40"
        style={{
          height: scrolled ? 64 : 88,
          backgroundColor: scrolled ? "rgba(223, 210, 196, 1)" : "rgba(223, 210, 196, 0)",
          boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.06)" : "none",
          transition,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="Cala Zingaro — home"
          className="absolute"
          style={{
            top: "50%",
            left: scrolled ? 24 : "50%",
            transform: scrolled ? "translateY(-50%)" : "translate(-50%, -50%)",
            height: scrolled ? 44 : 72,
            transition,
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Logo colorato (visibile quando scrolled) */}
          <Image
            src="/images/logo.svg"
            alt="Cala Zingaro"
            width={200}
            height={72}
            style={{
              height: "100%",
              width: "auto",
              display: "block",
              opacity: scrolled ? 1 : 0,
              transition,
            }}
          />
          {/* Logo bianco (visibile in cima) */}
          <Image
            src="/images/logo.svg"
            alt=""
            width={200}
            height={72}
            style={{
              height: "100%",
              width: "auto",
              display: "block",
              position: "absolute",
              top: 0,
              left: 0,
              filter: "brightness(0) invert(1)",
              opacity: scrolled ? 0 : 1,
              transition,
            }}
          />
        </Link>

        {/* Pulsanti destra */}
        <div
          className="absolute right-6 md:right-10 flex items-center gap-3"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            opacity: scrolled ? 1 : 0,
            pointerEvents: scrolled ? "auto" : "none",
            transition,
          }}
        >
          <Link
            href="#prenota"
            className="text-[0.6rem] tracking-widest uppercase px-4 py-2 rounded-full border transition-colors duration-300"
            style={{ borderColor: "var(--color-text)", color: "var(--color-text)" }}
          >
            Prenota
          </Link>

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Apri menu"
            style={{ color: "var(--color-text)" }}
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
