import { Reveal } from "@/components/motion/Reveal"
import { RulebookCard } from "@/components/domino/RulebookCard"
import { REFEREE_DUTIES, REGULATIONS_COPY } from "@/content/domino/regulations"
import { getResources } from "@/lib/api/client"
import { STAGGER } from "@/lib/utils/motion"
import type { ResourceDocument } from "@/lib/api/types"

/**
 * Download & Regulations — wireframe `119:4581`.
 *
 * **No hi-fi design exists for this section** (D42), so what follows is the
 * wireframe's layout and the wireframe's words with this site's palette over
 * them. Nothing is invented: the four referee duties, both headings, the intro
 * and the two regulation titles are all drawn.
 *
 * Two columns. Figma states them as a 12-column grid with the card at
 * `1 / span 4` and the guidelines at `6 / span 7` — four columns, one empty,
 * then seven. Written here as a flex row splitting 4 and 7 with a gap where the
 * empty column was, the same `grow`/`basis-0` pair `Resources` uses (D14): the
 * ratio is the design's intent and a fixed width is not, so the two divide
 * whatever row they are given.
 *
 * **Three documents, two calls.** The rulebook and the two regulation rows are
 * documents — a title, a type, a size, a file — so they come from
 * `getResources(category)` rather than from the copy file (RULES §8). Asked for
 * by category twice rather than fetched once and split by index: the order of an
 * array is not a contract, and `[0]` versus the rest would break silently the
 * first time the shelf is reordered.
 *
 * Server Component (`async`), like `Resources`.
 */
export async function Regulations() {
  const [rulebooks, regulations] = await Promise.all([
    getResources("Rulebook"),
    getResources("Regulations"),
  ])

  // The section draws one rulebook. If the shelf ever holds two, this takes the
  // first rather than stacking them into a cell the design sized for one —
  // and if it holds none, the column is simply absent instead of rendering an
  // empty card.
  const rulebook = rulebooks[0]

  return (
    <section
      aria-labelledby="regulations-heading"
      className="px-5 py-16 md:px-10 lg:px-20 lg:py-[5vw]"
    >
      {/* The section's own name. It is not drawn — the wireframe gives the two
          halves their own `<h3>`s and no title above them — but a section
          needs a name to be navigable, and inventing a visible heading the
          design does not have would be a louder change than this. */}
      <h2 id="regulations-heading" className="sr-only">
        {REGULATIONS_COPY.sectionLabel}
      </h2>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-[2.08vw]">
        {/* 4 of the 12 columns. `items-stretch` on the row makes this wrapper
            as tall as the guidelines beside it; `[&>*]:h-full` reaches through
            `Reveal`'s own div so the card fills that height rather than ending
            wherever its four lines of copy do. The same reach `Resources` needs
            for its grid cards. */}
        {rulebook && (
          <Reveal y={32} className="lg:grow-[4] lg:basis-0 lg:[&>*]:h-full">
            <RulebookCard doc={rulebook} />
          </Reveal>
        )}

        {/* 7 of the 12 columns. The two blocks inside it are separated by a
            rule (`119:4620` carries a 1px top border), which is a border
            rather than an element for the reason the FAQ's separators are:
            a line that exists only to divide cannot be announced. */}
        <div className="flex flex-col gap-8 lg:grow-[7] lg:basis-0 lg:gap-[2.5vw]">
          <RefereeGuidelines />
          <CompetitionRegulations documents={regulations} />
        </div>
      </div>
    </section>
  )
}

/**
 * The referee half — `119:4593`.
 *
 * A heading, one line of prose, and the four duties in a 2×2 grid. The numbers
 * `01`–`04` are drawn in the design and generated here from the index, padded
 * to two digits, so an inserted duty cannot leave the list reading 01, 02, 02.
 *
 * A `<ol>` rather than a `<ul>`: the design numbers them, and a numbered list
 * that a screen reader announces as unordered has thrown away the one thing the
 * numbers say. The visible numerals are `aria-hidden` — the list already
 * announces its own positions, and without that they would be read twice.
 */
function RefereeGuidelines() {
  return (
    <div className="flex flex-col gap-4">
      <Reveal y={32}>
        <div className="flex flex-col gap-4">
          {/* Bebas at the section step. The wireframe types it 16px Inter caps
              like every other heading it draws, which is a wireframe's
              uniform, not a type decision. */}
          <h3 className="font-display text-[length:var(--text-display-2xs)] leading-[1.1] text-white uppercase">
            {REGULATIONS_COPY.refereeHeading}
          </h3>
          <p className="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60">
            {REGULATIONS_COPY.refereeIntro}
          </p>
        </div>
      </Reveal>

      <Reveal y={24} delay={STAGGER}>
        {/* 2×2 at `sm` and up. Below that the pairs would leave each duty a
            column narrower than its own numeral's gutter, so they stack. */}
        <ol className="grid list-none gap-4 sm:grid-cols-2">
          {REFEREE_DUTIES.map((duty, i) => (
            <li key={duty.id} className="flex gap-2">
              {/* Inter Bold, as drawn. `pt-1` is `119:4601`'s 4px of top
                  padding — the numeral is set on a smaller line box than the
                  text beside it and would otherwise ride high. */}
              <span
                aria-hidden
                className="font-sans shrink-0 pt-1 text-[length:var(--text-eyebrow)] leading-8 font-bold text-white"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/80">
                {duty.text}
              </span>
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  )
}

/**
 * The two regulation rows — `119:4620`.
 *
 * A heading over a pair of bordered rows, each a title at one end and a chevron
 * at the other. Unlike the rulebook these carry no description and no size: the
 * design gives them neither, and the mock leaves both unset rather than
 * inventing them.
 *
 * The whole row is the link — it is a 16px-padded strip whose only content is
 * the title, so there is nothing to stretch an anchor over and the row is
 * simply an `<a>`.
 */
function CompetitionRegulations({
  documents,
}: {
  documents: ResourceDocument[]
}) {
  if (documents.length === 0) return null

  return (
    // The wireframe's 1px top rule between this block and the duties above.
    <Reveal y={24} delay={STAGGER * 2}>
      <div className="flex flex-col gap-4 border-t border-white/12 pt-8 lg:pt-[2.08vw]">
        <h3 className="font-display text-[length:var(--text-display-2xs)] leading-[1.1] text-white uppercase">
          {REGULATIONS_COPY.competitionHeading}
        </h3>

        <ul className="flex list-none flex-col gap-2">
          {documents.map((doc) => (
            <li key={doc.id} className="flex">
              <a
                href={doc.fileUrl}
                aria-label={REGULATIONS_COPY.openLabel.replace("%s", doc.title)}
                className="focus-visible:ring-gold group flex w-full items-center justify-between gap-4 border border-white/12 p-4 transition-colors hover:bg-white/8 focus-visible:ring-2 focus-visible:outline-none"
              >
                <span className="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-white/80 uppercase">
                  {doc.title}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element -- a
                    16px inline SVG sized in CSS; next/image would add a layout
                    wrapper for no gain. Drawn white already, so unlike the
                    download glyph it needs no `invert`. Empty `alt`: the
                    chevron says "this opens", which the link already says. */}
                <img
                  src="/assets/global/icon-arrow-right.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}
