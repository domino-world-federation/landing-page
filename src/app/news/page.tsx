import type { Metadata } from "next"

import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { FeaturedBand } from "@/components/news/FeaturedBand"
import { MediaGallery } from "@/components/news/MediaGallery"
import { NewsArchive } from "@/components/news/NewsArchive"
import { NewsHeader } from "@/components/news/NewsHeader"
import { PressReleases } from "@/components/news/PressReleases"
import { Publications } from "@/components/news/Publications"

export const metadata: Metadata = {
  title: "News | Domino World Federation",
  description:
    "Federation news, press releases and publications — tournament results, governance decisions, development programmes, and the media archive.",
}

/**
 * `/news` — Figma screen `156:7512`.
 *
 * Six blocks, and the hi-fi draws all of them. The wireframe (`156:6782`) names
 * seven: the one missing here is "Newsletter Subscription", which the site's
 * footer has carried since S14 — building a second subscribe box on the one
 * page that already ends with one would be duplicating the control, not
 * completing the design.
 *
 * Same shell as About, Domino and Development: a header band under the `fixed`
 * navbar, then the page's sections, then the footer outside `<main>` as its own
 * landmark. No `PageShine` — the design has none here, unlike Development. No
 * `Join`: that is a landing-page section.
 *
 * **The archive is filtered by the URL.** `?category=` is read here and passed
 * down, so the section stays a Server Component and a filtered archive is a
 * link somebody can send (see `NewsArchive`). It once carried a `?show=` as
 * well; that went when `/news/all` was built, which is where "View more" now
 * leads.
 */
export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  return (
    // `relative` anchors the navbar, which is `fixed` and overlays the page.
    <div className="relative">
      <Navbar />

      <main>
        <NewsHeader />
        <FeaturedBand />
        <NewsArchive category={category} />
        <PressReleases />
        <Publications />
        <MediaGallery />
      </main>

      {/* Outside `<main>`: the footer is a landmark of its own, as on the
          other four pages. */}
      <Footer />
    </div>
  )
}
