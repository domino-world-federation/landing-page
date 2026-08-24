"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"

import { TOURNAMENTS_COPY } from "@/content/tournaments"

/**
 * The horizontal rail both card rows on `/tournaments` are built on — the
 * tournament rail (`373:17423`) and Champions Hall (`381:17639`).
 *
 * **A native scroller with arrows on top of it, not a carousel.** The design
 * draws four cards side by side, arrows above them, and — on the tournament
 * rail — a progress bar underneath, which is a scrollbar drawn by hand. So the
 * row scrolls: touch and trackpad get the gesture they already expect, a
 * keyboard reaches every card by tabbing into it, and the arrows are a
 * convenience over the top rather than the only way through. A transform-based
 * carousel would have had to reimplement all three.
 *
 * The state here is only what the CONTROLS need — how far along the row is —
 * and it is read from the scroller rather than driving it. That keeps the cards
 * themselves server-rendered: they are passed in as `children` and this
 * component never re-renders them.
 *
 * Scrolling is `scroll-behavior: smooth` in CSS rather than an animation, so
 * `prefers-reduced-motion` turns it off through the media query the utility
 * already carries (RULES §12) — nothing here needs to branch on it.
 */
export function CardRail({
  label,
  showProgress = false,
  children,
}: {
  /** Names the rail for assistive tech. */
  label: string
  /** The tournament rail draws the bar; Champions Hall does not. */
  showProgress?: boolean
  children: ReactNode
}) {
  const trackRef = useRef<HTMLDivElement>(null)

  // `progress` is the thumb's left edge as a fraction, `visible` its width —
  // both derived from the scroller, so the bar cannot disagree with the row.
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(1)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const measure = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const scrollable = track.scrollWidth - track.clientWidth

    setVisible(
      track.scrollWidth > 0 ? track.clientWidth / track.scrollWidth : 1,
    )
    // A row that fits needs no bar and no arrows: `scrollable` is 0, so the
    // thumb fills the track and both ends read as reached.
    setProgress(scrollable > 0 ? track.scrollLeft / scrollable : 0)
    setAtStart(track.scrollLeft <= 1)
    setAtEnd(scrollable <= 1 || track.scrollLeft >= scrollable - 1)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    measure()

    // `ResizeObserver` as well as the scroll listener: the thumb's width is a
    // ratio of two measurements that both change when the window does, and a
    // scroll event never fires for a resize.
    const observer = new ResizeObserver(measure)
    observer.observe(track)

    return () => observer.disconnect()
  }, [measure])

  /** One card plus its gutter, so a press lands the next card at the edge. */
  const step = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return

    const card = track.firstElementChild as HTMLElement | null
    const gap = 20
    const distance = card ? card.offsetWidth + gap : track.clientWidth

    track.scrollBy({ left: distance * direction, behavior: "smooth" })
  }

  return (
    <div className="flex flex-col gap-10 lg:gap-[3.125vw]">
      <div className="flex justify-end">
        <div className="flex items-center gap-12">
          <RailArrow
            label={TOURNAMENTS_COPY.previous}
            onClick={() => step(-1)}
            disabled={atStart}
          />
          <RailArrow
            label={TOURNAMENTS_COPY.next}
            onClick={() => step(1)}
            disabled={atEnd}
            flipped
          />
        </div>
      </div>

      {/* `-mx` + matching padding: the row bleeds to the window edge so a card
          is cut rather than floating in a gutter, which is how the design ends
          its rows. `snap-x` parks a card at the edge after a flick.

          `scrollbar-width: none` hides the native bar because the design draws
          its own below; the row is still scrollable by every other means. */}
      <div
        ref={trackRef}
        onScroll={measure}
        role="group"
        aria-label={label}
        className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 [scrollbar-width:none] md:-mx-10 md:px-10 lg:-mx-20 lg:px-20 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {showProgress && (
        // 1760 × 12 in the design (`381:17551`) with a 414 thumb — a scrollbar
        // drawn by hand. `aria-hidden` because it reports the scroller's
        // position, which assistive tech already gets from the scroller itself.
        <div
          aria-hidden
          className="h-3 w-full overflow-hidden rounded-[var(--radius-glass)] bg-white/20"
        >
          <div
            className="h-full rounded-[var(--radius-glass)] bg-white"
            style={{
              width: `${visible * 100}%`,
              // `translate` on a percentage of the TRACK, not the thumb: the
              // thumb travels the leftover width, which is what `progress`
              // measures against.
              marginLeft: `${progress * (1 - visible) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  )
}

/**
 * One arrow — `381:17672` (dimmed) and `381:17673`.
 *
 * The design dims the backward arrow at the start of the row, which is the
 * state it drew; here both ends do it, and `disabled` rather than a lower
 * opacity alone so the control leaves the tab order exactly when it stops
 * doing anything. That is not the D28 case: this button is not waiting on a
 * backend, it has genuinely reached the end of the row.
 */
function RailArrow({
  label,
  onClick,
  disabled,
  flipped = false,
}: {
  label: string
  onClick: () => void
  disabled: boolean
  flipped?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="focus-visible:ring-gold flex size-12 items-center justify-center rounded-[var(--radius-btn)] transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 lg:size-16"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- a 64px inline
          SVG sized in CSS. The shared glyph points LEFT and is drawn dark for
          use on white, so it is inverted here and flipped for "next". */}
      <img
        src="/assets/global/icon-arrow-left.svg"
        alt=""
        width={64}
        height={64}
        className={`size-12 invert lg:size-16 ${flipped ? "rotate-180" : ""}`}
      />
    </button>
  )
}
