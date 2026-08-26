<script setup lang="ts">
/**
 * One of the board carousel's two arrows — Figma `112:3597` / `112:3598`,
 * 64 × 64.
 *
 * Disabled at the end of its travel rather than wrapping, unlike S6's pager: a
 * scroller has real ends and the scroll position shows them, so a button that
 * jumped back to the start would contradict what the strip is doing. The 30%
 * opacity is Figma's own for that state.
 */
withDefaults(
  defineProps<{ label: string; disabled: boolean; flipped?: boolean }>(),
  { flipped: false },
)

const emit = defineEmits<{ press: [] }>()
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :aria-label="label"
    class="focus-visible:ring-gold flex size-12 items-center justify-center rounded-full transition-opacity disabled:pointer-events-none disabled:opacity-30 focus-visible:ring-2 focus-visible:outline-none lg:size-16"
    @click="emit('press')"
  >
    <!-- The icon is black, drawn for S6's white band; here it sits on the page
         background, so it is inverted rather than downloaded a second time in
         another colour. -->
    <img
      src="/assets/global/icon-arrow-left.svg"
      alt=""
      width="32"
      height="32"
      :class="cn('size-8 invert', flipped && 'rotate-180')"
    >
  </button>
</template>
