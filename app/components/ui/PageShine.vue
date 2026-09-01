<script setup lang="ts">
/**
 * Seconds for one lap of the beam.
 *
 * Not the length of the sweep — the beam is only on screen for about a third of
 * this, and dark for the rest. That ratio is the effect: a searchlight passes,
 * the page settles, and some time later it passes again. A beam permanently in
 * frame is a gradient, not a sweep.
 */
const SWEEP = 8

/**
 * The element's width, where it starts, and the gradient's period — all counted
 * in frame widths, and all three DELIBERATELY different.
 *
 * A lap translates the element by exactly one period, because a periodic pattern
 * shifted by a whole period is the pattern it started as: the wrap is not
 * hidden, it is identical. But that only holds while the element covers the
 * frame at BOTH ends of the lap, and getting that coverage right took two
 * corrections, each caught by diffing the lap's first frame against its last.
 *
 * The first attempt was two wide and travelled two, so at the start of a lap it
 * sat entirely to the left of the frame, covering nothing. 48.6% of the page's
 * pixels differed between the two ends.
 *
 * Three wide fixed the flat case and still failed, because the frame is not
 * flat: the wrapper is sheared 30°, which slides the element's edges sideways by
 * `tan30 × height-from-centre` — up to ~1100px on this layer — and by an amount
 * that depends on how far up the frame you look. An element whose edge sits
 * exactly on the frame's edge in the middle has pulled well inside it at the top
 * and bottom, leaving wedges of the frame showing nothing. The diff showed it
 * precisely: every differing pixel lay on one side of a diagonal line, which was
 * the sheared edge cutting across the page.
 *
 * So the margin has to survive the shear at BOTH ends of the lap, and the lap
 * itself eats a margin's worth as it goes. Laid out from the frame: a frame of
 * margin on the left, two frames of travel, the frame, and a frame of margin on
 * the right — five wide, starting one frame out. That leaves at least a full
 * frame of overhang on each side at every point in the lap, and a frame (1920px)
 * is comfortably more than the shear can eat.
 */
const FRAMES_WIDE = 5
const FRAMES_LEFT = 1
const PERIOD_FRAMES = 2

/** The period, and therefore the lap's travel, as a percentage of the element. */
const PERIOD_PCT = (PERIOD_FRAMES / FRAMES_WIDE) * 100

/**
 * The beam.
 *
 * **The core sits ON the period boundary** — at 0 and again at 1 — and that is
 * the whole reason for the shape of the stops. It comes straight from the
 * reference: the sweep is meant to OPEN with light already entering at the
 * frame's edge rather than with an empty screen. At the start of a lap the
 * frame's left edge falls on the pattern's period boundary, so the core is
 * already there, glowing; at the end of the lap the previous boundary is in the
 * same place, carrying the same core. Start and end are the same frame.
 *
 * The falloff is symmetric about that core and reaches nothing by about a
 * quarter of the period on each side, which leaves a little under half the
 * period dark — one beam crossing at a time, with a breath between passes.
 *
 * The stops are Figma's own two golds: `#E1B763` at the core, `#E5CEA1` either
 * side of it, closing on full transparency so the light has no edge of its own.
 *
 * **A plain gradient tiled by `background-size`, not a
 * `repeating-linear-gradient`.** The repeating form takes its period from the
 * gradient LINE, which for a horizontal gradient is the element's own width — so
 * the period silently depends on how wide the element happens to be, and the
 * stops have to be pre-scaled to compensate. That is what the seam test caught:
 * the two ends of a lap differed on 6% of the page, in periodic bands, because
 * the phase and the travel disagreed. Sizing the tile explicitly makes the
 * period a stated fact rather than a derived one: the stops below describe
 * exactly one tile, `background-size` says how wide a tile is, and the lap
 * travels precisely that.
 */
const BEAM = [
  "linear-gradient(90deg,",
  " rgba(225,183,99,0.26) 0%,",
  " rgba(229,206,161,0.17) 7%,",
  " rgba(229,206,161,0.07) 16%,",
  " rgba(229,206,161,0) 27%,",
  " rgba(229,206,161,0) 73%,",
  " rgba(229,206,161,0.07) 84%,",
  " rgba(229,206,161,0.17) 93%,",
  " rgba(225,183,99,0.26) 100%)",
].join("")

/** Where a lap starts: one period to the left of rest. */
const BEAM_FROM = `-${PERIOD_PCT.toFixed(4)}%`

/**
 * How the layer dissolves into the page at its top edge.
 *
 * The artwork this replaced faded out on its own — its beams were blurred a
 * couple of hundred pixels and its gradients ran to zero — so the top of the
 * block was never anywhere in particular. A CSS gradient band is uniform down
 * its whole height, so it arrived at the layer's top edge at full strength and
 * `overflow-hidden` cut it off on a dead straight horizontal line across the
 * FAQ. Visible immediately, and exactly the kind of seam the artwork's softness
 * had been hiding for free.
 *
 * A mask restores it: the light is at nothing where the layer begins and at full
 * strength by 38% of the way down, which puts the whole fade above the closing
 * CTA and leaves the FAQ lit without ever showing where the lighting starts.
 *
 * It rides the OUTER container rather than the beam, so it is anchored to the
 * page rather than to the light. On the beam it would travel with the sweep and
 * fade the shaft's own head instead of the layer's top.
 */
const TOP_FADE = "linear-gradient(to bottom, transparent 0%, #000 38%)"

/**
 * The gold shine over a page's last third — S12 (`56:4970`) on the landing page,
 * and the same treatment on `/development` and `/members`.
 *
 * A raked shaft of gold light crossing an otherwise black ground. It is pure
 * decoration and carries no content, which is why it is a `ui/` layer rather
 * than a section of its own — nothing in the page's outline should announce it.
 *
 * **The static artwork is gone; the sweep is the whole effect.** Each of the
 * three pages exported its own SVG — three blurred beams at 45° over a
 * `rgba(14,14,14,0) → #0E0E0E` wash — and while it sat under the sweep it lit
 * the entire block permanently, so the travelling beam was crossing something
 * already bright and read as a smear over brown rather than as light in a dark
 * room. On a black ground it reads as what it is. The three files are still on
 * disk — `decor-shine.svg` under each page's folder in `public/assets` — if the
 * painted version is ever wanted back.
 *
 * Nothing is needed in place of the wash the artwork carried: the ground under
 * this layer IS `--color-bg`, the same `#0E0E0E` the wash faded to, so there is
 * no seam left to hide. That also frees the beam to run to the foot of the
 * document, which the opaque bottom of the file used to occlude.
 *
 * **Anchored to the FOOT of the block it backs, not to its head.** On the
 * landing page Figma puts the artwork at `y:6826` with a height of 1775, so it
 * ends at 8601 — within ~50px of where the footer's own content ends, and
 * roughly 520px into the FAQ at the other end. Only one of those two numbers
 * survives contact with real content: the FAQ's height depends on which answer
 * is open and how the questions wrap, so a top offset measured from it would
 * slide. The foot does not — it is the end of the document either way. So the
 * layer is pinned `bottom-0`, and `aspectClass` still carries each page's own
 * height because the three lit different amounts of their page (1775, 1907,
 * 2071) and that judgement is the design's.
 *
 * It rides a slow parallax on `anchor="foot"`, which is mandatory here: this is
 * the last thing on the page, and the default `cross` range needs the section's
 * head to leave the top of the viewport to finish — which never happens when the
 * document runs out first (D16, RULES §12).
 *
 * **On top of the parallax, a beam sweeps across it.** The parallax is
 * scroll-linked and so stops dead the moment the reader does — which is most of
 * the time down here, because this is where they stop to read the CTA and the
 * footer. The sweep is what is left when the scrolling stops: a shaft of light
 * crossing the frame like a searchlight, then a pause, then again.
 *
 * **A CSS gradient, not a moving picture.** Sliding the artwork was the first
 * attempt: two copies side by side, translated by one of them, on the theory
 * that soft diagonal beams have no edge to line up. They do — the three beams
 * sat at particular places in the frame, so copy two meeting copy one put a
 * bright vertical seam down the page. There is no arrangement of a finite
 * picture that loops cleanly.
 *
 * A gradient has no such problem, because it is periodic by construction: see
 * `BEAM` for how a lap that travels exactly one period makes the wrap not merely
 * hidden but identical.
 *
 * `skewX` rides a wrapper rather than the animated element itself: `motion`
 * writes the whole `transform`, so a skew sharing that element would be
 * overwritten on the first frame of the sweep.
 *
 * The loop is gated on the layer being on screen, so it is not left burning
 * against an off-screen element for the whole of the page above it — but the
 * gate is measured on the wrapper rather than on the beam; see `inView` for the
 * bug that cost. Only `transform` moves, and `prefers-reduced-motion` stops the
 * loop entirely rather than slowing it (RULES §12) — through the transition,
 * never by branching the tree.
 */
defineProps<{
  /**
   * How much of the page's foot the layer covers, as a literal aspect utility —
   * e.g. `"aspect-[1920/1775]"`. A class rather than a number because Tailwind
   * extracts utilities by scanning source text: a ratio interpolated into
   * `style` or into a template string would never be seen, and the layer would
   * collapse to zero height in a production build while working perfectly in
   * dev.
   */
  aspectClass: string
}>()

const root = useTemplateRef<HTMLDivElement>("root")
const prefersReducedMotion = useReducedMotion()

/**
 * Whether the layer is on screen — measured on the WRAPPER, not on the beam.
 *
 * The beam had `whileInView` on itself to begin with and never once played. It
 * is three frames wide and, with its overhang, half again as tall as the frame,
 * so its own area is around eight times the viewport's; `amount: 0.1` asks for a
 * tenth of THAT to be visible, which a 1920 × 1080 window can barely reach at the
 * very bottom of the page and never reaches on the way there. The threshold was
 * being applied to a box that is mostly off screen by construction.
 *
 * The wrapper is the frame itself — one screen wide and 1775 tall — so a tenth
 * of it is a tenth of something the reader can actually see. Same split
 * `StatsWheel` uses: measure the section, drive the artwork.
 */
const inView = useInView(root, { amount: 0.1 })

const running = computed(() => inView.value && !prefersReducedMotion.value)

// `linear`, not an ease: the sweep has no start and no end to shape — it is a
// continuous crossing, and any easing would put a visible hesitation exactly at
// the wrap. `repeatType` stays the default `loop` for the same reason the travel
// is one whole period: the wrap lands on an identical frame.
//
// `repeat: 0` is what actually stops it under reduced motion; the duration is
// zeroed too so there is not even a single pass to see. Both sides of hydration
// render the same `initial`, and a zero-length tween lands the layer at rest
// before paint.
const sweep = computed(() =>
  prefersReducedMotion.value
    ? { duration: 0, repeat: 0 }
    : {
        duration: SWEEP,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear" as const,
      },
)

// Where the beam sits when it is off screen: back at its start, so a shine that
// has never been scrolled to is the still design exactly.
const rest = { duration: 0 }

// Inline rather than Tailwind arbitrary values: the width is derived from
// `BEAM_WIDTHS` and the background is built from it, and a computed class string
// is exactly what Tailwind's source scanning cannot see.
// `-webkit-` alongside the standard property for the reason the stroke
// utilities in `main.css` carry it: Safari only dropped the prefix in 15.4.
const rootStyle = {
  maskImage: TOP_FADE,
  WebkitMaskImage: TOP_FADE,
}

const beamStyle = {
  left: `-${FRAMES_LEFT * 100}%`,
  width: `${FRAMES_WIDE * 100}%`,
  backgroundImage: BEAM,
  // The tile IS the period, and the lap travels exactly one of them.
  backgroundSize: `${PERIOD_PCT.toFixed(4)}% 100%`,
  backgroundRepeat: "repeat",
  willChange: "transform",
}
</script>

<template>
  <!-- `-z-10` puts the beams behind the copy; the caller's `isolate` keeps that
       negative index from escaping into the page's root stacking context and
       sliding behind the page background itself.

       `pointer-events-none` because the layer covers the closing CTA and the
       whole footer — without it the shine would eat every click in the page's
       last third. -->
  <div
    ref="root"
    :style="rootStyle"
    class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 overflow-hidden"
  >
    <MotionParallaxLayer
      :speed="-6"
      anchor="foot"
      decorative
      :class="cn('relative w-full', aspectClass)"
    >
      <!-- The rake, held apart from the sweep so the two transforms cannot
           contend. `inset-y` overhangs top and bottom because a skewed box
           leaves wedges of nothing at its corners otherwise, and those corners
           are exactly where the beam should still be lighting the frame — the
           steeper the rake, the more overhang it needs, which is why this is
           60% rather than the 30 a shallow lean wanted.

           30° from vertical, where the first attempt used 12. The artwork this
           replaced drew its three beams at `rotate(45)`, and a shaft leaning
           barely off vertical does not read as the same kind of light at all.
           30 rather than a literal 45 because `skewX` shears rather than
           rotates: at 45° the band's foot lands a full 1775px from its head,
           which is wider than the frame, and the "beam" stops reading as one
           object.

           NEGATIVE, and the sign is what decides the direction the sweep READS
           as — which is not the direction it travels. The element only ever
           moves horizontally; the lean is what turns that into a diagonal.

           `skewX(-30deg)` maps `x' = x - tan30·y`, so lower rows sit further
           left and the shaft leans `/`. Take any vertical line and watch where
           the band crosses it: as the band slides right, that crossing slides
           DOWN, so the light reads as travelling from the top-left to the
           bottom-right. The head also reaches the left edge first, so the sweep
           opens at the top-left corner.

           Positive was tried and gives the exact opposite on both counts: a `\`
           shaft whose crossing rises as it moves, reading bottom-left to
           top-right. -->
      <div class="absolute inset-y-[-60%] left-0 w-full -skew-x-[30deg]">
        <!-- The travelling light, left to right, over exactly one period of the
             pattern — see `PERIOD_PCT` for why that distance is two thirds of
             the element rather than all of it. -->
        <Motion
          as="div"
          class="absolute inset-y-0"
          :style="beamStyle"
          :initial="{ x: BEAM_FROM }"
          :animate="
            running
              ? { x: '0%', transition: sweep }
              : { x: BEAM_FROM, transition: rest }
          "
        />
      </div>
    </MotionParallaxLayer>
  </div>
</template>
