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
const prefersReducedMotion = useReducedMotion()
const openId = ref("jakarta")

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

function toggle(id: string) {
  openId.value = openId.value === id ? "" : id
}
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
    <!-- The artwork's own marker layer, sized in CSS. The map is named by the
         section's `aria-label`: an `alt` describing 57 markers would be a
         paragraph nobody asked for, and the buttons below carry the real
         names. -->
    <img src="/assets/members/world-map-dots.svg" alt="" class="w-full">

    <div
      role="group"
      :aria-label="MEMBERS_COPY.markersLabel"
      class="absolute inset-0"
    >
      <!-- A 22px target centred on an 11px dot: the artwork's marker is too
           small to hit reliably, and enlarging the dot would mean redrawing
           artwork that is already correct. -->
      <button
        v-for="marker in MAP_MARKERS"
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

      <!-- `404:28268` — the tag, hung from the top of the marker layer in the
           open marker's column, with the leader line filling the distance down
           to the dot. `role="status"` so a reader who opens a marker by keyboard
           is told what appeared; it is one node that changes rather than one per
           marker, so nothing is announced twice. -->
      <AnimatePresence>
        <Motion
          v-if="open"
          :key="open.id"
          as="div"
          role="status"
          class="pointer-events-none absolute top-0 z-10 flex -translate-x-1/2 flex-col items-center"
          :style="{ left: `${open.x}%`, height: `${open.y}%` }"
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
               the dot, so the eye is led down it rather than up. `flex-1` is
               what makes the length follow the marker. -->
          <span
            aria-hidden
            class="w-0.5 flex-1 bg-linear-to-b from-transparent to-[#e1b764]"
          />
        </Motion>
      </AnimatePresence>
    </div>
  </div>
</template>
