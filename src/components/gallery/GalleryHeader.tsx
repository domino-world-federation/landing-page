import { GallerySearch } from "@/components/gallery/GallerySearch"
import { SharpeningHeadline } from "@/components/motion/SharpeningHeadline"
import { GALLERY_COPY } from "@/content/gallery"
import { formatShortDate } from "@/lib/utils/date"

/**
 * The gallery header band — Figma node `156:7155`.
 *
 * The site's band again, carrying both variants at once: the date beside the
 * title that the legal screens have, and the search field that the news header
 * has. It is the only header in the file with both.
 *
 * No "Back" link, unlike the terms header — the legal screens are documents a
 * reader arrives at from somewhere, and this is a section of the site.
 *
 * Server Component; only the headline and the search form are client, and both
 * are their own components so the boundary sits as deep as it goes (RULES §5).
 */
export function GalleryHeader() {
  return (
    <section className="flex min-h-[420px] flex-col justify-end gap-10 px-5 pt-32 pb-14 md:px-10 lg:min-h-[27.6vw] lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:px-20 lg:pb-[5.2vw]">
      {/* `items-end` with a 48px gap: the date sits on the title's baseline
          rather than under it (`156:7156`). */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-12">
        <h1 className="font-sans text-[length:var(--text-page-title)] leading-[1.1] font-medium text-white">
          <SharpeningHeadline lines={GALLERY_COPY.title} />
        </h1>

        <time
          dateTime={GALLERY_COPY.updatedAt}
          className="font-sans text-[length:var(--text-body-sm)] leading-8 font-medium text-[#aaaaaa]"
        >
          {GALLERY_COPY.updatedLabel.replace(
            "%s",
            formatShortDate(GALLERY_COPY.updatedAt),
          )}
        </time>
      </div>

      <GallerySearch />
    </section>
  )
}
