<script setup lang="ts">
/**
 * Seconds. Longer than a standard entrance (`DURATION`, 1.4): an entrance is
 * over once the thing has arrived, but a counter has to be *read* while it runs,
 * and a figure that lands before the eye has settled on it never counts at all.
 */
const COUNT_DURATION = 1.8

/** The page's curve, sampled directly — see `utils/motion`. */
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
  const digits = numeric!.replace(/[.,]/g, "")
  if (digits.length === 0 || digits.length > 15) return null

  // A separator only counts as grouping if it actually groups: "1.420" does,
  // "1.42" does not, and the difference decides whether the count runs to 1420
  // or to 1.42. Anything that is not clean groups of three is left alone.
  const grouped = /^\d{1,3}([.,]\d{3})+$/.test(numeric!)
  const separator = grouped ? numeric!.replace(/[^.,]/g, "")[0]! : ""

  return { prefix: prefix ?? "", suffix: suffix ?? "", separator, target: Number(digits) }
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
 * Vue warn and patch the node. The count starts after mount, once the element is
 * actually seen. A reader with JavaScript off therefore sees the real number,
 * which is the right fallback for a figure that means something.
 *
 * **Reduced motion never resets.** The figure stays where the server put it —
 * that is the whole animation collapsing to its end state, which is what
 * RULES §12 asks for, and the markup is identical either way.
 *
 * Counted with `requestAnimationFrame` rather than with a motion value: this is
 * text, not a transform, and motion's value animation is shaped for driving
 * styles. The curve is still the page's own, sampled from the same constant
 * every entrance reads.
 */
const props = defineProps<{ value: string }>()

const parsed = computed(() => parse(props.value))
const prefersReducedMotion = useReducedMotion()

const root = useTemplateRef<HTMLSpanElement>("root")
// `once`: a figure that recounts every time it scrolls past reads as a glitch
// rather than an entrance.
const inView = useInView(root, { once: true, amount: 0.5 })

const display = ref(props.value)

let frame = 0

function stop() {
  if (frame) cancelAnimationFrame(frame)
  frame = 0
}

watch(
  [inView, parsed, prefersReducedMotion],
  ([visible, figure, reduced]) => {
    stop()
    if (!visible || !figure || reduced) return

    const { prefix, suffix, separator, target } = figure
    const format = (n: number) => `${prefix}${group(n, separator)}${suffix}`

    let start: number | null = null

    const tick = (now: number) => {
      start ??= now
      // `now` is a DOMHighResTimeStamp in ms; the duration is in seconds like
      // every other timing in this project.
      const progress = Math.min((now - start) / (COUNT_DURATION * 1000), 1)
      display.value = format(Math.round(ease(progress) * target))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
  },
  { immediate: true },
)

// The figure is re-read when the copy behind it changes, so a value swapped
// mid-life prints the new one rather than the stale count.
watch(
  () => props.value,
  (next) => {
    if (!inView.value || prefersReducedMotion.value) display.value = next
  },
)

onBeforeUnmount(stop)
</script>

<template>
  <!-- Nothing countable in there — print it and leave it alone. -->
  <span v-if="!parsed">{{ value }}</span>

  <span v-else ref="root">
    <!-- The real figure, for assistive tech. The animating copy is hidden from
         it: a counter inside a live region would announce forty intermediate
         numbers, and outside one it would announce whichever number happened to
         be showing when the reader arrived. -->
    <span class="sr-only">{{ value }}</span>
    <!-- `tabular-nums` so the digits keep one width — proportional figures make
         the whole row twitch sideways as the count runs. -->
    <span aria-hidden class="tabular-nums">{{ display }}</span>
  </span>
</template>
