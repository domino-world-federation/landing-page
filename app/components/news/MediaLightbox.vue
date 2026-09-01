<script setup lang="ts">
import type { GalleryItem } from "~/lib/api/types"
import { NEWS_GALLERY_COPY } from "~/content/news/gallery"

/**
 * The media viewer — the collage's tiles opened at full size, with arrows to
 * walk the feed.
 *
 * Not in Figma. The design draws the collage and stops there, but a wall of
 * cropped 400px tiles with no way to see any of them whole is a gallery that
 * cannot be looked at; this is the missing half of the block, asked for
 * directly.
 *
 * **A native `<dialog>`, for the same reasons `NotifyDialog` is one.**
 * `showModal()` brings the focus trap, Escape, `aria-modal`, inertness for the
 * page behind and the `::backdrop` pseudo-element — all of which an overlay
 * `<div>` would have had to rebuild, and most of which it would have got subtly
 * wrong.
 *
 * **It fills the window.** The picture takes the whole screen minus the room the
 * controls need, and the controls sit on the window's edges rather than on the
 * picture's: arrows hard left and hard right behind a wash that keeps them
 * readable over a bright photograph, close in the top-right corner. An earlier
 * pass hung them off a 1200px card, which put the close button wherever that
 * card's corner happened to fall and left the picture small in a pool of
 * backdrop.
 *
 * **The card is mounted only while open**, which is what makes the entrance
 * play. `<Motion>` runs `initial → animate` when it mounts; a card that stayed
 * in the DOM between openings would already be at rest the second time it was
 * shown, and the dialog would snap open with no animation at all.
 *
 * The arrows do NOT wrap. Every other rail on this site stops at its ends and
 * dims the arrow that has nowhere to go, and a viewer that silently jumped from
 * the last picture back to the first would be the one control here that lies
 * about where you are.
 */
const props = defineProps<{ items: GalleryItem[] }>()

const open = defineModel<boolean>("open", { required: true })
/** Which picture is being shown — the tile that was pressed, then the arrows. */
const index = defineModel<number>("index", { required: true })

const COPY = NEWS_GALLERY_COPY.viewer

const dialog = useTemplateRef<HTMLDialogElement>("dialog")

const current = computed<GalleryItem | undefined>(() => props.items[index.value])

const atStart = computed(() => index.value <= 0)
const atEnd = computed(() => index.value >= props.items.length - 1)

function step(direction: 1 | -1) {
  const next = index.value + direction
  if (next < 0 || next >= props.items.length) return
  index.value = next
}

// `open` is the source of truth and the element follows it — the same contract
// `NotifyDialog` keeps. `showModal` is what makes a `<dialog>` modal at all: the
// `open` attribute alone renders it inline, with no backdrop, no focus trap and
// no Escape key.
watch(open, (isOpen) => {
  const el = dialog.value
  if (!el) return

  if (isOpen) el.showModal()
  else if (el.open) el.close()
})

// Escape and a backdrop press close the dialog without going through `open`, so
// the element tells the model rather than the other way round.
function syncClosed() {
  open.value = false
}

// The left and right keys, which is what a reader who has just opened a picture
// reaches for. Bound on the dialog rather than the window: the dialog holds
// focus while it is modal, so the handler cannot fire for the page behind it.
function onKey(event: KeyboardEvent) {
  if (event.key === "ArrowRight") step(1)
  else if (event.key === "ArrowLeft") step(-1)
}

/**
 * Closes when the press lands on the dialog itself rather than on the card.
 *
 * The `<dialog>` element fills the viewport and the backdrop is painted behind
 * it, so a click on the dimmed area has `event.target === dialog` — the card and
 * everything in it report themselves. This is the whole check; comparing
 * coordinates against the card's box gets the same answer less reliably.
 */
function onBackdropPress(event: MouseEvent) {
  if (event.target === dialog.value) open.value = false
}

const prefersReducedMotion = useReducedMotion()

// Reduced motion collapses the TRANSITION, never the markup (RULES §12). Both
// branches render the same tree and the same `initial`; only the duration
// differs, and `duration: 0` still lands the card at rest before the first
// paint.
const enter = computed(() =>
  prefersReducedMotion.value
    ? { duration: 0 }
    : { duration: 0.32, ease: EASE },
)
</script>

<template>
  <!-- `p-0`, `bg-transparent`, `max-w-none`: the UA gives a `<dialog>` padding,
       a border, a background and a width cap, and the card below owns all four.
       `open:` guards the flex, because a closed dialog is `display: none` and a
       `display: flex` written unconditionally would override it and leave the
       viewer on the page. -->
  <dialog
    ref="dialog"
    :aria-label="COPY.label.replace('%s', current?.title ?? '')"
    class="max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-[2px] open:fixed open:inset-0 open:flex open:size-full open:items-center open:justify-center"
    @close="syncClosed"
    @keydown="onKey"
    @click="onBackdropPress"
  >
    <!-- The whole viewport, not a card floating in it. The picture takes as much
         of the screen as it can and the controls sit on the EDGES of the window —
         arrows hard left and hard right, close in the top-right corner. Pressing
         anywhere the picture and the controls are not still closes the viewer,
         which is why the empty space carries `@click.self`. -->
    <Motion
      v-if="open && current"
      as="div"
      class="relative flex size-full items-center justify-center"
      :initial="{ opacity: 0, scale: 0.94, y: 24 }"
      :animate="{ opacity: 1, scale: 1, y: 0, transition: enter }"
      :style="{ willChange: 'transform, opacity' }"
      @click.self="open = false"
    >
      <!-- Top-right of the WINDOW. It used to hang off the card's corner, which
           put it wherever the picture happened to end. -->
      <button
        type="button"
        :aria-label="COPY.closeLabel"
        class="focus-visible:ring-gold absolute top-5 right-5 z-20 flex items-center rounded-full bg-black/60 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.65)] backdrop-blur-[6px] transition-colors hover:bg-black/90 focus-visible:ring-2 focus-visible:outline-none lg:top-8 lg:right-8"
        @click="open = false"
      >
        <img
          src="/assets/global/icon-close.svg"
          alt=""
          width="24"
          height="24"
          class="size-6 lg:size-8"
        >
      </button>

      <!-- The two edge columns. Each is a full-height strip washed dark towards
           its own side — the "shadow" that keeps a white glyph readable when the
           photograph behind it is bright at that edge, which a bare arrow on a
           bright picture is not. The strip is `pointer-events-none` so the wash
           does not eat presses meant for the backdrop; the button inside takes
           them back. -->
      <!-- NOT `aria-hidden`, tempting as it looks for a strip whose only visible
           feature is a gradient: the arrow lives inside it, and a focusable
           control inside an `aria-hidden` subtree is reachable by Tab while
           being invisible to the screen reader that would name it. -->
      <div
        class="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-24 items-center justify-start bg-[linear-gradient(90deg,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0)_100%)] pl-2 lg:w-40 lg:pl-6"
      >
        <div class="pointer-events-auto rounded-full bg-black/40 shadow-[0_8px_32px_rgba(0,0,0,0.65)] backdrop-blur-[6px]">
          <UiRailArrow
            :label="COPY.previous"
            :disabled="atStart"
            @press="step(-1)"
          />
        </div>
      </div>

      <div
        class="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-24 items-center justify-end bg-[linear-gradient(270deg,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0)_100%)] pr-2 lg:w-40 lg:pr-6"
      >
        <div class="pointer-events-auto rounded-full bg-black/40 shadow-[0_8px_32px_rgba(0,0,0,0.65)] backdrop-blur-[6px]">
          <UiRailArrow :label="COPY.next" :disabled="atEnd" flipped @press="step(1)" />
        </div>
      </div>

      <!-- The picture and the two lines under it. Inset by the width of the edge
           columns so a landscape shot runs right up to the arrows without ever
           passing under them. -->
      <!-- Capped rather than filling the screen. Left to take the whole window
           the picture ran edge to edge and the viewer stopped reading as a thing
           laid OVER the page — `max-w` and `max-h` hold it to a plate with the
           backdrop visible around it, which is what a lightbox is. -->
      <div
        class="flex h-full max-h-[78dvh] min-h-0 w-full max-w-[min(1100px,100vw-12rem)] flex-col items-center justify-center gap-4 py-5 lg:gap-6 lg:py-8"
        @click.self="open = false"
      >
        <!-- Keyed on the item so the picture remounts as the arrows move, and
             each one fades in rather than the new file appearing inside the old
             one's frame. -->
        <Motion
          :key="current.id"
          as="div"
          class="flex min-h-0 w-full flex-1 items-center justify-center"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1, transition: enter }"
          :style="{ willChange: 'opacity' }"
          @click.self="open = false"
        >
          <!-- `size-full` with `object-contain`, and the pair matters. `max-h` /
               `max-w` alone only ever SHRINK an image: the element keeps its
               intrinsic size, so the picture rendered at whatever source `sizes`
               picked — 736px in a 1600px-wide space — and stayed a small tile in
               a big black room. Filling the box and containing inside it grows
               the picture until it meets whichever edge it reaches first, so a
               landscape shot fills the width and a portrait one fills the
               height, and neither is cropped.

               No radius: `object-contain` letterboxes inside the element, so a
               corner rounded on the BOX would be rounding empty space beside the
               picture rather than the picture itself. -->
          <NuxtImg
            :src="current.imageUrl"
            :alt="current.imageAlt"
            :sizes="imageSizes({ xs: '90vw', lg: '1600px' })"
            :quality="92"
            class="size-full object-contain"
          />
        </Motion>

        <div class="flex shrink-0 flex-col items-center gap-2">
          <!-- The film's still is real and the film is not (B2), so the viewer
               says so instead of carrying a play control that would promise
               one. -->
          <p
            v-if="current.kind === 'video'"
            class="font-sans text-center text-[length:var(--text-body-sm)] leading-6 text-white/60"
          >
            {{ COPY.videoUnavailable }}
          </p>

          <!-- Spoken as well as shown: the picture changes without the dialog
               re-announcing itself, so a screen-reader user pressing an arrow
               would otherwise get no confirmation that anything moved. -->
          <p
            aria-live="polite"
            class="font-sans text-center text-[length:var(--text-body-sm)] leading-6 text-white/60 tabular-nums"
          >
            {{ COPY.position(index + 1, items.length) }}
          </p>
        </div>
      </div>
    </Motion>
  </dialog>
</template>
