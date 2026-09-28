<script setup lang="ts">
import { NEWS_HEADER_COPY } from "~/content/news/header"

/**
 * `/news` — Figma screen `156:7512`.
 *
 * Six blocks, and the hi-fi draws all of them. The wireframe (`156:6782`) names
 * seven: the one missing here is "Newsletter Subscription", which the site's
 * footer has carried since S14 — building a second subscribe box on the one page
 * that already ends with one would be duplicating the control, not completing
 * the design.
 *
 * Same shell as About, Domino and Development: a header band under the `fixed`
 * navbar, then the page's sections, then the footer outside `<main>` as its own
 * landmark. No `PageShine` — the design has none here, unlike Development. No
 * `Join`: that is a landing-page section.
 *
 * **No header band** (repo owner's call, 2026-09-28): the page opens on the
 * featured story, and the search moved into the archive's control row beside
 * the category tabs. The page's `<h1>` stays, visually hidden — the featured
 * band's heading is a story's title, not the page's.
 *
 * **The archive is filtered by the URL.** `?category=` is read here and passed
 * down, so the section renders on the server and a filtered archive is a link
 * somebody can send (see `Archive`). It once carried a `?show=` as well; that
 * went when `/news/all` was built, which is where "View more" now leads.
 */
useSeoMeta({
  title: "News | Domino World Federation",
  description:
    "Federation news, press releases and publications — tournament results, governance decisions, development programmes, and the media archive.",
})

const route = useRoute()
const category = computed(() =>
  typeof route.query.category === "string" ? route.query.category : undefined,
)
</script>

<template>
  <main>
    <h1 class="sr-only">{{ NEWS_HEADER_COPY.title.join(" ") }}</h1>
    <NewsFeaturedBand />
    <NewsArchive :category="category" />
    <NewsPressReleases />
    <NewsPublications />
    <NewsMediaGallery />
  </main>
</template>
