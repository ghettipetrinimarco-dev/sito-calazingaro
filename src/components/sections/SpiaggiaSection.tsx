import Link from "next/link"
import SectionLabel from "@/components/ui/SectionLabel"
import RevealText from "@/components/ui/RevealText"

export default function SpiaggiaSection() {
  return (
    <section
      className="overflow-hidden"
      style={{ backgroundColor: "var(--color-night)" }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 items-stretch">
        {/* Testo — sinistra su desktop, sotto su mobile */}
        <div className="flex flex-col justify-center px-8 py-16 md:px-12 md:py-20 order-2 md:order-1">
          <RevealText>
            <SectionLabel light>Beach Club</SectionLabel>
            <h2
              className="italic font-light leading-none mb-5 text-white"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 5vw, 3rem)",
              }}
            >
              La spiaggia<br />è tua.
            </h2>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "rgba(244,242,237,0.55)" }}
            >
              Ombrelloni, lettini e servizio direttamente in spiaggia.
              Prenota il tuo posto e goditi il mare senza pensieri.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/spiaggia"
                className="text-[0.62rem] tracking-widest uppercase border-b pb-0.5 self-start transition-opacity hover:opacity-60"
                style={{
                  borderColor: "rgba(244,242,237,0.5)",
                  color: "rgba(244,242,237,0.8)",
                }}
              >
                Vedi prezzi e servizi →
              </Link>
              <Link
                href="#prenota"
                className="text-[0.62rem] tracking-widest uppercase border-b pb-0.5 self-start transition-opacity hover:opacity-60"
                style={{
                  borderColor: "rgba(244,242,237,0.5)",
                  color: "rgba(244,242,237,0.8)",
                }}
              >
                Prenota l&apos;ombrellone →
              </Link>
            </div>
          </RevealText>
        </div>

        {/* Foto — destra su desktop, sopra su mobile */}
        <RevealText delay={0.1} className="order-1 md:order-2">
          <div
            className="min-h-[300px] md:min-h-[480px]"
            style={{ backgroundColor: "#3a5f6e" }}
          />
        </RevealText>
      </div>
    </section>
  )
}
