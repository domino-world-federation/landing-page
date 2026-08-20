import type { Metadata } from "next"
import { Bebas_Neue, Inter } from "next/font/google"

import "./globals.css"

// Variabel sengaja --font-bebas / --font-inter, bukan --font-display /
// --font-sans: nama itu milik namespace @theme Tailwind v4. Lihat globals.css.
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Domino World Federation",
  description:
    "The global governing body for domino — tournaments, rankings, and official federation resources.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="bg-bg flex min-h-full flex-col">{children}</body>
    </html>
  )
}
