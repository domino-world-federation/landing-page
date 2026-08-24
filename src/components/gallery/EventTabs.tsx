import { SideTab, SideTabList } from "@/components/ui/SideTabs"
import { GALLERY_COPY } from "@/content/gallery"
import type { GalleryAlbum } from "@/lib/api/types"

/**
 * The event column — Figma node `173:10082`.
 *
 * The terms contents column's rows (`ui/SideTabs`, D32/D43) doing a different
 * job: these are not positions within the page but filters over it, so each is
 * a link to `?event=` and the page re-renders on the server with one album
 * instead of four.
 *
 * That is D50's call from the news archive applied again, and for the same
 * three reasons: the section stays a Server Component (RULES §5), a filtered
 * gallery becomes a URL somebody can send, and the filtering happens where
 * RULES §8 wants it rather than in a client island sifting the whole archive.
 *
 * The tabs are the albums themselves rather than a written list. Figma names
 * five (`156:7220` and its siblings) and they are the four albums plus "All
 * Events" — but a written list would print a tab for an event whose pictures
 * have been unfiled, and hide one whose pictures have just arrived.
 *
 * Server Component.
 */
export function EventTabs({
  albums,
  active,
}: {
  albums: GalleryAlbum[]
  /** The `?event=` slug, or `undefined` for "All Events". */
  active?: string
}) {
  return (
    // No heading above the list: Figma gives this column none, unlike the terms
    // contents with its "Table of Contents" line.
    <SideTabList label={GALLERY_COPY.filterLabel}>
      <SideTab href="/gallery" active={active === undefined}>
        {GALLERY_COPY.allTab}
      </SideTab>

      {albums.map((album) => (
        <SideTab
          key={album.id}
          href={`/gallery?event=${album.slug}`}
          active={active === album.slug}
        >
          {album.title}
        </SideTab>
      ))}
    </SideTabList>
  )
}
