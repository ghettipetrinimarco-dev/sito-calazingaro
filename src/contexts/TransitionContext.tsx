"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface TransitionContextType {
  isTransitioning: boolean
  pendingRoute: string | null
  startTransition: (href: string) => void
  endTransition: () => void
}

const TransitionContext = createContext<TransitionContextType | null>(null)

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [pendingRoute, setPendingRoute] = useState<string | null>(null)

  function startTransition(href: string) {
    setPendingRoute(href)
    setIsTransitioning(true)
  }

  function endTransition() {
    setIsTransitioning(false)
    setPendingRoute(null)
  }

  return (
    <TransitionContext.Provider value={{ isTransitioning, pendingRoute, startTransition, endTransition }}>
      {children}
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  const ctx = useContext(TransitionContext)
  if (!ctx) throw new Error("useTransition must be used inside TransitionProvider")
  return ctx
}
