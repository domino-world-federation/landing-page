<script setup lang="ts">
import { getMemberFederations } from "~/lib/api/client"
import { MEMBERS_COPY } from "~/content/members"

/** The design's list shows six (`405:28396`). */
const ROWS = 6

/**
 * The members directory — Figma node `405:28394`.
 *
 * **A master-detail pair, not a table.** It was six federations in two columns
 * of three with a "View all" button under them, which is what the earlier design
 * drew. The redraw puts the list down the left and one federation's record
 * beside it: the same six names, but pressing one now answers the question a
 * name raises — who runs it, where it is, how to reach it — instead of sending
 * the reader to a directory page that does not exist (B2).
 *
 * The count is stated in the request rather than sliced here: the list is a
 * fixed composition and a directory that gained a seventh member would otherwise
 * quietly change the section's height (D45).
 *
 * **"View all" is gone**, on three counts that agree. The redraw does not draw
 * it; it pointed at `#`, which is the silent no-op D28 rules out; and it was
 * 112px of a section that had 148 too many — this is a snap stop, and a stop has
 * to fit its own stop. The reader is not losing a destination, because there was
 * never one behind it.
 */
const { data: federations } = await useAsyncData(
  "members-directory",
  () => getMemberFederations(ROWS),
  { default: () => [] },
)

/**
 * Which record the card is showing.
 *
 * Seeded from the feed rather than hardcoded: Figma opens on ORADO, which is
 * simply the first row, and a page that names one federation in its own source
 * would be wrong the day the federation reorders its register.
 */
const openId = ref<string>()

const open = computed(
  () =>
    federations.value.find((f) => f.id === openId.value) ?? federations.value[0],
)
</script>

<template>
  <section
    v-if="federations.length > 0"
    aria-labelledby="directory-heading"
    class="flex snap-screen flex-col items-center justify-center gap-8 px-5 pt-28 pb-10 md:px-10 lg:gap-12 lg:px-20 lg:pt-[var(--nav-clearance)] lg:pb-[3.125vw]"
  >
    <!-- Bebas 100 through the page's gold gradient. `uppercase` is the
         heading's, not the string's (D40). -->
    <h2
      id="directory-heading"
      class="font-display text-gold-gradient text-center text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
    >
      {{ MEMBERS_COPY.directoryHeading }}
    </h2>

    <!-- 69 / 31 at the design width. The card comes SECOND in the source and is
         pulled alongside with `order` above `lg`, so a reader on a phone — and a
         screen reader at any width — meets the list before the record it opens
         into. -->
    <!-- `items-stretch`, and that is what fixes the card's height.
         The list is the taller column and never changes, so stretching the row
         makes the card exactly as tall as the list — the same box for every
         federation, whichever one is open. Sized to its own contents it jumped
         between 564px and 300px as the reader moved down, resizing the section
         under them.

         Tying it to the VIEWPORT instead was the first attempt (`h-[calc(100dvh
         - …)]`) and it is worse: the card came out 808px with two thirds of it
         empty. A record with less filed in should leave space inside a card that
         fits, not stretch one to the window.

         `h-`, not `max-h-`, wherever a height is set here: a percentage height
         resolves against a DEFINITE one, and `max-height` is not definite — with
         it the card's `h-full` had nothing to measure against and collapsed to
         133px. -->
    <div class="flex w-full flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-5">
      <!-- A fixed viewport onto the register, which is what the design draws:
           its last row is cut and fading, so the list reads as longer than the
           space given to it. 33rem shows five rows and the head of a sixth.

           The fade is a MASK, not a gradient laid over the top. An overlay would
           need the section's background colour baked into it, and this list sits
           on the page rather than on a panel — the moment the page's ground
           changed, the overlay would show as a band.

           Scrollbar hidden because the fade already says there is more; the
           list scrolls by every other means. -->
      <ul
        :aria-label="MEMBERS_COPY.directoryListLabel"
        class="flex flex-1 list-none flex-col gap-2 lg:h-[33rem] lg:overflow-y-auto lg:[mask-image:linear-gradient(to_bottom,#000_0%,#000_82%,transparent_100%)] lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden"
      >
        <MembersRow
          v-for="federation in federations"
          :key="federation.id"
          :federation="federation"
          :active="federation.id === open?.id"
          @open="openId = federation.id"
        />
      </ul>

      <!-- The SAME height as the list, stated rather than inherited. Left to
           stretch, the row took whichever column was taller — so a federation
           with a long name and a full panel (520px) grew the row past the list
           (480) and the card changed size again, which is the thing being fixed.
           Both columns are told the one number; the card scrolls if a record
           ever outgrows it. -->
      <div class="lg:h-[33rem] lg:w-[31%] lg:shrink-0">
        <MembersDetailCard v-if="open" :federation="open" />
      </div>
    </div>

  </section>
</template>
