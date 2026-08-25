import type { Metadata } from "next"

import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { ApplicationProcess } from "@/components/members/ApplicationProcess"
import { MemberDirectory } from "@/components/members/MemberDirectory"
import { MembersCta } from "@/components/members/MembersCta"
import { MembersHero } from "@/components/members/MembersHero"
import { MembersMap } from "@/components/members/MembersMap"
import { MembershipBenefits } from "@/components/members/MembershipBenefits"
import { PageShine } from "@/components/ui/PageShine"

export const metadata: Metadata = {
  title: "Members | Domino World Federation",
  description:
    "The federation's global membership — national bodies across six continents, what membership grants, and the four-step pathway to DWF recognition.",
}

/**
 * `/members` — Figma screen `386:18480`, in the "Members" section of the
 * **updated** design file.
 *
 * The first page built from `xdogWlTYLSqwh2fBTmxPJi`, which replaced
 * `1Q8Ud3Iq0dSR0KXymurySI` on 2026-08-25. Every node reference in the older
 * pages' docs points at the previous file; this page's point here.
 *
 * **It does not open on the header band.** The other seven inner pages start
 * with a title on the page background; this one starts with a 1080px hero — a
 * centred title, a gold pill and four figures. That is the design's call and it
 * is right: the band is for pages that are documents or archives, and this one
 * is a pitch. For the same reason the title is not run through
 * `SharpeningHeadline` — Figma gives it no `blur(7.5px)` to clear from.
 *
 * The shine is a child of the page rather than of a group at its foot, as on
 * `/development`: `isolate` keeps its `-z-10` from sliding behind the page
 * background, `<main>` sits above it at `z-10`, and the footer paints between
 * the two. Figma starts the artwork at `y:3561` — exactly where the application
 * process begins — and ends it at 5468, the foot of the document, so anchoring
 * to the bottom reproduces both ends without measuring a section whose height
 * depends on how its copy wraps.
 */
export default function MembersPage() {
  return (
    // `relative` anchors the navbar, which is `fixed` and overlays the page;
    // `isolate` gives the shine below a stacking context to be behind.
    <div className="relative isolate">
      <Navbar />

      <PageShine
        src="/assets/members/decor-shine.svg"
        aspectClass="aspect-[1920/1907]"
      />

      <main className="relative z-10">
        <MembersHero />
        <MembersMap />
        <MemberDirectory />
        <MembershipBenefits />
        <ApplicationProcess />
        <MembersCta />
      </main>

      {/* Outside `<main>`: the footer is a landmark of its own, as on every
          other page. No `Join` — that is a landing-page section, and this page
          closes with its own CTA. */}
      <Footer />
    </div>
  )
}
