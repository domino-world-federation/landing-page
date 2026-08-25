import { Reveal } from "@/components/motion/Reveal"
import { MEMBERSHIP_BENEFITS, MEMBERS_COPY } from "@/content/members"
import { STAGGER } from "@/lib/utils/motion"

/**
 * Membership benefits — Figma node `405:28521`.
 *
 * Three glass cards, 360 tall, each a gold icon tile at the top and its copy at
 * the foot. `justify-between` rather than a gap, as Figma has it: the cards are
 * a fixed height and the space between icon and text is whatever is left, so
 * three cards with different amounts of copy still line their icons up.
 *
 * The id is the hero pill's target — "Explore membership" scrolls here.
 *
 * **The three arrive in turn, not together.** `STAGGER` is the same step the
 * landing page puts between a headline and its body, so the row reads as one
 * gesture with an order rather than three things that happened at once. The
 * travel is small (24px) on purpose: a card that flies in from far away spends
 * its entrance drawing attention to the entrance.
 *
 * `Reveal` sits INSIDE each `<li>`, not around it. It renders a `div`, and a
 * `div` between `<ul>` and `<li>` is not a list any more — the rows would stop
 * being announced as "3 items" the moment the animation was added, which is a
 * strange way for motion to break a page.
 *
 * Server Component apart from the entrances.
 */
export function MembershipBenefits() {
  return (
    <section
      id="membership-benefits"
      aria-labelledby="benefits-heading"
      className="flex scroll-mt-28 flex-col gap-10 px-5 py-10 md:px-10 lg:gap-15 lg:px-20 lg:py-[4.1667vw]"
    >
      <h2
        id="benefits-heading"
        className="font-display bg-[image:var(--gradient-gold-text)] bg-clip-text text-center text-[length:var(--text-display-statement)] leading-[1.08] text-transparent uppercase"
      >
        {MEMBERS_COPY.benefitsHeading}
      </h2>

      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {MEMBERSHIP_BENEFITS.map((benefit, index) => (
          <li key={benefit.id} className="flex">
            <Reveal
              y={24}
              delay={index * STAGGER}
              className="flex flex-1 flex-col"
            >
              <div className="flex min-h-[280px] flex-1 flex-col justify-between gap-8 rounded-[var(--radius-card)] bg-linear-to-b from-white/12 to-white/4 p-6 lg:min-h-[360px]">
                {/* 72px gold tile with a 56px glyph centred in it
                    (`405:28528`). */}
                <span
                  aria-hidden
                  className="flex size-18 shrink-0 items-center justify-center rounded-[var(--radius-glass)] bg-[image:var(--gradient-gold-tile)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- a
                      56px inline SVG sized in CSS; next/image would add a
                      layout wrapper for no gain. */}
                  <img
                    src={benefit.iconUrl}
                    alt=""
                    width={56}
                    height={56}
                    className="size-14"
                  />
                </span>

                <div className="flex flex-col gap-4">
                  {/* Inter SemiBold 36/44. */}
                  <h3 className="font-sans text-[length:var(--text-body-lg)] leading-[1.22] font-semibold text-white">
                    {benefit.title}
                  </h3>
                  {/* Inter Regular 24/36 at 60%. Figma hard-breaks two of the
                      three bodies mid-sentence; the breaks are not reproduced —
                      the column decides where a line ends (D40). */}
                  <p className="font-sans text-[length:var(--text-body-sm)] leading-[1.5] text-white/60">
                    {benefit.body}
                  </p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
