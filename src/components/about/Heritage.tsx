import { HeritageTimeline } from "@/components/about/HeritageTimeline"
import { Reveal } from "@/components/motion/Reveal"
import { HERITAGE_COPY } from "@/content/about/heritage"
import { getHeritageMilestones } from "@/lib/api/client"
import { STAGGER } from "@/lib/utils/motion"

/**
 * Heritage — Figma node `88:1163`.
 *
 * The band the page darkens through: `#0e0e0e` at the top, `--color-surface-dark`
 * at the foot, which is exactly where Vision's own wash starts. The two meet
 * with no seam because they are the same colour, not because they are aligned.
 *
 * The milestones come from the API rather than from `content/` (RULES §8): each
 * one is an entity with a year, a summary and a photograph of its own, and the
 * federation keeps adding them. Only the section's framing is copy.
 *
 * Server Component; the scroller below it is the one client island.
 */
export async function Heritage() {
  const milestones = await getHeritageMilestones()

  return (
    <section className="bg-[linear-gradient(180deg,var(--color-bg)_0%,var(--color-surface-dark)_100%)] pt-16 lg:pt-[4.17vw]">
      <div className="flex flex-col items-center gap-9 px-5 text-center md:px-10 lg:px-20">
        <Reveal y={32}>
          <p className="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-white uppercase">
            {HERITAGE_COPY.eyebrow}
          </p>
        </Reveal>

        <Reveal y={40} delay={STAGGER} blurFrom="10px">
          <h2 className="font-display bg-[image:var(--gradient-gold-text)] bg-clip-text text-[length:var(--text-display-sm)] leading-[0.95] text-transparent uppercase">
            {HERITAGE_COPY.heading}
          </h2>
        </Reveal>
      </div>

      {/* 100px between the title and the timeline in Figma; 5.21vw is 100/1920.
          The scroller is full-bleed on purpose — it runs wider than the window
          and the section's gutters would only cut it short. */}
      <div className="mt-16 lg:mt-[5.21vw]">
        <HeritageTimeline milestones={milestones} />
      </div>
    </section>
  )
}
