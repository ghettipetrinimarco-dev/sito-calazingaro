interface SectionLabelProps {
  children: React.ReactNode
  light?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function SectionLabel({
  children,
  light = false,
  className = "",
  style,
}: SectionLabelProps) {
  return (
    <p
      className={`text-[1rem] tracking-[0.18em] uppercase mb-3 ${className}`}
      style={{ color: light ? "rgba(244,242,237,0.4)" : "var(--color-subtle)", ...style }}
    >
      {children}
    </p>
  )
}
