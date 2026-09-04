<script setup lang="ts">
import { FAQ_PAGE_COPY } from "~/content/faq"
import { getFaqs } from "~/lib/api/client"
import type { Faq } from "~/lib/api/types"

/**
 * `/page/faq` — Figma screen `613:23161`.
 *
 * **A sibling of `[key].vue`, not an entry in it.** The three side-tab documents
 * share a URL shape because the repo owner asked for one, and Nuxt resolves a
 * static segment ahead of a dynamic one, so this file takes `/page/faq` and the
 * parameter route is left with the documents it actually knows how to render. A
 * branch inside `[key].vue` would have been one route doing two unrelated jobs:
 * the legal pages are a numbered document with a table of contents, and this is
 * a filtered accordion with a search field and two URL-driven filters. They meet
 * at the shell, which is where D57 already drew the line.
 *
 * The fourth page on the side-tab shell: the band from
 * `ui/PageHeader`, the two columns from `ui/SideTabLayout`, the card from
 * `ui/SupportCard` (D57). What it does not share is the body — a filtered
 * accordion is not a numbered document, so it is not built on `LegalDocument`
 * even though that component's note offered to take this screen.
 *
 * **The redraw took the white card away.** `173:9459` put the questions in the
 * legal panel — black type on white, on a dark page; `613:23161` drops it and
 * lets the items stand on the screen's own ground as filled boxes. `FaqBoard`
 * carries the change and its note has the reasoning; the only thing it reaches
 * out here is the "clear search" link, which was black for the card it no longer
 * sits on.
 *
 * **The questions are copy, not data.** They live in `content/faq/`, like the
 * legal clauses and unlike the news feed: an FAQ is a document the federation
 * writes, not a feed it files, so routing it through a mock endpoint would
 * promise a `/faq` response nobody is going to build (the call `/terms` made).
 * That leaves both filters in the same place — the URL, read during SSR — so
 * `?category=` and `?q=` behave like `/gallery`'s `?event=` and the news
 * archive's `?category=` (D50): shareable, no client island, no second copy of
 * the state.
 *
 * **The pager is not built.** The design draws one under the card (`174:10695`):
 * three numbered pages, of which it fills the first with ten questions. There
 * are ten questions in the whole file, so pages two and three would be empty —
 * and a control that leads somewhere empty is the silent no-op D28 ruled out,
 * the same reason the Domino rulebook tabs were left alone (D42). Recorded as
 * R15; it becomes a five-minute component the moment the copy for pages two and
 * three exists.
 */
useSeoMeta({
  title: "FAQ | Domino World Federation",
  description:
    "Answers to common questions about sanctioned dominoes — how tournaments are entered, what the standard set holds, and how a hand is played and scored.",
})

const route = useRoute()

/*
 * Seluruh pertanyaan, sekali — halaman ini menyaringnya sendiri di server.
 *
 * Tanpa `placement`: yang tiga halaman lain tampilkan adalah SEBAGIAN yang
 * ditempelkan ke masing-masing; yang ini arsipnya, dan lacinya lahir dari
 * kategori pertanyaan yang benar-benar ada — laci kosong tidak pernah
 * digambar.
 */
const { data: items } = await useAsyncData("faq-page", () => getFaqs(), {
  default: () => [] as Faq[],
})

const category = computed(() =>
  typeof route.query.category === "string" ? route.query.category : undefined,
)
const q = computed(() =>
  typeof route.query.q === "string" ? route.query.q : undefined,
)

const term = computed(() => q.value?.trim().toLowerCase() ?? "")

/**
 * Whether a question is a hit.
 *
 * Both the question and its answer are searched: a reader looking for "boneyard"
 * should find the question that explains it and the two that mention it in
 * passing. The answer's segments are joined because the bold runs are
 * typographic, not semantic — a phrase must not become unfindable for having
 * been emphasised mid-sentence.
 */
function matches(item: Faq, needle: string) {
  // `answer` carries two shapes — segments for copy in this repo, sanitised
  // HTML for anything from the CMS (see `FaqItem.answer`). Both are flattened
  // to plain text before matching; searching HTML source would let a reader
  // find a question by typing `strong`.
  const answer =
    typeof item.answer === "string"
      ? item.answer.replace(/<[^>]*>/g, " ")
      : item.answer.map((segment) => segment.text).join(" ")

  return [item.question, answer].join(" ").toLowerCase().includes(needle)
}

// Filtered in two passes so the two controls compose: narrowing to a topic and
// then searching inside it is the combination the hidden field in `FaqSearch`
// and the forwarded `q` in `FaqCategoryTabs` both assume.
const shown = computed(() => {
  const inCategory = category.value
    ? items.value.filter((item) => item.category?.slug === category.value)
    : items.value

  return term.value
    ? inCategory.filter((item) => matches(item, term.value))
    : inCategory
})

// Remounts the accordion when the filter changes. Which item is open is local
// state that would otherwise outlive the navigation, keyed by an id the new list
// may not contain — without this, filtering can land the reader on a card with
// every answer shut.
const boardKey = computed(() => `${category.value ?? "all"}:${term.value}`)

const clearHref = computed(() =>
  category.value ? `/page/faq?category=${category.value}` : "/page/faq",
)
</script>

<template>
  <main>
    <UiPageHeader
      :title="FAQ_PAGE_COPY.title"
      :back="{ label: FAQ_PAGE_COPY.back, href: FAQ_PAGE_COPY.backHref }"
    >
      <template #aside>
        <FaqSearch :query="q" :category="category" />
      </template>
    </UiPageHeader>

    <UiSideTabLayout>
      <template #sidebar>
        <!-- The whole list, not the filtered one: a filter that hides the way
             back to the other topics is a dead end. -->
        <FaqCategoryTabs
          :items="items"
          :active="category"
          :query="q"
        />
        <UiSupportCard />
      </template>

      <FaqBoard :key="boardKey" :items="shown">
        <template #empty>
          <template v-if="term">
            {{ FAQ_PAGE_COPY.emptySearch.replace("%s", q ?? "") }}
            <NuxtLink
              :to="clearHref"
              class="focus-visible:ring-gold text-white underline decoration-from-font underline-offset-4 transition-colors hover:text-white/70 focus-visible:ring-2 focus-visible:outline-none"
            >{{ FAQ_PAGE_COPY.searchClear }}</NuxtLink>
          </template>
          <template v-else>{{ FAQ_PAGE_COPY.empty }}</template>
        </template>
      </FaqBoard>
    </UiSideTabLayout>
  </main>
</template>
