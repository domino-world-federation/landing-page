import type { ShallowRef } from "vue"

/**
 * The turn itself — a glide, not the stats wheel's detent.
 *
 * `StatsWheel` springs, because a picker wheel is a thing being CAUGHT at each
 * notch. This is blocks of body copy taking turns being read, and a spring's
 * overshoot would bounce a paragraph the reader is about to start on.
 *
 * 1.15s, where it started at 0.62. At the shorter length the column arrived
 * rather than travelled: a whole slot of movement — 360px at the design width —
 * crossed in about half a second, which is quick enough that the eye registers
 * the change of position without following it. Nearly doubling it lets the
 * blocks be watched moving up one place, which is what the sections built on
 * this are asking to be read as.
 */
const TURN_EASE = { duration: 1.15, ease: EASE } as const

/**
 * A column of blocks that take turns holding one lit slot, turned by the
 * reader's scroll — the construction About's pillars (`566:13542`) and
 * Integrity's code of ethics (`762:1320`) are both drawn as.
 *
 * Figma draws the same thing twice: a masked window three slots tall, one block
 * square in the middle at full strength, its neighbours dimmed and fading out at
 * both ends, and a photograph beside it that never moves. Only the words change.
 * This is that mechanism, extracted when the second section arrived (D32/D43).
 *
 * **The mechanism travels; the layout does not.** What is shared is which block
 * holds the slot, how far the track is offset to put it there, and the padding
 * that gives the first and last blocks a neighbour. The window's proportions,
 * the picture beside it and the blocks themselves are each section's own — the
 * two agree on the construction and differ on nearly everything else.
 *
 * **It is turned by the reader, not by a clock.** Both sections ran on a
 * `setInterval` first, and the trouble with a timer is that it does not know
 * whether anyone is reading: a slow reader lost the sentence mid-way, a fast one
 * waited. Worse on these pages, where the section is one screen and its
 * neighbours snap — a reader who arrived and scrolled on took the next section
 * with them and never saw two of the three blocks. The caller makes itself a
 * track one viewport tall per block with the stage `sticky` inside it, and the
 * scroll through that track is what advances the index. Reaching the section
 * after it now means having scrolled past every block.
 *
 * @param track The full-height element the scroll is measured against — one
 *   viewport per item, with the stage pinned inside it.
 * @param stage The pinned frame. `inView` is measured on THIS rather than on the
 *   track, which is mostly off screen and would report a fraction of something
 *   nobody is looking at. Same split `StatsWheel` uses: measure the frame, drive
 *   the content.
 * @param items The blocks, in the order they are written.
 * @param options `pad` wraps a copy of the last block onto the front and the
 *   first onto the back, so the lit slot always has a real block above and below
 *   it. About's pillars want that; Integrity's clauses do not — see `cells`.
 */
export function useTurningColumn<T>(
  track: Readonly<ShallowRef<HTMLElement | null>>,
  stage: Readonly<ShallowRef<HTMLElement | null>>,
  items: MaybeRefOrGetter<readonly T[]>,
  options: { pad?: boolean } = {},
) {
  const { pad = true } = options
  const list = computed(() => toValue(items))

  /** One notch per block, and therefore one viewport of track per block. */
  const steps = computed(() => list.value.length)

  const prefersReducedMotion = useReducedMotion()
  const inView = useInView(stage, { amount: 0.3 })

  /**
   * The list with one block padded onto each end — the last before it, the
   * first after it — so every notch has a real block in the slot above and the
   * slot below it.
   *
   * It was two full laps, which is what a column that LOOPED needed. Nothing
   * loops now: the reader opens on the first block and stops on the last, and a
   * pad of one at each end fills both neighbouring slots for `n + 2` cells
   * instead of `2n`. It is also what lets the column open on the FIRST block —
   * the laps forced it to start at index 1 and so to open on the second, which
   * is not the order the list is written in.
   *
   * **`pad: false` turns it off, and a numbered list is why.** The pad puts a
   * copy of the last block above the first, which on About's pillars is three
   * unnumbered claims and reads as more column above the one being read. On
   * Integrity's code of ethics it read as `03` sitting above `01` — a list out
   * of order, which is the one thing a numbered list may not be. Without it the
   * end slots open empty instead, and they open empty inside the mask's fade,
   * where nothing is what nothing should look like.
   */
  const cells = computed<readonly T[]>(() => {
    const all = list.value
    if (all.length === 0 || !pad) return all
    return [all[all.length - 1]!, ...all, all[0]!]
  })

  /** Cell 0 is the pad where there is one, so the first real block is 1. */
  const index = ref(pad ? 1 : 0)

  /**
   * `steps - 1` turns for `steps` notches. The `start start` → `end end` range
   * spans exactly the travel available while the stage is pinned: it opens when
   * the track's head reaches the top of the screen and closes when its foot
   * reaches the bottom. Rounding the progress is what turns a continuous scroll
   * back into whole notches for the glide to travel between.
   */
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  })

  useMotionValueEvent(scrollYProgress, "change", (progress: number) => {
    const turns = steps.value - 1
    if (turns < 1 || !Number.isFinite(progress)) return

    const notch = Math.min(Math.max(Math.round(progress * turns), 0), turns)
    index.value = pad ? notch + 1 : notch
  })

  /**
   * The raw scroll, mirrored into a ref so templates can read it.
   *
   * A MotionValue re-renders nothing by itself, which is why the index rides on
   * one. What follows the scroll CONTINUOUSLY — the column's own travel, the
   * notch beside it, and the words lighting up — has to be rendered, so this is
   * the one place that pays for it: a single number, feeding things that only
   * restyle.
   */
  const scrolled = ref(0)

  useMotionValueEvent(scrollYProgress, "change", (value: number) => {
    if (Number.isFinite(value)) scrolled.value = value
  })

  /** How many MOVES the column makes: `n` blocks are `n − 1` steps between. */
  const turns = computed(() => Math.max(1, steps.value - 1))

  /**
   * Finishing a line at about three quarters of the block's own window rather
   * than exactly as it hands over: a sentence that completes on the same frame
   * it goes dim was never actually seen finished.
   */
  const READ_AHEAD = 1.35

  /**
   * How much of a block's sentence the reader has scrolled through, 0 to 1.
   *
   * Each block owns the half-step either side of its notch — where it takes the
   * light and where it hands it on — clamped at the track's own ends so the
   * first starts at zero rather than half-lit and the last can finish.
   */
  function readingProgress(i: number) {
    const start = Math.max(0, (i - 0.5) / turns.value)
    const end = Math.min(1, (i + 0.5) / turns.value)
    const span = end - start
    if (span <= 0) return 0

    return Math.min(
      1,
      Math.max(0, ((scrolled.value - start) / span) * READ_AHEAD),
    )
  }

  // Same tree whatever the preference; only the transition is zeroed
  // (RULES §12).
  const trackTransition = computed(() =>
    prefersReducedMotion.value ? { duration: 0 } : TURN_EASE,
  )

  /**
   * `1 - index`, not `-index`: the focused block belongs in the MIDDLE of the
   * three slots, so the track sits one slot lower than a plain top-aligned
   * offset would put it.
   *
   * Every cell is exactly one slot tall, so translating the track by
   * `100 / cells` percent of its own height moves it by precisely one slot — at
   * any viewport, without measuring anything. That is also why the blocks sit in
   * fixed slots rather than on the design's flat gap: they are different
   * heights, and a gap would put each one at a different place in the window as
   * it arrived.
   */
  const trackY = computed(
    () => `${((1 - index.value) * 100) / (cells.value.length || 1)}%`,
  )

  /**
   * Whether the cell at `i` is one of the padded copies rather than a block of
   * its own. Callers hand it to the block so a duplicate's heading stays out of
   * the document outline; with `pad: false` nothing is a copy and it is always
   * false.
   */
  function isPad(i: number) {
    return pad && (i === 0 || i === cells.value.length - 1)
  }

  return {
    steps,
    turns,
    cells,
    index,
    scrolled,
    readingProgress,
    inView,
    trackY,
    trackTransition,
    isPad,
    /**
     * The raw scroll through the track, 0 at its head and 1 at its foot.
     *
     * `index` is this rounded to a notch, which is what the column travels on.
     * Callers that want something to follow the scroll CONTINUOUSLY — a sentence
     * lighting up word by word as the reader comes down the page — need the
     * unrounded value, and it is a MotionValue rather than a ref so nothing
     * re-renders for it unless the caller asks.
     */
    progress: scrollYProgress,
  }
}
