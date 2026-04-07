import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Cala Zingaro — Beach Club & Ristorante | Milano Marittima",
    template: "%s | Cala Zingaro",
  },
  description:
    "Beach club e ristorante a Milano Marittima. Ombrelloni, lettini e cucina di qualità a due passi dal mare. Prenota il tuo posto.",
  metadataBase: new URL("https://calazingaro.it"),
  openGraph: {
    siteName: "Cala Zingaro",
    locale: "it_IT",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it" className={`${GeistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
