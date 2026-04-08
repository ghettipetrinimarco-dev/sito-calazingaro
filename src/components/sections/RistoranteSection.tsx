import Image from "next/image"
import TransitionLink from "@/components/transitions/TransitionLink"
import RevealText from "@/components/ui/RevealText"

export default function RistoranteSection() {
  return (
    <section
      className="overflow-hidden"
      style={{ backgroundColor: "var(--color-sand-light)" }}
    >
      {/* Titolo fullwidth sopra */}
      <div className="px-8 md:px-16 lg:px-20 pt-20 md:pt-28 pb-10 md:pb-14">
        <RevealText>
          <p className="section-label mb-4" style={{ color: "var(--color-subtle)" }}>
            Ristorante
          </p>
          <h2
            className="title-display"
            style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", color: "var(--color-text)" }}
          >
            Cucina<br />di mare.
          </h2>
        </RevealText>
      </div>

      {/* Foto + testo affiancati */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">

        {/* Foto */}
        <div className="relative" style={{ minHeight: "480px" }}>
          <Image
            src="/Cucina/Cala-Zingaro-Cucina-5.webp"
            alt="Cucina Cala Zingaro"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            style={{ objectPosition: "center 40%" }}
          />
        </div>

        {/* Testo */}
        <div className="flex flex-col justify-center px-8 md:px-14 lg:px-16 py-14 md:py-20">
          <RevealText delay={0.15}>
            <p
              className="leading-relaxed mb-10"
              style={{ color: "var(--color-muted)", maxWidth: "32ch", fontSize: "0.95rem" }}
            >
              Pranzo, aperitivo, cena e dopocena. Pesce fresco della Riviera,
              influenze asiatiche, ingredienti di stagione. La sala guarda il mare.
            </p>
            <div className="flex flex-col gap-4">
              <TransitionLink
                href="/menu"
                className="text-[0.6rem] tracking-[0.2em] uppercase border-b pb-1 self-start transition-opacity hover:opacity-50"
                style={{ borderColor: "var(--color-text)", color: "var(--color-text)" }}
              >
                Vedi il menu →
              </TransitionLink>
              <TransitionLink
                href="#prenota"
                className="text-[0.6rem] tracking-[0.2em] uppercase border-b pb-1 self-start transition-opacity hover:opacity-50"
                style={{ borderColor: "var(--color-text)", color: "var(--color-text)" }}
              >
                Prenota un tavolo →
              </TransitionLink>
            </div>
          </RevealText>
        </div>

      </div>
    </section>
  )
}
