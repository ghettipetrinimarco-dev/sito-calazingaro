# Chalk Menu Toggle — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sostituire le icone Lucide hamburger e X con i chalk SVG creati in `src/assets/chalk/`, animando la transizione tra i due stati con fisica spring (stiffness: 260, damping: 20 — TASTE_RULES interazioni).

**Architettura:** Nuovo componente `MenuToggle` estratto come elemento `position: fixed z-[60]`, sibling di `<header>` e `<MobileMenu>` nel fragment di `Header.tsx`. Stando fuori dallo stacking context dell'header (z-40), il toggle resta visibile sopra il pannello menu (z-50). `AnimatePresence mode="wait"` gestisce il crossfade sequenziale hamburger→X. Il pulsante X viene rimosso da `MobileMenu.tsx`.

**Tech Stack:** Next.js App Router, TypeScript strict, Framer Motion (AnimatePresence, motion.div), React useId

---

## Mappa file

| File | Azione | Responsabilità |
|------|--------|----------------|
| `src/components/layout/MenuToggle.tsx` | CREATE | Pulsante toggle fisso z-[60], chalk SVG inline, AnimatePresence |
| `src/components/layout/Header.tsx` | MODIFY | Rimuove button hamburger + import Menu+X lucide; aggiunge `<MenuToggle>` come sibling nel fragment |
| `src/components/layout/MobileMenu.tsx` | MODIFY | Rimuove pulsante X, rimuove prop `scrolled` |

---

## Perché `position: fixed` per MenuToggle

`<header>` ha `position: fixed; z-index: 40` → crea uno stacking context.
Qualsiasi figlio, anche con `z-[9999]`, non può superare il livello z dello stacking context padre (40).
`MobileMenu` è a z-50, quindi sovrasta l'header.
**Soluzione:** `MenuToggle` è `position: fixed` fuori dall'header → stacking context proprio → z-[60] > z-50 ✓

---

## Nota sugli ID SVG filter

Gli ID SVG (`chalk-h`, `chalk-x`) sono globali nel documento. Con `AnimatePresence mode="wait"` non ci sono due icone simultanee, ma per correttezza si usa `useId()` per rendere gli ID univoci per istanza.

---

## Task 1 — Crea `MenuToggle.tsx`

**File:** `src/components/layout/MenuToggle.tsx` (CREATE)

- [ ] **Step 1.1 — Crea il file**

```tsx
"use client"

import { useId } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Parametri TASTE_RULES: stiffness 260 / damping 20 per interazioni
const springInteraction = { type: "spring" as const, stiffness: 260, damping: 20 }

interface MenuToggleProps {
  isOpen: boolean
  onToggle: () => void
  scrolled: boolean
}

export default function MenuToggle({ isOpen, onToggle, scrolled }: MenuToggleProps) {
  const uid = useId()
  const hId = `${uid}-chalk-h`
  const xId = `${uid}-chalk-x`

  // top: allineato al centro verticale dell'header (scrolled: 64px → 32px, !scrolled: 108px → 54px)
  const topPx = scrolled ? 32 : 54

  return (
    <button
      onClick={onToggle}
      aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
      className="fixed right-6 md:right-10 z-[60]"
      style={{
        top: topPx,
        transform: "translateY(-50%)",
        // Colore: bianco sull'hero, var(--color-text) sulla navbar scrollata
        color: isOpen ? "rgba(255, 248, 240, 0.9)" : scrolled ? "var(--color-text)" : "#fff",
        transition: "color 0.5s cubic-bezier(0.22, 1, 0.36, 1), top 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        // Area tap più grande del visivo (accessibilità touch)
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 44,
        height: 44,
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!isOpen ? (
          // ── HAMBURGER ──
          <motion.span
            key="hamburger"
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={springInteraction}
            style={{ display: "block", width: 20, height: 20 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              width="20"
              height="20"
            >
              <defs>
                <filter id={hId} x="-20%" y="-60%" width="140%" height="220%">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.035 0.11"
                    numOctaves={4}
                    seed={3}
                    result="wave"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="wave"
                    scale={1.6}
                    xChannelSelector="R"
                    yChannelSelector="G"
                    result="displaced"
                  />
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.72"
                    numOctaves={2}
                    seed={9}
                    result="pores"
                  />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3 0 0 0 -1.3"
                    in="pores"
                    result="poreMask"
                  />
                  <feComposite in="displaced" in2="poreMask" operator="in" />
                </filter>
              </defs>
              <g
                filter={`url(#${hId})`}
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                fill="none"
              >
                <path d="M 2.2 5.5 C 6.8 5.2, 13.1 5.8, 21.8 5.4" />
                <path d="M 2.1 12.0 C 6.9 12.3, 13.2 11.7, 21.9 12.1" />
                <path d="M 2.3 18.5 C 6.7 18.2, 13.0 18.7, 21.7 18.3" />
              </g>
            </svg>
          </motion.span>
        ) : (
          // ── CHIUDI X ──
          <motion.span
            key="close"
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={springInteraction}
            style={{ display: "block", width: 20, height: 20 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              width="20"
              height="20"
            >
              <defs>
                <filter id={xId} x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.035 0.11"
                    numOctaves={4}
                    seed={5}
                    result="wave"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="wave"
                    scale={1.6}
                    xChannelSelector="R"
                    yChannelSelector="G"
                    result="displaced"
                  />
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.72"
                    numOctaves={2}
                    seed={14}
                    result="pores"
                  />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3 0 0 0 -1.3"
                    in="pores"
                    result="poreMask"
                  />
                  <feComposite in="displaced" in2="poreMask" operator="in" />
                </filter>
              </defs>
              <g
                filter={`url(#${xId})`}
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                fill="none"
              >
                <path d="M 4.1 4.0 C 8.2 8.3, 13.8 13.7, 19.9 20.1" />
                <path d="M 19.9 4.0 C 15.8 8.3, 10.2 13.7, 4.1 20.1" />
              </g>
            </svg>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
```

---

## Task 2 — Modifica `Header.tsx`

**File:** `src/components/layout/Header.tsx` (MODIFY)

- [ ] **Step 2.1 — Rimuovi import Lucide e aggiungi MenuToggle**

Cambia la riga degli import da:
```tsx
import { usePathname } from "next/navigation"
import { useScroll } from "framer-motion"
import { Menu } from "lucide-react"
import MobileMenu from "./MobileMenu"
```
a:
```tsx
import { usePathname } from "next/navigation"
import { useScroll } from "framer-motion"
import MobileMenu from "./MobileMenu"
import MenuToggle from "./MenuToggle"
```

- [ ] **Step 2.2 — Rimuovi il button hamburger e aggiungi MenuToggle come sibling**

Rimuovi questo blocco dall'interno dell'`<header>`:
```tsx
{/* Hamburger — sempre visibile, bianco sull'hero e scuro sulla navbar */}
<button
  onClick={() => setMenuOpen(true)}
  aria-label="Apri menu"
  className="absolute right-6 md:right-10"
  style={{
    top: "50%",
    transform: "translateY(-50%)",
    color: scrolled ? "var(--color-text)" : "#fff",
    transition,
  }}
>
  <Menu size={20} strokeWidth={1.5} />
</button>
```

Aggiungi `<MenuToggle>` nel fragment, tra `</header>` e `<MobileMenu>`:
```tsx
return (
  <>
    <header ...>
      {/* logo e prenota — invariati */}
    </header>

    <MenuToggle
      isOpen={menuOpen}
      onToggle={() => setMenuOpen((v) => !v)}
      scrolled={scrolled}
    />

    <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
  </>
)
```

---

## Task 3 — Modifica `MobileMenu.tsx`

**File:** `src/components/layout/MobileMenu.tsx` (MODIFY)

- [ ] **Step 3.1 — Rimuovi import X da lucide e rimuovi prop `scrolled`**

Cambia:
```tsx
import { Phone, MapPin, ArrowUpRight, X } from "lucide-react"
```
in:
```tsx
import { Phone, MapPin, ArrowUpRight } from "lucide-react"
```

Cambia l'interfaccia:
```tsx
interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}
```
(rimuovi `scrolled: boolean`)

Aggiorna la firma della funzione:
```tsx
export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
```

- [ ] **Step 3.2 — Rimuovi il pulsante X**

Rimuovi l'intero blocco:
```tsx
{/* X — absolute (non fixed: il parent ha transform attivo). ... */}
<button
  onClick={onClose}
  aria-label="Chiudi menu"
  className="absolute right-6 md:right-10"
  style={{
    top: scrolled ? 32 : 54,
    transform: "translateY(-50%)",
    color: "rgba(255, 248, 240, 0.9)",
  }}
>
  <X size={20} strokeWidth={1.5} />
</button>
```

---

## Task 4 — Verifica build

- [ ] **Step 4.1 — Build**
```bash
pnpm build
```
Atteso: nessun errore TypeScript, nessun warning critico.

- [ ] **Step 4.2 — Commit**
```bash
git add src/components/layout/MenuToggle.tsx \
        src/components/layout/Header.tsx \
        src/components/layout/MobileMenu.tsx
git commit -m "feat: sostituisce icone lucide con chalk SVG animati, toggle z-[60]"
```

---

## Self-review checklist

- [x] **scrolled prop**: rimossa da MobileMenu ma mantenuta in MenuToggle per posizionamento e colore ✓
- [x] **z-index**: MenuToggle fixed z-[60] > MobileMenu z-[50] > header z-[40] ✓
- [x] **filter ID univoci**: `useId()` garantisce unicità anche se il componente venisse montato due volte ✓
- [x] **onToggle vs onClose**: Header passa `onToggle` (toggle) al MenuToggle, `onClose` (solo chiudi) a MobileMenu — coerente con il click-outside handler di MobileMenu ✓
- [x] **currentColor**: i chalk SVG ereditano `color` dal button → colore sincronizzato con la navbar ✓
- [x] **Transition top**: `transition` sul `top` del button in MenuToggle replica il comportamento fluido dell'header ✓
