import Image from "next/image"

import { NEWS_COPY } from "@/content/news"
import { cn } from "@/lib/utils/cn"
import type { NewsArticle } from "@/lib/api/types"

/**
 * The three shapes Figma cuts the mosaic from, as width/height pairs at design
 * size (`54:3157`). They are ratios rather than pixel sizes: the strip scales
 * with the viewport, so a card is sized by its aspect and its column width.
 *
 * - `tall`   540×700 — the default card, five of the seven slots
 * - `wide`   540×418 — the top of the stacked column
 * - `square` 258×258 — the pair beneath it, two to a row
 */
export type NewsCardSize = "tall" | "wide" | "square"

const RATIO: Record<NewsCardSize, string> = {
  tall: "aspect-[540/700]",
  wide: "aspect-[540/418]",
  square: "aspect-square",
}

/**
 * The square cards are less than half the width of the others and carry the
 * same 24px title in Figma, which at that size runs to four or five lines and
 * fills the whole tile. Dropping to 18px keeps the title to the two lines the
 * design shows without changing the type scale of the big cards.
 */
const TITLE_SIZE: Record<NewsCardSize, string> = {
  tall: "text-[length:var(--text-news-card)]",
  wide: "text-[length:var(--text-news-card)]",
  square: "text-[length:var(--text-news-card-sm)]",
}

/**
 * One tile of the S8 mosaic — node `55:3214` and its siblings.
 *
 * Figma builds every slot the same way regardless of size: a white 20px-radius
 * frame, the photograph filling it, a bottom-anchored scrim, the eyebrow and
 * headline sitting on that scrim, and a glass button in the top-right corner.
 * Only the frame's dimensions change between slots, which is why one component
 * covers all three.
 *
 * The whole tile is the link. Figma draws the arrow button as the affordance,
 * but a 48px target in the corner is a poor one on a card this size — so the
 * button is kept as the visual cue and the anchor is stretched over the tile
 * behind it (`after:absolute after:inset-0`), giving the full card as the hit
 * area while still announcing once.
 */
export function NewsCard({
  article,
  size = "tall",
  className,
  sizes,
}: {
  article: NewsArticle
  size?: NewsCardSize
  className?: string
  /** Passed down so each slot tells the browser its real rendered width. */
  sizes: string
}) {
  return (
    <article
      className={cn(
        "group relative isolate overflow-hidden bg-white",
        "rounded-[var(--radius-card)]",
        RATIO[size],
        className,
      )}
    >
      <Image
        src={article.thumbnailUrl}
        alt=""
        fill
        sizes={sizes}
        className="object-cover"
      />

      {/* Node `55:3216`: `rgba(0,0,0,0) → 0.7 at 50% → 1`, drawn in CSS rather
          than baked into the artwork because the same photograph is cropped to
          three different heights — a baked gradient would sit at the wrong
          place in two of them.

          Figma gives this frame 331 of the card's 700px, i.e. the bottom 47%.
          Taken as a PERCENTAGE it fails on the short cards: 47% of the 418px
          slot is 196px and of a 258px square only 121px, so the wash gets
          steeper as the tile gets shorter and the title ends up sitting on
          picture rather than on shadow — measured on the `wide` card, the
          headline landed on a sunlit chair with nothing under it.

          A fixed 340px instead, which is the design's own figure at design
          size, capped at 70% so it cannot swallow a small tile whole. The
          scrim is then the same depth under every headline regardless of the
          slot it is in.

          `to top` with the stops reversed so the percentages read from the
          bottom edge, which is where the design measures them. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[min(70%,340px)] bg-[linear-gradient(to_top,rgba(0,0,0,1)_0%,rgba(0,0,0,0.7)_50%,rgba(0,0,0,0)_100%)]"
      />

      {/* Figma pads this 46/24/24, but the top padding only exists to clear the
          scrim's soft edge — the text is bottom-anchored, so it is the bottom
          and side padding that place it. Scaled down below `lg` because 24px
          around an 18px title on a phone-width tile leaves little room. */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 lg:p-6">
        <p className="font-sans text-[length:var(--text-news-eyebrow)] leading-[1.4] text-white/70 uppercase">
          {NEWS_COPY.eyebrow}
        </p>
        {/* Clamped to two lines. Figma writes each headline short enough to
            fit in two, but these titles come from the API and nothing
            guarantees the next one will — an unclamped title on a 258px square
            grows upward until it fills the tile and runs off the top of its
            own scrim. `line-clamp` is the only way to bound it without
            measuring text, and it degrades to a plain overflow elsewhere. */}
        <h3
          className={cn(
            "font-sans leading-[1.5] font-medium text-white",
            "line-clamp-2",
            TITLE_SIZE[size],
          )}
        >
          {/* The stretched link: `after` covers the tile, so the anchor is the
              whole card while the accessible name stays just the headline. */}
          <a
            href={`/news/${article.slug}`}
            aria-label={NEWS_COPY.readLabel.replace("%s", article.title)}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {article.title}
          </a>
        </h3>
      </div>

      {/* Node `55:3219`: 48px glass square, `rgba(0,0,0,0.7)` + `blur(4px)`,
          12px padding around a 24px icon, inset 12px from the top-right.

          Decorative and `aria-hidden`: the stretched anchor above already
          announces the card, and a second focusable control pointing at the
          same URL would make every tile take two tab stops. The focus ring is
          driven by the link through `group-focus-within` so the corner still
          shows where the keyboard is. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-3 right-3 flex size-12 items-center justify-center rounded-[var(--radius-btn)] bg-black/70 backdrop-blur-[4px] transition-transform duration-200 group-hover:-translate-y-0.5 group-focus-within:ring-2 group-focus-within:ring-white"
      >
        {/* The shared asset points LEFT (S6's pager uses it both ways), so
            +135° brings it round to up-and-right — the "opens an article"
            glyph, rather than the straight rightward arrow that would read as
            "next item". Sign matters and is easy to get backwards: -135° on a
            left-pointing source aims it DOWN-right, which was the first
            attempt. `invert` because the source is drawn in `#0E0E0E` for use
            on white, and here it sits on a dark glass square. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- an inline SVG
            sized in CSS; next/image would add a layout wrapper for no gain. */}
        <img
          src="/assets/home/icon-arrow.svg"
          alt=""
          width={24}
          height={24}
          className="size-6 rotate-135 invert"
        />
      </div>
    </article>
  )
}
