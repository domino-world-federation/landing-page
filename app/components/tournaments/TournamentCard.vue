<script setup lang="ts">
import type { Tournament } from "~/lib/api/types"
import { TOURNAMENTS_COPY } from "~/content/tournaments"

/**
 * The badge's fill per registration state — `373:17445` and `592:16889`.
 *
 * `ongoing` is BLUE, not the green it shared with `open`. The two are different
 * facts — entries are being taken, versus play is under way — and a badge that
 * gives them one colour is telling the reader they are the same thing. The
 * design separates them; this had them both green.
 *
 * The design's orange goes to `upcoming` rather than to `closed`, because the
 * cards it was drawn on are the ones whose tabs read "Registration opens …" —
 * amber for a date still ahead. `closed` then takes the card's own `#8A8A8A`,
 * the grey the format strip is already printed in: nothing to do here, and no
 * second warm colour competing with the state that still wants a reader.
 */
const PILL_TONE: Record<Tournament["registration"], string> = {
  open: "bg-[#609f6f]",
  upcoming: "bg-[#dc8223]",
  ongoing: "bg-[#2383ff]",
  closed: "bg-[#8a8a8a]",
}

/**
 * Where the tabs sit on the picture, as fractions of Figma's 620 × 413 frame
 * (`592:16868`). Percentages rather than pixels: the card is a fraction of the
 * rail at every width, so anything placed in pixels drifts off its mark the
 * moment the card is not 620 wide.
 */
/** 130/620 — where both tabs start, and 360/620 how wide they run. */
const TAB_LEFT = "left-[20.97%]"
const TAB_WIDTH = "w-[58.06%]"
/** 48/413. */
const TAB_HEIGHT = "h-[11.62%]"
/** 233/360 — the label's own text box, narrower than the tab because the tab is
 *  a trapezoid and its inner edge is the short one. */
const TAB_TEXT_WIDTH = "w-[64.7%]"

/**
 * One card on the tournament rail — Figma node `592:16867`.
 *
 * **The redraw turns it inside out.** It was a grey half-transparent panel with
 * the artwork at the foot: category and a bookmark on the top row, the name, a
 * registration pill beside the place, and a tall portrait poster under all of
 * it. It is now a 676-wide `#161616` card that OPENS with the picture — a
 * landscape 620 × 413 with a tab clipped to each of its long edges — and puts
 * the words underneath, ending on a gold "Register" button.
 *
 * The tabs are the same construction S6's card uses, and deliberately: the two
 * facts a reader wants from a tournament at a glance are when it is and how long
 * they have, and both sit on the picture's edges rather than being buried in the
 * copy. The difference is the fill — `#161616` here against S6's white, so the
 * tab reads as a bite of the card's own ground taken out of the photograph.
 *
 * **The bookmark is gone.** It was a control that could not act (B2) kept alive
 * because the design drew it; the design no longer does, and the button it
 * replaces with — "Register" — refuses in the same open way for the same reason.
 *
 * **The name is a link now.** It was not, and the note here said why: the portal
 * that would hold a tournament page did not exist, so a card that navigated
 * nowhere was the silent no-op D28 rules out. `/tournaments/[slug]` (`517:1895`)
 * is that page, so the destination is real — `href` on the record still wins
 * where the federation files one elsewhere, and the slug route is the fallback
 * rather than the other way round.
 */
const props = defineProps<{
  tournament: Tournament
  /**
   * Fill the column instead of taking the rail's card width.
   *
   * The rail is a horizontal scroller, so its cards are `min(85vw, 676px)` and
   * do not shrink — that is what makes the last one cut at the viewport edge.
   * `/tournaments/all` puts the same card in a two-column grid, where a card
   * that refuses to shrink overflows its cell at every width between the grid
   * turning 2-up and the column reaching 676.
   */
  fluid?: boolean
}>()

/** Where the card's name goes. See the note above. */
const href = computed(
  () => props.tournament.href ?? `/tournaments/${props.tournament.slug}`,
)

const label = computed(
  () => TOURNAMENTS_COPY.rail.registration[props.tournament.registration],
)

// Figma's 18px on the tabs as a fraction of the design width rather than a fixed
// size: the tab is 58% of a card that is itself a fraction of the rail, so on a
// phone it is ~180px wide and 18px held literally would put "Registration ends
// in 3 days" through both ends of it.
const TAB_TEXT = "text-[length:clamp(0.625rem,0.8333vw,1rem)]"

const tabClass = computed(() => cn("absolute", TAB_LEFT, TAB_WIDTH, TAB_HEIGHT))

/**
 * What the card's foot offers, which follows the registration state.
 *
 * `ongoing` is the only one that takes two buttons — a tournament being played
 * can be watched AND read about, where one that has not started has nothing to
 * watch. The gold one is always the primary; a second sits beside it in the
 * card's own 12% white, so the pair reads as one action and one aside rather
 * than as two equal choices.
 */
const actions = computed(() => {
  const c = TOURNAMENTS_COPY.rail
  const named = (template: string) => template.replace("%s", props.tournament.name)

  // `href` marks the ones that can actually DO the thing. "View detail" now can
  // — the tournament has a page — so it is a link rather than a button that
  // apologises. Everything else still refuses in the open (D28).
  if (props.tournament.registration === "ongoing") {
    return [
      {
        label: c.watchLive,
        a11y: named(c.watchLiveLabel),
        tone: "gold" as const,
        icon: "/assets/tournaments/icon-live-stream.svg",
        href: undefined,
      },
      {
        label: c.viewDetail,
        a11y: named(c.viewDetailLabel),
        tone: "quiet" as const,
        icon: undefined,
        href: href.value,
      },
    ]
  }

  // A reminder is only worth offering while there is still something to be
  // reminded ABOUT. `upcoming` gets it; `closed` — entries over — gets the card's
  // quiet button instead, because "Notify me" on a door that has already shut
  // promises a message that would never come.
  if (props.tournament.registration === "upcoming") {
    return [
      {
        label: c.notify,
        a11y: named(c.notifyLabel),
        tone: "gold" as const,
        icon: "/assets/tournaments/icon-notification.svg",
        href: undefined,
      },
    ]
  }

  if (props.tournament.registration === "closed") {
    return [
      {
        label: c.viewDetail,
        a11y: named(c.viewDetailLabel),
        tone: "quiet" as const,
        icon: undefined,
        href: href.value,
      },
    ]
  }

  return [
    {
      label: c.register,
      a11y: named(c.registerLabel),
      tone: "gold" as const,
      icon: undefined,
      href: undefined,
    },
  ]
})

/** Shared by the link and the button forms, so the two are the same object. */
const ACTION_BASE =
  "rounded-btn font-display focus-visible:ring-gold flex h-18 w-full items-center justify-center gap-3 px-5 text-[length:var(--text-display-btn)] leading-10 uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none"

function actionClass(tone: "gold" | "quiet") {
  return cn(
    ACTION_BASE,
    tone === "gold"
      ? "bg-gold text-black hover:bg-[var(--color-gold-btn-light)]"
      : "bg-white/12 text-white hover:bg-white/20",
  )
}
</script>

<template>
  <!-- 676 wide at 28 of padding on a 24 gap, `#161616`, 32px radius
       (`592:16867`). -->
  <article
    :class="
      cn(
        'flex flex-col gap-6 rounded-[32px] bg-[#161616] p-7',
        // **A fraction of the window, not a fixed 556.** 28.96vw is 556/1920,
        // so the design width renders the design's own card (`592:16867`: a
        // 500px picture inside 28px of padding) and every narrower window
        // scales it down instead of showing fewer of them. That is the point —
        // the width decides how many the rail holds, and at a fixed 556 a
        // 1600px window fit two and a half where the design shows three and the
        // edge of a fourth. On the slope the count never changes: three cards
        // and their two gaps stay the same share of the row at any width, so
        // the fourth is always cut rather than hidden.
        //
        // It is also what lets the name break where the design breaks it, after
        // `Domino` rather than after `Nations`. The measure scales with the
        // type, so the line that fits at 1920 still fits at 1600; a fixed card
        // with fluid type is what pushed the name onto a third line.
        //
        // Capped at the design's 556 so a very wide window stops enlarging the
        // card and lets the peek grow instead. Below `lg` the rail is a
        // one-card-at-a-time swipe and 85vw is the right answer there.
        fluid
          ? 'h-full w-full'
          : 'w-[85vw] shrink-0 snap-start lg:w-[28.96vw] lg:max-w-[556px]',
      )
    "
  >
    <!-- The picture. 620 × 413 in Figma at a 12px radius; the ratio is carried
         rather than the pixels so the tabs on it keep their places as the card
         narrows. -->
    <div class="relative aspect-[620/413] w-full">
      <NuxtImg
        :src="tournament.imageUrl"
        :alt="tournament.imageAlt"
        :sizes="imageSizes({ xs: '85vw', md: '676px' })"
        :quality="90"
        class="absolute inset-0 size-full rounded-[12px] object-cover"
      />

      <!-- The two tabs (`592:16870`, `592:16876`). One shape used twice: a
           trapezoid whose WIDE edge is the one it hangs from, so the lower tab
           is the same file turned over. The rotation is on the artwork alone —
           the label sits in its own element above it and stays the right way up.

           The shape is decorative and the words on it are not: they carry the
           dates and how long entries have left, so the SVG is `aria-hidden`
           scenery and the text is real text over it. -->
      <div :class="cn(tabClass, 'top-0')">
        <img
          src="/assets/tournaments/decor-card-label.svg"
          alt=""
          aria-hidden="true"
          width="360"
          height="48"
          class="absolute inset-0 size-full"
        >
        <p class="relative flex size-full items-center justify-center">
          <span
            :class="
              cn(
                'font-sans text-center leading-[1.4] font-medium text-white uppercase',
                TAB_TEXT,
                TAB_TEXT_WIDTH,
              )
            "
          >
            {{ tournament.dateLabel }}
          </span>
        </p>
      </div>

      <!-- Only where there IS a registration state to report. A tournament being
           played has neither a deadline nor an opening date, and the tab was
           printing one anyway. -->
      <div v-if="tournament.registrationLabel" :class="cn(tabClass, 'bottom-0')">
        <img
          src="/assets/tournaments/decor-card-label.svg"
          alt=""
          aria-hidden="true"
          width="360"
          height="48"
          class="absolute inset-0 size-full rotate-180"
        >
        <p class="relative flex size-full items-center justify-center">
          <!-- `whitespace-nowrap`, and it is not optional. The tab is 48px tall
               with no room for a second line, so "Registration ends in 21 days"
               wrapped and spilled out of the shape. One line that is allowed to
               run a little wide inside a 58%-of-card tab is the lesser fault —
               and the clamp's ceiling comes down to 16px so the longest of these
               labels still fits between the trapezoid's angled sides. -->
          <span
            :class="
              cn(
                'font-sans text-center leading-[1.4] font-medium whitespace-nowrap text-white',
                TAB_TEXT,
              )
            "
          >
            {{ tournament.registrationLabel }}
          </span>
        </p>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <!-- Bebas 32/40 at half opacity (`592:16884`). The attendance chip that
           stood beside it — "Offline" / "Online" (`592:16886`) — is gone on the
           repo owner's call: the card already carries a category, a state pill,
           a format line and two actions, and where an event is played is the one
           of them a reader is not choosing between. `Tournament.attendance` is
           untouched, and the detail page still prints it. -->
      <!-- The category and the state on one line, the state hard right. They
           are the pair a reader scans a rail with — what kind of event it is and
           whether they can still enter — so they belong on the same line rather
           than a title apart. -->
      <div class="flex items-center justify-between gap-3">
        <p
          class="font-display text-[length:var(--text-display-caption)] leading-[1.25] text-white/50"
        >
          {{ tournament.category }}
        </p>

        <!-- The colour carries meaning, so the word carries it too rather than
             the fill alone — RULES §10 does not let a state be a hue. -->
        <span
          :class="
            cn(
              'font-sans shrink-0 rounded-[5px] px-3 py-1 text-[length:var(--text-eyebrow)] leading-8 font-bold text-white uppercase',
              PILL_TONE[tournament.registration],
            )
          "
        >
          {{ label }}
        </span>
      </div>

      <!-- Inter SemiBold 36/44 (`592:16887`), held to two lines. The names come
           from the feed and nothing guarantees the next one is as short as the
           six that are written: an unclamped third line pushes the format strip
           and the buttons down on that card alone, and a rail whose cards end at
           different heights is the thing the fixed card size exists to prevent.
           `line-clamp` bounds it without measuring text. -->
      <h3
        class="font-sans line-clamp-2 text-[length:var(--text-display-label)] leading-[1.22] font-semibold text-white"
      >
        <NuxtLink
          :to="href"
          class="focus-visible:ring-gold transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none"
        >
          {{ tournament.name }}
        </NuxtLink>
      </h3>

      <div class="flex flex-wrap items-center gap-3">
        <p class="font-sans text-[length:var(--text-body-sm)] leading-8 text-white/60">
          {{ tournament.location }}
        </p>
      </div>
    </div>

    <!-- The formats strip (`592:16892`): a grey wash falling to nothing upwards,
         squared at the top and rounded at the foot, as Figma draws it. -->
    <p
      class="format-strip-stroke font-sans relative rounded-b-[var(--radius-btn)] bg-[linear-gradient(0deg,rgba(138,138,138,0.2)_0%,rgba(138,138,138,0)_100%)] p-2 text-center text-[length:var(--text-body-sm)] leading-6 text-[#8A8A8A]"
    >
      {{ tournament.formatLabel }}
    </p>

    <!-- 72px tall (`592:16894`), and WHAT it says depends on where the
         tournament is: entries open → "Register", under way → "Watch live"
         beside "View detail", not yet open → "Notify me". The redraw shows the
         three side by side, which is the clearest statement that the foot of
         this card is a state and not a fixed button.

         Every one of them refuses when pressed. There is no entry form, no
         stream and no portal to host either (B2, phase 2), so they say so rather
         than navigating nowhere — D28, the same treatment the hero's own "Watch
         live stream" keeps. -->
    <div class="mt-auto flex flex-wrap items-stretch gap-3">
      <template v-for="action in actions" :key="action.label">
        <!-- A link where there is somewhere to go, a refusing button where there
             is not. The two carry the same classes on purpose: which one a
             reader gets depends on whether the thing exists, and that must not
             also change how the card looks. -->
        <NuxtLink
          v-if="action.href"
          :to="action.href"
          :aria-label="action.a11y"
          :class="cn(actionClass(action.tone), 'flex-1')"
        >
          {{ action.label }}
        </NuxtLink>

        <TournamentsUnavailableButton
          v-else
          :notice="TOURNAMENTS_COPY.rail.registerUnavailable"
          block
          :aria-label="action.a11y"
          :class="actionClass(action.tone)"
        >
          {{ action.label }}
          <!-- The two that name a THING to do carry its glyph — a play head for
               the stream, a bell for the reminder (`592:16895` and siblings).
               "Register" and "View detail" carry none: the design gives them one
               only where the word alone would not say what happens. -->
          <img
            v-if="action.icon"
            :src="action.icon"
            alt=""
            aria-hidden="true"
            width="24"
            height="24"
            class="size-6 shrink-0"
          >
        </TournamentsUnavailableButton>
      </template>
    </div>
  </article>
</template>
