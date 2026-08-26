<script setup lang="ts">
import { FAQ_PAGE_COPY } from "~/content/faq"
import { FAQ_PAGE_ITEMS, type FaqPageItem } from "~/content/faq/items"

/**
 * `/faq` — Figma screen `173:9459`.
 *
 * The eleventh page, and the fourth on the side-tab shell: the band from
 * `ui/PageHeader`, the two columns from `ui/SideTabLayout`, the card from
 * `ui/SupportCard` (D57). What it does not share is the body — a filtered
 * accordion is not a numbered document, so it is not built on `LegalDocument`
 * even though that component's note offered to take this screen.
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
function matches(item: FaqPageItem, needle: string) {
  return [item.question, ...item.answer.map((segment) => segment.text)]
    .join(" ")
    .toLowerCase()
    .includes(needle)
}

// Filtered in two passes so the two controls compose: narrowing to a topic and
// then searching inside it is the combination the hidden field in `FaqSearch`
// and the forwarded `q` in `FaqCategoryTabs` both assume.
const shown = computed(() => {
  const inCategory = category.value
    ? FAQ_PAGE_ITEMS.filter((item) => item.category === category.value)
    : FAQ_PAGE_ITEMS

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
  category.value ? `/faq?category=${category.value}` : "/faq",
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
          :items="FAQ_PAGE_ITEMS"
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
              class="focus-visible:ring-gold text-black underline decoration-from-font underline-offset-4 transition-colors hover:text-black/70 focus-visible:ring-2 focus-visible:outline-none"
            >{{ FAQ_PAGE_COPY.searchClear }}</NuxtLink>
          </template>
          <template v-else>{{ FAQ_PAGE_COPY.empty }}</template>
        </template>
      </FaqBoard>
    </UiSideTabLayout>
  </main>
</template>
