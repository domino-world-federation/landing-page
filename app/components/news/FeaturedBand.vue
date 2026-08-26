<script setup lang="ts">
import { getFeaturedNews } from "~/lib/api/client"

/**
 * Fetches the featured stories and hands them to the band.
 *
 * A thin shell so the call to `getFeaturedNews` runs during SSR and reaches the
 * client through the payload rather than as a second request — the same split
 * `Stats` uses for the wheel (RULES §5/§8).
 */
const { data: stories } = await useAsyncData(
  "news-featured",
  () => getFeaturedNews(),
  { default: () => [] },
)
</script>

<template>
  <NewsFeaturedStories :stories="stories" />
</template>
