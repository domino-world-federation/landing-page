<script setup lang="ts">
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
 * **It does not send anything.** There is no endpoint (blocker B2), so
 * submitting says so and points at the address instead of swallowing the message
 * — D28, and the third time this site makes that call. When a `POST` exists,
 * only `handleSubmit` changes.
 */
const name = ref("")
const email = ref("")
const topic = ref<string>(CONTACT_TOPICS[0]!)
const message = ref("")
const notice = ref(false)

function handleSubmit() {
  // No endpoint to post to, so the browser's own navigation is stopped (by the
  // `.prevent` modifier) and the reader is told where this actually stands.
  notice.value = true
}
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
        multiline
      />

      <div class="flex flex-col items-start gap-4">
        <button
          type="submit"
          class="rounded-btn font-display border border-black px-6 py-3 text-[length:var(--text-display-btn)] leading-10 text-black uppercase transition-colors hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none"
        >
          {{ CONTACT_COPY.submit }}
        </button>

        <!-- `role="status"` so the notice is announced when it appears — a
             reader who submitted by keyboard has no other way to learn that
             nothing happened. Always in the DOM, empty until there is something
             to say: a live region inserted at the same moment as its text is
             routinely missed by screen readers, which need it present in order
             to watch it. -->
        <p
          role="status"
          class="font-sans text-base leading-6 text-black/60 empty:hidden"
        >
          <template v-if="notice">
            {{ CONTACT_COPY.unavailable }}
            <a
              :href="`mailto:${CONTACT_COPY.email}`"
              class="text-black underline decoration-from-font underline-offset-4"
            >{{ CONTACT_COPY.email }}</a>.
          </template>
        </p>
      </div>
    </form>
  </div>
</template>
