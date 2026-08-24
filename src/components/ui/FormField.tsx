/**
 * One labelled field — Figma's `textfield-big` (`207:15161`).
 *
 * A label, then the value set large over a 2px `--color-divider` rule. The rule
 * is a `border-b` on the control rather than a `<rect>` of its own, as Figma
 * has it: a line whose only job is to underline the field it belongs to cannot
 * be announced, and as a border it moves with the field at every width.
 *
 * The label is rendered, not implied by the placeholder. A placeholder
 * disappears the moment there is text in the field, so a screen reader arriving
 * mid-entry would have nothing to announce.
 *
 * Promoted out of `SupportForm` when `/contact` needed the same field (D32/D43:
 * a component moves on its second user, not on the guess that there will be
 * one). It stays a plain component rather than a Client Component — it holds no
 * state of its own, and the forms that own the state are already client.
 */
export function FormField({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  autoComplete,
  multiline = false,
}: {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (next: string) => void
  type?: "text" | "email"
  autoComplete?: string
  /** Renders a `<textarea>` instead — a message is paragraphs, not a line. */
  multiline?: boolean
}) {
  // `w-full` and no intrinsic width: a text control carries a default `size` of
  // about 20 characters, which is a WIDTH rather than a minimum, and it would
  // set the card's min-content instead of the card setting the field's — the
  // trap the footer's newsletter input documents in full (D29).
  //
  // The placeholder is drawn at 40% black; the typed value is full black, or
  // the reader cannot see what they wrote against what they have not.
  const control =
    "font-sans w-full border-b-2 border-[var(--color-divider)] bg-transparent pb-4 text-[length:var(--text-body-lg)] leading-[1.33] font-semibold text-black transition-colors placeholder:text-black/40 focus:border-black focus:outline-none lg:pb-[0.94vw]"

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <label
        htmlFor={id}
        className="font-sans text-[length:var(--text-body-sm)] leading-8 font-semibold text-black"
      >
        {label}
      </label>

      {multiline ? (
        <textarea
          id={id}
          required
          rows={4}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`${control} resize-y`}
        />
      ) : (
        <input
          id={id}
          type={type}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={control}
        />
      )}
    </div>
  )
}
