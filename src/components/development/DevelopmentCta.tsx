import { Reveal } from "@/components/motion/Reveal"
import { SilverCta } from "@/components/ui/SilverCta"
import { DEVELOPMENT_CTA_COPY } from "@/content/development/cta"
import { STAGGER } from "@/lib/utils/motion"

/**
 * The page's closing call to action — Figma node `207:15320`.
 *
 * The same shape S13 closes the landing page with, and the same button: Bebas
 * at the display step over one paragraph of prose, then the silver pill. It
 * stands on the shine rather than on a fill of its own, which is why the
 * button's focus ring keeps its transparent offset (see `SilverCta`).
 *
 * Server Component; only the entrances are client.
 */
export function DevelopmentCta() {
  return (
    <section
      aria-labelledby="development-cta-heading"
      className="flex flex-col items-center gap-8 px-5 py-20 text-center md:px-10 lg:gap-9 lg:px-20 lg:py-[5.21vw]"
    >
      <div className="flex flex-col items-center gap-5 lg:gap-6">
        {/* 1135 of the design's 1920 — narrow enough that the headline breaks
            into the two lines Figma sets it on rather than running the width
            of a wide monitor. */}
        {/* No `blurFrom`: it renders its children twice, which would put this
            heading's `id` in the document twice and leave `aria-labelledby`
            pointing at the `aria-hidden` copy. */}
        <Reveal y={48} className="lg:max-w-[59.11vw]">
          <h2
            id="development-cta-heading"
            className="font-display text-[length:var(--text-display-md)] leading-[1.05] text-white uppercase"
          >
            {DEVELOPMENT_CTA_COPY.heading}
          </h2>
        </Reveal>

        {/* 1087, a shade narrower than the headline above it, so the paragraph
            sits inside the block rather than reaching past it. */}
        <Reveal y={32} delay={STAGGER} className="lg:max-w-[56.61vw]">
          <p className="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60">
            {DEVELOPMENT_CTA_COPY.body}
          </p>
        </Reveal>
      </div>

      <Reveal y={24} delay={STAGGER * 2}>
        <SilverCta href={DEVELOPMENT_CTA_COPY.ctaHref}>
          {DEVELOPMENT_CTA_COPY.cta}
        </SilverCta>
      </Reveal>
    </section>
  )
}
