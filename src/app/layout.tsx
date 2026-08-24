import type { Metadata } from "next"
import { Bebas_Neue, Inter } from "next/font/google"

import { RouteProgress } from "@/components/layout/RouteProgress"

import "./globals.css"

// The variables are deliberately --font-bebas / --font-inter rather than
// --font-display / --font-sans: those names belong to Tailwind v4's @theme
// namespace. See globals.css.
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
      <body className="bg-bg flex min-h-full flex-col">
        {/* Renders nothing. It watches for the page that was asked for
            arriving, and takes the progress bar down when it does. */}
        <RouteProgress />
        {children}
      </body>
    </html>
  )
}
