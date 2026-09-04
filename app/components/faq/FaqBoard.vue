<script setup lang="ts">
import type { Faq } from "~/lib/api/types"

/**
 * The question list on `/faq` — Figma node `613:23255`.
 *
 * **The white card is gone.** It was `174:10652`: the legal document's panel
 * with an accordion inside it, 20px radius and 60px of padding, black type on
 * white. The redraw takes it away entirely — the items sit straight on the
 * screen's own `#1B1B1B`, each one its own `rgba(255,255,255,0.08)` box at a
 * 16px radius with 24 between them, which is exactly the `dark` treatment S11
 * already gave `UiFaqAccordion` for the FAQ sections on the marketing pages.
 * So this component stopped drawing a card and started passing a tone; nothing
 * about the items themselves is written here.
 *
 * That also settles the page's one remaining light patch: the shell around it —
 * the header band, the side tabs with their gold bar and `#353535` rules, the
 * support card — was already the dark one the legal pages use. The card was the
 * only thing left over from the earlier screen.
 *
 * An empty result keeps a box rather than leaving a bare line on the ground: the
 * list IS the content area, and dropping its one visible edge makes the page
 * look broken rather than filtered.
 */
defineProps<{ items: readonly Faq[] }>()

defineSlots<{
  /** What to say when the filter or the search matched nothing. */
  empty: () => unknown
}>()
</script>

<template>
  <!-- No `default-open-id`. The design opens its second item (`613:24148`), and
       for a while this page passed that; the repo owner then set the rule for
       every FAQ on the site — the FIRST answer is the one left showing — and
       `UiFaqAccordion` states it as its own default. Passing anything here would
       be this one page disagreeing with the other five. -->
  <div
    v-if="items.length === 0"
    class="rounded-[var(--radius-item)] bg-white/[0.08] px-5 py-4 md:px-8 md:py-5"
  >
    <p class="font-sans text-[length:var(--text-faq-answer)] leading-[1.5] text-[#A3A3A3]">
      <slot name="empty" />
    </p>
  </div>

  <UiFaqAccordion v-else :items="items" tone="dark" />
</template>
