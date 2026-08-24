import { SUPPORT_CARD_COPY } from "@/content/support-card"

/**
 * The white card at the foot of a side-tab column — Figma nodes `174:11252`
 * (terms) and `173:10083` (gallery).
 *
 * A 12px-radius panel with a two-line heading, a paragraph, and a near-black
 * button. Promoted here from `components/terms/` when the gallery turned out to
 * draw the identical card (D32/D43).
 *
 * This card is the only place in the entire design that points at a contact
 * page, and its paragraph the only copy that says what one is for — which is
 * what `/contact` was built from (R14).
 *
 * Server Component: a card and a link.
 */
export function SupportCard() {
  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-glass)] bg-white p-4">
      {/* Figma sets this in Inter Display Bold, a face the site does not load —
          the project ships Inter and Bebas only (DESIGN-TOKENS §1). Inter
          SemiBold at the same size is what the rest of the site uses for a card
          heading, so the weight follows the site rather than the file. */}
      <h2 className="font-sans text-[length:var(--text-display-caption)] leading-[1.25] font-semibold text-black">
        {SUPPORT_CARD_COPY.title.map((line) => (
          // Rendered as blocks rather than with a `<br>`, so the words stay
          // separate strings for translation.
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>

      <p className="font-sans text-muted text-sm leading-[1.57] font-medium">
        {SUPPORT_CARD_COPY.body}
      </p>

      <a
        href={SUPPORT_CARD_COPY.href}
        className="font-display flex items-center justify-center rounded-[4px] bg-[#1a1c1d] px-4 py-3 text-[length:var(--text-display-caption)] leading-[1.25] text-white uppercase transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {SUPPORT_CARD_COPY.cta}
      </a>
    </div>
  )
}
