<script setup lang="ts">
import { FORMATS, FORMATS_ALT } from "~/content/domino/formats"

/**
 * Singles versus doubles — Figma node `207:15563`.
 *
 * Two panels butted together into one rounded rectangle: silver on the left
 * (white grading to `--color-surface-silver`), gold on the right, radii only on
 * the outer corners so the pair reads as a single object cut down the middle.
 * That cut is the section's whole argument — one game, two formats.
 *
 * **The figures used to be one picture and are now two.** The old file laid a
 * single globe-engraved tile across the seam, each panel clipping its half, and
 * this component went to some trouble to keep those halves from tearing apart:
 * one shared parallax speed, offsets stated as percentages of a panel so they
 * stayed exactly one panel apart at every width. None of that is needed any
 * more. The updated file (`272:15631` and `272:15635`) puts a different
 * photograph in each panel — a lone silhouette against the singles copy, a pair
 * back to back against the doubles copy — so there is no seam to keep shut, and
 * the pictures now make the section's point instead of merely decorating it.
 *
 * **They no longer move at all.** The old tile rode a `ParallaxLayer`, and that
 * carried over to the silhouettes by inertia — wrongly. These figures stand ON
 * the panel's floor: Figma pins each one's bottom edge to the bottom of its
 * panel, and a parallax offset lifts it off, opening a gap under the feet that
 * grows as the page scrolls. A figure cannot both be standing on something and
 * be floating over it, so the parallax went.
 *
 * Below `lg` the panels stack and both figures are dropped. They are 40%-opacity
 * backdrops behind the copy; at phone widths that copy needs the whole panel.
 */
const [singles, doubles] = FORMATS
</script>

<template>
  <!-- The gradient is Figma's own (`572:13990`, `#0E0E0E → #1B1B1B`) and the
       section was rendering without it: transparent looks identical while the
       page background is all that sits behind, which it was. It is not any more
       — the tile band above is `sticky` and stays under this section as it
       climbs, so the ground has to be opaque or the picture shows straight
       through the copy. -->
  <section
    aria-labelledby="format-singles-heading"
    class="relative z-10 bg-[linear-gradient(180deg,var(--color-bg)_0%,#1b1b1b_100%)] px-5 py-10 md:px-10 lg:flex lg:flex-col lg:justify-center lg:px-20 lg:py-[3.13vw]"
  >
    <!-- 800 tall in Figma minus its 60px of vertical padding; 35.42vw is
         680/1920. The floor keeps the panels from crushing their three
         statistics rows together on a narrow desktop — the same reason S4 and
         the About HQ band carry one. Below `lg` the height follows the copy. -->
    <!-- The design's `max(560px, 35.42vw)` is a CAP now rather than a height.
         The page pins this section to a share of the SCREEN (see `domino.vue`),
         and a height measured off the viewport's width knows nothing about how
         tall the window is — on a wide, short one the split kept its 680 and
         pushed the section past the room it was given. As a flex child it takes
         what the section has and stops at the design's size. -->
    <div
      class="flex flex-col lg:max-h-[max(560px,35.42vw)] lg:min-h-0 lg:flex-1 lg:flex-row"
    >
      <DominoFormatPanel
        v-if="singles"
        :format="singles"
        align="start"
        heading-id="format-singles-heading"
        class="rounded-t-[var(--radius-card)] bg-[linear-gradient(180deg,var(--color-surface-light)_0%,var(--color-surface-silver)_100%)] lg:flex-1 lg:rounded-tr-none lg:rounded-bl-[var(--radius-card)]"
      >
        <template #figure>
          <!-- 514/880 across, 376/880 wide, 600/680 tall. No `top`: the figure
               hangs from `bottom-0`, which is where Figma puts it
               (80 + 600 = 680, the panel's full inner height). -->
          <DominoFormatFigure
            src="/assets/domino/format-singles-silhouette.webp"
            :alt="FORMATS_ALT.singles"
            class="left-[58.41%] h-[88.24%] w-[42.73%]"
          />
        </template>
      </DominoFormatPanel>

      <DominoFormatPanel
        v-if="doubles"
        :format="doubles"
        align="end"
        class="rounded-b-[var(--radius-card)] bg-[var(--color-gold)] lg:flex-1 lg:rounded-tr-[var(--radius-card)] lg:rounded-bl-none"
      >
        <template #figure>
          <!-- −25/880 across — it hangs off its panel's left edge, so the pair
               leans into the join from the far side. 405/880 wide, 600/680 tall,
               hung from the floor like its counterpart. -->
          <DominoFormatFigure
            src="/assets/domino/format-doubles-silhouette.webp"
            :alt="FORMATS_ALT.doubles"
            class="left-[-2.84%] h-[88.24%] w-[46.02%]"
          />
        </template>
      </DominoFormatPanel>
    </div>
  </section>
</template>
