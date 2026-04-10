"use client"

import Image from "next/image"
import { X } from "lucide-react"
import { m } from "framer-motion"
import { bevande } from "@/data/bevande"
import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

export default function ViniPage() {
  const router = useRouter()

  const handleClose = useCallback(() => {
    const returnPath = sessionStorage.getItem("menuReturnPath") || "/"
    const returnScroll = parseInt(sessionStorage.getItem("menuReturnScroll") || "0")
    sessionStorage.removeItem("menuReturnPath")
    sessionStorage.removeItem("menuReturnScroll")
    router.replace(returnPath)
    setTimeout(() => window.scrollTo({ top: returnScroll, behavior: "instant" }), 100)
  }, [router])

  useEffect(() => {
    document.documentElement.style.backgroundColor = "#ffffff"
    document.body.style.backgroundColor = "#ffffff"
    document.body.style.overscrollBehaviorY = "none"
    return () => {
      document.documentElement.style.backgroundColor = ""
      document.body.style.backgroundColor = ""
      document.body.style.overscrollBehaviorY = ""
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-white text-[#111] overflow-x-hidden">

      {/* X chiudi — torna alla pagina precedente con hamburger aperto */}
      <button
        onClick={handleClose}
        aria-label="Chiudi"
        className="fixed top-5 right-5 z-50 p-2"
        style={{
          color: "#fff",
          filter: "drop-shadow(0 0 3px rgba(0,0,0,0.6)) drop-shadow(0 0 8px rgba(0,0,0,0.3))",
        }}
      >
        <X strokeWidth={2} size={34} />
      </button>

      {/* Cornice Foglie */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        <div
          className="absolute top-0 bottom-0 left-0 w-[20vw] sm:w-[24vw] md:w-[28vw] lg:w-[30vw] xl:w-[32vw]"
          style={{
            maskImage: "linear-gradient(to right, black 55%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, black 55%, transparent 100%)",
          }}
        >
          <Image src="/images/foglie-menu-sx.webp" alt="" fill sizes="(max-width: 640px) 20vw, (max-width: 768px) 24vw, (max-width: 1024px) 28vw, 32vw" className="object-cover" style={{ objectPosition: "left top" }} priority />
        </div>
        <div
          className="absolute top-0 bottom-0 right-0 w-[20vw] sm:w-[24vw] md:w-[28vw] lg:w-[30vw] xl:w-[32vw]"
          style={{
            maskImage: "linear-gradient(to left, black 55%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to left, black 55%, transparent 100%)",
          }}
        >
          <Image src="/images/foglie-menu-dx.webp" alt="" fill sizes="(max-width: 640px) 20vw, (max-width: 768px) 24vw, (max-width: 1024px) 28vw, 32vw" className="object-cover" style={{ objectPosition: "right top" }} priority />
        </div>
      </div>

      {/* Contenuto */}
      <div className="relative z-20 max-w-3xl mx-auto px-[24vw] sm:px-10 md:px-12 pt-28 md:pt-36 pb-24">

        {/* Titolo */}
        <m.div
          className="text-center mb-16 md:mb-24 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
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
              fontSize: "clamp(4rem, 16vw, 9rem)",
            }}
          >
            Bevande
          </h1>
        </m.div>

        {/* Griglia categorie — 1 colonna mobile, 2 colonne desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-x-16 md:gap-y-16">
          {bevande.map((categoria, catIndex) => (
            <m.section
              key={categoria.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: catIndex * 0.05 }}
            >
              {/* Nome categoria */}
              <h2
                className="uppercase text-center mb-5"
                style={{
                  fontFamily: "var(--font-yanone)",
                  fontWeight: 400,
                  fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
                  letterSpacing: "0.08em",
                }}
              >
                {categoria.nome}
              </h2>

              {/* Separatore */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-[#ddd]" />
                <div className="w-1 h-1 rounded-full bg-[#ddd]" />
                <div className="flex-1 h-px bg-[#ddd]" />
              </div>

              {/* Voci */}
              <div className="space-y-2">
                {categoria.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-baseline gap-4">
                    <span
                      style={{
                        fontFamily: "var(--font-quicksand)",
                        fontWeight: 500,
                        fontSize: "0.88rem",
                        color: "#111",
                      }}
                    >
                      {item.nome}
                      {item.note && (
                        <span style={{ fontWeight: 300, color: "#888", marginLeft: 4 }}>
                          ({item.note})
                        </span>
                      )}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-quicksand)",
                        fontWeight: 400,
                        fontSize: "0.85rem",
                        color: "#888",
                        whiteSpace: "nowrap",
                      }}
                    >
                      € {item.prezzo}
                    </span>
                  </div>
                ))}
              </div>
            </m.section>
          ))}
        </div>


      </div>
    </div>
  )
}
