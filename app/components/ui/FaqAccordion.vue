<script setup lang="ts">
import type { FaqItem, FaqSegment } from "~/types/faq"

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
const props = withDefaults(
  defineProps<{
    items: readonly FaqItem[]
    /** Which item is open on first render. */
    defaultOpenId?: string
    /**
     * Which ground the list is sitting on, and therefore how an item is drawn.
     *
     * `light` is the original and stays the default: black type on a white card,
     * items separated by Figma's 4px `#DADADA` rules. `/domino` and
     * `/tournaments` sit on white and want it.
     *
     * `/page/faq` used to as well, and no longer does: its redraw (`613:23255`)
     * took the white card away and left the items standing on the page's own
     * ground, which is this component's `dark` tone exactly.
     *
     * `dark` is S11's new treatment (`81:690`), where the card became a
     * translucent dark pane and each item became a filled box of its own
     * (`rgba(255,255,255,0.08)`, 16px radius) instead of a row between rules.
     * The two travel together rather than as separate props because they are one
     * design decision: the dividers only ever existed to separate rows that had
     * no edges, and boxed items have their own. Same call `MediaGallery` makes
     * for its heading colour (D32/D43).
     */
    tone?: "light" | "dark"
  }>(),
  { tone: "light" },
)

/**
 * Which row starts open — **the first, everywhere, unless a caller says
 * otherwise**.
 *
 * It was a required prop and every page exported a constant for it, which meant
 * four places could disagree about a rule that is the same on all of them: an
 * accordion with everything shut opens on a wall of questions with nothing to
 * read, so one answer is left showing as a sample of what the others hold. Which
 * one carries that job is not something any of the designs argue for, and the
 * first is the one a reader's eye lands on before they have decided to look.
 *
 * Stated here so a page added later inherits it rather than choosing again.
 */
const openId = ref(props.defaultOpenId ?? props.items[0]?.id)

/**
 * Menyempitkan `answer` ke bentuk potongan.
 *
 * Ada karena `v-else` pada `v-for` tidak membawa penyempitan tipe dari `v-if`
 * di atasnya — TypeScript tetap melihat `FaqSegment[] | string` di dalam
 * perulangan, dan `segment.strong` jadi galat.
 */
function segmentsOf(item: FaqItem): readonly FaqSegment[] {
  return typeof item.answer === "string" ? [] : item.answer
}
const prefersReducedMotion = useReducedMotion()

const dark = computed(() => props.tone === "dark")

// Figma's item is `padding: 20px 32px` on a 16px radius (`81:693`). The padding
// is what spaces the question from the box, so the button gives up the `py-8` it
// carries on light — doubling the two would put 52px above every question. The
// row still clears the 48px tap target on its line box alone.
const itemClass = computed(() =>
  dark.value
    ? "rounded-[var(--radius-item)] bg-white/[0.08] px-5 py-4 md:px-8 md:py-5"
    : "flex flex-col",
)

const buttonPadding = computed(() => (dark.value ? "py-0" : "py-8"))

const questionColour = computed(() => (dark.value ? "text-white" : "text-black"))

const barColour = computed(() => (dark.value ? "bg-white" : "bg-black"))

// Figma's 18px gap between the question row and the answer inside an open item
// (`81:696`). On light there is no gap to add — the answer is pulled UP instead,
// to cancel the 32px the button spends below itself; see the note in the
// template.
const answerClass = computed(() =>
  dark.value
    ? "pt-[18px] text-[#A3A3A3]"
    : "-mt-3.5 pb-8 text-[var(--color-muted)]",
)

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
    <li v-for="(item, i) in props.items" :key="item.id" :class="itemClass">
      <!-- On `light`, Figma's separators are 4px `#DADADA` rectangles BETWEEN
           items (`81:722`, `81:724`) — two of them for three items, with none
           under the last. Drawn as a `border-t` on every item after the first
           rather than as elements of their own: a rule that exists only to
           separate is a border, and as a border it cannot be announced or land
           in the tab order.

           The 24px list gap sits on both sides of it, so the rule floats clear
           of the rows rather than hugging one.

           On `dark` there are no rules at all: the redraw gives every item its
           own filled box, so the 24px gap between boxes is the separation and a
           border would draw a second line inside an edge that already exists. -->
      <h3
        :class="
          dark || i === 0 ? '' : 'border-t-4 border-[var(--color-divider)] pt-6'
        "
      >
        <!-- `text-left` because a button centres its label by default and these
             run to two lines on a narrow screen. On `light`, `py-8` is Figma's
             32px, which is also what gives the row its tap target; on `dark` the
             item's own box padding does that job instead. -->
        <button
          :id="`faq-button-${item.id}`"
          type="button"
          :aria-expanded="openId === item.id"
          :aria-controls="`faq-panel-${item.id}`"
          :class="
            cn(
              'focus-visible:ring-gold flex w-full items-center justify-between gap-4 text-left focus-visible:rounded-[var(--radius-item)] focus-visible:ring-2 focus-visible:outline-none',
              buttonPadding,
            )
          "
          @click="toggle(item.id)"
        >
          <!-- Figma's 36/48 (`81:694`) is a ratio of 1.333, and it is set as a
               ratio rather than as `leading-12` so the line box follows the
               question down as the clamp shrinks it. -->
          <span
            :class="
              cn(
                'font-sans text-[length:var(--text-faq-question)] leading-[1.3333] font-semibold',
                questionColour,
              )
            "
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
              :class="
                cn(
                  'absolute top-1/2 left-1/2 h-[6.25%] w-[56.25%] -translate-x-1/2 -translate-y-1/2 rounded-full',
                  barColour,
                )
              "
            />
            <!-- The centring offsets ride in `style` rather than in
                 `-translate-x-1/2` classes: motion writes the whole `transform`,
                 so a Tailwind translate on the same element would be overwritten
                 the first time the rotation ticks and the bar would jump to the
                 corner. -->
            <Motion
              as="span"
              :class="
                cn(
                  'absolute top-1/2 left-1/2 h-[6.25%] w-[56.25%] rounded-full',
                  barColour,
                )
              "
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
        <!-- The spacing lives on an inner element, not on the animated box:
             padding on the box itself never reaches zero when the height does,
             so a closed panel would keep 18px of ground and the rows would sit
             unevenly apart. It rides here for the same reason the padding does:
             `overflow-hidden` clips it, and the panel measures this box's height
             including the offset, so a closed panel is still exactly zero.

             Both tones are chasing Figma's same 18px gap between the question
             row and the answer, and they arrive at it from opposite directions.

             On `dark` it is simply that: `pt-[18px]`, because the item's box
             padding already sits below the answer and the button above spends
             nothing.

             On `light` it arrives by SUBTRACTION. The open item (`81:696`) is
             `padding: 32px 0`, but the button above already spends 32 of its own
             on the bottom — that padding is what makes the whole row a tap
             target and cannot be traded away, and shrinking it only while open
             would jump the row by 14px every toggle. So the answer is pulled
             back up by the 14px difference instead, and `pb-8` restores the 32
             Figma draws below the text. -->
        <p
          :class="
            cn(
              'font-sans text-[length:var(--text-faq-answer)] leading-[1.5]',
              answerClass,
            )
          "
        >
          <!-- Two shapes, branched on `typeof` — see `FaqItem.answer`.

               A STRING is sanitised HTML from the CMS. `v-html` is safe here
               and only here: the server runs every answer through `Purifier`
               before storing it, narrowed to bold/italic/underline/strike,
               lists and links. Sanitising again in the browser would be
               theatre — it cannot undo what a compromised server sent, and it
               would strip the lists the editor's own toolbar produces. -->
          <span v-if="typeof item.answer === 'string'" v-html="item.answer" />

          <!-- SEGMENTS are copy that lives in this repo. Figma bolds these
               phrases without linking them (`81:701`), so the emphasis is the
               content's, not a control's — `<strong>`/`<em>`, not styled
               spans. -->
          <template v-for="(segment, s) in segmentsOf(item)" v-else :key="s">
            <strong v-if="segment.strong" class="font-bold">{{ segment.text }}</strong>
            <em v-else-if="segment.em">{{ segment.text }}</em>
            <span v-else>{{ segment.text }}</span>
          </template>
        </p>
      </Motion>
    </li>
  </ul>
</template>
