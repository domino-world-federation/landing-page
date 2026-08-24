"use client"

import { useState, type FormEvent } from "react"

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
        <Field
          id="support-federation"
          label={SUPPORT_COPY.federationLabel}
          placeholder={SUPPORT_COPY.federationPlaceholder}
          value={federation}
          onChange={setFederation}
          type="text"
          autoComplete="organization"
        />

        <Field
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

/**
 * One field — Figma's `textfield-big` (`207:15161`).
 *
 * A label, then the value set at 36/48 over a 2px `--color-divider` rule. The
 * rule is a `border-b` on the input rather than a `<rect>` of its own, as
 * Figma has it: a line whose only job is to underline the field it belongs to
 * cannot be announced, and as a border it moves with the field at every width.
 *
 * The label is rendered, not implied by the placeholder. Figma sets the
 * placeholder at 40% black and gives no label above the rule for the email
 * field's own row — but a placeholder disappears the moment there is text in
 * the field, so a screen reader arriving mid-entry would have nothing to
 * announce. The same fix the newsletter field carries, except that here the
 * design already draws the label, so it stays visible.
 */
function Field({
  id,
  label,
  placeholder,
  value,
  onChange,
  type,
  autoComplete,
}: {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (next: string) => void
  type: "text" | "email"
  autoComplete: string
}) {
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <label
        htmlFor={id}
        className="font-sans text-[length:var(--text-body-sm)] leading-8 font-semibold text-black"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        // `w-full` and no intrinsic width: a text input carries a default
        // `size` of about 20 characters, which is a WIDTH rather than a
        // minimum, and it would set the card's min-content instead of the card
        // setting the field's — the trap the footer's newsletter input
        // documents in full.
        //
        // The placeholder is drawn at 40% black; the typed value is full
        // black, or the reader cannot see what they wrote against what they
        // have not.
        className="font-sans w-full border-b-2 border-[var(--color-divider)] bg-transparent pb-4 text-[length:var(--text-body-lg)] leading-[1.33] font-semibold text-black transition-colors placeholder:text-black/40 focus:border-black focus:outline-none lg:pb-[0.94vw]"
      />
    </div>
  )
}
