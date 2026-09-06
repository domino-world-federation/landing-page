<script setup lang="ts">
/**
 * The two-column body the side-tab pages share — 468 + 1452 at the design width
 * (`174:11225` beside `174:11257`, and the same split on privacy, gallery and
 * all news).
 *
 * **The sidebar comes second in the source and is pulled back with `order`.** A
 * reader on a phone — and a screen reader at any width — should meet the content
 * before its index, rather than nine contents links or five filter tabs before
 * the first word.
 *
 * **`sticky` is opt-in, and it pins only the INDEX.** Every page here is long —
 * the terms document is 3553px at the design width — so a contents column that
 * scrolls away leaves the reader with no way back to it but the top of the page.
 * It was pinned once, as the whole column with a capped height and its own
 * `overflow-y`, and the repo owner asked for that back out: it put a scrollbar
 * down the middle of the page and cut the "Need Support?" card off at the bottom
 * of a box nobody thought to scroll.
 *
 * Both of those come from pinning the whole column. What is pinned now is the
 * `sidebar` slot alone; anything in `sidebarFooter` is sent to the FOOT of the
 * column, so the support card is never inside the box, can never be clipped by
 * one, and never travels up across the pinned index on its way past. The cap is `overflow-y: auto` rather than `scroll`, so on a window tall
 * enough for the tabs — which is most of them — no scrollbar is drawn at all.
 * It appears only where the alternative is tabs the reader cannot reach.
 *
 * Off by default: `/gallery` and `/news/all` keep the column that travels with
 * the page, which is what the design draws (`613:24376` is a plain column in
 * flow) and what was asked for.
 */
withDefaults(defineProps<{ sticky?: boolean }>(), { sticky: false })

defineSlots<{
  sidebar: () => unknown
  /** Stays in flow under the pinned index — never clipped by its box. */
  sidebarFooter?: () => unknown
  default: () => unknown
}>()
</script>

<template>
  <div
    class="flex flex-col gap-10 px-5 pb-16 md:px-10 lg:flex-row lg:items-start lg:gap-12 lg:px-20 lg:pb-24"
  >
    <!-- `self-stretch` when pinned, and it is what makes the pin work at all: a
         `sticky` child can only travel inside its containing block, and
         `items-start` on the row shrinks this column to its own content — so the
         index would unpin the moment the column's short box scrolled past,
         hundreds of pixels into a document thousands long. Stretched, the column
         is as tall as the article beside it and the index stays put for all of
         it. -->
    <div
      :class="[
        'flex flex-col gap-10 lg:order-first lg:w-[388px] lg:shrink-0',
        sticky && 'lg:self-stretch',
      ]"
    >
      <!-- `top` and the cap both read `--anchor-offset`, the same value an
           anchor jump stops at, so the pinned index sits exactly where a heading
           would — one number for both, in the stylesheet. -->
      <div
        :class="
          sticky
            ? 'lg:sticky lg:top-[var(--anchor-offset)] lg:max-h-[calc(100dvh-var(--anchor-offset)-2rem)] lg:overflow-y-auto'
            : undefined
        "
      >
        <slot name="sidebar" />
      </div>

      <!-- **Pushed to the foot of the column, and that is not decoration.**
           The column is stretched to the article's height so the index can stay
           pinned across it; anything left in normal flow beside the index sits
           near the TOP of that column and travels up past it as the reader
           scrolls — and being later in the DOM it paints straight over the
           pinned index. That is what happened the first time this was built.
           `mt-auto` sends it to the end of the column instead, where it meets
           the reader as the document runs out, which is also where a "need
           help?" card belongs. Below `lg` there is no free space in the column,
           so `auto` resolves to nothing and the card simply follows the tabs. -->
      <div :class="sticky && 'lg:mt-auto'">
        <slot name="sidebarFooter" />
      </div>
    </div>

    <div class="min-w-0 flex-1">
      <slot />
    </div>
  </div>
</template>
