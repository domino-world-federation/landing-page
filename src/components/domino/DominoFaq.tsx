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
    <section
      aria-labelledby="domino-faq-heading"
      className="bg-white px-5 py-16 md:px-10 lg:px-20 lg:py-[5vw]"
    >
      {/* 256px of horizontal padding in the wireframe plus 40 inside it, on a
          1920 frame — the questions sit in a 1328px column. Written as a
          `max-w` centred in the section rather than as that padding: held as
          padding it would still be claiming most of a tablet, leaving the
          questions narrower than the gutters around them (D14). */}
      <div className="mx-auto flex w-full max-w-[1328px] flex-col gap-8 lg:gap-[3.33vw]">
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
    </section>
  )
}
