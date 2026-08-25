"use client"

import { useState } from "react"

import { RULEBOOK_COPY, RULE_SETS } from "@/content/domino/rulebook"

/**
 * The Rulebook — Figma node `277:15676` in the updated file.
 *
 * A gold Bebas 100 heading over a pill strip, and a glass card holding the
 * selected rule set: a title, a paragraph, and the rule quoted in a light box
 * with a heavy left rule.
 *
 * **This is the block R12 was opened for.** The old file stopped drawing at
 * y=2180 and this section was where it stopped; the updated file draws it.
 *
 * **The strip renders from the data, not from the design's six labels.** Only
 * one rule set has copy, so only one tab exists — and with one there is nothing
 * to switch between, so the strip is not drawn at all. A tab bar with a single
 * tab is chrome pretending to be a control, and five tabs that open nothing is
 * the silent no-op D28 ruled out. The moment a second set is written both
 * appear, and this component does not change.
 *
 * Client because the strip carries the selection. It is the whole section
 * rather than an island inside it because the card's every line changes with
 * the tab — there is no static half to leave on the server (the same reasoning
 * the news page's featured band records).
 */
export function Rulebook() {
  const [activeId, setActiveId] = useState(RULE_SETS[0]?.id)

  if (RULE_SETS.length === 0) return null

  const active = RULE_SETS.find((set) => set.id === activeId) ?? RULE_SETS[0]

  return (
    <section
      aria-labelledby="rulebook-heading"
      className="bg-bg flex flex-col gap-10 px-5 py-14 md:px-10 lg:gap-15 lg:px-20 lg:py-[4.1667vw]"
    >
      <div className="flex flex-col items-center gap-6 lg:gap-9">
        <h2
          id="rulebook-heading"
          className="font-display bg-[image:var(--gradient-gold-text)] bg-clip-text text-center text-[length:var(--text-display-statement)] leading-[1.08] text-transparent uppercase"
        >
          {RULEBOOK_COPY.heading}
        </h2>

        {/* `288:15756` — the navbar's chrome again: 40% black under a 10px
            backdrop blur, 12px radius, 4px of padding. Only drawn when there is
            more than one set to choose between. */}
        {RULE_SETS.length > 1 && (
          <div
            role="tablist"
            aria-label={RULEBOOK_COPY.tabsLabel}
            className="flex w-max max-w-full items-center gap-0 overflow-x-auto rounded-[var(--radius-glass)] bg-black/40 p-1 backdrop-blur-[10px]"
          >
            {RULE_SETS.map((set) => {
              const selected = set.id === active.id
              return (
                <button
                  key={set.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="rulebook-panel"
                  onClick={() => setActiveId(set.id)}
                  className={`rounded-btn font-sans focus-visible:ring-gold px-5 py-3 text-[length:var(--text-label-sm)] leading-relaxed font-medium tracking-[0.04em] whitespace-nowrap text-white uppercase transition-opacity focus-visible:ring-2 focus-visible:outline-none ${
                    selected ? "bg-white/12" : "opacity-50 hover:opacity-80"
                  }`}
                >
                  {set.tab}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* `289:15776` — the glass card. */}
      <div
        id="rulebook-panel"
        role={RULE_SETS.length > 1 ? "tabpanel" : undefined}
        className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-linear-to-b from-white/12 to-white/4 p-6"
      >
        {/* Inter SemiBold 36/44. */}
        <h3 className="font-sans text-[length:var(--text-body-lg)] leading-[1.22] font-semibold text-white">
          {active.title}
        </h3>

        {/* Inter Regular 24/36 at 50%. */}
        <p className="font-sans text-[length:var(--text-body-sm)] leading-[1.5] text-white/50">
          {active.body}
        </p>

        {/* `289:15789` — a light box with a 4px black rule down its left edge.
            A `<blockquote>` because it is one: the section quotes the rulebook
            at itself, and the citation is the rule's number. */}
        <figure className="rounded-[var(--radius-glass)] border-l-4 border-black bg-[#f3f3f4] p-6 lg:p-8">
          <blockquote className="font-sans text-[length:var(--text-heading-tile)] leading-[1.29] text-[#1a1c1d] italic">
            &ldquo;{active.quote.text}&rdquo;
          </blockquote>
          {/* Figma runs the citation into the same text node after an em dash.
              Split out so it is marked up as the attribution it is — a screen
              reader then knows where the quotation ends. */}
          <figcaption className="font-sans text-[length:var(--text-heading-tile)] leading-[1.29] text-[#1a1c1d] italic">
            &mdash; {active.quote.cite}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
