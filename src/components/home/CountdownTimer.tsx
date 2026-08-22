"use client"

import { useEffect, useState } from "react"

import { COUNTDOWN_COPY } from "@/content/home/countdown"
import type { IsoDateString } from "@/lib/api/types"
import { getRemaining, padUnit, type Remaining } from "@/lib/utils/date"

/**
 * The only client-side part of S3 — the digits, and nothing else (RULES §5).
 *
 * The first render deliberately shows nothing rather than a computed value:
 * the server has no idea what "now" is on the visitor's clock, so any number
 * it prints would be replaced on hydration and React would flag the mismatch.
 * The card reserves the row's height either way, so no layout shift follows.
 */

const UNITS = [
  { key: "days", label: COUNTDOWN_COPY.units.days },
  { key: "hours", label: COUNTDOWN_COPY.units.hours },
  { key: "mins", label: COUNTDOWN_COPY.units.mins },
] as const

/** "5 days, 13 hours, 42 minutes" — spoken, so the units are spelled out. */
function describe(remaining: Remaining): string {
  if (remaining.isOver) return COUNTDOWN_COPY.started

  const parts = [
    [remaining.days, "day"],
    [remaining.hours, "hour"],
    [remaining.mins, "minute"],
  ] as const

  const spoken = parts
    .filter(([value]) => value > 0)
    .map(([value, unit]) => `${value} ${unit}${value === 1 ? "" : "s"}`)
    .join(", ")

  return COUNTDOWN_COPY.remaining.replace("{time}", spoken || "under a minute")
}

export function CountdownTimer({ startsAt }: { startsAt: IsoDateString }) {
  const [remaining, setRemaining] = useState<Remaining | null>(null)

  useEffect(() => {
    function tick() {
      setRemaining(getRemaining(startsAt, Date.now()))
    }

    tick()

    // Ticking every second would repaint the row sixty times for every one
    // time it changes — the smallest unit shown is minutes. Aligning to the
    // top of the next minute keeps the flip on time without polling.
    let interval: ReturnType<typeof setInterval>
    const msToNextMinute = 60_000 - (Date.now() % 60_000)
    const timeout = setTimeout(() => {
      tick()
      interval = setInterval(tick, 60_000)
    }, msToNextMinute)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [startsAt])

  return (
    <div className="flex items-center justify-between">
      {/* One live region for the whole row, so a change is announced as a
          sentence instead of three loose numbers. */}
      <p className="sr-only" aria-live="polite">
        {remaining ? describe(remaining) : ""}
      </p>

      {UNITS.map(({ key, label }, index) => (
        <div key={key} className="contents">
          {index > 0 && (
            <span
              aria-hidden="true"
              className="font-display text-[length:var(--text-display-2xs)] leading-none text-white"
            >
              :
            </span>
          )}

          <div
            aria-hidden="true"
            className="flex flex-1 flex-col items-center gap-3"
          >
            {/* `tabular-nums` so the digits keep their column as they tick. */}
            <span className="font-display text-[length:var(--text-display-xs)] leading-none text-white tabular-nums">
              {remaining ? padUnit(remaining[key]) : "--"}
            </span>
            <span className="font-sans text-sm leading-[22px] text-white/60 uppercase">
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
