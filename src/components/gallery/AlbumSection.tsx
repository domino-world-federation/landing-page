import Image from "next/image"

import { GalleryTile } from "@/components/gallery/GalleryTile"
import { GALLERY_COPY } from "@/content/gallery"
import type { GalleryAlbum } from "@/lib/api/types"
import { formatLongDate } from "@/lib/utils/date"

/**
 * One event's pictures — Figma node `156:7235` and its three siblings.
 *
 * A date, a Bebas heading with an arrow beside it, then the album itself. The
 * album takes one of two shapes and neither is a field in the data: several
 * pictures make a collage, and exactly one is that picture at full width
 * (`156:7330`). Derived from the count, because a layout name in the API would
 * be the backend deciding how a page looks.
 *
 * The arrow and the round badge over the second tile both open the album, and
 * both are hidden once the page is already filtered to it — a link to the page
 * you are standing on is the silent no-op D28 ruled out.
 *
 * Server Component.
 */
export function AlbumSection({
  album,
  /** False once `?event=` has narrowed the page to this album. */
  showOpen,
}: {
  album: GalleryAlbum
  showOpen: boolean
}) {
  const headingId = `album-${album.slug}`
  const href = `/gallery?event=${album.slug}`
  const openLabel = GALLERY_COPY.openAlbum.replace("%s", album.title)
  const isFeature = album.items.length === 1

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-6 lg:gap-10">
      <div className="flex flex-col gap-4">
        {/* Inter Medium 24/32 in `#616161` (`156:7237`). */}
        <time
          dateTime={album.heldOn}
          className="font-sans text-muted text-[length:var(--text-body-sm)] leading-8 font-medium"
        >
          {formatLongDate(album.heldOn)}
        </time>

        <div className="flex flex-wrap items-center gap-4 lg:gap-8">
          {/* Bebas 76/72. `uppercase` is the heading's, not the string's
              (D40) — Figma types three of the four in lower case. */}
          <h2
            id={headingId}
            className="font-display text-[length:var(--text-display-sm)] leading-[0.95] text-white uppercase"
          >
            {album.title}
          </h2>

          {showOpen && (
            <a
              href={href}
              aria-label={openLabel}
              className="focus-visible:ring-gold group flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-btn)] focus-visible:ring-2 focus-visible:outline-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- a 48px
                  inline SVG sized in CSS. The shared glyph points LEFT; +135°
                  turns it up-and-right. `invert` because it is drawn dark for
                  use on white. */}
              <img
                src="/assets/global/icon-arrow-left.svg"
                alt=""
                width={48}
                height={48}
                className="size-12 rotate-135 invert transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
          )}
        </div>
      </div>

      {isFeature ? (
        // `156:7330` — 1292 × 726, the only album drawn as one picture.
        <div className="relative aspect-[1292/726] w-full overflow-hidden rounded-[var(--radius-glass)]">
          <Image
            src={album.items[0].imageUrl}
            alt={album.items[0].imageAlt}
            fill
            sizes="(min-width: 1024px) 68vw, 100vw"
            className="object-cover"
          />
          {/* The play disc, on the same terms as a collage tile's: decoration,
              because there is nothing to play (B2). */}
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white lg:size-24"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- an inline
                SVG sized in CSS, on a white disc, so no `invert`. */}
            <img
              src="/assets/news/icon-play.svg"
              alt=""
              width={47}
              height={47}
              className="size-6 translate-x-0.5 lg:size-12"
            />
          </span>
          <p className="sr-only">
            {GALLERY_COPY.videoLabel.replace("%s", album.items[0].title)}
          </p>
        </div>
      ) : (
        // Four columns, two rows, 16px gutters (`156:7243`). A video tile spans
        // both rows, and the remaining photographs fall into the gaps by plain
        // auto-placement — which reproduces Figma's arrangement exactly, so no
        // cell is positioned by hand.
        //
        // The design's collage is 1648 wide against the 1452 its column allows,
        // so at 1920 it runs off the right edge. NOT reproduced: bleeding a
        // GRID leaves its fourth column permanently half-hidden, unlike the
        // news page's strip which can be pushed. The grid fits the column
        // instead — the composition, the gutters and the row height are the
        // design's, and only the column width flexes, which is what a
        // responsive grid does anyway.
        //
        // 292/1920 = 15.2vw is the design's row height; the floor keeps a tile
        // a picture rather than a stripe on a phone.
        // A plain grid of figures rather than a `<ul>`: each tile would have
        // to be a `<li display:contents>` for the figure inside it to be the
        // grid item, and `display:contents` has a long history of dropping list
        // semantics from the accessibility tree. A figure with alt text
        // describes itself; the list adds nothing here.
        <div className="grid grid-cols-2 gap-4 [grid-auto-rows:clamp(7rem,15.2vw,292px)] lg:grid-cols-4">
          {album.items.map((item, index) => (
            <GalleryTile
              key={item.id}
              item={item}
              // Figma draws the badge once, on the second tile of the first
              // album (`156:7263`). The other two collages are pastes that
              // dropped it along with their titles and dates, so it is drawn
              // for every album rather than for one.
              more={
                showOpen && index === 1 ? { href, label: openLabel } : undefined
              }
            />
          ))}
        </div>
      )}
    </section>
  )
}
