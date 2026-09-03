<script setup lang="ts">
/**
 * Seconds between one word lighting and the next.
 *
 * This is the number that decides whether the effect reads as READING or as a
 * wipe, and it has been slowed twice: 0.085, then 0.13, now 0.18. At the first
 * the sixteen-word sentence was through in about 1.8s — faster than the sentence
 * can actually be read, so the light reached the full stop while the reader was
 * still mid-line and the whole thing became a wipe passing over them. At 0.18 a
 * sentence takes about three and a half seconds, which is close to the pace the
 * eye would set for itself. Slower again and it starts dictating that pace
 * rather than following it.
 */
const WORD_STEP = 0.18

/**
 * Seconds for a single word to come up, and the number that decides how SMOOTH
 * the effect is rather than how fast.
 *
 * What is actually being watched is a front travelling along the line, and a
 * front is only soft if several words are part-lit at once. That count is
 * `WORD_FADE / WORD_STEP`, so the ratio matters more than either figure alone:
 * at 1 the words would light strictly one after another and the effect would be
 * a row of switches. At 5 there are five words mid-brighten at any instant, so
 * the boundary is a gradient a whole phrase wide and no single word can be seen
 * turning on.
 */
const WORD_FADE = 0.9

/**
 * A sentence that lights up as if it were being read — dim at rest, brightening
 * word by word from the start of the line.
 *
 * The design draws exactly this as a still (`566:13555`): the first half of the
 * sentence in white, the rest at `rgba(255,255,255,0.4)`, split mid-word. A
 * static frame of a moving thing, and this is the moving thing.
 *
 * **Two stacked copies per word, cross-fading on `opacity`.** The dim copy is in
 * flow and sets the metrics; the bright one is `absolute` over it and fades in
 * on a delay. Nothing animates `color`, which is not a compositable property and
 * would repaint the whole paragraph on every frame (RULES §12) — the same
 * construction `SharpeningHeadline` uses for its blur, for the same reason.
 *
 * The words are grouped so that only the spaces BETWEEN them can break: a run of
 * bare `inline-block` words would give the browser a break opportunity at every
 * pair, and a narrow column would come apart mid-sentence.
 *
 * The whole visual construction is `aria-hidden` and the real sentence is given
 * once alongside it. What is built for the eye here is a heap of duplicated
 * words; what should be read aloud is a sentence.
 */
const props = withDefaults(
  defineProps<{
    text: string
    /**
     * Whether the sentence is being read right now. Going false winds it back to
     * dim, so a block that comes round again is read again rather than arriving
     * already finished.
     */
    active?: boolean
    /** Seconds to wait after `active` before the first word lights. */
    delay?: number
    /**
     * How far through the line the reader has scrolled, 0 to 1.
     *
     * **Given it, the line stops reading itself and is read by the reader.** The
     * timed version below is a guess at someone's pace — 0.18s a word, which was
     * wrong twice before it was right once — and a guess is all a clock can
     * offer. A section that spends the page's own scroll on its content already
     * knows the answer: how far down the block the reader has come IS how far
     * through the sentence they are. Scrolling back unlights it again, which a
     * timer cannot do at all.
     *
     * Left `undefined` the clock stays in charge, which is what a block that
     * does not sit in a scroll track wants.
     */
    progress?: number
  }>(),
  { active: true, delay: 0, progress: undefined },
)

const prefersReducedMotion = useReducedMotion()

/** Whether the reader is driving. Decided by the caller, so SSR agrees. */
const scrollLit = computed(() => props.progress !== undefined)

/**
 * How many words are part-lit at once when the scroll is driving.
 *
 * The same softness the timed version buys with `WORD_FADE / WORD_STEP` — five
 * words mid-brighten, so the boundary is a gradient a whole phrase wide and no
 * single word is seen turning on. Here it is stated directly because there is no
 * clock to divide.
 */
const FEATHER = 5

/**
 * A word's strength, from the scroll.
 *
 * The front travels `words + FEATHER` positions across the block so that the
 * last word is fully lit by the time the reader reaches the end of it rather
 * than only just starting to.
 */
function litness(index: number) {
  if (prefersReducedMotion.value) return 1

  const front = (props.progress ?? 0) * (words.value.length + FEATHER)

  return Math.min(1, Math.max(0, (front - index) / FEATHER))
}

/**
 * The words, with their position in the line — the index is what staggers them,
 * so it has to survive the split rather than being recovered from a `v-for` over
 * a nested structure.
 */
const words = computed(() =>
  props.text.split(" ").map((word, i) => ({ key: `${word}-${i}`, word, index: i })),
)

// Reduced motion collapses the TRANSITION, never the rendered tree — the same
// markup and the same `initial` on both sides, with only the timing zeroed.
// Branching the tree is what broke hydration in S2 (RULES §12).
function lightUp(index: number) {
  return prefersReducedMotion.value
    ? { duration: 0 }
    : {
        duration: WORD_FADE,
        delay: props.delay + index * WORD_STEP,
        ease: EASE,
      }
}

// Winding back is not the reverse of reading: it happens off-screen or between
// turns, and staggering it would make the sentence appear to be unread word by
// word, which is a thing nobody does. One short fade for the whole line.
const dimDown = computed(() =>
  prefersReducedMotion.value
    ? { duration: 0 }
    : { duration: RESET_DURATION, ease: "easeOut" as const },
)
</script>

<template>
  <span class="block">
    <span class="sr-only">{{ text }}</span>

    <span aria-hidden="true">
      <span v-for="item in words" :key="item.key">
        <!-- The separator has to be an interpolation, not a literal space or a
             numeric entity: Vue's compiler drops static text nodes that hold
             only whitespace, which is what once ran every headline on the site
             together into one word. See `SharpeningHeadline`. -->
        <template v-if="item.index > 0">{{ " " }}</template>
        <span class="relative inline-block">
          <!-- The dim copy is the one in flow, so it alone sets the line's
               metrics and the bright copy above it cannot shift anything as it
               arrives. -->
          <span class="text-white/40">{{ item.word }}</span>

          <!-- Scroll-lit: a plain style, no transition and no motion element.
               The scroll IS the animation, and a transition on top of it would
               be a second one lagging behind the first. -->
          <span
            v-if="scrollLit"
            class="pointer-events-none absolute inset-0 text-white"
            :style="{ opacity: litness(item.index) }"
          >{{ item.word }}</span>

          <Motion
            v-else
            as="span"
            class="pointer-events-none absolute inset-0 text-white"
            :initial="{ opacity: 0 }"
            :animate="
              active
                ? { opacity: 1, transition: lightUp(item.index) }
                : { opacity: 0, transition: dimDown }
            "
            :style="{ willChange: 'opacity' }"
          >
            {{ item.word }}
          </Motion>
        </span>
      </span>
    </span>
  </span>
</template>
