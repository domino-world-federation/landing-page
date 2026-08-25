import { FaqAccordion } from "@/components/ui/FaqAccordion"
import { Reveal } from "@/components/motion/Reveal"
import {
  DOMINO_FAQ_COPY,
  DOMINO_FAQ_DEFAULT_OPEN,
  DOMINO_FAQ_ITEMS,
} from "@/content/domino/faq"

/**
 * The Domino page's FAQ — wireframe `119:4634`.
 *
 * The landing page's FAQ is a white card on the dark ground; this one is a white
 * *section*, edge to edge, because that is what the wireframe draws
 * (`fills: ["#FFFFFF"]` on the section itself, no card inside it). The
 * difference is deliberate on the design's part: S11 is one block among eleven
 * dark ones, while this closes the page, and a full white band is a stop rather
 * than an interruption.
 *
 * The heading is centred here where S11's is left-aligned — again the
 * wireframe's own call (`119:4636` centres its container) — and black rather
 * than the gold gradient, for the reason `Faq` sets out: gold on white is 1.9:1
 * against the 4.5 RULES §10 asks for, at every one of the brand's three stops.
 *
 * **No `id="faq"`.** That anchor belongs to the landing page, which the footer
 * links to from every page including this one; claiming it here would send a
 * reader clicking "FAQ" in the footer to whichever of the two the browser found
 * first.
 *
 * Server Component. Only the accordion's open state is client.
 */
export function DominoFaq() {
  return (
    // `361:16085` in the updated file. This used to be a full white section,
    // which is what the wireframe drew and all there was to go on (D42); the
    // hi-fi makes it a white CARD floating on a `#0E0E0E → #1B1B1B` gradient,
    // so the white no longer runs edge to edge.
    <section
      aria-labelledby="domino-faq-heading"
      className="bg-linear-to-b from-[#0e0e0e] to-[#1b1b1b] px-5 py-14 md:px-10 lg:px-20 lg:py-[4.1667vw]"
    >
      {/* The card: 60 of vertical padding and 160 of horizontal on a 1920
          frame (`361:16086`), which puts the questions in a 1440px column. The
          horizontal figure is held as a `max-w` centred inside the card rather
          than as padding — as padding it would still be claiming most of a
          tablet, leaving the questions narrower than the gutters around them
          (D14). */}
      <div className="rounded-[var(--radius-card)] bg-white px-5 py-10 shadow-[var(--shadow-card)] md:px-10 lg:px-[8.3333vw] lg:py-[3.125vw]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 lg:gap-[3.33vw]">
        <Reveal y={32}>
          {/* Bebas 76/72 — `--text-display-sm`, the same step S11's heading and
              the format panels take. `leading-[0.95]` is Figma's 72 on a 76
              body. */}
          <h2
            id="domino-faq-heading"
            className="font-display text-center text-[length:var(--text-display-sm)] leading-[0.95] text-black uppercase"
          >
            {DOMINO_FAQ_COPY.heading}
          </h2>
        </Reveal>

        {/* One entrance for the whole list rather than a stagger down the
            questions — the same call `Faq` makes: the rows are a list about to
            be scanned, and animating them in sequence holds the last question
            back while the reader is already on the first. */}
        <Reveal y={32}>
          <FaqAccordion
            items={DOMINO_FAQ_ITEMS}
            defaultOpenId={DOMINO_FAQ_DEFAULT_OPEN}
          />
        </Reveal>
      </div>
      </div>
    </section>
  )
}
