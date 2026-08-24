import Image from "next/image"

import { CardRail } from "@/components/tournaments/CardRail"
import { TOURNAMENTS_COPY } from "@/content/tournaments"
import { getChampions } from "@/lib/api/client"
import type { Champion } from "@/lib/api/types"

/**
 * Champions Hall — Figma node `381:17633`.
 *
 * Four 540 × 700 cards on the page's own rail, each a portrait with the event
 * over the winner's name in a fall to black.
 *
 * **The photographs are the design's; the names are not.** Figma fills these
 * cards with pictures of real, identifiable public figures and types their real
 * names underneath as champions of this federation. The pictures go in on the
 * repo owner's decision — this is a prototype, and the design's assets go in as
 * drawn — while the names stay placeholders: every card is an identity claim,
 * and a real name under a real face states that a particular living person won
 * a title that does not exist. R16 carries both halves, and closes when real
 * champions and portraits the federation may publish arrive.
 *
 * `Champion.portraitUrl` is optional all the same, and the card renders either
 * way: a record without one falls back to the gold panel the file itself uses
 * for an artwork placeholder (`371:17267` and its siblings, three of which sit
 * loose beside this screen).
 *
 * Server Component; only the rail's scroll position is client.
 */
export async function ChampionsHall() {
  const champions = await getChampions()

  if (champions.length === 0) return null

  return (
    <section
      aria-labelledby="champions-heading"
      className="bg-bg px-5 py-16 md:px-10 lg:px-20 lg:py-[4.17vw]"
    >
      <div className="flex flex-col gap-10 lg:gap-[3.33vw]">
        {/* Bebas 76/72 in white — no gold here, unlike the rail above it
            (`381:17635`). */}
        <h2
          id="champions-heading"
          className="font-display text-[length:var(--text-display-sm)] leading-[0.95] text-white uppercase"
        >
          {TOURNAMENTS_COPY.champions.heading}
        </h2>

        <CardRail label={TOURNAMENTS_COPY.champions.label}>
          {champions.map((champion) => (
            <ChampionCard key={champion.id} champion={champion} />
          ))}
        </CardRail>
      </div>
    </section>
  )
}

/** One card — `381:17645`. */
function ChampionCard({ champion }: { champion: Champion }) {
  return (
    <figure className="relative flex aspect-[540/700] w-[min(80vw,540px)] shrink-0 snap-start items-end overflow-hidden rounded-[var(--radius-card)] bg-[radial-gradient(circle_at_117%_-2%,#c3ae86_0%,#4f4332_100%)]">
      {champion.portraitUrl && (
        <Image
          src={champion.portraitUrl}
          alt={champion.portraitAlt ?? ""}
          fill
          sizes="(max-width: 768px) 80vw, 540px"
          className="object-cover"
        />
      )}

      {/* The caption's own fall to black (`381:17647`), 47% of the card tall in
          the design. Written as a share of the card rather than Figma's 331px
          so it stays the same depth under the name at every rail width (D19). */}
      <figcaption className="relative flex w-full flex-col gap-2 bg-linear-to-b from-transparent via-black/70 to-black px-6 pt-[6.5rem] pb-6">
        {/* Inter Regular 20/28 in capitals at 70% (`381:17648`). */}
        <p className="font-sans text-[length:var(--text-eyebrow)] leading-7 text-white/70 uppercase">
          {champion.event}
        </p>

        {/* Inter Regular 48/56 (`381:17649`). The design breaks the name across
            two lines; rendered as blocks rather than with a `<br>`, so the
            words stay separate strings for translation — the call
            `SupportCard` and `BoardCard` already make. */}
        <p className="font-sans text-[length:var(--text-body-xl)] leading-[1.1667] text-white">
          {champion.name.split("\n").map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </figcaption>
    </figure>
  )
}
