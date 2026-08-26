<script setup lang="ts">
import { FOOTER_COPY, FOOTER_GROUPS, FOOTER_SOCIALS } from "~/content/footer"

/**
 * S14 — Figma node `56:5159`. The site footer.
 *
 * A single glass pane (`59:8940`: `rgba(0,0,0,0.4)` with `blur(10px)`, 12px
 * radius) holding five columns and a legal strip. It is the page's only real
 * glassmorphism after the navbar, and it works here for the same reason it works
 * there: there is something behind it worth blurring — S12's gold beams run
 * under the whole footer.
 *
 * **Five columns become two rows before they become one.** Figma's row is
 * `Quick Links · Resources · [logo + address] · Contact · Social`, which is five
 * fixed demands plus four 70px gutters — a literal read needs well over 1600px
 * and would scroll sideways below it (D14). The middle column is also the widest
 * (440) and the only one that is centred, so it is the one that breaks the row
 * worst. So: one column below `md`, two from `md`, and the full five-across row
 * only from `menu-lg` (1600) where they all fit at their design proportions —
 * the same threshold S10's grid waits for, and for the same measured reason.
 *
 * The alignments are Figma's and they are per-column: the two link columns are
 * left-aligned, the centre block centred, and Contact and Social are hard right
 * (`alignItems: flex-end`). That only reads as a composition while the five are
 * actually in a row — stacked, everything hard-right is just ragged, so the
 * right-alignment is scoped to `menu-lg` too.
 */
</script>

<template>
  <footer class="relative px-5 py-10 md:px-10 lg:px-20 lg:py-[4.17vw]">
    <!-- Figma pads the pane 32px on all sides inside the section's own 80.
         `backdrop-blur-[10px]` is the design's number; the 40% black is what
         keeps the beams readable through it rather than merely visible. -->
    <div
      class="rounded-glass flex flex-col gap-8 bg-black/40 p-5 backdrop-blur-[10px] md:p-8"
    >
      <!-- The five-column track is Figma's own sizing read back off `56:5026`:
           all four outer columns are `fill` and only the centre block is fixed,
           at 440. That is what puts the emblem on the page's vertical axis
           rather than merely somewhere in the middle of the row — four equal
           fills either side of a symmetric 440 centre the block by construction:
           (1696 − 280 of gaps − 440) / 4 = 244 each, so the centre column opens
           at 740 and its midpoint lands on 960. 22.92vw is 440/1920,
           proportional so the centre keeps its share instead of becoming a fixed
           demand on a narrow window (D14).

           Two earlier readings of this row were wrong, both worth recording.
           Writing the centre as `440fr` mistook an `fr` for a width — it is a
           share of the FREE space, so against four `auto` tracks it took
           essentially all of it. Replacing those with `auto auto … 1fr 1fr` then
           fixed the centre's width but let the two link columns hug, which
           dragged the whole row left and left the emblem off-axis at 763 instead
           of 960.

           A bare `1fr`, NOT `minmax(0,1fr)`. The two differ only in the track's
           floor, and that floor is the whole point here: the email
           `community@dwf-org` is one unbreakable token needing 245px against the
           244 an equal share allows, so a zero floor forced it to wrap mid-word
           and cost the column a second line. A bare `1fr` keeps its implicit
           `auto` minimum, and grid resolves the shortfall the way the spec says
           to — the track that cannot fit its content is frozen at that content's
           size and the remaining space is redistributed among the other three,
           which land at 243.7 apiece. That moves the emblem's axis to 959.5
           rather than 960; half a pixel is not visible, a wrapped address is.

           This is also what Figma does, so it is the faithful reading rather
           than a workaround: `fill` is flexbox underneath, and a flex item's own
           `min-width: auto` protects its content from exactly this squeeze.
           `minmax(0,…)` was guarding against an overflow that grid never had.

           `items-start` so the columns hang from a common top edge — the centre
           block is much taller than the link columns, and stretched they would
           spread their rows to match it. -->
      <div
        class="grid gap-10 md:grid-cols-2 menu-lg:grid-cols-[1fr_1fr_22.92vw_1fr_1fr] menu-lg:items-start menu-lg:gap-[3.65vw]"
      >
        <nav
          v-for="group in FOOTER_GROUPS"
          :key="group.title"
          :aria-label="group.title"
          class="flex flex-col gap-4 lg:gap-[1.88vw]"
        >
          <!-- Inter Medium 16 in `--color-dim` (`56:4944`) — a column heading,
               not a link. `<h2>` because the footer is a landmark of its own and
               its headings should be navigable; the page's section headings are
               also h2, and these sit beside them rather than under them. -->
          <h2
            class="font-sans text-base leading-6 font-medium text-[var(--color-dim)]"
          >
            {{ group.title }}
          </h2>
          <ul class="flex flex-col gap-4 lg:gap-[1.88vw]">
            <li v-for="link in group.links" :key="link.label">
              <NuxtLink
                :to="link.href"
                class="font-sans focus-visible:ring-gold rounded-[4px] text-[length:var(--text-footer-link)] leading-[1.3333] font-medium text-white transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:outline-none"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- The centre block: emblem, mission, address. Spans both columns in
             the two-up layout — it is the widest of the five and would leave a
             link column stranded beside it. -->
        <div
          class="flex flex-col items-center gap-6 text-center md:col-span-2 menu-lg:col-span-1"
        >
          <!-- 196px in Figma (`56:4885`), written as a fraction of the design
               width with a floor. Decorative: the federation's name is read out
               three lines below it in the copyright, and the emblem here is the
               mark, not the identification. -->
          <img
            src="/assets/global/logo-dwf-emblem.svg"
            alt=""
            width="196"
            height="196"
            class="h-auto w-[max(120px,10.21vw)]"
          >
          <div class="flex flex-col gap-6 lg:gap-[1.88vw]">
            <p
              class="font-sans text-base leading-6 font-medium text-[var(--color-dim)]"
            >
              {{ FOOTER_COPY.mission }}
            </p>
            <!-- A postal address is one of the few places a line break carries
                 meaning, so `<address>` keeps the design's two lines as two
                 elements rather than as a `<br>`. -->
            <address
              class="font-sans text-[length:var(--text-footer-link)] leading-[1.3333] font-medium text-white not-italic"
            >
              <span
                v-for="line in FOOTER_COPY.address"
                :key="line"
                class="block"
              >{{ line }}</span>
            </address>
          </div>
        </div>

        <div class="flex flex-col gap-4 menu-lg:items-end lg:gap-[1.88vw]">
          <h2
            class="font-sans text-base leading-6 font-medium text-[var(--color-dim)] menu-lg:text-right"
          >
            {{ FOOTER_COPY.contactTitle }}
          </h2>
          <!-- Text, not a `mailto:`. The design's address has no top-level
               domain (`56:4977`), so a mail link built on it opens a compose
               window that can never be delivered — see the note in
               `content/footer.ts`.

               `whitespace-nowrap`, after two softer options failed. An email
               address is one atomic token — broken across lines it reads as a
               typo, and Figma sets it on a single line. `break-all` split it as
               "…dwf-or / g"; `break-words` still split it as "community@dwf- /
               org", because a hyphen is a normal break opportunity and
               `overflow-wrap` does not remove one. Only refusing to wrap states
               the actual constraint.

               `w-0 min-w-full` beside it, so the refusal to wrap does not also
               become a demand on the row. A nowrap line's min-content IS its
               full width, and the clamp grows that width slightly faster than an
               equal share of the row grows: 204px wanted against 194 available
               at 1600, 217 against 210 at 1700, 245 against 244 at 1920. Grid
               honours the larger of the two, so the Contact track froze wider
               than its three siblings and dragged the centre column — and the
               emblem with it — 7px left of the pane's axis.

               A definite `width: 0` contributes nothing to intrinsic sizing, so
               the track is left to the equal share it was owed; `min-width: 100%`
               is a percentage, which resolves to nothing during that same
               measurement but back to the column's full width once the column is
               settled. -->
          <p
            class="font-sans w-0 min-w-full text-[length:var(--text-footer-link)] leading-[1.3333] font-medium whitespace-nowrap text-white menu-lg:text-right"
          >
            {{ FOOTER_COPY.contactEmail }}
          </p>

          <!-- Figma's `56:5011` — the newsletter label and its box are their own
               frame on a flat 16px, tighter than the 36 the column uses between
               its blocks. That gap does not scale with the column: it is the
               distance between a label and the field it names, and Figma keeps
               it at 16 throughout. -->
          <div class="flex w-full flex-col gap-4 menu-lg:items-end">
            <h2
              class="font-sans text-base leading-6 font-medium text-[var(--color-dim)] menu-lg:text-right"
            >
              {{ FOOTER_COPY.newsletterTitle }}
            </h2>
            <LayoutNewsletterField />
          </div>
        </div>

        <div class="flex flex-col gap-4 menu-lg:items-end lg:gap-[1.88vw]">
          <h2
            class="font-sans text-base leading-6 font-medium text-[var(--color-dim)] menu-lg:text-right"
          >
            {{ FOOTER_COPY.socialTitle }}
          </h2>
          <!-- Figma fixes this row at 206px (`56:5114`), which with 48px tiles
               and an 8px gap fits three per line — four would need 216 — so the
               five wrap 3+2. Written as a wrapping flex row rather than as that
               width: the wrap is the intent, and 206px would be a fixed demand
               that cannot shrink. The cap is kept above `menu-lg` so the row
               keeps the design's shape once there is space for it to spread. -->
          <ul class="flex flex-wrap gap-2 menu-lg:max-w-[206px] menu-lg:justify-end">
            <li v-for="social in FOOTER_SOCIALS" :key="social.id">
              <a
                :href="social.href"
                :aria-label="social.label"
                class="focus-visible:ring-gold flex size-12 items-center justify-center rounded-[var(--radius-btn)] bg-white/12 transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:outline-none"
              >
                <!-- A 24px inline SVG sized in CSS. Drawn in white already. -->
                <img
                  :src="social.iconUrl"
                  alt=""
                  width="24"
                  height="24"
                  class="size-6"
                >
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- The legal strip (`56:5158`). Centred while stacked and pushed apart
           once there is a row to push it into. -->
      <div
        class="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left"
      >
        <p class="font-sans text-sm leading-[1.57] font-medium text-white/50">
          {{ FOOTER_COPY.copyright }}
        </p>
        <ul class="flex flex-wrap items-center justify-center gap-6 lg:gap-9">
          <li v-for="link in FOOTER_COPY.legal" :key="link.label">
            <NuxtLink
              :to="link.href"
              class="font-sans focus-visible:ring-gold rounded-[4px] text-sm leading-[1.57] font-medium text-white/50 transition-opacity hover:text-white focus-visible:ring-2 focus-visible:outline-none"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
