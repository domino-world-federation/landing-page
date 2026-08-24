import Image from "next/image"

import { NEWS_ARCHIVE_COPY } from "@/content/news/archive"
import type { NewsArticle } from "@/lib/api/types"
import { formatShortDate } from "@/lib/utils/date"

/**
 * One tile in the archive grid — Figma node `163:8225` and its five siblings.
 *
 * A 572 × 322 photograph, then the category and date, then the headline. The
 * badge in the picture's corner is S8's, down to the `rgba(0,0,0,0.7)` fill,
 * the 4px blur and the 24px glyph (`165:8315` against `55:3219`), and it is
 * drawn the same way: the shared arrow asset points LEFT and +135° brings it
 * round to up-and-right — "opens an article" rather than the straight rightward
 * arrow that would read as "next item". The sign is easy to get backwards;
 * −135° aims it down-right.
 *
 * The whole card is the link. The badge is a 48px target beside a picture the
 * width of the card, so it stays the visual cue (`aria-hidden`, not focusable)
 * and the anchor stretches over the card behind it — one tab stop per story,
 * with the headline as its accessible name.
 *
 * Figma sets the headline `textCase: TITLE` and types every one of them in
 * lower case. Neither is reproduced: the case is the string's own (D40), and
 * the feed already stores headlines the way the federation writes them.
 */
export function NewsGridCard({ article }: { article: NewsArticle }) {
  return (
    <article className="group relative flex flex-col gap-3">
      {/* 572 × 322. An aspect rather than a height, so the picture keeps its
          crop as the column narrows instead of the frame closing on it. */}
      <div className="relative aspect-[572/322] w-full overflow-hidden rounded-[var(--radius-glass)]">
        <Image
          src={article.thumbnailUrl}
          // Empty: the headline below is the card's content, and naming the
          // picture would announce the story twice. The same call S8's tiles
          // and the Development strip both make.
          alt=""
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover"
        />

        {/* `165:8315`: inset 16px from the picture's top-right corner. */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-2 right-2 flex size-8 items-center justify-center rounded-[var(--radius-btn)] bg-black/70 backdrop-blur-[4px] transition-transform duration-200 group-hover:-translate-y-0.5 group-focus-within:ring-2 group-focus-within:ring-white lg:top-4 lg:right-4 lg:size-12"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- an inline
              SVG sized in CSS; next/image would add a layout wrapper for no
              gain. `invert` because the source is drawn in `#0E0E0E` for use
              on white, and here it sits on dark glass. */}
          <img
            src="/assets/global/icon-arrow-left.svg"
            alt=""
            width={24}
            height={24}
            className="size-4 rotate-135 invert lg:size-6"
          />
        </div>
      </div>

      {/* Bebas 32/40 at 50%. Figma puts the opacity on the wrapper
          (`163:8227`) rather than on each of the three texts. */}
      <p className="font-display flex flex-wrap items-center gap-2.5 text-[length:var(--text-display-caption)] leading-[1.25] text-white/50">
        <span>{article.category}</span>
        {/* Punctuation between two labels rather than content — hidden, so it
            is not read out as "bullet" between them. */}
        <span aria-hidden>&bull;</span>
        <time dateTime={article.publishedAt}>
          {formatShortDate(article.publishedAt)}
        </time>
      </p>

      {/* Inter SemiBold 28/36. */}
      <h3 className="font-sans text-[length:var(--text-heading-tile)] leading-[1.29] font-semibold text-white">
        {/* The stretched link: `after` covers the card, so the anchor is the
            whole tile while the accessible name stays the headline. */}
        <a
          href={`/news/${article.slug}`}
          aria-label={NEWS_ARCHIVE_COPY.readLabel.replace("%s", article.title)}
          className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
        >
          {article.title}
        </a>
      </h3>
    </article>
  )
}
