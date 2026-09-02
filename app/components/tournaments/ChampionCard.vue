<script setup lang="ts">
import type { Champion } from "~/lib/api/types"
import { TOURNAMENTS_COPY } from "~/content/tournaments"

/** One card in Champions Hall — `381:17645`. */
const props = defineProps<{ champion: Champion }>()

const emit = defineEmits<{ open: [] }>()

/**
 * What the tile's button announces. The name rather than "photograph": a rail of
 * these otherwise gives a screen reader the same label several times over with
 * nothing to tell them apart, and the name is the thing the reader is choosing
 * between. Newlines are the design's line break, not part of the name.
 */
const openLabel = computed(() =>
  TOURNAMENTS_COPY.champions.open.replace(
    "%s",
    props.champion.name.replace(/\n/g, " "),
  ),
)

// The design breaks the name across two lines; rendered as blocks rather than
// with a `<br>`, so the words stay separate strings for translation — the call
// `SupportCard` and `BoardCard` already make.
const nameLines = computed(() => props.champion.name.split("\n"))
</script>

<template>
  <figure
    class="group relative flex aspect-[540/700] w-[80vw] shrink-0 snap-start items-end overflow-hidden rounded-[var(--radius-card)] bg-[radial-gradient(circle_at_117%_-2%,#c3ae86_0%,#4f4332_100%)] lg:w-[28.13vw] lg:max-w-[540px]"
  >
    <!-- The whole tile opens the viewer. A `<button>` rather than a click
         handler on the figure: it is a real control, so it lands in the tab
         order, answers the keyboard and announces itself — and the accessible
         name is the champion's, because "photograph" seven times over tells a
         reader nothing about which one they are opening.

         `after` stretches it across the tile so the picture and the caption are
         both the target, while the button itself stays where the caption cannot
         overlap it. Same construction the news mosaic uses. -->
    <button
      type="button"
      :aria-label="openLabel"
      class="focus-visible:ring-gold absolute inset-0 z-10 after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:outline-none"
      @click="emit('open')"
    />

    <NuxtImg
      v-if="champion.portraitUrl"
      :src="champion.portraitUrl"
      :alt="champion.portraitAlt ?? ''"
      :sizes="imageSizes({ xs: '80vw', lg: '28vw' })"
      class="absolute inset-0 size-full object-cover"
    />

    <!-- The caption's own fall to black (`381:17647`), 47% of the card tall in
         the design. Written as a share of the card rather than Figma's 331px so
         it stays the same depth under the name at every rail width (D19). -->
    <figcaption
      class="relative flex w-full flex-col gap-2 bg-linear-to-b from-transparent via-black/70 to-black px-6 pt-[6.5rem] pb-6"
    >
      <!-- Inter Regular 20/28 in capitals at 70% (`381:17648`). -->
      <p
        class="font-sans text-[length:var(--text-eyebrow)] leading-7 text-white/70 uppercase"
      >
        {{ champion.event }}
      </p>

      <!-- Inter Regular 48/56 (`381:17649`). -->
      <p class="font-sans text-[length:var(--text-body-xl)] leading-[1.1667] text-white">
        <span v-for="line in nameLines" :key="line" class="block">{{ line }}</span>
      </p>
    </figcaption>
  </figure>
</template>
