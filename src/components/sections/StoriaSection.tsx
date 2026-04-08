import Image from "next/image"
import RevealText from "@/components/ui/RevealText"

export default function StoriaSection() {
  return (
    <section
      className="overflow-hidden"
      style={{ backgroundColor: "var(--color-night)" }}
    >
      {/* Foto insegna — fullwidth con overlay e testo sovrapposto */}
      <div className="relative" style={{ minHeight: "70vh" }}>
        <Image
          src="/Ambiente/Cala-Zingaro-Ambiente-6.webp"
          alt="The place not to be sad — Cala Zingaro"
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center 50%" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(17,17,17,0.3) 0%, rgba(17,17,17,0.85) 100%)" }}
        />
        <div className="absolute inset-0 flex flex-col justify-end px-8 md:px-16 lg:px-20 pb-16 md:pb-24">
          <RevealText>
            <p className="section-label mb-5" style={{ color: "rgba(244,242,237,0.35)" }}>
              La nostra storia
            </p>
            <h2
              className="title-display"
              style={{ fontSize: "clamp(3.5rem, 9vw, 7.5rem)", color: "var(--color-sand)" }}
            >
              Da Milano<br />al mare.
            </h2>
          </RevealText>
        </div>
      </div>

      {/* Corpo testo */}
      <div className="px-8 md:px-16 lg:px-20 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 mb-20 md:mb-28 items-center">

          {/* Foto Ravaglia */}
          <RevealText>
            <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", maxWidth: "420px" }}>
              <Image
                src="/Eventi/Cala Zingaro_Rava.webp"
                alt="Andrea Ravaglia — Cala Zingaro"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
                style={{ objectPosition: "center 20%", filter: "sepia(0.15) contrast(1.05)" }}
              />
            </div>
          </RevealText>

          {/* Testo */}
          <RevealText delay={0.12}>
            <p className="section-label mb-5" style={{ color: "rgba(244,242,237,0.3)" }}>
              Andrea Ravaglia · Fondatore
            </p>
            <p style={{ color: "rgba(244,242,237,0.6)", lineHeight: 1.8, fontSize: "0.95rem", marginBottom: "1.5rem" }}>
              Andrea lascia il mondo della moda per scommettere su qualcosa di
              più autentico: un angolo di Romagna sul mare. Con due soci, prende
              in mano Cala Zingaro e lo trasforma in un posto dove stare bene —
              dalla colazione al dopocena — senza mai tradire la qualità della
              materia prima.
            </p>
            <p style={{ color: "rgba(244,242,237,0.6)", lineHeight: 1.8, fontSize: "0.95rem" }}>
              La cucina parte dal pesce fresco della Riviera romagnola, incontra
              influenze asiatiche e tecniche contemporanee, e arriva a tavola
              senza fronzoli. Il mare come ingrediente principale, la semplicità
              come filosofia.
            </p>
          </RevealText>

        </div>

        {/* Premio */}
        <RevealText delay={0.1}>
          <div
            className="border-t pt-12 md:pt-16"
            style={{ borderColor: "rgba(244,242,237,0.08)" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-end">
              <div className="md:col-span-1">
                <p
                  className="title-display"
                  style={{
                    fontSize: "clamp(6rem, 20vw, 14rem)",
                    color: "var(--color-accent)",
                    opacity: 0.7,
                    lineHeight: 0.85,
                  }}
                >
                  #1
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="section-label mb-4" style={{ color: "rgba(244,242,237,0.3)" }}>
                  Alessandro Borghese · 4 Ristoranti · 2020
                </p>
                <h3
                  className="title-display mb-5"
                  style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--color-sand)" }}
                >
                  Vincitori della<br />Riviera Romagnola.
                </h3>
                <p style={{ color: "rgba(244,242,237,0.45)", lineHeight: 1.8, fontSize: "0.9rem", maxWidth: "44ch" }}>
                  Nel 2020 Cala Zingaro ha vinto l&apos;episodio dedicato alla
                  Riviera Romagnola nel programma &ldquo;4 Ristoranti&rdquo; condotto
                  da Alessandro Borghese su Sky Uno.
                </p>
              </div>
            </div>
          </div>
        </RevealText>
      </div>
    </section>
  )
}
