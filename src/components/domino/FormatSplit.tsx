import { FormatPanel } from "@/components/domino/FormatPanel"
import { ParallaxLayer } from "@/components/motion/ParallaxLayer"
import { SofteningImage } from "@/components/motion/SofteningImage"
import { FORMATS, FORMATS_ALT } from "@/content/domino/formats"
import { cn } from "@/lib/utils/cn"
import { DURATION } from "@/lib/utils/motion"

/** Seconds. Slower than the copy beside it — it is the larger object. */
const SETTLE = DURATION * 1.4

/**
 * Singles versus doubles — Figma node `207:15563`.
 *
 * Two panels butted together into one rounded rectangle: silver on the left
 * (white grading to `--color-surface-silver`), gold on the right, radii only on
 * the outer corners so the pair reads as a single object cut down the middle.
 * That cut is the section's whole argument — one game, two formats — and the
 * tile lying across it is what stops the two halves reading as separate cards.
 *
 * **The halves must travel together.** Both figures sit in a `ParallaxLayer` at
 * the same speed, so they translate by the same amount on every frame and the
 * seam never opens. Giving them different speeds, or moving only one, would tear
 * the figure in half the moment the page scrolled.
 *
 * Below `lg` the panels stack and the figure is dropped entirely. The seam it
 * exists to cross is gone at that point, and half a tile floating on a gold
 * block with no counterpart is worse than no tile.
 *
 * Server Component; the layers and entrances are the only client parts.
 */
export function FormatSplit() {
  const [singles, doubles] = FORMATS

  return (
    <section
      aria-labelledby="format-singles-heading"
      className="px-5 py-10 md:px-10 lg:px-20 lg:py-[3.13vw]"
    >
      {/* The tile is the section's one picture and carries an `alt` — but
          `SofteningImage` renders TWO copies of its image and there are two
          halves besides, so an `alt` on the images would be announced four
          times. Both layers are `decorative`, which hides all of them, and this
          line says the thing once. The same fix `Vision` uses. */}
      <span className="sr-only">{FORMATS_ALT.tile}</span>

      {/* 800 tall in Figma minus its 60px of vertical padding; 35.42vw is
          680/1920. The floor keeps the panels from crushing their three
          statistics rows together on a narrow desktop — the same reason S4 and
          the About HQ band carry one. Below `lg` the height follows the copy. */}
      <div className="flex flex-col lg:h-[max(560px,35.42vw)] lg:flex-row">
        <FormatPanel
          format={singles}
          align="start"
          headingId="format-singles-heading"
          className="rounded-t-[var(--radius-card)] bg-[linear-gradient(180deg,var(--color-surface-light)_0%,var(--color-surface-silver)_100%)] lg:flex-1 lg:rounded-tr-none lg:rounded-bl-[var(--radius-card)]"
          figure={<Figure />}
        />
        <FormatPanel
          format={doubles}
          align="end"
          className="rounded-b-[var(--radius-card)] bg-[var(--color-gold)] lg:flex-1 lg:rounded-tr-[var(--radius-card)] lg:rounded-bl-none"
          figure={<Figure mirrored />}
        />
      </div>
    </section>
  )
}

/**
 * One panel's share of the tile.
 *
 * **The numbers are fractions of a panel, and that is what keeps the seam
 * shut.** The section is 1920 padded 80 each side, so the panels are 880
 * apiece. Figma places the tile at x625 inside the silver panel and at x−255
 * inside the gold one — the same point in section coordinates: 80 + 625 = 705,
 * and 960 − 255 = 705. It is ONE figure lying across the seam, each panel
 * clipping its own share, not two pictures.
 *
 * So the two halves are displaced by exactly one panel width — 625/880 =
 * 71.02% against −255/880 = −28.98%, a difference of 100% — and stated as
 * percentages they stay one panel apart as the panels shrink. In pixels they
 * would drift the moment the window left 1920 and the tile would tear in two.
 * 510/880 is the width; 80 and 1006 against the panel's 680 of inner height
 * give the vertical pair.
 *
 * `mirrored` is the gold half.
 *
 * `max-lg:hidden` rather than a conditional render — the markup is identical on
 * both sides of the breakpoint, so nothing here can disagree between server and
 * client (RULES §12).
 */
function Figure({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <ParallaxLayer
      speed={-10}
      decorative
      className={cn(
        "absolute top-[11.76%] h-[147.94%] w-[57.95%] max-lg:hidden",
        mirrored ? "left-[-28.98%]" : "left-[71.02%]",
      )}
    >
      <SofteningImage
        src="/assets/global/globe-tile.png"
        alt=""
        from="10px"
        to="0px"
        duration={SETTLE}
        fill
        sizes="(min-width: 1024px) 27vw, 0px"
        imageClassName="object-contain object-top"
      />
    </ParallaxLayer>
  )
}
