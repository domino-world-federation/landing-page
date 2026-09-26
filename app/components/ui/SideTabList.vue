<script setup lang="ts">
/**
 * The side-tab column's chrome — Figma nodes `174:11226` (terms) and `173:10082`
 * (gallery).
 *
 * Both pages draw the identical list: rows of Bebas 32/40 separated by 1px
 * hairlines, the current one marked with a 4px gold bar in the margin and gold
 * type. Only the meaning differs — the terms column is a table of contents that
 * jumps within the document, the gallery column filters the page to one event —
 * so what is shared here is the appearance, and each page keeps its own idea of
 * which row is current.
 */
defineProps<{
  /** Names the column for assistive tech. */
  label: string
  /**
   * The small grey line above the list, where a page has one — the terms column
   * is headed "Table of Contents"; the gallery column is not headed at all.
   */
  heading?: string
}>()

/**
 * ── Below `lg` the column is a ROW ──
 *
 * A stack of six Bebas rows costs most of a phone screen before the content it
 * filters has started, and on the FAQ page it pushed the answers below the
 * fold entirely. Wide screens keep the column the design draws; narrow ones get
 * the horizontal strip every other filter on this site already uses.
 *
 * The marker moves with it. A 4px bar in the left margin only reads as "this
 * one" while the rows are stacked; laid side by side it sits between two tabs
 * and belongs to neither, so the row wears an underline instead — see
 * `SideTab`.
 */
const list = useTemplateRef<HTMLOListElement>("list")
const route = useRoute()

/**
 * Put the current tab at the strip's left edge.
 *
 * A reader arriving on a filtered URL — `/news?category=tournament`, a legal
 * page scrolled to a clause — would otherwise land on a strip showing the FIRST
 * tab, with the one they are actually on somewhere off the right edge and no
 * sign it exists.
 *
 * Measured off bounding boxes rather than `offsetLeft`, which is relative to
 * whichever ancestor happens to be positioned and is not this element on every
 * page that uses the list. Only `scrollLeft` is touched, so the page itself
 * never moves — `scrollIntoView` would have dragged the whole document.
 */
function bringActiveIntoView() {
  const el = list.value
  const active = el?.querySelector<HTMLElement>("[aria-current]")
  if (!el || !active) return

  el.scrollLeft += active.getBoundingClientRect().left - el.getBoundingClientRect().left
}

onMounted(bringActiveIntoView)

// The active row is decided by the route on every one of these lists, so the
// route changing is when it moves. `nextTick` because the new tab has to BE
// marked before it can be scrolled to.
watch(() => route.fullPath, () => nextTick(bringActiveIntoView))
</script>

<template>
  <nav :aria-label="label" class="flex flex-col gap-2">
    <p
      v-if="heading"
      class="font-sans text-label-muted text-[length:var(--text-eyebrow)] leading-7 font-medium"
    >
      {{ heading }}
    </p>
    <!-- The scrollbar is hidden, not removed: the strip still scrolls by drag,
         wheel and keyboard. Same treatment the news rail and the heritage
         timeline give their own horizontal tracks. -->
    <ol
      ref="list"
      class="flex snap-x gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] lg:flex-col lg:gap-0 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
    >
      <slot />
    </ol>
  </nav>
</template>
