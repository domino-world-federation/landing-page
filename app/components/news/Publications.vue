<script setup lang="ts">
import { getResources } from "~/lib/api/client"
import { DOCUMENT_CATEGORY } from "~/lib/api/categories"
import { NEWS_PUBLICATIONS_COPY } from "~/content/news/documents"

/**
 * The publications shelf — Figma node `1010:2742` (was `168:8582`).
 *
 * The press shelf drawn a second time: the design now files publications as the
 * same 560-wide card, a date over a title with the file pill on the right. It
 * used to draw a 560×488 tile with the document's cover bled behind it; that
 * revision is gone from the file, and with it the only reason `coverImageUrl`
 * existed (D77 supersedes D51's last clause).
 *
 * Unlike the press shelf this one has no link under its heading. That is the
 * design's doing (`1010:2743` holds the title alone) and it is left alone:
 * there is no publications archive drawn anywhere in the file to link to.
 */
const { data: publications } = await useAsyncData(
  "news-publications",
  () => getResources(DOCUMENT_CATEGORY.reports),
  { default: () => [] },
)
</script>

<template>
  <NewsDocumentShelf
    v-if="publications.length > 0"
    id="publications"
    :heading="NEWS_PUBLICATIONS_COPY.heading"
  >
    <UiDocumentCard
      v-for="publication in publications"
      :key="publication.id"
      :document="publication"
      :download-label="NEWS_PUBLICATIONS_COPY.downloadLabel"
    />
  </NewsDocumentShelf>
</template>
