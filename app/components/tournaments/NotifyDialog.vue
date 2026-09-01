<script setup lang="ts">
import { subscribeToTournament } from "~/lib/api/client"
import { TOURNAMENTS_COPY } from "~/content/tournaments"

/**
 * The reminder dialog — Figma `587:16433`, with `587:16453`, `587:16473` and
 * `587:16508` drawing its other three states.
 *
 * Four frames, one component. The design draws them as separate popups because
 * Figma has no state; read together they are a field that is empty, a field that
 * has been typed into, the same field after a submission it accepted, and the
 * same field after one it did not. Only `status` and the input's own value
 * differ between them, so the shell is written once.
 *
 * **A native `<dialog>`.** `showModal()` brings the focus trap, the Escape key,
 * `aria-modal`, inertness for the rest of the page and the `::backdrop`
 * pseudo-element with it — all of which a `<div>` overlay would have had to
 * reimplement, and most of which it would have got subtly wrong. The design's
 * backdrop is the page dimmed behind a 500px card, which is exactly what
 * `::backdrop` is for.
 *
 * **The submission can fail, and that is not a placeholder.** There is no
 * subscription endpoint (B2), so `subscribeToTournament` rejects under the mock
 * rather than resolving; see the note there for why a mock that resolved would
 * make this dialog lie. The success state below is real code that runs the day a
 * base URL exists — it is simply not reachable yet.
 */
const props = defineProps<{
  /** Which tournament the reminder is for. */
  tournamentId: string
  /** Names the dialog for assistive tech — the event this is about. */
  eventName: string
}>()

const open = defineModel<boolean>({ required: true })

const COPY = TOURNAMENTS_COPY.notifyDialog

type Status = "idle" | "sending" | "done" | "invalid" | "unavailable"

const dialog = useTemplateRef<HTMLDialogElement>("dialog")
const email = ref("")
const status = ref<Status>("idle")

/**
 * The check the FIELD can make, which is not the same as the address being
 * real — only the server can say that. Deliberately loose: something before an
 * `@`, something after it, and a dot in the domain. A stricter pattern rejects
 * addresses that work, and the design's message ("doesn't look valid") is about
 * appearance rather than existence.
 */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

async function submit() {
  if (status.value === "sending") return

  if (!looksLikeEmail(email.value)) {
    status.value = "invalid"
    return
  }

  status.value = "sending"
  try {
    await subscribeToTournament(props.tournamentId, email.value.trim())
    status.value = "done"
  } catch {
    // The only failure the mock can produce is "there is no endpoint", and that
    // is what the reader is told. A real backend will bring real failures worth
    // telling apart; inventing that vocabulary now would be inventing the
    // errors too.
    status.value = "unavailable"
  }
}

// Typing clears a verdict about what was typed before it. Without this the red
// stroke and its message would sit under a field the reader has already
// corrected, which reads as the correction having been rejected too.
watch(email, () => {
  if (status.value === "invalid" || status.value === "unavailable") {
    status.value = "idle"
  }
})

// `open` is the source of truth and the element follows it. `showModal` is what
// makes a `<dialog>` modal at all — an `open` attribute alone renders it inline,
// without the backdrop, the focus trap or the Escape key.
watch(open, (isOpen) => {
  const el = dialog.value
  if (!el) return

  if (isOpen) {
    email.value = ""
    status.value = "idle"
    el.showModal()
  } else if (el.open) {
    el.close()
  }
})

// Escape and a backdrop click close the dialog without going through `open`, so
// the element tells the model rather than the other way round.
function syncClosed() {
  open.value = false
}

const message = computed(() => {
  if (status.value === "done") return { text: COPY.success, tone: "success" as const }
  if (status.value === "invalid") return { text: COPY.invalid, tone: "error" as const }
  if (status.value === "unavailable")
    return { text: COPY.unavailable, tone: "error" as const }
  return null
})
</script>

<template>
  <!-- `p-0` and `bg-transparent`: the UA gives a `<dialog>` its own padding,
       border and background, and the card below carries all three itself.
       `backdrop:` styles the `::backdrop` pseudo-element, which is the page
       behind — the design dims it rather than blurring it. -->
  <dialog
    ref="dialog"
    :aria-label="`${COPY.heading} — ${eventName}`"
    class="rounded-[var(--radius-card)] bg-transparent p-0 backdrop:bg-black/70 open:m-auto"
    @close="syncClosed"
  >
    <!-- 500 wide, `#161616`, 36 of padding on a 36 gap (`587:16433`). `w-[500px]`
         with a viewport cap: a fixed 500 overflows a 390px phone, and a dialog
         that cannot be seen whole cannot be dismissed by pointing at the
         backdrop either. -->
    <div
      class="relative flex w-[min(500px,calc(100vw-2.5rem))] flex-col gap-9 rounded-[var(--radius-card)] bg-[#161616] p-9"
    >
      <!-- `587:16437` — absolute at (440, 12), which is 12px in from the card's
           own top-right corner rather than inside its 36px padding. -->
      <button
        type="button"
        :aria-label="COPY.closeLabel"
        class="focus-visible:ring-gold absolute top-3 right-3 flex items-center rounded-[var(--radius-btn)] bg-black/70 p-3 backdrop-blur-[4px] transition-colors hover:bg-black/90 focus-visible:ring-2 focus-visible:outline-none"
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

      <div class="flex flex-col items-center gap-6">
        <!-- The bell carries the brand gold in the file itself, so it is not
             tinted here. -->
        <img
          src="/assets/global/icon-notification.svg"
          alt=""
          aria-hidden="true"
          width="48"
          height="48"
          class="size-12"
        >
        <p
          class="font-display text-center text-[length:var(--text-display-label)] leading-[1.33] text-white"
        >
          {{ COPY.heading }}
        </p>
      </div>

      <!-- `novalidate`, and it is what makes the design's error state reachable.
           The input is `type="email"`, so the browser runs its own constraint
           check first and refuses to fire `submit` at all for a malformed
           address — the handler never ran, `status` never became `invalid`, and
           the reader got a native bubble instead of the red field and the
           message Figma draws (`587:16508`). Turning the browser's check off
           hands the verdict back to `looksLikeEmail`. The `type` stays: it is
           what gets the right keyboard on a phone and lets autofill recognise
           the field. -->
      <form novalidate class="flex flex-col gap-2" @submit.prevent="submit">
        <!-- The field is one box holding the input and its submit, which is why
             the ring is drawn on the wrapper with `focus-within` — a ring on the
             bare input would sit inside the box and read as a second edge.

             The error stroke is `#FF1558` (`587:16516`) and only ever appears
             after a submission: colouring the field while it is still being
             typed into tells the reader they are wrong before they have
             finished. -->
        <div
          :class="
            cn(
              'focus-within:ring-gold flex items-center gap-4 rounded-[var(--radius-btn)] bg-white/12 p-4 transition-colors focus-within:ring-2',
              status === 'invalid' || status === 'unavailable'
                ? 'ring-1 ring-[#FF1558]'
                : '',
            )
          "
        >
          <label class="sr-only" for="notify-email">{{ COPY.placeholder }}</label>
          <input
            id="notify-email"
            v-model="email"
            type="email"
            inputmode="email"
            autocomplete="email"
            :placeholder="COPY.placeholder"
            :disabled="status === 'sending'"
            class="font-sans min-w-0 flex-1 bg-transparent text-base leading-6 font-medium text-white placeholder:text-white/50 focus:outline-none"
          >
          <button
            type="submit"
            :aria-label="COPY.submitLabel"
            :disabled="status === 'sending'"
            class="focus-visible:ring-gold flex shrink-0 items-center rounded-sm transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-40"
          >
            <img
              src="/assets/global/icon-arrow-right.svg"
              alt=""
              width="24"
              height="24"
              class="size-6 invert"
            >
          </button>
        </div>

        <!-- Always in the DOM and empty until there is something to say: a live
             region inserted at the same moment as its text is routinely missed
             by screen readers, which need it present in order to watch it. The
             same construction `UnavailableButton` uses. -->
        <p role="status" class="flex items-center gap-2 empty:hidden">
          <template v-if="message">
            <img
              :src="
                message.tone === 'success'
                  ? '/assets/global/icon-tick.svg'
                  : '/assets/global/icon-close-outline.svg'
              "
              alt=""
              aria-hidden="true"
              width="24"
              height="24"
              class="size-6 shrink-0"
            >
            <span
              :class="
                cn(
                  'font-sans text-base leading-6 font-medium',
                  message.tone === 'success'
                    ? 'text-[#54CE83]'
                    : 'text-[#FF1558]',
                )
              "
            >
              {{ message.text }}
            </span>
          </template>
        </p>
      </form>
    </div>
  </dialog>
</template>
