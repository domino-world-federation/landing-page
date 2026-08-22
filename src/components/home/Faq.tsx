import { FAQ_COPY, FAQ_DEFAULT_OPEN, FAQ_ITEMS } from "@/content/home/faq"
import { FaqAccordion } from "@/components/home/FaqAccordion"
import { Reveal } from "@/components/motion/Reveal"

/**
 * S11 — Figma node `81:690`. The FAQ.
 *
 * A white 20px-radius card on the page's dark ground, holding a gold-less
 * black heading and three question rows. The card is the section's whole
 * treatment: no artwork, no gradient, just a large field of white after ten
 * sections of dark — which is what makes the questions read as reference
 * material rather than as more of the page's pitch.
 *
 * Figma pads it `60px 160px` inside an outer 80px section padding, so at the
 * design width the questions start 240px from the window edge. That inner
 * padding is written as a fraction (8.33vw = 160/1920) rather than as pixels:
 * held literally it would still be claiming 320px of a 768px tablet, leaving
 * the questions a column narrower than the gutters around them (D14). Below
 * `lg` it drops to the section gutter entirely.
 *
 * `id="faq"` because the footer links to it — the one internal destination on
 * the page that exists.
 *
 * Server Component. Only the accordion's open state is client, and it is the
 * only part of the section that reaches for it.
 */
export function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="px-5 py-16 md:px-10 lg:px-20 lg:py-[4.17vw]"
    >
      {/* The card rises as the section arrives — one move for the whole block
          rather than a stagger down the questions. The rows are a list the
          reader is about to scan, and animating them in sequence would hold
          the last question back while they are already reading the first. */}
      <Reveal y={32}>
        <div className="shadow-card rounded-[var(--radius-card)] bg-white px-5 py-10 md:px-10 lg:px-[8.33vw] lg:py-[3.13vw]">
          <div className="flex flex-col gap-8 lg:gap-[2.5vw]">
            {/* Bebas 76/72 in black (`81:691`) — the same size S10's heading
                carries, so it borrows `--text-display-sm` rather than gaining
                a step of its own. `leading-[0.95]` is Figma's 72 on a 76 body.

                Black rather than the gold gradient every other heading uses:
                the card is white, and gold on white fails contrast at any of
                the brand's three stops (`#E1B762` on white is 1.9:1 against
                the 4.5 RULES §10 requires). Figma makes the same call. */}
            <h2
              id="faq-heading"
              className="font-display text-[length:var(--text-display-sm)] leading-[0.95] text-black uppercase"
            >
              {FAQ_COPY.heading}
            </h2>

            <FaqAccordion items={FAQ_ITEMS} defaultOpenId={FAQ_DEFAULT_OPEN} />
          </div>
        </div>
      </Reveal>
    </section>
  )
}
