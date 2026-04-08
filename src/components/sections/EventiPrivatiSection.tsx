import SectionLabel from "@/components/ui/SectionLabel"
import RevealText from "@/components/ui/RevealText"

export default function EventiPrivatiSection() {
  return (
    <section
      className="px-6 md:px-10 py-20 md:py-28"
      style={{ backgroundColor: "var(--color-sand-light)" }}
    >
      <div className="max-w-5xl mx-auto">
        <RevealText>
          <div
            className="border-t pt-10"
            style={{ borderColor: "rgba(17,17,17,0.08)" }}
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <SectionLabel>Feste &amp; Eventi Privati</SectionLabel>
                <h2
                  className="font-light uppercase tracking-wide leading-none"
                  style={{
                    fontFamily: "var(--font-yanone)",
                    fontSize: "clamp(2rem, 5.5vw, 3.2rem)",
                    color: "var(--color-text)",
                  }}
                >
                  Il tuo momento,<br />a modo tuo.
                </h2>
              </div>
              <div
                className="text-[0.6rem] tracking-[0.2em] uppercase pb-1"
                style={{ color: "var(--color-subtle)" }}
              >
                Coming soon
              </div>
            </div>
          </div>
        </RevealText>
      </div>
    </section>
  )
}
