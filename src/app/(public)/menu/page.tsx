"use client"

// Nota: revalidate non funziona con "use client" — la pagina viene servita staticamente.
// Il bot aggiorna menu.ts su GitHub → Vercel re-deploya automaticamente.

import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
import { motion } from "framer-motion"
import { menu } from "@/data/menu"

export default function MenuPage() {
  return (
    <div className="relative min-h-screen bg-white text-[#111] pb-32 overflow-x-hidden">

      {/* Tasto chiudi — stile IG */}
      <Link
        href="/"
        aria-label="Chiudi menu"
        className="fixed top-5 right-5 z-50 p-2"
        style={{ mixBlendMode: "difference", color: "white" }}
      >
        <X strokeWidth={1.5} size={26} />
      </Link>

      {/* Cornice foglie — Mobile: PNG con alpha reale, nessun mix-blend-mode */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-10 block md:hidden"
        style={{ width: "100vw", height: "100dvh", transform: "scale(1.04)" }}
      >
        <Image
          src="/images/leaves_alpha.webp"
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: "center top" }}
          priority
        />
      </div>

      {/* Cornice foglie — Desktop sinistra */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-10 hidden md:block overflow-hidden"
        style={{ width: "30vw", height: "100dvh", transform: "scale(1.06)", transformOrigin: "top left" }}
      >
        <Image
          src="/images/leaves_alpha.webp"
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: "left top" }}
          priority
        />
      </div>

      {/* Cornice foglie — Desktop destra */}
      <div
        className="fixed top-0 right-0 pointer-events-none z-10 hidden md:block overflow-hidden"
        style={{ width: "30vw", height: "100dvh", transform: "scale(1.06)", transformOrigin: "top right" }}
      >
        <Image
          src="/images/leaves_alpha.webp"
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: "right top" }}
          priority
        />
      </div>

      {/* Contenuto */}
      <div className="relative z-20 max-w-xl mx-auto px-6 pt-28 md:pt-36 pb-24">

        {/* Titolo */}
        <motion.div
          className="text-center mb-20 md:mb-28"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="text-[0.5rem] tracking-[0.3em] uppercase mb-4"
            style={{ color: "#999" }}
          >
            Ristorante · Cala Zingaro
          </p>
          <h1
            className="uppercase leading-none"
            style={{
              fontFamily: "var(--font-antonio)",
              fontWeight: 200,
              fontSize: "clamp(5rem, 22vw, 9rem)",
              letterSpacing: "-0.01em",
            }}
          >
            Menù
          </h1>
        </motion.div>

        {/* Categorie */}
        <div className="space-y-20 md:space-y-28">
          {menu.map((category, catIndex) => {
            if (category.items.length === 0) return null

            return (
              <section key={category.id}>
                {/* Nome categoria */}
                <motion.div
                  className="text-center mb-8 md:mb-10"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h2
                    className="uppercase"
                    style={{
                      fontFamily: "var(--font-antonio)",
                      fontWeight: 300,
                      fontSize: "clamp(1.6rem, 6vw, 2.8rem)",
                      letterSpacing: "0.12em",
                    }}
                  >
                    {category.nome}
                  </h2>
                  {category.descrizione && (
                    <p
                      className="mt-2 text-[0.65rem] tracking-widest uppercase"
                      style={{ color: "#999", fontFamily: "var(--font-sans)" }}
                    >
                      {category.descrizione}
                    </p>
                  )}
                </motion.div>

                {/* Separatore */}
                <motion.div
                  className="flex items-center gap-4 mb-8 md:mb-10"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  style={{ transformOrigin: "center" }}
                >
                  <div className="flex-1 h-px bg-[#ddd]" />
                  <div className="w-1 h-1 rounded-full bg-[#ddd]" />
                  <div className="flex-1 h-px bg-[#ddd]" />
                </motion.div>

                {/* Piatti */}
                <div className="space-y-7 md:space-y-8">
                  {category.items.map((item, itemIndex) => (
                    <motion.article
                      key={item.id}
                      className="text-center"
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                        delay: Math.min(itemIndex * 0.05, 0.25),
                      }}
                    >
                      <h3
                        className="text-[0.9rem] md:text-base font-medium tracking-wide"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        {item.nome}
                      </h3>
                      {item.descrizione && (
                        <p
                          className="mt-1 text-[0.75rem] md:text-sm font-light max-w-xs mx-auto"
                          style={{
                            color: "#777",
                            fontFamily: "var(--font-sans)",
                            lineHeight: 1.5,
                          }}
                        >
                          {item.descrizione}
                        </p>
                      )}
                      {item.prezzo !== null && (
                        <p
                          className="mt-1.5 text-[0.7rem] tracking-wider"
                          style={{ color: "#aaa", fontFamily: "var(--font-sans)" }}
                        >
                          € {item.prezzo}
                        </p>
                      )}
                    </motion.article>
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        {/* Footer pagina */}
        <motion.div
          className="text-center mt-24 md:mt-32"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p
            className="text-[0.55rem] tracking-[0.25em] uppercase"
            style={{ color: "#bbb", fontFamily: "var(--font-sans)" }}
          >
            Traversa XIX Pineta · Milano Marittima
          </p>
          <p
            className="mt-1 text-[0.55rem] tracking-[0.25em] uppercase"
            style={{ color: "#ccc", fontFamily: "var(--font-sans)" }}
          >
            I prezzi variano secondo disponibilità del pescato
          </p>
        </motion.div>

      </div>
    </div>
  )
}
