"use client"

import { type ReactNode, type CSSProperties, type MouseEvent } from "react"
import { usePathname } from "next/navigation"
import { usePageTransition } from "@/contexts/TransitionContext"

interface TransitionLinkProps {
  href: string
  children: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: () => void
}

export default function TransitionLink({
  href,
  children,
  className,
  style,
  onClick,
}: TransitionLinkProps) {
  const pathname = usePathname()
  const { startTransition } = usePageTransition()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    // Chiama eventuali callback (es. chiusura menu mobile)
    onClick?.()

    // Stessa pagina: non avviare la transizione
    if (href === pathname) return

    startTransition(href)
  }

  return (
    <a href={href} onClick={handleClick} className={className} style={style}>
      {children}
    </a>
  )
}
