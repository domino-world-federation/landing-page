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
  }>(),
  { active: true, delay: 0 },
)

const prefersReducedMotion = useReducedMotion()

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

          <Motion
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
