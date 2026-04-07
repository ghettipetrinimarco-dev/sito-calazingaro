# Homepage Bozza — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Costruire la homepage completa (scroll narrativo) con layout, font, animazioni e deploy su Vercel.

**Architecture:** Hybrid scroll: homepage a colonna narrativa con sezioni alternate chiaro/scuro. Componenti separati per sezione, LenisProvider per smooth scroll, Header trasparente → solido allo scroll, Footer fisso in fondo.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, Framer Motion v12 (whileInView only), Lenis, Satoshi (Fontshare CDN), Cormorant Garamond (next/font/google)

---

## File Map

**Crea:**
- `src/components/layout/LenisProvider.tsx` — 'use client', wrapper Lenis per smooth scroll
- `src/components/layout/Header.tsx` — nav trasparente → sabbia allo scroll, hamburger, pill Prenota
- `src/components/layout/MobileMenu.tsx` — menu overlay fullscreen antracite con Framer
- `src/components/layout/Footer.tsx` — footer scuro con logo, contatti, social
- `src/components/ui/SectionLabel.tsx` — label uppercase piccola riutilizzabile
- `src/components/ui/RevealText.tsx` — wrapper Framer whileInView per reveal animato
- `src/components/sections/Hero.tsx` — hero fullscreen con gradiente placeholder + titolo
- `src/components/sections/IlLuogo.tsx` — intro editoriale
- `src/components/sections/RistoranteSection.tsx` — foto + testo split
- `src/components/sections/SpiaggiaSection.tsx` — sfondo night, foto + testo
- `src/components/sections/EventiSection.tsx` — titolo + carousel orizzontale 3 card
- `src/components/sections/PrenotaSection.tsx` — dual CTA prenota

**Modifica:**
- `src/app/globals.css` — design tokens, font-face, base styles
- `src/app/layout.tsx` — font, LenisProvider, Header, Footer, link Satoshi
- `src/app/(public)/page.tsx` — assembla tutte le sezioni

---

## Task 1: Installa Lenis e configura font

**Files:** `package.json`, `src/app/globals.css`, `src/app/layout.tsx`

- [ ] **Installa Lenis**

```bash
cd /Users/marco/Desktop/dev/sito-calazingaro && pnpm add lenis
```

- [ ] **Aggiorna `src/app/globals.css`** — rimuovi tutto il contenuto esistente e scrivi:

```css
@import "tailwindcss";

@theme inline {
  /* Font */
  --font-sans: 'Satoshi', system-ui, sans-serif;
  --font-serif: 'Cormorant Garamond', Georgia, serif;

  /* Palette — mai bianco/nero puri */
  --color-sand: #F4F2ED;
  --color-sand-light: #FAFAF7;
  --color-night: #1A1A1A;
  --color-ink: #0D0D0D;
  --color-text: #111111;
  --color-muted: #666666;
  --color-subtle: #999999;
  --color-accent: #C8A87A;

  /* Spacing */
  --section-px: 1.5rem;
  --section-px-md: 2.5rem;
  --section-px-lg: 4rem;
}

/* Reset base */
*, *::before, *::after { box-sizing: border-box; }

html { scroll-behavior: auto; } /* Lenis gestisce lo scroll */

body {
  background-color: var(--color-sand);
  color: var(--color-text);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Utility tipografiche */
.font-serif { font-family: var(--font-serif); }
.font-sans { font-family: var(--font-sans); }
```

- [ ] **Aggiorna `src/app/layout.tsx`** con font Cormorant Garamond + link Satoshi:

```tsx
import type { Metadata } from "next"
import { Cormorant_Garamond } from "next/font/google"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant-var",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Cala Zingaro — Beach Club & Ristorante | Milano Marittima",
    template: "%s | Cala Zingaro",
  },
  description:
    "Beach club e ristorante sulla spiaggia di Milano Marittima. Pranzo, aperitivo, cena e dopocena ogni weekend. Prenota il tuo posto.",
  metadataBase: new URL("https://calazingaro.it"),
  openGraph: {
    siteName: "Cala Zingaro",
    locale: "it_IT",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={cormorant.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
```

- [ ] **Aggiorna globals.css** — aggiungi la variabile Cormorant dopo `@theme`:

```css
/* Sovrascrive la variabile serif con quella di next/font */
body {
  --font-serif: var(--font-cormorant-var), Georgia, serif;
}
```

- [ ] **Verifica compilazione**

```bash
pnpm build 2>&1 | tail -20
```
Atteso: `✓ Compiled successfully` senza errori.

- [ ] **Commit**

```bash
git add -A && git commit -m "chore: font Satoshi + Cormorant Garamond, design tokens CSS"
```

---

## Task 2: LenisProvider

**Files:** `src/components/layout/LenisProvider.tsx`

- [ ] **Crea `src/components/layout/LenisProvider.tsx`**

```tsx
"use client"

import { useEffect } from "react"
import Lenis from "lenis"

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    let animationFrameId: number

    function raf(time: number) {
      lenis.raf(time)
      animationFrameId = requestAnimationFrame(raf)
    }

    animationFrameId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(animationFrameId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
```

- [ ] **Aggiungi LenisProvider a `src/app/layout.tsx`** — importa e wrappa children nel body:

```tsx
import LenisProvider from "@/components/layout/LenisProvider"

// Nel return, sostituisci il body con:
<body className="min-h-full flex flex-col">
  <LenisProvider>{children}</LenisProvider>
</body>
```

- [ ] **Commit**

```bash
git add -A && git commit -m "feat: LenisProvider smooth scroll"
```

---

## Task 3: Header + MobileMenu

**Files:** `src/components/layout/Header.tsx`, `src/components/layout/MobileMenu.tsx`

- [ ] **Crea `src/components/layout/MobileMenu.tsx`**

```tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

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
            <span
              className="font-serif italic text-xl"
              style={{ color: "var(--color-sand)" }}
            >
              Cala Zingaro
            </span>
            <button
              onClick={onClose}
              aria-label="Chiudi menu"
              className="text-2xl"
              style={{ color: "var(--color-sand)" }}
            >
              ×
            </button>
          </div>

          {/* Voci */}
          <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
            {voci.map((voce, i) => (
              <motion.div
                key={voce.href}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.06, duration: 0.4 }}
              >
                <Link
                  href={voce.href}
                  onClick={onClose}
                  className="block font-serif italic text-4xl leading-tight py-1"
                  style={{ color: "var(--color-sand)" }}
                >
                  {voce.label}
                </Link>
              </motion.div>
            ))}

            {/* CTA Prenota */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-8"
            >
              <Link
                href="#prenota"
                onClick={onClose}
                className="inline-block text-xs tracking-widest uppercase px-6 py-3 rounded-full"
                style={{
                  backgroundColor: "var(--color-sand)",
                  color: "var(--color-night)",
                }}
              >
                Prenota ora
              </Link>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Crea `src/components/layout/Header.tsx`**

```tsx
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

  const navBg = scrolled
    ? "bg-[#F4F2ED] shadow-sm"
    : "bg-transparent"

  const textColor = scrolled ? "text-[#111111]" : "text-white"

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${navBg}`}
      >
        <div className="flex justify-between items-center px-6 md:px-10 py-4">
          {/* Logo */}
          <Link href="/" className={`font-serif italic text-xl tracking-wide ${textColor}`}>
            Cala Zingaro
          </Link>

          {/* Destra: pill Prenota + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="#prenota"
              className={`text-[0.6rem] tracking-widest uppercase px-4 py-2 rounded-full border transition-all duration-300 ${
                scrolled
                  ? "border-[#111111] text-[#111111]"
                  : "border-white/40 text-white bg-white/10 backdrop-blur-sm"
              }`}
            >
              Prenota
            </Link>

            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Apri menu"
              className={`text-[0.6rem] tracking-widest uppercase ${textColor}`}
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
```

- [ ] **Aggiungi Header a `src/app/layout.tsx`** — dentro LenisProvider, prima di children:

```tsx
import Header from "@/components/layout/Header"

// Nel body:
<body className="min-h-full flex flex-col">
  <LenisProvider>
    <Header />
    {children}
  </LenisProvider>
</body>
```

- [ ] **Commit**

```bash
git add -A && git commit -m "feat: Header trasparente + MobileMenu fullscreen"
```

---

## Task 4: Footer

**Files:** `src/components/layout/Footer.tsx`

- [ ] **Crea `src/components/layout/Footer.tsx`**

```tsx
import Link from "next/link"

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--color-ink)" }} className="text-white/40">
      <div className="px-6 md:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo + tagline */}
        <div>
          <p className="font-serif italic text-xl text-white/70 mb-3">
            Cala Zingaro
          </p>
          <p className="text-xs leading-relaxed">
            Beach Club & Ristorante<br />
            Milano Marittima (RA)<br />
            Aperto ogni weekend
          </p>
        </div>

        {/* Contatti */}
        <div>
          <p className="text-[0.6rem] tracking-widest uppercase text-white/30 mb-3">
            Contatti
          </p>
          <div className="text-xs leading-loose">
            <a
              href="tel:+393791203796"
              className="block hover:text-white/70 transition-colors"
            >
              +39 379 1203796
            </a>
            <a
              href="mailto:info@calazingaro.com"
              className="block hover:text-white/70 transition-colors"
            >
              info@calazingaro.com
            </a>
            <p className="mt-2 text-white/30">
              Traversa XIX Pineta, 48015
            </p>
          </div>
        </div>

        {/* Social + nav */}
        <div>
          <p className="text-[0.6rem] tracking-widest uppercase text-white/30 mb-3">
            Seguici
          </p>
          <div className="text-xs leading-loose flex flex-col gap-1">
            <a
              href="https://www.instagram.com/calazingaro"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/calazingaro"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div
        className="px-6 md:px-10 py-4 border-t flex justify-between items-center text-[0.6rem] tracking-wide"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <span>© 2026 Cala Zingaro — Patti Srl — P.IVA IT00720310390</span>
        <Link href="/admin/dashboard" className="hover:text-white/40 transition-colors">
          Admin
        </Link>
      </div>
    </footer>
  )
}
```

- [ ] **Aggiungi Footer a `src/app/layout.tsx`** — dopo children:

```tsx
import Footer from "@/components/layout/Footer"

<body className="min-h-full flex flex-col">
  <LenisProvider>
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </LenisProvider>
</body>
```

- [ ] **Commit**

```bash
git add -A && git commit -m "feat: Footer con contatti, social, copyright"
```

---

## Task 5: UI Primitives

**Files:** `src/components/ui/SectionLabel.tsx`, `src/components/ui/RevealText.tsx`

- [ ] **Crea `src/components/ui/SectionLabel.tsx`**

```tsx
interface SectionLabelProps {
  children: React.ReactNode
  light?: boolean
  className?: string
}

export default function SectionLabel({
  children,
  light = false,
  className = "",
}: SectionLabelProps) {
  return (
    <p
      className={`text-[0.6rem] tracking-[0.2em] uppercase mb-3 ${className}`}
      style={{ color: light ? "rgba(244,242,237,0.4)" : "var(--color-subtle)" }}
    >
      {children}
    </p>
  )
}
```

- [ ] **Crea `src/components/ui/RevealText.tsx`**

```tsx
"use client"

import { motion } from "framer-motion"

interface RevealTextProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export default function RevealText({
  children,
  delay = 0,
  className = "",
}: RevealTextProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Commit**

```bash
git add -A && git commit -m "feat: SectionLabel e RevealText components"
```

---

## Task 6: Hero Section

**Files:** `src/components/sections/Hero.tsx`

- [ ] **Crea cartella video placeholder**

```bash
mkdir -p /Users/marco/Desktop/dev/sito-calazingaro/public/video
```

- [ ] **Crea `src/components/sections/Hero.tsx`**

```tsx
"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative h-svh min-h-[600px] flex flex-col overflow-hidden">
      {/* Background: gradiente Adriatico (rimpiazzato da video drone in produzione) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(175deg, #2d5a7a 0%, #3a8fa8 18%, #4ba3bc 30%, #5bbcd4 45%, #7acfdf 58%, #b8d9c8 68%, #d4c5a0 78%, #c8b892 88%, #a89060 100%)",
        }}
      />

      {/* Overlay per leggibilità testo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.04) 40%, rgba(0,0,0,0.12) 60%, rgba(0,0,0,0.68) 100%)",
        }}
      />

      {/* Contenuto — posizionato in basso */}
      <div className="relative flex-1 flex flex-col justify-end px-6 md:px-10 pb-10 md:pb-14">
        <motion.p
          className="text-[0.55rem] tracking-[0.22em] uppercase text-white/50 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Beach Club & Ristorante · Milano Marittima
        </motion.p>

        <motion.h1
          className="font-serif italic font-light text-white leading-none mb-6"
          style={{ fontSize: "clamp(2.8rem, 10vw, 6rem)" }}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          Il mare.<br />
          La tavola.<br />
          <span className="hidden md:inline">Milano Marittima.</span>
          <span className="md:hidden">Milano<br />Marittima.</span>
        </motion.h1>

        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <Link
            href="#prenota"
            className="text-[0.62rem] tracking-widest uppercase bg-white text-[#111] px-5 py-3 rounded-sm hover:bg-white/90 transition-colors"
          >
            Prenota ora
          </Link>
          <span className="text-[0.55rem] tracking-widest uppercase text-white/35">
            ↓ scopri
          </span>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add -A && git commit -m "feat: Hero section con gradiente Adriatico placeholder"
```

---

## Task 7: Sezioni Homepage

**Files:** `src/components/sections/IlLuogo.tsx`, `src/components/sections/RistoranteSection.tsx`, `src/components/sections/SpiaggiaSection.tsx`, `src/components/sections/EventiSection.tsx`, `src/components/sections/PrenotaSection.tsx`

- [ ] **Crea `src/components/sections/IlLuogo.tsx`**

```tsx
import SectionLabel from "@/components/ui/SectionLabel"
import RevealText from "@/components/ui/RevealText"

export default function IlLuogo() {
  return (
    <section style={{ backgroundColor: "var(--color-sand)" }} className="px-6 md:px-10 py-20 md:py-28">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div>
          <RevealText>
            <SectionLabel>Il luogo</SectionLabel>
            <h2
              className="font-serif italic font-light leading-none mb-5"
              style={{ fontSize: "clamp(2.2rem, 6vw, 3.5rem)", color: "var(--color-text)" }}
            >
              Una baita<br />sul mare.
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--color-muted)" }}>
              Traversa XIX Pineta, Milano Marittima. Un posto dove il tempo rallenta:
              sabbia, ombra, cucina di qualità. D&apos;estate il mare a due passi,
              d&apos;inverno la sala al caldo con un buon bicchiere.
            </p>
            <a
              href="/contatti"
              className="text-[0.62rem] tracking-widest uppercase border-b pb-0.5 transition-opacity hover:opacity-60"
              style={{ borderColor: "var(--color-text)", color: "var(--color-text)" }}
            >
              Come raggiungerci →
            </a>
          </RevealText>
        </div>

        {/* Placeholder foto */}
        <RevealText delay={0.15}>
          <div
            className="aspect-[4/3] rounded-sm flex items-center justify-center text-[0.6rem] tracking-widest uppercase"
            style={{ backgroundColor: "var(--color-accent)", color: "rgba(255,255,255,0.5)" }}
          >
            Foto location
          </div>
        </RevealText>
      </div>
    </section>
  )
}
```

- [ ] **Crea `src/components/sections/RistoranteSection.tsx`**

```tsx
import Link from "next/link"
import SectionLabel from "@/components/ui/SectionLabel"
import RevealText from "@/components/ui/RevealText"

export default function RistoranteSection() {
  return (
    <section style={{ backgroundColor: "var(--color-sand-light)" }} className="overflow-hidden">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
        {/* Foto — sinistra su desktop, sopra su mobile */}
        <RevealText>
          <div
            className="min-h-[300px] md:min-h-[480px] flex items-center justify-center text-[0.6rem] tracking-widest uppercase"
            style={{ backgroundColor: "#c8b99a", color: "rgba(255,255,255,0.5)" }}
          >
            Foto food / piatti
          </div>
        </RevealText>

        {/* Testo — destra su desktop */}
        <div className="flex flex-col justify-center px-8 py-16 md:px-12 md:py-20">
          <RevealText delay={0.1}>
            <SectionLabel>Ristorante</SectionLabel>
            <h2
              className="font-serif italic font-light leading-none mb-5"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--color-text)" }}
            >
              Cucina<br />di mare.
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--color-muted)" }}>
              Pranzo, aperitivo, cena e dopocena. Ogni piatto nasce dalla stagione,
              ogni vino è scelto con cura. La sala guarda il mare.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/menu"
                className="text-[0.62rem] tracking-widest uppercase border-b pb-0.5 self-start transition-opacity hover:opacity-60"
                style={{ borderColor: "var(--color-text)", color: "var(--color-text)" }}
              >
                Vedi il menu →
              </Link>
              <Link
                href="#prenota"
                className="text-[0.62rem] tracking-widest uppercase border-b pb-0.5 self-start transition-opacity hover:opacity-60"
                style={{ borderColor: "var(--color-text)", color: "var(--color-text)" }}
              >
                Prenota un tavolo →
              </Link>
            </div>
          </RevealText>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Crea `src/components/sections/SpiaggiaSection.tsx`**

```tsx
import Link from "next/link"
import SectionLabel from "@/components/ui/SectionLabel"
import RevealText from "@/components/ui/RevealText"

export default function SpiaggiaSection() {
  return (
    <section style={{ backgroundColor: "var(--color-night)" }} className="overflow-hidden">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
        {/* Testo — sinistra su desktop */}
        <div className="flex flex-col justify-center px-8 py-16 md:px-12 md:py-20 order-2 md:order-1">
          <RevealText>
            <SectionLabel light>Beach Club</SectionLabel>
            <h2
              className="font-serif italic font-light leading-none mb-5 text-white"
              style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
            >
              La spiaggia<br />è tua.
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(244,242,237,0.55)" }}>
              Ombrelloni, lettini e servizio direttamente in spiaggia.
              Prenota il tuo posto e goditi il mare senza pensieri.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/spiaggia"
                className="text-[0.62rem] tracking-widest uppercase border-b pb-0.5 self-start transition-opacity hover:opacity-60"
                style={{ borderColor: "rgba(244,242,237,0.5)", color: "rgba(244,242,237,0.8)" }}
              >
                Vedi prezzi e servizi →
              </Link>
              <Link
                href="#prenota"
                className="text-[0.62rem] tracking-widest uppercase border-b pb-0.5 self-start transition-opacity hover:opacity-60"
                style={{ borderColor: "rgba(244,242,237,0.5)", color: "rgba(244,242,237,0.8)" }}
              >
                Prenota l&apos;ombrellone →
              </Link>
            </div>
          </RevealText>
        </div>

        {/* Foto — destra su desktop, sopra su mobile */}
        <RevealText delay={0.1}>
          <div
            className="min-h-[300px] md:min-h-[480px] flex items-center justify-center text-[0.6rem] tracking-widest uppercase order-1 md:order-2"
            style={{ backgroundColor: "#3a5f6e", color: "rgba(255,255,255,0.3)" }}
          >
            Foto spiaggia / ombrelloni
          </div>
        </RevealText>
      </div>
    </section>
  )
}
```

- [ ] **Crea `src/components/sections/EventiSection.tsx`**

```tsx
import Link from "next/link"
import SectionLabel from "@/components/ui/SectionLabel"
import RevealText from "@/components/ui/RevealText"

const eventiPlaceholder = [
  { data: "18 Apr · Ven", titolo: "Night Groove", tipo: "DJ Set" },
  { data: "25 Apr · Ven", titolo: "Cooking Lab", tipo: "Esperienza culinaria" },
  { data: "1 Mag · Gio", titolo: "Aperitivo in spiaggia", tipo: "Aperitivo" },
]

export default function EventiSection() {
  return (
    <section style={{ backgroundColor: "var(--color-sand)" }} className="py-20 md:py-28 overflow-hidden">
      <div className="px-6 md:px-10 max-w-5xl mx-auto mb-8 md:mb-12">
        <RevealText>
          <SectionLabel>Serate & eventi</SectionLabel>
          <h2
            className="font-serif italic font-light leading-none"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--color-text)" }}
          >
            Ogni weekend,<br />qualcosa accade.
          </h2>
        </RevealText>
      </div>

      {/* Carousel orizzontale — scroll nativo su mobile */}
      <div className="flex gap-4 px-6 md:px-10 overflow-x-auto pb-2 snap-x snap-mandatory">
        {eventiPlaceholder.map((ev, i) => (
          <RevealText key={ev.titolo} delay={i * 0.1} className="flex-shrink-0 w-[240px] snap-start">
            <div className="rounded-sm overflow-hidden" style={{ backgroundColor: "var(--color-sand-light)" }}>
              <div
                className="h-[140px] flex items-center justify-center text-[0.55rem] tracking-widest uppercase"
                style={{ backgroundColor: "#d4c5b0", color: "rgba(255,255,255,0.5)" }}
              >
                Locandina evento
              </div>
              <div className="p-4">
                <p
                  className="text-[0.58rem] tracking-widest uppercase mb-1"
                  style={{ color: "var(--color-subtle)" }}
                >
                  {ev.data}
                </p>
                <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                  {ev.titolo}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
                  {ev.tipo}
                </p>
              </div>
            </div>
          </RevealText>
        ))}
      </div>

      <div className="px-6 md:px-10 mt-8">
        <Link
          href="/eventi"
          className="text-[0.62rem] tracking-widest uppercase border-b pb-0.5 transition-opacity hover:opacity-60"
          style={{ borderColor: "var(--color-text)", color: "var(--color-text)" }}
        >
          Tutti gli eventi →
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Crea `src/components/sections/PrenotaSection.tsx`**

```tsx
"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function PrenotaSection() {
  return (
    <section
      id="prenota"
      className="py-24 md:py-32 px-6 md:px-10 text-center"
      style={{ backgroundColor: "var(--color-ink)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          className="text-[0.58rem] tracking-[0.22em] uppercase mb-4"
          style={{ color: "rgba(244,242,237,0.3)" }}
        >
          Scegli la tua esperienza
        </p>
        <h2
          className="font-serif italic font-light text-white leading-none mb-4"
          style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}
        >
          Prenota<br />il tuo posto.
        </h2>
        <p
          className="text-sm mb-10"
          style={{ color: "rgba(244,242,237,0.4)" }}
        >
          Ristorante o spiaggia — ogni weekend a Milano Marittima.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto sm:max-w-none">
          <Link
            href="/ristorante#prenota"
            className="text-[0.68rem] tracking-widest uppercase px-8 py-4 rounded-sm transition-opacity hover:opacity-80"
            style={{ backgroundColor: "var(--color-sand)", color: "var(--color-ink)" }}
          >
            Tavolo al ristorante
          </Link>
          <Link
            href="/spiaggia#prenota"
            className="text-[0.68rem] tracking-widest uppercase px-8 py-4 rounded-sm border transition-opacity hover:opacity-80"
            style={{
              borderColor: "rgba(244,242,237,0.2)",
              color: "rgba(244,242,237,0.75)",
            }}
          >
            Ombrellone in spiaggia
          </Link>
        </div>

        {/* WhatsApp */}
        <p className="mt-8 text-xs" style={{ color: "rgba(244,242,237,0.25)" }}>
          Oppure scrivici su{" "}
          <a
            href="https://wa.me/393791203796"
            className="underline hover:text-white/50 transition-colors"
          >
            WhatsApp
          </a>
        </p>
      </motion.div>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add -A && git commit -m "feat: sezioni homepage IlLuogo, Ristorante, Spiaggia, Eventi, Prenota"
```

---

## Task 8: Assembla Homepage

**Files:** `src/app/(public)/page.tsx`, `src/app/(public)/layout.tsx` (nuovo)

- [ ] **Crea `src/app/(public)/layout.tsx`** — layout per il gruppo pubblico (senza header/footer ridondanti se aggiunti nel root):

```tsx
// Il root layout già include Header e Footer
// Questo file è necessario per il route group (public)
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
```

- [ ] **Sostituisci `src/app/(public)/page.tsx`**

```tsx
import Hero from "@/components/sections/Hero"
import IlLuogo from "@/components/sections/IlLuogo"
import RistoranteSection from "@/components/sections/RistoranteSection"
import SpiaggiaSection from "@/components/sections/SpiaggiaSection"
import EventiSection from "@/components/sections/EventiSection"
import PrenotaSection from "@/components/sections/PrenotaSection"

export default function Homepage() {
  return (
    <>
      <Hero />
      <IlLuogo />
      <RistoranteSection />
      <SpiaggiaSection />
      <EventiSection />
      <PrenotaSection />
    </>
  )
}
```

- [ ] **Aggiorna le pagine placeholder** per evitare errori di build — ogni pagina `TODO` deve essere un componente valido. Sostituisci il contenuto di ciascuna con:

Per `/ristorante/page.tsx`, `/spiaggia/page.tsx`, `/menu/page.tsx`, `/vini/page.tsx`, `/eventi/page.tsx`, `/gallery/page.tsx`, `/contatti/page.tsx`:

```tsx
// esempio per /ristorante/page.tsx
export default function Ristorante() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <p className="font-serif italic text-3xl" style={{ color: 'var(--color-muted)' }}>
        Ristorante — Coming soon
      </p>
    </div>
  )
}
```

Adatta il nome della funzione e il testo per ciascuna pagina.

- [ ] **Aggiorna anche `/admin/dashboard/page.tsx`** con un placeholder valido:

```tsx
export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <p className="font-serif italic text-2xl" style={{ color: 'var(--color-muted)' }}>
        Admin Dashboard — Coming soon
      </p>
    </div>
  )
}
```

- [ ] **Build di verifica**

```bash
pnpm build 2>&1 | tail -30
```
Atteso: `✓ Compiled successfully`, zero errori TypeScript, zero errori ESLint.

Se ci sono errori: leggili, correggi, ri-esegui build prima di procedere.

- [ ] **Commit**

```bash
git add -A && git commit -m "feat: homepage completa con tutte le sezioni"
```

---

## Task 9: Deploy su Vercel

- [ ] **Verifica che Vercel CLI sia installata**

```bash
vercel --version
```
Se non installata: `pnpm add -g vercel`

- [ ] **Login Vercel** (se non già loggato)

```bash
vercel whoami
```
Se non loggato: `vercel login`

- [ ] **Deploy preview** (senza production flag — bozza)

```bash
cd /Users/marco/Desktop/dev/sito-calazingaro && vercel
```

Alla prima esecuzione rispondere:
- Set up and deploy? **Y**
- Which scope? → scegli il tuo account
- Link to existing project? **N**
- Project name: `calazingaro`
- In which directory is your code located? `.`
- Override settings? **N**

- [ ] **Copia l'URL preview** restituito (es. `https://calazingaro-xxx.vercel.app`) e aprilo nel browser mobile per verificare.

- [ ] **Commit finale con URL nel messaggio**

```bash
git add -A && git commit -m "chore: primo deploy bozza su Vercel"
git push origin session/2026-04-07_11-04
```

---

## Self-Review

**Copertura spec:**
- ✅ Font: Satoshi + Cormorant Garamond Italic
- ✅ Palette: sand/night/ink, no bianco/nero puri
- ✅ Lenis smooth scroll
- ✅ Framer Motion whileInView (no useScroll)
- ✅ Header trasparente → solido allo scroll
- ✅ MobileMenu fullscreen antracite
- ✅ Hero 100vh con gradiente placeholder
- ✅ Sezioni: IlLuogo, Ristorante, Spiaggia, Eventi, Prenota
- ✅ Footer con contatti, social, copyright
- ✅ Mobile-first (grid-cols-1 di default, md:grid-cols-2)
- ✅ pnpm build prima del deploy
- ✅ Deploy Vercel

**Nota:** Le pagine interne (ristorante, spiaggia, menu, vini, eventi, gallery, contatti) sono placeholder. Verranno costruite in piani successivi.
