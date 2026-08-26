<script setup lang="ts">
import type { ShowcaseEvent } from "~/lib/api/types"
import { TOURNAMENTS_COPY } from "~/content/tournaments"

/**
 * Highlighted Tournaments — Figma node `372:17314`.
 *
 * The landing page's S6 band again: an eyebrow, then the name and its two
 * fields, the gold-lit card, and the summary above two buttons. Same three
 * columns, same 100px gutter, same 520 × 720 card.
 *
 * **It is not `EventShowcase`.** That component carries state, and it carries it
 * for one reason — the pager that steps six events through the three columns.
 * This block has no pager: the design draws one tournament and no arrows, so
 * there is nothing to hold, and reusing S6 would mean making its pager optional,
 * changing its button copy and shipping interactivity to render three static
 * columns. D57's line, applied: rewriting a finished component to share it with
 * a different job is regression risk without a payoff.
 *
 * **The card carries the event's own artwork**, as S6's does, rather than the
 * photograph Figma drops into the frame here — that image is a picture of an
 * empty canteen (`372:17402`), which is a placeholder rather than a tournament.
 * The frame around it is the design's: the gold radial, the 12px radius, and the
 * DWF2026 wordmark across the foot.
 */
defineProps<{ event: ShowcaseEvent }>()
</script>

<template>
  <section
    aria-labelledby="highlighted-heading"
    class="bg-white px-5 py-16 md:px-10 lg:px-20 lg:py-[3.125vw]"
  >
    <div class="flex flex-col gap-10 menu:flex-row menu:gap-[2.29vw]">
      <!-- Inter Medium 20/28 in black, held to 161px in the design so it sets as
           three short lines beside the band (`372:17315`). -->
      <h2
        id="highlighted-heading"
        class="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-black uppercase menu:w-[161px] menu:shrink-0"
      >
        {{ TOURNAMENTS_COPY.highlighted.eyebrow }}
      </h2>

      <div class="flex flex-col items-start gap-10 menu:flex-row menu:gap-[5.2vw]">
        <!-- The three columns are proportional rather than Figma's literal
             380 + 520 + 380, for the reason D14 records: the literal widths plus
             two 100px gutters need 1772px of window before they fit, and the
             page scrolled sideways below that. -->
        <div
          class="flex w-full flex-col gap-8 menu:max-w-[380px] menu:flex-1 menu:basis-0 lg:gap-12"
        >
          <!-- Bebas 76/72. `text-balance` reproduces the design's own break — it
               writes the name as three lines, and plain wrapping fills each line
               before moving on. -->
          <h3
            class="font-display text-[length:var(--text-display-sm)] leading-[0.95] text-balance text-black uppercase"
          >
            {{ event.name }}
          </h3>

          <!-- 258px in Figma (`372:17319`), not the column's full 380. -->
          <dl class="flex w-full flex-col gap-5 lg:w-[258px]">
            <TournamentsHighlightedField
              :label="TOURNAMENTS_COPY.highlighted.dateLabel"
              :value="event.dateLabel"
            />
            <TournamentsHighlightedField
              :label="TOURNAMENTS_COPY.highlighted.locationLabel"
              :value="event.location"
            />
          </dl>
        </div>

        <!-- 27.08vw is 520/1920, so the design width renders the card at exactly
             its Figma size and narrower windows scale it with them. -->
        <MotionReveal :y="32" class="mx-auto menu:mx-0 menu:w-[27.08vw]">
          <div
            class="relative flex aspect-[520/720] w-full max-w-[520px] items-end justify-center overflow-hidden rounded-[var(--radius-glass)] bg-[radial-gradient(circle_at_117%_-2%,#c3ae86_0%,#4f4332_100%)]"
          >
            <NuxtImg
              :src="event.imageUrl"
              :alt="event.imageAlt"
              :sizes="imageSizes({ xs: '90vw', menu: '27vw' })"
              class="absolute inset-0 size-full object-contain"
            />

            <!-- Bebas 164 across the foot (`373:17404`). Decorative — the
                 heading beside it names the event. -->
            <p
              aria-hidden
              class="font-display relative pb-6 text-[8.54vw] leading-none tracking-[-0.0488em] text-white"
            >
              {{ TOURNAMENTS_COPY.hero.watermark }}
            </p>
          </div>
        </MotionReveal>

        <div
          class="flex w-full flex-col justify-between gap-10 menu:h-[min(720px,37.5vw)] menu:max-w-[380px] menu:flex-1 menu:basis-0 menu:gap-0"
        >
          <p class="font-sans text-xl leading-8 text-[var(--color-ink-body)]">
            {{ event.summary }}
          </p>

          <div class="flex flex-col gap-5">
            <!-- 72px tall, both of them (`372:17352`, `372:17354`). -->
            <NuxtLink
              :to="event.detailsUrl ?? '#'"
              class="rounded-btn font-display focus-visible:ring-gold flex h-18 items-center justify-center bg-[var(--color-surface-grey)] px-5 text-[length:var(--text-display-btn)] leading-10 text-black uppercase transition-colors hover:bg-[#c8c8c8] focus-visible:ring-2 focus-visible:outline-none"
            >
              {{ TOURNAMENTS_COPY.highlighted.details }}
            </NuxtLink>

            <TournamentsUnavailableButton
              :notice="TOURNAMENTS_COPY.highlighted.notifyUnavailable"
              notice-class="text-muted"
              class="rounded-btn font-display focus-visible:ring-gold bg-gold flex h-18 w-full items-center justify-center gap-3 px-5 text-[length:var(--text-display-cta)] leading-11 text-black uppercase transition-colors hover:bg-[var(--color-gold-btn-light)] focus-visible:ring-2 focus-visible:outline-none"
            >
              {{ TOURNAMENTS_COPY.highlighted.notify }}
              <img
                src="/assets/tournaments/icon-notification.svg"
                alt=""
                width="32"
                height="32"
                class="size-8"
              >
            </TournamentsUnavailableButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
