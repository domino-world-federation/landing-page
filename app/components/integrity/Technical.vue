<script setup lang="ts">
import { INTEGRITY_COPY, INTEGRITY_MEASURES } from "~/content/integrity"

/**
 * Technical Overview — Figma node `601:17891`.
 *
 * A centred gold heading and a sentence, then four cards on the same white
 * 12%→4% fall the governance committees use. Each card is a gold-tiled glyph at
 * the top and its explanation at the foot, which is why the card is
 * `justify-between` rather than a stack with a gap: the design pins the two
 * apart rather than spacing them.
 */
const COPY = INTEGRITY_COPY.technical
</script>

<template>
  <section
    aria-labelledby="technical-heading"
    class="flex snap-screen flex-col items-center justify-center gap-10 px-5 pt-28 pb-16 md:px-10 lg:gap-12 lg:px-20 lg:pt-[var(--nav-clearance)] lg:pb-[4.17vw]"
  >
    <div class="flex max-w-[1760px] flex-col items-center gap-6 text-center lg:gap-9">
      <MotionReveal :y="40">
        <h2
          id="technical-heading"
          class="font-display text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
        >
          {{ COPY.heading }}
        </h2>
      </MotionReveal>

      <!-- 1094 of the design's 1920. -->
      <p
        class="font-sans max-w-[1094px] text-[length:var(--text-heading-card)] leading-[1.22] text-white"
      >
        {{ COPY.intro }}
      </p>
    </div>

    <!-- `auto-rows-fr` so all four match: the design fixes them at 410 and the
         explanations run to different lengths. -->
    <ul
      :aria-label="COPY.label"
      class="grid w-full auto-rows-fr list-none gap-5 sm:grid-cols-2 lg:grid-cols-4"
    >
      <li v-for="(measure, i) in INTEGRITY_MEASURES" :key="measure.id">
        <MotionReveal :y="24" :delay="i * 0.06" class="h-full [&>*]:h-full">
          <article
            class="flex h-full flex-col justify-between gap-8 rounded-[var(--radius-card)] bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_100%)] p-6"
          >
            <UiGoldTile :src="measure.iconUrl" />

            <div class="flex flex-col gap-4">
              <h3
                class="font-sans text-[length:var(--text-heading-card)] leading-[1.22] font-semibold text-white"
              >
                {{ measure.title }}
              </h3>
              <p
                class="font-sans text-[length:var(--text-body-sm)] leading-[1.5] text-white/60"
              >
                {{ measure.detail }}
              </p>
            </div>
          </article>
        </MotionReveal>
      </li>
    </ul>
  </section>
</template>
