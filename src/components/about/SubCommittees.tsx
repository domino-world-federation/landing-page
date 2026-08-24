import Image from "next/image"

import { Reveal } from "@/components/motion/Reveal"
import { COMMITTEES_COPY } from "@/content/about/committees"
import { getSubCommittees } from "@/lib/api/client"
import { STAGGER } from "@/lib/utils/motion"
import type { SubCommittee } from "@/lib/api/types"

/**
 * Sub-Committees — Figma node `114:3667`.
 *
 * Six white cards on the page background, wrapping three to a row at the design
 * width. Figma sets each at a fixed 576 in a wrapping row, which is 1760 less
 * two 16px gaps divided by three — a three-column grid stated as widths. It is
 * built as the grid it is, so the cards stay even at every window instead of
 * leaving a ragged last row wherever 576 stops fitting.
 *
 * The committees come from the API (RULES §8): the federation adds and retires
 * them, and each will eventually have a page of its own — which is why the card
 * is a link when `href` is set and a plain panel when it is not. None are set
 * yet (blocker B2), so all six currently render as panels rather than as six
 * links that go nowhere.
 *
 * Server Component.
 */
export async function SubCommittees() {
  const committees = await getSubCommittees()

  return (
    <section className="px-5 py-16 md:px-10 lg:px-20 lg:py-[4.17vw]">
      {/* Heading and description on one row — Figma `114:3668`. The description
          is 480 of 1920 and sits at the right, so the two read as a title and
          its note rather than as a paragraph under a heading. */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
        <Reveal y={40}>
          <h2 className="font-sans text-[length:var(--text-heading-section)] leading-[1.1] text-white">
            {COMMITTEES_COPY.heading}
          </h2>
        </Reveal>

        <Reveal y={32} delay={STAGGER} className="lg:w-[480px] lg:shrink-0">
          <p className="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60">
            {COMMITTEES_COPY.description}
          </p>
        </Reveal>
      </div>

      {/* Three across at `lg`, two at `md`, one below. 64px under the header;
          3.33vw is 64/1920. */}
      <ul className="mt-10 grid list-none gap-4 md:grid-cols-2 lg:mt-[3.33vw] lg:grid-cols-3">
        {committees.map((committee, i) => (
          <li key={committee.id} className="flex">
            {/* The stagger runs across the row rather than down it — six cards
                lighting one after another in reading order. `w-full` so the
                animated wrapper is the grid item and the columns stay even. */}
            <Reveal y={32} delay={STAGGER * i} className="w-full">
              <CommitteeCard committee={committee} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * One committee — Figma `115:3717` and its five siblings.
 *
 * A link when there is somewhere to go and a `<div>` otherwise. A card that
 * looks like a link, hovers like one and leads nowhere is worse than one that
 * plainly does not lead anywhere yet — and an `<a>` without `href` is not
 * focusable, so it would also be a control the keyboard cannot reach.
 *
 * The name is stored in its natural case and shouted by CSS (RULES §9): Figma
 * types two of the six in lower case, which is a text-entry slip, and
 * `uppercase` is what makes all six uniform without editing the data.
 */
function CommitteeCard({ committee }: { committee: SubCommittee }) {
  const content = (
    <>
      <span className="font-display text-[length:var(--text-display-label)] leading-[1.22] text-black uppercase">
        {committee.name}
      </span>

      {/* The arrow's box, not the arrow: Figma draws an 8px-padded white square
          with a hairline border, so the mark sits in a frame rather than beside
          the text. */}
      <span className="flex shrink-0 items-center gap-3 rounded-[8px] border border-[var(--color-border-light)] p-2">
        <Image
          src="/assets/about/icon-committee-arrow.svg"
          // Empty: the arrow says "this opens", which the link already says.
          alt=""
          width={20}
          height={20}
          className="size-5"
        />
      </span>
    </>
  )

  const className =
    "flex w-full items-center justify-between gap-4 rounded-[20px] bg-[var(--color-surface-light)] px-5 py-8 lg:px-[1.04vw] lg:py-[1.67vw]"

  if (!committee.href) {
    return <div className={className}>{content}</div>
  }

  return (
    <a
      href={committee.href}
      className={`${className} focus-visible:ring-gold transition-colors hover:bg-[var(--color-surface-grey)] focus-visible:ring-2 focus-visible:outline-none`}
    >
      {content}
    </a>
  )
}
