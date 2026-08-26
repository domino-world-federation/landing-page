<script setup lang="ts">
import { ALL_NEWS_COPY } from "~/content/news/all"

/**
 * The category column on the full archive — Figma node `185:13254`.
 *
 * The gallery's event filter doing the same job for a different feed: each tab
 * is a link to `?category=`, `getLatestNews` filters during SSR, and nothing
 * here has to hydrate (D50).
 *
 * The labels come from the feed rather than from Figma, for the third time and
 * the same reason. The design names five — All NEWS, dwf, tournament,
 * membership, development (`185:13257` and siblings) — and the feed's categories
 * are a different vocabulary again, so the design's list would print tabs that
 * filter to nothing while hiding categories that have articles in them.
 */
defineProps<{
  categories: string[]
  /** The `?category=` value, or `undefined` for "All news". */
  active?: string
}>()
</script>

<template>
  <UiSideTabList :label="ALL_NEWS_COPY.filterLabel">
    <UiSideTab href="/news/all" :active="active === undefined">
      {{ ALL_NEWS_COPY.allTab }}
    </UiSideTab>

    <UiSideTab
      v-for="name in categories"
      :key="name"
      :href="`/news/all?category=${encodeURIComponent(name)}`"
      :active="active === name"
    >
      {{ name }}
    </UiSideTab>
  </UiSideTabList>
</template>
