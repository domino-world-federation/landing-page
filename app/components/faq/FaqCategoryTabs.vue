<script setup lang="ts">
import { FAQ_PAGE_COPY } from "~/content/faq"
import {
  FAQ_CATEGORIES,
  type FaqCategory,
  type FaqPageItem,
} from "~/content/faq/items"

/**
 * The topic column — Figma node `173:9842`.
 *
 * The legal contents column's rows (`ui/SideTab`, D32/D43) doing the gallery's
 * job rather than the terms document's: each row is a link to `?category=`, the
 * page re-renders on the server with one drawer of questions, and nothing here
 * needs to hydrate (D50).
 *
 * **Only the drawers that hold something are listed.** The design names five —
 * general, dwf, tournament, membership, development (`173:9528` and siblings) —
 * but the ten questions it writes fall into two of them, so printing all five
 * would give the page three tabs that filter to an empty card. A tab leading
 * nowhere is worse than a tab the designer drew and the copy has not caught up
 * with (D50, for the third time); the missing three appear on their own the
 * moment a question is filed under them.
 *
 * A live search is carried across a tab click rather than dropped, so narrowing
 * by topic while searching does not silently throw the search away — the same
 * reason `/news/all` forwards `?category=` into its archive link (D58).
 *
 * The rows do not scroll the page back to the top; that is `router.options.ts`,
 * one rule instead of a prop on every link.
 */
const props = defineProps<{
  /**
   * The whole list, not the filtered one: the column always shows the way out of
   * a filter.
   */
  items: readonly FaqPageItem[]
  /** The `?category=` slug, or `undefined` for "All FAQs". */
  active?: string
  /** The live `?q=`, forwarded so a tab click keeps it. */
  query?: string
}>()

function href(category?: FaqCategory) {
  const params = [
    category ? `category=${category}` : "",
    props.query ? `q=${encodeURIComponent(props.query)}` : "",
  ].filter(Boolean)

  return params.length ? `/faq?${params.join("&")}` : "/faq"
}

const shown = computed(() =>
  FAQ_CATEGORIES.filter((category) =>
    props.items.some((item) => item.category === category.id),
  ),
)
</script>

<template>
  <!-- No heading above the list: the design gives this column none, unlike the
       legal contents with its "Table of Contents" line. -->
  <UiSideTabList :label="FAQ_PAGE_COPY.filterLabel">
    <UiSideTab :href="href()" :active="active === undefined">
      {{ FAQ_PAGE_COPY.allTab }}
    </UiSideTab>

    <UiSideTab
      v-for="category in shown"
      :key="category.id"
      :href="href(category.id)"
      :active="active === category.id"
    >
      {{ category.label }}
    </UiSideTab>
  </UiSideTabList>
</template>
