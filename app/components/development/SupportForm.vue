<script setup lang="ts">
import { ApiError, submitContact } from "~/lib/api/client"
import { SUPPORT_COPY } from "~/content/development/support"

/**
 * The grant application card — Figma node `207:15156`.
 *
 * A white 20px-radius panel padded 60: a heading, an intro, and fields set as a
 * label over a large placeholder with a 2px rule under it.
 *
 * **It sends now.** The card was taken off the page because there was nothing
 * to submit to (B2), and a form that collects a federation's details in order
 * to drop them is worse than no form. The application goes to `POST /contact`
 * under the "Development Support" topic and lands in the backoffice's Contact
 * Messages — the same inbox, because what arrives is a body, an address and a
 * request, which is the shape of a message. A table of its own starts earning
 * its keep when an application has a state to track; until somebody decides
 * that, it would be a second inbox for people to forget to open.
 *
 * The refusal it used to always give is still here and still reachable: with no
 * `NUXT_PUBLIC_API_BASE_URL` the client rejects before sending anything and the
 * card says applications are not open through this form. That is the state the
 * whole site runs in without a backend, and it must not become a lie.
 *
 * Figma draws neither the submit button nor a field for the request itself —
 * see `SUPPORT_COPY`, which records both additions and why the alternative was
 * worse.
 */
const federation = ref("")
const email = ref("")
const needs = ref("")

/** Empty means a human — see `UiHoneypotField`. */
const website = ref("")

type Status = "idle" | "sending" | "sent" | "throttled" | "failed" | "unavailable"

const status = ref<Status>("idle")

/**
 * The server's own `min:10` on a message, checked here too so the applicant is
 * told before a round trip rather than by a 422 that arrives looking like a
 * fault of theirs.
 */
const MIN_NEEDS = 10

async function handleSubmit() {
  if (status.value === "sending") return

  status.value = "sending"

  try {
    await submitContact({
      // The federation IS the sender here. The endpoint's `name` is who is
      // writing, and for an application from a national body that is the body.
      name: federation.value.trim(),
      email: email.value.trim(),
      topic: SUPPORT_COPY.topic,
      message: needs.value.trim(),
      website: website.value,
    })

    status.value = "sent"

    // Cleared on success and only on success. On a failure the text stays
    // exactly where it was — losing what somebody wrote because the network
    // dropped it is the worse of the two mistakes by a long way.
    federation.value = ""
    email.value = ""
    needs.value = ""
  } catch (error) {
    // Anything that is not an `ApiError` never left the browser: the client
    // rejects before sending when there is no base URL.
    if (error instanceof ApiError) {
      status.value = error.status === 429 ? "throttled" : "failed"
    } else {
      status.value = "unavailable"
    }
  }
}

// Editing after a verdict clears it. Without this, "the application did not go
// through" sits under a form the applicant has already rewritten, which reads
// as the rewrite having been rejected too.
watch([federation, email, needs], () => {
  if (status.value !== "sending") status.value = "idle"
})

const notice = computed(() => {
  switch (status.value) {
    case "sent":
      return SUPPORT_COPY.success
    case "throttled":
      return SUPPORT_COPY.throttled
    case "failed":
      return SUPPORT_COPY.failed
    case "unavailable":
      return SUPPORT_COPY.unavailable
    default:
      return ""
  }
})
</script>

<template>
  <div
    class="flex flex-col gap-8 rounded-[var(--radius-card)] bg-white p-6 text-black shadow-[var(--shadow-card)] md:p-10 lg:gap-12 lg:p-[3.13vw]"
  >
    <div class="flex flex-col gap-4 lg:gap-6">
      <h3
        class="font-sans text-[length:var(--text-heading-card)] leading-[1.2] font-semibold text-black"
      >
        {{ SUPPORT_COPY.formHeading }}
      </h3>
      <p class="font-sans text-[length:var(--text-eyebrow)] leading-8 text-black/60">
        {{ SUPPORT_COPY.formIntro }}
      </p>
    </div>

    <form class="flex flex-col gap-8 lg:gap-12" @submit.prevent="handleSubmit">
      <UiFormField
        id="support-federation"
        v-model="federation"
        :label="SUPPORT_COPY.federationLabel"
        :placeholder="SUPPORT_COPY.federationPlaceholder"
        type="text"
        autocomplete="organization"
      />

      <UiFormField
        id="support-email"
        v-model="email"
        :label="SUPPORT_COPY.emailLabel"
        :placeholder="SUPPORT_COPY.emailPlaceholder"
        type="email"
        autocomplete="email"
      />

      <UiFormField
        id="support-needs"
        v-model="needs"
        :label="SUPPORT_COPY.needsLabel"
        :placeholder="SUPPORT_COPY.needsPlaceholder"
        :minlength="MIN_NEEDS"
        multiline
      />

      <UiHoneypotField id="support-website" v-model="website" />

      <div class="flex flex-col items-start gap-4">
        <!-- Disabled only while the request is in flight. A button that stays
             pressable during a submit invites a second application identical to
             the first; one that stays disabled afterwards would strand anyone
             whose send failed. -->
        <button
          type="submit"
          :disabled="status === 'sending'"
          class="rounded-btn font-display border border-black px-6 py-3 text-[length:var(--text-display-btn)] leading-10 text-black uppercase transition-colors hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-black"
        >
          {{ SUPPORT_COPY.submit }}
        </button>

        <!-- `role="status"` so the notice is announced when it appears — an
             applicant who submitted by keyboard has no other way to learn what
             happened. The node is always rendered, empty until there is
             something to say: a live region added to the DOM at the same moment
             as its text is often missed by screen readers, which need it
             present in order to watch it. -->
        <p
          role="status"
          class="font-sans text-base leading-6 text-black/60 empty:hidden"
        >
          {{ notice }}
        </p>
      </div>
    </form>
  </div>
</template>
