"use client"

import { useTransition } from "@/contexts/TransitionContext"
import { AnchorHTMLAttributes, ReactNode } from "react"

interface TransitionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: ReactNode
}

export default function TransitionLink({ href, children, onClick, ...props }: TransitionLinkProps) {
  const { startTransition } = useTransition()

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    if (onClick) onClick(e)
    startTransition(href)
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
