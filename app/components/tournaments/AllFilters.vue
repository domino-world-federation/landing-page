<script setup lang="ts">
import {
  ALL_TOURNAMENTS_COPY,
  TOURNAMENT_FILTERS,
} from "~/content/tournaments/all"

/**
 * The filter column on `/tournaments/all` — Figma node `517:2507`.
 *
 * `ui/SideTabList` and `ui/SideTab` verbatim: Bebas 32/40 rows on `#353535`
 * hairlines, the current one gold with a 4px bar in the margin. That is the same
 * column the legal pages and `/gallery` draw, which is why those two components
 * are in `ui/` — this is their fourth user, not a fourth copy.
 *
 * **The rows are links, not state.** `?status=` is read by the page, filtered
 * during SSR, and nothing has to hydrate before a reader sees the right list —
 * the same call D50 records for the news archive's categories. A filtered list
 * is also a URL somebody can send, which a click handler holding a `ref` would
 * not be.
 *
 * The search term rides along in every row's `to`. Filtering to "Open" should
 * not silently discard what the reader typed — that reads as the search box
 * having been ignored.
 */
const props = defineProps<{
  /** The `?status=` in force, or `undefined` on "All". */
  active?: string
  /** The `?q=` in force, carried through so a filter does not drop it. */
  query?: string
}>()

// A string rather than a location object, because `ui/SideTab` takes an `href`
// and three other pages already pass it one. `URLSearchParams` does the escaping
// — a search term with a space or an ampersand in it would otherwise cut the
// query in half.
function linkTo(value?: string) {
  const search = new URLSearchParams()
  if (value) search.set("status", value)
  if (props.query) search.set("q", props.query)

  return search.size > 0
    ? `/tournaments/all?${search}`
    : "/tournaments/all"
}
</script>

<template>
  <UiSideTabList :label="ALL_TOURNAMENTS_COPY.filtersLabel">
    <UiSideTab
      v-for="filter in TOURNAMENT_FILTERS"
      :key="filter.label"
      :href="linkTo(filter.value)"
      :active="active === filter.value"
      current="true"
    >
      {{ filter.label }}
    </UiSideTab>
  </UiSideTabList>
</template>
