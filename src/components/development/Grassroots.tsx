import { GrassrootsCard } from "@/components/development/GrassrootsCard"
import { Reveal } from "@/components/motion/Reveal"
import {
  GRASSROOTS_CARDS,
  GRASSROOTS_COPY,
} from "@/content/development/grassroots"
import { STAGGER } from "@/lib/utils/motion"

/**
 * Grassroots Initiatives — Figma node `192:14877`.
 *
 * The one centred section on the page, and the only heading set at 100px. Every
 * band above it is two columns reading left to right; this one collects the
 * page back onto its axis for the three programmes, the same job About's
 * Mission does before its footer.
 *
 * Server Component; only the entrances are client.
 */
export function Grassroots() {
  return (
    <section
      aria-labelledby="grassroots-heading"
      className="flex flex-col gap-10 px-5 py-16 md:px-10 lg:gap-[3.13vw] lg:px-20 lg:py-[4.17vw]"
    >
      <div className="flex flex-col items-center gap-6 text-center lg:gap-9">
        <Reveal y={32}>
          <p className="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-white uppercase">
            {GRASSROOTS_COPY.eyebrow}
          </p>
        </Reveal>

        {/* No `blurFrom` here, and it is not a style choice: that mode renders
            its children TWICE — a blurred copy cross-fading against a sharp one
            — so an `id` inside it lands in the document twice and
            `aria-labelledby` resolves to the `aria-hidden` copy. The heading is
            what names the section, so it keeps its `id` and gives up the blur;
            every other heading on this page arrives the same way. */}
        <Reveal y={48} delay={STAGGER}>
          <h2
            id="grassroots-heading"
            className="font-display bg-[image:var(--gradient-gold-text)] bg-clip-text text-[length:var(--text-display-statement)] leading-[1.08] text-transparent uppercase"
          >
            {GRASSROOTS_COPY.heading}
          </h2>
        </Reveal>
      </div>

      {/* Three across from `lg`, stacked below. No two-column step: the cards
          carry a 3:4 photograph each, so a 2-up row would leave one card alone
          on a second row at half the width of the pair above it. */}
      <ul className="grid list-none gap-5 lg:grid-cols-3">
        {GRASSROOTS_CARDS.map((card, i) => (
          <li key={card.id} className="flex">
            {/* The stagger is per card, and the wrapper is `w-full` so the
                animated element is the grid item — otherwise each card sizes
                to its own content and the row loses its even columns. */}
            <Reveal
              y={40}
              delay={STAGGER * i}
              className="h-full w-full [&>*]:h-full"
            >
              <GrassrootsCard card={card} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
