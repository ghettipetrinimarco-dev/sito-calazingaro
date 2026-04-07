# Design Spec — Cala Zingaro Website
_Data: 2026-04-07_

## Contesto

**Cliente:** Cala Zingaro — Beach Club & Ristorante, Milano Marittima (RA)
**Brand:** 32.9k follower Instagram verificato. Posizionamento luxury-accessible, "dolce vita adriatica".
**Obiettivo:** Sito doppio — vetrina di brand + conversione prenotazioni (ristorante e spiaggia).
**Target:** Turisti in scoperta, clienti in zona in fase decisione, clienti abituali per conversione diretta.
**Livello:** Awwwards-quality. Riferimenti: The Largo (immersività), Scorpios (estetica).

---

## Approccio architetturale

**Hybrid C**: homepage narrativa long-scroll + pagine dedicate con page transitions.

- Homepage = scroll cinematografico che racconta il brand completo
- Ogni sezione ha una pagina dedicata per SEO e trattamento editoriale completo
- Transizioni fluide tra pagine (Framer Motion AnimatePresence)

---

## Stack tecnico

- **Framework**: Next.js 16 App Router
- **Stile**: Tailwind CSS v4
- **Smooth scroll**: Lenis (wrapper client nel layout)
- **Animazioni**: Framer Motion v12 — solo `whileInView`, mai `useScroll` (bug v12)
- **Scroll color shift**: Intersection Observer vanilla (no useScroll)
- **Hero video**: `<video autoplay muted loop playsInline>` + fallback foto statica (poster)
- **Font**: Satoshi (Fontshare CDN) + Cormorant Garamond Italic (Google Fonts)
- **Immagini**: next/image obbligatorio
- **Deploy**: Vercel

---

## Sistema visivo

### Palette colori
```
--color-sand:      #F4F2ED   ← sfondo sezioni giorno
--color-white-off: #FAFAF7   ← sfondo card, ristorante
--color-night:     #1A1A1A   ← sfondo sezioni notte/spiaggia
--color-black:     #0D0D0D   ← footer, prenota CTA
--color-text:      #111111   ← testo principale
--color-muted:     #888888   ← testo secondario
--color-accent:    #C8A87A   ← accenti (dorato sabbia)
```
**Regola**: mai bianco ottico (#FFF puro), mai nero puro (#000). Sempre off-white e off-black.

### Tipografia
```
Font UI (nav, body, label, bottoni): Satoshi — peso 300, 400, 500
Font Hero (titoli grandi, section titles): Cormorant Garamond Italic — peso 300
Font Menu/Vini (testi lunghi): Manrope — peso 300, 400
Font Footer/metadata (testi mini): Switzer — peso 300
```

### Motion
- **Lenis**: smooth scroll su tutto il sito (wrapper in layout.tsx client component)
- **Reveal**: Framer `whileInView` + `initial={{ opacity: 0, y: 24 }}` → `animate={{ opacity: 1, y: 0 }}`
- **Parallasse immagini**: leggero, CSS transform via Intersection Observer
- **Color shift**: da sand a night allo scroll, via Intersection Observer su sezione spiaggia
- **Nav**: trasparente sulla hero → sabbia/bianca allo scroll (transition CSS)
- **Page transitions**: Framer AnimatePresence nel layout

---

## Struttura pagine

### Homepage (scroll narrativo)
1. **Nav** — trasparente sulla hero, logo Cormorant, hamburger + pill "Prenota"
2. **Hero** — 100vh, video drone cinematic (fallback: foto), titolo Cormorant in basso
3. **Il luogo** — intro editoriale, sfondo sand, foto atmosferica
4. **Ristorante** — foto food sinistra + testo destra (desktop), stacked mobile, CTA → /ristorante
5. **Spiaggia** — sfondo night, foto beach + testo, CTA → /spiaggia (triggera color shift)
6. **Drink/Aperitivo** — singola foto cocktail + copy breve
7. **Eventi** — titolo + carousel orizzontale 3 card (mobile scroll), CTA → /eventi
8. **Prenota** — sfondo nero, dual CTA: ristorante / spiaggia
9. **Footer** — logo, contatti, social, copyright

### Altre pagine
- `/ristorante` — full editorial, foto, copy, CTA menu e prenotazione
- `/spiaggia` — prezzi, servizi, form prenotazione ombrelloni
- `/menu` — HTML da `data/menu.ts`, font Manrope, revalidate 60s
- `/vini` — carta vini HTML, stessa struttura
- `/eventi` — calendario eventi con card, info WhatsApp per prenotare
- `/gallery` — griglia fotografica masonry
- `/contatti` — mappa, orari, social, form contatto

### Admin
- `/admin/dashboard` — gestione prenotazioni, tavoli, layout sala (già strutturato)

---

## Componenti chiave

```
components/
├── layout/
│   ├── Header.tsx          ← nav trasparente → solida allo scroll
│   ├── Footer.tsx
│   └── LenisProvider.tsx   ← 'use client', wrapper Lenis
├── ui/
│   ├── Button.tsx
│   ├── SectionLabel.tsx    ← label uppercase piccola
│   └── RevealText.tsx      ← Framer whileInView wrapper
├── sections/
│   ├── Hero.tsx            ← video + fallback foto
│   ├── IlLuogo.tsx
│   ├── RistoranteSection.tsx
│   ├── SpiaggiaSection.tsx
│   ├── EventiSection.tsx
│   └── PrenotaSection.tsx
```

---

## Navigazione hamburger

Menu overlay fullscreen al click hamburger:
- Sfondo: antracite #1A1A1A
- Voci: Cormorant Garamond Italic grandi, animazione stagger
- Voci: Ristorante / Spiaggia / Menu / Vini / Eventi / Gallery / Contatti / **Prenota** (CTA)
- Chiusura: × o click fuori

---

## Stagionalità

`lib/season.ts` già presente. Usato per:
- Mostrare/nascondere sezione spiaggia (solo estate)
- Cambiare copy hero ("ogni weekend" → "questo weekend aperto")
- Mostrare banner orari ridotti invernali

---

## SEO

Ogni pagina: `metadata` con title, description (140-160 char), canonical, OG.
Homepage: Schema.org `Restaurant` JSON-LD.

---

## Note implementative

- `pnpm add lenis @studio-freight/lenis` — scegliere versione compatibile App Router
- Satoshi via `<link>` in layout (non next/font — non è Google/locale)
- Cormorant Garamond via `next/font/google`
- Video hero: file `.mp4` in `/public/video/hero.mp4` (placeholder per ora)
- `sharp` già configurato in next.config.ts
