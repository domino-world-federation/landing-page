<script setup lang="ts">
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
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** One entry per line of the headline. Each line sweeps on its own. */
    lines: readonly string[]
    /** Starting blur. Defaults to the design's own 7.5px. */
    blur?: string
  }>(),
  { blur: "7.5px" },
)

const attrs = useAttrs()
const rootClass = computed(() => cn("block", attrs.class as string | undefined))
const passThrough = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const prefersReducedMotion = useReducedMotion()

/**
 * The letter grid, built once per copy change rather than in the template.
 *
 * The index restarts on every line, and that is the design: each line carries
 * its own ramp, sharp at the left margin and soft at its right end. Letting the
 * count run on across the whole headline would leave the second line entirely
 * behind the first — by the time the sweep reached it, the reader would have
 * watched one line clear and then waited for another to start.
 */
const structured = computed(() =>
  props.lines.map((line) => {
    let charIndex = 0

    return {
      line,
      words: line.split(" ").map((word, w) => ({
        key: `${word}-${w}`,
        // The separating space sits OUTSIDE the word's `inline-block`: inside it
        // the browser collapses it against the box edge and the words run
        // together. Grouping by word also keeps the break opportunities between
        // words — a line of bare `inline-block` letters would let a narrow
        // window wrap mid-word.
        leadingSpace: w > 0,
        chars: [...word].map((char, c) => ({
          key: `${char}-${c}`,
          char,
          index: charIndex++,
        })),
      })),
    }
  }),
)

// Reduced motion collapses the TRANSITION, never the rendered tree — the same
// markup and the same `initial` on both sides, with only the timing zeroed.
// Branching the tree is what broke hydration in S2 (RULES §12), and it would be
// especially tempting here: rendering one plain string instead of seventy letter
// copies is obviously cheaper, and obviously wrong.
function step(i: number) {
  return prefersReducedMotion.value
    ? { duration: 0 }
    : { duration: DURATION, delay: i * CHAR_STEP, ease: EASE }
}

const reset = computed(() =>
  prefersReducedMotion.value
    ? { duration: 0 }
    : { duration: RESET_DURATION, ease: "easeOut" as const },
)

// `amount` low because the headline is tall: a quarter of it would hold the
// sweep until the band is most of the way up the window, and this is the first
// thing on the page.
const viewport = { once: false, amount: 0.1 } as const
</script>

<template>
  <span v-bind="passThrough" :class="rootClass">
    <!-- The visual construction is a heap of duplicated letters, so it is hidden
         from assistive tech entirely and the real sentence is given once. Same
         split as `StatsWheel`, and for the same reason: what is built for the
         eye and what is read aloud are different shapes here. -->
    <span class="sr-only">{{ lines.join(" ") }}</span>

    <span aria-hidden="true">
      <!-- A block per line so the design's break survives without a `<br>` that
           a translation would have to carry (RULES §9). -->
      <span v-for="row in structured" :key="row.line" class="block">
        <span v-for="word in row.words" :key="word.key">
          <template v-if="word.leadingSpace">&#32;</template>
          <span class="inline-block">
            <span
              v-for="glyph in word.chars"
              :key="glyph.key"
              class="relative inline-block"
            >
              <!-- Blurred copy, over the sharp one and fading out. It is
                   `absolute` so the sharp copy alone sets the metrics —
                   otherwise the blur's spread would widen every glyph box and
                   the word would set loose. -->
              <Motion
                as="span"
                class="pointer-events-none absolute inset-0"
                :initial="{ opacity: 1 }"
                :animate="{ opacity: 1, transition: reset }"
                :while-in-view="{
                  opacity: 0,
                  transition: { ...step(glyph.index), ease: 'easeIn' },
                }"
                :in-view-options="viewport"
                :style="{ filter: `blur(${blur})`, willChange: 'opacity' }"
              >
                {{ glyph.char }}
              </Motion>

              <Motion
                as="span"
                class="inline-block"
                :initial="{ opacity: 0 }"
                :animate="{ opacity: 0, transition: reset }"
                :while-in-view="{ opacity: 1, transition: step(glyph.index) }"
                :in-view-options="viewport"
                :style="{ willChange: 'opacity' }"
              >
                {{ glyph.char }}
              </Motion>
            </span>
          </span>
        </span>
      </span>
    </span>
  </span>
</template>
