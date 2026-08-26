<script setup lang="ts">
import type { SubCommittee } from "~/lib/api/types"

/**
 * One committee — Figma `115:3717` and its five siblings.
 *
 * A link when there is somewhere to go and a `<div>` otherwise. A card that
 * looks like a link, hovers like one and leads nowhere is worse than one that
 * plainly does not lead anywhere yet — and an `<a>` without `href` is not
 * focusable, so it would also be a control the keyboard cannot reach.
 *
 * The name is stored in its natural case and shouted by CSS (RULES §9): Figma
 * types two of the six in lower case, which is a text-entry slip, and
 * `uppercase` is what makes all six uniform without editing the data.
 */
const props = defineProps<{ committee: SubCommittee }>()

const BASE =
  "flex w-full items-center justify-between gap-4 rounded-[20px] bg-[var(--color-surface-light)] px-5 py-8 lg:px-[1.04vw] lg:py-[1.67vw]"

const rootClass = computed(() =>
  props.committee.href
    ? `${BASE} focus-visible:ring-gold transition-colors hover:bg-[var(--color-surface-grey)] focus-visible:ring-2 focus-visible:outline-none`
    : BASE,
)
</script>

<template>
  <component
    :is="committee.href ? 'a' : 'div'"
    :href="committee.href || undefined"
    :class="rootClass"
  >
    <span
      class="font-display text-[length:var(--text-display-label)] leading-[1.22] text-black uppercase"
    >
      {{ committee.name }}
    </span>

    <!-- The arrow's box, not the arrow: Figma draws an 8px-padded white square
         with a hairline border, so the mark sits in a frame rather than beside
         the text. Empty alt — the arrow says "this opens", which the link
         already says. -->
    <span
      class="flex shrink-0 items-center gap-3 rounded-[8px] border border-[var(--color-border-light)] p-2"
    >
      <img
        src="/assets/about/icon-committee-arrow.svg"
        alt=""
        width="20"
        height="20"
        class="size-5"
      >
    </span>
  </component>
</template>
