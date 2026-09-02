<script setup lang="ts">
import type { MemberFederation } from "~/lib/api/types"
import { MEMBERS_COPY } from "~/content/members"

/**
 * A federation's record, on a press — Figma `793:3568`.
 *
 * The register used to keep this card standing beside the list, which spent a
 * third of the band on one federation. The redraw makes it a window over the
 * page instead, so the register gets the whole width and the record gets more
 * room than it had.
 *
 * **A native `<dialog>`.** `showModal()` brings the focus trap, the Escape key,
 * `aria-modal`, inertness for the rest of the page and `::backdrop` with it —
 * all of which a `<div>` overlay would have to reimplement and most of which it
 * would get subtly wrong. Same call `NotifyDialog` and `MediaLightbox` make.
 *
 * **The card inside is `MembersDetailCard`**, which already draws the mark, the
 * tier, the name, the year and the panel of facts — the redraw changes where
 * that card lives, not what it says, and rebuilding it here would be two records
 * to keep in step. It carries the design's `#161616` ground itself; this file
 * owns the window and the close, not the surface.
 *
 * The design fills the backdrop with a photograph under a 60% black at 6px of
 * blur (`793:3629`, `793:3632`). `::backdrop` cannot carry an image that the
 * page behind it does not already have, and a picture chosen per federation is
 * not in the data — so the backdrop is the dim and the blur without it. That is
 * the half of the treatment that does the work: the page recedes and the card
 * is the only thing in focus.
 */
defineProps<{ federation?: MemberFederation }>()

const open = defineModel<boolean>("open", { required: true })

const dialog = useTemplateRef<HTMLDialogElement>("dialog")

// `open` is the source of truth and the element follows it. `showModal` is what
// makes a `<dialog>` modal at all — an `open` attribute alone renders it inline,
// without the backdrop, the focus trap or the Escape key.
watch(open, (isOpen) => {
  const el = dialog.value
  if (!el) return

  if (isOpen) el.showModal()
  else if (el.open) el.close()
})

// Escape and a backdrop press close the element without going through the
// model, so the element tells the model rather than the other way round.
function syncClosed() {
  open.value = false
}

// A press on the backdrop — which is the dialog element itself, since the card
// inside it is what fills the box. Comparing the target to the element is how a
// native dialog distinguishes the two without an extra overlay div.
function onBackdrop(event: MouseEvent) {
  if (event.target === dialog.value) open.value = false
}
</script>

<template>
  <!-- `p-0` and `bg-transparent`: the UA gives a `<dialog>` its own padding,
       border and background, and the card carries all three itself. The 6px blur
       is on `::backdrop` rather than on a layer of our own, which is what keeps
       the page behind it inert as well as dimmed. -->
  <dialog
    ref="dialog"
    :aria-label="federation ? `${MEMBERS_COPY.directoryHeading} — ${federation.name}` : MEMBERS_COPY.directoryHeading"
    class="bg-transparent p-0 backdrop:bg-black/60 backdrop:backdrop-blur-[6px] open:m-auto"
    @close="syncClosed"
    @click="onBackdrop"
  >
    <!-- 880 wide in the design (`793:3634`), with a viewport cap: a fixed 880
         overflows every phone, and a dialog that cannot be seen whole cannot be
         dismissed by pointing at the backdrop either. -->
    <div
      v-if="federation"
      class="relative w-[min(880px,calc(100vw-2.5rem))]"
    >
      <!-- `793:3656` — 12px of padding on 70% black, inset 24 from the card's
           corner, over the card rather than inside its padding. -->
      <button
        type="button"
        :aria-label="MEMBERS_COPY.detailCloseLabel"
        class="focus-visible:ring-gold absolute top-6 right-6 z-10 flex items-center rounded-[var(--radius-btn)] bg-black/70 p-3 transition-colors hover:bg-black/90 focus-visible:ring-2 focus-visible:outline-none"
        @click="open = false"
      >
        <img
          src="/assets/global/icon-close.svg"
          alt=""
          width="24"
          height="24"
          class="size-6"
        >
      </button>

      <MembersDetailCard :federation="federation" />
    </div>
  </dialog>
</template>
