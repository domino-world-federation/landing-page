<script setup lang="ts">
import type { ShowcaseEvent } from "~/lib/api/types"
import { FEATURED_EVENT_COPY } from "~/content/event-showcase"

/**
 * The right column — the summary and the two buttons, pinned to opposite ends of
 * the card's height in Figma (`561:13317`, `justifyContent: space-between`).
 *
 * That split only holds where the column is as tall as the card, so it is
 * `menu-lg` and up — the same breakpoint the row itself starts at; stacked below
 * that, the buttons simply follow the prose.
 *
 * The height comes from the ROW rather than from a number here. `EventShowcase`
 * sets the 540 once and stretches all three columns to it, which is what keeps
 * this column, the picture and the left column in register — a height computed
 * separately here would agree with the card only as long as nobody edited one of
 * them.
 *
 * **Both buttons now land somewhere real, and neither number is invented here.**
 * `detailsUrl` and `registerUrl` are still the API's to give and the mock still
 * leaves them unset on purpose, so the shape of the real response is what is
 * being built against (RULES §8) — what changed is the fallback. It used to be
 * `#` for both, from when the portal that will host event pages did not exist;
 * the tournament detail route does exist now, and the event carries the `slug`
 * that addresses it, so "Details" can be derived rather than waited for.
 *
 * "Register" goes to `/contact`. There is no registration form anywhere in the
 * design or the build, and a button that opens nothing is the silent no-op D28
 * forbids — the contact page is where a reader asking to enter an event is
 * actually answered today. It is a fallback, so the day the API returns a real
 * registration URL this stops applying without a code change.
 */
const REGISTER_FALLBACK = "/contact"

const props = defineProps<{ event: ShowcaseEvent }>()

/** `/tournaments/[slug]` — the page the showcase's own `slug` addresses. */
const detailsHref = computed(
  () => props.event.detailsUrl ?? `/tournaments/${props.event.slug}`,
)
</script>

<template>
  <div
    class="flex flex-col justify-between gap-10 menu-lg:h-full menu-lg:gap-0"
  >
    <p
      aria-live="polite"
      class="font-sans text-xl leading-8 text-[var(--color-ink-body)]"
    >
      {{ event.summary }}
    </p>

    <div class="flex flex-col gap-5">
      <!-- 72px tall in Figma, both of them (`561:13320`, `561:13322`), and
           unchanged by the redraw. The secondary is the page's divider grey; the
           primary is the brand gold — the only place on this white band the gold
           appears. -->
      <NuxtLink
        :to="detailsHref"
        class="rounded-btn font-display focus-visible:ring-gold flex h-18 items-center justify-center bg-[var(--color-surface-grey)] px-5 text-[length:var(--text-display-btn)] leading-10 text-black uppercase transition-colors hover:bg-[#c8c8c8] focus-visible:ring-2 focus-visible:outline-none"
      >
        {{ FEATURED_EVENT_COPY.details }}
      </NuxtLink>

      <NuxtLink
        :to="event.registerUrl ?? REGISTER_FALLBACK"
        class="rounded-btn font-display focus-visible:ring-gold bg-gold flex h-18 items-center justify-center px-5 text-[length:var(--text-display-cta)] leading-11 text-black uppercase transition-colors hover:bg-[var(--color-gold-btn-light)] focus-visible:ring-2 focus-visible:outline-none"
      >
        {{ FEATURED_EVENT_COPY.register }}
      </NuxtLink>
    </div>
  </div>
</template>
