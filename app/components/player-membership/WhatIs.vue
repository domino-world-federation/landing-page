<script setup lang="ts">
import { PLAYER_MEMBERSHIP_COPY } from "~/content/player-membership"

/**
 * "What is DWF ID?" — Figma `629:28537`.
 *
 * A centred column: the gold heading, one line of claim, then the definition.
 * The frame pads `140 80 60` and hugs its content, so this is one of the two
 * sections on the page that is NOT a screen — it is as tall as what it says.
 */
const COPY = PLAYER_MEMBERSHIP_COPY.whatIs
</script>

<template>
  <section
    aria-labelledby="what-is-dwf-id-heading"
    class="bg-bg flex flex-col items-center gap-9 px-5 pt-28 pb-16 text-center md:px-10 lg:gap-[2.92vw] lg:px-20 lg:pt-[max(var(--nav-clearance),7.29vw)] lg:pb-[3.13vw]"
  >
    <MotionReveal :y="40" blur-from="10px">
      <h2
        id="what-is-dwf-id-heading"
        class="font-display w-fit text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
      >
        {{ COPY.heading }}
      </h2>
    </MotionReveal>

    <!-- A measure, where the design gives the text its full 1760. Centred prose
         at that width runs to ~145 characters a line, which is past every
         readable measure there is; 1264 is the width this page's own closing
         headline takes, so the two agree about how wide centred type gets here.
         `65.83vw` is that number over the design width. -->
    <div class="mx-auto flex max-w-[65.83vw] flex-col gap-6 max-lg:max-w-none lg:gap-9">
      <MotionReveal :y="32" :delay="STAGGER">
        <!-- Inter 36/44 (`629:28540`) — the claim, at full strength above the
             definition that follows it at 60%. -->
        <p
          class="font-sans text-[length:var(--text-body-lg)] leading-[1.22] text-white"
        >
          {{ COPY.lead }}
        </p>
      </MotionReveal>

      <MotionReveal :y="32" :delay="STAGGER * 2">
        <div class="flex flex-col gap-6 lg:gap-9">
          <p
            v-for="paragraph in COPY.body"
            :key="paragraph"
            class="font-sans text-[length:var(--text-body-sm)] leading-[1.5] text-white/60"
          >
            {{ paragraph }}
          </p>
        </div>
      </MotionReveal>
    </div>
  </section>
</template>
