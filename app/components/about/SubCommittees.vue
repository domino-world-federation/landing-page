<script setup lang="ts">
import { getSubCommittees } from "~/lib/api/client"
import { COMMITTEES_COPY } from "~/content/about/committees"

/**
 * Sub-Committees — Figma node `114:3667`.
 *
 * Six white cards on the page background, wrapping three to a row at the design
 * width. Figma sets each at a fixed 576 in a wrapping row, which is 1760 less
 * two 16px gaps divided by three — a three-column grid stated as widths. It is
 * built as the grid it is, so the cards stay even at every window instead of
 * leaving a ragged last row wherever 576 stops fitting.
 *
 * The committees come from the API (RULES §8): the federation adds and retires
 * them, and each will eventually have a page of its own — which is why the card
 * is a link when `href` is set and a plain panel when it is not. None are set
 * yet (blocker B2), so all six currently render as panels rather than as six
 * links that go nowhere.
 */
const { data: committees } = await useAsyncData(
  "about-sub-committees",
  () => getSubCommittees(),
  { default: () => [] },
)
</script>

<template>
  <section class="px-5 pt-28 pb-16 md:px-10 lg:px-20 lg:pt-[max(var(--nav-clearance),4.17vw)] lg:pb-[4.17vw]">
    <!-- Heading and description on one row — Figma `114:3668`. The description
         is 480 of 1920 and sits at the right, so the two read as a title and its
         note rather than as a paragraph under a heading. -->
    <div
      class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-16"
    >
      <MotionReveal :y="40">
        <!-- The gold statement heading `Mission` uses — see
             `StructuralFrameworks` for why it carries `w-fit`. -->
        <h2
          class="font-display w-fit text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08]"
        >
          {{ COMMITTEES_COPY.heading }}
        </h2>
      </MotionReveal>

      <MotionReveal :y="32" :delay="STAGGER" class="lg:w-[480px] lg:shrink-0">
        <p
          class="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60"
        >
          {{ COMMITTEES_COPY.description }}
        </p>
      </MotionReveal>
    </div>

    <!-- Three across at `lg`, two at `md`, one below. 64px under the header;
         3.33vw is 64/1920. -->
    <ul
      class="mt-10 grid list-none gap-4 md:grid-cols-2 lg:mt-[3.33vw] lg:grid-cols-3"
    >
      <li v-for="(committee, i) in committees" :key="committee.id" class="flex">
        <!-- The stagger runs across the row rather than down it — six cards
             lighting one after another in reading order. `w-full` so the
             animated wrapper is the grid item and the columns stay even. -->
        <MotionReveal :y="32" :delay="STAGGER * i" class="w-full">
          <AboutCommitteeCard :committee="committee" />
        </MotionReveal>
      </li>
    </ul>
  </section>
</template>
