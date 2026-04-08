"use client"

import { useEffect, useRef } from "react"
import { motion, type Variants } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import { useTransition } from "@/contexts/TransitionContext"

const variants: Variants = {
  idle: {
    y: "100vh",
    x: "-50vw",
    rotate: -45,
    scale: 0.5,
    opacity: 0,
  },
  covering: {
    y: "0vh",
    x: "0vw",
    rotate: 0,
    scale: 3,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] },
  },
  exit: {
    y: "-100vh",
    x: "50vw",
    rotate: 45,
    scale: 4,
    opacity: 0,
    transition: { duration: 0.6, ease: [0.12, 0, 0.39, 0] },
  },
}

export default function LeafOverlay() {
  const { isTransitioning, pendingRoute, endTransition } = useTransition()
  const router = useRouter()
  const pathname = usePathname()
  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname
      const timer = setTimeout(() => {
        endTransition()
      }, 100)
      return () => clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  function handleAnimationComplete(definition: unknown) {
    if (definition === "covering" && pendingRoute) {
      router.push(pendingRoute)
    }
  }

  return (
    <motion.div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden">
      <motion.img
        src="/palma.png"
        alt=""
        className="w-full h-auto object-cover max-w-4xl"
        initial="idle"
        animate={isTransitioning ? "covering" : "exit"}
        variants={variants}
        onAnimationComplete={handleAnimationComplete}
        style={{ willChange: "transform, opacity" }}
      />
    </motion.div>
  )
}
