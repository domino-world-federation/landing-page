<script setup lang="ts">
import type { NewsArticle } from "~/lib/api/types"
import { DEVELOPMENT_NEWS_COPY } from "~/content/development/news"

/**
 * One story in the development update strip — Figma node `207:15472` and its
 * three siblings.
 *
 * A square photograph beside a date and a headline. Nothing like S8's mosaic
 * tile, which sets its copy ON the picture behind a scrim; here the two sit side
 * by side and the text is on the page background, so there is no wash and no
 * clamp — the headline has a whole column to wrap in.
 *
 * The badge in the picture's corner IS S8's, down to the `rgba(0,0,0,0.7)` fill,
 * the 4px blur and the 24px glyph (`207:15474` against `55:3219`). It is drawn
 * the same way too: the shared arrow asset points LEFT, and +135° brings it
 * round to up-and-right — the "opens an article" glyph rather than the straight
 * rightward arrow that would read as "next item". The sign is easy to get
 * backwards; −135° aims it down-right.
 *
 * The whole card is the link. The badge is a 48px target beside a 250px picture,
 * so it stays as the visual cue (`aria-hidden`, not focusable) and the anchor is
 * stretched over the card behind it — one tab stop per story, with the headline
 * as its accessible name.
 */
defineProps<{ article: NewsArticle }>()
</script>

<template>
  <article class="group relative flex items-center gap-4 lg:gap-6">
    <!-- 250 × 250 in Figma. `shrink-0` because the headline beside it is the
         part that should give way: without it a long title squeezes the square
         into a rectangle and the crop moves. Sized in `vw` above `lg` so the
         pair keeps its proportions, with a floor that keeps the thumbnail
         recognisable on a phone. -->
    <div
      class="relative size-24 shrink-0 overflow-hidden rounded-[var(--radius-glass)] sm:size-32 lg:size-[max(8rem,13.02vw)]"
    >
      <!-- Empty alt: the headline beside it is the card's whole content, and
           naming the picture would announce the story twice. Same call S8's
           tiles make. -->
      <NuxtImg
        :src="article.thumbnailUrl"
        alt=""
        :sizes="imageSizes({ xs: '128px', lg: '13vw' })"
        class="absolute inset-0 size-full object-cover"
      />

      <!-- Node `207:15474`: inset 16px from the picture's top-right corner. -->
      <div
        aria-hidden
        class="pointer-events-none absolute top-2 right-2 flex size-8 items-center justify-center rounded-[var(--radius-btn)] bg-black/70 backdrop-blur-[4px] transition-transform duration-200 group-hover:-translate-y-0.5 group-focus-within:ring-2 group-focus-within:ring-white lg:top-4 lg:right-4 lg:size-12"
      >
        <!-- `invert` because the source is drawn in `#0E0E0E` for use on white,
             and here it sits on dark glass. -->
        <img
          src="/assets/global/icon-arrow-left.svg"
          alt=""
          width="24"
          height="24"
          class="size-4 rotate-135 invert lg:size-6"
        >
      </div>
    </div>

    <div class="flex flex-col gap-2 lg:gap-3">
      <!-- Bebas 32/40 at 50% — Figma puts the opacity on the wrapper
           (`207:15479`) rather than the text, which is the same result for one
           child and is written as the one thing it affects. -->
      <p
        class="font-display text-[length:var(--text-display-caption)] leading-[1.25] text-white/50"
      >
        {{ formatLongDate(article.publishedAt) }}
      </p>

      <!-- Inter SemiBold 36/44. Figma writes two of these four headlines with a
           hard newline and sets the style to `textCase: TITLE`; neither is
           reproduced — the break falls where the column puts it, and the case is
           the string's own (D40). -->
      <h3
        class="font-sans text-[length:var(--text-body-lg)] leading-[1.22] font-semibold text-white"
      >
        <!-- The stretched link: `after` covers the card, so the anchor is the
             whole row while the accessible name stays the headline. -->
        <NuxtLink
          :to="`/news/${article.slug}`"
          :aria-label="DEVELOPMENT_NEWS_COPY.readLabel.replace('%s', article.title)"
          class="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
        >
          {{ article.title }}
        </NuxtLink>
      </h3>
    </div>
  </article>
</template>
