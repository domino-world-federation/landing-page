import type { IsoDateString } from "@/lib/api/types"

/**
 * Locale and time zone are pinned rather than left to the environment.
 * The site is English-only for now (PRD D4), and an unpinned formatter reads
 * the *server's* zone during SSR and the *visitor's* on hydration — the two
 * disagree and React throws a mismatch. UTC is the one zone both share.
 */
const EVENT_DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

/** e.g. "Mon, Aug 17, 2026". */
export function formatEventDate(iso: IsoDateString): string {
  return EVENT_DATE_FORMAT.format(new Date(iso))
}

/**
 * The long form, without the weekday — a publication date rather than an
 * appointment. Pinned for the same reason `EVENT_DATE_FORMAT` is.
 *
 * Kept apart from that formatter rather than parameterised: the countdown needs
 * the weekday because the reader is being told when to turn up, and a news
 * archive does not. Two call sites want this one — the Development page's
 * library and its update strip, whose Figma text is typed four different ways
 * (`207:15482` against `207:15495`), so one of them has to win here.
 */
const LONG_DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

/** e.g. "March 14, 2025". */
export function formatLongDate(iso: IsoDateString): string {
  return LONG_DATE_FORMAT.format(new Date(iso))
}

/**
 * The abbreviated form — the news page's own.
 *
 * A third formatter rather than a parameter, for the reason the second one
 * exists: the choice is editorial, not a setting. The news page prints dates in
 * Bebas, an all-capitals face, where "SEPTEMBER" is nearly half the width of a
 * card's caption line and the month stops being something the eye skips over.
 * The federation's document shelves print theirs in Inter beside a title and
 * want the same brevity for a different reason — the date is the smallest thing
 * on the card and should read as a stamp.
 *
 * Pinned to UTC like the other two, and for the same reason: an unpinned
 * formatter reads the server's zone during SSR and the visitor's on hydration,
 * and React throws on the difference.
 */
const SHORT_DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

/** e.g. "Aug 12, 2026". */
export function formatShortDate(iso: IsoDateString): string {
  return SHORT_DATE_FORMAT.format(new Date(iso))
}

export type Remaining = {
  days: number
  hours: number
  mins: number
  /** True once the target has passed; every field is then 0. */
  isOver: boolean
}

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/**
 * Whole days/hours/minutes left, floored — a countdown that rounded up would
 * show "1 min" for fifty-nine seconds and then jump straight past zero.
 */
export function getRemaining(iso: IsoDateString, from: number): Remaining {
  const delta = new Date(iso).getTime() - from

  if (!Number.isFinite(delta) || delta <= 0) {
    return { days: 0, hours: 0, mins: 0, isOver: true }
  }

  return {
    days: Math.floor(delta / DAY),
    hours: Math.floor((delta % DAY) / HOUR),
    mins: Math.floor((delta % HOUR) / MINUTE),
    isOver: false,
  }
}

/** Two digits, so the row's width does not jitter as values tick down. */
export function padUnit(value: number): string {
  return String(value).padStart(2, "0")
}
