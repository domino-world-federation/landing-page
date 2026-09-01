<script setup lang="ts">
/**
 * The landing page's shell, and the reason it cannot use `default`.
 *
 * S12 and S13 share one stacking context, and it has to live here rather than on
 * either of them: the shine is a full-bleed layer that spans the FAQ's foot, the
 * CTA and the whole footer, so it cannot sit inside any one of the three.
 * `isolate` keeps its `-z-10` from escaping into the page's root context and
 * sliding behind the page background itself — the guard `<main>`'s own `z-10`
 * pairs with, after the wash once printed over the FAQ card.
 *
 * The footer is inside that wrapper but outside `<main>`: it is a landmark of
 * its own, and the shine has to reach it.
 */

/**
 * Section snapping is the landing page's alone, and `scroll-snap-type` has to
 * sit on the document's scrollport — `<html>` — to have any effect at all. The
 * rule itself is in `main.css`; this only decides which pages wear it. Declaring
 * it here rather than in the page ties it to the layout's lifetime: unhead drops
 * the attribute when the layout unmounts, so navigating to About or Tournaments
 * leaves an unsnapped `<html>` behind.
 */
useHead({ htmlAttrs: { class: "snap-sections" } })
</script>

<template>
  <div class="relative">
    <!-- `relative` anchors the navbar, which overlays the hero (S1). -->
    <LayoutNavbar />
    <slot />

    <div class="relative isolate">
      <!-- 2695/1920, and the number is the redraw's (`56:4970`: `y:6484`, height
           2695). It was 1775, measured against the older file — enough to reach
           a few hundred pixels into the FAQ back when the closing CTA was a
           short band of padding. Pinning that CTA to a full screen added ~600px
           between the footer and the FAQ, and the old figure would have left the
           light stopping partway up the section it exists to sit behind.

           2695 is the design's own span: anchored to the document's foot it
           reaches exactly the FAQ's head, which is where Figma starts it. -->
      <UiPageShine aspect-class="aspect-[1920/2695]" />
      <HomeJoin />
      <LayoutFooter />
    </div>
  </div>
</template>
