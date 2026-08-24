import { MissionCard } from "@/components/about/MissionCard"
import { Reveal } from "@/components/motion/Reveal"
import { MISSION_CARDS, MISSION_COPY } from "@/content/about/mission"
import { STAGGER } from "@/lib/utils/motion"

/**
 * Mission — Figma node `107:2997`. The page's closing section.
 *
 * Centred, unlike everything above it: the header, Overview, Vision and Pillars
 * are all two-column, and this one collects the page back onto its axis before
 * the footer. The four cards are the only grid on the page.
 *
 * Server Component.
 */
export function Mission() {
  return (
    <section className="flex flex-col gap-12 px-5 py-16 md:px-10 lg:gap-[3.13vw] lg:px-20 lg:py-[4.17vw]">
      <div className="flex flex-col items-center gap-9 text-center">
        <Reveal y={32}>
          <p className="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-white uppercase">
            {MISSION_COPY.eyebrow}
          </p>
        </Reveal>

        <Reveal y={48} delay={STAGGER} blurFrom="10px">
          <h2 className="font-display bg-[image:var(--gradient-gold-text)] bg-clip-text text-[length:var(--text-display-statement)] leading-[1.08] text-transparent">
            {MISSION_COPY.heading.map((line) => (
              // A block per line so the design's break survives without a
              // `<br>` a translation would have to carry (RULES §9).
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </Reveal>

        {/* 1094 of 1920 — narrow enough that the sentence sits under the
            heading's second line rather than running past it. */}
        <Reveal y={32} delay={STAGGER * 2} className="lg:max-w-[1094px]">
          <p className="font-sans text-[length:var(--text-body-lg)] leading-[1.22] text-white">
            {MISSION_COPY.intro}
          </p>
        </Reveal>
      </div>

      {/* Four across at `lg`, two at `md`, one below — the cards carry a title
          and three lines of body each, and at four columns on a tablet the
          body wraps to seven. */}
      <ul className="grid list-none gap-5 md:grid-cols-2 lg:grid-cols-4">
        {MISSION_CARDS.map((card, i) => (
          <li key={card.id} className="flex">
            {/* The stagger is per card and the wrapper is `w-full` so the
                animated element, not the card inside it, is the grid item —
                otherwise every card sizes to its own content and the row
                loses its even columns. */}
            <Reveal y={40} delay={STAGGER * i} className="w-full">
              <MissionCard card={card} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
