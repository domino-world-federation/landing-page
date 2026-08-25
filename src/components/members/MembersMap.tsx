import { Reveal } from "@/components/motion/Reveal"
import { MEMBERS_COPY, MEMBERSHIP_TIERS } from "@/content/members"
import { STAGGER } from "@/lib/utils/motion"

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
 * **The entrance is nearly all the motion here.** The plate and its markers
 * arrive together as one `Reveal`, with the callout a beat behind so it reads
 * as landing ON a map that is already there rather than with it. Only the
 * callout's marker keeps moving, and only enough to say the map is live —
 * `motion-safe`, so a reader who asked for stillness gets it. Nothing animates
 * per-marker and nothing can: the 57 are one exported SVG, so there is no
 * element to stagger.
 *
 * Server Component apart from the entrances, which are `Reveal`'s.
 */
export function MembersMap() {
  return (
    <section
      aria-label={MEMBERS_COPY.mapLabel}
      className="flex flex-col items-center gap-8 px-5 py-10 md:px-10 lg:gap-10 lg:px-20 lg:py-[3.125vw]"
    >
      {/* The frame and the map are separate exports because Figma draws them
          as separate layers: `404:28158` is the gradient plate, `404:28176` the
          dots on top of it. Kept apart so the plate can bleed to the section's
          edges while the map stays inset the way the design insets it. */}
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

        {/* 1497 × 744 at x:253 y:189 of the 1920 × 1089 block — written as
            percentages so the map keeps its place on the plate at any width.
            The map is the section's content, but it is named by the section's
            own `aria-label`: an `alt` describing 57 markers would be a
            paragraph nobody asked for, and the directory below lists the
            members in text. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- as above. */}
        <img
          src="/assets/members/world-map-dots.svg"
          alt=""
          className="absolute top-[17.4%] left-[13.2%] w-[78%]"
        />

        {/* `404:28268` — the callout, with the gold line dropping from it.
            Hidden below `lg`: at phone widths the map is a few hundred pixels
            wide and a pinned label lands on top of the continent it points at.
            Nothing is lost — it is an example of what a marker says, and the
            key below says the same thing in text. */}
        <Reveal
          y={12}
          delay={STAGGER * 2}
          className="absolute top-[5.5%] left-[69.2%] hidden lg:block"
        >
          <div className="flex flex-col items-center gap-0.5 rounded-[var(--radius-btn)] bg-[#1e1e1e] px-5 py-2">
            <p className="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-white">
              {MEMBERS_COPY.mapPinCity}
            </p>
            <p className="flex items-center gap-2">
              {/* The only thing on this page that keeps moving. `motion-safe`
                  rather than a JS branch: it is a CSS animation, so the media
                  query can hold it still without the markup differing between
                  server and client (RULES §12). */}
              <span
                aria-hidden
                className="size-2.5 rounded-full border-2 border-[#e1b762] shadow-[0_0_4px_0_#e1b762] motion-safe:animate-pulse"
              />
              <span className="font-sans text-muted text-sm leading-[1.57]">
                {MEMBERS_COPY.mapPinTier}
              </span>
            </p>
          </div>

          {/* `404:28201` — a 2px line fading down from the tag to the marker.
              `aria-hidden`: it is the callout's leader line, not content. */}
          <span
            aria-hidden
            className="mx-auto block h-[36vw] w-0.5 bg-linear-to-b from-transparent to-[#e1b764]"
          />
        </Reveal>
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
