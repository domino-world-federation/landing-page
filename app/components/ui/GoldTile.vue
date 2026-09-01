<script setup lang="ts">
/**
 * A glyph in a gold tile — the tournament detail page's eligibility facts
 * (`517:2053`), governance's committees (`613:24911`) and integrity's technical
 * measures (`601:17922`).
 *
 * 72 × 72 at a 12px radius, filled with the gold fall turned 135°, with a 56px
 * glyph centred in it. Three pages drew the same square and each wrote out the
 * gradient by hand; one of them is enough.
 *
 * `aria-hidden`, always. Every caller prints the fact the glyph illustrates
 * immediately beside it, so naming the icon would announce the same thing twice.
 */
defineProps<{ src: string }>()
</script>

<template>
  <span
    aria-hidden
    class="flex size-18 shrink-0 items-center justify-center rounded-[var(--radius-glass)] bg-[linear-gradient(135deg,#FFE0A1_0%,#BA8D30_100%)]"
  >
    <!-- Drawn dark in the file, on gold here — so no `invert`. -->
    <img :src="src" alt="" width="56" height="56" class="size-14">
  </span>
</template>
