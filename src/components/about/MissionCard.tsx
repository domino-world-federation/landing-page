import Image from "next/image"

import type { MissionCardCopy } from "@/content/about/mission"

/**
 * One of Mission's four cards — Figma `107:2938` and its three siblings.
 *
 * Split out of `Mission` because the section was past the ~150-line mark once
 * the heading block and the grid were both in it (RULES §5).
 *
 * The fill is Figma's own top-down white wash at 12% → 4%: a glass panel on the
 * page background rather than a solid, so the section keeps reading as one dark
 * band with four lit patches in it.
 */
export function MissionCard({ card }: { card: MissionCardCopy }) {
  return (
    // 425px tall with the icon at the top and the text at the foot — the gap
    // between them is what the height is for, so `justify-between` rather than
    // a margin. `min-h` so a longer translation grows the card instead of
    // spilling out of it.
    <div className="flex min-h-[300px] flex-col justify-between gap-10 rounded-[20px] bg-[linear-gradient(180deg,rgb(255_255_255/0.12)_0%,rgb(255_255_255/0.04)_100%)] p-6 lg:min-h-[22.14vw]">
      {/* 72 × 72 in Figma; `w-auto h-…` so the intrinsic ratio is kept and the
          SVG is never squashed. next/image serves SVGs unoptimised either way
          (RULES §7), so this is here for the sizing, not the pipeline. */}
      <Image
        src={card.icon}
        // Empty: the icon draws what the title below it already says, so naming
        // it would have a screen reader announce the card twice.
        alt=""
        width={72}
        height={72}
        className="h-14 w-auto lg:h-[min(3.75vw,72px)]"
      />

      <div className="flex flex-col gap-4">
        <h3 className="font-sans text-[length:var(--text-body-lg)] leading-[1.22] font-semibold text-white">
          {card.title}
        </h3>
        <p className="font-sans text-[length:var(--text-body-sm)] leading-[1.5] text-white/40">
          {card.body}
        </p>
      </div>
    </div>
  )
}
