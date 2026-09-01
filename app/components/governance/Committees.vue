<script setup lang="ts">
import { getStandingCommittees } from "~/lib/api/client"
import { GOVERNANCE_COPY } from "~/content/governance"

/**
 * Standing Committees — Figma node `613:24906`.
 *
 * A gold Bebas 100 over three cards, each a gold-tiled glyph, the committee's
 * name, and the three things it answers for.
 *
 * The bodies come from the API rather than from `content/` (RULES §8): a
 * federation reorganises, and the row draws however many it is handed rather
 * than the three the design happened to draw.
 */
const { data: committees } = await useAsyncData(
  "governance-committees",
  () => getStandingCommittees(),
  { default: () => [] },
)
</script>

<template>
  <section
    v-if="committees.length > 0"
    aria-labelledby="committees-heading"
    class="flex snap-screen flex-col justify-center gap-10 px-5 pt-28 pb-16 md:px-10 lg:gap-12 lg:px-20 lg:pt-[var(--nav-clearance)] lg:pb-[4.17vw]"
  >
    <MotionReveal :y="40">
      <h2
        id="committees-heading"
        class="font-display text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
      >
        {{ GOVERNANCE_COPY.committeesHeading }}
      </h2>
    </MotionReveal>

    <!-- `auto-rows-fr` so the three cards are the same height whatever their
         remits do — the chips wrap to two lines on some and one on others. -->
    <ul
      :aria-label="GOVERNANCE_COPY.committeesLabel"
      class="grid auto-rows-fr list-none gap-5 lg:grid-cols-3"
    >
      <li v-for="(committee, i) in committees" :key="committee.id">
        <MotionReveal :y="24" :delay="i * 0.08" class="h-full [&>*]:h-full">
          <GovernanceCommitteeCard :committee="committee" />
        </MotionReveal>
      </li>
    </ul>
  </section>
</template>
