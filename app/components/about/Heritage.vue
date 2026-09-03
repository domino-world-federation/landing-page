<script setup lang="ts">
import { getHeritageMilestones } from "~/lib/api/client"
import { HERITAGE_COPY } from "~/content/about/heritage"

/**
 * Heritage — Figma node `88:1163`.
 *
 * The band the page darkens through: `#0e0e0e` at the top,
 * `--color-surface-dark` at the foot, which is exactly where Vision's own wash
 * starts. The two meet with no seam because they are the same colour, not
 * because they are aligned.
 *
 * The milestones come from the API rather than from `content/` (RULES §8): each
 * one is an entity with a year, a summary and a photograph of its own, and the
 * federation keeps adding them. Only the section's framing is copy.
 *
 * **The section is a track now, and the strip is turned by the reader.** It used
 * to be one screen with the timeline advancing itself on a timer; the repo owner
 * asked for the movement to be scroll-based, which is also what the rest of this
 * page does — the pillars column and the stats wheel are both a stage pinned
 * inside a taller track, and this is the same figure/ground split laid on its
 * side. Vertical scroll goes in, horizontal travel comes out, and reaching the
 * section below means having been past every date.
 */
const { data: milestones } = await useAsyncData(
  "about-heritage",
  () => getHeritageMilestones(),
  { default: () => [] },
)

/**
 * How many screens of vertical scroll the strip is given to travel across.
 *
 * One per MOVE, not one per milestone: four dates are three steps between them,
 * and a screen per date would spend a whole viewport arriving at the first one
 * before anything had moved. The floor of 1 keeps a single-milestone list from
 * asking for a zero-height track.
 */
const steps = computed(() => Math.max(1, milestones.value.length - 1))

const track = useTemplateRef<HTMLElement>("track")

/**
 * The scroll through the track, 0 at its head and 1 at its foot.
 *
 * Read here rather than inside the timeline because the track IS this section's
 * root: `useScroll` needs the element, and handing a template ref down as a prop
 * would give the child a `null` on first render and a subscription that has to
 * be rebuilt when it fills in. The MotionValue itself is stable, so it is what
 * crosses the boundary.
 *
 * The `start start` → `end end` range spans exactly the travel available while
 * the stage is pinned: it opens when the track's head reaches the top of the
 * screen and closes when its foot reaches the bottom.
 */
const { scrollYProgress } = useScroll({
  target: track,
  offset: ["start start", "end end"],
})
</script>

<template>
  <!-- `snap-pass` because the track is several screens tall, and a snap area
       taller than the screen is a band the reader may rest ANYWHERE inside
       rather than a position — `main.css` records the rule at length. The
       notches below are the stops instead, one per move.

       The track only exists from `lg`. Below it there is no snapping to pace and
       no room to pin anything, so the strip goes back to being a plain
       horizontal scroller the reader pans by hand. -->
  <section
    ref="track"
    :style="{ '--heritage-steps': steps }"
    class="snap-pass relative lg:h-[calc(var(--heritage-steps)*100dvh)] lg:motion-reduce:h-dvh"
  >
    <!-- One snap point per move, so a gesture travels exactly one step.
         Markers rather than content: absolutely positioned, so they add nothing
         to the track's layout, and the first sits at its head, which is what
         gives this section the stop its siblings carry on the section itself.

         Hidden below `lg` and under reduced motion, where the track collapses to
         one screen and the markers would otherwise stack several viewports of
         snap points inside it and spill into the section after. -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 top-0 hidden h-full lg:block lg:motion-reduce:hidden"
    >
      <div
        v-for="notch in steps"
        :key="notch"
        class="h-dvh snap-start snap-always"
      />
    </div>

    <!-- The stage. `140 0 0` is the frame's own padding (`566:13471`) — 7.29vw
         of the design width, and nothing at the foot, because the timeline's
         rules are drawn to dissolve into the band rather than to stop short of
         an edge.

         The floor under it is `--nav-clearance` and it is not the design's
         number. This is where the scroll comes to rest, so its head lands under
         a navbar up to 112px tall, and 7.29vw only clears that above ~1540px —
         at 1400 it resolves to 102 against a bar of 102 and puts the eyebrow
         exactly behind it. Taking the larger of the token and the design's slope
         keeps Figma's padding wherever Figma's padding is already enough.

         **`h-dvh` as well as the minimum, so the screen is what the section fits
         INTO and not merely what it starts from.** The card is sized off the
         viewport's WIDTH, so a wide but short window — 1920 x 800 is an ordinary
         external monitor with browser chrome on it — gave a 500px card inside an
         800px screen and the section ran ~200px over. The height is fixed to the
         screen and the TIMELINE absorbs whatever the title leaves (`flex-1`), so
         nothing here needs to know what the card measures. -->
    <div
      class="flex snap-screen h-dvh flex-col overflow-hidden bg-[linear-gradient(180deg,var(--color-bg)_0%,var(--color-surface-dark)_100%)] pt-28 pb-0 lg:sticky lg:top-0 lg:pt-[max(var(--nav-clearance),7.29vw)]"
    >
      <div
        class="flex shrink-0 flex-col items-center gap-9 px-5 text-center md:px-10 lg:px-20"
      >
        <MotionReveal :y="32">
          <p
            class="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-white uppercase"
          >
            {{ HERITAGE_COPY.eyebrow }}
          </p>
        </MotionReveal>

        <MotionReveal :y="40" :delay="STAGGER" blur-from="10px">
          <!-- Bebas **100/108** (`566:13474`), which is `--text-display-statement`
               exactly — the same step eight other headings across the site take. -->
          <h2
            class="font-display text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
          >
            {{ HERITAGE_COPY.heading }}
          </h2>
        </MotionReveal>
      </div>

      <!-- **20px**, the frame's own gap. The scroller is full-bleed on purpose —
           it runs wider than the window and the section's gutters would only cut
           it short. -->
      <div class="mt-5 min-h-0 flex-1 lg:mt-[1.04vw]">
        <AboutHeritageTimeline
          :milestones="milestones"
          :progress="scrollYProgress"
        />
      </div>
    </div>
  </section>
</template>
