<script setup lang="ts">
import type { GalleryItem } from "~/lib/api/types"
import { NEWS_GALLERY_COPY } from "~/content/news/gallery"

/**
 * One picture in the media collage — `168:8689` (video) or `168:8696`
 * (photograph).
 *
 * Both are 400 wide; the video is the column's full 600 and a photograph is 292,
 * so two of them plus the 16px gutter come to the same height.
 *
 * **It is a button now, and it was a `<figure>` before.** The earlier note here
 * said a tile could not be a control because there is nothing to play (B2) and a
 * play button that did nothing would be the silent no-op D28 rules out. That
 * argument still holds for PLAYING. It never applied to looking: pressing a tile
 * opens the picture at full size in the viewer, which is a real thing that
 * happens, and it is the only way to see a 400px crop whole. The badge stays
 * decoration — it marks the films, and the viewer says the film itself is not up
 * yet.
 *
 * `<figure>`/`<figcaption>` went with the change: a button may only contain
 * phrasing content, so the caption that named the tile is now the button's
 * `aria-label`. Assistive tech gets the same sentence either way, and now it
 * also gets told the thing is pressable.
 */
defineProps<{ item: GalleryItem; tall: boolean }>()

const emit = defineEmits<{ press: [] }>()
</script>

<template>
  <button
    type="button"
    :aria-label="
      item.kind === 'video'
        ? NEWS_GALLERY_COPY.videoLabel.replace('%s', item.title)
        : item.title
    "
    :class="
      cn(
        'group focus-visible:ring-gold relative w-full cursor-pointer overflow-hidden rounded-[var(--radius-glass)] focus-visible:ring-2 focus-visible:outline-none',
        tall ? 'aspect-[400/600]' : 'aspect-[400/292]',
      )
    "
    @click="emit('press')"
  >
    <!-- The lift on hover is a `scale` on the picture inside a box that already
         clips, so nothing reflows and only the composited layer moves
         (RULES §12). -->
    <NuxtImg
      :src="item.imageUrl"
      :alt="item.imageAlt"
      :sizes="imageSizes({ xs: '70vw', lg: '400px' })"
      class="absolute inset-0 size-full scale-100 object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />

    <!-- `168:8691`: a 96px white disc dead centre with a 47px play glyph inside
         it. Hidden from assistive tech — the button's own label already says
         this is a film, and the disc is not a second control. -->
    <span
      v-if="item.kind === 'video'"
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
  </button>
</template>
