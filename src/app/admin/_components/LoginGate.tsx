"use client"

import Image from "next/image"
import { useState } from "react"
import { m } from "framer-motion"

interface Props {
  onEnter: () => void
}

export default function LoginGate({ onEnter }: Props) {
  const [password, setPassword] = useState("")

  return (
    <m.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="grid min-h-[100dvh] place-items-center px-5"
    >
      <div className="w-full max-w-[340px]">
        <div className="mx-auto mb-10 flex h-[74px] items-center justify-center">
          <div className="relative h-[60px] w-[176px]">
            <Image
              src="/images/logo.svg"
              alt="Cala Zingaro"
              fill
              priority
              sizes="180px"
              className="object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            onEnter()
          }}
          className="grid gap-3"
        >
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            aria-label="Password"
            autoComplete="current-password"
            autoFocus
            className="h-12 rounded-[6px] border px-4 text-[0.95rem] outline-none transition placeholder:text-white/35"
            style={{
              background: "rgba(255,255,255,0.05)",
              borderColor: "rgba(255,255,255,0.1)",
              color: "var(--adm-sand)",
              fontFamily: "var(--font-quicksand)",
            }}
            onFocus={(event) => {
              event.currentTarget.style.borderColor = "var(--adm-accent)"
              event.currentTarget.style.boxShadow = "0 0 0 4px rgba(200,168,122,0.14)"
            }}
            onBlur={(event) => {
              event.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"
              event.currentTarget.style.boxShadow = "none"
            }}
          />
          <button
            type="submit"
            className="h-12 rounded-[6px] text-[0.78rem] tracking-[0.06em] transition"
            style={{
              background: "var(--adm-accent)",
              color: "var(--adm-ink)",
              fontFamily: "var(--font-quicksand)",
              fontWeight: 600,
            }}
            onMouseEnter={(event) => (event.currentTarget.style.background = "#d6bb91")}
            onMouseLeave={(event) => (event.currentTarget.style.background = "var(--adm-accent)")}
          >
            Entra
          </button>
        </form>

      </div>
    </m.section>
  )
}
