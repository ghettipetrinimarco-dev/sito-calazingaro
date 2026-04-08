"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, useScroll, useTransform } from "framer-motion"
import { Menu } from "lucide-react"

const MotionImage = motion(Image)
import MobileMenu from "./MobileMenu"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  
  // Riferimento per conoscere la larghezza vera della navbar (senza contare la scrollbar del browser)
  const headerRef = useRef<HTMLElement>(null)
  const [containerWidth, setContainerWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  )

  useEffect(() => {
    if (!headerRef.current) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })
    ro.observe(headerRef.current)
    return () => ro.disconnect()
  }, [])

  const { scrollY } = useScroll()

  // Resetta scrollY ad ogni cambio di pagina — evita il flash del logo a sinistra
  // quando si torna dalla pagina /menu (il componente non si rimonta, il MotionValue persiste)
  useEffect(() => {
    scrollY.set(0)
    window.scrollTo(0, 0)
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps


  // Sincronia fisica continua: Height e Background passano dai valori Hero a quelli Sticky in 120px di scroll
  const headerHeight = useTransform(scrollY, [0, 120], [88, 64])
  const headerBgOpacity = useTransform(scrollY, [40, 120], [0, 1])
  const shadowOpacity = useTransform(scrollY, [80, 120], [0, 0.06])

  // --- ORA IL MOVIMENTO È PURO E DISTRIBUITO SU DUE LIVELLI ---
  // Livello 1: Sposta il container da "Centro Esatto" (metà dei pixel reali) a 24px da sinistra. Puro float.
  const logoXPosition = useTransform(scrollY, [0, 120], [containerWidth / 2, 24])
  
  // Livello 2: Quando è al centro, il logo deve scalare se stesso di -50% per essere centrato perfettamente. 
  // Mentre va verso sinistra, questo offset sparisce (va a 0%) per allinearlo alla parete mancina.
  const logoSelfTranslation = useTransform(scrollY, [0, 120], ["-50%", "0%"])
  
  const logoHeightPx = useTransform(scrollY, [0, 120], [72, 44])

  // Opacità dinamica dei loghi per transizione da bianco (Hero) a nero (Sfondo sabbia)
  const whiteLogoOpacity = useTransform(scrollY, [0, 80], [1, 0])
  const colorLogoOpacity = useTransform(scrollY, [40, 120], [0, 1])

  // Elementi Menu a Destra
  const rightElementsOpacity = useTransform(scrollY, [60, 120], [0, 1])
  const rightElementsPointerEvents = useTransform(scrollY, (v) => (v > 60 ? "auto" : "none"))

  // HOOKS RIFATTORIZZATI: Da mettere SEMPRE prima di qualsiasi return condizionale!
  const headerBgColor = useTransform(headerBgOpacity, (o) => `rgba(223, 210, 196, ${o})`)
  const headerBoxShadow = useTransform(shadowOpacity, (o) => `0 1px 0 rgba(0,0,0,${o})`)

  if (pathname === "/menu") return null

  return (
    <>
      <motion.header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-40"
        style={{
          height: headerHeight,
          backgroundColor: headerBgColor, // Variabile sicura
          boxShadow: headerBoxShadow,     // Variabile sicura
        }}
      >
        {/* Livello 1: Inseguitore X (dal centro a 24px limite sinistro) */}
        <motion.div
          className="absolute"
          style={{
            top: "50%",
            left: 0,
            x: logoXPosition,
            y: "-50%",
            height: logoHeightPx,
            display: "flex",
            alignItems: "center"
          }}
        >
          {/* Livello 2: Offset di allineamento del logo (passa da -50% a 0%) */}
          <motion.div style={{ x: logoSelfTranslation, height: "100%", position: "relative" }}>
            <Link href="/" aria-label="Cala Zingaro — home" className="w-full h-full flex items-center">
              {/* Vettoriale Colorato (nel DOM normale per dare la larghezza al container) */}
              <MotionImage
                src="/images/logo.svg"
                alt="Cala Zingaro"
                width={200}
                height={72}
                style={{ height: "100%", width: "auto", display: "block", opacity: colorLogoOpacity }}
              />

              {/* Vettoriale Bianco Invertito (assoluto, si sovrappone a quello sopra) */}
              <MotionImage
                src="/images/logo.svg"
                alt=""
                width={200}
                height={72}
                style={{
                  height: "100%",
                  width: "auto",
                  display: "block",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  filter: "brightness(0) invert(1)",
                  opacity: whiteLogoOpacity
                }}
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Pulsanti destra */}
        <motion.div
          className="absolute right-6 md:right-10 flex items-center gap-3"
          style={{
            top: "50%",
            y: "-50%",
            opacity: rightElementsOpacity,
            pointerEvents: rightElementsPointerEvents as any,
          }}
        >
          <Link
            href="#prenota"
            className="text-[0.6rem] tracking-widest uppercase px-4 py-2 rounded-full border transition-colors duration-300"
            style={{ borderColor: "var(--color-text)", color: "var(--color-text)" }}
          >
            Prenota
          </Link>

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Apri menu"
            style={{ color: "var(--color-text)" }}
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </motion.div>
      </motion.header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
