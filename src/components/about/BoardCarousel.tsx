"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { BoardCard } from "@/components/about/BoardCard"
import { BOARDS_COPY } from "@/content/about/boards"
import { cn } from "@/lib/utils/cn"
import type { BoardMember } from "@/lib/api/types"

/**
 * The strip of board portraits — Figma node `112:3587`, with the arrows from
 * `112:3610`.
 *
 * Four 540px cards and three gaps come to 2232 inside a 1760 frame, so the row
 * overflows by design, exactly as Heritage's timeline does. The difference is
 * that this one carries arrows in the design and Heritage does not, so it is
 * driven by the reader rather than advancing on its own: a board is a list to
 * look through, not a history to be walked along.
 *
 * Like Heritage it rides native `overflow-x` scrolling, so trackpad, touch,
 * momentum and keyboard arrive already correct and the buttons simply drive the
 * same scroll position. Nothing here reimplements a scroller.
 *
 * Figma draws the left arrow at 30% opacity and the right one solid — the strip
 * starting at its beginning, with nowhere to go back to. That is a disabled
 * state rather than a decoration, so both arrows carry it and it tracks the
 * real position instead of being painted on.
 */
export function BoardCarousel({
  members,
  heading,
}: {
  members: BoardMember[]
  /**
   * The section's `<h2>`, handed down rather than rendered here. Figma puts the
   * arrows on the same row as the heading, and the arrows are state — so either
   * the heading comes into this client island or the row is split across two
   * components and has to be re-aligned by hand. Passing it as a prop from the
   * Server Component keeps it server-rendered while letting this file own the
   * row it belongs to (RULES §5).
   */
  heading: React.ReactNode
}) {
  const scroller = useRef<HTMLDivElement>(null)

  // Which ends the strip is against. Both true means nothing overflows — a
  // window wide enough to hold the whole board — and both arrows go quiet.
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  // Which card is nearest the left edge, for the announcement below. Derived
  // from the scroll position rather than from a click count, so dragging and
  // arrowing by keyboard are described as accurately as pressing a button.
  const [current, setCurrent] = useState(1)

  const sync = useCallback(() => {
    const el = scroller.current
    if (!el) return

    const max = el.scrollWidth - el.clientWidth
    // A pixel of slack at each end: fractional scroll offsets and device pixel
    // ratios rarely land exactly on the boundary, and an arrow that thinks it
    // still has somewhere to go is an arrow that does nothing when pressed.
    setAtStart(el.scrollLeft <= 1)
    setAtEnd(el.scrollLeft >= max - 1)

    const cards = el.querySelectorAll<HTMLElement>("[data-member]")
    const pitch =
      cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 0
    setCurrent(pitch > 0 ? Math.round(el.scrollLeft / pitch) + 1 : 1)
  }, [])

  // `scroll` fires for every source — button, drag, trackpad, keyboard — so one
  // listener keeps the arrows and the announcement true no matter what moved it.
  // The initial call covers the case where nothing overflows at all.
  useEffect(() => {
    const el = scroller.current
    if (!el) return

    sync()
    el.addEventListener("scroll", sync, { passive: true })

    // A resize can turn an overflowing strip into one that fits, and the scroll
    // event will not fire for it — the arrows would stay lit with nowhere left
    // to go.
    const observer = new ResizeObserver(sync)
    observer.observe(el)

    return () => {
      el.removeEventListener("scroll", sync)
      observer.disconnect()
    }
  }, [sync])

  const step = (direction: 1 | -1) => {
    const el = scroller.current
    if (!el) return

    const cards = el.querySelectorAll<HTMLElement>("[data-member]")
    // One card-plus-gap, measured from the DOM: both are clamps, so the number
    // only exists once the browser has resolved them.
    const pitch =
      cards.length > 1
        ? cards[1].offsetLeft - cards[0].offsetLeft
        : el.clientWidth * 0.8

    // Read here rather than through `useReducedMotion` during render: this is an
    // event handler, so no markup depends on it and the two sides cannot
    // disagree (RULES §12).
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    el.scrollBy({
      left: direction * pitch,
      behavior: reduced ? "auto" : "smooth",
    })
  }

  return (
    <>
      {/* Heading and arrows on one row — Figma `112:3611`, `space-between`. The
          arrows go under the heading on a phone, where a 184px control group
          beside a 72px title leaves the title two words a line. */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        {heading}

        <div className="flex shrink-0 items-center gap-[46px]">
          <ArrowButton
            label={BOARDS_COPY.previous}
            onClick={() => step(-1)}
            disabled={atStart}
          />
          <ArrowButton
            label={BOARDS_COPY.next}
            onClick={() => step(1)}
            disabled={atEnd}
            flipped
          />
        </div>
      </div>

      <div
        ref={scroller}
        // Named and focusable so the strip is reachable by keyboard: Tab lands
        // on it and the arrow keys scroll it — the browser's own behaviour, and
        // better than anything rebuilt here.
        role="region"
        aria-label={BOARDS_COPY.carouselLabel}
        tabIndex={0}
        className={cn(
          // Full-bleed: the strip is wider than the window by design, and the
          // section's gutters would only cut it short. The negative margin
          // cancels them and the matching padding puts the first card back where
          // the gutter had it, so the row starts flush with the heading above.
          "-mx-5 mt-10 overflow-x-auto overscroll-x-contain px-5 md:-mx-10 md:px-10 lg:-mx-20 lg:mt-[3.33vw] lg:px-20",
          // Snap on proximity rather than `mandatory`: mandatory fights a drag,
          // because every position the pointer passes through is one the browser
          // wants to correct.
          "snap-x snap-proximity",
          // The scrollbar is hidden because the strip runs full-bleed across the
          // section; the affordance is the arrows and the cards running off the
          // edge.
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "cursor-grab active:cursor-grabbing",
          "focus-visible:ring-gold focus-visible:ring-2 focus-visible:outline-none",
        )}
      >
        <DragToPan scroller={scroller}>
          <ol className="flex w-max list-none gap-4 lg:gap-[1.25vw]">
            {members.map((member) => (
              <li
                key={member.id}
                // `data-member` is what the step and the position measure
                // against: it marks the adjacent elements whose offset
                // difference IS one card-plus-gap.
                data-member
                className="w-[clamp(260px,28.13vw,540px)] shrink-0 snap-start"
              >
                <BoardCard member={member} />
              </li>
            ))}
          </ol>
        </DragToPan>
      </div>

      {/* Spoken, not shown: the design has no counter, but a screen-reader user
          pressing an arrow otherwise gets no confirmation that anything moved. */}
      <p aria-live="polite" className="sr-only">
        {BOARDS_COPY.position(current, members.length)}
      </p>
    </>
  )
}

/**
 * One of the two arrows — Figma `112:3597` / `112:3598`, 64 × 64.
 *
 * Disabled at the end of its travel rather than wrapping, unlike S6's pager: a
 * scroller has real ends and the scroll position shows them, so a button that
 * jumped back to the start would contradict what the strip is doing. The 30%
 * opacity is Figma's own for that state.
 */
function ArrowButton({
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
      className="focus-visible:ring-gold flex size-12 items-center justify-center rounded-full transition-opacity disabled:pointer-events-none disabled:opacity-30 focus-visible:ring-2 focus-visible:outline-none lg:size-16"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- an inline SVG
          sized in CSS; next/image would add a layout wrapper for no gain. */}
      <img
        src="/assets/global/icon-arrow-left.svg"
        alt=""
        width={32}
        height={32}
        // The icon is black, drawn for S6's white band; here it sits on the page
        // background, so it is inverted rather than downloaded a second time in
        // another colour.
        className={cn("size-8 invert", flipped && "rotate-180")}
      />
    </button>
  )
}

/**
 * Press-and-drag panning, mouse pointers only — the same component Heritage's
 * timeline uses, and for the same reasons: touch and pen already pan with
 * momentum the browser provides, and capturing them here would replace that with
 * a worse copy of itself.
 *
 * It drives `scrollLeft` rather than a transform so the buttons, the keyboard,
 * the trackpad and the drag all describe one position.
 */
function DragToPan({
  scroller,
  children,
}: {
  scroller: React.RefObject<HTMLDivElement | null>
  children: React.ReactNode
}) {
  // A ref rather than state: this changes on every pointer move, and re-rendering
  // the cards to store a number nothing renders would be the one expensive thing
  // in an otherwise free interaction.
  const drag = useRef<{ pointerX: number; scrollLeft: number } | null>(null)

  return (
    <div
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse") return
        const el = scroller.current
        if (!el) return
        drag.current = { pointerX: e.clientX, scrollLeft: el.scrollLeft }
        // Capture so a drag that leaves the strip — or the window — still ends
        // properly instead of leaving the page stuck in a dragging state.
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerMove={(e) => {
        const start = drag.current
        const el = scroller.current
        if (!start || !el) return
        // Inverted: the content follows the hand, so dragging left reveals what
        // lies to the right. `scrollTo` rather than assigning `scrollLeft`,
        // which the compiler's immutability rule rejects; `auto` keeps it
        // frame-accurate, where smooth would animate towards a target the next
        // pointer move has already replaced.
        el.scrollTo({
          left: start.scrollLeft - (e.clientX - start.pointerX),
          behavior: "auto",
        })
      }}
      onPointerUp={() => {
        drag.current = null
      }}
      onPointerCancel={() => {
        drag.current = null
      }}
      // Without this the browser starts its own text/image selection the moment
      // the pointer moves, and the drag turns into a highlight.
      className="select-none"
    >
      {children}
    </div>
  )
}
