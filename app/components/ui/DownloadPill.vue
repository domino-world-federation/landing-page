<script setup lang="ts">
import type { ResourceDocument } from "~/lib/api/types"

/**
 * The file pill on a document card — Figma node `168:8542`.
 *
 * A 160px white box with a hairline border: the type and size on the left, a
 * download glyph on the right. Shared by both shelves because the design draws
 * one pill and uses it in both (`168:8542` and `168:8595` are the same frame).
 *
 * The label is `fileType` and `fileSize` rather than a written string, so a
 * document filed as a 45MB zip prints as one — Figma types "PDF (5.2MB)" into
 * every card, which is the template rather than four measurements.
 *
 * `download` is deliberately absent. `fileUrl` is `#` until a backend exists
 * (B2), and the attribute on a fragment link makes the browser try to save the
 * current page.
 */
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  document: ResourceDocument
  /** `%1` is the document title, `%2` the printed file description. */
  label: string
}>()

const attrs = useAttrs()
const passThrough = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

// Figma writes the size with no space ("5.2MB"); the feed stores "5.2 MB",
// which is what the rest of the site prints (S10, the Domino shelf). The feed's
// spelling wins — the design's is a typed placeholder, and two pages printing
// the same field two ways is the defect.
const description = computed(() =>
  props.document.fileSize
    ? `${props.document.fileType.toUpperCase()} (${props.document.fileSize})`
    : props.document.fileType.toUpperCase(),
)

const rootClass = computed(() =>
  cn(
    // The 160px box is the news shelves'; the Domino rulebook card draws the
    // same pill across the foot of a 560px panel (`360:15848`), so the width is
    // a default the caller can override rather than a fact about the pill.
    "rounded-btn focus-visible:ring-gold border-border-light relative z-10 flex w-40 shrink-0 items-center justify-between gap-2 border bg-white p-2 transition-colors hover:bg-[#f5f5f5] focus-visible:ring-2 focus-visible:outline-none",
    attrs.class as string | undefined,
  ),
)
</script>

<template>
  <a
    :href="document.fileUrl"
    v-bind="passThrough"
    :aria-label="
      label.replace('%1', document.title).replace('%2', description)
    "
    :class="rootClass"
  >
    <span
      aria-hidden
      class="font-sans text-ink-pill text-[length:var(--text-label-xs)] leading-6 font-medium uppercase"
    >
      {{ description }}
    </span>

    <span class="flex size-6 items-center justify-center">
      <!-- A 16px inline SVG sized in CSS. Drawn dark already, and this sits on
           white. -->
      <img
        src="/assets/global/icon-download.svg"
        alt=""
        width="16"
        height="16"
        class="size-4"
      >
    </span>
  </a>
</template>
