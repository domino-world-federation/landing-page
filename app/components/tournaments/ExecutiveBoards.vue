<script setup lang="ts">
import { getBoardMembers } from "~/lib/api/client"
import { BOARDS_COPY } from "~/content/about/boards"

/**
 * Executive Boards on `/tournaments` — Figma node `586:15151`.
 *
 * **It replaces Champions Hall**, which stood here in the earlier draft. The
 * redraw puts the federation's officers on this page instead of a wall of past
 * winners, and that closes R16 along with it: Champions Hall filled four cards
 * with photographs of real, identifiable public figures and typed names under
 * them claiming they had won titles that do not exist. There is no such claim to
 * make about a board — these are the people who hold the offices, and the About
 * page has been printing them from the same endpoint all along.
 *
 * **The band is About's, not a second copy of it.** `586:15157` is `112:3587`
 * card for card: the same four members in the same order, the same 540 × 700
 * portraits under the same fall to black, the same 184px arrow pair on the
 * heading's row. So it reuses `AboutBoardCarousel` outright — the second user
 * the component was waiting for (D32/D43), and no part of the strip's scrolling,
 * dragging or announcing is rebuilt here.
 *
 * What differs is one line: the heading is painted in the gold fall
 * (`586:15153`) where About's is flat white, because this page's section titles
 * are gold and About's are not. That is the whole delta, and it lives in the
 * slot the carousel already exposes for exactly this.
 */
const { data: members } = await useAsyncData(
  "tournaments-board-members",
  () => getBoardMembers(),
  { default: () => [] },
)
</script>

<template>
  <!-- A screen of its own, like the page's other bands. The design's 104px of
       top padding is within a few pixels of the navbar's clearance, so the
       clearance token buys it instead — the heading is 100px of Bebas and would
       otherwise sit under the bar it happens to match in height.

       The foot takes 3.33vw rather than the design's 104px for a measured
       reason: 112 + 108 + 64 + 700 + 104 comes to 1088, which overflows a
       1080-tall screen by eight pixels and puts the section's snap point that
       far off. At 64 the band measures 1048 and centres inside the screen
       instead. -->
  <section
    v-if="members.length > 0"
    aria-labelledby="tournaments-boards-heading"
    class="bg-bg flex snap-screen flex-col justify-center px-5 pt-28 pb-16 md:px-10 lg:px-20 lg:pt-[var(--nav-clearance)] lg:pb-[3.33vw]"
  >
    <AboutBoardCarousel :members="members">
      <template #heading>
        <MotionReveal :y="40">
          <!-- Bebas 100/108 in the gold fall (`586:15153`) — the same token the
               rail's heading above it is painted with, so the two agree. -->
          <h2
            id="tournaments-boards-heading"
            class="font-display text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
          >
            {{ BOARDS_COPY.heading }}
          </h2>
        </MotionReveal>
      </template>
    </AboutBoardCarousel>
  </section>
</template>
