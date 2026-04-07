"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import MobileMenu from "./MobileMenu"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (pathname === "/menu") return null

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
        style={{
          height: scrolled ? "64px" : "88px",
          backgroundColor: scrolled ? "var(--color-sand)" : "transparent",
          boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.06)" : "none",
        }}
      >
        {/* Logo — si sposta da centro a sinistra allo scroll */}
        <Link
          href="/"
          aria-label="Cala Zingaro — home"
          className="absolute"
          style={{
            top: "50%",
            left: scrolled ? "24px" : "50%",
            transform: scrolled ? "translateY(-50%)" : "translate(-50%, -50%)",
            transition: "left 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {/* Logo colorato — appare quando scrolled */}
          <Image
            src="/images/logo.svg"
            alt="Cala Zingaro"
            width={200}
            height={80}
            priority
            style={{
              height: scrolled ? "44px" : "72px",
              width: "auto",
              opacity: scrolled ? 1 : 0,
              transition: "opacity 0.45s ease, height 0.55s cubic-bezier(0.22,1,0.36,1)",
              display: "block",
            }}
          />
          {/* Logo bianco — visibile sulla hero */}
          <Image
            src="/images/logo.svg"
            alt=""
            aria-hidden
            width={200}
            height={80}
            style={{
              height: scrolled ? "44px" : "72px",
              width: "auto",
              filter: "brightness(0) invert(1)",
              opacity: scrolled ? 0 : 1,
              transition: "opacity 0.45s ease, height 0.55s cubic-bezier(0.22,1,0.36,1)",
              position: "absolute",
              top: 0,
              left: 0,
              display: "block",
            }}
          />
        </Link>

        {/* Pulsanti destra — appaiono solo quando scrolled */}
        <div
          className="absolute right-6 md:right-10 flex items-center gap-3"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            opacity: scrolled ? 1 : 0,
            pointerEvents: scrolled ? "auto" : "none",
            transition: "opacity 0.35s ease",
          }}
        >
          <Link
            href="#prenota"
            className="text-[0.6rem] tracking-widest uppercase px-4 py-2 rounded-full border transition-colors duration-300"
            style={{
              borderColor: "var(--color-text)",
              color: "var(--color-text)",
            }}
          >
            Prenota
          </Link>

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Apri menu"
            className="text-[0.6rem] tracking-widest uppercase"
            style={{ color: "var(--color-text)" }}
          >
            Menu
          </button>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
