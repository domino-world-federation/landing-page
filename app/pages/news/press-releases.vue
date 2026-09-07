<script setup lang="ts">
import { getResources } from "~/lib/api/client"
import { DOCUMENT_CATEGORY } from "~/lib/api/categories"
import { NEWS_PRESS_ARCHIVE_COPY, NEWS_PRESS_COPY } from "~/content/news/documents"

/**
 * `/news/press-releases` — the press archive.
 *
 * Where "View press archive" (`168:8478`) has always pointed. It carried
 * `href="#"` because the page did not exist, which is the silent no-op D28
 * rules out.
 *
 * **Not a screen in the file.** The design draws the shelf on the news page and
 * a link out of it, and stops. So this follows the shape the site already uses
 * for "the full list of what a section shows some of" — the header band with a
 * back link, then the same `ui/DocumentCard` the shelf draws, with nothing
 * holding the count down. Inventing a different treatment for the same
 * documents would give the federation two ways of drawing one card.
 *
 * **It renders its empty state rather than hiding.** The shelf on `/news` takes
 * itself off the page when the category is empty, which is right for a band
 * among other bands. It is wrong for a page: a reader who followed a link
 * called "View press archive" and got a title over nothing has been told the
 * page is broken. Here the page says there is nothing filed yet.
 */
useSeoMeta({
  title: "Press Release Archive | Domino World Federation",
  description: NEWS_PRESS_ARCHIVE_COPY.description,
})

// No limit: this is the archive, and `getResources` is already bounded by the
// endpoint's own cap. A number here would be a second, quieter cap that
// disagreed with it.
const { data: releases } = await useAsyncData(
  "news-press-archive",
  () => getResources(DOCUMENT_CATEGORY.press),
  { default: () => [] },
)
</script>

<template>
  <main>
    <UiPageHeader
      :title="NEWS_PRESS_ARCHIVE_COPY.title"
      :back="{
        label: NEWS_PRESS_ARCHIVE_COPY.back,
        href: NEWS_PRESS_ARCHIVE_COPY.backHref,
      }"
    />

    <div class="px-5 pb-16 md:px-10 lg:px-20 lg:pb-24">
      <p
        v-if="releases.length === 0"
        class="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60"
      >
        {{ NEWS_PRESS_ARCHIVE_COPY.empty }}
      </p>

      <!-- The shelf's own grid: 560-wide cards in a wrapping row, two abreast
           at the design width. Written here rather than reusing
           `news/DocumentShelf`, which pairs the cards with a gold heading in a
           column beside them — the heading on this page is the page's own
           title, in the band above. -->
      <div v-else class="flex w-full min-w-0 flex-wrap gap-4">
        <UiDocumentCard
          v-for="release in releases"
          :key="release.id"
          :document="release"
          :download-label="NEWS_PRESS_COPY.downloadLabel"
        />
      </div>
    </div>
  </main>
</template>
