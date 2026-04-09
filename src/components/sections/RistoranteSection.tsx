import Image from "next/image"
import RevealText from "@/components/ui/RevealText"
import OrganicLink from "@/components/ui/OrganicLink"

export default function RistoranteSection() {
  return (
    <section
      className="overflow-hidden"
      style={{ backgroundColor: "var(--color-sand-light)" }}
    >
      {/* Titolo + descrizione centrati */}
      <div className="px-6 md:px-16 pt-20 md:pt-28 pb-12 md:pb-16 text-center max-w-3xl mx-auto">
        <RevealText>
          <p className="section-label mb-5" style={{ color: "var(--color-subtle)" }}>
            Ristorante
          </p>
          <h2
            className="title-display mb-8"
            style={{ fontSize: "clamp(4rem, 12vw, 9rem)", color: "var(--color-text)" }}
          >
            Cucina<br />di mare.
          </h2>
          <p
            style={{ color: "var(--color-muted)", fontSize: "0.95rem", lineHeight: 1.8, maxWidth: "42ch", margin: "0 auto" }}
          >
            Pesce fresco della Riviera, influenze asiatiche, ingredienti di stagione.
            Dalla colazione al dopocena — la sala guarda il mare.
          </p>
        </RevealText>
      </div>

      {/* Foto fullwidth */}
      <RevealText>
        <div className="relative w-full" style={{ height: "65vh", minHeight: 400 }}>
          <Image
            src="/Cucina/Cala-Zingaro-Cucina-2.webp"
            alt="Cucina Cala Zingaro"
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "center 65%" }}
          />
        </div>
      </RevealText>

      {/* Tre foto in riga */}
      <RevealText delay={0.1}>
        <div className="grid grid-cols-3 gap-1.5 mt-1.5">
          <div className="relative" style={{ aspectRatio: "3/4" }}>
            <Image
              src="/Cucina/Cala-Zingaro-Cucina-4.webp"
              alt="Piatto Cala Zingaro"
              fill
              sizes="33vw"
              className="object-cover"
            />
          </div>
          <div className="relative" style={{ aspectRatio: "3/4" }}>
            <Image
              src="/Cucina/Cala-Zingaro-Cucina-5.webp"
              alt="Piatto Cala Zingaro"
              fill
              sizes="33vw"
              className="object-cover"
            />
          </div>
          <div className="relative" style={{ aspectRatio: "3/4" }}>
            <Image
              src="/Cucina/Cala-Zingaro-Cucina-8.webp"
              alt="Piatto Cala Zingaro"
              fill
              sizes="33vw"
              className="object-cover"
            />
          </div>
        </div>
      </RevealText>

      {/* Link in fondo */}
      <div className="px-6 md:px-16 py-10 md:py-12 flex flex-col sm:flex-row gap-6 sm:gap-12">
        <RevealText>
          <OrganicLink href="/menu" color="var(--color-text)" className="text-[0.7rem] tracking-[0.2em] uppercase hover:opacity-50 transition-opacity">
            Vedi il menu →
          </OrganicLink>
        </RevealText>
        <RevealText delay={0.08}>
          <OrganicLink href="#prenota" color="var(--color-text)" className="text-[0.7rem] tracking-[0.2em] uppercase hover:opacity-50 transition-opacity">
            Prenota un tavolo →
          </OrganicLink>
        </RevealText>
      </div>

    </section>
  )
}
