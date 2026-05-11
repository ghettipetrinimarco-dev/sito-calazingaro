"use client"

import { useState, useEffect, useLayoutEffect } from "react"
import Image from "next/image"
import TransitionLink from "@/components/transitions/TransitionLink"
import { usePathname } from "next/navigation"
import MobileMenu from "./MobileMenu"
import MenuToggle from "./MenuToggle"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  // Reset immediato a "top" ad ogni navigazione, prima del paint
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    const frame = requestAnimationFrame(() => setScrolled(false))
    return () => cancelAnimationFrame(frame)
  }, [pathname])

  // Apre il menu hamburger se la X di /menu o /vini ha segnalato il ritorno
  useEffect(() => {
    const flag = sessionStorage.getItem("openMobileMenu")
    if (flag) {
      sessionStorage.removeItem("openMobileMenu")
      const frame = requestAnimationFrame(() => setMenuOpen(true))
      return () => cancelAnimationFrame(frame)
    }
  }, [pathname])

  // Listener scroll nativo — passivo, senza dipendenza da Framer Motion.
  // Quando il menu è aperto, position:fixed sul body azzera window.scrollY →
  // congelare scrolled per evitare che logo e hamburger cambino posizione.
  useEffect(() => {
    if (menuOpen) return

    const onScroll = () => {
      const y = window.scrollY
      const threshold = window.innerHeight * 0.5
      if (y > threshold) setScrolled(true)
      else if (y < threshold - 40) setScrolled(false)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [menuOpen])

  if (pathname === "/menu" || pathname === "/vini" || pathname === "/prenota" || pathname.startsWith("/admin")) return null

  const transition = "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)"

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40"
        style={{
          height: scrolled ? 64 : 108,
          backgroundColor: scrolled ? "rgba(250, 250, 247, 0.88)" : "rgba(250, 250, 247, 0)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.05)" : "none",
          transition,
        }}
      >
        {/* Logo — grande e centrato in cima, piccolo a sinistra dopo lo scroll.
            Singola <Image>: il colore si inverte via CSS filter con transizione. */}
        <TransitionLink
          href="/"
          className="absolute"
          onClick={() => {
            if (pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          }}
          style={{
            top: scrolled ? "50%" : "58%",
            left: scrolled ? 24 : "50%",
            transform: scrolled ? "translateY(-50%)" : "translate(-50%, -50%)",
            height: scrolled ? 44 : 96,
            transition,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Image
            src="/images/logo.svg"
            alt="Cala Zingaro"
            width={0}
            height={0}
            sizes="200px"
            priority
            style={{
              height: "100%",
              width: "auto",
              display: "block",
              filter: scrolled ? "none" : "brightness(0) invert(1)",
              transition,
            }}
          />
        </TransitionLink>

        {/* Menu link — solo desktop */}
        <div
          className="hidden md:block absolute right-40 md:right-52"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            opacity: scrolled ? 1 : 0,
            pointerEvents: scrolled ? "auto" : "none",
            transition,
          }}
        >
          <TransitionLink
            href="/menu"
            className="relative inline-flex items-center justify-center px-4 py-1.5 hover:opacity-50 transition-opacity"
            style={{ color: "var(--color-text)" }}
          >
            <span style={{
              fontFamily: "var(--font-quicksand)",
              fontSize: "0.7rem",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              lineHeight: 1,
              display: "block",
            }}>
              Menu
            </span>
          </TransitionLink>
        </div>

        {/* Prenota — solo desktop */}
        <div
          className="hidden md:block absolute right-20 md:right-28"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            opacity: scrolled ? 1 : 0,
            pointerEvents: scrolled ? "auto" : "none",
            transition,
          }}
        >
          <TransitionLink
            href="/prenota"
            className="relative inline-flex items-center justify-center px-4 py-1.5"
            style={{ color: "var(--color-text)" }}
          >
            <svg
              aria-hidden="true"
              style={{ position: "absolute", inset: -2, width: "calc(100% + 4px)", height: "calc(100% + 4px)", overflow: "visible" }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <filter id="chalk-btn" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.035 0.1" numOctaves={4} seed={11} result="wave" />
                  <feDisplacementMap in="SourceGraphic" in2="wave" scale={4} xChannelSelector="R" yChannelSelector="G" />
                </filter>
                <filter id="chalk-text" x="-5%" y="-10%" width="110%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves={3} seed={4} result="noise" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3 0 0 0 -0.08" in="noise" result="chalkMask" />
                  <feComposite in="SourceGraphic" in2="chalkMask" operator="in" />
                </filter>
              </defs>
              <path
                d="M 50 6 C 74 2, 97 22, 97 42 C 97 62, 78 96, 51 97 C 24 98, 3 74, 3 58 C 3 38, 26 10, 50 6 Z"
                stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" fill="none"
                filter="url(#chalk-btn)" vectorEffect="non-scaling-stroke"
              />
            </svg>
            <span
              className="relative"
              style={{ fontFamily: "var(--font-quicksand)", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", filter: "url(#chalk-text)" }}
            >
              Prenota
            </span>
          </TransitionLink>
        </div>

      </header>

      <MenuToggle
        isOpen={menuOpen}
        onToggle={() => setMenuOpen((v) => !v)}
        scrolled={scrolled}
      />

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
