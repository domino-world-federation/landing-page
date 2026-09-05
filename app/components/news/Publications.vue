<script setup lang="ts">
import { getResources } from "~/lib/api/client"
import { DOCUMENT_CATEGORY } from "~/lib/api/categories"
import { NEWS_PUBLICATIONS_COPY } from "~/content/news/documents"

/**
 * The publications shelf — Figma node `168:8582`.
 *
 * The press shelf's layout with a taller card: the document's cover fills it and
 * a white bar across the foot carries the date, the title and the file pill.
 * Same entity, same call — only the cover and the height differ, which is why
 * `coverImageUrl` is a field on `ResourceDocument` rather than a type of its
 * own.
 *
 * Unlike the press shelf this one has no link under its heading. That is the
 * design's doing (`168:8583` holds the title alone) and it is left alone: there
 * is no publications archive drawn anywhere in the file to link to.
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
    <NewsPublicationCard
      v-for="publication in publications"
      :key="publication.id"
      :publication="publication"
    />
  </NewsDocumentShelf>
</template>
