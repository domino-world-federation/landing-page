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
 */
const { data: milestones } = await useAsyncData(
  "about-heritage",
  () => getHeritageMilestones(),
  { default: () => [] },
)
</script>

<template>
  <!-- A screen of its own: `566:13471` is 1920 × 1080, and so are the four
       sections after it. On a page that snaps section by section a band shorter
       than the viewport always arrives with the next one's head showing under
       it, so the design's full-frame height is not a stylistic detail here — it
       is what the snapping is built on.

       `snap-screen` rather than the design's `56.25vw`: the two agree only at
       16:9, and a 1512 × 900 laptop would be left 50px short by the ratio. The
       viewport unit is the thing actually being filled.

       **`h-dvh` as well as the minimum, so the screen is what it fits INTO and
       not merely what it starts from.** The card is sized off the viewport's
       WIDTH (`26.04vw`, capped at the design's 500), so a wide but short window
       — 1920 × 800 is an ordinary external monitor with a browser chrome on it —
       gave a 500px card inside a 800px screen and the section ran ~200px over.
       An over-tall section is the one thing this page's snapping cannot survive:
       it stops being a position and becomes a band the reader may rest anywhere
       inside, which is how a flick skips it whole.

       So the height is fixed to the screen and the TIMELINE absorbs whatever the
       title leaves (`flex-1`), the same arrangement the picture-and-overview
       stop above uses. Nothing here needs to know what the card measures. -->
  <!-- `140 0 0` is the frame's own padding (`566:13471`) — 7.29vw of the design
       width, and nothing at the foot, because the timeline's rules are drawn to
       dissolve into the band rather than to stop short of an edge.

       The floor under it is `--nav-clearance` and it is not the design's
       number. This is a snap stop, so its head comes to rest under a navbar up
       to 112px tall, and 7.29vw only clears that above ~1540px — at 1400 it
       resolves to 102 against a bar of 102 and puts the eyebrow exactly behind
       it. The token is the site's own answer, already read by a dozen sections
       on Development, Governance, Integrity and News; taking the larger of it
       and the design's slope keeps Figma's padding wherever Figma's padding is
       already enough. -->
  <section
    class="flex snap-screen h-dvh flex-col overflow-hidden bg-[linear-gradient(180deg,var(--color-bg)_0%,var(--color-surface-dark)_100%)] pt-28 pb-0 lg:pt-[max(var(--nav-clearance),7.29vw)]"
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
             exactly — the same step eight other headings across the site take.
             It was `display-sm` (76) at `leading-[0.95]`, from the older file. -->
        <h2
          class="font-display text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
        >
          {{ HERITAGE_COPY.heading }}
        </h2>
      </MotionReveal>
    </div>

    <!-- **20px**, the frame's own gap — it was 100, which is the older file's.
         The change pays for itself twice over: the title grew 24px taller and
         the top padding 60px deeper in the same pass, and the section still has
         to fit one screen.

         The scroller is full-bleed on purpose — it runs wider than the window
         and the section's gutters would only cut it short. -->
    <div class="mt-5 min-h-0 flex-1 lg:mt-[1.04vw]">
      <AboutHeritageTimeline :milestones="milestones" />
    </div>
  </section>
</template>
