import Image from "next/image"
import RevealText from "@/components/ui/RevealText"
import OrganicLink from "@/components/ui/OrganicLink"
import OrganicLine from "@/components/ui/OrganicLine"

export default function RistoranteSection() {
  return (
    <section
      className="overflow-hidden"
      style={{ backgroundColor: "var(--color-sand)" }}
    >
      {/* Separatore organico — fullwidth */}
      <div className="mt-20">
        <OrganicLine color="var(--color-text)" opacity={0.9} />
      </div>

      {/* Titolo + descrizione centrati */}
      <div className="px-6 md:px-16 pt-16 md:pt-20 pb-12 md:pb-16 text-center max-w-3xl mx-auto">
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
            src="/Ambiente/Cala-Zingaro-Ambiente-13.jpg"
            alt="Ristorante Cala Zingaro"
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "center 65%" }}
          />
        </div>
      </RevealText>

      {/* Sei foto in griglia 3x2 */}
      <RevealText delay={0.1}>
        <div className="grid grid-cols-3 gap-1.5 mt-1.5">
          {[
            "/Cucina/Cala-Zingaro-Cucina-2.webp",
            "/Cucina/Cala-Zingaro-Cucina-5.webp",
            "/Cucina/Cala-Zingaro-Cucina-8.webp",
            "/Cucina/Cala-Zingaro-Cucina-9.webp",
            "/Cucina/Cala-Zingaro-Cucina-10.webp",
            "/Cucina/Cala-Zingaro-Cucina-11.webp",
          ].map((src) => (
            <div key={src} className="relative" style={{ aspectRatio: "3/4" }}>
              <Image
                src={src}
                alt="Cucina Cala Zingaro"
                fill
                sizes="33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </RevealText>

      {/* CTA — display */}
      <div className="px-6 md:px-16 pt-16 md:pt-20 pb-20 md:pb-28 text-center">
        <RevealText delay={0.05}>
          <OrganicLink
            href="#prenota"
            color="var(--color-text)"
            className="title-display"
            style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)", lineHeight: 1 }}
          >
            Prenota un tavolo →
          </OrganicLink>
        </RevealText>
        <RevealText delay={0.15}>
          <div className="mt-8">
            <OrganicLink
              href="/menu"
              color="var(--color-text)"
              className="text-[0.9rem] tracking-[0.22em] uppercase hover:opacity-50 transition-opacity"
            >
              Vedi il menu →
            </OrganicLink>
          </div>
        </RevealText>
      </div>

    </section>
  )
}
