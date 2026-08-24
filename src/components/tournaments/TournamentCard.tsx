import Image from "next/image"

import { TOURNAMENTS_COPY } from "@/content/tournaments"
import type { Tournament } from "@/lib/api/types"

/** The pill's fill per registration state — `373:17445` and `381:17468`. */
const PILL_TONE: Record<Tournament["registration"], string> = {
  open: "bg-[#609f6f]",
  ongoing: "bg-[#609f6f]",
  closed: "bg-[#dc8223]",
}

/**
 * One card on the tournament rail — Figma node `373:17424`.
 *
 * 572 wide, a half-transparent grey panel at 32px radius: the category and a
 * bookmark button on the top row, the name under them, then the registration
 * pill beside the place, and the artwork filling the rest.
 *
 * The card is NOT a link. The design gives it no destination, and the portal
 * that will hold a tournament page does not exist (phase 2) — `href` on
 * `Tournament` is optional for exactly that reason, and a card that navigates
 * nowhere is the silent no-op D28 rules out. When the field is set the name
 * becomes the link, so the card gains a destination without changing shape.
 *
 * Server Component.
 */
export function TournamentCard({ tournament }: { tournament: Tournament }) {
  const label = TOURNAMENTS_COPY.rail.registration[tournament.registration]

  return (
    <article className="flex w-[min(85vw,572px)] shrink-0 snap-start flex-col gap-7 rounded-[var(--radius-feature)] bg-[var(--color-surface-card)]/50 p-7">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          {/* Bebas 32/40 at half opacity (`373:17426`). */}
          <p className="font-display text-[length:var(--text-display-caption)] leading-[1.25] text-white/50">
            {tournament.category}
          </p>

          {/* Nothing stores a saved tournament yet (B2). It stays in the tab
              order and says why it cannot act, rather than disappearing or
              pretending to work — D28 for a control with no room to print a
              message beside it. */}
          <button
            type="button"
            aria-disabled="true"
            aria-label={TOURNAMENTS_COPY.rail.bookmarkUnavailable}
            className="focus-visible:ring-gold flex shrink-0 items-center rounded-[var(--radius-btn)] bg-black/70 p-3 backdrop-blur-[4px] focus-visible:ring-2 focus-visible:outline-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- a 24px
                inline SVG sized in CSS. */}
            <img
              src="/assets/tournaments/icon-bookmark.svg"
              alt=""
              width={24}
              height={24}
              className="size-6"
            />
          </button>
        </div>

        {/* Inter SemiBold 36/44 (`373:17427`). */}
        <h3 className="font-sans text-[length:var(--text-display-label)] leading-[1.22] font-semibold text-white">
          {tournament.href ? (
            <a
              href={tournament.href}
              className="focus-visible:ring-gold transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none"
            >
              {tournament.name}
            </a>
          ) : (
            tournament.name
          )}
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          {/* Inter Bold 20/32 in white on a 5px-radius chip. The colour carries
              meaning, so the word carries it too rather than the fill alone —
              RULES §10 does not let a state be a hue. */}
          <span
            className={`font-sans rounded-[5px] px-3 py-1 text-[length:var(--text-eyebrow)] leading-8 font-bold text-white uppercase ${PILL_TONE[tournament.registration]}`}
          >
            {label}
          </span>

          {/* Inter Regular 24/32 at 60% (`373:17428`). */}
          <p className="font-sans text-[length:var(--text-body-sm)] leading-8 text-white/60">
            {tournament.location}
          </p>
        </div>
      </div>

      {/* 678 tall in a 572 card — a 1.19 ratio held by `aspect` so the artwork
          keeps the design's proportion at every rail width rather than being
          pinned to a pixel height the card no longer has. */}
      <div className="relative aspect-[516/678] w-full overflow-hidden rounded-[var(--radius-glass)]">
        <Image
          src={tournament.imageUrl}
          alt={tournament.imageAlt}
          fill
          sizes="(max-width: 768px) 85vw, 572px"
          className="object-cover"
        />
      </div>
    </article>
  )
}
