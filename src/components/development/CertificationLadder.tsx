import { Reveal } from "@/components/motion/Reveal"
import { COACHING_LEVELS } from "@/content/development/certifications"
import { STAGGER } from "@/lib/utils/motion"

/**
 * The coaching ladder beside the referee grades — Figma node `192:14728`.
 *
 * Figma draws this as TWO columns that happen to line up: a 116px strip holding
 * three dots and three dashed rules, and a text column beside it holding three
 * blocks. That only stays aligned as long as every block is the height the
 * design gave it — which stops being true the moment a body wraps to a
 * different number of lines, and it wraps differently at every width here.
 *
 * So the strip is folded INTO each row: one list, one item per level, each item
 * a gutter and a block. The dot sits at the top of its own row and the rule
 * fills whatever height is left under it, so the axis is built from the content
 * rather than measured against it.
 *
 * The rules are drawn per item rather than as one continuous line, and that is
 * the design: node `192:14726` fades to nothing at both ends over a 180px
 * segment, so the 52px between blocks is meant to be empty rather than
 * crossed.
 *
 * The whole gutter is `aria-hidden`. It is an ornament for the eye — the list
 * already announces three items in order, and dots read aloud add nothing.
 */
export function CertificationLadder() {
  return (
    <ol className="flex list-none flex-col gap-13">
      {COACHING_LEVELS.map((level, i) => (
        <li key={level.id} className="flex gap-4 lg:gap-[1.04vw]">
          <div
            aria-hidden
            className="flex w-11 shrink-0 flex-col items-center lg:w-[6.04vw]"
          >
            {/* A 12px dot inside Figma's 16px padding (`192:14806`). */}
            <span className="my-4 block size-3 shrink-0 rounded-full bg-white" />

            {/* The dashed rule: 2px wide, 8-on/4-off, in the same grey
                About's heritage axis uses. Drawn as a repeating gradient with
                a soft mask rather than `border-left: dashed`, because a
                border cannot fade — and the fade at both ends is what keeps
                the segment from looking like a cut piece of string.

                `flex-1` is what makes the axis content-driven: the rule takes
                whatever height the block beside it turned out to need. */}
            <span className="w-0.5 flex-1 bg-[repeating-linear-gradient(to_bottom,var(--color-timeline-rule)_0_8px,transparent_8px_12px)] [mask-image:linear-gradient(to_bottom,transparent_0%,black_19%,black_80%,transparent_100%)]" />
          </div>

          <Reveal y={32} delay={STAGGER * i} className="flex-1">
            <div className="flex flex-col gap-4 lg:gap-5">
              <div className="flex flex-col gap-1">
                {/* Bebas 32/40 in flat gold — a marker, not a heading, which
                    is why it is not the `<h4>` and not the gradient the
                    section titles carry. */}
                <p className="font-display text-[length:var(--text-display-caption)] leading-[1.25] text-[var(--color-gold)]">
                  {level.marker}
                </p>
                <h4 className="font-sans text-[length:var(--text-heading-card)] leading-[1.2] font-semibold text-white">
                  {level.title}
                </h4>
              </div>

              {/* 40% white in Figma. Dimmer than the grade descriptions
                  opposite (60%) and deliberately so — that column is a
                  reference table and this one is a description of what the
                  level covers. */}
              <p className="font-sans text-[length:var(--text-body-sm)] leading-[1.5] text-white/40">
                {level.body}
              </p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  )
}
