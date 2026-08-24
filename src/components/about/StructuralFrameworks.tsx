import Image from "next/image"

import { Reveal } from "@/components/motion/Reveal"
import { FRAMEWORKS_COPY } from "@/content/about/frameworks"
import { STAGGER } from "@/lib/utils/motion"

/**
 * Structural Frameworks — Figma node `111:3152`.
 *
 * The panel is a placeholder in the design and is built as one: Figma draws a
 * grey box with an icon and a grey sentence saying what the org chart will show.
 * Reproducing it honestly is the point — a page that quietly invents a
 * federation's committee structure is worse than one that visibly reserves the
 * space for it. See the note in `content/about/frameworks.ts`.
 *
 * The panel has no bottom radius and no bottom padding because it does not end:
 * Figma runs it into the section below (`80px 80px 0`, corners `12px 12px 0 0`),
 * so the box is a surface the page continues over rather than a card sitting on
 * it.
 *
 * The section fades UP into `--color-surface-dark` — transparent at the top,
 * solid at the foot — which is the reverse of Heritage's wash. Mission above it
 * sits on the page background, so the band has to arrive from nothing.
 *
 * Server Component.
 */
export function StructuralFrameworks() {
  return (
    <section className="bg-[linear-gradient(180deg,transparent_0%,var(--color-surface-dark)_100%)] px-5 pt-16 md:px-10 lg:px-20 lg:pt-[4.17vw]">
      <Reveal y={40}>
        <h2 className="font-sans text-[length:var(--text-heading-section)] leading-[1.1] text-white">
          {FRAMEWORKS_COPY.heading}
        </h2>
      </Reveal>

      {/* 64px between the heading and the panel; 3.33vw is 64/1920. */}
      <Reveal y={48} delay={STAGGER} className="mt-10 lg:mt-[3.33vw]">
        {/* 700 of 1760 is the design's ratio, held from `lg` up so the panel
            keeps its proportions with the window; below that it drops to a
            height the sentence fits rather than a shape nothing is in. */}
        <div className="flex h-[280px] flex-col items-center justify-center gap-6 rounded-t-[12px] bg-[var(--color-surface-dark)] px-5 text-center lg:h-[39.77vw] lg:max-h-[700px] lg:gap-[2.92vw]">
          {/* 62 × 56 in Figma. `alt=""` and `aria-hidden` — the mark is
              decoration on a placeholder, and there is nothing for it to name. */}
          <Image
            src="/assets/about/icon-frameworks-placeholder.svg"
            alt=""
            aria-hidden="true"
            width={62}
            height={56}
            className="h-10 w-auto lg:h-[min(2.92vw,56px)]"
          />

          {/* 864 of 1920 — narrow enough that the design's own break is where
              the sentence would break anyway. */}
          <p className="font-sans max-w-[864px] text-[length:var(--text-body-sm)] leading-[1.5] text-[var(--color-ink-placeholder)]">
            {FRAMEWORKS_COPY.placeholder.map((line) => (
              // A block per line so the design's break survives without a
              // `<br>` a translation would have to carry (RULES §9).
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </Reveal>
    </section>
  )
}
