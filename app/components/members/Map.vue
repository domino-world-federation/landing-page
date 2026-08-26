<script setup lang="ts">
import { MEMBERS_COPY, MEMBERSHIP_TIERS } from "~/content/members"

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
</script>

<template>
  <section
    :aria-label="MEMBERS_COPY.mapLabel"
    class="flex flex-col items-center gap-8 px-5 py-10 md:px-10 lg:gap-10 lg:px-20 lg:py-[3.125vw]"
  >
    <!-- Figma draws the plate and the markers as separate layers — `404:28158`
         is the gradient plate with the landmass on it, `404:28176` the dots over
         it — and they stay separate here for a better reason than fidelity: the
         marker layer is the interactive one, so it is its own component. The
         plate bleeds to the section's edges while the markers stay inset the way
         the design insets them. -->
    <MotionReveal :scale="[0.97, 1]" class="relative w-full">
      <img
        src="/assets/members/decor-map-frame.svg"
        alt=""
        aria-hidden
        class="w-full"
      >

      <MembersMapMarkers />
    </MotionReveal>

    <!-- `404:28373` — the pill strip, carrying the navbar's chrome exactly: 40%
         black under a 10px backdrop blur, 12px radius, 4px of padding. -->
    <div class="w-full overflow-x-auto">
      <ul
        :aria-label="MEMBERS_COPY.mapKeyLabel"
        class="mx-auto flex w-max items-center gap-0 rounded-[var(--radius-glass)] bg-black/40 p-1 backdrop-blur-[10px]"
      >
        <li
          v-for="tier in MEMBERSHIP_TIERS"
          :key="tier.id"
          class="flex items-center gap-2 px-5 py-3.5 whitespace-nowrap"
        >
          <span aria-hidden class="size-3.5 rounded-full" :style="swatch(tier)" />
          <span
            class="font-sans text-[length:var(--text-label-xs)] leading-6 font-medium text-white/70"
          >
            {{ tier.label }}
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>
