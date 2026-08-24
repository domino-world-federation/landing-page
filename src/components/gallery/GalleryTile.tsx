import Image from "next/image"

import { GALLERY_COPY } from "@/content/gallery"
import type { GalleryItem } from "@/lib/api/types"

/**
 * One picture in a collage — Figma nodes `156:7244` (a video column) and
 * `156:7261` (a photograph).
 *
 * A video takes both rows of the grid and carries a 96px play disc; a
 * photograph takes one. **The play badge is decoration** — there is nothing to
 * play (B2), so the tile is a `<figure>` rather than a control, because a play
 * button that does nothing is the silent no-op D28 ruled out. The caption tells
 * a screen reader the tile stands for a video without promising it a button.
 *
 * `more` marks the one tile Figma overlays with a round arrow (`156:7263`) —
 * the affordance that opens the album.
 */
export function GalleryTile({
  item,
  more,
}: {
  item: GalleryItem
  /** The album this tile's "more" badge opens, when it carries one. */
  more?: { href: string; label: string }
}) {
  const isVideo = item.kind === "video"

  return (
    <figure
      className={`group relative overflow-hidden rounded-[var(--radius-glass)] ${
        // A video column spans both rows — that is what makes the collage
        // alternate tall and short down the row rather than being a plain grid.
        isVideo ? "row-span-2" : ""
      }`}
    >
      <Image
        src={item.imageUrl}
        alt={item.imageAlt}
        fill
        sizes="(min-width: 1024px) 25vw, 50vw"
        className="object-cover"
      />

      {isVideo && (
        <>
          {/* `156:7246`: a 96px white disc dead centre with a 47px play glyph
              inside it. Hidden from assistive tech — the caption below says
              what it means, and this is not something that can be pressed. */}
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white lg:size-24"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- an inline
                SVG sized in CSS. Drawn in `#0E0E0E`, and this sits on the white
                disc, so no `invert`. */}
            <img
              src="/assets/news/icon-play.svg"
              alt=""
              width={47}
              height={47}
              className="size-6 translate-x-0.5 lg:size-12"
            />
          </span>

          <figcaption className="sr-only">
            {GALLERY_COPY.videoLabel.replace("%s", item.title)}
          </figcaption>
        </>
      )}

      {/* `156:7263`: a 72px white disc with a 36px arrow, offset centre. Unlike
          the play badge this one IS a control — it opens the album — so it is a
          real link with a name, not decoration. */}
      {more && (
        <a
          href={more.href}
          aria-label={more.label}
          className="focus-visible:ring-gold absolute top-1/2 left-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white transition-transform duration-200 group-hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none lg:size-18"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- an inline
              SVG sized in CSS. The shared glyph points LEFT; +135° turns it
              up-and-right, the "opens something" arrow. Drawn dark already,
              and this sits on the white disc. */}
          <img
            src="/assets/global/icon-arrow-left.svg"
            alt=""
            width={36}
            height={36}
            className="size-5 rotate-135 lg:size-9"
          />
        </a>
      )}
    </figure>
  )
}
