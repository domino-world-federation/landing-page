<script setup lang="ts">
import { getGalleryItems } from "~/lib/api/client"
import type { GalleryItem } from "~/lib/api/types"
import { NEWS_GALLERY_COPY } from "~/content/news/gallery"

/**
 * The media collage — Figma node `168:8680`.
 *
 * A gold-free picture desk: tall video tiles among photographs.
 *
 * **A wrapping grid, not a horizontal scroller.** Figma pads the section
 * `80px 0 0 80px` and lets five 400px columns run past the right edge, which was
 * reproduced as a sideways scroller so the cut-off pictures stayed reachable.
 * Two things were wrong with it and the owner named both: a rail that scrolls
 * sideways inside a page that scrolls down hides most of the collage behind a
 * gesture nobody makes, and the hand-built columns left a hole.
 *
 * The hole was the columns themselves. Pictures were paired into columns of two
 * here in script, so a video — or a photograph that arrived after one — started
 * a fresh column and any column that never got its second picture stayed half
 * empty with the collage carrying on to the right of it. `grid-auto-flow: dense`
 * is the same arrangement without the bookkeeping: a video takes two rows, a
 * photograph one, and a later picture backfills a gap an earlier one left
 * instead of the gap staying open.
 *
 * A short LAST row is left alone. That is a grid ending, not a hole — every
 * picture before it is placed, and trimming the feed to a whole number of rows
 * would drop pictures to tidy a corner.
 *
 * **Pressing a tile opens it.** The collage crops every picture into a 400px
 * column, so without a viewer there is no way to see one whole; `MediaLightbox`
 * is that viewer and the tiles are the buttons that raise it. The play badge is
 * still decoration — there is nothing to stream (B2) and the viewer says so.
 *
 * **Two pages draw this block.** The tournament page repeats it under its own
 * gold heading (`381:17695`) — the same collage, the same desk, the same link to
 * `/gallery`. Only the heading's colour and the page's snapping differ, so those
 * are the only things this takes as props: forking the component to change a
 * class would give the site two picture desks that have to be kept in step by
 * hand (D32/D43).
 *
 * **A third page narrows it.** `/tournaments/[slug]` passes `tournamentId`, and
 * the collage shows only that tournament's pictures. It used to show the whole
 * desk under one event's name. `/news` and `/tournaments` pass nothing and keep
 * showing everything, which is what those pages are for. A tournament with no
 * pictures gets an empty feed and the section hides itself, like every other
 * empty block on this site — it does not fall back to the whole desk.
 */
const props = withDefaults(
  defineProps<{
    /**
     * The news page sets the heading in white; the tournament page uses the gold
     * gradient its other headings take.
     */
    headingTone?: "white" | "gold"
    /**
     * The tournament page scrolls section by section, so this block is one stop
     * on it: a screen tall, and holding its content clear of the fixed navbar.
     * The news page scrolls normally and wants neither — a band that claimed a
     * whole screen there would put a gap in a page that has none.
     */
    snap?: boolean
    /**
     * Narrows the collage to one tournament's pictures. Left out, it shows the
     * whole picture desk.
     */
    tournamentId?: string
    /**
     * Sends the "see all" arrow to this album (`/gallery/{albumSlug}`) instead
     * of the whole archive. The tournament detail page passes its own album:
     * its collage holds only that tournament's pictures, so the arrow beside it
     * taking the reader to every picture the federation has was a non sequitur.
     */
    albumSlug?: string
  }>(),
  { headingTone: "white", snap: false, tournamentId: undefined, albumSlug: undefined },
)

const seeAllHref = computed(() =>
  props.albumSlug
    ? `/gallery/${encodeURIComponent(props.albumSlug)}`
    : NEWS_GALLERY_COPY.seeAllHref,
)

/*
 * The key carries the tournament, and it has to. `useAsyncData` caches by key
 * across client-side navigation: with one fixed key, going from `/tournaments`
 * to a tournament's page would serve the whole desk from cache, and going
 * between two tournaments would show the first one's pictures on the second.
 */
const { data: items } = await useAsyncData(
  () =>
    props.tournamentId === undefined
      ? "news-gallery-items"
      : `tournament-gallery-items-${props.tournamentId}`,
  () => getGalleryItems({ tournament: props.tournamentId }),
  { default: () => [], watch: [() => props.tournamentId] },
)

/**
 * The viewer's state.
 *
 * `index` is into the feed as the API sent it, which is the order the collage
 * reads in. Dense packing can move a picture into an earlier gap on screen; the
 * arrows still walk the feed's own order, because a viewer that followed the
 * grid's backfilling would step in an order nobody can predict from looking.
 */
const viewerOpen = ref(false)
const viewerIndex = ref(0)

function openViewer(item: GalleryItem) {
  const found = items.value.findIndex((candidate) => candidate.id === item.id)
  if (found < 0) return

  viewerIndex.value = found
  viewerOpen.value = true
}
</script>

<template>
  <section
    v-if="items.length > 0"
    aria-labelledby="gallery-heading"
    :class="
      cn(
        // Padded on both sides now. The missing right padding was the bleed —
        // it existed so the collage could run off the edge into the scroller,
        // and a grid that ends inside the page wants the same margin the rest
        // of the site keeps.
        'flex flex-col gap-8 px-5 py-10 md:px-10 lg:gap-10 lg:px-20 lg:py-[4.1667vw]',
        // A snap stop buys its own clearance, the way the rail above it does.
        // The heading is 76px of Bebas sitting at the top of the section, and
        // the navbar is fixed 112px of it — without this it opens underneath the
        // bar.
        snap && 'snap-screen justify-center pt-28 lg:pt-[var(--nav-clearance)]',
      )
    "
  >
    <!-- The heading rises into place, like Executive Boards' does. `MotionReveal`
         wraps the whole row rather than the `<h2>` alone so the arrow beside it
         travels with it instead of sitting still while the title moves. -->
    <MotionReveal
      :y="40"
      class="flex flex-wrap items-center gap-6 lg:gap-8"
    >
      <h2
        id="gallery-heading"
        :class="
          cn(
            'font-display w-fit text-[length:var(--text-display-statement)] leading-[1.08] uppercase',
            headingTone === 'gold'
              ? 'text-gold-gradient'
              : 'text-white',
          )
        "
      >
        {{ NEWS_GALLERY_COPY.heading }}
      </h2>

      <NuxtLink
        :to="seeAllHref"
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
    </MotionReveal>

    <!-- Four columns and a row height, the design's 400 × 292 written as a grid
         (`168:8696`); a video takes two rows and comes to the 600 Figma draws
         (`168:8689`). Two columns below `lg`, where four 400px tracks would be
         stripes.

         `dense` is what closes the holes: a photograph that cannot follow a
         video without leaving a gap is placed INTO the gap instead. It reorders
         what the eye sees against what the API sent, which is the trade — and
         for a collage of undated pictures under a "see all" arrow, an
         arrangement with no holes is worth more than an order nobody can read
         off the page anyway. -->
    <div
      class="grid grid-cols-2 gap-4 [grid-auto-flow:row_dense] [grid-auto-rows:clamp(7rem,15.2vw,292px)] lg:grid-cols-4"
    >
      <NewsMediaTile
        v-for="item in items"
        :key="item.id"
        :item="item"
        :tall="item.kind === 'video'"
        @press="openViewer(item)"
      />
    </div>

    <NewsMediaLightbox
      v-model:open="viewerOpen"
      v-model:index="viewerIndex"
      :items="items"
    />
  </section>
</template>
