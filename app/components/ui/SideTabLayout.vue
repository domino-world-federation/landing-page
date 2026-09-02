<script setup lang="ts">
/**
 * The two-column body the side-tab pages share — 468 + 1452 at the design width
 * (`174:11225` beside `174:11257`, and the same split on privacy, gallery and
 * all news).
 *
 * **The sidebar comes second in the source and is pulled back with `order`.** A
 * reader on a phone — and a screen reader at any width — should meet the content
 * before its index, rather than nine contents links or five filter tabs before
 * the first word.
 *
 * Sticky above `lg`, because every page that uses this is long: the terms
 * document is 3553px at the design width and the gallery archive 4827. `top`
 * clears the `fixed` navbar; the `max-h` with its own scroll keeps the column
 * usable on a short window, where the tabs plus the support card are taller than
 * the viewport.
 */
defineSlots<{ sidebar: () => unknown; default: () => unknown }>()
</script>

<template>
  <div
    class="flex flex-col gap-10 px-5 pb-16 md:px-10 lg:flex-row lg:items-start lg:gap-12 lg:px-20 lg:pb-24"
  >
    <!-- **The column travels with the page.** It was `sticky` with a capped
         height and its own `overflow-y`, which cost two things the repo owner
         asked back: a scrollbar down the middle of the page, and a "Need
         Support?" card cut off at the bottom of a box nobody thought to scroll.
         The design has no such box — `613:24376` is a plain column in flow, 468
         wide, and the whole of it is meant to be reachable by scrolling the
         page. So the pin and the cap are gone together; neither one is any use
         without the other. -->
    <div class="flex flex-col gap-10 lg:order-first lg:w-[388px] lg:shrink-0">
      <slot name="sidebar" />
    </div>

    <div class="min-w-0 flex-1">
      <slot />
    </div>
  </div>
</template>
