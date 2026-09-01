<script setup lang="ts">
import { getPartners } from "~/lib/api/client"
import { PARTNERS_COPY } from "~/content/home/partners"

/**
 * Seconds for the strip to travel its own length once.
 *
 * Slower than S8's 75s even though the track is shorter, and deliberately so:
 * these are logos, not headlines. There is nothing to read, so the strip's job
 * is to sit in the page's peripheral vision rather than to deliver anything —
 * ~2240px in 90s is about 25px/s, a drift. At S8's speed a row of marks this
 * sparse reads as a ticker and pulls the eye off the sections around it.
 */
const LAP = 90

/**
 * One logo frame, as a fraction of the viewport.
 *
 * 13.54vw is 260/1920, so at the design width each frame is exactly its Figma
 * size and narrower windows scale the row down rather than overflowing (D14).
 * The 150px floor is set by the widest mark: `logo-pertamina-fastron` fills
 * nearly the whole 260px frame, and below ~150 its wordmark stops being legible
 * — at which point the strip is showing grey smudges, not partners.
 */
const LOGO_W = "w-[max(150px,13.54vw)]"

/**
 * S9 — Figma node `56:4541`. Official partners.
 *
 * Eight marks in a row, the whole group drawn at 25% opacity. That opacity is
 * the section: partners are acknowledged here, not advertised, and the row is
 * meant to read as a watermark under the heading rather than as eight buttons.
 *
 * The row **travels**, on the same `Marquee` S8 uses. Figma draws it centred and
 * still, but the eight frames total 2240px against a 1920 frame — it does not
 * fit at the design width either, so something has to give. Scaling the marks
 * down to fit would take them below the size their wordmarks survive; moving
 * them keeps every logo at full size and shows all eight in turn.
 *
 * The logos are **not links**. Figma gives them no destination, and `Partner`
 * carries `websiteUrl` as optional — until the federation says where these
 * point, eight anchors to nowhere is worse than eight images. The marks are
 * still named for screen readers, so the list is readable without being
 * clickable.
 */
const { data: partners } = await useAsyncData("home-partners", () => getPartners(), {
  default: () => [],
})
</script>

<template>
  <!-- No horizontal padding: the strip runs off both edges, which is what says
       there is more of it than the window shows. 100px of vertical padding in
       Figma (5.21vw), floored so the band does not collapse on a phone where
       5.21vw is 19px. -->
  <section
    aria-labelledby="partners-heading"
    class="snap-start snap-always overflow-hidden py-[max(48px,5.21vw)]"
  >
    <!-- Figma's 52px gap between heading and row — 2.71vw, floored at 24. -->
    <div class="flex flex-col gap-[max(24px,2.71vw)]">
      <h2
        id="partners-heading"
        class="font-sans px-5 text-center text-[length:var(--text-partners-heading)] leading-[1.25] font-semibold tracking-[0.25em] text-white/80 uppercase"
      >
        {{ PARTNERS_COPY.heading }}
      </h2>

      <UiMarquee :duration="LAP" :label="PARTNERS_COPY.regionLabel">
        <!-- The 25% opacity sits on the row as a GROUP, exactly as Figma has it
             (`55:3298`), rather than on each logo. Per-logo opacity would be
             identical here — the marks never overlap — but the group is where
             the design puts it and where a hover treatment would later need to
             lift it from.

             `gap-5` is the design's 20px gutter; the trailing margin supplies
             that same gutter across the loop's seam, where the second copy
             begins. -->
        <div class="mr-5 flex items-center gap-5 opacity-25">
          <!-- Figma's frame is 260×125 and every mark is centred inside it at
               its own size — the frames are a fixed pitch, not a fixed logo
               size. `aspect` plus `object-contain` reproduces that: each SVG
               fills what it needs of the box and centres in the rest, so the
               row's rhythm is even however wide the marks are. -->
          <div
            v-for="partner in partners"
            :key="partner.id"
            :class="`relative shrink-0 aspect-[260/125] ${LOGO_W}`"
          >
            <!-- A plain `<img>`: the marks are SVGs, so the image pipeline would
                 hand back the same bytes (RULES §7), and with that there is no
                 srcset for a `sizes` to steer. -->
            <img
              :src="partner.logoUrl"
              :alt="partner.name"
              class="absolute inset-0 size-full object-contain"
            >
          </div>
        </div>
      </UiMarquee>
    </div>
  </section>
</template>
