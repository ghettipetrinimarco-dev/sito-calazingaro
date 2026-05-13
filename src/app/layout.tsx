import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, JetBrains_Mono, Quicksand, Yanone_Kaffeesatz } from "next/font/google"
import LenisProvider from "@/components/layout/LenisProvider"
import MotionProvider from "@/components/layout/MotionProvider"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { TransitionProvider } from "@/contexts/TransitionContext"
import LeafOverlay from "@/components/transitions/LeafOverlay"
import "./globals.css"

const yanone = Yanone_Kaffeesatz({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  variable: "--font-yanone",
  display: "swap",
})

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-quicksand",
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: "Cala Zingaro — Beach Club & Ristorante | Milano Marittima",
    template: "%s | Cala Zingaro",
  },
  description:
    "Beach club e ristorante sulla spiaggia di Milano Marittima. Pranzo, aperitivo, cena e dopocena ogni weekend. Prenota il tuo posto.",
  metadataBase: new URL("https://calazingaro.it"),
  openGraph: {
    siteName: "Cala Zingaro",
    locale: "it_IT",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${yanone.variable} ${quicksand.variable} ${cormorant.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-full flex flex-col">
        <TransitionProvider>
          <MotionProvider>
            <LeafOverlay />
            <LenisProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </LenisProvider>
          </MotionProvider>
        </TransitionProvider>
      </body>
    </html>
  )
}
