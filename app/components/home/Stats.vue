<script setup lang="ts">
import { getFederationStats } from "~/lib/api/client"
import { STATS_COPY } from "~/content/home/stats"

/**
 * S5 — Figma node `37:1874`. The federation in numbers.
 *
 * Three figures take turns in a focused slot: gold, sharp and full size in the
 * centre, dim and blurred above and below. The wheel itself — the turning, the
 * cross-fade, the frame — lives in `StatsWheel`; this file supplies the data and
 * the band it sits in.
 *
 * The figures are fetched, not written in — a number that changes is data
 * (`getFederationStats`), and only the section's name for assistive tech is
 * copy. `useAsyncData` is what keeps the fetch on the server: it runs during SSR
 * and hands the result to the client in the payload, so the browser never asks
 * again. The React build got the same thing from being a Server Component.
 *
 * **Two renderings of the same three stats.** The wheel is `aria-hidden`: it
 * repeats its list forever and a screen reader following it would read the
 * figures over and over, in whatever order the interval happened to leave them.
 * The `<dl>` here is the accessible one — every stat once, in source order,
 * visually hidden. `sr-only` rather than `display:none`, so it is in the
 * accessibility tree.
 *
 * Figma has this frame at `y:2065` while S4 runs to `2277`, so on the canvas the
 * stats sit on the building's last 212px — its fade-to-background band. Pulling
 * the section up by that much was tried and taken back out: at 1920 it reads as
 * the design does, but the overlap is measured against S4's `56.25vw` height,
 * and below `lg` that section leaves the ratio and follows its copy instead, so
 * the same pull lands the first figure somewhere different at every width. The
 * section stands on its own instead, and the join is left to S4's own baked-in
 * fade, which already ends on `#0e0e0e`.
 */
const { data: stats } = await useAsyncData("home-stats", () => getFederationStats(), {
  default: () => [],
})
</script>

<template>
  <section
    aria-labelledby="stats-heading"
    class="relative w-full px-5 py-16 md:px-10 lg:px-20 lg:py-24"
  >
    <h2 id="stats-heading" class="sr-only">
      {{ STATS_COPY.heading }}
    </h2>

    <dl class="sr-only">
      <div v-for="stat in stats" :key="stat.id">
        <dt>{{ stat.label }}</dt>
        <dd>{{ stat.value }}</dd>
      </div>
    </dl>

    <HomeStatsWheel :stats="stats" />
  </section>
</template>
