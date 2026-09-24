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

const notifyOpen = ref(false)

/**
 * The gold button's dress, shared by the three controls that take it.
 *
 * A constant rather than three copies: they are one button in the design and
 * only their label and their behaviour differ, so a change to the shape that
 * reached two of the three would be the kind of drift nobody notices until the
 * states are seen side by side — which they never are, because only one is on
 * screen at a time.
 */
const GOLD_BUTTON =
  "rounded-btn font-display focus-visible:ring-gold bg-gold flex h-18 w-full items-center justify-center px-5 text-[length:var(--text-display-btn)] leading-10 text-black uppercase transition-colors hover:bg-[var(--color-gold-btn-light)] focus-visible:ring-2 focus-visible:outline-none"

const named = (template: string) => template.replace("%s", props.event.name)

/**
 * Which action stands beside "View details", and there are five answers.
 *
 * **`status` is read FIRST, and that ordering is the whole rule.** A tournament
 * being played has one thing to offer whatever its entries are doing, and a
 * tournament that is over has none. Only once neither applies does the question
 * become "can this reader still enter", which is what `registration` answers:
 *
 *   status `completed`                     → details alone
 *   status `live`                          → Watch live
 *   status `upcoming`, entries `upcoming`  → Notify me
 *   status `upcoming`, entries `open`      → Register
 *   status `upcoming`, entries `closed`    → details alone
 *
 * Reading `registration` first is the mistake this is written to avoid: a
 * tournament in its final day whose entries shut a month ago is `closed`, and
 * on that reading the band would offer nothing while the match was actually
 * being played.
 *
 * `null` is a state, not a fallthrough — two of the five have no second button,
 * and "View details" standing alone is the design's answer for both.
 */
const action = computed<"watch" | "notify" | "register" | null>(() => {
  const { status, registration } = props.event

  if (status === "completed") return null
  if (status === "live") return "watch"

  if (registration === "upcoming") return "notify"
  if (registration === "open") return "register"

  return null
})
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
           appears.

           ONE type size for both, on the owner's request (2026-09-18). Figma
           sets them apart — DETAILS in Bebas 32/40, REGISTER FOR EVENT in 36/44
           (`561:13321`, `561:13323`) — and two stacked buttons of the same
           height and width read as a mismatch when their words are not the same
           size. Both now take `display-btn`, the site's standard button size;
           colour is what marks the primary. -->
      <!-- Always drawn, and always first: it is the one thing every state can
           offer, and Figma puts the grey above the gold. The second button is
           what changes — see `action`. -->
      <NuxtLink
        :to="detailsHref"
        :aria-label="named(FEATURED_EVENT_COPY.detailsLabel)"
        class="rounded-btn font-display focus-visible:ring-gold flex h-18 items-center justify-center bg-[var(--color-surface-grey)] px-5 text-[length:var(--text-display-btn)] leading-10 text-black uppercase transition-colors hover:bg-[#c8c8c8] focus-visible:ring-2 focus-visible:outline-none"
      >
        {{ FEATURED_EVENT_COPY.details }}
      </NuxtLink>

      <NuxtLink
        v-if="action === 'register'"
        :to="event.registerUrl ?? REGISTER_FALLBACK"
        :aria-label="named(FEATURED_EVENT_COPY.registerLabel)"
        :class="GOLD_BUTTON"
      >
        {{ FEATURED_EVENT_COPY.register }}
      </NuxtLink>

      <!-- A real dialog against a real endpoint, unlike the two controls on the
           tournaments hero: the reminder list exists, so this one does the
           thing rather than apologising for it. -->
      <button
        v-else-if="action === 'notify'"
        type="button"
        :aria-label="named(FEATURED_EVENT_COPY.notifyLabel)"
        :class="GOLD_BUTTON"
        @click="notifyOpen = true"
      >
        {{ FEATURED_EVENT_COPY.notify }}
      </button>

      <!-- No stream, and no field anywhere to hold its address. A link to
           nowhere is a lie and a disabled button takes the design's shape off
           the page, so the button stays a button and says why when pressed
           (D28). `notice` is dark here because this band is the site's one
           white ground. -->
      <TournamentsUnavailableButton
        v-else-if="action === 'watch'"
        block
        :notice="FEATURED_EVENT_COPY.watchLiveUnavailable"
        notice-class="text-black/60"
        :aria-label="named(FEATURED_EVENT_COPY.watchLiveLabel)"
        :class="GOLD_BUTTON"
      >
        {{ FEATURED_EVENT_COPY.watchLive }}
      </TournamentsUnavailableButton>
    </div>

    <TournamentsNotifyDialog
      v-if="action === 'notify'"
      v-model="notifyOpen"
      :tournament-id="event.id"
      :event-name="event.name"
    />
  </div>
</template>
