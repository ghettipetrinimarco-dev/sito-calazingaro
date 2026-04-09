/**
 * OrganicLink — link con underline chalk al posto del border-b CSS.
 * L'underline è un SVG asimmetrico leggermente irregolare, non un semplice border.
 */

import { useId } from "react"
import TransitionLink from "@/components/transitions/TransitionLink"

interface OrganicLinkProps {
  href: string
  children: React.ReactNode
  color?: string
  className?: string
  external?: boolean
}

export default function OrganicLink({
  href,
  children,
  color = "currentColor",
  className = "",
  external = false,
}: OrganicLinkProps) {
  const uid = useId()
  const filterId = `ul-${uid}`

  const inner = (
    <span className="relative inline-block">
      <span className={`relative ${className}`} style={{ color }}>
        {children}
      </span>
      {/* Underline organica */}
      <svg
        aria-hidden="true"
        className="absolute left-0 w-full overflow-visible pointer-events-none"
        style={{ bottom: -5, height: 4 }}
        viewBox="0 0 100 3"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <filter id={filterId} x="-5%" y="-400%" width="110%" height="900%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.025 0.5"
              numOctaves={3}
              seed={14}
              result="wave"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="wave"
              scale={1.5}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
        {/* Leggera asimmetria: parte da y=2, finisce a y=1.5 */}
        <path
          d="M 0,2 C 25,1.5 50,2.5 75,1.8 C 88,1.5 95,2 100,1.5"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
          fill="none"
          filter={`url(#${filterId})`}
          opacity={0.9}
        />
      </svg>
    </span>
  )

  if (external) {
    return <a href={href}>{inner}</a>
  }

  return <TransitionLink href={href}>{inner}</TransitionLink>
}
