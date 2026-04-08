import SectionLabel from "@/components/ui/SectionLabel"
import RevealText from "@/components/ui/RevealText"

export default function PrenotazioneSection() {
  return (
    <section
      id="prenota"
      className="px-6 md:px-10 py-20 md:py-28"
      style={{ backgroundColor: "var(--color-sand)" }}
    >
      <div className="max-w-5xl mx-auto">

        <RevealText>
          <SectionLabel>Prenota</SectionLabel>
          <h2
            className="font-light uppercase tracking-wide leading-none mb-12 md:mb-16"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
              color: "var(--color-text)",
            }}
          >
            Riserva il<br />tuo posto.
          </h2>
        </RevealText>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Tavolo */}
          <RevealText delay={0.08}>
            <div
              className="p-8 md:p-10 flex flex-col gap-6 h-full"
              style={{
                backgroundColor: "var(--color-night)",
                color: "var(--color-sand)",
              }}
            >
              <div>
                <SectionLabel light>Ristorante</SectionLabel>
                <h3
                  className="font-light uppercase tracking-wide leading-tight"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                  }}
                >
                  Prenota un tavolo
                </h3>
              </div>
              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: "rgba(244,242,237,0.55)" }}
              >
                Pranzo, aperitivo o cena. Scegli il momento, noi pensiamo al resto.
              </p>
              <div
                className="inline-block text-[0.6rem] tracking-[0.18em] uppercase py-1 border-b w-fit"
                style={{ borderColor: "rgba(244,242,237,0.25)", color: "rgba(244,242,237,0.35)" }}
              >
                Coming soon
              </div>
            </div>
          </RevealText>

          {/* Lettini */}
          <RevealText delay={0.16}>
            <div
              className="p-8 md:p-10 flex flex-col gap-6 h-full border"
              style={{
                borderColor: "rgba(17,17,17,0.1)",
                color: "var(--color-text)",
              }}
            >
              <div>
                <SectionLabel>Beach Club</SectionLabel>
                <h3
                  className="font-light uppercase tracking-wide leading-tight"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                    color: "var(--color-text)",
                  }}
                >
                  Prenota i lettini
                </h3>
              </div>
              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: "var(--color-muted)" }}
              >
                Ombrellone, lettino e servizio in spiaggia. Il mare da vivere comodamente.
              </p>
              <div
                className="inline-block text-[0.6rem] tracking-[0.18em] uppercase py-1 border-b w-fit"
                style={{ borderColor: "rgba(17,17,17,0.15)", color: "var(--color-subtle)" }}
              >
                Coming soon
              </div>
            </div>
          </RevealText>

        </div>
      </div>
    </section>
  )
}
