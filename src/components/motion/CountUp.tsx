"use client"

import { cubicBezier, useInView, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { EASE } from "@/lib/utils/motion"

/**
 * Seconds. Longer than a standard entrance (`DURATION`, 1.4): an entrance is
 * over once the thing has arrived, but a counter has to be *read* while it
 * runs, and a figure that lands before the eye has settled on it never counts
 * at all.
 */
const COUNT_DURATION = 1.8

/** The page's curve, sampled directly — see `lib/utils/motion`. */
const ease = cubicBezier(...(EASE as unknown as [number, number, number, number]))

/**
 * Splits a figure into the parts that animate and the parts that do not.
 *
 * The digits are what counts; everything else is scaffolding that has to come
 * back out in the same place. "850+" keeps its plus, "1.420" keeps its
 * separator, and a value this cannot read — a word, a range, an em dash —
 * returns `null` so the caller prints it unchanged rather than guessing.
 */
function parse(value: string) {
  const match = value.match(/^(\D*)([\d.,]+)(\D*)$/)
  if (!match) return null

  const [, prefix, numeric, suffix] = match
  const digits = numeric.replace(/[.,]/g, "")
  if (digits.length === 0 || digits.length > 15) return null

  // A separator only counts as grouping if it actually groups: "1.420" does,
  // "1.42" does not, and the difference decides whether the count runs to 1420
  // or to 1.42. Anything that is not clean groups of three is left alone.
  const grouped = /^\d{1,3}([.,]\d{3})+$/.test(numeric)
  const separator = grouped ? numeric.replace(/[^.,]/g, "")[0] : ""

  return { prefix, suffix, separator, target: Number(digits) }
}

/** Re-inserts the grouping separator the source figure used. */
function group(n: number, separator: string): string {
  const digits = String(n)
  if (!separator) return digits

  let out = ""
  for (let i = 0; i < digits.length; i += 1) {
    if (i > 0 && (digits.length - i) % 3 === 0) out += separator
    out += digits[i]
  }
  return out
}

/**
 * A figure that counts up from zero when it is scrolled into view.
 *
 * **The server renders the finished figure, and so does the client's first
 * render.** That is not incidental — hydration compares text, so a component
 * that started at "0" on the client while the server had sent "142" would make
 * React throw the subtree away and rebuild it. The reset to zero happens in an
 * effect, after hydration has matched. A reader with JavaScript off therefore
 * sees the real number, which is the right fallback for a figure that means
 * something.
 *
 * The cost of that ordering is a frame or two of the final figure before the
 * count starts, for a counter already on screen at load — the effect runs after
 * paint, and the first `requestAnimationFrame` tick is what writes the zero.
 * Accepted: the alternative is a layout effect, which Next logs a warning for
 * during SSR, and the flash is about as long as a frame.
 *
 * **Reduced motion never resets.** The figure stays where the server put it —
 * that is the whole animation collapsing to its end state, which is what
 * RULES §12 asks for, and the markup is identical either way.
 *
 * Counted with `requestAnimationFrame` rather than `animate()`: this is text,
 * not a transform, and motion's value animation is shaped for driving styles.
 * The curve is still the page's own, sampled from the same constant every
 * entrance reads.
 */
export function CountUp({ value }: { value: string }) {
  const parsed = parse(value)
  const prefersReducedMotion = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  // `once`: a figure that recounts every time it scrolls past reads as a glitch
  // rather than an entrance.
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    if (!parsed || prefersReducedMotion || !inView) return

    const { prefix, suffix, separator, target } = parsed
    const format = (n: number) => `${prefix}${group(n, separator)}${suffix}`

    // No reset to zero here: the first frame computes a progress of 0 and
    // writes it itself, so a synchronous `setDisplay` before the loop would be
    // the same value twice — and setting state straight out of an effect is
    // what `react-hooks/set-state-in-effect` exists to stop.
    let frame = 0
    let start: number | null = null

    const step = (now: number) => {
      start ??= now
      // `now` is a DOMHighResTimeStamp in ms; the duration is in seconds like
      // every other timing in this project.
      const progress = Math.min((now - start) / (COUNT_DURATION * 1000), 1)
      setDisplay(format(Math.round(ease(progress) * target)))
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
    // `parsed` is derived from `value` on every render, so it cannot be a
    // dependency without restarting the count each frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, inView, prefersReducedMotion])

  // Nothing countable in there — print it and leave it alone.
  if (!parsed) return <span>{value}</span>

  return (
    <span ref={ref}>
      {/* The real figure, for assistive tech. The animating copy is hidden from
          it: a counter inside a live region would announce forty intermediate
          numbers, and outside one it would announce whichever number happened
          to be showing when the reader arrived. */}
      <span className="sr-only">{value}</span>
      {/* `tabular-nums` so the digits keep one width — proportional figures
          make the whole row twitch sideways as the count runs. */}
      <span aria-hidden className="tabular-nums">
        {display}
      </span>
    </span>
  )
}
