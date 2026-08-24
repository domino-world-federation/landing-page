import { Reveal } from "@/components/motion/Reveal"
import { CardRail } from "@/components/tournaments/CardRail"
import { TournamentCard } from "@/components/tournaments/TournamentCard"
import { TOURNAMENTS_COPY } from "@/content/tournaments"
import { getTournaments } from "@/lib/api/client"

/**
 * All Tournaments — Figma node `373:17419`.
 *
 * A gold heading with the rail's arrows and a "View all" button beside it, four
 * cards below, and the hand-drawn scrollbar under those. The band fades from
 * `#262626` to nothing, which is what joins it to the white block above.
 *
 * The section renders on the server and hands the cards to `CardRail` as
 * children, so only the scroller's position is client (RULES §5).
 */
export async function TournamentRail() {
  const tournaments = await getTournaments()

  if (tournaments.length === 0) return null

  return (
    <section
      aria-labelledby="tournament-rail-heading"
      className="bg-linear-to-b from-[var(--color-surface-dark)] to-transparent px-5 py-16 md:px-10 lg:px-20 lg:py-[4.17vw]"
    >
      <div className="flex flex-col gap-10 lg:gap-[3.125vw]">
        {/* The heading row. The arrows live inside `CardRail` because they act
            on the scroller; this row carries the name and the button, and the
            two sit on one line at the design width. */}
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Reveal y={24}>
            {/* Bebas 100/108 — `--text-display-statement`, the step the
                Development page's own 100px heading already measured. */}
            <h2
              id="tournament-rail-heading"
              className="font-display bg-[image:var(--gradient-gold-text)] bg-clip-text text-[length:var(--text-display-statement)] leading-[1.08] text-transparent uppercase"
            >
              {TOURNAMENTS_COPY.rail.heading}
            </h2>
          </Reveal>

          <a
            href={TOURNAMENTS_COPY.rail.viewAllHref}
            className="font-display focus-visible:ring-gold flex h-16 items-center justify-center rounded-[var(--radius-btn)] bg-white/20 px-5 text-[length:var(--text-display-caption)] leading-[1.25] text-white uppercase transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:outline-none"
          >
            {TOURNAMENTS_COPY.rail.viewAll}
          </a>
        </div>

        <CardRail label={TOURNAMENTS_COPY.rail.label} showProgress>
          {tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </CardRail>
      </div>
    </section>
  )
}
