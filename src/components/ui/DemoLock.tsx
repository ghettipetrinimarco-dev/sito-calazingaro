"use client"

export default function DemoLock({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}

      {/* Overlay blur */}
      <div
        className="absolute inset-0 z-40"
        style={{
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          background: "rgba(244, 242, 237, 0.72)",
          pointerEvents: "all",
        }}
      />

      {/* Lock badge — sticky così rimane visibile mentre scorri */}
      <div
        className="absolute inset-x-0 top-0 z-50 flex justify-center"
        style={{ paddingTop: "max(6rem, 10vh)" }}
      >
        <div
          className="flex flex-col items-center gap-4 px-8 py-6 text-center"
          style={{
            background: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: "1.5rem",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            maxWidth: 340,
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          }}
        >
          {/* Lock icon */}
          <svg
            width={40}
            height={40}
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(0,0,0,0.5)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>

          <p
            style={{
              fontFamily: "var(--font-yanone)",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 400,
              letterSpacing: "0.04em",
              color: "rgba(0,0,0,0.75)",
              lineHeight: 1.2,
            }}
          >
            In lavorazione
          </p>
          <p
            style={{
              fontFamily: "var(--font-quicksand)",
              fontSize: "0.82rem",
              letterSpacing: "0.08em",
              color: "rgba(0,0,0,0.4)",
              lineHeight: 1.6,
            }}
          >
            Queste sezioni sono ancora<br />
            in fase di sviluppo.
          </p>
        </div>
      </div>
    </div>
  )
}
