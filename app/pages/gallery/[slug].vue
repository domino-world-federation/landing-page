<script setup lang="ts">
import { getGalleryAlbums } from "~/lib/api/client"
import { GALLERY_COPY } from "~/content/gallery"

/**
 * `/gallery/[slug]` — Figma screen `523:9831`.
 *
 * One event's pictures, and nothing else on the screen: the site's header band
 * carrying a back link and the album's title, then the whole collage at full
 * width.
 *
 * **Its own route rather than another `?event=`.** The index already filters in
 * place, and that filter stays — the event column beside it is how a reader
 * moves between events without leaving the archive. This is the other half of
 * the design: a page ABOUT one album, which can be linked, shared and given its
 * own title and description, where the index's filtered state is a view of the
 * archive that happens to be narrowed.
 *
 * The collage is the album section's, opened up. Figma gives the first tile
 * 872 × 642 (`523:9901`) — two columns and two rows of the same 428 × 312 grid —
 * and leaves the rest as they fall, so the only difference from the index's
 * collage is that one tile and the absence of a heading over it.
 */
const route = useRoute()
const slug = computed(() => String(route.params.slug))

/**
 * `getGalleryAlbums` filtered to one, not a fetch of all and a find here.
 *
 * The endpoint takes `?event=`, and a page that sifted the archive itself would
 * download every photograph the federation has ever filed in order to show one
 * event's — the same reasoning RULES §8 gives everywhere else.
 */
const { data: album } = await useAsyncData(
  () => `gallery-album-${slug.value}`,
  async () => (await getGalleryAlbums(slug.value))[0] ?? null,
  { watch: [slug] },
)

// A slug the archive does not hold is a 404, not an empty collage under a blank
// title. The index answers `?event=` with a line of copy because the event
// column is still on the screen and the reader can get out; here there would be
// nothing on the page at all.
if (!album.value) {
  throw createError({
    statusCode: 404,
    statusMessage: GALLERY_COPY.empty,
    fatal: true,
  })
}

useSeoMeta({
  title: () => `${album.value?.title ?? "Gallery"} | Domino World Federation`,
  description: () =>
    GALLERY_COPY.detail.description.replace("%s", album.value?.title ?? ""),
})

const items = computed(() => album.value?.items ?? [])

const viewerOpen = ref(false)
const viewerIndex = ref(0)

function openViewer(index: number): void {
  viewerIndex.value = index
  viewerOpen.value = true
}
</script>

<template>
  <main v-if="album">
    <!-- The band the terms and all-news screens use, with the album's title in
         it. `title` takes one line: an event's name is data and cannot be split
         into the design's lines the way a page's own heading can. -->
    <UiPageHeader
      :title="[album.title]"
      :back="{
        label: GALLERY_COPY.detail.back,
        href: GALLERY_COPY.detail.backHref,
      }"
    >
      <template #meta>
        <time
          v-if="album.heldOn"
          :datetime="album.heldOn"
          class="font-sans text-[length:var(--text-body-sm)] leading-8 font-medium text-[#aaaaaa]"
        >
          {{ formatLongDate(album.heldOn) }}
        </time>
      </template>
    </UiPageHeader>

    <!-- `80px 80px 0` in the design (`523:9895`), and the same grid the index's
         collage draws: 428 × 312 cells, a video over two rows, `dense` so a
         picture backfills the gap a taller neighbour leaves instead of the gap
         staying open. -->
    <div class="px-5 pb-16 md:px-10 lg:px-20 lg:pb-24">
      <div
        class="grid grid-cols-2 gap-4 [grid-auto-flow:row_dense] [grid-auto-rows:clamp(7rem,15.2vw,292px)] lg:grid-cols-4"
      >
        <GalleryTile
          v-for="(item, index) in items"
          :key="item.id"
          :item="item"
          :feature="index === 0"
          @press="openViewer(index)"
        />
      </div>
    </div>

    <!-- The album's own viewer, as on the index: the arrows walk THIS album's
         pictures and stop at its ends. -->
    <NewsMediaLightbox
      v-model:open="viewerOpen"
      v-model:index="viewerIndex"
      :items="items"
    />
  </main>
</template>
