<script setup lang="ts">
import { ApiError, submitIntegrityReport } from "~/lib/api/client"
import { INTEGRITY_COPY } from "~/content/integrity"

/**
 * Report an Integrity Issue — Figma node `601:17709`.
 *
 * A gold heading and two paragraphs on the left (452 of the design's 1920), the
 * form on the right in a white 1136 card.
 *
 * **This form files a report now** — `POST /integrity-reports`, into the
 * backoffice's Integrity Reports module. Until 2026-09-05 it refused in the
 * open, and of everything on this site it was the one that had to: a submit
 * that appeared to succeed would leave someone believing they had filed a
 * report about match-fixing or abuse when nothing had been filed at all.
 *
 * That reasoning did not go away when the endpoint arrived, it moved:
 *
 *   - **success is said only after the server has taken it.** Nothing optimistic,
 *     no "we have got this" written before the response;
 *   - **the two failure states never hedge.** "Nothing was filed" is stated,
 *     because someone who half-believes it went through will not send it again;
 *   - **the body is two fields and stays two.** The table behind it has no name,
 *     no email and no IP — the page promises confidentiality, and an address is
 *     an identity. Nothing here may be added "so we can follow up".
 *
 * The client-side checks still run and are not theatre: they are the ones the
 * form itself can make — a type was chosen, the description is long enough to be
 * worth reading — and they are the same two the server enforces.
 */
const COPY = INTEGRITY_COPY.report

type Status =
  | "idle"
  | "invalid-type"
  | "too-short"
  | "sending"
  | "sent"
  | "throttled"
  | "failed"
  | "unavailable"

const type = ref("")
const description = ref("")

/** Empty means a human — see `UiHoneypotField`. */
const website = ref("")

const status = ref<Status>("idle")

const MIN_DESCRIPTION = 20

async function submit() {
  if (status.value === "sending") return

  if (!type.value) {
    status.value = "invalid-type"
    return
  }
  if (description.value.trim().length < MIN_DESCRIPTION) {
    status.value = "too-short"
    return
  }

  status.value = "sending"

  try {
    await submitIntegrityReport({
      type: type.value,
      description: description.value.trim(),
      website: website.value,
    })

    status.value = "sent"

    // Cleared on success, and here that is about the reporter rather than about
    // tidiness: an account of harassment or match-fixing left sitting on screen
    // is readable by whoever walks past next. It has been transmitted, and the
    // message above says so. On a FAILURE it stays — the one thing worse than
    // leaving it on screen is discarding a report that never arrived.
    type.value = ""
    description.value = ""
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

// Typing clears a verdict about what was typed before it. Without this the
// message sits under a field the reader has already corrected, which reads as
// the correction having been rejected too. A success is left standing: it is
// about a report that is already filed, not about what is in the fields now.
watch([type, description], () => {
  if (status.value === "sending" || status.value === "sent") return
  status.value = "idle"
})

const message = computed(() => {
  switch (status.value) {
    case "invalid-type":
      return COPY.needsType
    case "too-short":
      return COPY.tooShort
    case "sent":
      return COPY.success
    case "throttled":
      return COPY.throttled
    case "failed":
      return COPY.failed
    case "unavailable":
      return COPY.unavailable
    default:
      return ""
  }
})

const FIELD_LABEL =
  "font-sans text-[length:var(--text-body-sm)] leading-8 font-semibold text-black"
const FIELD =
  "font-sans w-full border-0 border-b-2 border-[#DADADA] bg-transparent pb-4 text-[length:var(--text-heading-card)] leading-[1.33] font-semibold text-black placeholder:text-black/40 focus:border-black focus:outline-none"
</script>

<template>
  <section
    aria-labelledby="report-heading"
    class="flex snap-screen flex-col justify-center gap-10 px-5 pt-28 pb-16 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-20 lg:pt-[var(--nav-clearance)] lg:pb-[3.13vw]"
  >
    <div class="flex flex-col gap-6 lg:w-[23.5%] lg:shrink-0">
      <MotionReveal :y="40">
        <h2
          id="report-heading"
          class="font-display text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
        >
          {{ COPY.heading }}
        </h2>
      </MotionReveal>

      <p class="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60">
        {{ COPY.intro }}
      </p>
      <p class="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60">
        {{ COPY.reassurance }}
      </p>
    </div>

    <!-- 1136 of 1920 is 59.17%. -->
    <div
      class="w-full rounded-[var(--radius-card)] bg-white p-6 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] md:p-10 lg:w-[59.17%] lg:p-[3.13vw]"
    >
      <form class="flex flex-col gap-8 lg:gap-12" novalidate @submit.prevent="submit">
        <p
          class="font-sans text-[length:var(--text-heading-card)] leading-[1.2] font-semibold text-black"
        >
          {{ COPY.formHeading }}
        </p>

        <div class="flex flex-col gap-6">
          <label class="flex flex-col gap-4" for="integrity-type">
            <span :class="FIELD_LABEL">
              {{ COPY.typeLabel }}
              <!-- The asterisk is decoration; the field carries `required` for
                   the readers who need to be told. -->
              <span aria-hidden class="text-[#FF1D34]">*</span>
            </span>
            <select
              id="integrity-type"
              v-model="type"
              required
              :class="FIELD"
              :aria-invalid="status === 'invalid-type'"
            >
              <option value="" disabled>{{ COPY.typePlaceholder }}</option>
              <option v-for="item in COPY.types" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
          </label>

          <label class="flex flex-col gap-4" for="integrity-description">
            <span class="flex flex-wrap items-baseline gap-2">
              <span :class="FIELD_LABEL">{{ COPY.descriptionLabel }}</span>
              <span
                class="font-sans text-[length:var(--text-body-sm)] leading-8 font-medium text-[#999999]"
              >
                {{ COPY.descriptionHint }}
              </span>
            </span>
            <textarea
              id="integrity-description"
              v-model="description"
              rows="3"
              :minlength="MIN_DESCRIPTION"
              :placeholder="COPY.descriptionPlaceholder"
              :class="cn(FIELD, 'resize-y')"
              :aria-invalid="status === 'too-short'"
            />
          </label>
        </div>

        <UiHoneypotField id="integrity-website" v-model="website" />

        <!-- 64px gold, full width (`601:17735`). Disabled only in flight: a
             second press during a submit files the same incident twice, and a
             button that stayed disabled afterwards would strand a reporter whose
             submission failed. -->
        <button
          type="submit"
          :disabled="status === 'sending'"
          class="rounded-btn font-display bg-gold focus-visible:ring-gold flex h-16 w-full items-center justify-center px-5 text-[length:var(--text-display-caption)] leading-[1.25] text-black uppercase transition-colors hover:bg-[var(--color-gold-btn-light)] focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-gold"
        >
          {{ status === "sending" ? COPY.sending : COPY.submit }}
        </button>

        <!-- Always in the DOM and empty until there is something to say: a live
             region inserted at the same moment as its text is routinely missed
             by screen readers, which need it present in order to watch it. -->
        <!-- Red is for everything that did NOT get filed. A report that WAS
             filed must not be announced in the colour of a rejection — that is
             the whole point of this form telling the truth about its own
             state. -->
        <p
          role="status"
          class="font-sans text-center text-[length:var(--text-body-sm)] leading-6 font-medium empty:hidden"
          :class="status === 'sent' ? 'text-[#0F7A3D]' : 'text-[#FF1D34]'"
        >
          {{ message }}
        </p>

        <div class="flex flex-col items-center gap-3">
          <img
            src="/assets/global/icon-check-circle.svg"
            alt=""
            aria-hidden="true"
            width="36"
            height="36"
            class="size-9"
          >
          <p
            class="font-sans max-w-[704px] text-center text-[length:var(--text-label-xs)] leading-6 font-medium text-[#6B6B6B] uppercase"
          >
            {{ COPY.confidentiality }}
          </p>
        </div>
      </form>
    </div>
  </section>
</template>
