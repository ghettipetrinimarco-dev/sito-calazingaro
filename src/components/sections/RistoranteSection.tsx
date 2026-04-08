import Link from "next/link"
import SectionLabel from "@/components/ui/SectionLabel"
import RevealText from "@/components/ui/RevealText"

export default function RistoranteSection() {
  return (
    <section
      className="overflow-hidden"
      style={{ backgroundColor: "var(--color-sand-light)" }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 items-stretch">
        {/* Foto — sinistra su desktop, sopra su mobile */}
        <RevealText>
          <div
            className="min-h-[300px] md:min-h-[480px]"
            style={{ backgroundColor: "#c8b99a" }}
          />
        </RevealText>

        {/* Testo */}
        <div
          className="flex flex-col justify-center px-8 py-16 md:px-12 md:py-20"
          style={{ backgroundColor: "var(--color-sand-light)" }}
        >
          <RevealText delay={0.1}>
            <SectionLabel>Ristorante</SectionLabel>
            <h2
              className="font-light uppercase tracking-wide leading-none mb-5"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                color: "var(--color-text)",
              }}
            >
              Cucina<br />di mare.
            </h2>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "var(--color-muted)" }}
            >
              Pranzo, aperitivo, cena e dopocena. Ogni piatto nasce dalla
              stagione, ogni vino è scelto con cura. La sala guarda il mare.
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
