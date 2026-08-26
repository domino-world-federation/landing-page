<script setup lang="ts">
import type { Champion } from "~/lib/api/types"

/** One card in Champions Hall — `381:17645`. */
const props = defineProps<{ champion: Champion }>()

// The design breaks the name across two lines; rendered as blocks rather than
// with a `<br>`, so the words stay separate strings for translation — the call
// `SupportCard` and `BoardCard` already make.
const nameLines = computed(() => props.champion.name.split("\n"))
</script>

<template>
  <figure
    class="relative flex aspect-[540/700] w-[min(80vw,540px)] shrink-0 snap-start items-end overflow-hidden rounded-[var(--radius-card)] bg-[radial-gradient(circle_at_117%_-2%,#c3ae86_0%,#4f4332_100%)]"
  >
    <NuxtImg
      v-if="champion.portraitUrl"
      :src="champion.portraitUrl"
      :alt="champion.portraitAlt ?? ''"
      :sizes="imageSizes({ xs: '80vw', md: '540px' })"
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
