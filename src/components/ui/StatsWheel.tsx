"use client"

import { motion, useInView, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import type { FederationStat } from "@/lib/api/types"
import { EASE } from "@/lib/utils/motion"

/** Seconds a stat holds the focused slot before the wheel turns again. */
const HOLD = 2.6

/** Seconds the turn itself takes. */
const TURN = 0.9

/**
 * The slot a stat occupies, relative to the focused one. Anything further out
 * than a single step is off the wheel and stays invisible.
 */
const FOCUSED = 0
const NEIGHBOUR = 1

/** The design's resting opacity for the two stats flanking the focused one. */
const DIM = 0.2

/** 175/200 — the design shrinks the off-centre figures by this much. */
const NEIGHBOUR_SCALE = 0.875

type StatsWheelProps = {
  stats: FederationStat[]
}

/**
 * The stats wheel — figures taking turns in a fixed focused slot.
 *
 * The design (`37:1874`) is a picker wheel: two rules bracket a centre slot,
 * the stat inside it is gold, full size and sharp, and the ones above and below
 * are dim, blurred and slightly smaller. So the frame is what stays put and the
 * content is what moves — each stat rides up through the focused slot in turn.
 *
 * **Why the list is rendered twice.** A wheel has no end, and a track that runs
 * out has to jump back. Two copies of the stats mean that after a full lap the
 * track is showing cells whose *content* is identical to where it started, so
 * the reset is invisible: the index snaps from `N+1` back to `1` with the
 * transition collapsed, and the three visible cells carry the same three stats
 * at the same three offsets. Sampled at the seam, nothing changes on screen.
 *
 * **Why the offset is a percentage.** Each cell is exactly one slot tall, so
 * translating the track by `100 / cells` percent of its own height moves it by
 * precisely one slot — at any viewport, without measuring anything. Animating a
 * `calc()` of a CSS variable would not interpolate; a measured pixel value
 * would need a layout read on every resize.
 *
 * The design treats the slot above and the slot below differently — the lower
 * figure is blurred and smaller, the upper one is neither. That asymmetry reads
 * as depth in a still frame, but it does not survive rotation: every stat
 * passes through both slots, so it would blur on the way in and not on the way
 * out. Both neighbours are given the lower slot's treatment, which is the one
 * that carries the design's sense of the wheel curving away.
 *
 * Blur is NOT animated (RULES §12). Each cell renders a sharp gold copy and a
 * blurred white one, and only their `opacity` cross-fades — the same trick
 * `SofteningImage` and `Reveal` use.
 *
 * The wheel is `aria-hidden`: it shows the same three stats over and over, and
 * a screen reader following it would hear them repeat. The section renders a
 * plain list alongside for that (see `Stats`).
 */
export function StatsWheel({ stats }: StatsWheelProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Only turn while the section is actually being looked at — an interval
  // running against an off-screen element is battery spent on nothing.
  const inView = useInView(ref, { amount: 0.3 })

  // Two laps of the stats, so the track always has a cell to bring in and one
  // to carry off without running out.
  const cells = [...stats, ...stats]
  const lap = stats.length

  // `1` is the design's resting state: the second stat is the one in the
  // focused slot. Starting there means the server, the first client render, and
  // a reader who prefers reduced motion all get exactly the still design —
  // without branching the tree, which is what RULES §12 forbids.
  const [pos, setPos] = useState({ index: 1, instant: false })

  const turning = inView && !prefersReducedMotion

  useEffect(() => {
    if (!turning) return

    const timer = setInterval(
      () => setPos((p) => ({ index: p.index + 1, instant: false })),
      (HOLD + TURN) * 1000,
    )
    return () => clearInterval(timer)
  }, [turning])

  // A lap is over once the track has advanced by the length of the list. The
  // snap waits for the turn to land, then rewinds with the transition
  // collapsed — see the note above for why nothing is visible.
  useEffect(() => {
    if (pos.index <= lap) return

    const timer = setTimeout(
      () => setPos({ index: 1, instant: true }),
      TURN * 1000,
    )
    return () => clearTimeout(timer)
  }, [pos.index, lap])

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : pos.instant
      ? { duration: 0 }
      : { duration: TURN, ease: EASE }

  return (
    <div
      ref={ref}
      aria-hidden="true"
      // Three slots tall, so the focused one has a neighbour visible above and
      // below. `overflow-hidden` is what makes it a window onto the track.
      className="relative h-[calc(var(--stat-slot)*3)] overflow-hidden"
    >
      <motion.div
        className="absolute inset-x-0 top-0"
        // `1 - index`, not `-index`: the focused stat belongs in the *middle*
        // of the three slots, so the track sits one slot lower than a plain
        // top-aligned offset would put it.
        animate={{ y: `${((1 - pos.index) * 100) / cells.length}%` }}
        transition={transition}
        style={{ willChange: "transform" }}
      >
        {cells.map((stat, i) => {
          const offset = i - pos.index
          const distance = Math.abs(offset)
          const focused = distance === FOCUSED
          const near = distance === NEIGHBOUR

          return (
            <div
              // Cells are positional, and the list repeats — the content's own
              // id is not unique across the track, so it cannot be the key.
              key={`${stat.id}-${i}`}
              className="relative h-[var(--stat-slot)]"
            >
              {/* Both copies fill the same cell, so they register exactly and
                  the cross-fade happens in place. The cell's height is fixed
                  by `--stat-slot`, so neither copy can shift the track. */}
              <StatRow
                stat={stat}
                visible={focused ? 1 : 0}
                scale={1}
                transition={transition}
                tone="focus"
              />
              <StatRow
                stat={stat}
                visible={near ? DIM : 0}
                scale={NEIGHBOUR_SCALE}
                transition={transition}
                tone="idle"
              />
            </div>
          )
        })}
      </motion.div>

      {/* The two rules that bracket the focused slot. They belong to the frame,
          not to the track, so they do not move — that is what makes the wheel
          read as a selector rather than a list sliding past.

          Figma draws four, but the outer pair is at `opacity: 0` — a spacing
          artefact of the stacked layout rather than something that renders. */}
      <Rule className="top-[var(--stat-slot)]" />
      <Rule className="top-[calc(var(--stat-slot)*2)]" />
    </div>
  )
}

/**
 * One rendering of a stat — a label on the left, a figure on the right.
 *
 * `tone` picks between the two treatments the wheel cross-fades: the focused
 * copy is gold and sharp, the idle one is white, dim and blurred. They are
 * separate copies rather than one animated element because neither the blur
 * nor the gradient can be animated — `filter` repaints every frame (RULES §12)
 * and a gradient has nothing to interpolate.
 */
function StatRow({
  stat,
  visible,
  scale,
  transition,
  tone,
}: {
  stat: FederationStat
  visible: number
  scale: number
  transition: object
  tone: "focus" | "idle"
}) {
  const focus = tone === "focus"

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-between gap-6"
      initial={false}
      animate={{ opacity: visible, scale }}
      transition={transition}
    >
      <span
        className={`font-sans text-[length:var(--text-stat-label)] leading-tight font-medium text-white ${
          focus ? "" : "blur-[3.5px]"
        }`}
      >
        {stat.label}
      </span>

      <span
        className={`font-display text-[length:var(--text-display-stat)] leading-none ${
          focus
            ? "bg-linear-to-r from-[var(--color-gold-light)] to-[var(--color-gold-dark)] bg-clip-text text-transparent"
            : "bg-linear-to-b from-white to-white/40 bg-clip-text text-transparent blur-[10px]"
        }`}
      >
        {stat.value}
      </span>
    </motion.div>
  )
}

/**
 * Node `47:2654`: 591 × 8, a left-to-right fade to white at 40%. Right-aligned,
 * because the figures it separates are.
 */
function Rule({ className }: { className: string }) {
  return (
    <div
      className={`absolute right-0 h-[clamp(2px,0.42vw,8px)] w-[30.8vw] max-w-[591px] -translate-y-1/2 bg-linear-to-r from-transparent to-white opacity-40 ${className}`}
    />
  )
}
