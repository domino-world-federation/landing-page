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
 *   `viewport` is the masked window and `column` the padded stack inside it;
 *   given both, the travel and each block's position on screen are measured here
 *   rather than in each section (D32/D43).
 */
export function useTurningColumn<T>(
  track: Readonly<ShallowRef<HTMLElement | null>>,
  stage: Readonly<ShallowRef<HTMLElement | null>>,
  items: MaybeRefOrGetter<readonly T[]>,
  options: {
    pad?: boolean
    viewport?: Readonly<ShallowRef<HTMLElement | null>>
    column?: Readonly<ShallowRef<HTMLElement | null>>
  } = {},
) {
  const { pad = true, viewport, column } = options
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

  /**
   * How much of a step is spent READING before the column moves on.
   *
   * **A block is finished before the next one arrives**, which is the whole
   * shape of the section: the column holds still while the sentence lights, and
   * only then travels. It used to move continuously against the scroll, so the
   * next block was already sliding into place while the current one was two
   * thirds read — the reader was being moved on mid-sentence.
   *
   * 0.65 leaves a little over a third of the step for the move, which at a
   * screen per step is long enough to be watched and short enough not to be
   * waited through.
   */
  const HOLD = 0.65

  /**
   * How many screens of scroll the track is given: one per block, plus one.
   *
   * The extra is the last block's own reading. A track of `n` screens has `n`
   * snap positions and `n − 1` screens of travel between them, so with a screen
   * per block the last one arrives exactly as the scroll runs out and is never
   * read at all.
   */
  const screens = computed(() => steps.value + 1)

  /** Where the reader is, counted in steps: `0` at the first block, `n` at the end. */
  const at = computed(() => scrolled.value * steps.value)

  /** The block being read, and how far into its step the reader has come. */
  const step = computed(() => {
    const whole = Math.min(Math.floor(at.value), Math.max(0, steps.value - 1))

    return { block: whole, into: at.value - whole }
  })

  /**
   * The block the section is CURRENTLY presenting — what the counter reads, what
   * the picture shows, and which block is at full strength.
   *
   * It hands over halfway through the move rather than halfway through the step:
   * the picture changing while its own sentence is still being read is the swap
   * arriving before the words it belongs to.
   */
  watchEffect(() => {
    const { block, into } = step.value
    const handedOver = into > (1 + HOLD) / 2
    const current = Math.min(block + (handedOver ? 1 : 0), steps.value - 1)

    index.value = Math.max(0, pad ? current + 1 : current)
  })

  /**
   * How much of a block's sentence the reader has scrolled through, 0 to 1.
   *
   * It runs across the HOLD and finishes with it, so a block is read to its full
   * stop before the column begins carrying the next one in. Blocks already past
   * stay lit and blocks not reached stay dark, which is what they would look
   * like if the reader simply kept scrolling.
   */
  function readingProgress(i: number) {
    if (i < step.value.block) return 1
    if (i > step.value.block) return 0

    return Math.min(1, step.value.into / HOLD)
  }

  /** Where each block starts, in pixels, measured from the first. */
  const offsets = ref<number[]>([])
  /** The column's own top padding — where every block is read. */
  const lead = ref(0)
  const windowHeight = ref(0)

  onMounted(() => {
    function measure() {
      const frame = viewport?.value
      const inner = column?.value
      if (!frame || !inner) return

      const blocks = Array.from(inner.children) as HTMLElement[]
      const first = blocks[0]?.offsetTop ?? 0

      offsets.value = blocks.map((block) => block.offsetTop - first)
      lead.value = Number.parseFloat(getComputedStyle(inner).paddingTop) || 0
      windowHeight.value = frame.clientHeight
    }

    measure()

    // Both boxes: the window is a share of the screen and the blocks are set in
    // clamped type, so a resize changes each of them independently.
    const observer = new ResizeObserver(measure)
    if (viewport?.value) observer.observe(viewport.value)
    if (column?.value) observer.observe(column.value)

    onBeforeUnmount(() => observer.disconnect())
  })

  /**
   * The column's offset — held still while the block is being read, then carried
   * to the next one over what is left of the step.
   *
   * Each block's own measured position is where the column comes to rest for it,
   * so the words are read at the same height whichever block they belong to. The
   * last step has nowhere further to go and simply holds.
   *
   * Zero at the top, which is why the reading line is a padding on the column
   * rather than a term here: a transform is only written after mount, so folding
   * the line into it would drop the column visibly the first time the page
   * settles, and on a phone, where nothing moves the column, it would be wrong.
   */
  const travel = computed(() => {
    const { block, into } = step.value
    const from = offsets.value[block] ?? 0
    const to = offsets.value[block + 1] ?? from
    const moved = Math.min(1, Math.max(0, (into - HOLD) / (1 - HOLD)))

    return `-${from + (to - from) * moved}px`
  })

  // Same tree whatever the preference; only the transition is zeroed
  // (RULES §12).
  const trackTransition = computed(() =>
    prefersReducedMotion.value ? { duration: 0 } : TURN_EASE,
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
    screens,
    cells,
    index,
    scrolled,
    readingProgress,
    travel,
    inView,
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
