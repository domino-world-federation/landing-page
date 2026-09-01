<script setup lang="ts">
import { getNewsArticle } from "~/lib/api/client"
import { NEWS_ARTICLE_COPY } from "~/content/news/article"

/**
 * `/news/[slug]` — one story.
 *
 * **Figma does not draw this page.** The news screens stop at the archive, and
 * the mosaic on the landing page has always linked here (`/news/{slug}` on every
 * tile) — so every one of those seven tiles led to a 404. Built on the repo
 * owner's instruction to make the click land somewhere real, expressly without
 * waiting for a design: "tampilkan detail yg ada saja."
 *
 * So it is deliberately the shell and nothing more, and the shell is borrowed
 * rather than invented — `UiPageHeader` with a back link and the date on the
 * title's baseline, which is the band `/faq`, `/news/all`, `/tournaments/all`
 * and `/tournaments/[slug]` all open with. When the page is drawn, what changes
 * is what sits under that band.
 *
 * **`body` is not rendered as an empty state.** `NewsArticle` carries it as
 * optional and no mock story has one (B2), so today the excerpt is the whole of
 * the text. A placeholder paragraph saying the article is coming would be copy
 * nobody wrote appearing as though an editor had — the page prints what exists
 * and stops, and grows a body the moment the feed carries one.
 *
 * No snapping, like the other document pages: mandatory snapping over prose is
 * a reader fighting the page.
 */
const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: article } = await useAsyncData(
  () => `news-article-${slug.value}`,
  () => getNewsArticle(slug.value),
  { watch: [slug] },
)

// A slug naming nothing is a real 404 rather than an empty page — `fatal` so the
// error page renders instead of a header over nothing. Same guard, same reason,
// as `/tournaments/[slug]`.
if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: NEWS_ARTICLE_COPY.notFound,
    fatal: true,
  })
}

// Non-null from here: the guard above throws. `computed` rather than a `!` at
// every use, which is the pattern the tournament detail page settled on.
const story = computed(() => article.value!)

useSeoMeta({
  title: () => `${story.value.title} | Domino World Federation`,
  description: () => story.value.excerpt,
})
</script>

<template>
  <main>
    <UiPageHeader
      :title="[story.title]"
      :back="{ label: NEWS_ARTICLE_COPY.back, href: NEWS_ARTICLE_COPY.backHref }"
    >
      <template #meta>
        <!-- The category and the date, on the title's baseline — the slot the
             legal documents put their "last updated" line in. `formatShortDate`
             is the news page's own formatter, so a story's date reads the same
             here as it does on the card that led to it. -->
        <p
          class="font-sans text-[length:var(--text-body-sm)] leading-8 font-medium text-[#aaaaaa]"
        >
          <span class="uppercase">{{ story.category }}</span>
          <span aria-hidden="true"> · </span>
          <time :datetime="story.publishedAt">
            {{ formatShortDate(story.publishedAt) }}
          </time>
        </p>
      </template>
    </UiPageHeader>

    <!-- 1008px is the measure the landing page's own sentence uses and the width
         the legal documents set their prose to; a story is the same kind of
         reading. -->
    <article class="mx-auto max-w-[1008px] px-5 pb-24 md:px-10 lg:px-20 lg:pb-32">
      <!-- `heroImageUrl` when the story has been given one, the card thumbnail
           otherwise — the same fallback the news page's featured band makes, and
           for the reason recorded on the type: a feed where only some stories
           carry a landscape crop is the normal case, not an error.

           `alt` follows the picture: the hero's own description when there is
           one, and empty otherwise, because a thumbnail chosen to sit beside a
           headline is decoration once the headline is already on the page. -->
      <NuxtImg
        :src="story.heroImageUrl ?? story.thumbnailUrl"
        :alt="story.heroImageAlt ?? ''"
        :sizes='imageSizes({ xs: "100vw", lg: "52.5vw" })'
        :quality="90"
        class="aspect-[16/9] w-full rounded-[var(--radius-card)] object-cover"
      />

      <p
        class="font-sans mt-10 text-lg leading-8 text-white lg:text-xl lg:leading-9"
      >
        {{ story.excerpt }}
      </p>

      <p
        v-if="story.body"
        class="font-sans mt-6 text-base leading-8 whitespace-pre-line text-white/80"
      >
        {{ story.body }}
      </p>
    </article>
  </main>
</template>
