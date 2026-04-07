interface SectionLabelProps {
  children: React.ReactNode
  light?: boolean
  className?: string
}

export default function SectionLabel({
  children,
  light = false,
  className = "",
}: SectionLabelProps) {
  return (
    <p
      className={`text-[0.6rem] tracking-[0.2em] uppercase mb-3 ${className}`}
      style={{ color: light ? "rgba(244,242,237,0.4)" : "var(--color-subtle)" }}
    >
      {children}
    </p>
  )
}
