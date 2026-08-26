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
  <section
    class="bg-[linear-gradient(180deg,var(--color-bg)_0%,var(--color-surface-dark)_100%)] pt-16 lg:pt-[4.17vw]"
  >
    <div
      class="flex flex-col items-center gap-9 px-5 text-center md:px-10 lg:px-20"
    >
      <MotionReveal :y="32">
        <p
          class="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-white uppercase"
        >
          {{ HERITAGE_COPY.eyebrow }}
        </p>
      </MotionReveal>

      <MotionReveal :y="40" :delay="STAGGER" blur-from="10px">
        <h2
          class="font-display bg-[image:var(--gradient-gold-text)] bg-clip-text text-[length:var(--text-display-sm)] leading-[0.95] text-transparent uppercase"
        >
          {{ HERITAGE_COPY.heading }}
        </h2>
      </MotionReveal>
    </div>

    <!-- 100px between the title and the timeline in Figma; 5.21vw is 100/1920.
         The scroller is full-bleed on purpose — it runs wider than the window
         and the section's gutters would only cut it short. -->
    <div class="mt-16 lg:mt-[5.21vw]">
      <AboutHeritageTimeline :milestones="milestones" />
    </div>
  </section>
</template>
