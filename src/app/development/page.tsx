import type { Metadata } from "next"

import { Certifications } from "@/components/development/Certifications"
import { ClassroomBand } from "@/components/development/ClassroomBand"
import { DevelopmentCta } from "@/components/development/DevelopmentCta"
import { DevelopmentHeader } from "@/components/development/DevelopmentHeader"
import { DevelopmentNews } from "@/components/development/DevelopmentNews"
import { Grassroots } from "@/components/development/Grassroots"
import { Library } from "@/components/development/Library"
import { SupportPrograms } from "@/components/development/SupportPrograms"
import { YouthProgram } from "@/components/development/YouthProgram"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { PageShine } from "@/components/ui/PageShine"

export const metadata: Metadata = {
  title: "Development | Domino World Federation",
  description:
    "How the federation grows the game — youth programmes in partner schools, referee and coaching certification, grassroots initiatives, and support for national member bodies.",
}

/**
 * `/development` — Figma screen `190:13600`.
 *
 * Nine blocks, and unlike Domino the hi-fi draws all of them (D42's shortfall
 * does not repeat here). Same shell as About and Domino: a header band under
 * the `fixed` navbar, a full-bleed photograph, then the page's sections.
 *
 * **The shine is a child of the page rather than of a group at its foot.** On
 * the landing page it wraps the last two blocks and the footer in a
 * `relative isolate` div, which is what D26 had to correct with a `z-10` on
 * `<main>` after the wash printed over the FAQ card — and it also puts a CTA
 * section outside every landmark on the page. Here the layer is pinned to the
 * bottom of the page's own box: `isolate` keeps its `-z-10` from sliding behind
 * the page background, `<main>` sits above it at `z-10`, and the footer paints
 * between the two. Figma starts the artwork at `y:5388`, which is exactly where
 * Federation Support Programs begins, and ends it at 7459 — the foot of the
 * document. Anchoring to the foot is what reproduces both ends without
 * measuring a section whose height depends on how its copy wraps.
 */
export default function DevelopmentPage() {
  return (
    // `relative` anchors the navbar, which is `fixed` and overlays the page;
    // `isolate` gives the shine below a stacking context to be behind.
    <div className="relative isolate">
      <Navbar />

      <PageShine
        src="/assets/development/decor-shine.svg"
        aspectClass="aspect-[1920/2071]"
      />

      <main className="relative z-10">
        <DevelopmentHeader />
        <ClassroomBand />
        <YouthProgram />
        <Certifications />
        <Library />
        <Grassroots />
        <DevelopmentNews />
        <SupportPrograms />
        <DevelopmentCta />
      </main>

      {/* Outside `<main>`: the footer is a landmark of its own, as on the
          other three pages. No `Join` — that is a landing-page section, and
          this page closes with its own CTA. */}
      <Footer />
    </div>
  )
}
