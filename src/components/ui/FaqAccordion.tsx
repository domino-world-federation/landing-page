"use client"

import { motion, useReducedMotion } from "motion/react"
import { useState } from "react"

import { EASE } from "@/lib/utils/motion"

/**
 * A run of answer text. The designs bold phrases inside a paragraph rather than
 * linking them, so the emphasis is typographic and belongs in the copy.
 *
 * Segments rather than a markdown string: a translator moving `**` markers
 * around by hand is a parsing bug waiting to happen, and this way the shape is
 * checked by the compiler.
 */
export type FaqSegment = {
  text: string
  /** Rendered as `<strong>`. */
  strong?: boolean
  /**
   * Rendered as `<em>`. Used for a cited document title — the Domino wireframe
   * draws one underlined and in a link colour, but there is nowhere for it to
   * lead, so it is emphasis rather than a control.
   */
  em?: boolean
}

export type FaqItem = {
  id: string
  question: string
  answer: readonly FaqSegment[]
}

/**
 * Seconds for a panel to open or close.
 *
 * Short on purpose, and shorter than anything else on the page: the entrances
 * elsewhere are scroll-triggered and meant to be watched, while this one is the
 * reader's own click and stands between them and the answer. RULES §11 puts
 * micro-interactions at 200–400ms; this sits at the fast end of that.
 */
const TOGGLE = 0.28

type FaqAccordionProps = {
  items: readonly FaqItem[]
  /** Which item is open on first render. */
  defaultOpenId: string
}

/**
 * The S11 list — Figma node `81:692`.
 *
 * **One open at a time.** Figma draws exactly one item expanded (`81:696`) and
 * a plus/minus toggle rather than a chevron, which is the affordance of a
 * single-select accordion. Clicking the open item closes it, so "all closed"
 * is reachable; clicking a different one moves the answer rather than stacking
 * a second.
 *
 * **The panel animates its `height`, which RULES §11 otherwise rules out.** The
 * rule is aimed at the page's scroll-linked layers, where a reflow lands on
 * every frame of a move nobody asked for and several layers compete for the
 * same 16ms. This is one element, opened by an explicit click, for 280ms, with
 * nothing else animating beside it. The alternatives were measured against
 * that and both are worse: `max-height` on a guess reflows just the same and
 * mistimes the ease when the guess is wrong, and snapping open with no
 * transition drops the reader into a paragraph that was not there a frame
 * earlier. The toggle icon, which IS on a hot path shared with the rest of the
 * page, stays on `transform`/`opacity`.
 *
 * Client because the open item is state. It is the only client part of S11 —
 * the section, the card, and the copy are all server-rendered around it.
 */
export function FaqAccordion({ items, defaultOpenId }: FaqAccordionProps) {
  const [openId, setOpenId] = useState(defaultOpenId)
  const prefersReducedMotion = useReducedMotion()

  // Reduced motion collapses the TRANSITION, never the tree (RULES §12).
  // `useReducedMotion` is `null` on the server, so anything that branched the
  // markup on it would make the two sides disagree; only the duration does.
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: TOGGLE, ease: EASE }

  return (
    <ul className="flex flex-col gap-6">
      {items.map((item, i) => {
        const open = item.id === openId
        const panelId = `faq-panel-${item.id}`
        const buttonId = `faq-button-${item.id}`

        return (
          <li key={item.id} className="flex flex-col">
            {/* Figma's separators are 4px `#DADADA` rectangles BETWEEN items
                (`81:722`, `81:724`) — two of them for three items, with none
                under the last. Drawn as a `border-t` on every item after the
                first rather than as elements of their own: a rule that exists
                only to separate is a border, and as a border it cannot be
                announced or land in the tab order.

                The 24px list gap sits on both sides of it, so the rule floats
                clear of the rows rather than hugging one. */}
            <h3
              className={
                i === 0 ? "" : "border-t-4 border-[var(--color-divider)] pt-6"
              }
            >
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? "" : item.id)}
                // `text-left` because a button centres its label by default and
                // these run to two lines on a narrow screen. `py-8` is Figma's
                // 32px, which is also what gives the row its tap target.
                className="focus-visible:ring-gold flex w-full items-center justify-between gap-4 py-8 text-left focus-visible:rounded-[var(--radius-item)] focus-visible:ring-2 focus-visible:outline-none"
              >
                {/* Figma's 36/48 (`81:694`) is a ratio of 1.333, and it is set
                    as a ratio rather than as `leading-12` so the line box
                    follows the question down as the clamp shrinks it. */}
                <span className="font-sans text-[length:var(--text-faq-question)] leading-[1.3333] font-semibold text-black">
                  {item.question}
                </span>
                <FaqToggleIcon open={open} transition={transition} />
              </button>
            </h3>

            {/* `inert` while closed rather than `aria-hidden`: the panel is
                still in the DOM at zero height, and hiding it from the
                accessibility tree without also taking it out of the tab order
                would strand a keyboard reader on a link they cannot hear —
                the same trap S8's duplicate marquee copy hit. `inert` does
                both at once.

                `role="region"` labelled by the button, so a screen reader
                moving into the answer is told which question it belongs to. */}
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!open}
              initial={false}
              animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
              transition={transition}
              className="overflow-hidden"
            >
              {/* The padding lives on an inner element, not on the animated
                  box: padding on the box itself never reaches zero when the
                  height does, so a closed panel would keep 18px of white and
                  the rows would sit unevenly apart.

                  `-mt-3.5` is Figma's 18px arriving by subtraction. The open
                  item (`81:696`) is `padding: 32px 0` with an 18px gap between
                  the question row and the answer, but the button above already
                  spends 32 of its own on the bottom — that padding is what
                  makes the whole row a tap target and cannot be traded away,
                  and shrinking it only while open would jump the row by 14px
                  every toggle. So the answer is pulled back up by the 14px
                  difference instead. The bottom stays 32, which is the item's
                  own padding and the one Figma actually draws below the text.
                  It rides on the inner element for the same reason the padding
                  does: `overflow-hidden` clips it, and the panel measures this
                  box's height including the offset, so a closed panel is still
                  exactly zero. */}
              <p className="font-sans -mt-3.5 pb-8 text-[length:var(--text-faq-answer)] leading-[1.5] text-[var(--color-muted)]">
                {item.answer.map((segment, s) => {
                  // Figma bolds these phrases without linking them (`81:701`),
                  // so the emphasis is the content's, not a control's —
                  // `<strong>`/`<em>`, not styled spans.
                  if (segment.strong)
                    return (
                      <strong key={s} className="font-bold">
                        {segment.text}
                      </strong>
                    )
                  if (segment.em) return <em key={s}>{segment.text}</em>
                  return <span key={s}>{segment.text}</span>
                })}
              </p>
            </motion.div>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * The plus/minus at the end of each row — Figma components `81:635` and
 * `81:671`, which are the same horizontal bar with a second, vertical one
 * added.
 *
 * Drawn here rather than swapped between two SVG files, because they are one
 * glyph in two states: the vertical bar rotates flat onto the horizontal one
 * and fades as it goes, so the plus *becomes* the minus instead of being
 * replaced by it. Both properties are composited (RULES §12), unlike the panel
 * the button opens.
 *
 * The bars are sized as fractions of the box (36/64 long, 4/64 thick) so the
 * glyph keeps Figma's proportions at every step of the size clamp.
 */
function FaqToggleIcon({
  open,
  transition,
}: {
  open: boolean
  transition: { duration: number; ease?: typeof EASE }
}) {
  // Decorative: `aria-expanded` on the button already announces the state, and
  // a second voice for the same thing would say "collapsed, minus".
  return (
    <span
      aria-hidden="true"
      className="relative block size-8 shrink-0 lg:size-16"
    >
      <span className="absolute top-1/2 left-1/2 h-[6.25%] w-[56.25%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />
      {/* The centring offsets ride in `style` rather than in `-translate-x-1/2`
          classes: `motion` writes the whole `transform`, so a Tailwind
          translate on the same element would be overwritten the first time the
          rotation ticks and the bar would jump to the corner. */}
      <motion.span
        className="absolute top-1/2 left-1/2 h-[6.25%] w-[56.25%] rounded-full bg-black"
        style={{ x: "-50%", y: "-50%" }}
        initial={false}
        animate={{ rotate: open ? 0 : 90, opacity: open ? 0 : 1 }}
        transition={transition}
      />
    </span>
  )
}
