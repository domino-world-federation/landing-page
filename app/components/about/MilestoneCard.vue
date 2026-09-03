<script setup lang="ts">
import type { HeritageMilestone } from "~/lib/api/types"

/**
 * One milestone — Figma `88:1202`. An `<li>` because the four are a sequence in
 * time, and a screen reader saying "list, 4 items" is the timeline's shape said
 * out loud.
 *
 * The year sits above the card on the design's dashed rule; the pair is one
 * column so the marker travels with the card it belongs to at every width.
 *
 * **The drop is on the column, not on the card inside it.** Alternating columns
 * hang 100px apart (Figma's y 240 / 340), which is what keeps the strip from
 * reading as a plain row of four — and moving the card alone left every marker
 * dot sitting on one level, which is not what the design draws. The whole
 * column moves now, dot and all.
 *
 * Every column is the same height (`100% - --heritage-drop-max`) whatever its
 * parity, so the two differ in where they hang rather than in how big they are.
 * The two offsets live in `HeritageTimeline`, where the maximum they subtract is
 * also stated.
 */
defineProps<{ milestone: HeritageMilestone; index: number }>()
</script>

<template>
  <!-- `data-milestone` is how the auto-advance measures its step: it marks the
       adjacent elements whose offset difference IS one card-plus-gap. -->
  <li
    data-milestone
    :class="
      cn(
        // The gap is the marker's clearance from the card it belongs to. It
        // had none: the dot sat straight on the card's top edge and read as
        // part of it rather than as a point on the rule above it.
        'flex h-[calc(100%-var(--heritage-drop-max))] w-[clamp(280px,25vw,480px)] shrink-0 snap-start flex-col gap-5 lg:gap-[1.67vw]',
        index % 2 === 0
          ? 'mt-[var(--heritage-drop-min)]'
          : 'mt-[var(--heritage-drop-max)]',
      )
    "
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
          // The design's 500 is a CAP now, not a height. It was
          // `h-[clamp(400px,26.04vw,500px)]`, which is measured off the
          // viewport's width and so knew nothing about how tall the window
          // actually was: on a wide, short screen the card kept its 500 and
          // pushed the section past the screen it has to fit inside. As a flex
          // child it takes what the scroller has instead, and the cap keeps a
          // tall window from stretching it past the size the design draws.
          'flex min-h-0 max-h-[500px] flex-1 flex-col gap-4 rounded-[32px] bg-[var(--color-surface-card)]/50 p-5 lg:gap-[1.46vw] lg:p-[1.46vw]',
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
