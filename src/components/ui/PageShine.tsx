import Image from "next/image"

import { ParallaxLayer } from "@/components/motion/ParallaxLayer"
import { cn } from "@/lib/utils/cn"

/**
 * The gold shine over a page's last third — S12 (`56:4970`) on the landing
 * page, `207:15295` on `/development`.
 *
 * Three blurred gold beams raked at 45°, with a `rgba(14,14,14,0) → #0E0E0E`
 * wash across the bottom of the artwork. It is pure decoration and carries no
 * content, which is why it is a `ui/` layer rather than a section of its own —
 * nothing in the page's outline should announce it.
 *
 * **Anchored to the FOOT of the block it backs, not to its head.** On the
 * landing page Figma puts it at `y:6826` with a height of 1775, so it ends at
 * 8601 — within ~50px of where the footer's own content ends, and roughly 520px
 * into the FAQ at the other end. Only one of those two numbers survives contact
 * with real content: the FAQ's height depends on which answer is open and how
 * the questions wrap, so a top offset measured from it would slide. The foot
 * does not — it is the end of the document either way. So the layer is pinned
 * `bottom-0` and takes its height from the artwork's own ratio, which puts the
 * beams back where the design has them at the design width and scales them from
 * there.
 *
 * That baked-in wash is also why the artwork is not cropped or `object-cover`:
 * the fade to `--color-bg` is painted at a fixed place in the file, and
 * cropping it off would put a hard edge back — the same trap S4 and S7 hit with
 * their composites. It is also why `src` and `ratio` travel together: the two
 * pages export different heights (1775 and 2071) of the same beams, and reading
 * one file at the other's ratio would stretch the fade off the page foot.
 *
 * It rides a slow parallax on `anchor="foot"`, which is mandatory here: this is
 * the last thing on the page, and the default `cross` range needs the section's
 * head to leave the top of the viewport to finish — which never happens when
 * the document runs out first (D16, RULES §12).
 */
export function PageShine({
  src,
  aspectClass,
}: {
  src: string
  /**
   * The artwork's own aspect as a literal utility, e.g. `"aspect-[1920/1775]"`.
   * A class rather than a number because Tailwind extracts utilities by
   * scanning source text: a ratio interpolated into `style` or into a template
   * string would never be seen, and the layer would collapse to zero height in
   * a production build while working perfectly in dev.
   */
  aspectClass: string
}) {
  return (
    // `-z-10` puts the beams behind the copy; the caller's `isolate` keeps
    // that negative index from escaping into the page's root stacking context
    // and sliding behind the page background itself.
    //
    // `pointer-events-none` because the layer covers the closing CTA and the
    // whole footer — without it the shine would eat every click in the page's
    // last third.
    <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 overflow-hidden">
      <ParallaxLayer
        speed={-6}
        anchor="foot"
        decorative
        className={cn("relative w-full", aspectClass)}
      >
        {/* `sizes="100vw"`: the artwork always spans the viewport, so the
            browser can pick a candidate from the width alone. SVGs are served
            unoptimized regardless (RULES §7) — `sizes` is here to keep
            next/image from warning. */}
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </ParallaxLayer>
    </div>
  )
}
