import SectionLabel from "@/components/ui/SectionLabel"
import RevealText from "@/components/ui/RevealText"

export default function StoriaSection() {
  return (
    <section
      className="px-6 md:px-10 py-20 md:py-32"
      style={{ backgroundColor: "var(--color-night)", color: "var(--color-sand)" }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <RevealText>
          <SectionLabel light>La nostra storia</SectionLabel>
          <h2
            className="font-light uppercase tracking-wide leading-none mb-16 md:mb-24"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.4rem, 7vw, 4.5rem)",
            }}
          >
            Da Milano<br />al mare.
          </h2>
        </RevealText>

        {/* Storia testo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start mb-20 md:mb-28">
          <RevealText>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(244,242,237,0.65)" }}
            >
              Andrea Ravaglia lascia il mondo della moda per scommettere su
              qualcosa di più autentico: un angolo di Romagna sul mare. Con due
              soci, prende in mano Cala Zingaro e lo trasforma in un posto dove
              stare bene — dalla colazione al dopocena — senza mai tradire la
              qualità della materia prima.
            </p>
          </RevealText>

          <RevealText delay={0.12}>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(244,242,237,0.65)" }}
            >
              La cucina parte dal pesce fresco della Riviera romagnola, incontra
              influenze asiatiche e tecniche contemporanee, e arriva a tavola
              senza fronzoli. Il mare come ingrediente principale, la semplicità
              come filosofia.
            </p>
          </RevealText>
        </div>

        {/* Premio 4 Ristoranti */}
        <RevealText delay={0.1}>
          <div
            className="border-t pt-12"
            style={{ borderColor: "rgba(244,242,237,0.12)" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">

              {/* Numero grande */}
              <div className="md:col-span-1">
                <p
                  className="font-light leading-none"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(5rem, 18vw, 10rem)",
                    color: "var(--color-accent)",
                    opacity: 0.8,
                  }}
                >
                  #1
                </p>
              </div>

              {/* Testo premio */}
              <div className="md:col-span-2">
                <SectionLabel light>Alessandro Borghese · 4 Ristoranti · 2020</SectionLabel>
                <h3
                  className="font-light uppercase tracking-wide leading-tight mb-4"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
                  }}
                >
                  Vincitori della<br />Riviera Romagnola.
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(244,242,237,0.55)" }}
                >
                  Nel 2020 Cala Zingaro ha vinto l&apos;episodio dedicato alla
                  Riviera Romagnola nel programma &quot;4 Ristoranti&quot; condotto
                  da Alessandro Borghese su Sky Uno — battendo tre dei migliori
                  ristoranti della zona tra Milano Marittima, Miramare di Rimini
                  e Cesenatico.
                </p>
              </div>

            </div>
          </div>
        </RevealText>

      </div>
    </section>
  )
}
