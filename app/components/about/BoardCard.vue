<script setup lang="ts">
import type { BoardMember } from "~/lib/api/types"

/**
 * One member of the executive board — Figma `111:3562` and its three siblings.
 *
 * A portrait with the office and the name laid over its foot. The caption is not
 * a bar across the picture: Figma fills the lower 331px of the card with a wash
 * that is transparent at the top and black at the bottom, so the type sits on
 * the photograph and the photograph is still visible behind it.
 */
const props = defineProps<{ member: BoardMember }>()

// Inter 48/56, and the break is the data's own: Figma writes the names across
// two lines in a 540px card, so the newline travels with the member rather than
// being guessed at here. A name without one simply renders on one line.
const nameLines = computed(() => props.member.name.split("\n"))
</script>

<template>
  <!-- 540 × 700 in Figma; the ratio is what is kept rather than the pixels, so
       the card scales with the strip. White underneath because the portraits are
       cut-outs in places and the design's card is a white panel. -->
  <div
    class="relative aspect-[540/700] overflow-hidden rounded-[20px] bg-[var(--color-surface-light)]"
  >
    <!-- `draggable="false"`: a dragged image is a browser drag-and-drop by
         default, which would hijack the pan the moment the pointer lands on a
         portrait. -->
    <NuxtImg
      :src="member.portraitUrl"
      :alt="member.portraitAlt"
      :sizes="imageSizes({ xs: '80vw', lg: '29vw' })"
      :quality="85"
      :draggable="false"
      class="absolute inset-0 size-full object-cover"
    />

    <!-- The lower 331 of 700 — 47.3% — is where the wash begins, so the type has
         something to sit on without the whole portrait being darkened. -->
    <div
      class="absolute inset-x-0 bottom-0 flex h-[47.3%] flex-col justify-end gap-2 bg-[linear-gradient(180deg,rgb(0_0_0/0)_0%,rgb(0_0_0/0.7)_50%,rgb(0_0_0/1)_100%)] px-4 pt-8 pb-4 lg:px-[1.25vw] lg:pt-[2.4vw] lg:pb-[1.25vw]"
    >
      <p
        class="font-sans text-[length:var(--text-eyebrow)] leading-7 text-white/70 uppercase"
      >
        {{ member.role }}
      </p>

      <p
        class="font-sans text-[length:var(--text-body-xl)] leading-[1.17] text-white"
      >
        <span v-for="line in nameLines" :key="line" class="block">{{ line }}</span>
      </p>
    </div>
  </div>
</template>
