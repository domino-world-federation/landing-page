<script setup lang="ts">
import { getGalleryItems } from "~/lib/api/client"
import type { GalleryItem } from "~/lib/api/types"
import { NEWS_GALLERY_COPY } from "~/content/news/gallery"

/**
 * The media collage — Figma node `168:8680`.
 *
 * A gold-free, full-width picture desk: tall video columns alternating with
 * pairs of stacked photographs, running off the right edge of the page. The
 * bleed is the design's — the section is padded `80px 0 0 80px`, with nothing on
 * the right — and five 400px columns with four 16px gutters come to 2064 against
 * the 1840 the left margin leaves, so the last column is cut by the viewport at
 * the design's own width. Reproduced as a scroller rather than a crop: the same
 * picture at the same size, with the rest reachable.
 *
 * **The play badge is decoration.** There is nothing to play (B2), so the tile
 * is a `<figure>` rather than a control — a play button that does nothing is
 * exactly the silent no-op D28 ruled out.
 *
 * **Two pages draw this block.** The tournament page repeats it under its own
 * gold heading (`381:17695`) — the same collage, the same desk, the same link to
 * `/gallery`. Only the heading's colour differs, so that is the only thing this
 * takes as a prop: forking the component to change one class would give the site
 * two picture desks that have to be kept in step by hand (D32/D43).
 */
withDefaults(
  defineProps<{
    /**
     * The news page sets the heading in white; the tournament page uses the gold
     * gradient its other headings take.
     */
    headingTone?: "white" | "gold"
  }>(),
  { headingTone: "white" },
)

const { data: items } = await useAsyncData(
  "news-gallery-items",
  () => getGalleryItems(),
  { default: () => [] },
)

/**
 * Groups the flat feed into the collage's columns: a video takes a column to
 * itself, photographs pair up two to a column.
 *
 * Done here rather than asked of the API, because it is a fact about this layout
 * and no other — the same pictures on a phone, or on the gallery page the
 * heading links to, group differently. A trailing photograph with no partner
 * simply gets a short column; the alternative, padding the feed to an even
 * count, would mean inventing a picture.
 */
const columns = computed<GalleryItem[][]>(() => {
  const out: GalleryItem[][] = []

  for (const item of items.value) {
    const last = out.at(-1)
    const canPair =
      item.kind === "photo" &&
      last !== undefined &&
      last.length === 1 &&
      last[0]!.kind === "photo"

    if (canPair) last!.push(item)
    else out.push([item])
  }

  return out
})
</script>

<template>
  <section
    v-if="items.length > 0"
    aria-labelledby="gallery-heading"
    class="flex flex-col gap-8 py-10 pl-5 md:pl-10 lg:gap-10 lg:py-[4.1667vw] lg:pl-20"
  >
    <div
      class="flex flex-wrap items-center gap-6 pr-5 md:pr-10 lg:gap-8 lg:pr-[8.3333vw]"
    >
      <h2
        id="gallery-heading"
        :class="
          cn(
            'font-display text-[length:var(--text-display-sm)] leading-[0.95] uppercase',
            headingTone === 'gold'
              ? 'bg-[image:var(--gradient-gold-text)] bg-clip-text text-transparent'
              : 'text-white',
          )
        "
      >
        {{ NEWS_GALLERY_COPY.heading }}
      </h2>

      <NuxtLink
        :to="NEWS_GALLERY_COPY.seeAllHref"
        :aria-label="NEWS_GALLERY_COPY.seeAll"
        class="focus-visible:ring-gold group flex size-12 items-center justify-center rounded-[var(--radius-btn)] focus-visible:ring-2 focus-visible:outline-none"
      >
        <!-- A 48px inline SVG sized in CSS. The shared glyph points LEFT; +135°
             turns it up-and-right. `invert` because it is drawn dark for use on
             white. -->
        <img
          src="/assets/global/icon-arrow-left.svg"
          alt=""
          width="48"
          height="48"
          class="size-12 rotate-135 invert transition-transform duration-200 group-hover:translate-x-0.5"
        >
      </NuxtLink>
    </div>

    <!-- The scroller. `pr-5` on the track so the last column has a margin to
         come to rest against instead of touching the viewport edge. -->
    <ul class="flex snap-x snap-mandatory gap-4 overflow-x-auto pr-5 md:pr-10 lg:pr-20">
      <!-- 400 of the design's 1920, with a floor so a tile stays a picture
           rather than a stripe on a phone. Never a share of the viewport: the
           collage is meant to run past the edge, and a percentage width would
           fit it inside instead. -->
      <li
        v-for="column in columns"
        :key="column[0]!.id"
        class="flex w-[min(70vw,400px)] shrink-0 snap-start flex-col gap-4"
      >
        <!-- A lone video fills the column; a pair of photographs splits it. Both
             come to the design's 600. -->
        <NewsMediaTile
          v-for="item in column"
          :key="item.id"
          :item="item"
          :tall="item.kind === 'video'"
        />
      </li>
    </ul>
  </section>
</template>
