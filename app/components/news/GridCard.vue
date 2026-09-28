<script setup lang="ts">
import type { NewsArticle } from "~/lib/api/types"
import { NEWS_ARCHIVE_COPY } from "~/content/news/archive"

/**
 * One tile in the archive grid — Figma node `163:8225` and its five siblings.
 *
 * A 572 × 322 photograph, then the category and date, then the headline. The
 * badge in the picture's corner is S8's, down to the `rgba(0,0,0,0.7)` fill, the
 * 4px blur and the 24px glyph (`165:8315` against `55:3219`), and it is drawn
 * the same way: the shared arrow asset points LEFT and +135° brings it round to
 * up-and-right — "opens an article" rather than the straight rightward arrow
 * that would read as "next item". The sign is easy to get backwards; −135° aims
 * it down-right.
 *
 * The whole card is the link. The badge is a 48px target beside a picture the
 * width of the card, so it stays the visual cue (`aria-hidden`, not focusable)
 * and the anchor stretches over the card behind it — one tab stop per story,
 * with the headline as its accessible name.
 *
 * Figma sets the headline `textCase: TITLE` and types every one of them in lower
 * case. Neither is reproduced: the case is the string's own (D40), and the feed
 * already stores headlines the way the federation writes them.
 */
defineProps<{ article: NewsArticle }>()
</script>

<template>
  <article class="group relative flex flex-col gap-3">
    <!-- 572 × 322. An aspect rather than a height, so the picture keeps its crop
         as the column narrows instead of the frame closing on it. -->
    <div
      class="relative aspect-[572/322] w-full overflow-hidden rounded-[var(--radius-glass)] bg-white/6"
    >
      <!-- Empty alt: the headline below is the card's content, and naming the
           picture would announce the story twice. The same call S8's tiles and
           the Development strip both make. -->
      <!-- The API leaves `thumbnailUrl` out entirely for an article filed
           without a picture, whatever the type says, and an `<img>` with no
           source draws the browser's broken-image icon. So the frame stands
           empty on its own tint with the emblem faint in it instead. -->
      <NuxtImg
        v-if="article.thumbnailUrl"
        :src="article.thumbnailUrl"
        alt=""
        :sizes="imageSizes({ xs: '50vw', lg: '24vw' })"
        class="absolute inset-0 size-full object-cover"
      />
      <img
        v-else
        src="/assets/global/logo-dwf-emblem.svg"
        alt=""
        aria-hidden="true"
        width="196"
        height="196"
        class="absolute top-1/2 left-1/2 w-1/4 -translate-x-1/2 -translate-y-1/2 opacity-15"
      >

      <!-- `165:8315`: inset 16px from the picture's top-right corner. -->
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

    <!-- Bebas 32/40 at 50%. Figma puts the opacity on the wrapper (`163:8227`)
         rather than on each of the three texts. -->
    <p
      class="font-display flex flex-wrap items-center gap-x-2 text-base leading-[1.25] text-white/50 md:gap-2.5 md:text-[length:var(--text-display-caption)]"
    >
      <span>{{ article.category }}</span>
      <!-- Punctuation between two labels rather than content — hidden, so it is
           not read out as "bullet" between them. -->
      <span aria-hidden>&bull;</span>
      <time :datetime="article.publishedAt">
        {{ formatShortDate(article.publishedAt) }}
      </time>
    </p>

    <!-- Inter SemiBold 28/36. -->
    <h3
      class="font-sans line-clamp-2 text-sm leading-[1.35] font-semibold text-white md:text-[length:var(--text-heading-tile)] md:leading-[1.29]"
    >
      <!-- The stretched link: `after` covers the card, so the anchor is the
           whole tile while the accessible name stays the headline. -->
      <NuxtLink
        :to="`/news/${article.slug}`"
        :aria-label="NEWS_ARCHIVE_COPY.readLabel.replace('%s', article.title)"
        class="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
      >
        {{ article.title }}
      </NuxtLink>
    </h3>
  </article>
</template>
