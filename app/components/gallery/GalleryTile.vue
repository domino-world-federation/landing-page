<script setup lang="ts">
import type { GalleryItem } from "~/lib/api/types"
import { GALLERY_COPY } from "~/content/gallery"

/**
 * One picture in a collage — Figma nodes `156:7244` (a video column) and
 * `156:7261` (a photograph).
 *
 * A video takes both rows of the grid; a photograph takes one.
 *
 * **Both kinds are opened the same way, and that is the point.** A tile is a
 * 400px crop: a photograph is too small to read there and a film is too small
 * to watch there. Pressing either opens the viewer, where the picture is shown
 * whole and the film plays at the size of the window.
 *
 * An earlier pass gave the video `controls` and played it in place, on the
 * argument that a dialog would mean pressing play twice. It bought that with a
 * row of browser chrome shrunk onto a collage tile and a film playing in a
 * frame the size of a postcard. The play disc Figma draws (`156:7246`) is the
 * design's answer and it is a better one — the second press is the film
 * starting itself, not the reader pressing again.
 *
 * Figma overlays one tile with a round arrow that opens the album
 * (`156:7263`). NOT drawn: the heading above every album already carries that
 * arrow, and a second one sitting on a photograph reads as belonging to the
 * photograph — the badge was taken off at the owner's request 2026-09-07.
 */
const props = defineProps<{ item: GalleryItem }>()

/** Pressed on any tile — the album opens its viewer here. */
const emit = defineEmits<{ press: [] }>()

const isVideo = computed(() => props.item.kind === "video")

const pressLabel = computed(() =>
  (isVideo.value ? GALLERY_COPY.playVideo : GALLERY_COPY.openImage).replace(
    "%s",
    props.item.title,
  ),
)
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
    <!-- **A video tile shows the film's first frame; it does not print a
         picture of one.** `imageUrl` carries whatever file the federation
         filed, and for a video that is an `.mp4` or `.webm` — so this was
         `<img src="…mp4">` and drew a broken-image icon on the collage. The
         name is the API's and stays as it is; what changes is that the tile
         asks what KIND it is before choosing an element.

         No `controls`: the tile is a control itself, and a play button inside a
         button either steals the press or plays a film in a postcard. `muted`
         because a frame that is never played still must not be able to make
         noise, and `pointer-events-none` hands the whole frame to the button
         over it.

         `preload="metadata"` so the tile shows the first frame and its length
         without pulling the whole file; a gallery is a page of many, and
         `preload="auto"` on twelve tiles is twelve films downloaded by someone
         who came to look at photographs. -->
    <video
      v-if="isVideo"
      :src="item.imageUrl"
      class="pointer-events-none absolute inset-0 size-full object-cover"
      playsinline
      muted
      preload="metadata"
    />
    <NuxtImg
      v-else
      :src="item.imageUrl"
      :alt="item.imageAlt"
      :sizes="imageSizes({ xs: '50vw', lg: '25vw' })"
      class="absolute inset-0 size-full object-cover"
    />

    <!-- **An overlay, not the tile itself.** The `<figure>` stays a figure so
         the picture keeps its own element; the press is this button's, laid
         over the whole frame. -->
    <button
      type="button"
      :aria-label="pressLabel"
      class="focus-visible:ring-gold absolute inset-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-inset focus-visible:outline-none"
      @click="emit('press')"
    />

    <!-- `156:7246`: a white disc dead centre with a play glyph inside it.
         Hidden from assistive tech — the button's own label already says this
         is a film, and the disc is not a second control. `pointer-events-none`
         because it is painted OVER the button: without it the press aimed at
         the disc would land on the disc and stop there. -->
    <span
      v-if="isVideo"
      aria-hidden
      class="pointer-events-none absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-transform duration-200 group-hover:scale-105 lg:size-24"
    >
      <!-- Drawn in `#0E0E0E`, and this sits on the white disc, so no `invert`.
           Nudged right by half a pixel: a triangle's optical centre is left of
           its bounding box, so a centred one reads as sitting too far left. -->
      <img
        src="/assets/news/icon-play.svg"
        alt=""
        width="47"
        height="47"
        class="size-8 translate-x-0.5 lg:size-12"
      >
    </span>
  </figure>
</template>
