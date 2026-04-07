"use client"

// Nota: revalidate non funziona con "use client" — la pagina viene servita staticamente.
// Il bot aggiorna menu.ts su GitHub → Vercel re-deploya automaticamente.

import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
import { motion } from "framer-motion"
import { menu } from "@/data/menu"
import { useEffect } from "react"

export default function MenuPage() {
  
  useEffect(() => {
    // Gestione safely del body per eliminare il mismatch di colore e il rubber band
    document.documentElement.style.backgroundColor = "#ffffff"
    document.body.style.backgroundColor = "#ffffff"
    document.body.style.overscrollBehaviorY = "none"
    
    return () => {
      // Pulizia quando esci dal menu per ripristinare il logo/landing in altre pagine
      document.documentElement.style.backgroundColor = ""
      document.body.style.backgroundColor = ""
      document.body.style.overscrollBehaviorY = ""
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-white text-[#111] pb-0 overflow-x-hidden">
      {/* Tasto chiudi — stile IG */}
      <Link
        href="/"
        aria-label="Chiudi menu"
        className="fixed top-5 right-5 z-50 p-2"
        style={{ mixBlendMode: "difference", color: "white" }}
      >
        <X strokeWidth={1.5} size={26} />
      </Link>

      {/* Cornice Foglie: panel ancorati agli angoli, larghezza proporzionale al viewport */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">

        {/* Ramo Sinistro — si restringe sui viewport piccoli, mostra solo il bordo esterno */}
        <div className="absolute top-0 bottom-0 left-0 w-[28vw] sm:w-[32vw] md:w-[38vw] lg:w-[43vw] xl:w-[45vw] max-w-[560px]">
          <Image
            src="/images/foglie-menu-sx.png"
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: "left top" }}
            priority
          />
        </div>

        {/* Ramo Destro */}
        <div className="absolute top-0 bottom-0 right-0 w-[28vw] sm:w-[32vw] md:w-[38vw] lg:w-[43vw] xl:w-[45vw] max-w-[560px]">
          <Image
            src="/images/foglie-menu-dx.png"
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: "right top" }}
            priority
          />
        </div>

      </div>

      {/* Contenuto */}
      <div className="relative z-20 max-w-xl mx-auto px-6 pt-28 md:pt-36 pb-24">

        {/* Titolo */}
        <motion.div
          className="text-center mb-20 md:mb-28 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo nero al posto del testo "Ristorante Cala Zingaro" come da richiesta */}
          <div className="mb-8">
            <Image
              src="/images/logo.svg"
              alt="Cala Zingaro"
              width={180}
              height={60}
              className="h-10 md:h-14 w-auto object-contain"
              priority
            />
          </div>
          <h1
            className="uppercase leading-none tracking-normal"
            style={{
              fontFamily: "var(--font-yanone)",
              fontWeight: 300,
              fontSize: "clamp(4.5rem, 18vw, 11rem)",
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
                      fontFamily: "var(--font-yanone)",
                      fontWeight: 300,
                      fontSize: "clamp(2.5rem, 8vw, 4rem)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {category.nome}
                  </h2>
                  {category.descrizione && (
                    <p
                      className="mt-2 text-[0.7rem] md:text-sm tracking-wide uppercase font-medium"
                      style={{ color: "#999", fontFamily: "var(--font-quicksand)" }}
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
                        className="text-[1.1rem] md:text-xl font-semibold tracking-wide"
                        style={{ fontFamily: "var(--font-quicksand)", color: "#000" }}
                      >
                        {item.nome}
                      </h3>
                      {item.descrizione && (
                        <p
                          className="mt-1.5 text-[0.8rem] md:text-base font-medium max-w-xs mx-auto"
                          style={{
                            color: "#555",
                            fontFamily: "var(--font-quicksand)",
                            lineHeight: 1.4,
                          }}
                        >
                          {item.descrizione}
                        </p>
                      )}
                      {item.prezzo !== null && (
                        <p
                          className="mt-1.5 text-[0.8rem] font-medium tracking-wide"
                          style={{ color: "#888", fontFamily: "var(--font-quicksand)" }}
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

      </div>
    </div>
  )
}
