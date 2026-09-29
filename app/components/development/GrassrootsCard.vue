<script setup lang="ts">
import type { GrassrootsCardCopy } from "~/content/development/grassroots"

/**
 * One grassroots initiative — Figma node `192:14917` and its two siblings.
 *
 * A 32px-radius panel at 50% of `surface-card`, padded 28 all round: the
 * programme's family, its name, a paragraph, and then the photograph filling the
 * rest.
 *
 * **The picture is at the foot and it is the tall part of the card.** Figma
 * gives it a fixed 680px inside a card that hugs, so the text block sets the top
 * and the image takes everything under it. Reproduced as an aspect rather than a
 * height (`3/4` is 573 × 680 at design width, the card's own share of the row)
 * so it scales with the column instead of demanding 680px of a phone.
 *
 * `mt-auto` keeps it at the foot however many lines the body above it wraps to,
 * which is what keeps the three pictures on one line across the row.
 *
 * **Below `lg` the card lies on its side** (repo owner's call, 2026-09-28): a
 * 112px square photograph on the left and the copy beside it, the shape
 * Federation Members' benefit cards take on a phone. Stacked full-width, each
 * card was a paragraph over a picture the width of the screen — three of them
 * made the section some 1700px tall.
 */
defineProps<{
  /** `cms` is the card's field prefix in the page editor (`grassroots.cards.0`). */
  card: GrassrootsCardCopy & { cms?: string }
}>()
</script>

<template>
  <div
    class="flex h-full flex-row items-start gap-4 rounded-[var(--radius-feature)] bg-[var(--color-surface-card)]/50 p-4 lg:flex-col lg:items-stretch lg:gap-7 lg:p-7"
  >
    <div class="flex min-w-0 flex-col gap-1.5 lg:gap-3">
      <!-- The Bebas kicker that sat here — the programme's "family" — is gone;
           see `GRASSROOTS_CARDS` for why. The title carries the card on its own,
           which is what it was doing anyway. -->
      <h3
        v-cms="card.cms && `${card.cms}.title`"
        class="font-sans text-lg leading-[1.22] font-semibold text-white lg:text-[length:var(--text-body-lg)]"
      >
        {{ card.title }}
      </h3>

      <p
        v-cms="card.cms && `${card.cms}.body`"
        class="font-sans text-sm leading-6 text-white/60 lg:text-[length:var(--text-eyebrow)] lg:leading-8">
        {{ card.body }}
      </p>
    </div>

    <!-- 3:4 is the design's shape, and `max-h` is what stops it from setting the
         section's height. At 504px of card width the ratio alone gives a 672px
         picture and a 978px card, which puts this section at 1402 in a 1080
         window — a snap stop that does not fit its own stop. Capped, the crop
         tightens and the card comes back under the screen; `object-cover` means
         the picture loses its edges rather than distorting. -->
    <div
      class="relative order-first aspect-square w-28 shrink-0 overflow-hidden rounded-[var(--radius-glass)] lg:order-none lg:mt-auto lg:aspect-3/4 lg:max-h-[32dvh] lg:w-full"
    >
      <!-- One of three cards from `lg` up, one per row below it. The card is
           inset by the section's 80px padding and its own 28px, which the rough
           thirds below already allow for. -->
      <NuxtImg
        :src="card.image"
        :alt="card.imageAlt"
        :sizes="imageSizes({ xs: '112px', lg: '30vw' })"
        class="absolute inset-0 size-full object-cover"
      />
    </div>
  </div>
</template>
