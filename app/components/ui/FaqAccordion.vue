<script setup lang="ts">
import type { FaqItem } from "~/types/faq"

/**
 * Seconds for a panel to open or close.
 *
 * Short on purpose, and shorter than anything else on the page: the entrances
 * elsewhere are scroll-triggered and meant to be watched, while this one is the
 * reader's own click and stands between them and the answer. RULES §11 puts
 * micro-interactions at 200–400ms; this sits at the fast end of that.
 */
const TOGGLE = 0.28

/**
 * The S11 list — Figma node `81:692`.
 *
 * **One open at a time.** Figma draws exactly one item expanded (`81:696`) and a
 * plus/minus toggle rather than a chevron, which is the affordance of a
 * single-select accordion. Clicking the open item closes it, so "all closed" is
 * reachable; clicking a different one moves the answer rather than stacking a
 * second.
 *
 * **The panel animates its `height`, which RULES §11 otherwise rules out.** The
 * rule is aimed at the page's scroll-linked layers, where a reflow lands on
 * every frame of a move nobody asked for and several layers compete for the same
 * 16ms. This is one element, opened by an explicit click, for 280ms, with
 * nothing else animating beside it. The alternatives were measured against that
 * and both are worse: `max-height` on a guess reflows just the same and mistimes
 * the ease when the guess is wrong, and snapping open with no transition drops
 * the reader into a paragraph that was not there a frame earlier. The toggle
 * icon, which IS on a hot path shared with the rest of the page, stays on
 * `transform`/`opacity`.
 */
const props = defineProps<{
  items: readonly FaqItem[]
  /** Which item is open on first render. */
  defaultOpenId: string
}>()

const openId = ref(props.defaultOpenId)
const prefersReducedMotion = useReducedMotion()

// Reduced motion collapses the TRANSITION, never the tree (RULES §12). The
// preference is `false` during SSR, so anything that branched the markup on it
// would make the two sides disagree; only the duration does.
const transition = computed(() =>
  prefersReducedMotion.value ? { duration: 0 } : { duration: TOGGLE, ease: EASE },
)

function toggle(id: string) {
  openId.value = openId.value === id ? "" : id
}
</script>

<template>
  <ul class="flex flex-col gap-6">
    <li v-for="(item, i) in props.items" :key="item.id" class="flex flex-col">
      <!-- Figma's separators are 4px `#DADADA` rectangles BETWEEN items
           (`81:722`, `81:724`) — two of them for three items, with none under
           the last. Drawn as a `border-t` on every item after the first rather
           than as elements of their own: a rule that exists only to separate is
           a border, and as a border it cannot be announced or land in the tab
           order.

           The 24px list gap sits on both sides of it, so the rule floats clear
           of the rows rather than hugging one. -->
      <h3 :class="i === 0 ? '' : 'border-t-4 border-[var(--color-divider)] pt-6'">
        <!-- `text-left` because a button centres its label by default and these
             run to two lines on a narrow screen. `py-8` is Figma's 32px, which
             is also what gives the row its tap target. -->
        <button
          :id="`faq-button-${item.id}`"
          type="button"
          :aria-expanded="openId === item.id"
          :aria-controls="`faq-panel-${item.id}`"
          class="focus-visible:ring-gold flex w-full items-center justify-between gap-4 py-8 text-left focus-visible:rounded-[var(--radius-item)] focus-visible:ring-2 focus-visible:outline-none"
          @click="toggle(item.id)"
        >
          <!-- Figma's 36/48 (`81:694`) is a ratio of 1.333, and it is set as a
               ratio rather than as `leading-12` so the line box follows the
               question down as the clamp shrinks it. -->
          <span
            class="font-sans text-[length:var(--text-faq-question)] leading-[1.3333] font-semibold text-black"
          >
            {{ item.question }}
          </span>

          <!-- The plus/minus — Figma components `81:635` and `81:671`, which are
               the same horizontal bar with a second, vertical one added. Drawn
               here rather than swapped between two SVG files, because they are
               one glyph in two states: the vertical bar rotates flat onto the
               horizontal one and fades as it goes, so the plus *becomes* the
               minus instead of being replaced by it. Both properties are
               composited (RULES §12), unlike the panel the button opens.

               The bars are sized as fractions of the box (36/64 long, 4/64
               thick) so the glyph keeps Figma's proportions at every step of the
               size clamp. Decorative: `aria-expanded` on the button already
               announces the state, and a second voice for the same thing would
               say "collapsed, minus". -->
          <span
            aria-hidden="true"
            class="relative block size-8 shrink-0 lg:size-16"
          >
            <span
              class="absolute top-1/2 left-1/2 h-[6.25%] w-[56.25%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"
            />
            <!-- The centring offsets ride in `style` rather than in
                 `-translate-x-1/2` classes: motion writes the whole `transform`,
                 so a Tailwind translate on the same element would be overwritten
                 the first time the rotation ticks and the bar would jump to the
                 corner. -->
            <Motion
              as="span"
              class="absolute top-1/2 left-1/2 h-[6.25%] w-[56.25%] rounded-full bg-black"
              :style="{ x: '-50%', y: '-50%' }"
              :initial="false"
              :animate="{
                rotate: openId === item.id ? 0 : 90,
                opacity: openId === item.id ? 0 : 1,
              }"
              :transition="transition"
            />
          </span>
        </button>
      </h3>

      <!-- `inert` while closed rather than `aria-hidden`: the panel is still in
           the DOM at zero height, and hiding it from the accessibility tree
           without also taking it out of the tab order would strand a keyboard
           reader on a link they cannot hear — the same trap S8's duplicate
           marquee copy hit. `inert` does both at once.

           `role="region"` labelled by the button, so a screen reader moving into
           the answer is told which question it belongs to. -->
      <Motion
        :id="`faq-panel-${item.id}`"
        as="div"
        role="region"
        :aria-labelledby="`faq-button-${item.id}`"
        :inert="openId !== item.id"
        :initial="false"
        :animate="{
          height: openId === item.id ? 'auto' : 0,
          opacity: openId === item.id ? 1 : 0,
        }"
        :transition="transition"
        class="overflow-hidden"
      >
        <!-- The padding lives on an inner element, not on the animated box:
             padding on the box itself never reaches zero when the height does,
             so a closed panel would keep 18px of white and the rows would sit
             unevenly apart.

             `-mt-3.5` is Figma's 18px arriving by subtraction. The open item
             (`81:696`) is `padding: 32px 0` with an 18px gap between the
             question row and the answer, but the button above already spends 32
             of its own on the bottom — that padding is what makes the whole row
             a tap target and cannot be traded away, and shrinking it only while
             open would jump the row by 14px every toggle. So the answer is
             pulled back up by the 14px difference instead. The bottom stays 32,
             which is the item's own padding and the one Figma actually draws
             below the text. It rides on the inner element for the same reason
             the padding does: `overflow-hidden` clips it, and the panel measures
             this box's height including the offset, so a closed panel is still
             exactly zero. -->
        <p
          class="font-sans -mt-3.5 pb-8 text-[length:var(--text-faq-answer)] leading-[1.5] text-[var(--color-muted)]"
        >
          <!-- Figma bolds these phrases without linking them (`81:701`), so the
               emphasis is the content's, not a control's — `<strong>`/`<em>`,
               not styled spans. -->
          <template v-for="(segment, s) in item.answer" :key="s">
            <strong v-if="segment.strong" class="font-bold">{{ segment.text }}</strong>
            <em v-else-if="segment.em">{{ segment.text }}</em>
            <span v-else>{{ segment.text }}</span>
          </template>
        </p>
      </Motion>
    </li>
  </ul>
</template>
