<script setup lang="ts">
import type { GalleryItem } from "~/lib/api/types"
import { NEWS_GALLERY_COPY } from "~/content/news/gallery"

/**
 * One picture in the media collage — `168:8689` (video) or `168:8696`
 * (photograph).
 *
 * Both are 400 wide; the video is the column's full 600 and a photograph is 292,
 * so two of them plus the 16px gutter come to the same height.
 */
defineProps<{ item: GalleryItem; tall: boolean }>()
</script>

<template>
  <figure
    :class="
      cn(
        'relative w-full overflow-hidden rounded-[var(--radius-glass)]',
        tall ? 'aspect-[400/600]' : 'aspect-[400/292]',
      )
    "
  >
    <NuxtImg
      :src="item.imageUrl"
      :alt="item.imageAlt"
      :sizes="imageSizes({ xs: '70vw', lg: '400px' })"
      class="absolute inset-0 size-full object-cover"
    />

    <template v-if="item.kind === 'video'">
      <!-- `168:8691`: a 96px white disc dead centre with a 47px play glyph
           inside it. Hidden from assistive tech — the caption below says what it
           means, and this is not something that can be pressed. -->
      <span
        aria-hidden
        class="pointer-events-none absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white lg:size-24"
      >
        <!-- Drawn in `#0E0E0E`, and this sits on the white disc, so no
             `invert`. -->
        <img
          src="/assets/news/icon-play.svg"
          alt=""
          width="47"
          height="47"
          class="size-8 translate-x-0.5 lg:size-12"
        >
      </span>

      <figcaption class="sr-only">
        {{ NEWS_GALLERY_COPY.videoLabel.replace("%s", item.title) }}
      </figcaption>
    </template>
  </figure>
</template>
