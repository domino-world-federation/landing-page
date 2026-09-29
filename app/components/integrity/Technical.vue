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

// Editable in the backoffice's page editor; the constants are the fallback.
const copy = usePageCopy("integrity")
const measures = computed(() =>
  INTEGRITY_MEASURES.map((measure, i) => ({
    ...measure,
    title: copy.text(`measures.cards.${i}.title`, measure.title),
    detail: copy.text(`measures.cards.${i}.detail`, measure.detail),
  })),
)
</script>

<template>
  <section
    aria-labelledby="technical-heading"
    class="flex flex-col items-center justify-center gap-10 px-5 pt-16 pb-16 lg:snap-screen md:px-10 lg:gap-12 lg:px-20 lg:pt-[var(--nav-clearance)] lg:pb-[4.17vw]"
  >
    <div class="flex max-w-[1760px] flex-col items-center gap-6 text-center lg:gap-9">
      <MotionReveal :y="40">
        <h2
          id="technical-heading"
          v-cms="'measures.heading'"
          class="font-display text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
        >
          {{ copy.text('measures.heading', COPY.heading) }}
        </h2>
      </MotionReveal>

      <!-- 1094 of the design's 1920. -->
      <p
        v-cms="'measures.intro'"
        class="font-sans max-w-[1094px] text-[length:var(--text-heading-card)] leading-[1.22] text-white"
      >
        {{ copy.text('measures.intro', COPY.intro) }}
      </p>
    </div>

    <!-- `auto-rows-fr` so all four match: the design fixes them at 410 and the
         explanations run to different lengths. -->
    <ul
      :aria-label="COPY.label"
      class="grid w-full auto-rows-fr list-none grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4"
    >
      <li v-for="(measure, i) in measures" :key="measure.id">
        <MotionReveal :y="24" :delay="i * 0.06" class="h-full [&>*]:h-full">
          <article
            class="flex h-full flex-col justify-between gap-6 rounded-[var(--radius-card)] bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_100%)] p-4 md:gap-8 md:p-6"
          >
            <UiGoldTile :src="measure.iconUrl" />

            <div class="flex flex-col gap-2 md:gap-4">
              <h3
                v-cms="`measures.cards.${i}.title`"
                class="font-sans text-base leading-[1.22] font-semibold text-white md:text-[length:var(--text-heading-card)]"
              >
                {{ measure.title }}
              </h3>
              <p
                v-cms="`measures.cards.${i}.detail`"
                class="font-sans text-sm leading-[1.5] text-white/60 md:text-[length:var(--text-body-sm)]"
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
