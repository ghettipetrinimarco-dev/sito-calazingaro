"use client"

import { LazyMotion, domAnimation, m } from "framer-motion"
import Image from "next/image"
import SectionLabel from "@/components/ui/SectionLabel"
import RevealText from "@/components/ui/RevealText"
import OrganicLink from "@/components/ui/OrganicLink"

const SPRING_HOVER = { type: "spring" as const, stiffness: 260, damping: 20 }
const SPRING_APPEAR = { type: "spring" as const, stiffness: 100, damping: 15 }

// Stelle fisse — posizioni deterministiche [cx%, cy%, raggio, opacità]
const STELLE: ReadonlyArray<readonly [number, number, number, number]> = [
  [8.2, 12.4, 0.5, 0.70], [15.6, 5.8, 0.35, 0.50], [23.1, 18.3, 0.6, 0.80],
  [31.4, 8.7, 0.40, 0.60], [42.8, 14.2, 0.55, 0.75], [51.3, 6.1, 0.30, 0.45],
  [62.7, 11.8, 0.50, 0.70], [73.2, 4.3, 0.40, 0.55], [84.1, 16.7, 0.60, 0.80],
  [91.5, 9.4, 0.35, 0.50], [5.8, 28.3, 0.40, 0.60], [18.4, 35.6, 0.30, 0.40],
  [28.9, 22.1, 0.55, 0.70], [37.2, 41.8, 0.40, 0.60], [47.5, 29.4, 0.35, 0.50],
  [58.3, 38.2, 0.50, 0.65], [66.8, 24.7, 0.30, 0.45], [77.4, 33.5, 0.55, 0.75],
  [86.7, 27.3, 0.40, 0.60], [95.2, 42.1, 0.35, 0.50], [11.3, 47.8, 0.30, 0.40],
  [22.7, 53.4, 0.50, 0.65], [33.8, 48.2, 0.40, 0.55], [44.1, 61.7, 0.35, 0.50],
  [54.6, 44.3, 0.55, 0.70], [65.2, 55.8, 0.30, 0.45], [75.8, 49.1, 0.50, 0.65],
  [88.3, 58.4, 0.40, 0.55], [96.7, 52.6, 0.35, 0.50], [3.4, 63.2, 0.45, 0.60],
  [14.8, 71.5, 0.30, 0.40], [26.3, 66.8, 0.50, 0.65], [38.7, 74.3, 0.35, 0.50],
  [49.2, 68.6, 0.40, 0.55], [61.5, 77.1, 0.55, 0.70], [72.4, 63.8, 0.30, 0.45],
  [83.6, 71.4, 0.45, 0.60], [93.1, 66.2, 0.35, 0.50], [7.9, 82.7, 0.40, 0.55],
  [19.5, 88.3, 0.30, 0.40], [31.2, 79.5, 0.50, 0.65], [43.8, 85.1, 0.35, 0.50],
  [55.4, 91.7, 0.45, 0.60], [67.1, 83.4, 0.30, 0.45], [79.6, 89.2, 0.50, 0.65],
  [90.8, 78.6, 0.40, 0.55], [13.7, 15.2, 0.60, 0.85], [57.8, 2.8, 0.65, 0.90],
  [81.2, 45.7, 0.60, 0.80], [36.5, 3.4, 0.40, 0.55], [97.3, 21.6, 0.45, 0.65],
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
      className={`relative overflow-hidden rounded-3xl border border-white/10 cursor-pointer ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...SPRING_APPEAR, delay }}
      whileHover="hover"
    >
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
        style={{ backgroundColor: "#181824" }}
      >
        {/* Sfondo: cielo notturno estivo con velature e stelle */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Velature nuvolose — radial gradients morbidi */}
          <div
            className="absolute"
            style={{
              top: "5%", left: "10%", width: "45%", height: "35%",
              background: "radial-gradient(ellipse, rgba(255,255,255,0.022) 0%, transparent 70%)",
              filter: "blur(48px)",
            }}
          />
          <div
            className="absolute"
            style={{
              top: "35%", left: "55%", width: "38%", height: "30%",
              background: "radial-gradient(ellipse, rgba(200,210,255,0.018) 0%, transparent 70%)",
              filter: "blur(56px)",
            }}
          />
          <div
            className="absolute"
            style={{
              top: "60%", left: "20%", width: "30%", height: "25%",
              background: "radial-gradient(ellipse, rgba(255,255,255,0.014) 0%, transparent 70%)",
              filter: "blur(44px)",
            }}
          />

          {/* Stelle — SVG con posizioni fisse */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
          >
            {STELLE.map(([cx, cy, r, opacity], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill="white"
                opacity={opacity}
              />
            ))}
          </svg>
        </div>

        {/* Header sezione */}
        <div className="relative px-6 md:px-16 mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <RevealText>
            <SectionLabel style={{ color: "rgba(244,242,237,0.35)" }}>Serate & eventi</SectionLabel>
            <h2
              className="title-display mt-3"
              style={{ fontSize: "clamp(3.5rem, 10vw, 8rem)", color: "var(--color-sand)" }}
            >
              Ogni weekend,<br />qualcosa accade.
            </h2>
          </RevealText>
          <RevealText delay={0.1} className="md:pb-2">
            <OrganicLink
              href="/eventi"
              color="rgba(244,242,237,0.5)"
              className="text-[0.7rem] tracking-widest uppercase hover:opacity-80 transition-opacity"
            >
              Tutti gli eventi →
            </OrganicLink>
          </RevealText>
        </div>

        {/* Bento Grid */}
        <div className="relative px-6 md:px-16">
          {/* Mobile — stack verticale */}
          <div className="flex flex-col gap-4 md:hidden">
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

          {/* Desktop — bento asimmetrico 3×3 */}
          {/* [ Hero 2×2        ] [ Card2 ] */}
          {/* [ Hero 2×2        ] [ Card3 ] */}
          {/* [ Card4 full-width 3×1      ] */}
          <div
            className="hidden md:grid md:grid-cols-3 md:grid-rows-3 gap-4"
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
