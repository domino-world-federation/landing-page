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
 */
defineProps<{ card: GrassrootsCardCopy }>()
</script>

<template>
  <div
    class="flex h-full flex-col gap-7 rounded-[var(--radius-feature)] bg-[var(--color-surface-card)]/50 p-7"
  >
    <div class="flex flex-col gap-3">
      <!-- Bebas 32/40 at 50% — the programme's family, set above the name the
           way an eyebrow is. Not a heading: it repeats across cards, so
           announcing it as one would put two "Community" entries in the page
           outline. -->
      <p
        class="font-display text-[length:var(--text-display-caption)] leading-[1.25] text-white/50 uppercase"
      >
        {{ card.kicker }}
      </p>

      <h3
        class="font-sans text-[length:var(--text-body-lg)] leading-[1.22] font-semibold text-white"
      >
        {{ card.title }}
      </h3>

      <p class="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60">
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
      class="relative mt-auto aspect-3/4 w-full overflow-hidden rounded-[var(--radius-glass)] lg:max-h-[32dvh]"
    >
      <!-- One of three cards from `lg` up, one per row below it. The card is
           inset by the section's 80px padding and its own 28px, which the rough
           thirds below already allow for. -->
      <NuxtImg
        :src="card.image"
        :alt="card.imageAlt"
        :sizes="imageSizes({ xs: '100vw', lg: '30vw' })"
        class="absolute inset-0 size-full object-cover"
      />
    </div>
  </div>
</template>
