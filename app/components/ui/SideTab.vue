<script setup lang="ts">
/**
 * One row — `174:11228` when current, `174:11232` otherwise.
 *
 * The gold bar REPLACES the inactive row's left padding rather than adding to
 * it, so the type keeps one left edge down the column and the bar reads as a
 * marker in the margin instead of shunting the row across.
 *
 * The React build carried a `prefetch` prop, because Next only prefetched the
 * shared shell of a dynamic route and every page using these rows renders
 * dynamically — so a click still waited on a server render and the tab read as
 * loading. `NuxtLink` prefetches the whole route on visibility by default, and a
 * column holds five or six of these all on screen at once, so there is nothing
 * left for the prop to correct.
 */
withDefaults(
  defineProps<{
    href: string
    active: boolean
    /**
     * `"page"` where the row is a destination the reader is on; `"true"` where
     * it marks a position within the current page, as the terms contents do.
     */
    current?: "page" | "true"
  }>(),
  { current: "page" },
)
</script>

<template>
  <!-- The hairline between rows (`174:11231`). On the item and skipped on the
       first, so a list of n rows carries n−1 rules and none at its head. -->
  <li
    class="shrink-0 snap-start border-[#353535] lg:shrink lg:border-t lg:first:border-t-0"
  >
    <NuxtLink
      :to="href"
      :aria-current="active ? current : undefined"
      :class="
        cn(
          'font-display focus-visible:ring-gold flex items-center gap-3 whitespace-nowrap border-b-2 py-4 text-[length:var(--text-display-caption)] leading-[1.25] transition-colors focus-visible:ring-2 focus-visible:outline-none lg:border-b-0 lg:py-6',
          active
            ? 'text-gold border-gold'
            : 'text-muted hover:text-white/80 border-transparent lg:pl-4',
        )
      "
    >
      <!-- The margin bar is the WIDE layout's marker only. Side by side the
           underline above says it, and a bar between two tabs would read as
           belonging to neither. -->
      <span
        v-if="active"
        aria-hidden
        class="bg-gold hidden h-9 w-1 shrink-0 lg:block"
      />
      <span><slot /></span>
    </NuxtLink>
  </li>
</template>
