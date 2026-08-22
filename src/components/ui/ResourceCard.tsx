import { RESOURCES_COPY } from "@/content/resources"
import type { ResourceDocument } from "@/lib/api/types"

/**
 * One document of the S10 library — node `56:4575` and its three siblings.
 *
 * A white 20px-radius card holding two things: the document's category and
 * title on the left, and a bordered pill on the right naming the file and its
 * size.
 *
 * Figma aligns both to the card's BOTTOM (`alignItems: flex-end`), which is
 * what keeps the pills on one line across cards whose titles run to different
 * numbers of lines. That works there because a Figma card hugs its content.
 * Here the cards are also equal-height (the grid's `auto-rows-fr`), and
 * bottom-aligning inside a STRETCHED card is not the same thing: it drops the
 * text away from the top edge and opens a gap above it. Measured on
 * "Anti-Doping Policy", whose one-line title sits beside a two-line neighbour —
 * its text hung at the card's foot under ~40px of white.
 *
 * So the two are separated: the text column is top-aligned (`items-start` —
 * where it sits in Figma once a card hugs) and only the pill is pushed down,
 * by `self-end` on itself. Both cards then read the same way regardless of how
 * many lines their titles take.
 *
 * Below `sm` the pill moves BELOW the text instead of beside it. The pill is a
 * fixed 160px because its label is one unbreakable line, so on a 350px card it
 * claims 46% of the width and leaves the title a ~150px column — measured, the
 * titles ran to three lines there against the design's two, in a narrow ragged
 * stack. Stacked, the title gets the whole card width and falls back to two.
 *
 * The whole card is the download. Figma draws the pill as the affordance, but
 * it is a 160px target on a 560px card — so the pill stays as the visual cue
 * and the anchor is stretched over the card behind it (`after:absolute
 * after:inset-0`), giving the full card as the hit area while announcing once.
 */
export function ResourceCard({ doc }: { doc: ResourceDocument }) {
  return (
    <article className="group relative flex flex-col items-start justify-between gap-4 rounded-[var(--radius-card)] bg-white px-5 py-4 text-black sm:flex-row">
      <div className="flex flex-col gap-2">
        <p className="font-sans text-base leading-6 font-medium text-[var(--color-silver-mid)] lg:text-xl lg:leading-7">
          {doc.category}
        </p>
        {/* Bebas 36/44 in Figma. The design writes each title over two lines
            with a hard break; that break is not reproduced — the column is
            proportional, so the title wraps at the same place on its own, and
            a baked-in newline would land mid-phrase under translation. */}
        <h3 className="font-display text-[length:var(--text-resource-title)] leading-[1.22] text-black uppercase">
          {/* The stretched link: `after` covers the card, so the anchor is the
              whole tile while the accessible name stays the document title. */}
          <a
            href={doc.fileUrl}
            aria-label={RESOURCES_COPY.downloadLabel.replace("%s", doc.title)}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {doc.title}
          </a>
        </h3>
      </div>

      {/* Node `56:4570`: a 160px pill, 1px `#E0E0E0` border, 8px radius, the
          file label at one end and a 24px icon box at the other.

          Decorative and `aria-hidden`: the stretched anchor already announces
          the card and carries the title, and a second focusable control
          pointing at the same file would give every card two tab stops. The
          focus ring is driven by the link through `group-focus-within`, so the
          pill still shows where the keyboard is.

          `shrink-0` because the pill is a fixed 160px in Figma and its label is
          a single unbreakable line — without it a long title squeezes the pill
          until "PDF (2.4 MB)" wraps inside its own border. */}
      <div
        aria-hidden
        className="pointer-events-none flex w-40 shrink-0 items-center justify-between self-start sm:self-end rounded-[var(--radius-btn)] border border-[var(--color-border-light)] p-2 transition-colors duration-200 group-hover:border-[var(--color-silver-mid)] group-focus-within:ring-2 group-focus-within:ring-black"
      >
        <span className="font-sans text-sm leading-6 font-medium text-[#8F8F8F] uppercase lg:text-base">
          {doc.fileType} ({doc.fileSize})
        </span>
        <span className="flex size-6 items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- a 16px inline
              SVG sized in CSS; next/image would add a layout wrapper for no
              gain. Drawn in `#1A1C1D` for use on the card's white ground, so
              unlike S8's arrow it needs no `invert`. */}
          <img
            src="/assets/home/icon-download.svg"
            alt=""
            width={16}
            height={16}
            className="size-4 transition-transform duration-200 group-hover:translate-y-0.5"
          />
        </span>
      </div>
    </article>
  )
}
