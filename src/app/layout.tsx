import type { Metadata } from "next"
import { Cormorant_Garamond, Antonio, Yanone_Kaffeesatz, Quicksand } from "next/font/google"
import LenisProvider from "@/components/layout/LenisProvider"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant-var",
  display: "swap",
})

const antonio = Antonio({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400"],
  variable: "--font-antonio",
  display: "swap",
})

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
    <html lang="it" className={`${cormorant.variable} ${antonio.variable} ${yanone.variable} ${quicksand.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LenisProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  )
}
