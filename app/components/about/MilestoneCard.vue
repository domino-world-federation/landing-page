<script setup lang="ts">
import type { HeritageMilestone } from "~/lib/api/types"

/**
 * One milestone — Figma `88:1202`. An `<li>` because the four are a sequence in
 * time, and a screen reader saying "list, 4 items" is the timeline's shape said
 * out loud.
 *
 * The year sits above the card on the design's dashed rule; the pair is one
 * column so the marker travels with the card it belongs to at every width.
 * Alternating cards drop 100px (Figma's y 240 / 340), which is what keeps the
 * strip from reading as a plain row of four.
 */
defineProps<{ milestone: HeritageMilestone; index: number }>()
</script>

<template>
  <!-- `data-milestone` is how the auto-advance measures its step: it marks the
       adjacent elements whose offset difference IS one card-plus-gap. -->
  <li
    data-milestone
    class="flex w-[clamp(280px,25vw,480px)] shrink-0 snap-start flex-col"
  >
    <!-- Year and dot, centred on the rule below them — Figma `88:1171`. -->
    <div class="flex flex-col items-center gap-2 self-start">
      <span
        class="font-display text-[length:var(--text-display-year)] leading-[1.15] text-white"
      >
        {{ milestone.year }}
      </span>
      <span aria-hidden="true" class="size-3 rounded-full bg-white" />
    </div>

    <div
      :class="
        cn(
          'flex h-[clamp(400px,26.04vw,500px)] flex-col gap-4 rounded-[32px] bg-[var(--color-surface-card)]/50 p-5 lg:gap-[1.46vw] lg:p-[1.46vw]',
          // Figma's y 240 for the odd cards and 340 for the even ones, measured
          // down from the marker row rather than from the section top.
          index % 2 === 0
            ? 'mt-[clamp(32px,8.33vw,160px)]'
            : 'mt-[clamp(32px,13.54vw,260px)]',
        )
      "
    >
      <h3
        class="font-sans text-[length:var(--text-body-lg)] leading-[1.22] font-semibold text-white"
      >
        {{ milestone.title }}
      </h3>
      <p class="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60">
        {{ milestone.summary }}
      </p>

      <!-- `flex-1` and `min-h-0`: the photograph takes whatever the copy left,
           and without `min-h-0` a flex item refuses to shrink below its content
           and the card grows past its 500px instead. -->
      <div class="relative min-h-0 flex-1 overflow-hidden rounded-xl">
        <!-- `draggable="false"`: a dragged image is a browser drag-and-drop by
             default, which hijacks the pan the moment the pointer lands on a
             photograph. -->
        <NuxtImg
          :src="milestone.imageUrl"
          :alt="milestone.imageAlt"
          :sizes="imageSizes({ xs: '80vw', lg: '25vw' })"
          :draggable="false"
          class="absolute inset-0 size-full object-cover"
        />
      </div>
    </div>
  </li>
</template>
