<script setup lang="ts">
import { getFederationStats } from "~/lib/api/client"
import { STATS_COPY } from "~/content/home/stats"

/**
 * S5 — Figma node `37:1874`. The federation in numbers.
 *
 * Four figures take turns in a focused slot: gold, sharp and full size in the
 * centre, dim and blurred above and below, with a rail of dots beside them
 * saying how many there are and which one is up. The wheel itself — the track,
 * the turning, the cross-fade, the frame, the rail — lives in `StatsWheel`; this
 * file supplies the data and the landmark around it.
 *
 * The count is data, not a constant: the track is a viewport per stat and the
 * rail is a dot per stat, so the redraw from three figures to four cost nothing
 * here beyond the list it fetches.
 *
 * The section is a full-height stage now rather than a band in the flow: the
 * wheel is `sticky` inside a track a viewport tall per stat, and the reader's
 * scroll is what turns it. It used to turn itself on an interval. Which of the
 * two it is belongs entirely to `StatsWheel`, and the reasoning is there.
 *
 * The figures are fetched, not written in — a number that changes is data
 * (`getFederationStats`), and only the section's name for assistive tech is
 * copy. `useAsyncData` is what keeps the fetch on the server: it runs during SSR
 * and hands the result to the client in the payload, so the browser never asks
 * again. The React build got the same thing from being a Server Component.
 *
 * **Two renderings of the same stats.** The wheel is `aria-hidden`: it shows one
 * figure at a time in a slot, and reaching the last means scrolling a viewport
 * per figure — a reader on a screen reader would be walked through a visual
 * effect to be told four numbers. The `<dl>` here is the accessible one
 * — every stat once, in source order. From `lg` it is visually hidden
 * (`sr-only`, so it stays in the accessibility tree, and `absolute`, so it adds
 * nothing to the track's measurements).
 *
 * **Below `lg` the `<dl>` is the section and the wheel is not drawn.** A track
 * a screen tall per figure is a pinned stage the reader has to scroll through
 * four times to get past, and on a phone — where the address bar resizes the
 * screen mid-scroll and a flick carries momentum through the notches — it reads
 * as the page sticking. Every figure at once, one row each, is the same content
 * without the stage. Both are in the markup at every width and CSS picks, so
 * there is no branch for hydration to disagree over.
 *
 * Figma has this frame at `y:2065` while S4 runs to `2277`, so on the canvas the
 * stats sit on the building's last 212px — its fade-to-background band. Pulling
 * the section up by that much was tried and taken back out: at 1920 it reads as
 * the design does, but the overlap is measured against S4's `56.25vw` height,
 * and below `lg` that section leaves the ratio and follows its copy instead, so
 * the same pull lands the first figure somewhere different at every width. The
 * section stands on its own instead, and the join is left to S4's own baked-in
 * fade, which already ends on `#0e0e0e`. The full-height track settles it for
 * good: a section that pins to the top of the screen cannot overlap the one
 * above it.
 */
const { data: stats } = await useAsyncData("home-stats", () => getFederationStats(), {
  default: () => [],
})
</script>

<template>
  <!-- No padding and no height of its own: `StatsWheel` is a scroll track a
       viewport tall per stat, with the wheel `sticky` inside it, so the section
       measures itself and the horizontal gutter belongs to the pinned stage
       rather than to the track around it.

       No `snap-start snap-always` either, which every other section on this page
       carries. The wheel's own notches are snap points and the first of them
       sits exactly at this section's head, so S5 still stops the scroll where
       its siblings do — putting one here as well would only duplicate that
       position. -->
  <section aria-labelledby="stats-heading" class="relative w-full">
    <h2 id="stats-heading" class="sr-only">
      {{ STATS_COPY.heading }}
    </h2>

    <!-- The wheel's focused row, still: label left, the gold figure right, a
         faint rule between rows standing in for the wheel's frame. -->
    <dl class="flex flex-col px-5 py-16 md:px-10 lg:sr-only">
      <div
        v-for="stat in stats"
        :key="stat.id"
        class="flex items-center justify-between gap-6 border-b border-white/10 py-6 last:border-b-0"
      >
        <dt
          class="font-sans text-[length:var(--text-stat-label)] leading-tight font-medium text-white"
        >
          {{ stat.label }}
        </dt>
        <dd
          class="font-display text-gold-gradient text-[length:var(--text-display-stat)] leading-none"
        >
          {{ stat.value }}
        </dd>
      </div>
    </dl>

    <HomeStatsWheel :stats="stats" class="hidden lg:block" />
  </section>
</template>
