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

/**
 * Whether the record is showing. Separate from `openId`, which survives the
 * dialog closing: a reader who opens Indonesia, reads it and closes the dialog
 * should find Indonesia still marked in the register rather than the selection
 * thrown away with the window.
 */
const dialogOpen = ref(false)

watch(openId, (id) => {
  if (id) dialogOpen.value = true
})

const open = computed(
  () =>
    federations.value.find((f) => f.id === openId.value) ?? federations.value[0],
)
</script>

<template>
  <section
    v-if="federations.length > 0"
    aria-labelledby="directory-heading"
    class="flex snap-screen flex-col items-center justify-center gap-8 px-5 pt-28 pb-10 md:px-10 lg:gap-16 lg:px-20 lg:pt-[max(var(--nav-clearance),4.17vw)] lg:pb-[4.17vw]"
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
    <!-- **Two columns of three, and the whole register is on screen** —
         `613:22526` draws two `list` frames side by side, 20 apart, each holding
         three rows on the same 20. There is no scroll and no fade any more, and
         that is the redraw's doing rather than a simplification: the register is
         six federations, six rows fit a screen in two columns, and a scrolling
         viewport with a cut last row was the answer to a single column that no
         longer exists. The record that used to stand beside the list is a press
         away instead (`793:3568`).

         `grid`, not two columns of a flex row: a grid fills across and then
         down, so the register reads left-to-right in pairs the way the design
         numbers it, and a row whose name wraps cannot push its neighbour out of
         step.

         **It will grow past the screen if the register does.** Six is what the
         feed holds and what the design draws; a seventh would add a row to the
         left column and the section would outgrow its stop. That is the right
         failure — a register that quietly hid its newest member would be
         worse — and it is the point at which the scroll comes back. -->
    <ul
      :aria-label="MEMBERS_COPY.directoryListLabel"
      class="grid w-full list-none grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5"
    >
      <MembersRow
        v-for="federation in federations"
        :key="federation.id"
        :federation="federation"
        :active="federation.id === openId"
        @open="openId = federation.id"
      />
    </ul>

    <!-- The record, on a press rather than beside the list. -->
    <MembersDetailDialog
      v-model:open="dialogOpen"
      :federation="open"
    />

  </section>
</template>
