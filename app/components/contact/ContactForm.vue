<script setup lang="ts">
import { ApiError, submitContact } from "~/lib/api/client"
import { CONTACT_COPY, CONTACT_TOPICS } from "~/content/contact"

/**
 * The message form.
 *
 * The card and its fields are `SupportForm`'s, down to the promoted `FormField`
 * — this page was drawn nowhere, so borrowing the one form the design DOES draw
 * is the closest thing to a source it has. Two controls are new: a topic select,
 * because the sentence this page is built on names five kinds of enquiry and a
 * message that says which one it is can be routed; and a textarea, because a
 * message is paragraphs rather than a line.
 *
 * **It sends now** — `POST /contact`, which lands in the backoffice's Contact
 * Messages. Until 2026-09-05 it refused in the open (D28) because there was no
 * endpoint; the endpoint existed from 2026-09-03 and this was the last thing
 * standing between someone typing a message and the federation reading it.
 *
 * The refusal it used to always give is still here and still reachable: with no
 * `NUXT_PUBLIC_API_BASE_URL` the client rejects before sending anything, and the
 * form says the channel is not live rather than pretending. That is the state
 * the whole site runs in without a backend, and it must not become a lie.
 */
const name = ref("")
const email = ref("")
const topic = ref<string>(CONTACT_TOPICS[0]!)
const message = ref("")

/** Empty means a human — see `UiHoneypotField`. */
const website = ref("")

type Status = "idle" | "sending" | "sent" | "throttled" | "failed" | "unavailable"

const status = ref<Status>("idle")

/**
 * The message is worth reading at 10 characters, which is the server's own
 * `min:10`. Checked here too so the reader is told before a round trip, not by
 * a 422 that arrives looking like a fault of theirs.
 */
const MIN_MESSAGE = 10

async function handleSubmit() {
  if (status.value === "sending") return

  status.value = "sending"

  try {
    await submitContact({
      name: name.value.trim(),
      email: email.value.trim(),
      topic: topic.value,
      message: message.value.trim(),
      website: website.value,
    })

    status.value = "sent"

    // Cleared on success, and only on success: the form is now empty for the
    // next enquiry, and nobody is left looking at a message they cannot tell
    // has been sent. On a failure the text stays exactly where it was — losing
    // what someone wrote because the network dropped it would be the worse of
    // the two mistakes by a long way.
    name.value = ""
    email.value = ""
    topic.value = CONTACT_TOPICS[0]!
    message.value = ""
  } catch (error) {
    // Three failures, told apart because the reader can act on the difference.
    // Anything that is not an `ApiError` never left the browser: the client
    // rejects before sending when there is no base URL.
    if (error instanceof ApiError) {
      status.value = error.status === 429 ? "throttled" : "failed"
    } else {
      status.value = "unavailable"
    }
  }
}

// Editing after a verdict clears it. Without this, "your message did not go
// through" sits under a form the reader has already rewritten, which reads as
// the rewrite having been rejected too.
watch([name, email, topic, message], () => {
  if (status.value !== "sending") status.value = "idle"
})

/**
 * What the live region says, and whether the federation's address follows it.
 *
 * The address is offered on both failures that leave the message unsent, and
 * withheld on success — a second route offered to someone who has just been
 * told their message arrived reads as doubt about whether it did.
 */
const notice = computed(() => {
  switch (status.value) {
    case "sent":
      return { text: CONTACT_COPY.success, withEmail: false, sent: true }
    case "throttled":
      return { text: CONTACT_COPY.throttled, withEmail: false, sent: false }
    case "failed":
      return { text: CONTACT_COPY.failed, withEmail: true, sent: false }
    case "unavailable":
      return { text: CONTACT_COPY.unavailable, withEmail: true, sent: false }
    default:
      return null
  }
})
</script>

<template>
  <div
    class="flex flex-col gap-8 rounded-[var(--radius-card)] bg-white p-6 text-black shadow-[var(--shadow-card)] md:p-10 lg:gap-12 lg:p-[3.13vw]"
  >
    <div class="flex flex-col gap-4 lg:gap-6">
      <h2
        class="font-sans text-[length:var(--text-heading-card)] leading-[1.2] font-semibold text-black"
      >
        {{ CONTACT_COPY.formHeading }}
      </h2>
      <p class="font-sans text-[length:var(--text-eyebrow)] leading-8 text-black/60">
        {{ CONTACT_COPY.formIntro }}
      </p>
    </div>

    <form class="flex flex-col gap-8 lg:gap-12" @submit.prevent="handleSubmit">
      <UiFormField
        id="contact-name"
        v-model="name"
        :label="CONTACT_COPY.nameLabel"
        :placeholder="CONTACT_COPY.namePlaceholder"
        autocomplete="name"
      />

      <UiFormField
        id="contact-email"
        v-model="email"
        :label="CONTACT_COPY.emailFieldLabel"
        :placeholder="CONTACT_COPY.emailPlaceholder"
        type="email"
        autocomplete="email"
      />

      <!-- A native `<select>`, not a custom listbox. The design has no such
           control to copy, and a hand-rolled one would owe the reader keyboard
           handling, typeahead and a focus trap that the platform already ships —
           inventing chrome is one thing, inventing behaviour another. Styled to
           match the fields beside it: the same rule underneath, the same type. -->
      <div class="flex flex-col gap-4 lg:gap-6">
        <label
          for="contact-topic"
          class="font-sans text-[length:var(--text-body-sm)] leading-8 font-semibold text-black"
        >
          {{ CONTACT_COPY.topicLabel }}
        </label>
        <select
          id="contact-topic"
          v-model="topic"
          class="font-sans w-full appearance-none border-b-2 border-[var(--color-divider)] bg-transparent pb-4 text-[length:var(--text-body-lg)] leading-[1.33] font-semibold text-black transition-colors focus:border-black focus:outline-none lg:pb-[0.94vw]"
        >
          <option v-for="option in CONTACT_TOPICS" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>

      <UiFormField
        id="contact-message"
        v-model="message"
        :label="CONTACT_COPY.messageLabel"
        :placeholder="CONTACT_COPY.messagePlaceholder"
        :minlength="MIN_MESSAGE"
        multiline
      />

      <UiHoneypotField id="contact-website" v-model="website" />

      <div class="flex flex-col items-start gap-4">
        <!-- Disabled only while the request is in flight, and the label says so.
             A button that stays pressable during a submit invites a second
             message identical to the first; one that stays disabled afterwards
             would strand anyone whose send failed. -->
        <button
          type="submit"
          :disabled="status === 'sending'"
          class="rounded-btn font-display border border-black px-6 py-3 text-[length:var(--text-display-btn)] leading-10 text-black uppercase transition-colors hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-black"
        >
          {{ status === "sending" ? CONTACT_COPY.sending : CONTACT_COPY.submit }}
        </button>

        <!-- `role="status"` so the notice is announced when it appears — a
             reader who submitted by keyboard has no other way to learn that
             nothing happened. Always in the DOM, empty until there is something
             to say: a live region inserted at the same moment as its text is
             routinely missed by screen readers, which need it present in order
             to watch it. -->
        <p
          role="status"
          class="font-sans text-base leading-6 empty:hidden"
          :class="notice?.sent ? 'text-black' : 'text-black/60'"
        >
          <template v-if="notice">
            {{ notice.text }}
            <template v-if="notice.withEmail">
              <a
                :href="`mailto:${CONTACT_COPY.email}`"
                class="text-black underline decoration-from-font underline-offset-4"
              >{{ CONTACT_COPY.email }}</a>.
            </template>
          </template>
        </p>
      </div>
    </form>
  </div>
</template>
