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
