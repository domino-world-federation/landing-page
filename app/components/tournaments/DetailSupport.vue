<script setup lang="ts">
import type { TournamentDetail } from "~/lib/api/types"
import { TOURNAMENT_DETAIL_COPY } from "~/content/tournaments/detail"

/**
 * Contact and the officials working the tournament — Figma node `517:2010`.
 *
 * Two 860 columns on the band's own wash from `#0E0E0E` to `#262626`, each under
 * a gold Bebas 100.
 *
 * The contact lines are real `mailto:` and `tel:` links, not printed text. They
 * are the one pair of controls on this page that CAN act: an address and a
 * number work without a backend, which is exactly why D28's "refuse in the open"
 * does not apply to them.
 */
defineProps<{ tournament: TournamentDetail }>()

const COPY = TOURNAMENT_DETAIL_COPY.support

const HEADING =
  "font-display text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"

/**
 * The two letters an official's avatar falls back to.
 *
 * First letters of the first two words — "Maria Lopez" is ML — because that is
 * how a name is abbreviated out loud. A single-word name gives its first two
 * letters instead of one, so the block never holds a lonely character.
 *
 * `Intl.Segmenter` is not reached for: these are Latin-script names typed into
 * the backoffice, and `[...name]` already iterates code points, so an accented
 * initial survives. A script where the first code point is not a letter would
 * need more than this, and would need it in the design too.
 */
function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) return ""
  if (words.length === 1) return [...words[0]!].slice(0, 2).join("")

  return (words[0]![0] ?? "") + (words[1]![0] ?? "")
}
</script>

<template>
  <section
    v-if="tournament.contact || tournament.officials?.length"
    class="flex flex-wrap justify-center gap-10 bg-[linear-gradient(180deg,#0E0E0E_0%,#262626_100%)] px-5 py-16 md:px-10 lg:gap-[2.08vw] lg:px-20 lg:py-[4.17vw]"
  >
    <div
      v-if="tournament.contact"
      aria-labelledby="tournament-contact-heading"
      class="flex min-w-0 flex-1 basis-[min(100%,860px)] flex-col gap-6"
    >
      <MotionReveal :y="40">
        <h2 id="tournament-contact-heading" :class="HEADING">
          {{ COPY.contactHeading }}
        </h2>
      </MotionReveal>

      <ul class="flex list-none flex-col gap-6">
        <li>
          <a
            :href="`mailto:${tournament.contact.email}`"
            :aria-label="COPY.emailLabel"
            class="font-sans focus-visible:ring-gold flex items-center gap-3 text-[length:var(--text-body-sm)] leading-8 text-white transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:outline-none"
          >
            <!-- A 36px inline SVG sized in CSS. Already `fill="white"` in the
                 file, so it is NOT inverted — doing that painted it black on a
                 black page. -->
            <img
              src="/assets/global/icon-mail.svg"
              alt=""
              aria-hidden="true"
              width="36"
              height="36"
              class="size-9 shrink-0"
            >
            {{ tournament.contact.email }}
          </a>
        </li>
        <li>
          <a
            :href="`tel:${tournament.contact.phone.replace(/\s/g, '')}`"
            :aria-label="COPY.phoneLabel"
            class="font-sans focus-visible:ring-gold flex items-center gap-3 text-[length:var(--text-body-sm)] leading-8 text-white transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:outline-none"
          >
            <img
              src="/assets/global/icon-phone.svg"
              alt=""
              aria-hidden="true"
              width="36"
              height="36"
              class="size-9 shrink-0"
            >
            {{ tournament.contact.phone }}
          </a>
        </li>
      </ul>

      <!-- 320 × 64 at 20% white (`517:2020`). A real destination: `/contact` is
           a page this site has. -->
      <NuxtLink
        :to="COPY.contactHref"
        class="font-display focus-visible:ring-gold flex h-16 w-full items-center justify-center rounded-[var(--radius-btn)] bg-white/20 px-5 text-[length:var(--text-display-caption)] leading-[1.25] text-white uppercase transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:outline-none lg:w-80"
      >
        {{ COPY.contactCta }}
      </NuxtLink>
    </div>

    <div
      v-if="tournament.officials?.length"
      aria-labelledby="tournament-officials-heading"
      class="flex min-w-0 flex-1 basis-[min(100%,860px)] flex-col gap-6"
    >
      <MotionReveal :y="40">
        <h2 id="tournament-officials-heading" :class="HEADING">
          {{ COPY.officialsHeading }}
        </h2>
      </MotionReveal>

      <ul
        :aria-label="COPY.officialsLabel"
        class="flex list-none flex-col gap-4"
      >
        <li
          v-for="official in tournament.officials"
          :key="official.id"
          class="flex items-center gap-5 rounded-3xl bg-[rgba(68,68,68,0.5)] py-4 pr-6 pl-4"
        >
          <NuxtImg
            v-if="official.portraitUrl"
            :src="official.portraitUrl"
            :alt="official.portraitAlt ?? ''"
            :sizes="imageSizes({ xs: '108px' })"
            class="size-[108px] shrink-0 rounded-[var(--radius-glass)] object-cover"
          />

          <!-- **A portrait is optional, so the row must hold without one.**
               It used to draw nothing at all, which left the name sitting flush
               against the card's edge while the officials beside it kept their
               108px block — a list that lines up only when every person happens
               to have been photographed.

               Initials rather than a silhouette: a generic head says "no
               picture" and nothing else, where two letters say WHOSE row this
               is, which is the one thing the space can still carry.

               `aria-hidden`, because the name is printed beside it already —
               a screen reader reading "ML, Maria Lopez" says the same thing
               twice, the second time badly. -->
          <span
            v-else
            aria-hidden="true"
            class="font-display flex size-[108px] shrink-0 items-center justify-center rounded-[var(--radius-glass)] bg-white/12 text-[length:var(--text-display-label)] leading-none text-white/70 uppercase"
          >{{ initials(official.name) }}</span>

          <div class="flex min-w-0 flex-col gap-3">
            <p
              class="font-display text-[length:var(--text-display-label)] leading-[1.15] text-white uppercase"
            >
              {{ official.name }}
            </p>
            <!-- The bullet is a separator, not a word: it sits in its own
                 `aria-hidden` span so a screen reader reads "Chief Referee,
                 Spain" rather than "Chief Referee bullet Spain". -->
            <p
              class="font-sans flex flex-wrap gap-3 text-[length:var(--text-eyebrow)] leading-7 text-white/60"
            >
              <span>{{ official.role }}</span>
              <span aria-hidden>•</span>
              <span>{{ official.country }}</span>
            </p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
