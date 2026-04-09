import Image from "next/image"
import RevealText from "@/components/ui/RevealText"
import OrganicLink from "@/components/ui/OrganicLink"

export default function SpiaggiaSection() {
  return (
    <section
      className="overflow-hidden"
      style={{ backgroundColor: "var(--color-sand)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">

        {/* Foto — sinistra */}
        <RevealText className="min-h-[480px] md:min-h-0">
          <div className="relative w-full h-full" style={{ minHeight: "520px" }}>
            <Image
              src="/Ambiente/Cala-Zingaro-Ambiente-10.webp"
              alt="Beach club Cala Zingaro"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </RevealText>

        {/* Testo — destra */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-20 md:py-32">
          <RevealText delay={0.1}>
            <p className="section-label mb-5" style={{ color: "var(--color-subtle)" }}>
              Beach Club
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
              <OrganicLink href="#prenota" color="var(--color-text)" className="text-[0.7rem] tracking-[0.2em] uppercase hover:opacity-50 transition-opacity">
                Prenota l&apos;ombrellone →
              </OrganicLink>
            </div>
          </RevealText>
        </div>

      </div>
    </section>
  )
}
