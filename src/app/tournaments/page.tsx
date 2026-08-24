import type { Metadata } from "next"

import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { MediaGallery } from "@/components/news/MediaGallery"
import { ChampionsHall } from "@/components/tournaments/ChampionsHall"
import { HighlightedTournament } from "@/components/tournaments/HighlightedTournament"
import { OlympicResults } from "@/components/tournaments/OlympicResults"
import { TournamentFaq } from "@/components/tournaments/TournamentFaq"
import { TournamentHero } from "@/components/tournaments/TournamentHero"
import { TournamentRail } from "@/components/tournaments/TournamentRail"
import { TournamentRegulations } from "@/components/tournaments/TournamentRegulations"
import { TOURNAMENTS_COPY } from "@/content/tournaments"
import { getHighlightedTournament } from "@/lib/api/client"

export const metadata: Metadata = {
  title: "Tournaments | Domino World Federation",
  description:
    "Sanctioned domino tournaments — the season's highlighted event, the full calendar, competition regulations, past champions and Olympic results.",
}

/**
 * `/tournaments` — Figma screen `366:17181`.
 *
 * The twelfth page, and the first drawn only in the `(NEW)` Figma file (D59):
 * until it arrived, "Tournaments" was one of the four navbar items pointing at
 * `#`. It is now a real destination, and the footer's entry follows it.
 *
 * Nine blocks, in the design's order: the hero, the highlighted tournament, the
 * rail of all tournaments, the regulations shelf, Champions Hall, the media
 * gallery, the Olympic results table, the FAQ, and the footer.
 *
 * **Two blocks are other pages' components, unchanged in substance.** The media
 * collage is the news page's `MediaGallery` — the same picture desk reading the
 * same endpoint — with a prop for the heading's colour; the regulations shelf
 * is built on `ui/DocumentCard`, which the news press shelf drew first. Both
 * moved on their second user, never on the guess that there would be one
 * (D32/D43).
 *
 * **The hero and the highlighted band print one record**, `getHighlightedTournament()`.
 * Figma names the event twice with two different years; a page that contradicts
 * itself about which tournament it is opening with is a defect rather than a
 * variation.
 *
 * Same shell as the other eleven: navbar `fixed` over the page, content in
 * `<main>`, footer outside it as its own landmark. Champions Hall ships without
 * portraits — see the component, and R16.
 */
export default async function TournamentsPage() {
  const highlighted = await getHighlightedTournament()

  return (
    // `relative` anchors the navbar, which is `fixed` and overlays the page.
    <div className="relative">
      <Navbar />

      <main>
        {/* The two event blocks are absent rather than empty when the feed has
            nothing highlighted: a hero with no tournament in it is a band of
            gradient, and the page still has eight blocks that stand alone. */}
        {highlighted ? (
          <>
            <TournamentHero event={highlighted} />
            <HighlightedTournament event={highlighted} />
          </>
        ) : (
          // The page still needs a name when its `<h1>` is the hero's.
          <h1 className="sr-only">{TOURNAMENTS_COPY.pageTitle}</h1>
        )}

        <TournamentRail />
        <TournamentRegulations />
        <ChampionsHall />
        <MediaGallery headingTone="gold" />
        <OlympicResults />
        <TournamentFaq />
      </main>

      <Footer />
    </div>
  )
}
