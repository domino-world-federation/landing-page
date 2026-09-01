<script setup lang="ts">
/**
 * The shell eleven of the thirteen routes share: the navbar overlaying the page,
 * the page's own `<main>`, and the footer.
 *
 * **The footer is outside `<main>` and inside this layout**, which is the
 * arrangement every page in the Next build wrote out by hand — it is a landmark
 * of its own, so it must not be nested in the page's. The page supplies `<main>`
 * itself rather than being wrapped in one here, because the pages disagree about
 * it: most want a bare `<main>` and the two with a shine behind them want
 * `relative z-10` on it.
 *
 * The landing page does not use this layout — its footer sits INSIDE the group
 * the shine washes over, so it has one of its own.
 */
const route = useRoute()

const shine = computed(() => route.meta.shine)
</script>

<template>
  <div class="relative" :class="{ isolate: shine }">
    <!-- `relative` anchors the navbar, which is `fixed` and overlays the page.
         `isolate` arrives with the shine and only with it: it gives that layer's
         `-z-10` a stacking context to be behind, and a page without one does not
         want the extra context. -->
    <LayoutNavbar />

    <!-- Declared by the page through `definePageMeta`, rendered here — a route
         component may only have one root element, so `/development` and
         `/members` cannot put this beside their own `<main>`. -->
    <UiPageShine v-if="shine" :aspect-class="shine.aspectClass" />

    <slot />
    <LayoutFooter />
  </div>
</template>
