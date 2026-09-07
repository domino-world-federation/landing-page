<script setup lang="ts">
import type { GalleryAlbum } from "~/lib/api/types"
import { GALLERY_COPY } from "~/content/gallery"

/**
 * One event's pictures — Figma node `156:7235` and its three siblings.
 *
 * A date, a Bebas heading with an arrow beside it, then the album itself. The
 * album takes one of two shapes and neither is a field in the data: several
 * pictures make a collage, and exactly one is that picture at full width
 * (`156:7330`). Derived from the count, because a layout name in the API would
 * be the backend deciding how a page looks.
 *
 * The arrow and the round badge over the second tile both open the album, and
 * both are hidden once the page is already filtered to it — a link to the page
 * you are standing on is the silent no-op D28 ruled out.
 */
const props = defineProps<{
  album: GalleryAlbum
  /** False once `?event=` has narrowed the page to this album. */
  showOpen: boolean
}>()

const headingId = computed(() => `album-${props.album.slug}`)
const href = computed(() => `/gallery?event=${props.album.slug}`)
const openLabel = computed(() =>
  GALLERY_COPY.openAlbum.replace("%s", props.album.title),
)

const viewerOpen = ref(false)
const viewerIndex = ref(0)

/**
 * Opens the viewer on one picture.
 *
 * The index is the tile's position in the album, so the arrows carry on from
 * where the reader entered rather than from the first picture — which is the
 * difference between a viewer and a slideshow that has to be scrubbed back to
 * the place you already were.
 */
function openViewer(index: number): void {
  viewerIndex.value = index
  viewerOpen.value = true
}

const feature = computed(() =>
  props.album.items.length === 1 ? props.album.items[0] : undefined,
)

/**
 * Names the button over a single-picture album.
 *
 * "Play" for a film and "Open" for a photograph — the press does the same thing
 * either way, but a reader who cannot see the dialog appear needs the verb to
 * describe what they will actually get.
 */
const featureLabel = computed(() => {
  const item = feature.value
  if (!item) return ""

  const template =
    item.kind === "video" ? GALLERY_COPY.playVideo : GALLERY_COPY.openImage

  return template.replace("%s", item.title)
})
</script>

<template>
  <section :aria-labelledby="headingId" class="flex flex-col gap-6 lg:gap-10">
    <div class="flex flex-col gap-4">
      <!-- Inter Medium 24/32 in `#616161` (`156:7237`). -->
      <!-- Dicetak hanya kalau tanggalnya ada: `<time>` tanpa `datetime` bukan
           `<time>`, dan baris kosong di atas judul album membaca seperti sesuatu
           yang gagal dimuat. -->
      <time
        v-if="album.heldOn"
        :datetime="album.heldOn"
        class="font-sans text-muted text-[length:var(--text-body-sm)] leading-8 font-medium"
      >
        {{ formatLongDate(album.heldOn) }}
      </time>

      <div class="flex flex-wrap items-center gap-4 lg:gap-8">
        <!-- Bebas 76/72. `uppercase` is the heading's, not the string's (D40) —
             Figma types three of the four in lower case. -->
        <h2
          :id="headingId"
          class="font-display text-[length:var(--text-display-sm)] leading-[0.95] text-white uppercase"
        >
          {{ album.title }}
        </h2>

        <NuxtLink
          v-if="showOpen"
          :to="href"
          :aria-label="openLabel"
          class="focus-visible:ring-gold group flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-btn)] focus-visible:ring-2 focus-visible:outline-none"
        >
          <!-- A 48px inline SVG sized in CSS. The shared glyph points LEFT;
               +135° turns it up-and-right. `invert` because it is drawn dark for
               use on white. -->
          <img
            src="/assets/global/icon-arrow-left.svg"
            alt=""
            width="48"
            height="48"
            class="size-12 rotate-135 invert transition-transform duration-200 group-hover:translate-x-0.5"
          >
        </NuxtLink>
      </div>
    </div>

    <!-- `156:7330` — 1292 × 726, the only album drawn as one picture. -->
    <div
      v-if="feature"
      class="relative aspect-[1292/726] w-full overflow-hidden rounded-[var(--radius-glass)]"
    >
      <!-- Same split as the collage tile: a film shows its first frame here and
           is played in the viewer. See `gallery/GalleryTile` for why the disc
           replaced the controls. -->
      <video
        v-if="feature.kind === 'video'"
        :src="feature.imageUrl"
        class="pointer-events-none absolute inset-0 size-full object-cover"
        playsinline
        muted
        preload="metadata"
      />
      <NuxtImg
        v-else
        :src="feature.imageUrl"
        :alt="feature.imageAlt"
        :sizes="imageSizes({ xs: '100vw', lg: '68vw' })"
        class="absolute inset-0 size-full object-cover"
      />

      <!-- The single-picture album opens the same viewer as a collage tile,
           whichever kind it holds. -->
      <button
        type="button"
        :aria-label="featureLabel"
        class="focus-visible:ring-gold group absolute inset-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-inset focus-visible:outline-none"
        @click="openViewer(0)"
      >
        <!-- The play disc, decoration inside the button that does the opening —
             the same arrangement as a collage tile's.

             **Only on a video.** This was drawn on whatever the album's single
             item happened to be, so a one-photograph album got a play button
             over a still. Figma draws this frame with a film in it
             (`156:7330`), which is what put the badge here unconditionally;
             `gallery/GalleryTile` and `news/MediaTile` both branch on `kind`
             and this one did not. -->
        <span
          v-if="feature.kind === 'video'"
          aria-hidden
          class="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-transform duration-200 group-hover:scale-105 lg:size-24"
        >
          <img
            src="/assets/news/icon-play.svg"
            alt=""
            width="47"
            height="47"
            class="size-8 translate-x-0.5 lg:size-12"
          >
        </span>
      </button>
    </div>

    <!-- Four columns, two rows, 16px gutters (`156:7243`). A video tile spans
         both rows, and the remaining photographs fall into the gaps by plain
         auto-placement — which reproduces Figma's arrangement exactly, so no
         cell is positioned by hand.

         The design's collage is 1648 wide against the 1452 its column allows, so
         at 1920 it runs off the right edge. NOT reproduced: bleeding a GRID
         leaves its fourth column permanently half-hidden, unlike the news page's
         strip which can be pushed. The grid fits the column instead — the
         composition, the gutters and the row height are the design's, and only
         the column width flexes, which is what a responsive grid does anyway.

         292/1920 = 15.2vw is the design's row height; the floor keeps a tile a
         picture rather than a stripe on a phone.

         A plain grid of figures rather than a `<ul>`: each tile would have to be
         a `<li display:contents>` for the figure inside it to be the grid item,
         and `display:contents` has a long history of dropping list semantics
         from the accessibility tree. A figure with alt text describes itself;
         the list adds nothing here. -->
    <div
      v-else
      class="grid grid-cols-2 gap-4 [grid-auto-rows:clamp(7rem,15.2vw,292px)] lg:grid-cols-4"
    >
      <!-- No "open the album" badge over a tile. Figma draws one on the second
           tile of the first album (`156:7263`), but the arrow beside the
           heading says the same thing without sitting on top of somebody's
           photograph — and a round arrow over a picture reads as belonging to
           the picture, not to the album. Taken off at the owner's request
           2026-09-07; `showOpen` still governs the heading's arrow. -->
      <GalleryTile
        v-for="(item, index) in album.items"
        :key="item.id"
        :item="item"
        @press="openViewer(index)"
      />
    </div>

    <!-- **The album owns its viewer, not the page.** The arrows step through
         THIS album's pictures; one viewer per page would step across album
         boundaries, so pressing the last photograph of 2024 and then Next would
         land in 2026 with no sign that anything changed but the pictures.

         `NewsMediaLightbox` already holds the native `<dialog>`, the focus trap,
         the arrows, the counter and Escape — it wants a list of pictures, which
         is exactly what an album is. Same reuse `ChampionsHall` makes. -->
    <NewsMediaLightbox
      v-model:open="viewerOpen"
      v-model:index="viewerIndex"
      :items="album.items"
    />
  </section>
</template>
