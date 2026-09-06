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

/**
 * e.g. "March 14, 2025", or an empty string when there is no usable date.
 *
 * **Total on purpose, and it took a production outage to make it so.**
 * `Intl.DateTimeFormat.format()` throws `RangeError: Invalid time value` on an
 * invalid `Date`, and `new Date(undefined)` is exactly that. A gallery album
 * whose event carried no date reached this function as `undefined` and took
 * `/gallery` down with a 500 — one nullable column in the backoffice against a
 * whole page.
 *
 * The API omits empty values by contract (§5.4), so ANY optional date field
 * arrives as `undefined` some of the time. A formatter that throws on that is a
 * page that falls over whenever an editor leaves a field blank, which is a
 * thing editors are entitled to do.
 *
 * Empty string rather than a placeholder: the caller decides whether a missing
 * date deserves words. Printing "unknown" here would put that word on every
 * page that ever omits one.
 */
export function formatLongDate(iso: IsoDateString | null | undefined): string {
  return formatWith(LONG_DATE_FORMAT, iso)
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
/** e.g. "Mar 14, 2025", or an empty string — see `formatLongDate`. */
export function formatShortDate(iso: IsoDateString | null | undefined): string {
  return formatWith(SHORT_DATE_FORMAT, iso)
}

/**
 * The one place a date is turned into text, and the one place it can fail.
 *
 * `Number.isNaN(getTime())` rather than a `try`/`catch`: an invalid `Date` is a
 * value to test, not an exception to catch, and catching would also swallow a
 * genuine bug in the formatter itself.
 */
function formatWith(
  formatter: Intl.DateTimeFormat,
  iso: IsoDateString | null | undefined,
): string {
  if (iso === null || iso === undefined || iso === "") return ""

  const date = new Date(iso)

  return Number.isNaN(date.getTime()) ? "" : formatter.format(date)
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
