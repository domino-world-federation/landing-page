"use client"

import { useState } from "react"

import { EventCard } from "@/components/ui/EventCard"
import { FEATURED_EVENT_COPY } from "@/content/featured-event"
import { cn } from "@/lib/utils/cn"
import type { ShowcaseEvent } from "@/lib/api/types"

/**
 * The three columns of S6 and the pager that steps them — Figma `52:3027`.
 *
 * This is the one Client Component in the section, and it is client for exactly
 * one reason: the arrows. All three columns change together when the event does
 * — the name and particulars on the left, the card in the middle, the summary
 * and the two buttons on the right — so the state that selects the event has to
 * sit above all three. Splitting it any deeper would mean lifting the index into
 * a context and subscribing three separate islands to it, which is more moving
 * parts for the same render (RULES §5).
 *
 * The section shell around it — the band, the eyebrow, the heading — stays on
 * the server, and so does the fetch.
 *
 * Every event wears the same card: one gold-lit panel with the federation
 * watermark, the trophy and the event's own year across the foot. The year is
 * the only part of the card that is data, so the six read as one series rather
 * than six unrelated posters.
 *
 * Switching is a plain swap, not a transition. The band is dense with type — a
 * name, two fields, a paragraph, a pager and two buttons — and fading or sliding
 * all of it on every press would put the whole section in motion each time the
 * reader steps forward. The drift inside the card is the only movement here, and
 * it keeps running across a swap because the card itself never unmounts.
 */
export function EventShowcase({ events }: { events: ShowcaseEvent[] }) {
  const [index, setIndex] = useState(0)
  const event = events[index]

  // Wraps in both directions, so neither arrow is ever a dead end. With the
  // position spelled out as "n of 6" there is no ambiguity about where the wrap
  // lands, and an always-live control beats one that greys out at the ends.
  const step = (delta: number) =>
    setIndex((i) => (i + delta + events.length) % events.length)

  return (
    // Figma's own 100px gutter between the columns, as a fraction of the design
    // width so it narrows with the window instead of squeezing the columns.
    //
    // The row starts at `menu` (1400), not `lg`, and the widths inside it are
    // proportional rather than fixed — both for the same measured reason. Three
    // columns at Figma's literal 380 + 520 + 380 plus two 100px gutters, the
    // eyebrow beside them and the section's own 80px padding, need 1772px of
    // window before they fit. At `lg` they did not: the row overflowed the
    // viewport and the WHOLE PAGE scrolled sideways from 1024 all the way to
    // ~1700 (measured `scrollWidth` 1614 at 1024, 1657 at 1440, 1674 at 1600).
    // The section had only ever been checked at 1920, where it fits.
    //
    // Two changes make it fit at 1400 instead. The card is sized as a fraction
    // of the window (27.08vw = 520/1920, capped at its design size), so it
    // gives ground with the window as everything else here already does; and
    // the side columns take what is left rather than demanding 380 — `flex-1
    // basis-0` with the design width as a ceiling, so 1920 still lays out
    // exactly as before and narrower windows split the remainder evenly. At
    // 1400 that leaves 284px a column, which the name and the two fields carry
    // without wrapping differently.
    //
    // Below `menu` the three stack in reading order — name, card, summary —
    // which is what they already did below `lg`.
    <div className="flex flex-col items-start gap-10 menu:flex-row menu:gap-[5.2vw]">
      <div className="w-full menu:max-w-[380px] menu:flex-1 menu:basis-0">
        <EventDetails
          event={event}
          names={events.map((e) => e.name)}
          dates={events.map((e) => e.dateLabel)}
          locations={events.map((e) => e.location)}
          current={index + 1}
          total={events.length}
          onStep={step}
        />
      </div>

      {/* 27.08vw is 520/1920, so the design width renders the card at exactly
          its Figma size and narrower windows scale it down with them. */}
      <EventCard event={event} className="mx-auto menu:mx-0 menu:w-[27.08vw]" />

      <div className="w-full menu:max-w-[380px] menu:flex-1 menu:basis-0">
        <EventActions event={event} />
      </div>
    </div>
  )
}

/**
 * The left column — the event's name, its date and place, and the pager.
 *
 * Bebas 76/72 in Figma (`52:3030`), which is the `display-sm` step. The name is
 * an `<h3>` under the section's own heading: it is the subject of the band, and
 * a screen reader moving by heading should land on it.
 */
function EventDetails({
  event,
  names,
  dates,
  locations,
  current,
  total,
  onStep,
}: {
  event: ShowcaseEvent
  names: string[]
  dates: string[]
  locations: string[]
  current: number
  total: number
  onStep: (delta: number) => void
}) {
  return (
    <div className="flex flex-col gap-8 lg:gap-12">
      {/* The whole column is one live region rather than just the pager's
          count: pressing an arrow changes the name, the date and the place
          together, and announcing only "2 of 6" would tell a screen-reader user
          that something moved without saying what it moved to. */}
      <div aria-live="polite" className="flex flex-col gap-8 lg:gap-12">
        {/* The names run one to three lines, so the block reserves the height
            of the TALLEST of them and the pager below stops moving. Measured:
            without this the arrows shifted up to 100px between events at 1920,
            which is a control jumping out from under the cursor that just
            pressed it.

            The reservation is the other five names, rendered `invisible` in the
            same grid cell — every copy sits in row 1, column 1, so the cell is
            as tall as the tallest and the visible name is laid over it. A fixed
            `min-h` would be a guess that only held at one width and one font
            size; this one re-measures itself at every breakpoint, and stays
            right when the real API returns names nobody has seen yet.

            `text-balance` is what reproduces Figma's own line break. The design
            writes the name out as three lines — "CARIBBEAN / DOMINO / OPEN
            2024" — and plain wrapping gives "CARIBBEAN / DOMINO OPEN / 2024"
            instead, because it fills each line before moving on. Balancing
            evens the lines out and lands on the design's break exactly. Done
            here rather than as newlines in the data: a hard break would have to
            be authored per event and would still be wrong on a narrow screen,
            where the column is no longer 380px. Measured across all six names —
            only this one wraps differently under balancing. */}
        <Reserved
          all={names}
          className="font-display text-[length:var(--text-display-sm)] leading-[0.95] text-balance uppercase"
        >
          <h3 className="col-start-1 row-start-1 text-black">{event.name}</h3>
        </Reserved>

        {/* 258px wide in Figma (`52:3031`), not the column's full 380 — the
            two fields are short and the design lets the line break early. */}
        <dl className="flex w-full flex-col gap-5 lg:w-[258px]">
          <Field
            label={FEATURED_EVENT_COPY.dateLabel}
            value={event.dateLabel}
            all={dates}
          />
          <Field
            label={FEATURED_EVENT_COPY.locationLabel}
            value={event.location}
            all={locations}
          />
        </dl>

        <p className="sr-only">
          {FEATURED_EVENT_COPY.pagerPosition(current, total)}
        </p>
      </div>

      <Pager current={current} total={total} onStep={onStep} />
    </div>
  )
}

/**
 * Holds a slot as tall as the tallest string it could ever contain.
 *
 * Every candidate is rendered into the SAME grid cell — row 1, column 1 — with
 * the ones that are not showing marked `invisible`. The cell takes the height of
 * the tallest, and the visible child sits on top of it, so the box no longer
 * resizes when the value swaps and nothing below it moves.
 *
 * Why not a fixed `min-h`: the wrap point depends on the column width and the
 * font size, both of which change at every breakpoint, so any constant would be
 * a guess that held at one viewport and left a gap or a jump at the others.
 * This measures itself, and keeps working when the real API returns strings
 * nobody has seen yet.
 *
 * The hidden copies are `aria-hidden` and take the styling from `className`,
 * which is applied to the grid itself so both states are typeset identically —
 * a hidden copy in a different size would reserve the wrong height.
 *
 * `as` is what the grid itself renders as. The date and place are `<dd>`s inside
 * a `<dl>`, where only `<dt>`/`<dd>` (and `<div>` wrapping a pair) are allowed
 * children — so there the grid IS the `<dd>` rather than a `<div>` around one.
 */
function Reserved({
  as: Tag = "div",
  all,
  className,
  children,
}: {
  as?: "div" | "dd"
  all: string[]
  className?: string
  children: React.ReactNode
}) {
  return (
    <Tag className={cn("grid", className)}>
      {children}
      {all.map((text) => (
        <span
          key={text}
          aria-hidden="true"
          className="invisible col-start-1 row-start-1"
        >
          {text}
        </span>
      ))}
    </Tag>
  )
}

/** A label above its value — Figma's `item` frame (`52:3032`). */
function Field({
  label,
  value,
  all,
}: {
  label: string
  value: string
  all: string[]
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="font-sans text-xl leading-7 font-medium text-[var(--color-label-muted)]">
        {label}
      </dt>
      <Reserved
        as="dd"
        all={all}
        className="font-sans text-xl leading-7 font-medium text-[#3f3f3f]"
      >
        <span className="col-start-1 row-start-1">{value}</span>
      </Reserved>
    </div>
  )
}

/**
 * The step-through controls — node `163:8168`.
 *
 * The visible count is `aria-hidden`: it is already spoken as part of the
 * column's live region above, and leaving it exposed here would have a reader
 * announce the position twice on every press.
 *
 * The arrows are one SVG used twice, the forward one flipped — the design's two
 * icons are the same path mirrored.
 */
function Pager({
  current,
  total,
  onStep,
}: {
  current: number
  total: number
  onStep: (delta: number) => void
}) {
  return (
    <div className="flex items-center gap-6">
      <PagerButton
        label={FEATURED_EVENT_COPY.previous}
        onClick={() => onStep(-1)}
      />

      <span
        aria-hidden="true"
        className="font-display text-[length:var(--text-display-btn)] leading-8 text-black"
      >
        {FEATURED_EVENT_COPY.pagerPosition(current, total)}
      </span>

      <PagerButton
        label={FEATURED_EVENT_COPY.next}
        onClick={() => onStep(1)}
        flipped
      />
    </div>
  )
}

function PagerButton({
  label,
  onClick,
  flipped = false,
}: {
  label: string
  onClick: () => void
  flipped?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="rounded-btn focus-visible:ring-gold flex size-14 items-center justify-center border border-[var(--color-surface-grey)] bg-white transition-colors hover:bg-[var(--color-surface-grey)] focus-visible:ring-2 focus-visible:outline-none"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- an inline SVG
          sized in CSS; next/image would add a layout wrapper for no gain. */}
      <img
        src="/assets/home/icon-arrow.svg"
        alt=""
        width={32}
        height={32}
        className={flipped ? "size-8 rotate-180" : "size-8"}
      />
    </button>
  )
}

/**
 * The right column — the summary and the two buttons, pinned to opposite ends
 * of the card's height in Figma (`52:3053`, `justifyContent: space-between`).
 *
 * That split only holds where the column is as tall as the card, so it is
 * `menu` and up — the same breakpoint the row itself starts at; stacked below
 * that, the buttons simply follow the prose. The height tracks the card rather
 * than being pinned to Figma's 721: the card is now `27.08vw` wide and keeps
 * its 520/720 ratio, which puts its height at `37.5vw` until it caps at its
 * design size. A fixed 721 would leave the buttons hanging below the card at
 * every width under 1920.
 *
 * Both links fall back to `#` because the portal that will host the event pages
 * does not exist yet (PRD §5) — the mock leaves `detailsUrl` and `registerUrl`
 * unset on purpose, so the shape of the real response is what is being built
 * against (RULES §8).
 */
function EventActions({ event }: { event: ShowcaseEvent }) {
  return (
    <div className="flex flex-col justify-between gap-10 menu:h-[min(720px,37.5vw)] menu:gap-0">
      <p
        aria-live="polite"
        className="font-sans text-xl leading-8 text-[#3f3f3f]"
      >
        {event.summary}
      </p>

      <div className="flex flex-col gap-5">
        {/* 72px tall in Figma, both of them (`52:3056`, `162:7614`). The
            secondary is the page's divider grey; the primary is the brand gold
            — the only place on this white band the gold appears. */}
        <a
          href={event.detailsUrl ?? "#"}
          className="rounded-btn font-display focus-visible:ring-gold flex h-18 items-center justify-center bg-[var(--color-surface-grey)] px-5 text-[length:var(--text-display-btn)] leading-10 text-black uppercase transition-colors hover:bg-[#c8c8c8] focus-visible:ring-2 focus-visible:outline-none"
        >
          {FEATURED_EVENT_COPY.details}
        </a>

        <a
          href={event.registerUrl ?? "#"}
          className="rounded-btn font-display focus-visible:ring-gold bg-gold flex h-18 items-center justify-center px-5 text-[length:var(--text-display-cta)] leading-11 text-black uppercase transition-colors hover:bg-[var(--color-gold-btn-light)] focus-visible:ring-2 focus-visible:outline-none"
        >
          {FEATURED_EVENT_COPY.register}
        </a>
      </div>
    </div>
  )
}
