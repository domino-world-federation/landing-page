<script setup lang="ts">
/**
 * The shell both document shelves sit in — Figma nodes `168:8475` (press
 * releases) and `168:8582` (publications).
 *
 * A gold title in a 356px column on the left, a wrapping list of white cards in
 * a 1136px column on the right. One component because the design draws one
 * layout twice; the only difference is that the press shelf hangs a link under
 * its title, which is a slot rather than a second component with a hole in it.
 */
defineProps<{
  /** Anchors the section's own `<h2>` for `aria-labelledby`. */
  id: string
  heading: string
}>()

defineSlots<{
  /** The link under the heading, where the shelf has one. */
  aside?: () => unknown
  default: () => unknown
}>()
</script>

<template>
  <section
    :aria-labelledby="`${id}-heading`"
    class="bg-bg flex flex-col gap-8 px-5 py-10 md:px-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:px-20 lg:py-[3.125vw]"
  >
    <div class="flex shrink-0 flex-col gap-3.5 lg:w-[356px]">
      <!-- Bebas 76/72 through the page's gold gradient. `uppercase` in CSS
           rather than in the string, so the copy keeps its own case (D40). -->
      <h2
        :id="`${id}-heading`"
        class="font-display w-fit bg-[image:var(--gradient-gold-text)] bg-clip-text text-[length:var(--text-display-sm)] leading-[0.95] text-transparent uppercase"
      >
        {{ heading }}
      </h2>
      <slot name="aside" />
    </div>

    <!-- 1136 of the design's 1920. `min-w-0` so the wrapping list is sized by
         this column rather than the column by its widest card. -->
    <div class="flex w-full min-w-0 flex-wrap gap-4 lg:max-w-[1136px]">
      <slot />
    </div>
  </section>
</template>
