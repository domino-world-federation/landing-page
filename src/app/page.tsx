// Sections S5–S14 still to come — see docs/PROGRESS.md, phase 2.

import { Navbar } from "@/components/layout/Navbar"
import { Countdown } from "@/components/sections/Countdown"
import { FeatureHq } from "@/components/sections/FeatureHq"
import { Hero } from "@/components/sections/Hero"

export default function HomePage() {
  return (
    // `relative` anchors the navbar, which overlays the hero (S1).
    <div className="relative">
      <Navbar />

      <main>
        <Hero />

        {/* S3 overlaps the hero in Figma (`y:785` of a 1040-tall frame) and
            hangs ~150px past its bottom edge. It cannot live inside the hero,
            whose `overflow-hidden` corrals the rocks and would clip it — so
            the overlap is done here, by pulling the card up into the hero.

            13.3% puts the card's top at Figma's `y:785`. A percentage margin
            resolves against the container's WIDTH, and from `lg` the hero's
            height is pinned to its width by `aspect-[1920/1040]` — so the two
            scale together and the placement holds at every width:
            (1 − 785/1040) × 1040/1920 = 0.133.

            The overlap waits for `menu` (1400) rather than starting at `lg`,
            because pulling the card up puts it *through* the hero's last row,
            where Figma sets the mission copy hard left and the accountability
            block hard right. The card is a fixed 498px and centred, so that row
            needs 80 + 288 + 498 + 316 + 80 — it first fits at 1290px, and below
            that the card ate the end of "…and setting fair global standards" on
            the left and the "Official Rules" button on the right (measured: 41px
            and 5px of bite at 1440 and 1280 before the mission cap, 105/133 at
            1024). `menu` is the measured token nearest that threshold and
            leaves margin. Below it the card simply follows the hero, which is
            what it already did below `lg`. */}
        <div className="relative z-40 flex justify-center px-5 py-12 lg:px-20 menu:-mt-[13.3%] menu:pt-0 menu:pb-0">
          <Countdown />
        </div>

        <FeatureHq />
      </main>
    </div>
  )
}
