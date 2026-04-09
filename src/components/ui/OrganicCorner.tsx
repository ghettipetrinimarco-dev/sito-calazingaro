"use client"

import { useId } from "react"

type CornerPosition = "bottom-left" | "bottom-right" | "top-left" | "top-right"

interface OrganicCornerProps {
  position: CornerPosition
  size?: number
  color?: string
  opacity?: number
  inset?: number
}

export default function OrganicCorner({
  position,
  size = 42,
  color = "rgba(255,255,255,0.75)",
  opacity = 1,
  inset = 14,
}: OrganicCornerProps) {
  const uid = useId()
  const filterId = `oc-${uid}`

  const s = size
  const arm = s * 0.88

  let path: string
  switch (position) {
    case "bottom-left":
      path = `M 0,${s * 0.12} L 0,${s} L ${arm},${s}`
      break
    case "bottom-right":
      path = `M ${s},${s * 0.12} L ${s},${s} L ${s - arm},${s}`
      break
    case "top-left":
      path = `M 0,${s * 0.88} L 0,0 L ${arm},0`
      break
    case "top-right":
      path = `M ${s},${s * 0.88} L ${s},0 L ${s - arm},0`
      break
  }

  const posStyle: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    pointerEvents: "none",
    zIndex: 10,
  }
  if (position.includes("bottom")) posStyle.bottom = inset
  else posStyle.top = inset
  if (position.includes("left")) posStyle.left = inset
  else posStyle.right = inset

  return (
    <svg
      aria-hidden="true"
      style={posStyle}
      viewBox={`0 0 ${s} ${s}`}
      fill="none"
      overflow="visible"
    >
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02 0.06"
            numOctaves={3}
            seed={23}
            result="wave"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="wave"
            scale={2.2}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <path
        d={path}
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={`url(#${filterId})`}
        opacity={opacity}
      />
    </svg>
  )
}
