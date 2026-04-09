"use client"

import { useState } from "react"
import Image from "next/image"
import { m, AnimatePresence } from "framer-motion"
import RevealText from "@/components/ui/RevealText"
import OrganicLink from "@/components/ui/OrganicLink"
import SeasonToggle from "@/components/ui/SeasonToggle"
import OrganicCorner from "@/components/ui/OrganicCorner"

const EASE = [0.22, 1, 0.36, 1] as const

const content = {
  estate: {
    testo: "Traversa XIX Pineta, Milano Marittima. Un posto dove il tempo rallenta: sabbia, ombra, cucina di qualità. Palme tropicali, macramé al vento, e il mare a due passi.",
    foto: "/Ambiente/Cala-Zingaro-Ambiente-4.webp",
    alt: "Cala Zingaro estate",
  },
  inverno: {
    testo: "Anche d'inverno, Cala Zingaro è aperto. Cucina, eventi e serate private — il mare fuori stagione ha un sapore diverso.",
    foto: "/Ambiente/Cala-Zingaro-Ambiente-12.jpeg",
    alt: "Cala Zingaro inverno",
  },
}

const titleLine1 = {
  estate: "Il tuo posto",
  inverno: "Una baita",
}

export default function IlLuogo() {
  const [season, setSeason] = useState<"estate" | "inverno">("estate")
  const c = content[season]

  return (
    <section
      id="scopri"
      className="overflow-hidden"
      style={{ backgroundColor: "var(--color-sand)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">

        {/* Testo */}
        <div className="flex flex-col justify-between px-8 md:px-16 lg:px-20 py-16 md:py-24">
          <RevealText className="flex flex-col h-full gap-8">

            {/* Top — label + titolo */}
            <div>
              <p className="mb-6" style={{ color: "var(--color-subtle)", fontSize: "1rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                Il luogo
              </p>
              <h2
                className="title-display"
                style={{ fontSize: "clamp(4rem, 9vw, 7rem)", color: "var(--color-text)" }}
              >
                {/* Prima riga — lettera per lettera */}
                <div className="relative overflow-hidden" style={{ height: "1.05em" }}>
                  <AnimatePresence mode="wait">
                    <m.span
                      key={season + "-title"}
                      className="absolute inset-0 flex"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {titleLine1[season].split("").map((char, i) => (
                        <m.span
                          key={i}
                          variants={{
                            hidden: { opacity: 0, y: 12 },
                            visible: { opacity: 1, y: 0 },
                          }}
                          transition={{
                            duration: 0.25,
                            ease: EASE,
                            delay: i * 0.025,
                          }}
                          style={{ whiteSpace: "pre" }}
                        >
                          {char}
                        </m.span>
                      ))}
                    </m.span>
                  </AnimatePresence>
                </div>
                {/* Seconda riga — fissa */}
                <span className="block">sul mare.</span>
              </h2>
            </div>

            {/* Centro — toggle + testo */}
            <div>
              <SeasonToggle value={season} onChange={setSeason} />
              <div className="relative overflow-hidden" style={{ minHeight: "6rem" }}>
                <AnimatePresence mode="wait">
                  <m.p
                    key={season + "-text"}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
                    className="absolute inset-0 leading-relaxed"
                    style={{ color: "var(--color-muted)", fontSize: "0.95rem", maxWidth: "36ch" }}
                  >
                    {c.testo}
                  </m.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom — link */}
            <OrganicLink
              href="https://maps.app.goo.gl/TUrsbEvbCBJ3mGxt9"
              color="var(--color-text)"
              className="text-[0.7rem] tracking-[0.2em] uppercase transition-opacity hover:opacity-50"
              external
            >
              Come raggiungerci →
            </OrganicLink>

          </RevealText>
        </div>

        {/* Foto stagionale — crossfade */}
        <div className="relative min-h-[480px] md:min-h-0 overflow-hidden" style={{ minHeight: "520px" }}>
          <AnimatePresence>
            <m.div
              key={season + "-foto"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: EASE }}
              className="absolute inset-0"
            >
              <Image
                src={c.foto}
                alt={c.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </m.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}
