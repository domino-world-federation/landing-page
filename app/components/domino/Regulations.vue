<script setup lang="ts">
import { getResources } from "~/lib/api/client"
import { REFEREE_DUTIES, REGULATIONS_COPY } from "~/content/domino/regulations"

/**
 * Referee guidelines and the documents behind them — Figma node `359:15793` in
 * the **updated** file.
 *
 * Two halves side by side: a dark card carrying the rulebook and its download,
 * and a column with the gold heading, the four duties in a 2 × 2 grid, and the
 * competition regulations as glass buttons.
 *
 * **This section was built from a wireframe and has now been rebuilt from the
 * hi-fi.** The old screen stopped drawing at y=2180 (D42), so the first version
 * arranged the wireframe's parts itself: a rulebook button, a list of three
 * documents, and the duties in one column. The updated file draws the block
 * properly and the arrangement is different — one document on the left rather
 * than three in a list, the duties two abreast, the other two documents as
 * buttons.
 *
 * **None of the words changed.** The intro and all four duties are verbatim what
 * the wireframe wrote and what the hi-fi now draws, which is the useful thing to
 * know about that first build: the copy was right, only the shape was a guess.
 *
 * The documents still come from `getResources(category)` (RULES §8) — a rulebook
 * and two regulations are files with a size and a type, not prose.
 */
const { data } = await useAsyncData("domino-regulations", async () => {
  const [rulebooks, regulations] = await Promise.all([
    getResources("Rulebook"),
    getResources("Regulations"),
  ])
  return { rulebook: rulebooks[0], regulations }
}, { default: () => ({ rulebook: undefined, regulations: [] }) })
</script>

<template>
  <section
    aria-labelledby="regulations-heading"
    class="bg-bg flex flex-col gap-9 px-5 py-14 md:px-10 lg:flex-row lg:items-start lg:px-20 lg:py-[3.125vw]"
  >
    <!-- `359:15820` — 560 × 522, `#262626`, the parts pushed to the ends by
         `justify-between` as Figma has them. `min-h` rather than the fixed
         height: a longer translation grows the card instead of overflowing it
         (RULES §9). -->
    <div
      v-if="data.rulebook"
      class="flex shrink-0 flex-col justify-between gap-10 rounded-[var(--radius-card)] bg-[#262626] p-8 lg:min-h-[522px] lg:w-[560px] lg:p-10"
    >
      <img
        src="/assets/domino/decor-rulebook-union.svg"
        alt=""
        aria-hidden
        width="131"
        height="142"
        class="w-20 opacity-10 lg:w-[131px]"
      >

      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <!-- Inter SemiBold 36/44. The document's own title, not a written
               heading — it names the file the pill downloads. -->
          <h3
            class="font-sans text-[length:var(--text-body-lg)] leading-[1.22] font-semibold text-white"
          >
            {{ data.rulebook.title }}
          </h3>
          <p
            class="font-sans text-[length:var(--text-body-sm)] leading-[1.5] text-white/50"
          >
            {{ REGULATIONS_COPY.rulebookBlurb }}
          </p>
        </div>

        <!-- The news shelves' pill, widened. Figma draws the identical control
             across the foot of this card (`360:15848`). -->
        <UiDownloadPill
          :document="data.rulebook"
          :label="REGULATIONS_COPY.rulebookDownloadLabel"
          class="w-full justify-center gap-3"
        />
      </div>
    </div>

    <div class="flex min-w-0 flex-1 flex-col gap-8 lg:gap-10">
      <div class="flex flex-col gap-3.5">
        <!-- Bebas 100 through the page's gold gradient. `uppercase` is the
             heading's, not the string's (D40). -->
        <h2
          id="regulations-heading"
          class="font-display w-fit bg-[image:var(--gradient-gold-text)] bg-clip-text text-[length:var(--text-display-statement)] leading-[1.08] text-transparent uppercase"
        >
          {{ REGULATIONS_COPY.refereeHeading }}
        </h2>
        <p
          class="font-sans text-[length:var(--text-body-sm)] leading-[1.5] text-white/50"
        >
          {{ REGULATIONS_COPY.refereeIntro }}
        </p>
      </div>

      <!-- `361:16047` — two columns of two. Figma fills them DOWN each column
           (01 and 03 on the left, 02 and 04 on the right); a plain two-column
           grid fills across, which would print 01 02 / 03 04. Neither order is
           wrong to read, and across is the one that matches the numbers, so that
           is what this does — the design's column-major fill is an artefact of
           it being two stacked frames rather than a grid. -->
      <ol class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-x-9">
        <li
          v-for="(duty, index) in REFEREE_DUTIES"
          :key="duty.id"
          class="flex items-center gap-4"
        >
          <!-- `361:16054` — an 80px glass tile carrying the number. Drawn rather
               than left to the list marker: it is a box with its own fill at
               48/56, which no marker can be. The number comes from the position,
               so an inserted duty cannot leave the list reading 01, 02, 02. -->
          <span
            aria-hidden
            class="font-sans flex size-16 shrink-0 items-center justify-center rounded-[var(--radius-glass)] bg-white/16 text-[length:var(--text-body-xl)] leading-none font-semibold text-white lg:size-20"
          >
            {{ String(index + 1).padStart(2, "0") }}
          </span>
          <p class="font-sans text-[length:var(--text-body-sm)] leading-[1.33] text-white">
            {{ duty.text }}
          </p>
        </li>
      </ol>

      <!-- `361:16084` — the other two documents, as 20%-white glass buttons
           rather than rows in a list. Each is a link to the file, so the
           accessible name says which document rather than leaving two identical
           "open" links. -->
      <ul v-if="data.regulations.length > 0" class="flex flex-wrap gap-6">
        <li v-for="doc in data.regulations" :key="doc.id">
          <a
            :href="doc.fileUrl"
            :aria-label="REGULATIONS_COPY.openLabel.replace('%s', doc.title)"
            class="rounded-btn font-display focus-visible:ring-gold flex h-16 items-center justify-center gap-6 bg-white/20 px-5 text-[length:var(--text-display-btn)] leading-10 text-white transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:outline-none"
          >
            {{ doc.title }}
            <!-- A 24px inline SVG sized in CSS. The shared glyph points LEFT;
                 +135° turns it up-and-right, the "opens something" arrow.
                 `invert` because it is drawn dark for use on white. -->
            <img
              src="/assets/global/icon-arrow-left.svg"
              alt=""
              width="24"
              height="24"
              class="size-6 rotate-135 invert"
            >
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
