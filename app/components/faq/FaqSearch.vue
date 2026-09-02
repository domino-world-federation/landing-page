<script setup lang="ts">
import { FAQ_PAGE_COPY } from "~/content/faq"

/**
 * The search box in the FAQ header — Figma node `176:11867`.
 *
 * **This one actually searches**, unlike the identical fields on `/news` and
 * `/gallery`. Those refuse in the open because there is no search endpoint and
 * nothing loaded to match against (D28, blocker B2); here the thing being
 * searched is the page's own copy, which is already in hand, so the field does
 * the obvious thing instead of apologising for not doing it.
 *
 * It searches the way this page already filters: a plain `GET` form to `/faq`,
 * the server matching questions and answers, the result a URL somebody can send
 * (D50). That also means it works with no JavaScript at all — a real form
 * submission, not a handler. No new mechanism was invented for it; `?q=` is the
 * same query-string filter `?category=` already is.
 *
 * The active category rides along in a hidden field, so searching inside a topic
 * stays inside it.
 */
defineProps<{ query?: string; category?: string }>()
</script>

<template>
  <!-- `min-w-0` on the form as well as the input: the form is a flex item in the
       header row and carries the implicit `auto` minimum the input has just
       given up (D29). -->
  <form
    action="/page/faq"
    method="get"
    role="search"
    class="flex w-full min-w-0 items-center gap-4 rounded-[var(--radius-glass)] bg-white/12 px-4 py-3.5 focus-within:ring-2 focus-within:ring-white/40 lg:max-w-[402px]"
  >
    <input v-if="category" type="hidden" name="category" :value="category">

    <label for="faq-search" class="sr-only">
      {{ FAQ_PAGE_COPY.searchLabel }}
    </label>
    <!-- Uncontrolled, with the URL's own term as its starting value: the query
         lives in the address bar, so holding a second copy of it in component
         state would be two sources for one fact.

         `w-0 flex-1`: a text input's default `size` is a preferred WIDTH of ~20
         characters, not a minimum, so lowering the floor alone leaves it asking
         for ~187px whenever anything measures the box (D29). -->
    <input
      id="faq-search"
      type="search"
      name="q"
      :value="query ?? ''"
      :placeholder="FAQ_PAGE_COPY.searchPlaceholder"
      class="font-sans w-0 flex-1 bg-transparent text-[length:var(--text-eyebrow)] leading-8 text-white placeholder:text-white/60 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
    >
    <button
      type="submit"
      :aria-label="FAQ_PAGE_COPY.searchLabel"
      class="focus-visible:ring-gold flex size-9 shrink-0 items-center justify-center rounded-[4px] transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:outline-none"
    >
      <!-- A 36px inline SVG sized in CSS. Drawn in white already, so no
           `invert`. -->
      <img
        src="/assets/global/icon-search.svg"
        alt=""
        width="36"
        height="36"
        class="size-9"
      >
    </button>
  </form>
</template>
