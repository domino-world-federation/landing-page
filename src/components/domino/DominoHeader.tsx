import { SharpeningHeadline } from "@/components/motion/SharpeningHeadline"
import { DOMINO_HEADER_COPY } from "@/content/domino/header"

/**
 * The Domino page's header band — Figma node `119:4809`.
 *
 * The same composition About's header is, and deliberately so: both are a page
 * title on the page background under a `fixed` navbar, and giving the second one
 * its own numbers would make two pages of the same site open differently for no
 * reason a reader could name. The top padding is the bar's reservation, for the
 * reason `AboutHeader` sets out at length rather than repeated here.
 *
 * What differs is the right column. About puts one paragraph there; this page
 * puts a subtitle above it — the sentence that says what the page argues ("A
 * Discipline of Mathematic Precision") over the paragraph that supports it. So
 * the column is a stack of two rather than a single block, `justify-end` so the
 * pair bottoms out level with the title beside it.
 *
 * The headline sharpens; nothing else moves. Server Component.
 */
export function DominoHeader() {
  return (
    // 530px tall in Figma with 100px of padding under the content, bottom
    // aligned. 27.6vw is 530/1920 — `min-h` rather than a height so a longer
    // translation grows the band instead of overflowing it.
    <section className="flex min-h-[420px] flex-col justify-end gap-10 px-5 pt-32 pb-14 md:px-10 lg:min-h-[27.6vw] lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:px-20 lg:pb-[5.2vw]">
      {/* 824px in Figma. The title is short enough to sit on one line at every
          width, so the cap is what stops it from stretching across the band
          rather than what forces a break. */}
      <h1 className="font-sans w-full text-[length:var(--text-page-title)] leading-[1.1] font-medium text-white lg:max-w-[824px]">
        <SharpeningHeadline lines={DOMINO_HEADER_COPY.title} />
      </h1>

      {/* 480px wide with a 22px gap between the two (`119:4823`). `gap-[1.15vw]`
          is that 22 at the design width, with `gap-5` under it — the pair is
          two lines of type and the gap can shrink with them. */}
      <div className="flex w-full flex-col justify-end gap-5 lg:max-w-[480px] lg:gap-[1.15vw]">
        {/* 32/40 white — the loudest thing in the column, and the only line on
            the page that states the argument outright. */}
        <p className="font-sans text-[length:var(--text-body-md)] leading-10 text-white">
          {DOMINO_HEADER_COPY.subtitle}
        </p>
        {/* 20/32 at 60% — the small print, matching About's intro exactly. */}
        <p className="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60">
          {DOMINO_HEADER_COPY.intro}
        </p>
      </div>
    </section>
  )
}
