import type { Metadata } from "next"

import { AlbumSection } from "@/components/gallery/AlbumSection"
import { EventTabs } from "@/components/gallery/EventTabs"
import { GalleryHeader } from "@/components/gallery/GalleryHeader"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { SupportCard } from "@/components/ui/SupportCard"
import { GALLERY_COPY } from "@/content/gallery"
import { getGalleryAlbums } from "@/lib/api/client"

export const metadata: Metadata = {
  title: "Gallery | Domino World Federation",
  description:
    "Photographs and films from Domino World Federation events — world championships, continental masters, and the federation's own documentaries.",
}

/**
 * `/gallery` — Figma screen `156:7154`.
 *
 * The eighth page, and the second to be built on the side-tab shell the legal
 * screens use — which is what finally moved two pieces out of
 * `components/terms/`: the "Need Support?" card and the tab rows themselves are
 * identical in both designs, so they are now `ui/SupportCard` and
 * `ui/SideTabs` (D32/D43 — a component moves on its second user, never on the
 * guess that there will be one).
 *
 * **The event filter is links, not state**, exactly as the news archive's
 * category tabs are (D50): each tab is an `<a>` to `?event=`, `getGalleryAlbums`
 * filters on the server, the whole page stays a Server Component, and a
 * filtered gallery is a URL somebody can send. That is also why this route
 * renders dynamically (`ƒ`) rather than prerendering, as `/news` does.
 *
 * Same shell as the other seven: header band under the `fixed` navbar, content,
 * footer outside `<main>` as its own landmark. No `PageShine`, no `Join`.
 */
export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>
}) {
  const { event } = await searchParams

  // The tab column always lists every album — a filter that hides the way back
  // to the other events is a dead end — while the content column shows only
  // what was asked for.
  const albums = await getGalleryAlbums()
  const shown = await getGalleryAlbums(event)

  // `?event=` naming nothing real: the tabs are still listed, so the reader can
  // get out, and the column says plainly that there is nothing here rather than
  // rendering an empty page.
  const unknown = event !== undefined && shown.length === 0

  return (
    // `relative` anchors the navbar, which is `fixed` and overlays the page.
    <div className="relative">
      <Navbar />

      <main>
        <GalleryHeader />

        {/* 468 + 1452 at the design width. The event column comes SECOND in the
            source and is pulled back with `order` above `lg`, so a reader on a
            phone — and a screen reader on any width — meets the pictures before
            the index of them. */}
        <div className="flex flex-col gap-10 px-5 pb-16 md:px-10 lg:flex-row lg:items-start lg:gap-12 lg:px-20 lg:pb-24">
          <div className="flex flex-col gap-10 lg:order-first lg:w-[388px] lg:shrink-0">
            {/* Sticky so the event list stays reachable through an archive that
                is 4827px tall at the design width. `top` clears the navbar;
                `max-h` with its own scroll keeps the column usable on a short
                window. */}
            <div className="flex flex-col gap-10 lg:sticky lg:top-32 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto">
              <EventTabs albums={albums} active={event} />
              <SupportCard />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-16 lg:gap-24">
            {unknown ? (
              <p className="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60">
                {GALLERY_COPY.empty}
              </p>
            ) : (
              shown.map((album) => (
                <AlbumSection
                  key={album.id}
                  album={album}
                  // Nothing to open once the page IS the album: the arrow and
                  // the tile badge would both link to where the reader already
                  // is (D28).
                  showOpen={event === undefined}
                />
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
