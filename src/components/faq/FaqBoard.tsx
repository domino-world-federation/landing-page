import type { ReactNode } from "react"

import { FaqAccordion } from "@/components/ui/FaqAccordion"
import type { FaqPageItem } from "@/content/faq/items"

/**
 * The white card the questions sit in — Figma node `174:10652`.
 *
 * The legal document's card with an accordion in it instead of clauses: same
 * 20px radius, same 60px padding, same shadow, because it is the same panel on
 * the same shell (`LegalBody`). It is NOT built on `LegalDocument`, whose own
 * note offered to take this screen: that component is a numbered document
 * beside a table of contents, and this is a filtered list beside a set of
 * topics — sharing the shell (`PageHeader`, `SideTabLayout`, `SupportCard`) is
 * the part they have in common, and D57 drew the line in exactly that place.
 *
 * An empty result keeps the card rather than leaving a bare line on the dark
 * ground: on this page the card is the content area, and dropping it makes the
 * page look broken rather than filtered.
 *
 * Server Component; only the accordion's open state is client.
 */
export function FaqBoard({
  items,
  empty,
}: {
  items: readonly FaqPageItem[]
  /** What to say when the filter or the search matched nothing. */
  empty: ReactNode
}) {
  return (
    <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] md:p-10 lg:p-[3.125vw]">
      {items.length === 0 ? (
        <p className="font-sans text-muted text-[length:var(--text-body-sm)] leading-[1.5]">
          {empty}
        </p>
      ) : (
        <FaqAccordion
          items={items}
          // The design opens the second item (`174:10658`) — an accordion where
          // everything is shut opens on a wall of questions with nothing to
          // read. A filtered list can be shorter than two, so it falls back to
          // the first and, at one item, that is the one open.
          defaultOpenId={(items[1] ?? items[0]).id}
        />
      )}
    </div>
  )
}
