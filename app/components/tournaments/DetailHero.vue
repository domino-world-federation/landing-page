<script setup lang="ts">
import type { TournamentDetail } from "~/lib/api/types"
import { TOURNAMENT_DETAIL_COPY } from "~/content/tournaments/detail"

/**
 * The photograph band under the detail page's header — Figma node `517:1910`.
 *
 * A full-bleed picture with the registration tab clipped to its top edge and an
 * info bar washed over its foot: the dates and the place in the gold fall, and
 * the page's one primary action on the right.
 *
 * **The tab is the card's tab, reused.** `517:1924` is the same trapezoid the
 * rail's cards carry at 436 wide instead of 360, so it is the same asset at a
 * different size rather than a second shape — and, like the card, it is absent
 * where there is no registration state to report (`ongoing`).
 *
 * **The button follows the registration state**, which is the same decision the
 * card's foot makes and for the same reasons: entries open → "Register",
 * under way → "Watch live", not yet open → "Notify me". None of them can act
 * (B2), so each refuses in the open rather than navigating nowhere (D28) — and
 * "Notify me" raises the dialog the tournament page already carries, which is
 * the one that CAN take an address the day there is somewhere to send it.
 */
const props = defineProps<{ tournament: TournamentDetail }>()

const COPY = TOURNAMENT_DETAIL_COPY

const named = (template: string) => template.replace("%s", props.tournament.name)

const action = computed(() => {
  if (props.tournament.registration === "ongoing") {
    return {
      label: COPY.watchLive,
      a11y: named(COPY.watchLiveLabel),
      icon: "/assets/tournaments/icon-live-stream.svg",
      notify: false,
    }
  }

  if (props.tournament.registration === "open") {
    return {
      label: COPY.register,
      a11y: named(COPY.registerLabel),
      icon: undefined,
      notify: false,
    }
  }

  // `upcoming` and `closed` both land here. The reminder is the honest offer for
  // entries that have not opened; for entries that are over it is the only
  // thing left to offer, and the dialog says plainly that there is no list yet.
  return {
    label: COPY.notify,
    a11y: named(COPY.notifyLabel),
    icon: "/assets/global/icon-notification.svg",
    notify: true,
  }
})

const notifyOpen = ref(false)
</script>

<template>
  <section :aria-label="tournament.name" class="relative isolate overflow-hidden">
    <!-- 1920 × 1080 in Figma, which is a screen. `aspect` rather than a height
         so the band keeps its proportion on a phone instead of becoming a
         letterbox; the floor stops it collapsing below something worth
         looking at. -->
    <NuxtImg
      :src="tournament.heroImageUrl"
      :alt="tournament.heroImageAlt"
      :sizes="imageSizes({ xs: '100vw' })"
      :quality="90"
      class="min-h-[420px] w-full object-cover lg:aspect-[1920/1080] lg:min-h-0"
    />

    <!-- The tab, clipped to the picture's top edge (`517:1923`). 436/1920 wide
         and centred, which is where Figma places it (x=742 of 1920). -->
    <div
      v-if="tournament.registrationLabel"
      class="absolute top-0 left-1/2 h-12 w-[min(90vw,436px)] -translate-x-1/2"
    >
      <img
        src="/assets/tournaments/decor-card-label.svg"
        alt=""
        aria-hidden="true"
        width="436"
        height="48"
        class="absolute inset-0 size-full"
      >
      <p class="relative flex size-full items-center justify-center">
        <!-- One line, whatever the label says: the tab is 48px tall and has no
             room for a second. Same rule the card's tab carries. -->
        <span
          class="font-sans px-6 text-center text-[length:clamp(0.75rem,1.25vw,1.5rem)] leading-[1.33] font-medium whitespace-nowrap text-white/60"
        >
          {{ tournament.registrationLabel }}
        </span>
      </p>
    </div>

    <!-- The info bar (`517:1912`). Absolute over the picture's foot at the
         design width and static below `lg`: at 1080 it sits inside the band, but
         on a phone the two gold headlines and a 72px button are most of the
         picture's height, so it goes under it rather than over.

         The wash is Figma's own gradient to `#0E0E0E` plus a 15px backdrop blur
         — the blur is what keeps 76px of gold readable over whatever the
         photograph happens to be doing there. -->
    <div
      class="bg-[linear-gradient(180deg,rgba(48,48,48,0)_0%,rgba(14,14,14,0.5)_41%,rgba(14,14,14,1)_91%)] px-5 py-10 md:px-10 lg:absolute lg:inset-x-0 lg:bottom-0 lg:px-20 lg:py-[4.17vw] lg:backdrop-blur-[15px]"
    >
      <div
        class="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16"
      >
        <dl class="flex flex-wrap gap-10 lg:gap-[4.79vw]">
          <div class="flex flex-col gap-3 lg:gap-6">
            <dt
              class="font-sans text-[length:var(--text-display-caption)] leading-[1.25] font-medium text-white/80"
            >
              {{ COPY.dateLabel }}
            </dt>
            <dd
              class="font-display text-gold-gradient text-[length:var(--text-display-sm)] leading-[0.95] uppercase"
            >
              {{ tournament.dateHeading }}
            </dd>
          </div>

          <div class="flex flex-col gap-3 lg:gap-6">
            <dt
              class="font-sans text-[length:var(--text-display-caption)] leading-[1.25] font-medium text-white/80"
            >
              {{ COPY.locationLabel }}
            </dt>
            <dd
              class="font-display text-gold-gradient text-[length:var(--text-display-sm)] leading-[0.95] uppercase"
            >
              {{ tournament.location }}
            </dd>
          </div>
        </dl>

        <!-- 292 × 72 gold (`517:1920`). The reminder raises the dialog; the
             other two have nothing behind them and say so. -->
        <button
          v-if="action.notify"
          type="button"
          :aria-label="action.a11y"
          class="rounded-btn font-display bg-gold focus-visible:ring-gold flex h-18 w-full shrink-0 items-center justify-center gap-3 px-5 text-[length:var(--text-display-btn)] leading-10 text-black uppercase transition-colors hover:bg-[var(--color-gold-btn-light)] focus-visible:ring-2 focus-visible:outline-none lg:w-[292px]"
          @click="notifyOpen = true"
        >
          {{ action.label }}
          <img
            src="/assets/global/icon-notification.svg"
            alt=""
            aria-hidden="true"
            width="32"
            height="32"
            class="size-8 shrink-0"
          >
        </button>

        <TournamentsUnavailableButton
          v-else
          :notice="COPY.unavailable"
          :aria-label="action.a11y"
          class="rounded-btn font-display bg-gold focus-visible:ring-gold flex h-18 w-full items-center justify-center gap-3 px-5 text-[length:var(--text-display-btn)] leading-10 text-black uppercase transition-colors hover:bg-[var(--color-gold-btn-light)] focus-visible:ring-2 focus-visible:outline-none lg:w-[292px]"
        >
          {{ action.label }}
          <img
            v-if="action.icon"
            :src="action.icon"
            alt=""
            aria-hidden="true"
            width="32"
            height="32"
            class="size-8 shrink-0"
          >
        </TournamentsUnavailableButton>
      </div>
    </div>

    <TournamentsNotifyDialog
      v-model="notifyOpen"
      :tournament-id="tournament.id"
      :event-name="tournament.name"
    />
  </section>
</template>
