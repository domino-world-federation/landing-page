<script setup lang="ts">
import { ALL_TOURNAMENTS_COPY } from "~/content/tournaments/all"

/**
 * The pager under the tournament grid — Figma node `517:2716`.
 *
 * Two 20%-white boxes either side of "1 of 6" in Bebas 32. Figma draws the count
 * as PAGES, not cards: `517:2720` reads "1 of 6" beneath six cards, so the six
 * is the number of pages and the one is which of them you are on.
 *
 * **The page rides in the URL like the filters do**, so paging is a link, works
 * without JavaScript, renders during SSR, and page four of the closed
 * tournaments is an address somebody can send. That is why this emits nothing
 * and takes `hrefFor` — the caller owns what the query looks like, and it is the
 * caller that already knows about `?status=` and `?q=`.
 *
 * The ends are `disabled` rather than dimmed-and-still-pressable: an arrow that
 * has nowhere to go should also leave the tab order, the same call `ui/RailArrow`
 * makes at the ends of a row.
 */
const props = defineProps<{
  page: number
  totalPages: number
  /** Where a given page lives — the caller keeps the rest of the query. */
  hrefFor: (page: number) => string
}>()

const atStart = computed(() => props.page <= 1)
const atEnd = computed(() => props.page >= props.totalPages)

const BOX =
  "flex size-[66px] items-center justify-center rounded-[var(--radius-btn)] bg-white/20 transition-colors hover:bg-white/30 focus-visible:ring-gold focus-visible:ring-2 focus-visible:outline-none"
</script>

<template>
  <nav
    v-if="totalPages > 1"
    :aria-label="ALL_TOURNAMENTS_COPY.listLabel"
    class="flex items-center justify-center gap-5"
  >
    <!-- `aria-current` is bound OFF on both links, and it has to be. These point
         at the same path with a different `?page=`, and vue-router compares path
         and params only — so every pager link reads as exact-active and
         `RouterLink` stamps `aria-current="page"` on it. Two elements claiming
         to be the current page is worse than none.

         `<span>` rather than a disabled link at the ends, because there is no
         such thing:
         an anchor with no `href` is not focusable and announces as plain text,
         which is exactly what "nowhere to go" should sound like. -->
    <span v-if="atStart" :class="cn(BOX, 'opacity-30')" aria-hidden>
      <img
        src="/assets/global/icon-arrow-left.svg"
        alt=""
        width="36"
        height="36"
        class="size-9 invert"
      >
    </span>
    <NuxtLink
      v-else
      :to="hrefFor(page - 1)"
      :aria-label="ALL_TOURNAMENTS_COPY.previousPage"
      :aria-current="undefined"
      :class="BOX"
    >
      <img
        src="/assets/global/icon-arrow-left.svg"
        alt=""
        width="36"
        height="36"
        class="size-9 invert"
      >
    </NuxtLink>

    <!-- Bebas 32/32 in white (`517:2720`). `tabular-nums` so the row does not
         twitch sideways as the digits change. -->
    <p
      class="font-display min-w-24 text-center text-[length:var(--text-display-caption)] leading-none text-white tabular-nums"
    >
      {{ ALL_TOURNAMENTS_COPY.pageOf(page, totalPages) }}
    </p>

    <span v-if="atEnd" :class="cn(BOX, 'opacity-30')" aria-hidden>
      <img
        src="/assets/global/icon-arrow-left.svg"
        alt=""
        width="36"
        height="36"
        class="size-9 rotate-180 invert"
      >
    </span>
    <NuxtLink
      v-else
      :to="hrefFor(page + 1)"
      :aria-label="ALL_TOURNAMENTS_COPY.nextPage"
      :aria-current="undefined"
      :class="BOX"
    >
      <img
        src="/assets/global/icon-arrow-left.svg"
        alt=""
        width="36"
        height="36"
        class="size-9 rotate-180 invert"
      >
    </NuxtLink>
  </nav>

  <!-- Spoken when the page changes: the grid swaps its cards without the
       document re-announcing itself, so a reader on a screen reader would
       otherwise have no confirmation that the link did anything. -->
  <p aria-live="polite" class="sr-only">
    {{ ALL_TOURNAMENTS_COPY.pageChanged(page, totalPages) }}
  </p>
</template>
