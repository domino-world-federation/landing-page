<script setup lang="ts">
import type { GalleryAlbum } from "~/lib/api/types"
import { GALLERY_COPY } from "~/content/gallery"

/**
 * The event column — Figma node `173:10082`.
 *
 * The terms contents column's rows (`ui/SideTab`, D32/D43) doing a different
 * job: these are not positions within the page but filters over it, so each is a
 * link to `?event=` and the page re-renders with one album instead of four.
 *
 * That is D50's call from the news archive applied again, and for the same three
 * reasons: nothing here has to hydrate (RULES §5), a filtered gallery becomes a
 * URL somebody can send, and the filtering happens where RULES §8 wants it
 * rather than in a client island sifting the whole archive.
 *
 * The tabs are the albums themselves rather than a written list. Figma names
 * five (`156:7220` and its siblings) and they are the four albums plus "All
 * Events" — but a written list would print a tab for an event whose pictures
 * have been unfiled, and hide one whose pictures have just arrived.
 */
defineProps<{
  albums: GalleryAlbum[]
  /** The `?event=` slug, or `undefined` for "All Events". */
  active?: string
}>()
</script>

<template>
  <!-- No heading above the list: Figma gives this column none, unlike the terms
       contents with its "Table of Contents" line. -->
  <UiSideTabList :label="GALLERY_COPY.filterLabel">
    <UiSideTab href="/gallery" :active="active === undefined">
      {{ GALLERY_COPY.allTab }}
    </UiSideTab>

    <UiSideTab
      v-for="album in albums"
      :key="album.id"
      :href="`/gallery?event=${album.slug}`"
      :active="active === album.slug"
    >
      {{ album.title }}
    </UiSideTab>
  </UiSideTabList>
</template>
