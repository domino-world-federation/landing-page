<script setup lang="ts">
import type { TournamentVenue } from "~/lib/api/types"
import { TOURNAMENT_DETAIL_COPY } from "~/content/tournaments/detail"

/**
 * The venue map — Figma node `517:1987`.
 *
 * The design's block is a MAP, not a photograph of the building: `517:1988` is a
 * map screenshot, `517:1990` is the gold stem of a pin, and `517:1991` is the pin
 * card carrying the hall's name. So this draws a real one, and the pin card is
 * HTML over it — which also means the hall's name is real text a screen reader
 * can read, where the design's is baked into an image.
 *
 * **Tiles, not an iframe.** The first build embedded OpenStreetMap's own frame
 * and filtered it dark with `invert() hue-rotate()`. That works and it looks
 * like what it is: a light map turned inside out — green parkland comes out
 * maroon, water comes out brown, and OSM's zoom buttons and toolbar sit on top
 * of it. What the design draws is a map that was DESIGNED dark: near-black
 * ground, faint grey streets, quiet labels, no chrome. That is a basemap style,
 * not a filter, so the tiles come from one.
 *
 * **Esri's Dark Gray Canvas, after CARTO's turned out to cost money.** CARTO's
 * `dark_all` is the obvious style and it renders exactly this — but its keyless
 * tiles now come back stamped "API KEY REQUIRED" diagonally across every one of
 * them, which is a 200 response and a broken-looking map. Esri publishes the
 * same kind of style keyless, in two layers: the ground, and the labels over it.
 * Both are drawn here, one grid on top of the other.
 *
 * Esri numbers its tiles `/{z}/{row}/{col}` where the XYZ scheme everyone else
 * uses is `/{z}/{x}/{y}` — the last two are swapped. Getting that backwards
 * returns a valid tile of somewhere else entirely, which is why it is spelled
 * out at the call rather than left to a template string.
 *
 * **Static, and deliberately.** The alternative is Leaflet or MapLibre, which
 * buys panning and zooming for ~40KB of JavaScript and a hydration step. This
 * block answers "where is it" — the reader who wants to navigate wants a real
 * map application, not a 860×542 window onto one, and the pin card links
 * straight out to it. So the tiles are `<img>` elements in a grid: no
 * dependency, no client JS, and it renders during SSR like everything else on
 * the page.
 *
 * A venue without coordinates falls back to its photograph, so a hall the
 * federation has not geocoded still gets a block rather than an empty box.
 */
const props = defineProps<{ venue: TournamentVenue }>()

const COPY = TOURNAMENT_DETAIL_COPY.venue

/**
 * Street level, and one step closer than the first attempt.
 *
 * At 15 the frame reached Mt Salem and West Green — a district, with the hall's
 * own streets too small to read. The design's frame is the block: Union Street,
 * Market St, Church St, Dome St. That is 16.
 */
const ZOOM = 16
const TILE = 256

const ESRI = "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas"

/**
 * The design's frame, in tiles.
 *
 * 860 × 542 needs 4 × 3 tiles to cover, plus one of each so the grid still
 * reaches the edges once it is offset to centre the pin — a tile grid aligned to
 * the container leaves a gap on two sides at every position but one.
 */
const COLS = 5
const ROWS = 4

/**
 * Web Mercator, which is the projection every tile scheme on the web uses.
 *
 * Returned as FRACTIONAL tile coordinates rather than whole ones: the fraction
 * is what says where inside its tile the point falls, and that is what lets the
 * grid be offset so the pin lands exactly in the middle rather than somewhere in
 * the middle tile.
 */
function toTile(lat: number, lng: number, zoom: number) {
  const n = 2 ** zoom
  const rad = (lat * Math.PI) / 180

  return {
    x: ((lng + 180) / 360) * n,
    y:
      ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n,
  }
}

/**
 * The tiles to draw and where to put them.
 *
 * The container is a viewport onto the world at this zoom. The pin's pixel
 * position is its fractional tile times 256; the grid's top-left has to sit half
 * the container up and left of that, and the first tile is whichever one
 * contains that corner. The leftover — the corner's position inside that tile —
 * is the offset the whole grid is shifted by.
 */
const tiles = computed(() => {
  const at = props.venue.coordinates
  if (!at) return undefined

  const centre = toTile(at.lat, at.lng, ZOOM)
  const span = 2 ** ZOOM

  // Half the grid, in tiles, from the centre tile.
  const firstX = Math.floor(centre.x) - Math.floor(COLS / 2)
  const firstY = Math.floor(centre.y) - Math.floor(ROWS / 2)

  const rows: {
    key: string
    base: string
    labels: string
    left: number
    top: number
  }[] = []

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = firstX + col
      const y = firstY + row

      // Off the top or bottom of the world: there is no tile there, and asking
      // for one returns a 404 that renders as a broken image.
      if (y < 0 || y >= span) continue

      // Wrapped east-west, which the world does: at zoom 15 nothing this site
      // maps is near the antimeridian, but a tile index of -1 is a 404 and
      // wrapping costs one modulo.
      const wrapped = ((x % span) + span) % span

      rows.push({
        key: `${wrapped}-${y}`,
        base: `${ESRI}/World_Dark_Gray_Base/MapServer/tile/${ZOOM}/${y}/${wrapped}`,
        labels: `${ESRI}/World_Dark_Gray_Reference/MapServer/tile/${ZOOM}/${y}/${wrapped}`,
        left: (x - centre.x) * TILE,
        top: (y - centre.y) * TILE,
      })
    }
  }

  return rows
})

/** Where "open this in a real map" goes — the same place, at street zoom. */
const externalUrl = computed(() => {
  const at = props.venue.coordinates
  if (!at) return undefined
  return `https://www.openstreetmap.org/?mlat=${at.lat}&mlon=${at.lng}#map=16/${at.lat}/${at.lng}`
})
</script>

<template>
  <div
    class="relative aspect-[860/542] w-full overflow-hidden rounded-[var(--radius-card)] bg-[#0E0E0E]"
  >
    <template v-if="tiles">
      <!-- The tile grid. Positioned from the CENTRE of the box — `left-1/2` /
           `top-1/2` puts the origin on the pin, and each tile's own offset is
           its distance from the pin in pixels. That is what makes the marker
           land dead centre at any container size. -->
      <div aria-hidden class="absolute inset-0" :aria-label="COPY.label">
        <template v-for="tile in tiles" :key="tile.key">
          <img
            :src="tile.base"
            alt=""
            width="256"
            height="256"
            loading="lazy"
            decoding="async"
            class="absolute size-64 max-w-none [filter:brightness(0.5)_contrast(1.15)]"
            :style="{
              left: `calc(50% + ${tile.left}px)`,
              top: `calc(50% + ${tile.top}px)`,
            }"
          >
          <!-- The labels ride over the ground as a second transparent layer.
               Two requests per tile rather than one, which is what a style split
               this way costs; they are small, cached, and lazy. -->
          <img
            :src="tile.labels"
            alt=""
            width="256"
            height="256"
            loading="lazy"
            decoding="async"
            class="absolute size-64 max-w-none opacity-60"
            :style="{
              left: `calc(50% + ${tile.left}px)`,
              top: `calc(50% + ${tile.top}px)`,
            }"
          >
        </template>
      </div>

      <!-- The vignette. The design's map is darkest at its corners and edges and
           lifts towards the pin, so the card reads as a window with light in the
           middle rather than as a rectangle of map pasted onto the page. Two
           layers because they do different jobs: the radial darkens the corners,
           the linear takes the card's bottom edge away entirely, so the map runs out into the section under it rather than being cut off at a line. It matches the fade the prize photograph beside it carries (`517:1989`, `517:2006`).

           `pointer-events-none` — it covers the whole map, and the pin card sits
           above it. -->
      <span
        aria-hidden
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,14,14,0)_35%,rgba(14,14,14,0.4)_80%,rgba(14,14,14,0.85)_100%)]"
      />
      <span
        aria-hidden
        class="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-[linear-gradient(180deg,rgba(14,14,14,0)_0%,rgba(14,14,14,0.75)_62%,rgba(14,14,14,1)_100%)]"
      />

      <!-- The map is data somebody surveyed and a style somebody drew, and both
           licences ask to be named. It is a condition of use, so it stays — but
           it is set as quietly as a credit can be: no box, no background, 9px at
           25% in the corner. The design draws no attribution at all, which is
           not an option that was available. -->
      <p
        class="font-sans absolute right-3 bottom-2 text-[9px] leading-4 text-white/25"
      >
        Esri · HERE · Garmin · © OpenStreetMap
      </p>
    </template>

    <!-- No coordinates: the photograph, which is what the block showed before
         there was a map to show. -->
    <NuxtImg
      v-else
      :src="venue.imageUrl"
      :alt="venue.imageAlt"
      :sizes="imageSizes({ xs: '100vw', lg: '860px' })"
      :quality="90"
      class="absolute inset-0 size-full object-cover"
    />

    <!-- The pin (`517:1990` + `517:1991`): a card with the hall's name and a
         gold stem falling from it to the point on the map.

         Placed off the box's CENTRE, because that is where the tile grid puts
         the venue: `bottom-1/2` lands the stem's foot on the point, and
         `-translate-x-8` shifts the card left by exactly the stem's own offset
         so the line falls ON it rather than near it. A percentage guessed from
         the design would be right at one width only.

         `pointer-events-none` on the wrapper so the card does not cover more of
         the map than it draws; the link inside takes its own presses back. -->
    <div
      class="pointer-events-none absolute inset-x-4 bottom-8 flex flex-col items-start lg:inset-x-auto lg:bottom-1/2 lg:left-1/2 lg:-translate-x-8"
    >
      <div
        class="pointer-events-auto flex max-w-full items-center gap-3 rounded-[var(--radius-glass)] bg-[#1E1E1E] p-2 shadow-[0_2px_8px_rgba(0,0,0,0.45),0_18px_48px_rgba(0,0,0,0.7)]"
      >
        <NuxtImg
          v-if="venue.thumbUrl"
          :src="venue.thumbUrl"
          alt=""
          aria-hidden="true"
          :sizes="imageSizes({ xs: '84px' })"
          class="size-[84px] shrink-0 rounded-[8px] object-cover"
        />

        <div class="flex min-w-0 flex-col justify-center gap-0.5 pr-2">
          <!-- A link rather than a label: this map cannot be panned, and "open
               it somewhere I can" is the one thing a reader wants from a still
               one. -->
          <component
            :is="externalUrl ? 'a' : 'p'"
            v-bind="
              externalUrl
                ? {
                  href: externalUrl,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                }
                : {}
            "
            class="font-sans focus-visible:ring-gold text-xl leading-7 font-medium text-white transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none"
          >
            {{ venue.name }}
          </component>

          <p class="flex items-center gap-2">
            <!-- 10px ring in the gold fall with a glow, drawn as a border rather
                 than a filled dot: Figma strokes it and leaves the middle
                 open. -->
            <span
              aria-hidden
              class="size-2.5 shrink-0 rounded-full border-2 border-[#E1B762] shadow-[0_0_4px_0_rgba(225,183,98,1)]"
            />
            <span class="font-sans text-sm leading-[1.57] text-[#8F8F8F]">
              {{ venue.country }}
            </span>
          </p>
        </div>
      </div>

      <!-- The stem: 2px falling from the card to the point, transparent at the
           top so it reads as coming out of the card rather than hanging off it
           (`517:1990`). -->
      <span
        v-if="tiles"
        aria-hidden
        class="ml-8 h-20 w-0.5 bg-[linear-gradient(180deg,rgba(225,183,100,0)_0%,rgba(225,183,100,1)_100%)]"
      />
    </div>
  </div>
</template>
