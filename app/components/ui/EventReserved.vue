<script setup lang="ts">
/**
 * Holds a slot as tall as the tallest string it could ever contain.
 *
 * Every candidate is rendered into the SAME grid cell — row 1, column 1 — with
 * the ones that are not showing marked `invisible`. The cell takes the height of
 * the tallest, and the visible child sits on top of it, so the box no longer
 * resizes when the value swaps and nothing below it moves.
 *
 * Why not a fixed `min-h`: the wrap point depends on the column width and the
 * font size, both of which change at every breakpoint, so any constant would be
 * a guess that held at one viewport and left a gap or a jump at the others. This
 * measures itself, and keeps working when the real API returns strings nobody
 * has seen yet.
 *
 * The hidden copies are `aria-hidden` and take the styling from the caller's
 * class, which is applied to the grid itself so both states are typeset
 * identically — a hidden copy in a different size would reserve the wrong
 * height.
 *
 * `as` is what the grid itself renders as. The date and place are `<dd>`s inside
 * a `<dl>`, where only `<dt>`/`<dd>` (and `<div>` wrapping a pair) are allowed
 * children — so there the grid IS the `<dd>` rather than a `<div>` around one.
 */
defineOptions({ inheritAttrs: false })

withDefaults(defineProps<{ as?: "div" | "dd"; all: string[] }>(), {
  as: "div",
})

const attrs = useAttrs()
const passThrough = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})
const rootClass = computed(() =>
  cn("grid", attrs.class as string | undefined),
)
</script>

<template>
  <component :is="as" v-bind="passThrough" :class="rootClass">
    <slot />
    <span
      v-for="text in all"
      :key="text"
      aria-hidden="true"
      class="invisible col-start-1 row-start-1"
    >{{ text }}</span>
  </component>
</template>
