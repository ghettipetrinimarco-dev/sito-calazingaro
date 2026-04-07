"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import MobileMenu from "./MobileMenu"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "var(--color-sand)" : "transparent",
          boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div className="flex justify-between items-center px-6 md:px-10 py-4">
          {/* Logo */}
          <Link
            href="/"
            className="italic text-xl tracking-wide transition-colors"
            style={{
              fontFamily: "var(--font-serif)",
              color: scrolled ? "var(--color-text)" : "white",
            }}
          >
            Cala Zingaro
          </Link>

          {/* Destra: pill Prenota + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="#prenota"
              className="text-[0.6rem] tracking-widest uppercase px-4 py-2 rounded-full border transition-all duration-300"
              style={
                scrolled
                  ? {
                      borderColor: "var(--color-text)",
                      color: "var(--color-text)",
                    }
                  : {
                      borderColor: "rgba(255,255,255,0.4)",
                      color: "white",
                      backgroundColor: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(8px)",
                    }
              }
            >
              Prenota
            </Link>

            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Apri menu"
              className="text-[0.6rem] tracking-widest uppercase transition-colors"
              style={{ color: scrolled ? "var(--color-text)" : "white" }}
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
