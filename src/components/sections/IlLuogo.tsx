import SectionLabel from "@/components/ui/SectionLabel"
import RevealText from "@/components/ui/RevealText"

export default function IlLuogo() {
  return (
    <section
      className="px-6 md:px-10 py-20 md:py-28"
      style={{ backgroundColor: "var(--color-sand)" }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div>
          <RevealText>
            <SectionLabel>Il luogo</SectionLabel>
            <h2
              className="italic font-light leading-none mb-5"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
                color: "var(--color-text)",
              }}
            >
              Una baita<br />sul mare.
            </h2>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "var(--color-muted)" }}
            >
              Traversa XIX Pineta, Milano Marittima. Un posto dove il tempo
              rallenta: sabbia, ombra, cucina di qualità. D&apos;estate il mare
              a due passi, d&apos;inverno la sala al caldo con un buon bicchiere.
            </p>
            <a
              href="/contatti"
              className="text-[0.62rem] tracking-widest uppercase border-b pb-0.5 transition-opacity hover:opacity-60"
              style={{
                borderColor: "var(--color-text)",
                color: "var(--color-text)",
              }}
            >
              Come raggiungerci →
            </a>
          </RevealText>
        </div>

        <RevealText delay={0.15}>
          <div
            className="aspect-[4/3] rounded-sm flex items-center justify-center text-[0.6rem] tracking-widest uppercase"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Foto location
          </div>
        </RevealText>
      </div>
    </section>
  )
}
