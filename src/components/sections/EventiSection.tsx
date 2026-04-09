"use client"

import { LazyMotion, domAnimation, m } from "framer-motion"
import Image from "next/image"
import SectionLabel from "@/components/ui/SectionLabel"
import RevealText from "@/components/ui/RevealText"
import OrganicLine from "@/components/ui/OrganicLine"

const SPRING_HOVER = { type: "spring" as const, stiffness: 260, damping: 20 }
const SPRING_APPEAR = { type: "spring" as const, stiffness: 100, damping: 15 }

// Stelle dim — punti di luce appena percettibili [cx%, cy%, r, opacity]
const STELLE_DIM: ReadonlyArray<readonly [number, number, number, number]> = [
  [4.2, 8.1, 0.28, 0.30], [11.7, 3.4, 0.22, 0.25], [18.3, 14.6, 0.30, 0.35],
  [26.5, 7.2, 0.25, 0.28], [33.1, 19.8, 0.28, 0.32], [41.6, 4.7, 0.22, 0.26],
  [49.8, 11.3, 0.30, 0.35], [57.4, 6.8, 0.25, 0.28], [64.9, 17.2, 0.28, 0.30],
  [72.3, 2.9, 0.22, 0.25], [80.6, 12.7, 0.30, 0.35], [88.1, 8.4, 0.25, 0.28],
  [95.7, 16.3, 0.28, 0.32], [7.8, 31.5, 0.22, 0.26], [15.4, 26.8, 0.30, 0.30],
  [23.9, 38.4, 0.25, 0.28], [30.2, 24.1, 0.28, 0.32], [38.7, 33.6, 0.22, 0.25],
  [46.3, 21.9, 0.30, 0.35], [53.8, 42.3, 0.25, 0.28], [61.2, 29.7, 0.28, 0.30],
  [69.5, 37.1, 0.22, 0.26], [77.1, 23.8, 0.30, 0.32], [85.4, 41.6, 0.25, 0.28],
  [92.8, 28.4, 0.28, 0.35], [2.6, 52.3, 0.22, 0.25], [9.3, 47.8, 0.30, 0.30],
  [17.6, 61.4, 0.25, 0.28], [25.1, 54.9, 0.28, 0.32], [34.8, 67.3, 0.22, 0.25],
  [43.2, 58.7, 0.30, 0.30], [51.7, 72.1, 0.25, 0.28], [60.4, 63.5, 0.28, 0.32],
  [68.9, 76.8, 0.22, 0.25], [78.3, 69.2, 0.30, 0.30], [87.6, 81.4, 0.25, 0.28],
  [96.2, 74.7, 0.28, 0.32],
] as const

// Stelle medie — visibili, punto di luce netto
const STELLE_MEDIE: ReadonlyArray<readonly [number, number, number, number]> = [
  [8.4, 22.7, 0.48, 0.60], [21.3, 10.5, 0.52, 0.65], [35.6, 28.3, 0.45, 0.58],
  [48.2, 16.9, 0.50, 0.62], [63.7, 35.4, 0.48, 0.60], [76.4, 19.8, 0.52, 0.65],
  [89.1, 44.2, 0.45, 0.58], [14.7, 57.6, 0.50, 0.62], [39.8, 83.1, 0.48, 0.60],
  [58.3, 48.7, 0.52, 0.65], [82.6, 61.3, 0.45, 0.58], [3.9, 86.4, 0.50, 0.62],
] as const

// Stelle brillanti — alone e spike di diffrazione
const STELLE_BRILLANTI: ReadonlyArray<readonly [number, number, number]> = [
  [55.2, 8.3, 0.85],
  [27.8, 43.1, 0.75],
  [71.5, 31.7, 0.80],
  [14.3, 18.6, 0.70],
] as const

const eventi = [
  {
    id: "night-groove",
    src: "/Eventi/Eventi_1.webp",
    data: "18 Apr · Ven",
    titolo: "Night Groove",
    tipo: "DJ Set",
  },
  {
    id: "cooking-lab",
    src: "/Eventi/Eventi_2.webp",
    data: "25 Apr · Ven",
    titolo: "Cooking Lab",
    tipo: "Esperienza culinaria",
  },
  {
    id: "aperitivo",
    src: "/Ambiente/Cala-Zingaro-Ambiente-9.webp",
    data: "1 Mag · Gio",
    titolo: "Aperitivo in spiaggia",
    tipo: "Aperitivo",
  },
  {
    id: "stelle",
    src: "/Ambiente/Cala-Zingaro-Ambiente-7.webp",
    data: "10 Mag · Sab",
    titolo: "Cena sotto le stelle",
    tipo: "Cena speciale",
  },
] as const

type Evento = typeof eventi[number]

interface EventCardProps {
  evento: Evento
  hero?: boolean
  className?: string
  sizes?: string
  delay?: number
}

function EventCard({
  evento,
  hero = false,
  className = "",
  sizes = "33vw",
  delay = 0,
}: EventCardProps) {
  return (
    <m.div
      className={`relative overflow-hidden cursor-pointer ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...SPRING_APPEAR, delay }}
      whileHover="hover"
    >
      {/* Bordo sottile angolare */}
      <div className="absolute inset-0 border border-white/10 pointer-events-none z-10" />

      {/* Immagine con scala spring su hover */}
      <m.div
        className="absolute inset-0"
        variants={{ hover: { scale: 1.06 } }}
        transition={SPRING_HOVER}
      >
        <Image
          src={evento.src}
          alt={evento.titolo}
          fill
          sizes={sizes}
          className="object-cover"
          priority={hero}
        />
      </m.div>

      {/* Overlay sfumato */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent pointer-events-none" />

      {/* Testo — sale su hover */}
      <m.div
        className="absolute bottom-0 left-0 right-0 p-5 md:p-6"
        variants={{ hover: { y: -5 } }}
        transition={SPRING_HOVER}
      >
        <p
          className="text-[0.6rem] tracking-widest uppercase mb-1.5"
          style={{ color: "rgba(244,242,237,0.4)" }}
        >
          {evento.data} · {evento.tipo}
        </p>
        <p
          style={{
            fontFamily: "var(--font-yanone)",
            fontWeight: 300,
            fontSize: hero ? "clamp(1.8rem, 3.5vw, 2.6rem)" : "1.4rem",
            color: "var(--color-sand)",
            letterSpacing: "0.01em",
          }}
        >
          {evento.titolo}
        </p>
      </m.div>
    </m.div>
  )
}

export default function EventiSection() {
  const [hero, ...rest] = eventi

  return (
    <LazyMotion features={domAnimation}>
      <section
        className="relative overflow-hidden py-20 md:py-28"
        style={{ backgroundColor: "#1c1c1f" }}
      >
        {/* Cielo notturno — velature e stelle realistiche */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Velature nuvolose */}
          <div className="absolute" style={{
            top: "0%", left: "5%", width: "50%", height: "40%",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.018) 0%, transparent 65%)",
            filter: "blur(52px)",
          }} />
          <div className="absolute" style={{
            top: "30%", left: "50%", width: "42%", height: "35%",
            background: "radial-gradient(ellipse, rgba(210,220,255,0.014) 0%, transparent 65%)",
            filter: "blur(60px)",
          }} />
          <div className="absolute" style={{
            top: "62%", left: "18%", width: "34%", height: "28%",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.012) 0%, transparent 65%)",
            filter: "blur(48px)",
          }} />

          {/* SVG stelle */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Alone per stelle brillanti */}
              <filter id="glow-bright" x="-300%" y="-300%" width="700%" height="700%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.9" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Stelle dim */}
            {STELLE_DIM.map(([cx, cy, r, opacity], i) => (
              <circle key={`dim-${i}`} cx={cx} cy={cy} r={r} fill="white" opacity={opacity} />
            ))}

            {/* Stelle medie */}
            {STELLE_MEDIE.map(([cx, cy, r, opacity], i) => (
              <circle key={`med-${i}`} cx={cx} cy={cy} r={r} fill="white" opacity={opacity} />
            ))}

            {/* Stelle brillanti — alone + spike di diffrazione */}
            {STELLE_BRILLANTI.map(([cx, cy, r], i) => (
              <g key={`bright-${i}`} filter="url(#glow-bright)">
                <circle cx={cx} cy={cy} r={r} fill="white" opacity={0.95} />
                {/* Spike orizzontale */}
                <line
                  x1={cx - 2.2} y1={cy} x2={cx + 2.2} y2={cy}
                  stroke="white" strokeWidth={0.12} opacity={0.35}
                />
                {/* Spike verticale */}
                <line
                  x1={cx} y1={cy - 2.2} x2={cx} y2={cy + 2.2}
                  stroke="white" strokeWidth={0.12} opacity={0.35}
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Header sezione */}
        <div className="relative px-6 md:px-16 mb-8 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <RevealText>
            <SectionLabel style={{ color: "rgba(244,242,237,0.35)" }}>Serate & eventi</SectionLabel>
            <h2
              className="title-display mt-3"
              style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)", color: "var(--color-sand)" }}
            >
              Ogni weekend,<br />qualcosa accade.
            </h2>
          </RevealText>
        </div>

        {/* Separatore organico */}
        <div className="relative px-6 md:px-16 mb-10 md:mb-12">
          <OrganicLine color="white" opacity={0.12} />
        </div>

        {/* Bento Grid */}
        <div className="relative px-6 md:px-16">
          {/* Mobile — stack verticale, angoli netti */}
          <div className="flex flex-col gap-3 md:hidden">
            <EventCard
              evento={hero}
              hero
              className="aspect-[4/5]"
              sizes="94vw"
            />
            {rest.map((ev, i) => (
              <EventCard
                key={ev.id}
                evento={ev}
                className="aspect-[4/3]"
                sizes="94vw"
                delay={i * 0.06}
              />
            ))}
          </div>

          {/* Desktop — bento asimmetrico 3×3, angoli netti */}
          {/* [ Hero 2×2        ] [ Card2 ] */}
          {/* [ Hero 2×2        ] [ Card3 ] */}
          {/* [ Card4 full-width 3×1      ] */}
          <div
            className="hidden md:grid md:grid-cols-3 md:grid-rows-3 gap-3"
            style={{ height: "clamp(500px, 72vh, 700px)" }}
          >
            <EventCard
              evento={hero}
              hero
              className="md:col-span-2 md:row-span-2"
              sizes="(max-width: 1280px) 66vw, 800px"
            />
            <EventCard
              evento={rest[0]}
              className="md:col-span-1 md:row-span-1"
              sizes="(max-width: 1280px) 33vw, 400px"
              delay={0.08}
            />
            <EventCard
              evento={rest[1]}
              className="md:col-span-1 md:row-span-1"
              sizes="(max-width: 1280px) 33vw, 400px"
              delay={0.12}
            />
            <EventCard
              evento={rest[2]}
              className="md:col-span-3 md:row-span-1"
              sizes="(max-width: 1280px) 100vw, 1200px"
              delay={0.16}
            />
          </div>
        </div>
      </section>
    </LazyMotion>
  )
}
