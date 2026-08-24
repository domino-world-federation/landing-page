import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { Countdown } from "@/components/home/Countdown"
import { Faq } from "@/components/home/Faq"
import { FeatureHq } from "@/components/home/FeatureHq"
import { FeaturedEvent } from "@/components/home/FeaturedEvent"
import { Hero } from "@/components/home/Hero"
import { Join } from "@/components/home/Join"
import { News } from "@/components/home/News"
import { NewsIntro } from "@/components/home/NewsIntro"
import { Partners } from "@/components/home/Partners"
import { Resources } from "@/components/home/Resources"
import { Stats } from "@/components/home/Stats"
import { PageShine } from "@/components/ui/PageShine"

export default function HomePage() {
  return (
    // `relative` anchors the navbar, which overlays the hero (S1).
    <div className="relative">
      <Navbar />

      {/* `relative z-10` so the page's content sits above the shine below it.
          The shine's own `-z-10` only orders it inside its wrapper — `isolate`
          seals that context shut, so from the outside the wrapper is one
          opaque-ordered unit and, being a LATER sibling, it painted over
          everything here. The layer reaches ~500px up into the FAQ (S12), and
          without this its dark wash fell across the white card. Figma has the
          same overlap and the same answer: the card is opaque and the beams
          run behind it. */}
      <main className="relative z-10">
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
        <Stats />
        <FeaturedEvent />
        <NewsIntro />
        <News />
        <Partners />
        <Resources />
        <Faq />

        {/* S12 and S13 share one stacking context, and it has to be here
            rather than on either of them: the shine is a full-bleed layer that
            spans the FAQ's foot, the CTA and the whole footer, so it cannot
            live inside any one of the three. `isolate` keeps its `-z-10` from
            escaping into the page's root context and sliding behind the page
            background itself — the same guard S4 and S7 need for their own
            backdrops.

            The footer is inside the wrapper but outside `<main>`: it is a
            landmark of its own, and the shine has to reach it. */}
      </main>

      <div className="relative isolate">
        <PageShine
          src="/assets/home/decor-shine.svg"
          aspectClass="aspect-[1920/1775]"
        />
        <Join />
        <Footer />
      </div>
    </div>
  )
}
