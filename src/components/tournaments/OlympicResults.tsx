import { Reveal } from "@/components/motion/Reveal"
import { SilverCta } from "@/components/ui/SilverCta"
import { TOURNAMENTS_COPY } from "@/content/tournaments"
import { getOlympicResults } from "@/lib/api/client"

/**
 * Olympic Results — Figma node `385:17860`.
 *
 * A gold heading over five columns of results and a silver button under them.
 *
 * **A real `<table>`, not a grid of divs.** The design draws a header row over
 * data rows, each cell answering the same question down the column — which is
 * what a table is, and what lets a screen reader say "Category, Doubles" rather
 * than reading five loose words. The row backgrounds are on the cells so a row
 * still reads as one band once the columns stack.
 *
 * Below `lg` the table scrolls sideways inside its own box rather than
 * collapsing into cards: five short columns stay legible at 720px, and a
 * horizontal scroller keeps the header attached to its data.
 *
 * The design sets the rows in DM Sans, which the site does not load — it ships
 * Inter and Bebas (DESIGN-TOKENS §1) — so they are Inter at the same size, the
 * same substitution `SupportCard` makes for Inter Display.
 *
 * Server Component.
 */
export async function OlympicResults() {
  const results = await getOlympicResults()

  if (results.length === 0) return null

  const columns = TOURNAMENTS_COPY.results.columns

  return (
    <section
      aria-labelledby="olympic-results-heading"
      className="bg-bg flex flex-col items-center gap-10 px-5 py-16 md:px-10 lg:gap-[2.5vw] lg:px-20 lg:py-[3.125vw]"
    >
      <Reveal y={24}>
        <h2
          id="olympic-results-heading"
          className="font-display bg-[image:var(--gradient-gold-text)] bg-clip-text text-center text-[length:var(--text-display-sm)] leading-[0.95] text-transparent uppercase"
        >
          {TOURNAMENTS_COPY.results.heading}
        </h2>
      </Reveal>

      {/* The scroller, not the table, owns the overflow — a table that sets its
          own `overflow` loses its layout algorithm. */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[840px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr>
              {/* Bebas 36/44 in `#616161` (`381:17797`). The header row has no
                  fill in the design, unlike the rows under it. */}
              <Th className="w-[124px]">{columns.year}</Th>
              <Th className="w-[560px]">{columns.event}</Th>
              <Th className="w-[240px]">{columns.category}</Th>
              <Th>{columns.winners}</Th>
              <Th className="text-right">{columns.federation}</Th>
            </tr>
          </thead>

          <tbody>
            {results.map((result) => (
              <tr key={result.id}>
                {/* `rounded-l`/`rounded-r` on the end cells: the row's 12px
                    radius belongs to the band, and `border-separate` means the
                    row itself cannot carry a background. */}
                <Td className="rounded-l-[var(--radius-glass)]">
                  {result.year}
                </Td>
                <Td>{result.event}</Td>
                <Td>{result.category}</Td>
                <Td>{result.winners}</Td>
                <Td className="rounded-r-[var(--radius-glass)] text-right">
                  {result.federation}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SilverCta href={TOURNAMENTS_COPY.results.moreHref}>
        {TOURNAMENTS_COPY.results.more}
      </SilverCta>
    </section>
  )
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <th
      scope="col"
      className={`font-display text-muted px-6 py-4 text-[length:var(--text-display-label)] leading-[1.22] font-normal uppercase ${className}`}
    >
      {children}
    </th>
  )
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <td
      className={`font-sans bg-white/12 px-6 py-6 align-middle text-[length:var(--text-body-md)] leading-10 text-white ${className}`}
    >
      {children}
    </td>
  )
}
