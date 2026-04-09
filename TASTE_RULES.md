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

## 4. TIPOGRAFIA
- **Headings:** Quicksand (o font di progetto), semi-bold, tracking-tighter.
- **Body:** Leggibilità massima, contrasto morbido (mai #FFF su #000, usa zinc-300).
