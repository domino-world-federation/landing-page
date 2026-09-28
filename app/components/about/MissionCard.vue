<script setup lang="ts">
import type { MissionCardCopy } from "~/content/about/mission"

/**
 * One of Mission's four cards — Figma `107:2938` and its three siblings.
 *
 * Split out of `Mission` because the section was past the ~150-line mark once
 * the heading block and the grid were both in it (RULES §5).
 *
 * The fill is Figma's own top-down white wash at 12% → 4%: a glass panel on the
 * page background rather than a solid, so the section keeps reading as one dark
 * band with four lit patches in it.
 */
defineProps<{ card: MissionCardCopy }>()
</script>

<template>
  <!-- 425px tall with the icon at the top and the text at the foot — the gap
       between them is what the height is for, so `justify-between` rather than a
       margin. `min-h` so a longer translation grows the card instead of spilling
       out of it. -->
  <div
    class="flex h-full flex-col justify-between gap-6 rounded-[20px] bg-[linear-gradient(180deg,rgb(255_255_255/0.12)_0%,rgb(255_255_255/0.04)_100%)] p-4 md:min-h-[300px] md:gap-10 md:p-6 lg:min-h-[22.14vw]"
  >
    <!-- 72 × 72 in Figma; `w-auto h-…` so the intrinsic ratio is kept and the
         SVG is never squashed. A plain `<img>`, since an SVG passes through the
         image pipeline unchanged (RULES §7).

         Empty alt: the icon draws what the title below it already says, so
         naming it would have a screen reader announce the card twice. -->
    <img
      :src="card.icon"
      alt=""
      width="72"
      height="72"
      class="h-10 w-auto md:h-14 lg:h-[min(3.75vw,72px)]"
    >

    <div class="flex flex-col gap-2 md:gap-4">
      <h3
        class="font-sans text-base leading-[1.22] font-semibold text-white md:text-[length:var(--text-body-lg)]"
      >
        {{ card.title }}
      </h3>
      <p
        class="font-sans text-sm leading-[1.5] text-white/40 md:text-[length:var(--text-body-sm)]"
      >
        {{ card.body }}
      </p>
    </div>
  </div>
</template>
