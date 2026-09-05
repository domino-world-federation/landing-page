<script setup lang="ts">
import { ApiError, subscribeToNewsletter } from "~/lib/api/client"
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
 * **It subscribes now** — `POST /newsletter`, into the backoffice's Newsletter
 * module. Until 2026-09-05 it refused in the open (D28); the endpoint had been
 * live since 2026-09-03.
 *
 * Two things this field must keep getting right, both of which are about what
 * it does NOT say:
 *
 *   - an address already on the list gets the same success message as a new
 *     one, because this box is on every page and a "you are already subscribed"
 *     would be a membership oracle open to the whole internet;
 *   - with no `NUXT_PUBLIC_API_BASE_URL` it still refuses out loud rather than
 *     swallowing the address.
 */
const email = ref("")

/** Empty means a human — see `UiHoneypotField`. */
const website = ref("")

type Status = "idle" | "sending" | "done" | "throttled" | "failed" | "unavailable"

const status = ref<Status>("idle")

async function handleSubmit() {
  if (status.value === "sending") return

  status.value = "sending"

  try {
    await subscribeToNewsletter({ email: email.value.trim(), website: website.value })
    status.value = "done"
    // Cleared so the box is ready for someone else on a shared machine, and so
    // the success line is not sitting under an address that looks unsent.
    email.value = ""
  } catch (error) {
    // Not an `ApiError` means it never left the browser — the client rejects
    // before sending when there is no base URL.
    if (error instanceof ApiError) {
      status.value = error.status === 429 ? "throttled" : "failed"
    } else {
      status.value = "unavailable"
    }
  }
}

// Typing clears a verdict about what was typed before it.
watch(email, () => {
  if (status.value !== "sending" && status.value !== "done") status.value = "idle"
})

const notice = computed(() => {
  switch (status.value) {
    case "done":
      return FOOTER_COPY.newsletterSuccess
    case "throttled":
      return FOOTER_COPY.newsletterThrottled
    case "failed":
      return FOOTER_COPY.newsletterFailed
    case "unavailable":
      return FOOTER_COPY.newsletterUnavailable
    default:
      return ""
  }
})
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
      <UiHoneypotField id="newsletter-website" v-model="website" />
      <!-- Disabled only in flight. The arrow is the whole control, so there is
           no label to swap for "Sending" — the opacity is what says it. -->
      <button
        type="submit"
        :disabled="status === 'sending'"
        :aria-label="FOOTER_COPY.newsletterSubmit"
        class="focus-visible:ring-gold flex size-6 shrink-0 items-center justify-center rounded-[4px] transition-transform duration-200 hover:translate-x-0.5 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50 disabled:hover:translate-x-0"
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
      class="font-sans text-right text-sm leading-5 empty:hidden"
      :class="status === 'done' ? 'text-white' : 'text-white/60'"
    >
      {{ notice }}
    </p>
  </div>
</template>
