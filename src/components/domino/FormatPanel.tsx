import { Reveal } from "@/components/motion/Reveal"
import { cn } from "@/lib/utils/cn"
import { STAGGER } from "@/lib/utils/motion"
import type { Format } from "@/content/domino/formats"
import type { ReactNode } from "react"

/**
 * One half of the format split — Figma `131:4834` (silver) and `207:15558`
 * (gold).
 *
 * The two are mirror images rather than two designs: same padding, same type
 * scale, same three-row list, with the gold one flipped to the right edge. That
 * flip is `align`, and it reaches further than `text-align` — the statistics
 * rows swap their columns too, so the numbers run down the outer edge of the
 * section on both sides and the labels face inward.
 *
 * The eyebrow reads "OVERVIEW" on both panels, which is what Figma writes. It
 * is not a heading — it labels the pair rather than the panel — so it is a
 * plain `<p>` and the format name below it is the `<h2>`.
 *
 * Server Component; only the entrances reach for the client.
 */
export function FormatPanel({
  format,
  align,
  headingId,
  figure,
  className,
}: {
  format: Format
  align: "start" | "end"
  /** Set on the first panel only, so the section can be labelled by it. */
  headingId?: string
  /**
   * This panel's share of the figure that straddles the seam. Painted behind
   * the copy and clipped by the panel's own `overflow-hidden`, which is what
   * makes two halves read as one object — see `FormatSplit`.
   */
  figure?: ReactNode
  className?: string
}) {
  const end = align === "end"

  return (
    <div
      className={cn(
        // 80px of padding in Figma; 4.17vw is 80/1920, floored at the section
        // gutter so a narrow window does not spend most of the panel on air.
        "relative isolate flex flex-col overflow-hidden px-6 py-10 md:px-10 lg:justify-center lg:p-[4.17vw]",
        end && "items-end text-right",
        className,
      )}
    >
      {figure}

      {/* 480px wide in Figma. `max-w` rather than a width so the column can
          shrink; the gap between the title block and the body is 24px, and the
          36px inside the title block is Figma's own (`131:4835`). */}
      <div
        className={cn(
          "relative z-10 flex w-full max-w-[480px] flex-col gap-6",
          end && "items-end",
        )}
      >
        <Reveal y={40} className={cn("w-full", end && "flex justify-end")}>
          <div
            className={cn("flex flex-col gap-4 lg:gap-9", end && "items-end")}
          >
            {/* 20/28 Inter Medium (`131:4836`). Black at full strength — it is
                the quietest line by size, not by contrast. */}
            <p className="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-black uppercase">
              {format.eyebrow}
            </p>
            {/* Bebas 76/72 — `--text-display-sm` exactly, the same step S10's
                and Overview's headings take. `leading-[0.95]` is Figma's 72 on
                a 76 body. */}
            <h2
              id={headingId}
              className="font-display text-[length:var(--text-display-sm)] leading-[0.95] text-black uppercase"
            >
              {format.heading}
            </h2>
          </div>
        </Reveal>

        {/* 20/32 at 60% of `#0E0E0E` — the page background used as ink, which
            is what puts the body a step behind the heading without introducing
            a grey that exists nowhere else. */}
        <Reveal y={32} delay={STAGGER} className="w-full">
          <p className="font-sans text-[length:var(--text-eyebrow)] leading-8 text-[var(--color-bg)]/60">
            {format.body}
          </p>
        </Reveal>

        {/* A `<dl>` because each row is a term and its value — "Players: 1 vs
            1" is a definition list said out loud, and a screen reader pairs
            them without the markup having to explain itself. The rows are
            `justify-between` with 12px of padding, 12px apart (`207:15574`). */}
        <Reveal y={24} delay={STAGGER * 2} className="w-full">
          <dl className="flex w-full flex-col gap-3">
            {format.stats.map((stat) => (
              <div
                key={stat.id}
                className="flex items-center justify-between gap-4 py-3"
              >
                {/* Source order is label-then-value on both panels so the
                    reading order never depends on which side the panel is on;
                    `order` flips only what is painted. Bebas 32/40, the label
                    at 60% (`207:15598`). */}
                <dt
                  className={cn(
                    "font-display text-[length:var(--text-display-btn)] leading-10 text-black/60 uppercase",
                    end && "order-2",
                  )}
                >
                  {stat.label}
                </dt>
                <dd
                  className={cn(
                    "font-display text-[length:var(--text-display-btn)] leading-10 text-black uppercase",
                    end && "order-1",
                  )}
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </div>
  )
}
