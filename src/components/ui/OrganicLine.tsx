"use client"

import { useId } from "react"

interface OrganicLineProps {
  color?: string
  opacity?: number
  className?: string
}

export default function OrganicLine({
  color = "currentColor",
  opacity = 0.9,
  className = "",
}: OrganicLineProps) {
  const uid = useId()
  const filterId = `ol-${uid}`

  return (
    <svg
      aria-hidden="true"
      className={`w-full overflow-visible ${className}`}
      style={{ height: 6, display: "block" }}
      viewBox="0 0 1000 6"
      preserveAspectRatio="none"
      fill="none"
    >
      <defs>
        <filter id={filterId} x="-2%" y="-300%" width="104%" height="700%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.3"
            numOctaves={3}
            seed={7}
            result="wave"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="wave"
            scale={2.5}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <path
        d="M 0,3 C 200,2.5 400,3.5 600,2.8 C 750,2.3 900,3.2 1000,3"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
        filter={`url(#${filterId})`}
        opacity={opacity}
      />
    </svg>
  )
}
