import Image from "next/image"
import TransitionLink from "@/components/TransitionLink"
import RevealText from "@/components/ui/RevealText"

export default function SpiaggiaSection() {
  return (
    <section
      className="overflow-hidden"
      style={{ backgroundColor: "var(--color-night)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">

        {/* Testo */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-20 md:py-32 order-2 md:order-1">
          <RevealText>
            <p className="section-label mb-5" style={{ color: "rgba(244,242,237,0.35)" }}>
              Beach Club
            </p>
            <h2
              className="title-display mb-8"
              style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)", color: "var(--color-sand)" }}
            >
              La spiaggia<br />è tua.
            </h2>
            <p
              className="leading-relaxed mb-10"
              style={{ color: "rgba(244,242,237,0.5)", maxWidth: "32ch", fontSize: "0.95rem" }}
            >
              Ombrelloni macramé, lettini, servizio diretto in spiaggia.
              Il mare come non lo hai mai vissuto — a due passi dalla tavola.
            </p>
            <div className="flex flex-col gap-4">
              <TransitionLink
                href="/spiaggia"
                className="text-[0.6rem] tracking-[0.2em] uppercase border-b pb-1 self-start transition-opacity hover:opacity-50"
                style={{ borderColor: "rgba(244,242,237,0.35)", color: "rgba(244,242,237,0.7)" }}
              >
                Vedi prezzi e servizi →
              </TransitionLink>
              <TransitionLink
                href="#prenota"
                className="text-[0.6rem] tracking-[0.2em] uppercase border-b pb-1 self-start transition-opacity hover:opacity-50"
                style={{ borderColor: "rgba(244,242,237,0.35)", color: "rgba(244,242,237,0.7)" }}
              >
                Prenota l&apos;ombrellone →
              </TransitionLink>
            </div>
          </RevealText>
        </div>

        {/* Foto */}
        <div className="relative order-1 md:order-2" style={{ minHeight: "560px" }}>
          <Image
            src="/Ambiente/Cala-Zingaro-Ambiente-2.webp"
            alt="Beach club Cala Zingaro"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

      </div>
    </section>
  )
}
