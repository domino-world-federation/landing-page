import type { Metadata } from "next"

import { DominoFaq } from "@/components/domino/DominoFaq"
import { DominoHeader } from "@/components/domino/DominoHeader"
import { FormatSplit } from "@/components/domino/FormatSplit"
import { Regulations } from "@/components/domino/Regulations"
import { TileBand } from "@/components/domino/TileBand"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"

export const metadata: Metadata = {
  title: "Domino | Domino World Federation",
  description:
    "The rules, formats and regulations of sanctioned dominoes — singles and doubles play, referee guidelines, and the federation's official rulebook.",
}

/**
 * `/domino` — Figma screen `119:4737`, plus the wireframe `119:4474` for the
 * two blocks the hi-fi never drew.
 *
 * **Five sections, not six.** The wireframe specifies an "Official Game Rules"
 * block with a tabbed interface between them; it is not built (D42, risk R12).
 * Its hi-fi was never drawn, and five of its seven wireframe tabs are labelled
 * "SCORING" — so building it would mean inventing both a component and the copy
 * to put in it.
 *
 * Same shell as About, deliberately: two pages of one site that open differently
 * for no reason a reader could name is a defect, not a variation.
 */
export default function DominoPage() {
  return (
    // `relative` anchors the navbar, which is `fixed` and overlays the page.
    <div className="relative">
      <Navbar />

      <main className="relative z-10">
        <DominoHeader />
        <TileBand />
        <FormatSplit />
        <Regulations />
        <DominoFaq />
      </main>

      {/* Outside `<main>`: the footer is a landmark of its own, as on the other
          two pages. No `PageShine`, no `Join` — both are landing-page
          sections. */}
      <Footer />
    </div>
  )
}
