"use client"

import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useState } from "react"

import { NEWS_FEATURED_COPY } from "@/content/news/featured"
import type { NewsArticle } from "@/lib/api/types"
import { formatShortDate } from "@/lib/utils/date"
import { EASE } from "@/lib/utils/motion"

/** Seconds. Short: this is a swap the reader asked for, not an entrance. */
const FADE = 0.35

/**
 * The featured band — Figma node `156:7584`, 1920 × 850 full bleed.
 *
 * A photograph with a gradient shelf across its lower half carrying the story's
 * eyebrow, its headline and a gold button, and a pager in the corner stepping
 * through the federation's featured stories.
 *
 * **It does not advance by itself.** The design draws prev/next controls and a
 * counter and nothing else, so the band moves when the reader moves it. That is
 * worth stating because the stats wheel two pages over does the opposite: a
 * figure is a glance and can be shown in turn, but a headline is a sentence,
 * and copy that slides away mid-read is copy nobody finishes.
 *
 * The picture cross-fades rather than sliding. Only `opacity` animates
 * (RULES §12), and only the active story is mounted — six 1920-wide
 * photographs stacked and faded would mean downloading all six to show one, so
 * `AnimatePresence` holds the outgoing one just long enough to fade it out.
 *
 * The whole band is one Client Component rather than an island inside a server
 * shell: unlike the boards carousel (D41), every part of it changes with the
 * index — the picture, the eyebrow, the headline and the button's target — so
 * there is no static half to leave behind on the server.
 */
export function FeaturedStories({ stories }: { stories: NewsArticle[] }) {
  const prefersReducedMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  // Nothing flagged: the band would be an empty 850px hole, so the section
  // stands down entirely rather than printing furniture around no story. Not a
  // branch on `useReducedMotion` — this is data, identical on both sides of
  // hydration, so RULES §12's warning does not apply.
  if (stories.length === 0) return null

  const story = stories[index]
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: FADE, ease: EASE }

  // Wraps in both directions: the pager is two buttons and a count, with no
  // disabled state drawn, so running off either end returns to the other.
  const step = (delta: number) =>
    setIndex((i) => (i + delta + stories.length) % stories.length)

  return (
    <section
      aria-label={NEWS_FEATURED_COPY.regionLabel}
      aria-roledescription="carousel"
      // 850/1920. `aspect` above `lg` so the band keeps the design's
      // proportion at any width; below it the shelf's copy decides the height
      // and the picture fills whatever that leaves.
      className="relative isolate min-h-[520px] w-full overflow-hidden lg:aspect-[1920/850] lg:min-h-0"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={story.id}
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          <Image
            src={story.heroImageUrl ?? story.thumbnailUrl}
            // The band prints the headline beside the picture, so the alt text
            // describes the photograph rather than repeating the story. Empty
            // when the feed gave no description — better silent than wrong.
            alt={story.heroImageAlt ?? ""}
            fill
            // Figma hangs the picture 89px above the frame (`163:7627`), which
            // is a downward crop of a taller image, so the interesting part
            // sits above centre.
            className="object-cover object-[center_35%]"
            sizes="100vw"
            // The first story is the page's LCP: it is the largest thing above
            // the fold once the header band scrolls. Only the first, and only
            // while it is the one showing.
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* The shelf. Figma puts it at y:424 of 850 — the lower half — with a
          `#0E0E0E` gradient from nothing to opaque, so the picture reads
          through the top of it and the copy sits on solid ground at the bottom.

          Figma's 15px backdrop blur on the same frame is not reproduced. A
          backdrop filter applies at full strength across the whole box while
          the gradient over it starts at transparent, so its top edge lands as a
          straight line ruled across the photograph. The gradient is what makes
          the copy legible; the blur only added a seam. Reported from a
          screenshot of the tournament hero, which drew the identical bar. */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-8 bg-linear-to-b from-transparent via-[#0e0e0e]/75 to-[#0e0e0e] px-5 pt-24 pb-8 md:px-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:px-20 lg:pt-32 lg:pb-20">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={story.id}
            className="flex flex-col gap-2.5 lg:max-w-[1080px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
          >
            {/* Bebas 32/40 at 50%. Figma puts the opacity on the wrapper
                (`162:7607`) rather than on each of the three texts, which is
                the same result and says the one thing it means. */}
            <p className="font-display flex flex-wrap items-center gap-2.5 text-[length:var(--text-display-caption)] leading-[1.25] text-white/50">
              <span>{NEWS_FEATURED_COPY.eyebrow}</span>
              {/* The bullet is drawn as its own text node in Figma. It is
                  punctuation between two labels, not content, so it is hidden
                  rather than read out as "bullet" between them. */}
              <span aria-hidden>&bull;</span>
              <time dateTime={story.publishedAt}>
                {formatShortDate(story.publishedAt)}
              </time>
            </p>

            {/* Inter SemiBold 64/72. `--text-body-2xl` is that step. */}
            <h2 className="font-sans text-[length:var(--text-body-2xl)] leading-[1.125] font-semibold text-white">
              {story.title}
            </h2>
          </motion.div>
        </AnimatePresence>

        <div className="flex shrink-0 flex-col gap-6 lg:w-[320px]">
          {/* Figma's own button (`162:7611`): flat `#E1B762`, not the landing
              page's gradient `GoldCta` pill. Left as drawn — the two are
              different buttons and swapping one for the other would put the
              hero's chrome on a page that never asks for it. */}
          <a
            href={`/news/${story.slug}`}
            className="bg-gold rounded-btn font-display focus-visible:ring-gold flex h-18 items-center justify-center gap-4 px-5 text-[length:var(--text-body-lg)] leading-none text-black transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none"
          >
            {NEWS_FEATURED_COPY.readCta}
            {/* eslint-disable-next-line @next/next/no-img-element -- a 32px
                inline SVG sized in CSS. The shared arrow points LEFT, and
                +135° brings it round to up-and-right: the "opens an article"
                glyph rather than the straight rightward arrow that would read
                as "next item". −135° aims it down-right, which is the easy
                mistake. Drawn in `#0E0E0E` already, and this sits on gold, so
                no `invert`. */}
            <img
              src="/assets/global/icon-arrow-left.svg"
              alt=""
              width={32}
              height={32}
              className="size-8 rotate-135"
            />
          </a>

          {stories.length > 1 && (
            <div className="flex items-center justify-between gap-4">
              <PagerButton
                label={NEWS_FEATURED_COPY.previous}
                onClick={() => step(-1)}
              />

              {/* `aria-live` because the buttons beside it do not change their
                  own labels — without it, a reader pressing "next" hears
                  nothing at all happen. */}
              <p
                aria-live="polite"
                className="font-display text-[length:var(--text-display-caption)] leading-none text-white"
              >
                {NEWS_FEATURED_COPY.position
                  .replace("%1", String(index + 1))
                  .replace("%2", String(stories.length))}
              </p>

              <PagerButton
                label={NEWS_FEATURED_COPY.next}
                onClick={() => step(1)}
                flip
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * One end of the pager — `163:8170` and its mirror.
 *
 * 20%-white glass with a 32px arrow. One asset serves both ends: the shared
 * glyph points left, so "next" is the same file turned 180°.
 */
function PagerButton({
  label,
  onClick,
  flip = false,
}: {
  label: string
  onClick: () => void
  flip?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="rounded-btn focus-visible:ring-gold flex size-[62px] shrink-0 items-center justify-center bg-white/20 transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:outline-none"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- a 32px inline
          SVG sized in CSS. `invert` because the source is drawn in `#0E0E0E`
          for use on white, and this sits on dark glass. */}
      <img
        src="/assets/global/icon-arrow-left.svg"
        alt=""
        width={32}
        height={32}
        className={`size-8 invert ${flip ? "rotate-180" : ""}`}
      />
    </button>
  )
}
