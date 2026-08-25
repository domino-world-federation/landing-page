import { MapMarkers } from "@/components/members/MapMarkers"
import { Reveal } from "@/components/motion/Reveal"
import { MEMBERS_COPY, MEMBERSHIP_TIERS } from "@/content/members"

/**
 * The membership map — Figma node `404:28159`, 1920 × 1089.
 *
 * A dotted world map inside a gradient frame, one city callout pinned to it,
 * and the tier colours listed underneath.
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
 *
 * Server Component apart from the entrance and the marker layer.
 */
export function MembersMap() {
  return (
    <section
      aria-label={MEMBERS_COPY.mapLabel}
      className="flex flex-col items-center gap-8 px-5 py-10 md:px-10 lg:gap-10 lg:px-20 lg:py-[3.125vw]"
    >
      {/* Figma draws the plate and the markers as separate layers — `404:28158`
          is the gradient plate with the landmass on it, `404:28176` the dots
          over it — and they stay separate here for a better reason than
          fidelity: the marker layer is the interactive one, so it is its own
          component. The plate bleeds to the section's edges while the markers
          stay inset the way the design insets them. */}
      <Reveal scale={[0.97, 1]} className="relative w-full">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative
            SVG plate sized in CSS; next/image would add a layout wrapper for
            no gain. */}
        <img
          src="/assets/members/decor-map-frame.svg"
          alt=""
          aria-hidden
          className="w-full"
        />

        <MapMarkers />
      </Reveal>

      {/* `404:28373` — the pill strip, carrying the navbar's chrome exactly:
          40% black under a 10px backdrop blur, 12px radius, 4px of padding. */}
      <div className="w-full overflow-x-auto">
        <ul
          aria-label={MEMBERS_COPY.mapKeyLabel}
          className="mx-auto flex w-max items-center gap-0 rounded-[var(--radius-glass)] bg-black/40 p-1 backdrop-blur-[10px]"
        >
          {MEMBERSHIP_TIERS.map((tier) => (
            <li
              key={tier.id}
              className="flex items-center gap-2 px-5 py-3.5 whitespace-nowrap"
            >
              {/* The ring is a 3px gradient stroke in the design. A border
                  cannot take a gradient, so it is drawn as a gradient disc with
                  the middle punched out by a mask — the same problem the gold
                  CTA's conic stroke has, solved the same way. */}
              <span
                aria-hidden
                className="size-3.5 rounded-full"
                style={{
                  background: `linear-gradient(0deg, ${tier.from} 0%, ${tier.to} 100%)`,
                  boxShadow: `0 0 4px 0 ${tier.from}`,
                  mask: "radial-gradient(circle, transparent 0 3px, #000 3px)",
                  WebkitMask:
                    "radial-gradient(circle, transparent 0 3px, #000 3px)",
                }}
              />
              <span className="font-sans text-[length:var(--text-label-xs)] leading-6 font-medium text-white/70">
                {tier.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
