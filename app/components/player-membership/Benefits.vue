<script setup lang="ts">
import {
  MEMBERSHIP_BENEFITS,
  PLAYER_MEMBERSHIP_COPY,
} from "~/content/player-membership"

/**
 * Membership Benefits — Figma `629:28542`, 1920 × 1080.
 *
 * Six cards in two rows of three. Figma builds them as two `row` frames; written
 * as one grid, because the wrap IS the intent and a grid says it without
 * depending on the cards keeping a particular width — the same call S10's
 * resource grid makes.
 *
 * The card is `EL-5e8b7686`: a 360px column padded 24 with `space-between`, so
 * the gold tile sits at the top and the copy at the foot however long the copy
 * runs. `auto-rows-fr` keeps the two rows level when one card's body wraps
 * further than another's.
 */
const COPY = PLAYER_MEMBERSHIP_COPY.benefits
</script>

<template>
  <section
    aria-labelledby="membership-benefits-heading"
    class="bg-bg flex flex-col justify-center gap-9 px-5 pt-16 pb-16 lg:snap-screen md:px-10 lg:px-20 lg:pt-[max(var(--nav-clearance),7.29vw)] lg:pb-[4.17vw]"
  >
    <MotionReveal :y="40" blur-from="10px">
      <h2
        id="membership-benefits-heading"
        class="font-display mx-auto w-fit text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
      >
        {{ COPY.heading }}
      </h2>
    </MotionReveal>

    <ul class="grid auto-rows-fr grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3">
      <!-- Staggered rather than arriving together: six panels appearing at once
           is a flash rather than an entrance. 0.06s is under the page's standard
           step, which six of them would otherwise stretch into a queue. -->
      <MotionReveal
        v-for="(benefit, i) in MEMBERSHIP_BENEFITS"
        :key="benefit.id"
        as="li"
        :y="24"
        :delay="i * 0.06"
        class="h-full [&>*]:h-full"
      >
        <div
          class="flex h-full min-h-[18.75vw] flex-col justify-between gap-4 rounded-[var(--radius-card)] bg-linear-to-b from-white/12 to-white/4 p-4 md:gap-6 md:p-6"
        >
          <UiGoldTile :src="benefit.iconUrl" />

          <div class="flex flex-col gap-2 md:gap-4">
            <!-- Inter SemiBold 36/44 (`629:28555`). -->
            <h3
              class="font-sans text-base leading-[1.22] font-semibold text-white md:text-[length:var(--text-body-lg)]"
            >
              {{ benefit.title }}
            </h3>
            <!-- Inter 24/36 at 60% (`629:28556`). -->
            <p
              class="font-sans text-sm leading-[1.5] text-white/60 md:text-[length:var(--text-body-sm)]"
            >
              {{ benefit.body }}
            </p>
          </div>
        </div>
      </MotionReveal>
    </ul>
  </section>
</template>
