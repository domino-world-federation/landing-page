"use client"

import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils/cn"
import { DURATION, EASE, RESET_DURATION } from "@/lib/utils/motion"

/**
 * Seconds between one letter clearing and the next.
 *
 * This is the number that decides whether the effect reads as a *gradient* or as
 * a queue. Each letter takes the full `DURATION` to sharpen, so at 0.06 a couple
 * of dozen are mid-clear at any instant — the line therefore always holds a
 * continuous ramp from sharp at its left margin to fully blurred at its right
 * end, which is the shape of the reference. Step it up towards a tenth of a
 * second and the ramp collapses into letters arriving one at a time; drop it far
 * below this and the whole line clears at once, which is what `Reveal` already
 * does.
 */
const CHAR_STEP = 0.06

/**
 * A headline that comes into focus from left to right.
 *
 * Figma gives About's `<h1>` a `filter: blur(7.5px)` (`119:4799`). That is the
 * state it starts from, not how it sits — nobody ships a headline out of focus.
 * `Reveal`'s `blurFrom` plays that as an entrance, but it clears the whole line
 * at once, and this line is the page's opening claim: it should come into focus
 * the way it is read, across.
 *
 * The sweep is staggered **per letter**, not per word. Per word was the first
 * attempt and it reads as a row of six things switching on; the sweep wanted is
 * a soft boundary travelling along the line, with everything ahead of it still
 * soft and everything behind it sharp. At letter resolution the boundary is
 * dozens of partly-cleared glyphs wide, which is a gradient.
 *
 * Each line sweeps **independently**, both starting together — which is why the
 * copy arrives as an array of lines rather than one string. A single ramp run
 * across the whole headline would clear line one entirely before line two began,
 * and the design's shape is two lines going soft towards their right ends at the
 * same time.
 *
 * Every letter is two stacked copies with a STATIC blur, cross-fading on
 * `opacity`. No `filter` is ever animated (RULES §11) — the compositor only sees
 * opacity, and a per-frame `filter` on a 5rem headline is precisely the repaint
 * that rule exists to prevent.
 *
 * The letters are grouped by word, and the grouping is load-bearing: a run of
 * bare `inline-block` letters gives the browser a break opportunity between
 * every pair, so a narrow window would wrap mid-word. Only the spaces between
 * the word groups are breakable.
 */
export function SharpeningHeadline({
  lines,
  blur = "7.5px",
  className,
}: {
  /** One entry per line of the headline. Each line sweeps on its own. */
  lines: readonly string[]
  /** Starting blur. Defaults to the design's own 7.5px. */
  blur?: string
  className?: string
}) {
  const prefersReducedMotion = useReducedMotion()

  // Reduced motion collapses the TRANSITION, never the rendered tree — the same
  // markup and the same `initial` on both sides, with only the timing zeroed.
  // Branching the tree is what broke hydration in S2 (RULES §12), and it would
  // be especially tempting here: rendering one plain string instead of seventy
  // letter copies is obviously cheaper, and obviously wrong.
  const step = (i: number) =>
    prefersReducedMotion
      ? { duration: 0 }
      : { duration: DURATION, delay: i * CHAR_STEP, ease: EASE }

  const reset = prefersReducedMotion
    ? { duration: 0 }
    : { duration: RESET_DURATION, ease: "easeOut" as const }

  // `amount` low because the headline is tall: a quarter of it would hold the
  // sweep until the band is most of the way up the window, and this is the first
  // thing on the page.
  const viewport = { once: false, amount: 0.1 } as const

  return (
    <span className={cn("block", className)}>
      {/* The visual construction is a heap of duplicated letters, so it is
          hidden from assistive tech entirely and the real sentence is given
          once. Same split as `StatsWheel`, and for the same reason: what is
          built for the eye and what is read aloud are different shapes here. */}
      <span className="sr-only">{lines.join(" ")}</span>

      <span aria-hidden="true">
        {lines.map((line) => {
          // The index restarts on every line, and that is the design: each line
          // carries its own ramp, sharp at the left margin and soft at its right
          // end. Letting the count run on across the whole headline would leave
          // the second line entirely behind the first — by the time the sweep
          // reached it, the reader would have watched one line clear and then
          // waited for another to start.
          let charIndex = 0

          return (
            // A block per line so the design's break survives without a `<br>`
            // that a translation would have to carry (RULES §9).
            <span key={line} className="block">
              {line.split(" ").map((word, w) => (
                // The separating space sits OUTSIDE the word's `inline-block`:
                // inside it the browser collapses it against the box edge and
                // the words run together. Grouping by word also keeps the break
                // opportunities between words — a line of bare `inline-block`
                // letters would let a narrow window wrap mid-word.
                <span key={`${word}-${w}`}>
                  {w > 0 ? " " : null}
                  <span className="inline-block">
                    {[...word].map((char, c) => {
                      const i = charIndex++
                      return (
                        <span
                          key={`${char}-${c}`}
                          className="relative inline-block"
                        >
                          {/* Blurred copy, over the sharp one and fading out.
                              It is `absolute` so the sharp copy alone sets the
                              metrics — otherwise the blur's spread would widen
                              every glyph box and the word would set loose. */}
                          <motion.span
                            className="pointer-events-none absolute inset-0"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1, transition: reset }}
                            whileInView={{
                              opacity: 0,
                              transition: { ...step(i), ease: "easeIn" },
                            }}
                            viewport={viewport}
                            style={{
                              filter: `blur(${blur})`,
                              willChange: "opacity",
                            }}
                          >
                            {char}
                          </motion.span>

                          <motion.span
                            className="inline-block"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0, transition: reset }}
                            whileInView={{ opacity: 1, transition: step(i) }}
                            viewport={viewport}
                            style={{ willChange: "opacity" }}
                          >
                            {char}
                          </motion.span>
                        </span>
                      )
                    })}
                  </span>
                </span>
              ))}
            </span>
          )
        })}
      </span>
    </span>
  )
}
