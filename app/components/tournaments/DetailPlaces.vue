<script setup lang="ts">
import type { TournamentDetail } from "~/lib/api/types"
import { TOURNAMENT_DETAIL_COPY } from "~/content/tournaments/detail"

/**
 * The venue and the prize pool, side by side — Figma node `517:1985`.
 *
 * Two 860-wide blocks, each 542 tall over a Bebas 76 line and a quieter line
 * under it. They are NOT the same kind of picture: the venue is a map of where
 * the tournament is played (see `VenueMap`), the prize is a photograph. Figma
 * draws them as one row because they answer the same shape of question — where,
 * and what for — not because they are the same object.
 *
 * The prize photograph carries Figma's own left-to-right wash (`517:2006`)
 * across its lower third, which stops it ending on a hard edge.
 *
 * **Either block can be absent and the row still works.** An online tournament
 * has no hall to photograph, and one that has not published a purse has no
 * prize line — `flex-wrap` with a `basis` rather than a two-column grid, so one
 * block left alone fills the row instead of sitting beside a hole.
 */
defineProps<{ tournament: TournamentDetail }>()

const COPY = TOURNAMENT_DETAIL_COPY

/**
 * Half the row minus half the gutter — NOT `basis-[860px]`.
 *
 * Figma's two 860s plus its 40px gutter come to exactly the 1760 the page's
 * margins leave, which is a row with nothing to spare. A basis in pixels wrapped
 * the moment the gap was a hair wider than 40, and the venue map then rendered
 * 1760 wide and 1109 tall — a map the height of the window. This is the same
 * number at the design width and cannot overflow at any other.
 */
const COLUMN =
  "flex min-w-0 flex-1 basis-full flex-col gap-8 lg:basis-[calc(50%-1.25rem)] lg:gap-11"

/**
 * 542/860 — the picture's proportion, carried instead of its pixels so the block
 * keeps its shape as the column narrows.
 *
 * **A drop shadow was the wrong answer here, and it is worth writing down why.**
 * Three rounds went into making one visible; it cannot be. Two measurements
 * settle it. The page is `#0E0E0E` — 14 of 255 — so a black shadow has fourteen
 * levels to work in and no CSS buys a fifteenth. And there are only 44px of
 * clear space between the card's foot and the heading under it (Figma's own gap
 * of 44), so a shadow blurred wide enough to read lands behind the type rather
 * than on the ground.
 *
 * Figma agrees: `517:1987` and `517:2004` carry NO effect. The only shadow on
 * this screen is on the white overview panel (`517:2044`), where there is a
 * light card on a dark page for one to fall from.
 *
 * What the design actually has at the foot of these cards is `FADE` below — the
 * picture itself going dark into the page, so the card has no bottom edge. That
 * is what reads as a shadow. A small drop shadow stays as well, sized to the
 * 44px it actually has: it is the hairline that keeps a BRIGHT photograph from
 * ending on a hard cut, which is the one case the fade cannot cover.
 */
const SHADOW = "shadow-[0_14px_28px_-10px_rgba(0,0,0,1)]"

/**
 * The picture's own foot, going dark into the page.
 *
 * Figma draws this on both blocks (`517:1989`, `517:2006`) and it is the reason
 * the design's cards look seated: the photograph loses its bottom edge instead
 * of being cut off at one. On the map it doubles as the thing that keeps street
 * labels from running into the heading below.
 */
const FADE =
  "pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-[linear-gradient(180deg,rgba(14,14,14,0)_0%,rgba(14,14,14,0.75)_62%,rgba(14,14,14,1)_100%)]"

const PICTURE =
  `aspect-[860/542] w-full overflow-hidden rounded-[var(--radius-card)] ${SHADOW}`
/**
 * The wash across the lower third (`517:2006`), left to transparent.
 *
 * Figma draws it as a 861 × 205 rectangle, which has a hard top edge — and a
 * hard edge is exactly what it looked like: a horizontal line ruled across the
 * photograph at 62% of its height, darker on the left, with the join visible
 * straight through the picture. In Figma that edge lands on a pale studio
 * background where it barely registers; on the photograph the feed actually
 * serves, it reads as a rendering fault.
 *
 * So the gradient is Figma's and the EDGE is not: `mask-image` fades the whole
 * band in from nothing over its top half, which is what the rectangle was
 * standing in for. The colour ramp left-to-right is untouched.
 */
const WASH =
  "pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(90deg,rgba(14,14,14,1)_0%,rgba(27,27,27,0)_100%)] [mask-image:linear-gradient(to_bottom,transparent_0%,#000_65%)]"
</script>

<template>
  <section
    v-if="tournament.venue || tournament.prize"
    class="flex flex-wrap gap-10 px-5 py-16 md:px-10 lg:px-20 lg:py-[3.13vw]"
  >
    <div
      v-if="tournament.venue"
      :aria-label="COPY.venue.label"
      :class="COLUMN"
    >
      <!-- The map (`517:1987`), not a picture of the building — see
           `VenueMap`. No wash over it: the gradient exists to keep the pin card
           legible against a photograph, and a map that has already been darkened
           does not need one. -->
      <MotionReveal :y="32" :class="cn('rounded-[var(--radius-card)]', SHADOW)">
        <TournamentsVenueMap :venue="tournament.venue" />
      </MotionReveal>

      <div class="flex flex-col gap-6">
        <MotionReveal :y="24">
          <h2
            class="font-display text-[length:var(--text-display-sm)] leading-[0.95] text-white uppercase"
          >
            {{ tournament.venue.name }}
          </h2>
        </MotionReveal>

        <p class="flex items-start gap-3">
          <!-- No `invert`. This glyph is `fill="white"` in the file, unlike the
               dark-on-white ones the document cards use — inverting it painted
               it black, and at 40% on a `#0E0E0E` page that is a pin nobody can
               see. The design has it the same weight as the line beside it. -->
          <img
            src="/assets/global/icon-location.svg"
            alt=""
            aria-hidden="true"
            width="36"
            height="36"
            class="size-9 shrink-0 opacity-40"
          >
          <span
            class="font-sans text-[length:var(--text-body-md)] leading-[1.29] text-white/40"
          >
            {{ tournament.venue.address }}
          </span>
        </p>
      </div>
    </div>

    <div
      v-if="tournament.prize"
      :aria-label="COPY.prize.label"
      :class="COLUMN"
    >
      <!-- The two gradients live INSIDE the entrance, not beside it. They were
           siblings of `MotionReveal`, anchored to a static wrapper — so the
           photograph rose 32px on the way in while its own wash and fade stayed
           where they were, and for the length of the entrance the card had a
           dark band floating below a picture that had already left it. Anything
           painted ON the picture has to travel WITH the picture.

           `PICTURE` carries `overflow-hidden`, so the two are also clipped to
           the card's radius now instead of squaring off its corners. -->
      <MotionReveal :y="32" :class="PICTURE">
        <NuxtImg
          :src="tournament.prize.imageUrl"
          :alt="tournament.prize.imageAlt"
          :sizes="imageSizes({ xs: '100vw', lg: '860px' })"
          :quality="90"
          class="absolute inset-0 size-full object-cover"
        />
        <span :class="WASH" aria-hidden />
        <span :class="FADE" aria-hidden />
      </MotionReveal>

      <div class="flex flex-col gap-6">
        <MotionReveal :y="24">
          <h2
            class="font-display text-[length:var(--text-display-sm)] leading-[0.95] text-white uppercase"
          >
            {{ tournament.prize.headline }}
          </h2>
        </MotionReveal>

        <p
          class="font-sans text-[length:var(--text-body-md)] leading-[1.29] text-white/40"
        >
          {{ tournament.prize.note }}
        </p>
      </div>
    </div>
  </section>
</template>
