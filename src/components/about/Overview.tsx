import { Reveal } from "@/components/motion/Reveal"
import { OVERVIEW_COPY, OVERVIEW_PILLARS } from "@/content/about/overview"
import { STAGGER } from "@/lib/utils/motion"

/**
 * Overview — Figma node `84:753`.
 *
 * The one white band on the page, and the only place About sets type on white.
 * It is placed directly under the photograph on purpose: the page goes dark →
 * picture → white → dark again, and this is the hinge.
 *
 * Only the two right-hand blocks move. The heading is the section's anchor —
 * it is what the reader's eye lands on when the white band arrives — and
 * animating it as well would leave nothing standing still for the pair beside
 * it to rise against. So the title is simply there, and STANDARDIZATION and
 * SANCTIONING come up into it.
 *
 * Server Component.
 */
export function Overview() {
  return (
    <section className="bg-[var(--color-surface-light)] px-5 py-16 md:px-10 lg:flex lg:justify-between lg:gap-16 lg:px-20 lg:py-[4.17vw]">
      {/* 362 of 1920 for the title column — narrow enough that the Bebas
          heading breaks into the four lines the design draws. */}
      <div className="mb-12 lg:mb-0 lg:w-[362px] lg:shrink-0">
        <p className="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-black uppercase">
          {OVERVIEW_COPY.eyebrow}
        </p>
        <h2 className="font-display mt-9 text-[length:var(--text-display-sm)] leading-[0.95] text-black uppercase">
          {OVERVIEW_COPY.heading}
        </h2>
      </div>

      {/* 1259 wide holding two 60px-gapped columns. They stack below `lg`, and
          below `md` the pair is one column of reading. */}
      <div className="grid gap-10 md:grid-cols-2 md:gap-[3.13vw] lg:max-w-[1259px] lg:flex-1">
        {OVERVIEW_PILLARS.map((pillar, i) => (
          // 64px of travel rather than the page's usual 40: these two are the
          // only thing moving in the band, so the rise has to be legible on its
          // own instead of reading as a settle.
          <Reveal key={pillar.id} y={64} delay={STAGGER * i}>
            <h3 className="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-black uppercase">
              {pillar.title}
            </h3>
            <p className="font-sans mt-9 text-[length:var(--text-body-lg)] leading-[1.22] text-[var(--color-ink-body)]">
              {pillar.body}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
