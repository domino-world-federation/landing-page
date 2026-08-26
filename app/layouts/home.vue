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
</script>

<template>
  <div class="relative">
    <!-- `relative` anchors the navbar, which overlays the hero (S1). -->
    <LayoutNavbar />
    <slot />

    <div class="relative isolate">
      <UiPageShine
        src="/assets/home/decor-shine.svg"
        aspect-class="aspect-[1920/1775]"
      />
      <HomeJoin />
      <LayoutFooter />
    </div>
  </div>
</template>
