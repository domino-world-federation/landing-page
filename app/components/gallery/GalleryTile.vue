<script setup lang="ts">
import type { GalleryItem } from "~/lib/api/types"
import { GALLERY_COPY } from "~/content/gallery"

/**
 * One picture in a collage — Figma nodes `156:7244` (a video column) and
 * `156:7261` (a photograph).
 *
 * A video takes both rows of the grid and carries a 96px play disc; a photograph
 * takes one. **The play badge is decoration** — there is nothing to play (B2),
 * so the tile is a `<figure>` rather than a control, because a play button that
 * does nothing is the silent no-op D28 ruled out. The caption tells a screen
 * reader the tile stands for a video without promising it a button.
 *
 * `more` marks the one tile Figma overlays with a round arrow (`156:7263`) — the
 * affordance that opens the album.
 */
const props = defineProps<{
  item: GalleryItem
  /** The album this tile's "more" badge opens, when it carries one. */
  more?: { href: string; label: string }
}>()

const isVideo = computed(() => props.item.kind === "video")
</script>

<template>
  <!-- A video column spans both rows — that is what makes the collage alternate
       tall and short down the row rather than being a plain grid. -->
  <figure
    :class="
      cn(
        'group relative overflow-hidden rounded-[var(--radius-glass)]',
        isVideo && 'row-span-2',
      )
    "
  >
    <!-- **A video tile plays the film; it does not print a picture of one.**
         `imageUrl` carries whatever file the federation filed, and for a video
         that is an `.mp4` or `.webm` — so this was `<img src="…mp4">` and drew
         a broken-image icon on the collage. The name is the API's and stays as
         it is; what changes is that the tile asks what KIND it is before
         choosing an element.

         `controls`, and therefore no painted play disc: Figma draws one
         (`156:7246`) because the design had no film to play, and two play
         buttons over one frame — one real, one decoration — is worse than the
         design being followed exactly.

         `preload="metadata"` so the tile shows the first frame and its length
         without pulling the whole file; a gallery is a page of many, and
         `preload="auto"` on twelve tiles is twelve films downloaded by someone
         who came to look at photographs. -->
    <video
      v-if="isVideo"
      :src="item.imageUrl"
      class="absolute inset-0 size-full object-cover"
      controls
      playsinline
      preload="metadata"
    />
    <NuxtImg
      v-else
      :src="item.imageUrl"
      :alt="item.imageAlt"
      :sizes="imageSizes({ xs: '50vw', lg: '25vw' })"
      class="absolute inset-0 size-full object-cover"
    />

    <figcaption v-if="isVideo" class="sr-only">
      {{ GALLERY_COPY.videoLabel.replace("%s", item.title) }}
    </figcaption>

    <!-- `156:7263`: a 72px white disc with a 36px arrow, offset centre. Unlike
         the play badge this one IS a control — it opens the album — so it is a
         real link with a name, not decoration. -->
    <NuxtLink
      v-if="more"
      :to="more.href"
      :aria-label="more.label"
      class="focus-visible:ring-gold absolute top-1/2 left-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white transition-transform duration-200 group-hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none lg:size-18"
    >
      <!-- The shared glyph points LEFT; +135° turns it up-and-right, the "opens
           something" arrow. Drawn dark already, and this sits on the white
           disc. -->
      <img
        src="/assets/global/icon-arrow-left.svg"
        alt=""
        width="36"
        height="36"
        class="size-5 rotate-135 lg:size-9"
      >
    </NuxtLink>
  </figure>
</template>
