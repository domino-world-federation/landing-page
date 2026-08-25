import Image from "next/image"

import { MEMBERS_COPY } from "@/content/members"
import { getMemberFederations } from "@/lib/api/client"
import type { MemberFederation } from "@/lib/api/types"

/** The design's table is two columns of three (`405:28396`). */
const ROWS = 6

/**
 * The members directory — Figma node `405:28394`.
 *
 * A gold Bebas 100 heading, six federations in two columns, and a glass button
 * to the full list. The count is stated in the request rather than sliced here:
 * the table is a fixed composition, not a shelf that grows, so a directory that
 * gained a seventh member would otherwise quietly break the two-by-three (D45).
 *
 * Server Component.
 */
export async function MemberDirectory() {
  const federations = await getMemberFederations(ROWS)

  if (federations.length === 0) return null

  // Two columns of three, filled DOWN each column as Figma fills them —
  // Indonesia, Jamaica, Mexico on the left; USA, China, Brazil on the right.
  const half = Math.ceil(federations.length / 2)
  const columns = [federations.slice(0, half), federations.slice(half)]

  return (
    <section
      aria-labelledby="directory-heading"
      className="flex flex-col items-center gap-8 px-5 py-10 md:px-10 lg:gap-12 lg:px-20 lg:py-[3.125vw]"
    >
      {/* Bebas 100 through the page's gold gradient. `uppercase` is the
          heading's, not the string's (D40). */}
      <h2
        id="directory-heading"
        className="font-display bg-[image:var(--gradient-gold-text)] bg-clip-text text-center text-[length:var(--text-display-statement)] leading-[1.08] text-transparent uppercase"
      >
        {MEMBERS_COPY.directoryHeading}
      </h2>

      <div className="flex w-full flex-col gap-2 lg:flex-row">
        {columns.map((column, index) => (
          <ul key={index} className="flex flex-1 flex-col gap-2">
            {column.map((federation) => (
              <MemberRow key={federation.id} federation={federation} />
            ))}
          </ul>
        ))}
      </div>

      {/* `405:28518` — 20% white glass, 320 × 64. Not `SilverCta`: that is the
          gradient pill, and this is a different button the design draws
          differently. */}
      <a
        href={MEMBERS_COPY.directoryCtaHref}
        className="rounded-btn font-display focus-visible:ring-gold flex h-16 w-full max-w-[320px] items-center justify-center bg-white/20 px-5 text-[length:var(--text-display-btn)] leading-10 text-white uppercase transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:outline-none"
      >
        {MEMBERS_COPY.directoryCta}
      </a>
    </section>
  )
}

/**
 * One federation — `405:28404`.
 *
 * A flag, the body's own name, then the country at half opacity. Figma sets
 * these in DM Sans, a face the project does not load — it ships Inter and Bebas
 * only (DESIGN-TOKENS §1) — so the row is set in Inter at the same size, the
 * same call `SupportCard` makes about Inter Display.
 */
function MemberRow({ federation }: { federation: MemberFederation }) {
  return (
    <li className="flex items-center gap-6 rounded-[var(--radius-glass)] bg-white/12 p-2">
      {/* 84 × 84 in Figma, drawn as a flat `#3E3E3E` square on every row — a
          placeholder for artwork the federation has not supplied. Where a flag
          exists it takes the slot; where it does not, the placeholder is the
          design as drawn rather than a gap. */}
      <div className="relative size-16 shrink-0 overflow-hidden rounded-[var(--radius-btn)] bg-[#3e3e3e] lg:size-21">
        {federation.flagUrl && (
          <Image
            src={federation.flagUrl}
            // Empty: the country is printed in the row beside it, so naming
            // the flag would announce it twice.
            alt=""
            fill
            sizes="84px"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-wrap items-baseline gap-x-6 gap-y-1">
        <p className="font-sans text-[length:var(--text-body-sm)] leading-8 font-medium text-white">
          {federation.name}
        </p>
        <p className="font-sans text-[length:var(--text-body-sm)] leading-8 font-medium text-white/50">
          {federation.country}
        </p>
      </div>
    </li>
  )
}
