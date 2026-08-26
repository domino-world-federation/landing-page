<script setup lang="ts">
import { NAV_COPY } from "~/content/navigation"

/**
 * S1 — Figma node `42:2143`.
 *
 * The navbar sits at y:0 on top of the hero, so at rest it overlays rather than
 * occupying a band of its own. It travels with the page: `NavShell` holds it
 * fixed, and the glass belongs to the pill and the burger rather than to the
 * bar behind them.
 */
</script>

<template>
  <LayoutNavShell>
    <NuxtLink
      to="/"
      class="focus-visible:ring-gold rounded-sm focus-visible:ring-2 focus-visible:outline-none"
    >
      <!-- A plain `<img>`, not `<NuxtImg>`. The file is an SVG: it is already
           resolution-independent, and putting it through the image pipeline
           would cost a transform request to hand back the same bytes. The Next
           build reached the same place from the other side — `next/image`
           serves SVG unoptimised whatever you ask it for (RULES §7). -->
      <img
        src="/assets/global/logo-dwf-horizontal.svg"
        :alt="NAV_COPY.logoAlt"
        width="156"
        height="60"
        fetchpriority="high"
        class="h-11 w-auto lg:h-15"
      >
    </NuxtLink>

    <LayoutNavMenu />
  </LayoutNavShell>
</template>
