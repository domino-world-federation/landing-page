<script setup lang="ts">
import { getLatestNews, getNewsCategories } from "~/lib/api/client"
import { useEventListener } from "@vueuse/core"
import { NEWS_ARCHIVE_COPY } from "~/content/news/archive"

/** The design's grid is six tiles, three abreast, two rows (`165:8250`). */
const PAGE = 8

/**
 * The grid's own anchor, so "view more" returns the reader to the tiles rather
 * than to the top of the document.
 */
const ANCHOR = "latest-articles"

/**
 * The archive — Figma nodes `166:8431` (the filter) and `165:8250` (the grid).
 *
 * **The filter is links, not state.** Each tab is a link to `?category=`, the
 * page re-renders, and `getLatestNews` filters during SSR. That is three things
 * at once: nothing in the section has to hydrate (RULES §5), a filtered archive
 * becomes a URL somebody can send to somebody else, and the filtering happens
 * where RULES §8 wants it — the real endpoint takes `?category=`, whereas a
 * client island sifting the feed would download every article the federation has
 * filed in order to show six of them (D45).
 *
 * **The tab labels come from the feed.** Figma names five — All, DWF,
 * Tournaments, Members, Development (`166:8377`) — and the feed's categories are
 * a different vocabulary, so the design's list would print tabs that filter to
 * nothing while hiding categories that have articles in them. The design's five
 * are the shape; `getNewsCategories` supplies the words. Only "All" is copy,
 * because it is the one tab that is not a category.
 *
 * **"View more" goes to `/news/all`.** It used to grow a `?show=` in steps of
 * six, because when this section was built there was nowhere for it to lead.
 * There is now — `185:13184` is the full archive, two columns wide with a "Back"
 * link pointing here — so this block shows the six the design draws and the
 * button opens the page the design drew for it. One mechanism instead of two,
 * and one fewer thing invented.
 */
const props = defineProps<{
  /** From `?category=`. Absent means every category — the "All" tab. */
  category?: string
}>()

const { data: categories } = await useAsyncData(
  "news-categories",
  () => getNewsCategories(),
  { default: () => [] },
)

// One over the page: if the extra article comes back there is more archive to
// open, and if it does not the button has nothing to lead to. Cheaper than a
// second call for a count, and it cannot disagree with the list.
const { data: fetched } = await useAsyncData(
  "news-archive",
  () => getLatestNews(PAGE + 1, props.category),
  { watch: [() => props.category], default: () => [] },
)

const articles = computed(() => fetched.value.slice(0, PAGE))

function tabHref(next?: string) {
  const query = next ? `?category=${encodeURIComponent(next)}` : ""
  return `/news${query}#${ANCHOR}`
}

// The filter travels with the reader: opening the archive from a filtered grid
// should not silently drop the filter on the way.
/**
 * The tab strip scrolls inside its pill. Two jobs here, both client-only and
 * both after render, so the server's markup is never affected:
 *
 * - **the chosen tab is brought to the strip's left edge** (repo owner's call,
 *   2026-09-28), so picking a category from the far end of a long vocabulary
 *   leaves it in view — and leaves the ones after it next in line;
 * - **a fade marks each edge with tabs still behind it**, so the strip no
 *   longer ends on a word cut in half.
 */
const strip = useTemplateRef<HTMLUListElement>("strip")
const fadeStart = ref(false)
const fadeEnd = ref(false)

function measureStrip() {
  const el = strip.value
  if (!el) return
  fadeStart.value = el.scrollLeft > 1
  fadeEnd.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
}

const FADE = "40px"
const stripMask = computed(() => {
  if (!fadeStart.value && !fadeEnd.value) return undefined
  const start = fadeStart.value ? `transparent 0, #000 ${FADE}` : "#000 0"
  const end = fadeEnd.value ? `#000 calc(100% - ${FADE}), transparent 100%` : "#000 100%"
  return `linear-gradient(to right, ${start}, ${end})`
})

function bringActiveToStart(smooth: boolean) {
  const el = strip.value
  const active = el?.querySelector<HTMLElement>('[aria-current="page"]')
  if (!el || !active) return
  el.scrollTo({
    left: active.parentElement!.offsetLeft,
    behavior: smooth ? "smooth" : "instant",
  })
}

onMounted(() => {
  bringActiveToStart(false)
  measureStrip()
  useEventListener(window, "resize", measureStrip)
})

watch(
  () => props.category,
  async () => {
    await nextTick()
    bringActiveToStart(true)
  },
)

const allHref = computed(() =>
  props.category
    ? `/news/all?category=${encodeURIComponent(props.category)}`
    : "/news/all",
)
</script>

<template>
  <!-- `#1E1E1E` to `#0E0E0E` (`163:8233`) — the band lifts off the page
       background at the top and settles back onto it at the bottom, which is
       what separates the grid from the two document shelves under it without
       drawing a rule. -->
  <section
    :id="ANCHOR"
    aria-labelledby="archive-heading"
    class="flex scroll-mt-[var(--anchor-offset)] flex-col gap-8 bg-linear-to-b from-[#1e1e1e] to-[#0e0e0e] px-5 py-10 md:px-10 lg:gap-8 lg:px-20 lg:py-[3.125vw]"
  >
    <h2 id="archive-heading" class="sr-only">
      {{ NEWS_ARCHIVE_COPY.heading }}
    </h2>

    <!-- The pill strip carries the navbar's chrome exactly — 40% black under a
         10px backdrop blur, 12px radius, 4px of padding (`166:8377` against
         `156:7563`). Same component in the design system, so the same numbers
         here. `overflow-x-auto` because the strip is as long as the feed's
         vocabulary, which the page does not control. -->
    <!-- The control row: category tabs on the left, the search field and the
         View All button on the right (repo owner's layout, 2026-09-28 — the
         search used to sit in a header band this page no longer has, and View
         All replaces the "View more" pill that sat under the grid). Stacked
         below `lg`: the tabs scroll on their own line, the search and button
         share the next. -->
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
    <!-- The pill is the frame and the strip scrolls INSIDE it, so a long
         vocabulary no longer runs its last tab into the search field cut
         mid-word: it fades out at whichever edge still has tabs behind it.
         The fades are a mask, driven by where the strip is scrolled to. -->
    <nav
      :aria-label="NEWS_ARCHIVE_COPY.filterLabel"
      class="min-w-0 rounded-[var(--radius-glass)] bg-black/40 p-1 backdrop-blur-[10px] lg:flex-1"
    >
      <ul
        ref="strip"
        :style="{ maskImage: stripMask, WebkitMaskImage: stripMask }"
        class="relative flex items-center gap-0 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        @scroll.passive="measureStrip"
      >
        <NewsArchiveTab
          :label="NEWS_ARCHIVE_COPY.allTab"
          :href="tabHref()"
          :active="category === undefined"
        />
        <NewsArchiveTab
          v-for="name in categories"
          :key="name"
          :label="name"
          :href="tabHref(name)"
          :active="category === name"
        />
      </ul>
    </nav>

      <div class="flex items-start gap-3 lg:w-[max(420px,28vw)] lg:shrink-0">
        <NewsSearch class="min-w-0 flex-1" />
        <NuxtLink
          :to="allHref"
          class="rounded-btn font-display focus-visible:ring-gold flex h-13 shrink-0 items-center justify-center bg-white/20 px-4 text-[length:var(--text-display-btn)] leading-none text-white uppercase transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:outline-none"
        >
          {{ NEWS_ARCHIVE_COPY.viewAll }}
        </NuxtLink>
      </div>
    </div>

    <p
      v-if="articles.length === 0"
      class="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60"
    >
      {{ NEWS_ARCHIVE_COPY.empty }}
    </p>

    <!-- Four across from `lg`, two rows of them (the repo owner's layout,
         2026-09-28 — it was three across in Figma). Two across on a phone:
         one full-width picture per story made the grid a long scroll of
         photographs. -->
    <ul v-else class="grid grid-cols-2 gap-x-3 gap-y-6 md:gap-5 lg:grid-cols-4">
      <li v-for="article in articles" :key="article.id">
        <NewsGridCard :article="article" />
      </li>
    </ul>
  </section>
</template>
