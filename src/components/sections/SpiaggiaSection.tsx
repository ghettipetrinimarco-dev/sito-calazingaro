import Image from "next/image"
import RevealText from "@/components/ui/RevealText"
import OrganicLink from "@/components/ui/OrganicLink"
import OrganicCorner from "@/components/ui/OrganicCorner"

export default function SpiaggiaSection() {
  return (
    <section
      id="spiaggia"
      className="overflow-hidden"
      style={{ backgroundColor: "var(--color-sand)" }}
    >
      <div className="flex flex-col md:grid md:grid-cols-2 items-stretch">

        {/* Foto — sinistra desktop, sotto su mobile */}
        <RevealText className="min-h-[480px] md:min-h-0 order-2 md:order-1">
          <div className="relative w-full h-full overflow-hidden" style={{ minHeight: "520px" }}>
            <Image
              src="/Ambiente/Cala-Zingaro-Ambiente-10.webp"
              alt="Beach club Cala Zingaro"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </RevealText>

        {/* Testo — destra desktop, sopra su mobile */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 md:py-24 pb-10 md:pb-16 order-1 md:order-2">
          <RevealText delay={0.1}>
            <p className="section-label mb-5" style={{ color: "var(--color-subtle)" }}>
              Spiaggia
            </p>
            <h2
              className="title-display mb-8"
              style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)", color: "var(--color-text)" }}
            >
              Il mare<br />da vivere.
            </h2>
            <p
              className="leading-relaxed mb-10"
              style={{ color: "var(--color-muted)", maxWidth: "32ch", fontSize: "0.95rem" }}
            >
              Ombrelloni macramé, lettini, servizio diretto in spiaggia.
              Il mare come non lo hai mai vissuto — a due passi dalla tavola.
            </p>
            <div className="flex flex-col gap-4">
              <OrganicLink href="/spiaggia" color="var(--color-text)" className="text-[0.7rem] tracking-[0.2em] uppercase hover:opacity-50 transition-opacity">
                Vedi prezzi e servizi →
              </OrganicLink>
              <OrganicLink href="/prenota" color="var(--color-text)" className="text-[0.7rem] tracking-[0.2em] uppercase hover:opacity-50 transition-opacity">
                Prenota l&apos;ombrellone →
              </OrganicLink>
            </div>
          </RevealText>
        </div>

      </div>
    </section>
  )
}
