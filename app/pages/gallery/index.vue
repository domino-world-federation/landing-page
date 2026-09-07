<script setup lang="ts">
import { getGalleryAlbums } from "~/lib/api/client"

/**
 * `/gallery` — Figma screen `156:7154`.
 *
 * The archive: every album in order, with a column beside it naming the events.
 *
 * **It used to filter itself with `?event=`** — each row in the event column
 * was a link that re-rendered this page with one album in it, D50's call from
 * the news archive. That went out with the album page (`523:9831`): the same
 * request had two answers, because pressing an album's heading arrow opened its
 * own page while pressing its name in the column narrowed the archive instead.
 * The column's rows are links to the album pages now, and this page is the
 * archive and nothing else.
 *
 * The layout is written out here rather than taken from `ui/SideTabLayout`,
 * because this page's content column carries its own 16/24 stack of albums —
 * the shared component covers the pages whose bodies are one block.
 */
useSeoMeta({
  title: "Gallery | Domino World Federation",
  description:
    "Photographs and films from Domino World Federation events — world championships, continental masters, and the federation's own documentaries.",
})

const { data: albums } = await useAsyncData(
  "gallery-albums",
  () => getGalleryAlbums(),
  { default: () => [] },
)
</script>

<template>
  <main>
    <GalleryHeader />

    <!-- 468 + 1452 at the design width. The event column comes SECOND in the
         source and is pulled back with `order` above `lg`, so a reader on a
         phone — and a screen reader on any width — meets the pictures before the
         index of them. -->
    <div
      class="flex flex-col gap-10 px-5 pb-16 md:px-10 lg:flex-row lg:items-start lg:gap-12 lg:px-20 lg:pb-24"
    >
      <div class="flex flex-col gap-10 lg:order-first lg:w-[388px] lg:shrink-0">
        <!-- Sticky so the event list stays reachable through an archive that is
             4827px tall at the design width. `top` clears the navbar; `max-h`
             with its own scroll keeps the column usable on a short window. -->
        <div
          class="flex flex-col gap-10 lg:sticky lg:top-[var(--anchor-offset)] lg:max-h-[calc(100dvh-var(--anchor-offset)-2rem)] lg:overflow-y-auto"
        >
          <GalleryEventTabs :albums="albums" />
          <UiSupportCard />
        </div>
      </div>

      <div class="flex min-w-0 flex-1 flex-col gap-16 lg:gap-24">
        <GalleryAlbumSection
          v-for="album in albums"
          :key="album.id"
          :album="album"
        />
      </div>
    </div>
  </main>
</template>
