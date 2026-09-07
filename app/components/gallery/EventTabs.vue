<script setup lang="ts">
import type { GalleryAlbum } from "~/lib/api/types"
import { GALLERY_COPY } from "~/content/gallery"

/**
 * The event column — Figma node `173:10082`.
 *
 * The terms contents column's rows (`ui/SideTab`, D32/D43) doing a different
 * job: each names one event and opens that event's own page (`523:9831`).
 *
 * **They filtered the page in place until 2026-09-07**, each a link to
 * `?event=` that re-rendered the archive with one album in it. That was D50's
 * call from the news archive applied again, and it was sound while the album
 * page did not exist. Now that it does, the two were the same request answered
 * two ways: pressing the album's heading arrow opened its page while pressing
 * its name in this column narrowed the archive, and the repo owner reported the
 * second as the label not working. One destination per event.
 *
 * "All Events" is the page this column is standing on, so it is marked current
 * and every other row is a link away from here.
 *
 * The tabs are the albums themselves rather than a written list. Figma names
 * five (`156:7220` and its siblings) and they are the four albums plus "All
 * Events" — but a written list would print a tab for an event whose pictures
 * have been unfiled, and hide one whose pictures have just arrived.
 */
defineProps<{ albums: GalleryAlbum[] }>()
</script>

<template>
  <!-- No heading above the list: Figma gives this column none, unlike the terms
       contents with its "Table of Contents" line. -->
  <UiSideTabList :label="GALLERY_COPY.filterLabel">
    <UiSideTab href="/gallery" :active="true">
      {{ GALLERY_COPY.allTab }}
    </UiSideTab>

    <UiSideTab
      v-for="album in albums"
      :key="album.id"
      :href="`/gallery/${album.slug}`"
      :active="false"
    >
      {{ album.title }}
    </UiSideTab>
  </UiSideTabList>
</template>
