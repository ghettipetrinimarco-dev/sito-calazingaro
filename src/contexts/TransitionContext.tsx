"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

type Phase = "idle" | "covering" | "waiting" | "revealing"

interface TransitionState {
  phase: Phase
  targetHref: string
}

interface TransitionContextValue {
  state: TransitionState
  startTransition: (href: string) => void
  onCoveringComplete: () => void
  onRevealComplete: () => void
  setPhase: (phase: Phase) => void
}

const TransitionContext = createContext<TransitionContextValue | null>(null)

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TransitionState>({
    phase: "idle",
    targetHref: "",
  })

  const startTransition = useCallback((href: string) => {
    setState({ phase: "covering", targetHref: href })
  }, [])

  const onCoveringComplete = useCallback(() => {
    setState((prev) => ({ ...prev, phase: "waiting" }))
  }, [])

  const setPhase = useCallback((phase: Phase) => {
    setState((prev) => ({ ...prev, phase }))
  }, [])

  const onRevealComplete = useCallback(() => {
    setState({ phase: "idle", targetHref: "" })
  }, [])

  return (
    <TransitionContext.Provider
      value={{ state, startTransition, onCoveringComplete, onRevealComplete, setPhase }}
    >
      {children}
    </TransitionContext.Provider>
  )
}

export function usePageTransition() {
  const ctx = useContext(TransitionContext)
  if (!ctx) throw new Error("usePageTransition deve essere usato dentro TransitionProvider")
  return ctx
}
