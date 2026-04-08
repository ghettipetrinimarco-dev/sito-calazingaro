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
    <section
      className="py-20 md:py-28 overflow-hidden"
      style={{ backgroundColor: "var(--color-sand)" }}
    >
      <div className="px-6 md:px-10 max-w-5xl mx-auto mb-10 md:mb-12">
        <RevealText>
          <SectionLabel>Serate & eventi</SectionLabel>
          <h2
            className="font-light uppercase tracking-wide leading-none"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "var(--color-text)",
            }}
          >
            Ogni weekend,<br />qualcosa accade.
          </h2>
        </RevealText>
      </div>

      {/* Carousel orizzontale — scroll nativo su mobile */}
      <div className="flex gap-4 px-6 md:px-10 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
        {eventiPlaceholder.map((ev, i) => (
          <RevealText
            key={ev.titolo}
            delay={i * 0.1}
            className="flex-shrink-0 w-[240px] snap-start"
          >
            <div
              className="rounded-sm overflow-hidden"
              style={{ backgroundColor: "var(--color-sand-light)" }}
            >
              <div
                className="h-[140px]"
                style={{ backgroundColor: "#d4c5b0" }}
              />
              <div className="p-4">
                <p
                  className="text-[0.58rem] tracking-widest uppercase mb-1"
                  style={{ color: "var(--color-subtle)" }}
                >
                  {ev.data}
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text)" }}
                >
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
