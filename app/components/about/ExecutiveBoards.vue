<script setup lang="ts">
import { getBoardMembers } from "~/lib/api/client"
import { BOARDS_COPY } from "~/content/about/boards"

/**
 * Executive Boards — Figma node `112:3590`.
 *
 * The band Structural Frameworks' wash ends on: `--color-surface-dark` at the
 * top, back to the page background at the foot.
 *
 * That fade is a deliberate departure from the design, and it is worth saying
 * why. Figma ends the grey panel exactly on the section boundary and starts this
 * one on plain `#0e0e0e`, which draws a hard horizontal line across the full
 * width of the page. The panel's corners are rounded at the TOP only and it
 * carries no bottom edge — the design's own way of saying it continues past the
 * frame — so the line is where the artboard was cut, not something meant to be
 * seen. Fading the same colour out over this section is what "continues" looks
 * like once there is a page below it.
 *
 * The members come from the API rather than `content/` (RULES §8) — they take
 * office and leave it, and the strip draws however many it is handed. Only the
 * section's framing is copy.
 */
const { data: members } = await useAsyncData(
  "about-board-members",
  () => getBoardMembers(),
  { default: () => [] },
)
</script>

<template>
  <section
    class="bg-[linear-gradient(180deg,var(--color-surface-dark)_0%,var(--color-bg)_100%)] px-5 pt-28 pb-16 md:px-10 lg:px-20 lg:pt-[max(var(--nav-clearance),4.17vw)] lg:pb-[4.17vw]"
  >
    <AboutBoardCarousel :members="members">
      <template #heading>
        <MotionReveal :y="40">
          <!-- The gold statement heading `Mission` uses — see
               `StructuralFrameworks` for why it carries `w-fit`. Here it also
               keeps the heading off the carousel's arrows, which share its
               row. -->
          <h2
            class="font-display w-fit text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08]"
          >
            {{ BOARDS_COPY.heading }}
          </h2>
        </MotionReveal>
      </template>
    </AboutBoardCarousel>
  </section>
</template>
