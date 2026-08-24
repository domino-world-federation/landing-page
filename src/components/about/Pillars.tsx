import Image from "next/image"

import { PILLARS, PILLARS_ALT, type Pillar } from "@/content/about/pillars"

/**
 * Seconds for one full pass of the column. Longer than Heritage's because each
 * block is a heading plus three lines rather than a card at a glance, and it is
 * the reading that sets the pace.
 */
const MARQUEE_SECONDS = 30

/**
 * Pillars — Figma node `107:2847`.
 *
 * The section's whole idea is the mask. Figma wraps the three blocks in a group
 * (`106:2846`) whose rectangle is transparent → white → white → transparent, so
 * the column fades out at both ends and only the middle is fully lit.
 *
 * It is a `mask-image` rather than two gradient overlays, and that is the only
 * version that works here: the page behind this is `--color-bg` in some places
 * and Vision's vignette in others, so an overlay would have to know what colour
 * it is covering. A mask removes the type instead of painting over it.
 *
 * The blocks then ride upward through that fixed window on a loop, so each one
 * lights as it reaches the middle and dissolves as it leaves the top. The mask
 * does not move; the column does — and it keeps going, so the three read as a
 * cycle rather than a list that ends.
 *
 * Server Component: one CSS animation and a mask, no state and no listener.
 * `prefers-reduced-motion` is handled globally in `globals.css` — the track
 * lands on -50%, where the second copy stands exactly where the first began, so
 * a reader who reduces motion sees a still column and not a half-scrolled one.
 */
export function Pillars() {
  return (
    <section className="flex flex-col items-center gap-12 px-5 py-16 md:px-10 lg:flex-row lg:justify-between lg:gap-16 lg:px-20 lg:py-[4.17vw]">
      {/* The mask is on the OUTER element and the movement on the inner one.
          Reversed, the window would travel with the blocks and never fade
          anything — the point is that one is fixed and the other is not.

          The height is a fixed frame rather than the content's own, because the
          mask needs somewhere to fade: at `auto` the window is exactly as tall
          as the blocks and the falloff lands on their outer edges instead of
          part-way through them. 56.25vw is 1080/1920, the design's group.

          `group` so the column stops while the pointer is over it — three
          paragraphs sliding out from under someone reading them is the one real
          cost of a marquee. */}
      <div
        className="group h-[520px] w-full overflow-hidden lg:h-[56.25vw] lg:max-h-[1080px] lg:w-[42.71%]"
        style={{
          maskImage:
            "linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, #000 30%, #000 70%, transparent 100%)",
        }}
      >
        <div
          className="flex flex-col group-hover:[animation-play-state:paused]"
          style={{
            animation: `marquee-y ${MARQUEE_SECONDS}s linear infinite`,
            willChange: "transform",
          }}
        >
          {/* Twice, travelling -50%: at the end of the pass the second copy is
              standing where the first started, so the restart is invisible.
              Each copy carries its own trailing gap as padding — a gap placed
              between the two would make the halves unequal and the seam would
              show once per pass. */}
          <PillarColumn />
          <PillarColumn duplicate />
        </div>
      </div>

      {/* 760 × 960 in Figma — a portrait frame, not the photograph's own 3:2,
          so it is `object-cover` and the crop is deliberate. 39.58vw is
          760/1920. */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[20px] lg:aspect-auto lg:h-[50vw] lg:max-h-[960px] lg:w-[39.58%]">
        <Image
          src="/assets/about/pillars-olympic-rings.png"
          alt={PILLARS_ALT.photo}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          quality={85}
          className="object-cover"
        />
      </div>
    </section>
  )
}

/**
 * One pass of the three blocks. Split out because the marquee needs it verbatim
 * twice, and two hand-written copies would be two places to change.
 *
 * The duplicate is `aria-hidden`: it exists so the loop has somewhere to land,
 * and a screen reader should hear the federation's three pillars once.
 */
function PillarColumn({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div
      aria-hidden={duplicate || undefined}
      className="flex shrink-0 flex-col gap-12 pb-12 lg:gap-[8.54vw] lg:pb-[8.54vw]"
    >
      {PILLARS.map((pillar) => (
        <PillarBlock key={pillar.id} pillar={pillar} duplicate={duplicate} />
      ))}
    </div>
  )
}

function PillarBlock({
  pillar,
  duplicate,
}: {
  pillar: Pillar
  duplicate: boolean
}) {
  // The duplicate's headings stay out of the document outline — otherwise the
  // page reports six `<h3>`s where the design has three, and heading navigation
  // walks the same list twice.
  const Heading = duplicate ? "p" : "h3"

  return (
    <div className="flex flex-col gap-3">
      <p className="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-white/40 uppercase">
        {pillar.eyebrow}
      </p>

      {/* Bebas 72/64 — a heading set tighter than its own font size, which is
          how the design stacks the two-word titles. */}
      <Heading className="font-display text-[length:var(--text-display-pillar)] leading-[0.89] text-white uppercase">
        {pillar.title}
      </Heading>

      <p className="font-sans mt-7 text-[length:var(--text-body-lg)] leading-[1.56] text-white/70">
        {pillar.body}
      </p>
    </div>
  )
}
