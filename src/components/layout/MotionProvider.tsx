"use client"

import { LazyMotion, domAnimation } from "framer-motion"

/**
 * Provider LazyMotion — carica solo le feature `domAnimation` (essenziali)
 * invece dell'intero bundle Framer Motion. Riduce ~30-40 KB gzipped.
 * 
 * Wrap solo i componenti che usano <motion.div>, <AnimatePresence>, ecc.
 * Le feature avanzate (layout animations, drag) non sono incluse.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}
