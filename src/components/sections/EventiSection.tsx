import Image from "next/image"
import SectionLabel from "@/components/ui/SectionLabel"
import RevealText from "@/components/ui/RevealText"
import OrganicLink from "@/components/ui/OrganicLink"

const eventi = [
  {
    src: "/Eventi/Eventi_1.webp",
    data: "18 Apr · Ven",
    titolo: "Night Groove",
    tipo: "DJ Set",
  },
  {
    src: "/Eventi/Eventi_2.webp",
    data: "25 Apr · Ven",
    titolo: "Cooking Lab",
    tipo: "Esperienza culinaria",
  },
  {
    src: "/Ambiente/Cala-Zingaro-Ambiente-9.webp",
    data: "1 Mag · Gio",
    titolo: "Aperitivo in spiaggia",
    tipo: "Aperitivo",
  },
  {
    src: "/Ambiente/Cala-Zingaro-Ambiente-7.webp",
    data: "10 Mag · Sab",
    titolo: "Cena sotto le stelle",
    tipo: "Cena speciale",
  },
]

export default function EventiSection() {
  return (
    <section
      className="overflow-hidden py-20 md:py-28"
      style={{ backgroundColor: "var(--color-night)" }}
    >
      {/* Header sezione */}
      <div className="px-6 md:px-16 mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
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

      {/* Carousel — scroll nativo, nessun bordo, foto verticali */}
      <div
        className="flex gap-4 md:gap-6 px-6 md:px-16 overflow-x-auto pb-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        {eventi.map((ev, i) => (
          <RevealText
            key={ev.titolo}
            delay={i * 0.07}
            className="flex-shrink-0 snap-start"
            style={{ width: "clamp(220px, 60vw, 300px)" }}
          >
            {/* Foto */}
            <div className="relative overflow-hidden mb-4" style={{ aspectRatio: "2/3" }}>
              <Image
                src={ev.src}
                alt={ev.titolo}
                fill
                sizes="300px"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            {/* Info */}
            <p
              className="text-[0.58rem] tracking-widest uppercase mb-1.5"
              style={{ color: "rgba(244,242,237,0.3)" }}
            >
              {ev.data} · {ev.tipo}
            </p>
            <p
              style={{
                fontFamily: "var(--font-yanone)",
                fontWeight: 300,
                fontSize: "1.4rem",
                color: "var(--color-sand)",
                letterSpacing: "0.01em",
              }}
            >
              {ev.titolo}
            </p>
          </RevealText>
        ))}
      </div>

    </section>
  )
}
