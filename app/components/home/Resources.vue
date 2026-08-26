<script setup lang="ts">
import { getResources } from "~/lib/api/client"
import { RESOURCES_COPY } from "~/content/home/resources"

/**
 * S10 — Figma node `56:4554`. The resource library.
 *
 * Two columns: a gold heading with one line of prose on the left, and a 2×2 grid
 * of document cards on the right. Figma's numbers are 356 for the left column
 * and 1136 for the grid, inside a 1920 frame padded 80 each side — the two are
 * `space-between`, so 1920 − 160 − 356 − 1136 leaves **268px** between them
 * (13.96vw).
 *
 * Those widths are written as fractions rather than pixels (D14): the left
 * column is a fixed 356 in Figma but nothing about it needs to be, and holding
 * it fixed while the grid shrinks would give the prose a wider measure than the
 * cards beside it at every width below 1920.
 *
 * The grid goes 2-up only from `menu-lg` (1600), not from `sm`. A card's pill is
 * a fixed 160px, so what governs is how much of the card is left for the title —
 * and Figma's own shape is two lines. Measured across the range: at 768 a 2-up
 * grid gave 336px cards and four-line titles; at 1400 it gave 390px and three
 * lines; only at 1600 do the cards reach 455px and the titles fall back to
 * `2,2,1,2`, which is what the design draws. Below that they stack, one per row,
 * where every title fits on a single line.
 *
 * **Four documents, asked for as four.** The library holds more than this
 * section draws — the Domino page files three shelves of its own and the
 * Development page four more — and this grid is a fixed 2×2 rather than a feed,
 * so the count belongs in the request. Without it the grid quietly grew to seven
 * cards the first time another page filed a document. Not sliced from a full
 * fetch: the real endpoint takes `?limit=`, and slicing here would keep
 * downloading the whole library to show four of it (RULES §8).
 */
const { data: documents } = await useAsyncData(
  "home-resources",
  () => getResources(undefined, 4),
  { default: () => [] },
)
</script>

<template>
  <section
    aria-labelledby="resources-heading"
    class="px-5 py-16 md:px-10 lg:px-20 lg:py-[4.17vw]"
  >
    <div class="flex flex-col gap-10 lg:flex-row lg:gap-[13.96vw]">
      <!-- 356/1652 of the content box — the fraction Figma gives the left column
           once its 80px padding is taken off both sides. `basis-0` with a grow
           factor rather than a width, so the two columns divide the row between
           them and neither has a fixed demand that could overflow a narrow
           desktop (D14). -->
      <div class="flex flex-col gap-3.5 lg:shrink-0 lg:grow-[356] lg:basis-0">
        <!-- Bebas 76/72 with the gold gradient (`56:4544`) — the same fill S4's
             headline uses, so it borrows `--text-display-sm` (76 exactly) rather
             than gaining a step of its own.

             `leading-[0.95]` is Figma's 72 on a 76 body: the two lines are set
             tighter than they are tall, which is what makes the heading read as
             a block rather than as two sentences. -->
        <h2
          id="resources-heading"
          class="font-display bg-[image:var(--gradient-gold-text)] bg-clip-text text-[length:var(--text-display-sm)] leading-[0.95] text-transparent uppercase"
        >
          {{ RESOURCES_COPY.heading }}
        </h2>
        <p class="font-sans text-base leading-7 text-white lg:text-xl lg:leading-8">
          {{ RESOURCES_COPY.intro }}
        </p>
      </div>

      <!-- 1136/1652, the grid's share of the same content box. -->
      <div class="lg:grow-[1136] lg:basis-0">
        <!-- Figma wraps four fixed 560px cards in a 1136px frame, which is a 2×2
             grid stated as a wrapping row. Written as an actual grid here: the
             wrap is the intent, and `grid-cols-2` says it without depending on
             the cards keeping a particular width.

             `auto-rows-fr` equalises the two rows. Figma gives the third card an
             explicit 156px height where the others hug their content
             (`56:4599`) — the design is compensating by hand for a title that
             runs to one line where its neighbour's runs to two. Equal rows do
             that automatically and keep doing it when the titles change. -->
        <div class="grid auto-rows-fr gap-4 menu-lg:grid-cols-2">
          <!-- Cards arrive one after another rather than as a block: four white
               rectangles appearing at once on a dark ground is a flash rather
               than an entrance. 0.08s is half the page's standard stagger —
               enough to read as a sequence without making the last card feel
               late.

               `[&>*]:h-full` reaches through `Reveal`'s own wrapper: the wrapper
               is the grid item and stretches on its own, but the card inside it
               is in normal flow and would sit at its content height, leaving the
               shorter card of a row visibly short. -->
          <MotionReveal
            v-for="(doc, i) in documents"
            :key="doc.id"
            :y="24"
            :delay="i * 0.08"
            class="h-full [&>*]:h-full"
          >
            <!-- The meta line is the document's category here; the Development
                 page's copy of this card prints a date in the same slot, which
                 is why it is a prop. -->
            <UiResourceCard
              :doc="doc"
              :meta="doc.category"
              :download-label="RESOURCES_COPY.downloadLabel"
            />
          </MotionReveal>
        </div>
      </div>
    </div>
  </section>
</template>
