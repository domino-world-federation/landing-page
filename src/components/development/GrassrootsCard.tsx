import Image from "next/image"

import type { GrassrootsCardCopy } from "@/content/development/grassroots"

/**
 * One grassroots initiative — Figma node `192:14917` and its two siblings.
 *
 * A 32px-radius panel at 50% of `surface-card`, padded 28 all round: the
 * programme's family, its name, a paragraph, and then the photograph filling
 * the rest.
 *
 * **The picture is at the foot and it is the tall part of the card.** Figma
 * gives it a fixed 680px inside a card that hugs, so the text block sets the
 * top and the image takes everything under it. Reproduced as an aspect rather
 * than a height (`3/4` is 573 × 680 at design width, the card's own share of
 * the row) so it scales with the column instead of demanding 680px of a phone.
 *
 * `mt-auto` keeps it at the foot however many lines the body above it wraps to,
 * which is what keeps the three pictures on one line across the row.
 */
export function GrassrootsCard({ card }: { card: GrassrootsCardCopy }) {
  return (
    <div className="flex h-full flex-col gap-7 rounded-[var(--radius-feature)] bg-[var(--color-surface-card)]/50 p-7">
      <div className="flex flex-col gap-3">
        {/* Bebas 32/40 at 50% — the programme's family, set above the name the
            way an eyebrow is. Not a heading: it repeats across cards, so
            announcing it as one would put two "Community" entries in the page
            outline. */}
        <p className="font-display text-[length:var(--text-display-caption)] leading-[1.25] text-white/50 uppercase">
          {card.kicker}
        </p>

        <h3 className="font-sans text-[length:var(--text-body-lg)] leading-[1.22] font-semibold text-white">
          {card.title}
        </h3>

        <p className="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60">
          {card.body}
        </p>
      </div>

      {/* `relative` gives next/image's `fill` a positioned, sized ancestor. */}
      <div className="relative mt-auto aspect-3/4 w-full overflow-hidden rounded-[var(--radius-glass)]">
        <Image
          src={card.image}
          alt={card.imageAlt}
          fill
          // One of three cards from `lg` up, one per row below it. The card is
          // inset by the section's 80px padding and its own 28px, which the
          // rough thirds below already allow for.
          sizes="(min-width: 1024px) 30vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  )
}
