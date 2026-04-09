"use client"

import { LazyMotion, domAnimation, m } from "framer-motion"
import Image from "next/image"
import SectionLabel from "@/components/ui/SectionLabel"
import RevealText from "@/components/ui/RevealText"
import OrganicLine from "@/components/ui/OrganicLine"

const SPRING_HOVER = { type: "spring" as const, stiffness: 260, damping: 20 }
const SPRING_APPEAR = { type: "spring" as const, stiffness: 100, damping: 15 }

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
        style={{ backgroundColor: "var(--color-night)" }}
      >
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
          {/* Mobile — stack verticale */}
          <div className="flex flex-col gap-3 md:hidden">
            <EventCard evento={hero} hero className="aspect-[4/5]" sizes="94vw" />
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
