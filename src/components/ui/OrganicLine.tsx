/**
 * OrganicLine — linea sottile con irregolarità chalk minima.
 * scale=2 → quasi dritto, solo leggermente vivo. Non esagerato.
 */

import { useId } from "react"

interface OrganicLineProps {
  color?: string
  opacity?: number
  className?: string
}

export default function OrganicLine({
  color = "currentColor",
  opacity = 0.2,
  className = "",
}: OrganicLineProps) {
  const uid = useId()
  const filterId = `ol-${uid}`

  return (
    <svg
      aria-hidden="true"
      className={`w-full overflow-visible ${className}`}
      height="2"
      preserveAspectRatio="none"
      viewBox="0 0 200 2"
      fill="none"
    >
      <defs>
        <filter id={filterId} x="-5%" y="-400%" width="110%" height="900%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03 0.4"
            numOctaves={3}
            seed={7}
            result="wave"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="wave"
            scale={2}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <line
        x1="0" y1="1" x2="200" y2="1"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        filter={`url(#${filterId})`}
        opacity={opacity}
      />
    </svg>
  )
}
