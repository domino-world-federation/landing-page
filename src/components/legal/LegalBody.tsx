import type { LegalSection } from "@/content/legal"

/**
 * The document itself — Figma nodes `174:11258` (terms) and `174:10846`
 * (privacy).
 *
 * A white 20px-radius card padded 60, holding the clauses separated by 4px
 * rules. An `<ol>` because the clauses are numbered and their numbers matter:
 * both documents close by referring readers to a desk, and a document whose
 * sections can be cited needs the citation to come from somewhere stable. The
 * markers are drawn rather than left to the browser, because the heading and
 * the number sit on one line at 36/48 and a list marker would not.
 *
 * Server Component — nothing here has state, and the contents column beside it
 * is the only client part of either page (RULES §5).
 */
export function LegalBody({ sections }: { sections: readonly LegalSection[] }) {
  return (
    <article className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] md:p-10 lg:p-[3.125vw]">
      <ol className="flex flex-col gap-8 lg:gap-12">
        {sections.map((section, index) => (
          <li
            key={section.id}
            // The rule between clauses (`174:11263`), 4px of `--color-divider`.
            // On the item and skipped for the first, so n clauses carry n−1
            // rules and none at the head.
            className="flex flex-col gap-8 border-t-4 border-[var(--color-divider)] pt-8 first:border-t-0 first:pt-0 lg:gap-12 lg:pt-12 lg:first:pt-0"
          >
            <div className="flex flex-col gap-6">
              {/* `scroll-mt` clears the `fixed` navbar: without it a fragment
                  jump parks the heading underneath the bar. The id is on the
                  heading rather than the item because that is what the contents
                  observer watches, and the heading is what should end up at the
                  top of the viewport. */}
              <h2
                id={section.id}
                className="font-sans scroll-mt-32 text-[length:var(--text-body-lg)] leading-[1.33] font-semibold text-black"
              >
                {index + 1}. {section.heading}
              </h2>

              {/* Inter Regular 24/36 in `#616161`. */}
              <p className="font-sans text-muted text-[length:var(--text-body-sm)] leading-[1.5]">
                {section.body}
                {section.email && (
                  <>
                    {" "}
                    <a
                      href={`mailto:${section.email}`}
                      className="focus-visible:ring-gold text-black underline decoration-from-font underline-offset-4 transition-colors hover:text-black/70 focus-visible:ring-2 focus-visible:outline-none"
                    >
                      {section.email}
                    </a>
                    .
                  </>
                )}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  )
}
