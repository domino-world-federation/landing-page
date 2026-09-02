<script setup lang="ts">
import type { GalleryItem } from "~/lib/api/types"
import { getChampions } from "~/lib/api/client"
import { TOURNAMENTS_COPY } from "~/content/tournaments"

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
 * and a real name under a real face states that a particular living person won a
 * title that does not exist. R16 carries both halves, and closes when real
 * champions and portraits the federation may publish arrive.
 *
 * `Champion.portraitUrl` is optional all the same, and the card renders either
 * way: a record without one falls back to the gold panel the file itself uses
 * for an artwork placeholder (`371:17267` and its siblings, three of which sit
 * loose beside this screen).
 *
 * **It was removed and is back, on the repo owner's call.** It came out because
 * of R16: the design fills four cards with photographs of real, identifiable
 * public figures and types their real names underneath as champions of a
 * federation whose titles do not exist. Executive Boards took its place because
 * a board makes no such claim.
 *
 * What makes it safe to return is that the DATA no longer makes the claim
 * either. `MOCK_CHAMPIONS` carries invented names, and its `portraitAlt` strings
 * describe what is visible without naming a person, a country or an event — the
 * practice R13 established for the news photographs. Executive Boards stays
 * where it is; this is an addition rather than a swap back.
 */
const { data: champions } = await useAsyncData(
  "tournaments-champions",
  () => getChampions(),
  { default: () => [] },
)

/**
 * The champions as the viewer's own record type. A mapping rather than a second
 * dialog: `GalleryItem` is what `NewsMediaLightbox` reads, and a `Champion` is
 * the same three things under different names.
 *
 * `title` is what the viewer prints under the picture, so it takes the name with
 * the design's line break flattened — the break belongs to the card's caption,
 * not to a caption on one line.
 */
const viewerItems = computed<GalleryItem[]>(() =>
  champions.value.map((champion) => ({
    id: champion.id,
    title: champion.name.replace(/\n/g, " "),
    imageUrl: champion.portraitUrl ?? "",
    imageAlt: champion.portraitAlt ?? "",
    kind: "photo" as const,
  })),
)

const viewerOpen = ref(false)
const viewerIndex = ref(0)

function openViewer(index: number) {
  viewerIndex.value = index
  viewerOpen.value = true
}
</script>

<template>
  <section
    v-if="champions.length > 0"
    aria-labelledby="champions-heading"
    class="bg-bg flex snap-screen flex-col justify-center px-5 pt-28 pb-16 md:px-10 lg:px-20 lg:pt-[max(var(--nav-clearance),7.29vw)] lg:pb-[4.17vw]"
  >
    <!-- The heading goes INSIDE the rail rather than above it, which is what
         puts it on the arrows' line: `CardRail` draws a header row and takes the
         title in a slot, and a heading left outside it becomes a band of its own
         with the arrows stranded on a second row. Same arrangement
         `TournamentsRail` uses two sections up. -->
    <TournamentsCardRail :label="TOURNAMENTS_COPY.champions.label">
      <template #heading>
        <!-- The page's statement heading: Bebas 100/108 under the gold sweep,
             the same as Regulations, Media Gallery and Olympic Results around
             it. The design draws this one flat white (`381:17635`), and the repo
             owner asked for one format across the page — a single odd fill among
             five gold titles reads as an oversight rather than as a distinction.

             `w-fit` comes with the gold and is not decoration: the sweep is
             `bg-clip-text`, and a background is painted across the ELEMENT's box
             before it is clipped to the glyphs, so a block-level heading takes
             the whole column and the words get the flat middle of the
             gradient. -->
        <h2
          id="champions-heading"
          class="font-display w-fit text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
        >
          {{ TOURNAMENTS_COPY.champions.heading }}
        </h2>
      </template>

      <TournamentsChampionCard
        v-for="(champion, i) in champions"
        :key="champion.id"
        :champion="champion"
        @open="openViewer(i)"
      />
    </TournamentsCardRail>

    <!-- The gallery's own viewer, not a second one. `NewsMediaLightbox` already
         holds a native `<dialog>`, the focus trap, the arrows, the counter and
         the Escape handling; what it wants is a list of pictures, so the
         champions are mapped to that shape rather than the dialog being rebuilt
         around a different record.

         `kind: "photo"` because a champion's card is one — the viewer draws a
         play affordance for videos, and there are none here. -->
    <NewsMediaLightbox
      v-model:open="viewerOpen"
      v-model:index="viewerIndex"
      :items="viewerItems"
    />
  </section>
</template>
