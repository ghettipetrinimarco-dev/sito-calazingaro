"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export default function Footer() {
  const pathname = usePathname()

  if (pathname === "/menu" || pathname === "/vini" || pathname === "/prenota") return null

  return (
    <footer className="relative z-50" style={{ backgroundColor: "var(--color-ink)" }}>
      <div className="px-6 md:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo + tagline */}
        <div>
          <Image
            src="/images/logo.svg"
            alt="Cala Zingaro"
            width={140}
            height={48}
            className="mb-3"
            style={{ height: 36, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.7 }}
          />
          <p className="text-xs leading-relaxed" style={{ color: "rgba(244,242,237,0.35)" }}>
            Beach Club & Ristorante<br />
            Milano Marittima (RA)<br />
            Aperto ogni weekend
          </p>
        </div>

        {/* Contatti */}
        <div>
          <p
            className="text-[0.6rem] tracking-widest uppercase mb-3"
            style={{ color: "rgba(244,242,237,0.3)" }}
          >
            Contatti
          </p>
          <div className="text-xs leading-loose" style={{ color: "rgba(244,242,237,0.4)" }}>
            <a
              href="tel:+393791203796"
              className="block hover:text-white/70 transition-colors"
            >
              +39 379 1203796
            </a>
            <a
              href="mailto:info@calazingaro.com"
              className="block hover:text-white/70 transition-colors"
            >
              info@calazingaro.com
            </a>
            <p className="mt-2" style={{ color: "rgba(244,242,237,0.25)" }}>
              Traversa XIX Pineta, 48015<br />
              Milano Marittima (RA)
            </p>
          </div>
        </div>

        {/* Social */}
        <div>
          <p
            className="text-[0.6rem] tracking-widest uppercase mb-3"
            style={{ color: "rgba(244,242,237,0.3)" }}
          >
            Seguici
          </p>
          <div className="flex flex-col gap-1.5">
            <a
              href="https://www.instagram.com/calazingaro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:text-white/70 transition-colors"
              style={{ color: "rgba(244,242,237,0.4)" }}
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/calazingaro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:text-white/70 transition-colors"
              style={{ color: "rgba(244,242,237,0.4)" }}
            >
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div
        className="px-6 md:px-10 py-4 flex justify-between items-center text-[0.6rem] tracking-wide"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          color: "rgba(244,242,237,0.2)",
        }}
      >
        <span>© 2026 Cala Zingaro — Patti Srl — P.IVA IT00720310390</span>
        <Link
          href="/admin/dashboard"
          className="hover:text-white/40 transition-colors"
        >
          Admin
        </Link>
      </div>
    </footer>
  )
}
