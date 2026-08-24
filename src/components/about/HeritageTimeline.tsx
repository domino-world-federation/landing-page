"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import { HERITAGE_COPY } from "@/content/about/heritage"
import { cn } from "@/lib/utils/cn"
import type { HeritageMilestone } from "@/lib/api/types"

/**
 * Milliseconds a card rests before the strip moves to the next one.
 *
 * The first pass used 3.4s — a card's summary is three lines, and that is about
 * how long they take to read. It was too slow to watch: the strip spends most of
 * its time standing still, and a reader who is not reading a card is simply
 * waiting. The strip pauses under the pointer and under keyboard focus anyway,
 * so anyone who wants to finish a card can stop it — which means the resting
 * time only has to be long enough to take a card in, not to read every word.
 */
const DWELL_MS = 1800

/**
 * How far one step travels, as a fraction of a card-plus-gap. A whole step would
 * put the next card exactly where the last one stood, which reads as a slideshow
 * cutting between frames; a little short of one leaves the previous card's edge
 * in view, so the movement reads as travel ALONG a strip rather than a swap.
 */
const STEP_RATIO = 0.9

/**
 * The travelling half of Heritage — Figma node `88:1167`.
 *
 * The design does not fit and is not meant to: Figma places the four cards at
 * x 350, 1010, 1670 and 2330 on a 1920 frame, so the last one ends 890px past
 * the right edge. That overhang is the section's whole idea — the timeline is
 * longer than the window.
 *
 * Two versions were built before this one, and both failed in a way worth
 * recording. A continuous CSS marquee was too smooth: an even, unbroken drift
 * reads as decoration, and cards slid out from under a sentence being read.
 * Arrow buttons fixed the pacing but made the section inert — nothing happened
 * unless the reader pressed something, and the timeline is not a control panel.
 *
 * So it advances **by itself, in steps**. The strip rests on a card long enough
 * to read it, then moves to the next. The pauses are what the smooth version
 * lacked: motion that stops is motion the eye can follow, and each stop is an
 * invitation to read rather than a thing to keep up with.
 *
 * It runs on native `overflow-x` scrolling, so keyboard, trackpad, touch and
 * momentum all arrive already correct and the auto-advance simply drives the
 * same scroll position. Take hold of it and it yields; let go and it resumes.
 */
export function HeritageTimeline({
  milestones,
}: {
  milestones: HeritageMilestone[]
}) {
  const scroller = useRef<HTMLDivElement>(null)

  // Paused while the reader is involved — pointer over the strip, keyboard focus
  // inside it, or a drag in progress. A strip that keeps marching while someone
  // is reading it, or scrolling it themselves, is fighting them.
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return

    // Read here rather than through `useReducedMotion` during render: this is an
    // effect, so nothing in the markup depends on it and the two sides cannot
    // disagree (RULES §12). A reader who reduces motion gets a strip that simply
    // does not move on its own — still fully scrollable by hand.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reduced.matches) return

    // Which way the strip is currently travelling. It turns round at each end
    // rather than jumping back to the start: this is a history with a first and
    // a last entry, and a cut from 2003 back to 1974 would say otherwise — where
    // reversing simply reads as walking back along the same line.
    let direction: 1 | -1 = 1

    const id = window.setInterval(() => {
      const el = scroller.current
      if (!el) return

      const max = el.scrollWidth - el.clientWidth
      // Nothing overflows — a narrow list, or a window wide enough to hold it.
      // There is no strip to travel, so there is nothing to do.
      if (max <= 1) return

      // A pixel of slack at each end: fractional scroll positions and device
      // pixel ratios mean the arithmetic rarely lands exactly on the boundary,
      // and a strip that thinks it has further to go simply stops dead.
      if (direction === 1 && el.scrollLeft >= max - 1) direction = -1
      else if (direction === -1 && el.scrollLeft <= 1) direction = 1

      // One card-plus-gap, measured from the DOM rather than restated here: the
      // card width and the gap are both clamps, so the number only exists once
      // the browser has resolved them. Two adjacent cards give it exactly, and
      // the fallback covers a single-milestone list.
      const cards = el.querySelectorAll<HTMLElement>("[data-milestone]")
      const pitch =
        cards.length > 1
          ? cards[1].offsetLeft - cards[0].offsetLeft
          : el.clientWidth * 0.8

      el.scrollBy({ left: direction * pitch * STEP_RATIO, behavior: "smooth" })
    }, DWELL_MS)

    return () => window.clearInterval(id)
  }, [paused])

  return (
    <div
      className="relative"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      // Focus, not just hover: someone arrowing along the strip by keyboard is
      // as much in the middle of reading it as someone hovering, and `focus`
      // does not bubble — `onFocus` in React is the capturing version, which is
      // exactly what a wrapper needs.
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <TimelineRules />

      <div
        ref={scroller}
        // Named and focusable so the strip is reachable by keyboard: with these,
        // Tab lands on it and the arrow keys scroll it — the browser's own
        // behaviour, and better than anything rebuilt here.
        role="region"
        aria-label={HERITAGE_COPY.timelineLabel}
        tabIndex={0}
        className={cn(
          "overflow-x-auto overscroll-x-contain pb-16 lg:pb-[3.13vw]",
          // Snap on PROXIMITY, not `mandatory`. Mandatory would fight both the
          // drag — every position the pointer passes through is one the browser
          // wants to correct — and the deliberate nine-tenths step. Proximity
          // only tidies a rest that was already close to a card.
          "snap-x snap-proximity scroll-pl-[clamp(20px,18.23vw,350px)]",
          // The scrollbar is hidden because the strip sits on the section's
          // gradient and a browser bar cuts across it. The affordance is carried
          // by the movement itself and by the cards running off both edges.
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "cursor-grab active:cursor-grabbing",
          "focus-visible:ring-gold focus-visible:ring-2 focus-visible:outline-none",
        )}
        style={{
          // The strip has no edges of its own: it fades into the band at both
          // sides so cards arrive and leave rather than being clipped. A
          // gradient overlay would need to know the band's colour, which changes
          // down the section — a mask does not.
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 4%, #000 96%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, #000 4%, #000 96%, transparent 100%)",
        }}
      >
        <DragToPan scroller={scroller}>
          <ol className="flex w-max list-none gap-[clamp(24px,9.375vw,180px)] pr-[clamp(24px,9.375vw,180px)] pl-[clamp(20px,18.23vw,350px)]">
            {milestones.map((milestone, i) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                index={i}
              />
            ))}
          </ol>
        </DragToPan>
      </div>
    </div>
  )
}

/**
 * Press-and-drag panning, added only for mouse pointers.
 *
 * Touch and pen are deliberately left alone: the browser already pans them, and
 * capturing those pointers here would replace momentum scrolling — which a phone
 * reader expects and which no handler is going to reproduce — with a worse copy
 * of itself. `pointerType === "mouse"` is the whole guard.
 *
 * It drives the scroll position rather than a transform on purpose. A `motion`
 * drag would move the track independently of the scroll offset, and the two
 * would immediately disagree with the keyboard, the trackpad and the
 * auto-advance. One source of truth is what keeps them all describing the same
 * strip.
 */
function DragToPan({
  scroller,
  children,
}: {
  scroller: React.RefObject<HTMLDivElement | null>
  children: React.ReactNode
}) {
  // A ref rather than state: this changes on every pointer move, and re-rendering
  // the four cards sixty times a second to store a number nothing renders would
  // be the one expensive thing in an otherwise free interaction.
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
        // lies to the right.
        //
        // `scrollTo` rather than assigning `scrollLeft`, which the compiler's
        // immutability rule rejects — it cannot tell a DOM node's property from
        // a React value that must not be written after render. The call does the
        // same thing, and `auto` keeps it frame-accurate: smooth behaviour here
        // would animate towards a target the next pointer move has replaced.
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

/**
 * One milestone — Figma `88:1202`. An `<li>` because the four are a sequence in
 * time, and a screen reader saying "list, 4 items" is the timeline's shape said
 * out loud.
 *
 * The year sits above the card on the design's dashed rule; the pair is one
 * column so the marker travels with the card it belongs to at every width.
 * Alternating cards drop 100px (Figma's y 240 / 340), which is what keeps the
 * strip from reading as a plain row of four.
 */
function MilestoneCard({
  milestone,
  index,
}: {
  milestone: HeritageMilestone
  index: number
}) {
  return (
    // `data-milestone` is how the auto-advance measures its step: it marks the
    // adjacent elements whose offset difference IS one card-plus-gap.
    <li
      data-milestone
      className="flex w-[clamp(280px,25vw,480px)] shrink-0 snap-start flex-col"
    >
      {/* Year and dot, centred on the rule below them — Figma `88:1171`. */}
      <div className="flex flex-col items-center gap-2 self-start">
        <span className="font-display text-[length:var(--text-display-year)] leading-[1.15] text-white">
          {milestone.year}
        </span>
        <span aria-hidden="true" className="size-3 rounded-full bg-white" />
      </div>

      <div
        className={cn(
          "flex h-[clamp(400px,26.04vw,500px)] flex-col gap-4 rounded-[32px] bg-[var(--color-surface-card)]/50 p-5 lg:gap-[1.46vw] lg:p-[1.46vw]",
          // Figma's y 240 for the odd cards and 340 for the even ones, measured
          // down from the marker row rather than from the section top.
          index % 2 === 0
            ? "mt-[clamp(32px,8.33vw,160px)]"
            : "mt-[clamp(32px,13.54vw,260px)]",
        )}
      >
        <h3 className="font-sans text-[length:var(--text-body-lg)] leading-[1.22] font-semibold text-white">
          {milestone.title}
        </h3>
        <p className="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60">
          {milestone.summary}
        </p>

        {/* `flex-1` and `min-h-0`: the photograph takes whatever the copy left,
            and without `min-h-0` a flex item refuses to shrink below its
            content and the card grows past its 500px instead. */}
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl">
          <Image
            src={milestone.imageUrl}
            alt={milestone.imageAlt}
            fill
            sizes="(min-width: 1024px) 25vw, 80vw"
            // A dragged image is a browser drag-and-drop by default, which
            // hijacks the pan the moment the pointer lands on a photograph.
            draggable={false}
            className="object-cover"
          />
        </div>
      </div>
    </li>
  )
}

/**
 * The dashed rules behind the cards — Figma `88:1169` and its ten siblings.
 *
 * Drawn rather than downloaded: it is eleven copies of one 2px dashed line at a
 * fixed 220px pitch, which is a repeating background, and an SVG of it would be
 * a file to fetch for something CSS already states in three declarations.
 *
 * It sits outside the scroller on purpose. The rules are the ground the timeline
 * travels across; moving them along with the cards would cancel the only cue
 * that anything moved at all.
 *
 * Two masks, intersected. The first chops each line into Figma's 8-on/4-off
 * dashes; the second is its stroke gradient, opaque for the top 80% and gone by
 * the foot, so the rules dissolve into the band rather than stopping on a line.
 */
function TimelineRules() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-[clamp(60px,5.8vw,112px)] bottom-0"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, var(--color-timeline-rule) 0 2px, transparent 2px 220px)",
        maskImage:
          "repeating-linear-gradient(180deg, #000 0 8px, transparent 8px 12px), linear-gradient(180deg, #000 80%, transparent 100%)",
        maskComposite: "intersect",
        WebkitMaskImage:
          "repeating-linear-gradient(180deg, #000 0 8px, transparent 8px 12px), linear-gradient(180deg, #000 80%, transparent 100%)",
        WebkitMaskComposite: "source-in",
      }}
    />
  )
}
