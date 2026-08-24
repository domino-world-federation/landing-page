import { REGULATIONS_COPY } from "@/content/domino/regulations"
import type { ResourceDocument } from "@/lib/api/types"

/**
 * The rulebook panel — wireframe `119:4583`.
 *
 * A black panel padded 48 all round: a download glyph, the document's title, its
 * description, and an outlined button across the foot. The wireframe draws it
 * black on its own light ground; here the page is already dark, so the panel
 * takes the white hairline it needs to separate from the background — the
 * chrome is extrapolated (the wireframe is greyscale), the structure is not.
 *
 * **The whole card is the download.** The button is the affordance the design
 * draws, but it is one strip of a tall panel; the anchor is stretched over the
 * card behind it (`after:absolute after:inset-0`) so the hit area is the whole
 * thing while it is still announced once. The same treatment `ResourceCard`
 * uses, and for the same reason.
 *
 * Everything but the verb comes from the document: the title, the file type and
 * the size are the API's, so a rulebook that goes to v5 or gains a megabyte
 * needs no edit here (RULES §8).
 *
 * Server Component.
 */
export function RulebookCard({ doc }: { doc: ResourceDocument }) {
  // The design writes "DOWNLOAD PDF (4.2 MB)". `fileSize` is optional on
  // `ResourceDocument`, and a document without one would otherwise render
  // "DOWNLOAD PDF ()" — an empty bracket that looks like a bug rather than like
  // a size nobody supplied.
  const cta = doc.fileSize
    ? REGULATIONS_COPY.downloadCta
        .replace("%t", doc.fileType)
        .replace("%s", doc.fileSize)
    : REGULATIONS_COPY.downloadCtaNoSize.replace("%t", doc.fileType)

  return (
    <article className="group relative flex h-full flex-col gap-4 rounded-[var(--radius-card)] border border-white/12 bg-black p-8 lg:p-[2.5vw]">
      {/* eslint-disable-next-line @next/next/no-img-element -- a 30px inline
          SVG sized in CSS; next/image would add a layout wrapper for no gain.
          Drawn in `#1A1C1D` for light grounds, so `invert` turns it white for
          this one — the same trick S8's arrow uses. */}
      <img
        src="/assets/global/icon-download.svg"
        alt=""
        width={30}
        height={30}
        className="size-[30px] shrink-0 invert transition-transform duration-200 group-hover:translate-y-0.5"
      />

      {/* Bebas rather than the wireframe's 16px Inter caps. The wireframe types
          every heading at 16 because it is a wireframe; on this site a card
          title at that size is a label. `--text-display-label` is 36, the step
          the Sub-Committees cards take for the same job. */}
      <h3 className="font-display text-[length:var(--text-display-label)] leading-[1.22] text-white uppercase">
        {/* The stretched link. Its accessible name is the document title rather
            than the button's label, so a reader tabbing through hears which
            rulebook it is — "Download PDF (4.2 MB)" alone names no document. */}
        <a
          href={doc.fileUrl}
          aria-label={REGULATIONS_COPY.downloadLabel.replace("%s", doc.title)}
          className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
        >
          {doc.title}
        </a>
      </h3>

      {doc.description && (
        <p className="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/80">
          {doc.description}
        </p>
      )}

      {/* `mt-auto` pins the button to the foot however tall the panel grows —
          the wireframe puts it at the bottom of a fixed 365px cell, and this is
          that placement without the fixed height. The `pt-4` is `119:4590`,
          which spends 16px above the button on top of the panel's own 16px
          gap; the wrapper exists to carry it, because putting it on the button
          would grow the button rather than the space above it.

          `aria-hidden`, and not a control: the stretched anchor above already
          points at this file, and a second focusable element for the same
          download would give the card two tab stops. The focus ring is driven
          from the link through `group-focus-within`, so the keyboard is still
          visible. */}
      <div aria-hidden className="pointer-events-none mt-auto pt-4">
        <div className="font-display group-focus-within:ring-gold flex items-center justify-center rounded-[var(--radius-btn)] border border-white px-5 py-2 text-center text-[length:var(--text-display-btn)] leading-10 text-white uppercase transition-colors group-hover:bg-white/12 group-focus-within:ring-2">
          {cta}
        </div>
      </div>
    </article>
  )
}
