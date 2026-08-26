<script setup lang="ts">
import type { ResourceDocument } from "~/lib/api/types"
import { NEWS_PUBLICATIONS_COPY } from "~/content/news/documents"

/**
 * One publication — `168:8591`.
 *
 * 560 × 488 with the cover bled to the edges. Figma draws the picture 720 tall
 * inside a 488 frame, i.e. the top two thirds of a portrait page, which is why
 * the crop is anchored to the top rather than centred: a document cover is
 * masthead-first, and centring it would frame the middle of a page of text.
 */
defineProps<{ publication: ResourceDocument }>()
</script>

<template>
  <article
    class="rounded-card relative flex aspect-[560/488] min-w-0 grow basis-[min(100%,560px)] flex-col justify-end overflow-hidden bg-white"
  >
    <!-- Empty alt: the title is printed on the card directly below, and the
         cover is a picture OF that title — describing it would say the same
         words twice. -->
    <NuxtImg
      v-if="publication.coverImageUrl"
      :src="publication.coverImageUrl"
      alt=""
      :sizes="imageSizes({ xs: '100vw', lg: '30vw' })"
      class="absolute inset-0 size-full object-cover object-top"
    />

    <!-- `168:8676` — a black mark at 10% sitting over the cover, a little above
         and right of centre. Decoration, so it is hidden. -->
    <img
      src="/assets/news/decor-publication-union.svg"
      alt=""
      aria-hidden
      width="231"
      height="250"
      class="pointer-events-none absolute top-[14.75%] left-[29.5%] w-[41.25%] opacity-10"
    >

    <!-- `relative` so the bar paints over the cover behind it. -->
    <div class="relative flex items-end justify-between gap-4 bg-white p-5">
      <div class="flex min-w-0 flex-col gap-2">
        <time
          v-if="publication.publishedAt"
          :datetime="publication.publishedAt"
          class="font-sans text-label-muted text-[length:var(--text-eyebrow)] leading-7 font-medium"
        >
          {{ formatShortDate(publication.publishedAt) }}
        </time>

        <h3
          class="font-display text-[length:var(--text-display-label)] leading-[1.22] text-black uppercase"
        >
          {{ publication.title }}
        </h3>
      </div>

      <UiDownloadPill
        :document="publication"
        :label="NEWS_PUBLICATIONS_COPY.downloadLabel"
      />
    </div>
  </article>
</template>
