import Image from "next/image"
import TransitionLink from "@/components/transitions/TransitionLink"
import RevealText from "@/components/ui/RevealText"

export default function IlLuogo() {
  return (
    <section
      id="scopri"
      className="overflow-hidden"
      style={{ backgroundColor: "var(--color-sand)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">

        {/* Testo */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-20 md:py-32">
          <RevealText>
            <p className="section-label mb-5" style={{ color: "var(--color-subtle)" }}>
              Il luogo
            </p>
            <h2
              className="title-display mb-8"
              style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)", color: "var(--color-text)" }}
            >
              Una baita<br />sul mare.
            </h2>
            <p
              className="leading-relaxed mb-10"
              style={{ color: "var(--color-muted)", maxWidth: "32ch", fontSize: "0.95rem" }}
            >
              Traversa XIX Pineta, Milano Marittima. Un posto dove il tempo
              rallenta: sabbia, ombra, cucina di qualità. Palme tropicali,
              macramé al vento, e il mare a due passi.
            </p>
            <TransitionLink
              href="/contatti"
              className="text-[0.6rem] tracking-[0.2em] uppercase border-b pb-1 self-start transition-opacity hover:opacity-50"
              style={{ borderColor: "var(--color-text)", color: "var(--color-text)" }}
            >
              Come raggiungerci →
            </TransitionLink>
          </RevealText>
        </div>

        {/* Foto — altezza piena */}
        <RevealText delay={0.1} className="min-h-[480px] md:min-h-0">
          <div className="relative w-full h-full" style={{ minHeight: "520px" }}>
            <Image
              src="/Ambiente/Cala-Zingaro-Ambiente-8.webp"
              alt="Palme e spiaggia Cala Zingaro"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </RevealText>

      </div>
    </section>
  )
}
