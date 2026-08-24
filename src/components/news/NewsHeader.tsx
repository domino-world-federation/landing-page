import { SharpeningHeadline } from "@/components/motion/SharpeningHeadline"
import { NewsSearch } from "@/components/news/NewsSearch"
import { NEWS_HEADER_COPY } from "@/content/news/header"

/**
 * The news page's header band — Figma node `156:7513`.
 *
 * The band About, Domino and Development all open with, and deliberately so:
 * four pages of one site that begin differently for no reason a reader could
 * name is a defect rather than variation. The top padding reserves the `fixed`
 * navbar's height (~112px at `lg`: 36 + 60 + 16), since the first thing here is
 * type on the page background and without it the `<h1>` renders underneath the
 * bar.
 *
 * What differs from the other three is the right-hand slot. They put an intro
 * paragraph there; this page puts the search field, which is the design's call
 * and a good one — a page whose first control is a search box has told you what
 * it is without a sentence about it.
 *
 * Figma gives the heading `filter: blur(7.5px)` (`156:7521`). That is the state
 * it starts from, not how it sits; `SharpeningHeadline` clears it as an opacity
 * cross-fade between two static-blur copies, never as an animated `filter`
 * (RULES §11).
 *
 * Server Component. Only the headline and the search form are client, and both
 * are their own components so the boundary sits as deep as it goes (RULES §5).
 */
export function NewsHeader() {
  return (
    // 530px tall in Figma with 100px of padding under the content, bottom
    // aligned. `min-h` rather than a height, so a longer translation grows the
    // band instead of overflowing it; 27.6vw is 530/1920, so the design width
    // reproduces the band exactly and narrower windows fall back to the floor.
    <section className="flex min-h-[420px] flex-col justify-end gap-10 px-5 pt-32 pb-14 md:px-10 lg:min-h-[27.6vw] lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:px-20 lg:pb-[5.2vw]">
      <h1 className="font-sans w-full text-[length:var(--text-page-title)] leading-[1.1] font-medium text-white lg:max-w-[824px]">
        <SharpeningHeadline lines={NEWS_HEADER_COPY.title} />
      </h1>

      {/* Bottom-aligned against the heading's baseline, as the design has it —
          the row is `align-items: flex-end` and the field is the shorter of
          the two. */}
      <NewsSearch />
    </section>
  )
}
