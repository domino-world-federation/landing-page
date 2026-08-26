<script setup lang="ts">
/**
 * One end of the featured band's pager — `163:8170` and its mirror.
 *
 * 20%-white glass with a 32px arrow. One asset serves both ends: the shared
 * glyph points left, so "next" is the same file turned 180°.
 */
withDefaults(defineProps<{ label: string; flip?: boolean }>(), { flip: false })

const emit = defineEmits<{ press: [] }>()
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    class="rounded-btn focus-visible:ring-gold flex size-[62px] shrink-0 items-center justify-center bg-white/20 transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:outline-none"
    @click="emit('press')"
  >
    <!-- A 32px inline SVG sized in CSS. `invert` because the source is drawn in
         `#0E0E0E` for use on white, and this sits on dark glass. -->
    <img
      src="/assets/global/icon-arrow-left.svg"
      alt=""
      width="32"
      height="32"
      :class="cn('size-8 invert', flip && 'rotate-180')"
    >
  </button>
</template>
