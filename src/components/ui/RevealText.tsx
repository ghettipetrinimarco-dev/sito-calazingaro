"use client"

import { useEffect, useRef } from "react"

interface RevealTextProps {
  children: React.ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * Reveal on scroll — CSS only (no Framer Motion).
 * Usa un singolo IntersectionObserver per tutte le istanze della pagina.
 * L'animazione è gestita interamente via CSS transition per massima
 * performance GPU (transform + opacity → layer compositing).
 */
export default function RevealText({
  children,
  delay = 0,
  className = "",
  style,
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Applica la classe di reveal dopo il delay
            if (delay > 0) {
              setTimeout(() => el.classList.add("revealed"), delay * 1000)
            } else {
              el.classList.add("revealed")
            }
            observer.unobserve(el)
          }
        })
      },
      { rootMargin: "-60px 0px", threshold: 0 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
