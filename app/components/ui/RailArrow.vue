<script setup lang="ts">
/**
 * One arrow on a horizontal rail — `/tournaments` draws it at `381:17672`
 * (dimmed) and `381:17673`, and S8's redraw puts the same 64px glyph at each end
 * of the news strip (`566:13385`, `566:13386`).
 *
 * Lifted out of `tournaments/` on its second user, which is where this codebase
 * moves a component up (D32/D43) — the news strip would otherwise have had to
 * reach across a page boundary for a button.
 *
 * The design dims the backward arrow at the start of the row, which is the state
 * it drew; here both ends do it, and `disabled` rather than a lower opacity
 * alone so the control leaves the tab order exactly when it stops doing
 * anything. That is not the D28 case: this button is not waiting on a backend,
 * it has genuinely reached the end of the row.
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
    class="focus-visible:ring-gold flex size-12 items-center justify-center rounded-[var(--radius-btn)] transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 lg:size-16"
    @click="emit('press')"
  >
    <!-- A 64px inline SVG sized in CSS. The shared glyph points LEFT and is
         drawn dark for use on white, so it is inverted here and flipped for
         "next". -->
    <img
      src="/assets/global/icon-arrow-left.svg"
      alt=""
      width="64"
      height="64"
      :class="cn('size-12 invert lg:size-16', flipped && 'rotate-180')"
    >
  </button>
</template>
