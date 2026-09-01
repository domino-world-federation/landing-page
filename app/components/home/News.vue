<script setup lang="ts">
import { getLatestNews } from "~/lib/api/client"
import { NEWS_ALT, NEWS_COPY } from "~/content/home/news"

/**
 * How far the photograph rides up as the section arrives, as a percentage of the
 * layer's own height — negative, so it moves AGAINST the scroll and the desk
 * lifts while the page comes down past it.
 *
 * Carried over from the section this one absorbed, where it was set at 14% after
 * an earlier 6% turned out to deliver 27px and read as nothing at all. It is
 * safer here than it was there: the layer now overhangs the frame's top edge by
 * 384px of its own accord, so the rise has real headroom to spend instead of
 * pulling its own top edge into view.
 */
const RISE = -14

/**
 * The width one full-size card occupies, as a fraction of the viewport.
 *
 * 28.125vw is 540/1920, so at the design width every tile renders at exactly its
 * Figma size and narrower windows scale the whole mosaic down with them rather
 * than overflowing (D14). The floor stops the cards collapsing to unreadable
 * slivers on a phone, where the strip is scrolled past rather than taken in at a
 * glance.
 */
const CARD_W = "w-[max(260px,28.125vw)]"

/** The square pair is 258/540 of a full card, less half the 24px gutter. */
const SQUARE_W = "w-[calc((max(260px,28.125vw)-0.625vw)/2)]"

/** Figma's 24px gutter between slots, which the arrow step has to know about. */
const GUTTER = 24

/**
 * S8 — Figma node `53:3067`. The news, photograph and all.
 *
 * **It used to be two sections and is now one.** The redraw draws a single
 * 1920 × 1080 frame holding the desk photograph, the sentence over it, a pair of
 * arrows and the card mosaic — where the build had a photograph-and-sentence
 * section (S7) with the strip pulled up into it by 200px from a section of its
 * own. That overlap was this page's way of making the two read as one thing;
 * with the design saying they ARE one thing, the overlap has nothing left to do
 * and both the negative margin and the second `<section>` are gone.
 *
 * **The wash is CSS again, not baked into the picture.** The old asset was the
 * design's own composite — photograph and fade flattened together and cropped to
 * a 1920 × 960 frame — and re-drawing the fade over it would have darkened the
 * foot twice, which is the trap `feature-hq-composite.png` hit. The redraw
 * separates them: `53:3068` is the raw photograph and `561:13218` is a
 * `rgba(14,14,14,0) → rgba(14,14,14,1)` gradient over the whole frame, opaque by
 * 45%. So the picture goes in raw and the gradient is a layer here, which is
 * also what makes the frame's new 1080 height reachable — the old composite was
 * cropped to 960 and could not be stretched to it without pulling the fade off
 * the foot.
 *
 * The photograph is placed exactly as Figma places it: 1920 × 1464 at `y:-384`,
 * i.e. overhanging the frame's top by 384 and meeting its foot. Written as
 * percentages of the section so the overhang scales with it rather than eating a
 * fixed 384px out of a short mobile frame.
 *
 * **The strip is driven, not driving.** It was a marquee travelling at ~39px/s
 * on a 75-second lap; the redraw puts a pair of arrows in the header
 * (`673:1454`), and an arrow on a strip that moves by itself is two things
 * fighting for the same track. So the marquee is gone and the row is a native
 * horizontal scroller: touch and trackpad get the gesture they already expect, a
 * keyboard reaches every card by tabbing into it, and the arrows sit over the
 * top as a convenience. It is the same construction `/tournaments` uses for its
 * card rows, and for the same reasons — a transform carousel would have had to
 * reimplement all three.
 *
 * The composition is not a uniform row. Five slots are 540×700, and the fourth
 * is a stacked column — a 540×418 card above two 258×258 squares side by side —
 * which is what keeps the strip from reading as a plain filmstrip. Sizes come
 * from `NewsCard`; the arrangement lives here.
 */
const { data: articles } = await useAsyncData(
  "home-news",
  () => getLatestNews(),
  { default: () => [] },
)

// The mosaic needs seven slots and the API's `limit` is a request, not a
// guarantee — a short response would silently drop a tile. Reading each slot by
// index and rendering it only when it is there keeps the section rendering on
// whatever the feed actually returned.
const slot = (i: number) => articles.value[i]

const track = useTemplateRef<HTMLDivElement>("track")

// What the CONTROLS need, and nothing more: whether either end has been reached.
// Read off the scroller rather than driving it, so the arrows cannot disagree
// with where the row actually is.
const atStart = ref(true)
const atEnd = ref(false)

function measure() {
  const el = track.value
  if (!el) return

  const scrollable = el.scrollWidth - el.clientWidth

  atStart.value = el.scrollLeft <= 1
  // A row that fits needs no arrows at all: `scrollable` is 0, so both ends read
  // as reached and both controls leave the tab order.
  atEnd.value = scrollable <= 1 || el.scrollLeft >= scrollable - 1
}

onMounted(() => {
  const el = track.value
  if (!el) return

  measure()

  // A `ResizeObserver` as well as the scroll listener: both measurements change
  // when the window does, and a scroll event never fires for a resize.
  const observer = new ResizeObserver(measure)
  observer.observe(el)

  onBeforeUnmount(() => observer.disconnect())
})

/** One slot plus its gutter, so a press lands the next card at the edge. */
function step(direction: 1 | -1) {
  const el = track.value
  if (!el) return

  const card = el.firstElementChild as HTMLElement | null
  const distance = card ? card.offsetWidth + GUTTER : el.clientWidth

  el.scrollBy({ left: distance * direction, behavior: "smooth" })
}
</script>

<template>
  <!-- No fixed height, unlike the sections built on a Figma ratio. At the design
       width the contents stack to 1012 of the frame's 1080 — 140 above the
       header, its 108, 64 to the mosaic and the mosaic's 700, with the frame's
       own tail below — and letting them add up rather than pinning a height is
       what keeps a taller card or a wrapped title from being clipped. The
       background layers are placed as percentages of whatever that comes to, so
       the composition holds either way.

       `isolate` keeps the two negative z-indexes below from escaping into the
       page's root stacking context and sliding behind the page background
       itself. -->
  <section
    aria-labelledby="news-heading"
    class="relative isolate snap-start snap-always overflow-hidden pb-16 lg:pb-0"
  >
    <!-- Figma's 1920 × 1464 at `y:-384` against a 1080 frame: 384/1080 of
         overhang above, 1464/1080 of height. -->
    <MotionParallaxLayer
      :speed="RISE"
      anchor="foot"
      decorative
      class="absolute inset-x-0 top-[-35.556%] -z-20 h-[135.556%]"
    >
      <!-- Full-bleed: the picture always spans the viewport, so every candidate
           is the viewport's own width — see the note on `imageSizes` for why
           this is not written as a bare `100vw`.

           **The file is greyscale, and the desaturation is baked rather than
           filtered.** Figma's node data reports no filter on this fill, but its
           render is unambiguous: every pixel of the desk comes back R=G=B
           (80,80,80 · 34,34,34 · 70,70,70) while the news cards below it are in
           full colour. So the picture is monochrome by design, and the only
           question was where to do it. A CSS `grayscale(1)` would have been the
           obvious answer and is the wrong one here: this project has already
           measured what a `filter` costs an image layer — it forces the layer to
           a texture of its own and drops the extra pixels a high-DPI screen
           would otherwise get, which is what made the hero tile read as "less
           HD". Converting the asset avoids the rasterisation entirely, and takes
           the file from 747 KB to 512 KB on the way.

           The `-mono` in the name is not decoration. The colour version shipped
           first under the plain name, and replacing the file in place left every
           cache holding a picture that no longer existed — same path, same `_ipx`
           URL, so browsers and the image pipeline both kept serving the old
           colour derivative and the section looked unchanged. A new name is a
           new URL, which is the only cache invalidation that needs nobody to
           remember anything.

           A `.jpg`, where every other photograph on this page is a `.png` —
           which is not a house rule, only what Figma happened to export. This
           one exports at 6.4 MB, six times PRD R10's ceiling and by a wide
           margin the heaviest file in the repo, and the parallax makes that the
           section's problem rather than the network's alone. Re-encoding it as a
           256-colour PNG got it to 838 KB and visibly posterised the wood grain
           and the shadows, which is exactly the shortcut RULES §12 forbids.
           Full-depth JPEG at q94 gives 747 KB with the grain intact. `NuxtImg`
           serves webp/avif derivatives either way, so the container only ever
           decides what the repository carries. -->
      <NuxtImg
        src="/assets/home/news-domino-desk-mono.jpg"
        :alt="NEWS_ALT.desk"
        :sizes="SIZES_FULL_BLEED"
        :quality="90"
        class="absolute inset-0 size-full object-cover object-bottom"
      />
    </MotionParallaxLayer>

    <!-- `561:13218`. Written with Figma's own colour at zero alpha rather than
         Tailwind's `transparent`, so both ends of the gradient interpolate
         between the same hue and there is no chance of a cast across the middle.
         Opaque by 45%, which is what turns the frame's lower half into flat page
         background for the cards to sit on. -->
    <div
      aria-hidden="true"
      class="absolute inset-0 -z-10 bg-linear-to-b from-[rgba(14,14,14,0)] to-[rgba(14,14,14,1)] to-45%"
    />

    <!-- `673:1452`: the frame's header — 1760 wide, which is the design's 1920
         less its own 80px gutters — with the title hard left and both arrows
         together on the right.

         **It replaces two things at once, and they left together.** A centred
         sentence sat over the photograph (`55:3224`, blur-swept line by line)
         and the two arrows stood at opposite ENDS of the row below it. The
         redraw drops the sentence from the frame and pairs the arrows, and the
         pairing is the point: two arrows at opposite edges read as the two ends
         of a track the reader is inside, where two side by side read as one
         control for a strip they are looking at. A title in the page's own gold
         does the naming the sentence was standing in for.

         `MotionSharpeningHeadline` went with the sentence and is untouched
         elsewhere — About, Domino and Development still open on it.

         Top at `y:140` of the 1080 frame, written as 7.29% of the design's WIDTH
         because this section has no fixed ratio of its own for a percentage of
         height to resolve against. -->
    <div
      class="flex items-center justify-between gap-6 px-5 pt-24 md:px-10 lg:px-20 lg:pt-[7.29%]"
    >
      <!-- Bebas 100/108 under the gold sweep — the statement heading eight other
           sections already carry, and the one the repo owner pointed at ("pakai
           text style kayak resource library"). The SIZE is this frame's own 100
           rather than the Resource Library's 76: same style, each at the size
           its own frame draws it. -->
      <h2
        id="news-heading"
        class="font-display text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
      >
        {{ NEWS_COPY.heading }}
      </h2>

      <!-- `673:1454` is a 184px box around two 64px glyphs, so 56 between them.
           Halved below `lg`, where `RailArrow` itself steps down to 48. -->
      <div class="flex shrink-0 items-center gap-7 lg:gap-14">
        <UiRailArrow
          :label="NEWS_COPY.previous"
          :disabled="atStart"
          @press="step(-1)"
        />
        <UiRailArrow
          :label="NEWS_COPY.next"
          :disabled="atEnd"
          flipped
          @press="step(1)"
        />
      </div>
    </div>

    <!-- No horizontal padding: the strip runs off both edges, which is what
         tells the reader there is more of it than the window shows — and it is
         how Figma draws it, starting the row at `x:-473`, off-canvas.

         `snap-x` parks a slot at the edge after a flick, and the native bar is
         hidden because the design draws none; the row is still reachable by
         wheel, trackpad, touch, keyboard and the two arrows above it.

         64px below the header at the design width — the strip opens at `y:312`
         and the header's 108px line ends at 248 (3.33% of 1920). -->
    <div
      ref="track"
      role="group"
      :aria-label="NEWS_COPY.regionLabel"
      class="mt-8 flex snap-x items-center gap-6 overflow-x-auto scroll-smooth [scrollbar-width:none] lg:mt-[3.33%] [&::-webkit-scrollbar]:hidden"
      @scroll="measure"
    >
      <HomeNewsCard
        v-if="slot(0)"
        :article="slot(0)!"
        size="tall"
        :class="`shrink-0 snap-start ${CARD_W}`"
        :sizes='imageSizes({ xs: "60vw", lg: "28vw" })'
      />
      <HomeNewsCard
        v-if="slot(1)"
        :article="slot(1)!"
        size="tall"
        :class="`shrink-0 snap-start ${CARD_W}`"
        :sizes='imageSizes({ xs: "60vw", lg: "28vw" })'
      />
      <HomeNewsCard
        v-if="slot(2)"
        :article="slot(2)!"
        size="tall"
        :class="`shrink-0 snap-start ${CARD_W}`"
        :sizes='imageSizes({ xs: "60vw", lg: "28vw" })'
      />

      <!-- Node `55:3178` — the stacked column. `justify-center` matches the
           design, which centres this group against the taller cards beside it
           rather than aligning it to their top. -->
      <div
        v-if="slot(3) && slot(4) && slot(5)"
        class="flex shrink-0 snap-start flex-col justify-center gap-6"
      >
        <HomeNewsCard
          :article="slot(3)!"
          size="wide"
          :class="CARD_W"
          :sizes='imageSizes({ xs: "60vw", lg: "28vw" })'
        />
        <div class="flex gap-6">
          <HomeNewsCard
            :article="slot(4)!"
            size="square"
            :class="`shrink-0 ${SQUARE_W}`"
            :sizes='imageSizes({ xs: "30vw", lg: "14vw" })'
          />
          <HomeNewsCard
            :article="slot(5)!"
            size="square"
            :class="`shrink-0 ${SQUARE_W}`"
            :sizes='imageSizes({ xs: "30vw", lg: "14vw" })'
          />
        </div>
      </div>

      <HomeNewsCard
        v-if="slot(6)"
        :article="slot(6)!"
        size="tall"
        :class="`shrink-0 snap-start ${CARD_W}`"
        :sizes='imageSizes({ xs: "60vw", lg: "28vw" })'
      />
    </div>
  </section>
</template>
