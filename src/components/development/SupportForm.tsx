"use client"

import { useState, type FormEvent } from "react"

import { FormField } from "@/components/ui/FormField"
import { SUPPORT_COPY } from "@/content/development/support"

/**
 * The grant application card — Figma node `207:15156`.
 *
 * A white 20px-radius panel padded 60: a heading, an intro, and two fields set
 * as a label over a large placeholder with a 2px rule under it.
 *
 * **Figma draws no submit button** (`207:15160` has two children and stops), so
 * one is added. That is the same call D28 made about the footer's subscribe
 * box in the opposite direction: there the design drew a box with no input, and
 * a field that cannot be typed into is worse than none; here it draws fields
 * with no way to send them, which is worse than none for the same reason. The
 * button's chrome follows the page's outlined control and its label is the
 * card's own heading, so nothing is invented but the shape — marked
 * `TODO(design)` in the copy file.
 *
 * **It does not submit an application.** There is no endpoint (blocker B2), so
 * submitting says so rather than swallowing a federation's details. When a
 * `POST` exists, only `onSubmit` changes.
 *
 * Client because the fields carry state and a submit handler — and it is a
 * component of its own rather than markup inside `SupportPrograms` so the
 * section's heading, copy and entrances stay on the server (RULES §5).
 *
 * The field itself moved to `ui/FormField` when `/contact` needed the same one
 * (D32/D43). Nothing about it changed in the move.
 */
export function SupportForm() {
  const [federation, setFederation] = useState("")
  const [email, setEmail] = useState("")
  const [notice, setNotice] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // No endpoint to post to, so the browser's own navigation is stopped and
    // the reader is told where this actually stands.
    event.preventDefault()
    setNotice(SUPPORT_COPY.unavailable)
  }

  return (
    <div className="flex flex-col gap-8 rounded-[var(--radius-card)] bg-white p-6 text-black shadow-[var(--shadow-card)] md:p-10 lg:gap-12 lg:p-[3.13vw]">
      <div className="flex flex-col gap-4 lg:gap-6">
        <h3 className="font-sans text-[length:var(--text-heading-card)] leading-[1.2] font-semibold text-black">
          {SUPPORT_COPY.formHeading}
        </h3>
        <p className="font-sans text-[length:var(--text-eyebrow)] leading-8 text-black/60">
          {SUPPORT_COPY.formIntro}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 lg:gap-12">
        <FormField
          id="support-federation"
          label={SUPPORT_COPY.federationLabel}
          placeholder={SUPPORT_COPY.federationPlaceholder}
          value={federation}
          onChange={setFederation}
          type="text"
          autoComplete="organization"
        />

        <FormField
          id="support-email"
          label={SUPPORT_COPY.emailLabel}
          placeholder={SUPPORT_COPY.emailPlaceholder}
          value={email}
          onChange={setEmail}
          type="email"
          autoComplete="email"
        />

        <div className="flex flex-col items-start gap-4">
          <button
            type="submit"
            className="rounded-btn font-display border border-black px-6 py-3 text-[length:var(--text-display-btn)] leading-10 text-black uppercase transition-colors hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none"
          >
            {SUPPORT_COPY.submit}
          </button>

          {/* `role="status"` so the notice is announced when it appears — a
              reader who submitted by keyboard has no other way to learn that
              nothing happened. The node is always rendered, empty until there
              is something to say: a live region added to the DOM at the same
              moment as its text is often missed by screen readers, which need
              it present in order to watch it. */}
          <p
            role="status"
            className="font-sans text-base leading-6 text-black/60 empty:hidden"
          >
            {notice}
          </p>
        </div>
      </form>
    </div>
  )
}
