<script setup lang="ts">
/**
 * The step number beside the claims, as a rolling counter.
 *
 * Taken from the section this one is drawn after, where it is the only thing in
 * the column besides the words: two columns of the digits 0–9, each clipped to
 * one line and slid so the wanted digit is the one showing. The number does not
 * cut from 1 to 2 — it travels, which is the same statement the column and the
 * notch make about moving from one claim to the next.
 *
 * **Ten digits per column, not two swapped.** A cross-fade between numerals
 * gives no direction, and direction is the whole point: 1 → 2 rolls up and 2 → 1
 * rolls back down, so the counter says which way the reader is going. It costs
 * twenty spans and one transform.
 *
 * Padded to at least two places, as the reference draws it — "01" reads as a
 * step in a sequence where "1" reads as a quantity.
 *
 * The whole thing is `aria-hidden` and the count is said in words alongside it:
 * what is built here is a picture of a number moving.
 */
const props = defineProps<{
  /** The claim being read, counting from 1. */
  value: number
  total: number
  /** `%1` is `value`, `%2` is `total`. */
  label: string
}>()

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

/** As many places as the total needs, and never fewer than two. */
const places = computed(() => Math.max(2, String(props.total).length))

const digits = computed(() =>
  String(props.value)
    .padStart(places.value, "0")
    .split("")
    .map((digit, index) => ({ key: index, value: Number(digit) })),
)

const prefersReducedMotion = useReducedMotion()

// Reduced motion collapses the TRANSITION, never the tree (RULES §12): the
// number still changes, it simply arrives rather than travelling.
const roll = computed(() =>
  prefersReducedMotion.value
    ? { duration: 0 }
    : { duration: DURATION, ease: EASE },
)

const spoken = computed(() =>
  props.label.replace("%1", String(props.value)).replace("%2", String(props.total)),
)
</script>

<template>
  <div>
    <p class="sr-only">{{ spoken }}</p>

    <!-- `1.1em` on both the window and every digit, so the slide is exactly one
         digit whatever the type step resolves to — no measuring, and nothing to
         disagree with when the clamp changes. -->
    <div
      aria-hidden="true"
      class="font-sans flex text-[length:var(--text-label-xs)] leading-[1.1] font-medium tracking-[0.2em] text-white/40 tabular-nums"
    >
      <div
        v-for="digit in digits"
        :key="digit.key"
        class="h-[1.1em] overflow-hidden"
      >
        <Motion
          as="div"
          :animate="{ y: `-${digit.value * 100}%` }"
          :transition="roll"
          :style="{ willChange: 'transform' }"
        >
          <div v-for="numeral in DIGITS" :key="numeral" class="h-[1.1em]">
            {{ numeral }}
          </div>
        </Motion>
      </div>
    </div>
  </div>
</template>
