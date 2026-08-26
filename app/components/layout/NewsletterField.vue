<script setup lang="ts">
import { FOOTER_COPY } from "~/content/footer"

/**
 * The footer's subscribe field — Figma node `56:4982`.
 *
 * A 12%-white glass box with a placeholder at one end and an arrow at the other.
 * Figma draws it as decoration — there is no input, only the words "Enter
 * email" — but a subscribe box that cannot be typed into is worse than none, so
 * it is built as a real form: a labelled `<input type="email">` and a submit
 * button the arrow lives inside.
 *
 * **It does not subscribe anyone.** There is no endpoint (blocker B2), so
 * submitting says so rather than swallowing the address. That is deliberate over
 * the two alternatives: a field that silently does nothing is a lie, and
 * disabling it outright loses the design's shape. The moment a `POST` exists,
 * only `onSubmit` changes.
 */
const email = ref("")
const notice = ref("")

function handleSubmit() {
  // No endpoint to post to, so the browser's own navigation is stopped (by the
  // `.prevent` modifier) and the reader is told where this actually stands.
  notice.value = FOOTER_COPY.newsletterUnavailable
}
</script>

<template>
  <div class="flex w-full flex-col items-end gap-2">
    <!-- `min-w-0` on the FORM as well as on the input inside it. The input's own
         floor stops it demanding its ~20-character intrinsic width, but the form
         is itself a flex item in the footer's Contact column and carries the
         same implicit `auto` minimum — so it re-imposed what the input had just
         given up. At 1600 that made the column's min-content 243px against the
         178 an equal share allows, the grid froze the track at that size, and
         the three columns beside it gave up the difference — which slid the
         centred emblem 33px off the pane's axis. -->
    <form
      class="flex w-full min-w-0 items-center gap-2 rounded-[var(--radius-btn)] bg-white/12 p-3 focus-within:ring-2 focus-within:ring-white/40"
      @submit.prevent="handleSubmit"
    >
      <!-- The design shows a placeholder and no label. A placeholder is not a
           label — it disappears the moment there is text in the field, so a
           screen reader arriving mid-entry has nothing to announce. The label is
           rendered and visually hidden instead, which keeps Figma's shape
           without dropping the name. -->
      <label for="newsletter-email" class="sr-only">
        {{ FOOTER_COPY.newsletterLabel }}
      </label>
      <!-- `w-0` with `flex-1`, not `min-w-0` alone. A text input carries a
           default `size` of about 20 characters, and that is a WIDTH, not a
           minimum — `min-w-0` lowers the floor but leaves the preferred width in
           place, so the field still asks for ~187px whenever anything measures
           the box intrinsically. That is what set the footer's Contact column to
           a 243px min-content at 1600, froze its grid track, and slid the
           centred emblem 33px off the pane's axis.

           `w-0` states the intent instead: the input has no width of its own and
           takes what `flex-1` gives it, so the box is sized by its column rather
           than the column by the box.

           The placeholder is drawn at 50% white in Figma (`56:4983`); the typed
           value is full white, or the reader cannot see what they wrote against
           what they have not. -->
      <input
        id="newsletter-email"
        v-model="email"
        type="email"
        required
        autocomplete="email"
        :placeholder="FOOTER_COPY.newsletterPlaceholder"
        class="font-sans w-0 flex-1 bg-transparent text-base leading-6 font-medium text-white placeholder:text-white/50 focus:outline-none"
      >
      <button
        type="submit"
        :aria-label="FOOTER_COPY.newsletterSubmit"
        class="focus-visible:ring-gold flex size-6 shrink-0 items-center justify-center rounded-[4px] transition-transform duration-200 hover:translate-x-0.5 focus-visible:ring-2 focus-visible:outline-none"
      >
        <!-- A 24px inline SVG sized in CSS; the image pipeline would hand back
             the same bytes. Drawn in white already, so no `invert`. -->
        <img
          src="/assets/global/icon-arrow-right.svg"
          alt=""
          width="24"
          height="24"
          class="size-6"
        >
      </button>
    </form>

    <!-- `role="status"` so the notice is announced when it appears — a reader
         who submitted by keyboard has no other way to learn nothing happened.
         The node is always rendered, empty until there is something to say: a
         live region added to the DOM at the same moment as its text is often
         missed by screen readers, which need it present to watch it. -->
    <p
      role="status"
      class="font-sans text-right text-sm leading-5 text-white/60 empty:hidden"
    >
      {{ notice }}
    </p>
  </div>
</template>
