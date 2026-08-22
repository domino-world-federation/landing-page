import Image from "next/image"

import { FEATURE_HQ_ALT, FEATURE_HQ_COPY } from "@/content/home/feature-hq"
import { ParallaxLayer } from "@/components/motion/ParallaxLayer"
import { Reveal } from "@/components/motion/Reveal"
import { DURATION, STAGGER } from "@/lib/utils/motion"

/**
 * Seconds. The building settles more slowly than the copy that sits on it — it
 * is the larger object and the further one away, so the same duration would
 * have it moving at a visibly higher speed than the words in front of it.
 */
const SETTLE = DURATION * 1.5

/**
 * S4 — Figma node `31:1085`. The headquarters feature.
 *
 * `feature-hq-composite.png` is the design's own composite: the photograph
 * with the section's three washes already baked in — the vignette along the
 * top (`31:1089`), the downward darkening that carries the text (`31:1103`),
 * and the fade to page background at the foot (`37:1848`). Measured, its top
 * and bottom rows are exactly `#0e0e0e`, so it meets `--color-bg` with no seam
 * and needs no overlay of its own. Reproducing those washes in CSS on top of
 * it would darken the picture twice.
 *
 * That bake is also why the image is NOT `object-cover` at an arbitrary crop:
 * the fades are painted at fixed positions, so cropping them off the top or
 * bottom would put a hard edge back. The section carries the image's own
 * 16:9 ratio from `lg` up, and the crop only tightens on narrow screens where
 * some loss is unavoidable.
 *
 * This is the first section with real scroll above it, so unlike the hero it
 * gets true scroll-linked parallax — S2 had none, there was nothing to scroll.
 * One moving layer, well inside the 3–4 ceiling of RULES §12.
 *
 * Every entrance here rearms: scroll the section past and come back, and the
 * building settles and the copy rises again. The section is a full viewport of
 * picture with four words of headline, so it is a place the reader scrolls back
 * to — an entrance that fires once would leave the second visit flat.
 *
 * Server Component; only the animated wrappers reach for the client.
 */
export function FeatureHq() {
  return (
    // The image's own 1080/1920 ratio from `lg`, with a floor for the same
    // reason the hero has one (S2): the text column does not shrink with the
    // window, so pure ratio would squeeze it against the section's edges on
    // narrow desktops. Below `lg` the height follows the copy and the picture
    // becomes a backdrop behind it.
    <section className="relative isolate flex min-h-[560px] flex-col justify-center overflow-hidden lg:h-[max(720px,56.25vw)] lg:min-h-0">
      {/* Slow, and slower than anything in the hero: this is the backdrop, so
          it trails the page rather than racing it. `-z-10` keeps the whole
          layer behind the copy; `isolate` on the section stops that negative
          index from escaping into the page's root stacking context and sliding
          behind the page background itself.

          The scale entrance rides INSIDE the parallax wrapper on purpose — the
          outer element owns `y` from the scroll position, the inner one owns a
          one-off `scale`, so the two never write to the same transform. */}
      <ParallaxLayer speed={8} decorative className="absolute inset-0 -z-10">
        {/* Pushed in past its resting frame, then settling back — the building
            comes to rest rather than simply being there. It never goes below
            `1`, so no edge of the baked-in fade is ever pulled inside the
            frame mid-animation. */}
        <Reveal scale={[1.14, 1]} duration={SETTLE} className="size-full">
          {/* `sizes="100vw"`: the image always spans the viewport, so the
              browser picks a candidate from the width alone. */}
          <Image
            src="/assets/home/feature-hq-composite.png"
            alt={FEATURE_HQ_ALT.building}
            fill
            sizes="100vw"
            quality={90}
            className="object-cover"
          />
        </Reveal>
      </ParallaxLayer>

      {/* Node `31:1105`: 870px wide at `x:525` — a column left of centre, clear
          of the signage on the building's right face. The design's 44px gap is
          kept; below `lg` the column starts at the section gutter, where there
          is no room to indent.

          The three blocks rise and come into focus in sequence: the headline
          leads, the body follows it up, the button lands last. Curve, duration
          and step all come from `lib/utils/motion` — the same three constants
          the hero animates on — so the page has one hand rather than a
          different one per section. */}
      <div className="relative mx-auto flex w-full max-w-[870px] flex-col gap-8 px-5 py-16 md:px-10 lg:mx-0 lg:ml-[27.3%] lg:gap-[2.3vw] lg:px-0 lg:py-0">
        <Reveal y={48} blurFrom="12px">
          <h2 className="font-display bg-linear-to-r from-[var(--color-gold-light)] to-[var(--color-gold-dark)] bg-clip-text text-[length:var(--text-display-feature)] leading-none text-transparent uppercase">
            {FEATURE_HQ_COPY.headline.map((line) => (
              // A block per line so the design's break survives, rather than a
              // <br> that a translation would have to carry along (RULES §9).
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </Reveal>

        <Reveal y={40} delay={STAGGER} blurFrom="8px">
          <p className="font-sans max-w-[680px] text-base leading-7 text-white lg:text-xl lg:leading-8">
            {FEATURE_HQ_COPY.body}
          </p>
        </Reveal>

        {/* 223 × 64 in Figma (`31:1489`), the same white-20% treatment as the
            hero's secondary button. Width is left to the content so a longer
            translation cannot clip the label; the design's width falls out of
            its own padding. */}
        <Reveal y={32} delay={STAGGER * 2} blurFrom="6px" className="w-fit">
          <a
            href="#"
            className="rounded-btn font-display focus-visible:ring-gold flex h-16 w-fit items-center justify-center bg-white/20 px-5 text-[length:var(--text-display-btn)] leading-10 text-white uppercase transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:outline-none"
          >
            {FEATURE_HQ_COPY.cta}
          </a>
        </Reveal>
      </div>
    </section>
  )
}
