# TASTE_RULES: Beach Club & Ristorante Standard

## 1. ESTETICA & FEELING
- **Standard:** High-End Hospitality (stile Vercel/Linear applicato al luxury).
- **Vietato:** Uppercase esasperato, tracking > 0.1em, font sotto i 12px (0.75rem).
- **Finiture:** Bordi `border-white/10`, backdrop-blur per componenti floating, ombre stratificate (non sfuocate).

## 2. MOVIMENTO (Framer Motion)
- **Fisica:** Solo `type: "spring"`.
- **Parametri:** `stiffness: 260, damping: 20` per interazioni; `stiffness: 100, damping: 15` per apparizioni.

## 3. ASSET & PLACEHOLDER
- Se mancano immagini reali, usa placeholder coerenti con l'estetica: gradiente sabbia/mare, pattern SVG, o `https://picsum.photos/seed/calazingaro/800/600`.
- Non bloccarti su asset mancanti — crea il placeholder, segnala cosa sostituire.
- Per sfondi blur: qualsiasi foto `public/Ambiente/` va bene come default.

## 5. ORGANICITÀ (chalk style)
- **Nessuna linea dritta decorativa** — usare `<OrganicLine />` per separatori e divisori.
- **Nessun `border-b` su link testuali** — usare `<OrganicLink />` per CTA con underline.
- **Intensità:** displacement `scale` max 2 per linee, max 1.5 per underline — appena percettibile, non cartoonesco.
- I componenti vivono in `src/components/ui/OrganicLine.tsx` e `OrganicLink.tsx`.

## 4. TIPOGRAFIA
- **Headings:** Quicksand (o font di progetto), semi-bold, tracking-tighter.
- **Body:** Leggibilità massima, contrasto morbido (mai #FFF su #000, usa zinc-300).
