import type { Metadata } from "next"

import { AboutHeader } from "@/components/about/AboutHeader"
import { AuthorityBand } from "@/components/about/AuthorityBand"
import { ExecutiveBoards } from "@/components/about/ExecutiveBoards"
import { Headquarters } from "@/components/about/Headquarters"
import { Heritage } from "@/components/about/Heritage"
import { Mission } from "@/components/about/Mission"
import { Overview } from "@/components/about/Overview"
import { Pillars } from "@/components/about/Pillars"
import { StructuralFrameworks } from "@/components/about/StructuralFrameworks"
import { SubCommittees } from "@/components/about/SubCommittees"
import { Vision } from "@/components/about/Vision"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"

/**
 * The first per-page metadata in the repo. `layout.tsx` keeps the site-wide
 * default and Next merges this over it, so only what actually differs is
 * written here.
 */
export const metadata: Metadata = {
  title: "About Us | Domino World Federation",
  description:
    "The Domino World Federation is the international governing body for the sport of dominoes, representing over 80 national member associations across five continents.",
}

export default function AboutPage() {
  return (
    // `relative` anchors the navbar, which is `fixed` and overlays the page.
    <div className="relative">
      <Navbar />

      <main className="relative z-10">
        <AboutHeader />
        <AuthorityBand />
        <Overview />
        <Heritage />
        <Vision />
        <Pillars />
        <Mission />
        <StructuralFrameworks />
        <ExecutiveBoards />
        <SubCommittees />
        <Headquarters />
      </main>

      {/* No `PageShine` and no `Join` — both are landing-page sections, and the
          About design carries neither. The footer is outside `<main>` because
          it is a landmark of its own, as on the home page. */}
      <Footer />
    </div>
  )
}
