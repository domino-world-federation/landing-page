<script setup lang="ts">
import { MEMBERS_COPY, MEMBERSHIP_TIERS } from "~/content/members"
import { MAP_MARKERS } from "~/content/members/map-markers"

/**
 * Seconds. A callout the reader asked for, so short — this is a response, not an
 * entrance.
 */
const POP = 0.28

const TIER_BY_ID = new Map(MEMBERSHIP_TIERS.map((tier) => [tier.id, tier]))

/**
 * The markers on the members map, and the callout that opens on one.
 *
 * **The dots stay the artwork's.** `world-map-dots.svg` renders underneath
 * exactly as before — this adds a transparent hit target over each of the 57
 * coordinates rather than re-drawing them, so nothing about how the map looks
 * depends on CSS reproducing a gradient ring and a glow. What is drawn here is
 * only what the artwork cannot do: a highlight on the chosen marker, and the tag
 * above it.
 *
 * **Jakarta is the default, and its position is measured rather than placed.**
 * Figma pins one callout to the map and drops a 2px leader line from it
 * (`404:28201`); that line lands within 3px of the national-tier marker at
 * (1171, 572), which is how that marker was identified. The old build guessed
 * the tag's position from the tag's own frame instead, which is why it did not
 * sit over its dot.
 *
 * **The leader line is the design's long one, and it generalises.** Figma drops
 * a 624px line from a tag near the top of the block down to its marker
 * (`404:28201`), and that height is the point: it is what makes an 11px dot
 * findable on a map two thousand pixels wide. Reproduced by anchoring the
 * callout to the TOP of the marker layer at the open marker's column and letting
 * the line fill whatever is left down to the dot — so the line is as long as the
 * design's for a marker low on the map, and shortens by itself for one near the
 * top. No length is written down anywhere.
 */
/**
 * Which tier the legend has narrowed to, or `undefined` for all of them. Owned
 * by `Map`, because the pills that set it live there.
 */
const props = defineProps<{ activeTier?: string }>()

const prefersReducedMotion = useReducedMotion()
const openId = ref("jakarta")

/**
 * The markers the filter leaves standing, **plus whichever one is open**.
 *
 * The open marker is exempt because the filter is a way of looking at the map,
 * not a way of leaving it: a reader who has opened Jakarta and then narrows to
 * another tier was reading Jakarta, and taking it off the map mid-sentence
 * throws away what they were doing. It used to disappear, and its callout with
 * it. Keeping it costs nothing — it is one marker, it is the one the reader
 * pointed at, and the count below the map still reports the filter's own total
 * rather than this list's.
 *
 * Filtered here rather than hidden with CSS so the buttons leave the tab order
 * too: a marker nobody can see should not be a stop on the way to the ones they
 * can.
 */
const shown = computed(() => {
  if (!props.activeTier) return MAP_MARKERS

  return MAP_MARKERS.filter(
    (marker) => marker.tier === props.activeTier || marker.id === openId.value,
  )
})

/**
 * The dot itself, drawn from the record rather than from the export.
 *
 * `world-map-dots.svg` used to supply all 57 as one picture with their colours
 * baked in, which is why the legend below it could only ever be a key — you
 * cannot hide a circle that is part of a flat image. Every marker carries its
 * tier, so the ring is built from the tier's own two golds instead.
 *
 * The ring is a gradient, and a `border` cannot take one: it is a gradient disc
 * with the middle punched out by a mask. Same problem as the gold CTA's conic
 * stroke, same solution.
 *
 * The hole has to be `transparent`, not a dark colour. A mask reads ALPHA, so
 * `#0e0e0e` in the middle — opaque, however black it looks — punches nothing and
 * every marker came out a solid disc instead of a ring.
 */
function dotStyle(marker: (typeof MAP_MARKERS)[number]) {
  const tier = TIER_BY_ID.get(marker.tier)
  if (!tier) return undefined

  return {
    background: `linear-gradient(0deg, ${tier.from} 0%, ${tier.to} 100%)`,
    boxShadow: `0 0 5px 0 ${tier.from}`,
    mask: "radial-gradient(circle, transparent 0 2.2px, #000 2.2px)",
    WebkitMask: "radial-gradient(circle, transparent 0 2.2px, #000 2.2px)",
  }
}

const open = computed(() =>
  MAP_MARKERS.find((marker) => marker.id === openId.value),
)

const transition = computed(() =>
  prefersReducedMotion.value ? { duration: 0 } : { duration: POP, ease: EASE },
)

function markerName(marker: (typeof MAP_MARKERS)[number]) {
  return `${marker.place}, ${TIER_BY_ID.get(marker.tier)?.label ?? marker.tier}`
}

function highlight(marker: (typeof MAP_MARKERS)[number]) {
  const tier = TIER_BY_ID.get(marker.tier)
  return tier
    ? `radial-gradient(circle, ${tier.from}66 0%, transparent 70%)`
    : undefined
}

/**
 * The tier swatch inside the open callout.
 *
 * The ring is a 3px gradient stroke in the design. A border cannot take a
 * gradient, so it is drawn as a gradient disc with the middle punched out by a
 * mask — the same problem the gold CTA's conic stroke has, solved the same way.
 */
const swatchStyle = computed(() => {
  const tier = open.value ? TIER_BY_ID.get(open.value.tier) : undefined
  if (!tier) return undefined

  return {
    background: `linear-gradient(0deg, ${tier.from} 0%, ${tier.to} 100%)`,
    boxShadow: `0 0 4px 0 ${tier.from}`,
    mask: "radial-gradient(circle, transparent 0 3px, #000 3px)",
    WebkitMask: "radial-gradient(circle, transparent 0 3px, #000 3px)",
  }
})

const openTierLabel = computed(() =>
  open.value ? TIER_BY_ID.get(open.value.tier)?.label : undefined,
)

/** The open marker's chevron breathing. Two values, both composited. */
const pulse = computed(() =>
  prefersReducedMotion.value
    ? { opacity: 1, scale: 1 }
    : { opacity: [1, 0.45, 1], scale: [1, 0.88, 1] },
)

const pulseTransition = computed(() =>
  prefersReducedMotion.value
    ? { duration: 0 }
    : {
        duration: 1.6,
        ease: "easeInOut" as const,
        repeat: Number.POSITIVE_INFINITY,
      },
)

function toggle(id: string) {
  openId.value = openId.value === id ? "" : id
}

// No watch closing the callout on a filter change any more, and none is needed:
// `shown` keeps the open marker whatever the filter says, so the tag can never
// be left hanging on a leader line pointing at nothing — which is the failure
// the watch existed to catch.
</script>

<template>
  <!-- The marker layer's box, as a fraction of THE FRAME — not of Figma's
       1920 × 1089 block.

       That distinction was a bug worth recording. Figma places the map at x:253
       y:189 and the frame at x:100 y:90, both measured against the block;
       dividing those by the block gave 13.2% / 17.4% / 78%. But the frame itself
       is only 1719 × 941 and is rendered here at the container's full width, so
       the numbers had to be relative to the frame: (253-100)/1719, (189-90)/941,
       1497/1719. The block-relative figures shifted every marker right and down
       by roughly 4% of the map, which is enough to put Jakarta in the Indian
       Ocean and half a dozen others just off their coastlines.

       `inset-0` on the children then means "the marker layer", which is the box
       every coordinate in `MAP_MARKERS` is a percentage of. -->
  <div class="absolute top-[10.52%] left-[8.9%] w-[87.09%]">
    <!-- The layer's own height, and nothing else. `world-map-dots.svg` used to
         render here and supply all 57 dots as one flat picture; the dots are
         drawn from `MAP_MARKERS` now so the legend can filter them, and this
         holds the box open in its place.

         **1505 x 752, and it has to be that.** Every coordinate in `MAP_MARKERS`
         is a percentage of the DOTS file's box, not the map plate's — the two
         are different sizes (2.001 against 1.827). Standing this box up at the
         plate's ratio stretched all 57 markers down the map: Jakarta landed in
         the Java Sea and its neighbours drifted off their coastlines. -->
    <div class="aspect-[1505/752] w-full" />

    <div
      role="group"
      :aria-label="MEMBERS_COPY.markersLabel"
      class="absolute inset-0"
    >
      <!-- A 22px target centred on an 11px dot: the artwork's marker is too
           small to hit reliably, and enlarging the dot would mean redrawing
           artwork that is already correct. -->
      <button
        v-for="marker in shown"
        :key="marker.id"
        type="button"
        :aria-pressed="marker.id === openId"
        :aria-label="markerName(marker)"
        class="focus-visible:ring-gold absolute w-[1.8%] -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:ring-2 focus-visible:outline-none"
        :style="{
          left: `${marker.x}%`,
          top: `${marker.y}%`,
          aspectRatio: '1',
        }"
        @click="toggle(marker.id)"
      >
        <!-- The dot. Half the button, centred: the target is 22px because an
             11px ring is not something a thumb can reliably hit, and growing the
             ring to match would make the map read as a scatter of blobs.

             The OPEN marker is not a ring — the design replaces it with a white
             chevron at the foot of the leader line, so the tag and its pointer
             read as one object rather than a label floating above a dot that
             looks like every other dot. -->
        <span
          v-if="marker.id !== openId"
          aria-hidden
          class="absolute top-1/2 left-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          :style="dotStyle(marker)"
        />

        <!-- It pulses, which is the whole reason it is `Motion` and not an
             `<img>`: opacity and scale only, so the compositor carries it and
             nothing repaints (RULES §12). `useReducedMotion` collapses the
             transition rather than removing the element — branching the markup
             on a preference is the hydration mismatch RULES §12 records. -->
        <Motion
          v-else
          as="span"
          aria-hidden
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          :initial="{ opacity: 1, scale: 1 }"
          :animate="pulse"
          :transition="pulseTransition"
        >
          <svg
            width="22"
            height="14"
            viewBox="0 0 22 14"
            fill="none"
            class="w-[22px] drop-shadow-[0_0_6px_rgba(0,0,0,0.8)]"
          >
            <path
              d="M2 2 L11 11 L20 2"
              stroke="#fff"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Motion>

        <!-- The highlight. Only `transform` and `opacity` animate (RULES §12);
             the ring is a gradient disc with its middle masked out, the same way
             the legend's swatches are drawn. -->
        <Motion
          as="span"
          aria-hidden
          class="absolute inset-0 rounded-full"
          :initial="false"
          :animate="{
            opacity: marker.id === openId ? 1 : 0,
            scale: marker.id === openId ? 1 : 0.4,
          }"
          :transition="transition"
          :style="{ background: highlight(marker) }"
        />
      </button>

      <!-- `404:28268` — the tag, sitting just above its own marker.

           **It used to hang from the TOP of the map.** Figma drops a 624px
           leader line from a tag near the top of the block down to a dot near
           the bottom, and that was reproduced literally: the tag was pinned to
           `top-0` and the line stretched to fill whatever was left. It made the
           tag's position depend on nothing but the marker's column, so a dot in
           Indonesia got a tag in Siberia and a line down the length of Asia.

           Now the tag is anchored to the marker instead — `bottom` puts its foot
           on the dot — and the line is a fixed short one. Which marker is open
           moves the tag with it, and the line only has to say "this dot", not
           "somewhere far below".

           `role="status"` so a reader who opens a marker by keyboard is told
           what appeared; one node that changes rather than one per marker, so
           nothing is announced twice. -->
      <AnimatePresence>
        <Motion
          v-if="open"
          :key="open.id"
          as="div"
          role="status"
          class="pointer-events-none absolute z-10 flex -translate-x-1/2 flex-col items-center"
          :style="{ left: `${open.x}%`, bottom: `${100 - open.y}%` }"
          :initial="{ opacity: 0, y: -6 }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0 }"
          :transition="transition"
        >
          <div
            class="flex flex-col items-center gap-0.5 rounded-[var(--radius-btn)] bg-[#1e1e1e] px-4 py-2 whitespace-nowrap shadow-[var(--shadow-card)]"
          >
            <p
              class="font-sans text-[length:var(--text-label-xs)] leading-6 font-medium text-white"
            >
              {{ open.place }}
            </p>
            <p class="flex items-center gap-2">
              <span
                aria-hidden
                class="size-2.5 shrink-0 rounded-full"
                :style="swatchStyle"
              />
              <span class="font-sans text-muted text-xs leading-[1.57]">
                {{ openTierLabel }}
              </span>
            </p>
          </div>

          <!-- `404:28201` — 2px, fading from nothing at the tag to solid gold at
               the dot, so the eye is led down it rather than up. A fixed 76px,
               measured off the design's close-up: 28 was the first attempt and
               it left the tag sitting almost on top of its own marker. Fixed
               rather than "whatever is left above the dot", which is what it was
               before and what put a tag over Siberia for a marker in Java. -->
          <span
            aria-hidden
            class="h-19 w-0.5 shrink-0 bg-linear-to-b from-transparent to-[#e1b764]"
          />
        </Motion>
      </AnimatePresence>
    </div>
  </div>
</template>
