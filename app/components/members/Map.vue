<script setup lang="ts">
import { MEMBERS_COPY, MEMBERSHIP_TIERS } from "~/content/members"
import { MAP_MARKERS } from "~/content/members/map-markers"

/**
 * The membership map — Figma node `404:28159`, 1920 × 1089.
 *
 * A dotted world map inside a gradient frame, one city callout pinned to it, and
 * the tier colours listed underneath.
 *
 * **The tier chips are a key, not a filter.** Figma draws them as pill controls
 * with "Show All" selected, but the 57 markers are baked into the exported SVG
 * with their tier colours already in them (5 continent, 34 national, 11
 * regional, 7 club) — there is nothing to filter, and there will not be until a
 * backend serves the markers as data (B2). D28 settled what to do here: a
 * control that cannot do its job does not ship looking like one. So they are
 * rendered as what the design's own inner frames are named — `legend` — and
 * "Show All" is dropped, because a key has nothing to show or hide.
 *
 * **The markers ARE reachable, and that took looking at the file.** The first
 * build assumed they were baked into one flat export and therefore untouchable.
 * They are not: `world-map-dots.svg` holds 57 circles and no landmass at all —
 * the map is the separate `decor-map-frame.svg`, one path of 107 subpaths. So
 * every marker's coordinate could be read out of the artwork and turned into a
 * hit target, which is what `MapMarkers` does.
 *
 * That does NOT revive the tier filter (D63). Reading where a marker is is not
 * the same as knowing what it is, and 56 of the 57 have no name anywhere in the
 * design — there is still nothing to filter BY. The chips below stay a key.
 */

/**
 * One swatch's fill. The ring is a 3px gradient stroke in the design, and a
 * border cannot take a gradient — so it is a gradient disc with the middle
 * punched out by a mask, the same problem the gold CTA's conic stroke has and
 * the same answer.
 */
function swatch(tier: (typeof MEMBERSHIP_TIERS)[number]) {
  return {
    background: `linear-gradient(0deg, ${tier.from} 0%, ${tier.to} 100%)`,
    boxShadow: `0 0 4px 0 ${tier.from}`,
    mask: "radial-gradient(circle, transparent 0 3px, #000 3px)",
    WebkitMask: "radial-gradient(circle, transparent 0 3px, #000 3px)",
  }
}

/**
 * Which tier the strip below the map has narrowed to, or `undefined` for all.
 *
 * Lives here rather than in `MapMarkers` because the pills that set it are here
 * — and it is plain component state rather than a URL query, unlike the filters
 * on `/gallery` and `/tournaments/all`. Those pick which RECORDS a page fetches,
 * which is worth being able to send someone. This one dims dots on a decorative
 * map inside one section of a page; putting it in the URL would mean a reader
 * who tapped a colour could not press Back out of the page.
 */
const activeTier = ref<string>()

const shownCount = computed(() =>
  activeTier.value
    ? MAP_MARKERS.filter((marker) => marker.tier === activeTier.value).length
    : MAP_MARKERS.length,
)

const filterStatus = computed(() => {
  const tier = MEMBERSHIP_TIERS.find((t) => t.id === activeTier.value)
  return tier
    ? MEMBERS_COPY.mapFilterStatus(tier.label, shownCount.value)
    : MEMBERS_COPY.mapFilterAllStatus(shownCount.value)
})

</script>

<template>
  <section
    :aria-label="MEMBERS_COPY.mapLabel"
    class="flex snap-screen flex-col items-center justify-center gap-8 px-5 pt-28 pb-10 md:px-10 lg:gap-10 lg:px-20 lg:pt-[var(--nav-clearance)] lg:pb-[3.125vw]"
  >
    <!-- Figma draws the plate and the markers as separate layers — `404:28158`
         is the gradient plate with the landmass on it, `404:28176` the dots over
         it — and they stay separate here for a better reason than fidelity: the
         marker layer is the interactive one, so it is its own component. The
         plate bleeds to the section's edges while the markers stay inset the way
         the design insets them. -->
    <!-- Capped by HEIGHT, expressed as a width — the plate is 1719 × 941, so
         `66dvh × 1.827` is the widest it can be and still leave room for the
         navbar clearance, the key strip and the section's own padding inside one
         screen. Without it the block came to 1235px on a 1080 screen, which is a
         snap stop that does not fit the stop.

         The cap goes on the WRAPPER, not the image: the markers are positioned
         in percentages against this box, so anything that resizes the plate has
         to resize the layer over it by the same amount or every dot drifts. -->
    <MotionReveal
      :scale="[0.97, 1]"
      class="relative mx-auto w-full max-w-[calc(66dvh*1.827)]"
    >
      <img
        src="/assets/members/decor-map-frame.svg"
        alt=""
        aria-hidden
        class="w-full"
      >

      <MembersMapMarkers :active-tier="activeTier" />
    </MotionReveal>

    <!-- `404:28373` — the pill strip, carrying the navbar's chrome exactly: 40%
         black under a 10px backdrop blur, 12px radius, 4px of padding.

         **These are controls now, not a key.** They shipped as a flat legend
         first, because the 57 markers were one exported picture with their
         colours baked in and there was nothing to filter — D28 does not allow a
         control that cannot do its job. `MAP_MARKERS` carries every marker's
         tier, so the dots are drawn from data and the pills do what Figma shows
         them doing.

         "Show All" is a peer of the four, not a reset button off to one side:
         it is the fifth state of one choice, so they share a `radiogroup` and
         exactly one is pressed at any time. -->
    <div class="w-full overflow-x-auto">
      <div
        role="radiogroup"
        :aria-label="MEMBERS_COPY.mapKeyLabel"
        class="mx-auto flex w-max items-center rounded-[var(--radius-glass)] bg-black/40 p-1 backdrop-blur-[10px]"
      >
        <button
          type="button"
          role="radio"
          :aria-checked="activeTier === undefined"
          :class="
            cn(
              'font-sans focus-visible:ring-gold rounded-[var(--radius-btn)] px-5 py-3.5 text-[length:var(--text-label-xs)] leading-6 font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none',
              activeTier === undefined
                ? 'bg-white/12 text-white'
                : 'text-white/70 hover:text-white',
            )
          "
          @click="activeTier = undefined"
        >
          {{ MEMBERS_COPY.mapShowAll }}
        </button>

        <button
          v-for="tier in MEMBERSHIP_TIERS"
          :key="tier.id"
          type="button"
          role="radio"
          :aria-checked="activeTier === tier.id"
          :class="
            cn(
              'font-sans focus-visible:ring-gold flex items-center gap-2 rounded-[var(--radius-btn)] px-5 py-3.5 text-[length:var(--text-label-xs)] leading-6 font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none',
              activeTier === tier.id
                ? 'bg-white/12 text-white'
                : 'text-white/70 hover:text-white',
            )
          "
          @click="activeTier = activeTier === tier.id ? undefined : tier.id"
        >
          <span aria-hidden class="size-3.5 rounded-full" :style="swatch(tier)" />
          {{ tier.label }}
        </button>
      </div>
    </div>

    <!-- Spoken, not shown. The map changes without anything else on the page
         moving, so a screen-reader user pressing a pill would otherwise get no
         confirmation that it did anything. -->
    <p aria-live="polite" class="sr-only">{{ filterStatus }}</p>

  </section>
</template>
