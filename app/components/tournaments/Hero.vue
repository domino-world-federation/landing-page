<script setup lang="ts">
import type { ShowcaseEvent } from "~/lib/api/types"
import { TOURNAMENTS_COPY } from "~/content/tournaments"

/**
 * The page's opening block — Figma node `370:17243`.
 *
 * A gold radial ground with the federation emblem sunk into it, a light sweep
 * across the top, the trophy standing in the middle, "DWF2026" laid across it at
 * 400px, and a blurred bar along the foot carrying the event and the stream
 * button.
 *
 * **The event is the same record the band below prints.** The design names it
 * "Caribbean Domino Open 2026" here and "CARIBBEAN DOMINO OPEN 2024" there, with
 * the same dates under both — two spellings of one tournament, which on a live
 * page would be a defect rather than a variation. Both blocks read
 * `getHighlightedTournament()`, so they cannot disagree.
 *
 * The layers are stacked, not parallaxed: this is a page header rather than the
 * landing hero, and nothing in the design suggests depth here (RULES §12 keeps
 * parallax to where it was drawn).
 */
defineProps<{ event: ShowcaseEvent }>()
</script>

<template>
  <!-- The radial is Figma's own (`370:17244`): a circle struck at the top
       centre, gold falling to bronze. `min-h` rather than the design's 1083 so a
       long event name grows the block instead of overflowing it. -->
  <!-- One screen: `581:14547` is 1920 × 1080, like the "All tournaments" band
       under it. `snap-screen` rather than the design's ratio — the two agree only
       at 16:9, and a 1512 × 900 laptop is left short by the ratio alone. -->
  <section
    aria-labelledby="tournament-hero-heading"
    class="relative isolate flex snap-screen flex-col justify-end overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#c3ae86_0%,#4f4332_100%)]"
  >
    <!-- Three layers, three speeds, and the order is the point: depth is read
         from RATE, so the emblem sunk into the ground trails, the light wash
         above it moves a little more, and the trophy — the subject — leads
         (RULES §12). All three on `transform` only, and well under the 3–4
         moving layers a viewport is allowed.

         `anchor="top"` on every one of them, which is mandatory for a hero: the
         default `cross` range opens when the section's head meets the viewport's
         FOOT, so a page that has not been scrolled yet already sits partway
         along it and every layer renders pre-shifted — visibly detached from the
         edge it is supposed to start at (D16). -->

    <!-- The emblem, 8% black and sunk into the ground rather than lit on top of
         it (`371:17302`). Decorative, and the slowest thing here. -->
    <MotionParallaxLayer
      :speed="4"
      anchor="top"
      decorative
      class="pointer-events-none absolute top-[10%] left-1/2 -z-10 w-[28.5vw] max-w-[547px] -translate-x-1/2"
    >
      <img
        src="/assets/tournaments/decor-hero-emblem.svg"
        alt=""
        aria-hidden
        class="w-full opacity-[0.08]"
      >
    </MotionParallaxLayer>

    <!-- The light sweep across the top (`371:17308`), wider than the frame in
         the design and left that way — it is a wash, and cropping it at the
         edges is what makes it read as light rather than as a shape. -->
    <MotionParallaxLayer
      :speed="7"
      anchor="top"
      decorative
      class="pointer-events-none absolute -top-[19%] left-1/2 -z-10 w-[121vw] max-w-none -translate-x-1/2"
    >
      <img
        src="/assets/tournaments/decor-hero-shade.svg"
        alt=""
        aria-hidden
        class="w-full"
      >
    </MotionParallaxLayer>

    <!-- The trophy. `priority` because it is this page's LCP, the same call
         `/domino` and `/development` make for their opening images.

         NOT `decorative`: it carries a real `alt`, so the layer must not be
         hidden from assistive tech the way the two washes above it are. -->
    <MotionParallaxLayer
      :speed="14"
      anchor="top"
      class="pointer-events-none absolute inset-x-0 top-[2.6%] -z-10 flex justify-center"
    >
      <div class="flex w-full justify-center">
        <NuxtImg
          src="/assets/tournaments/hero-trophy-hand.png"
          :alt="TOURNAMENTS_COPY.hero.portraitAlt"
          :width="728"
          :height="1304"
          preload
          loading="eager"
          fetchpriority="high"
          :sizes="imageSizes({ xs: '60vw', lg: '38vw' })"
          class="h-auto w-[60vw] max-w-[728px] lg:w-[38vw]"
        />
      </div>
    </MotionParallaxLayer>

    <!-- Bebas 400 with a white-to-transparent fall (`372:17399`). Decorative: it
         is the tournament's own branding, and the heading below names the event
         for anyone who cannot see it. Sized as a fraction of the window so it
         keeps its place across the trophy at every width. -->
    <p
      aria-hidden
      class="font-display pointer-events-none absolute inset-x-0 top-[58%] -z-10 bg-linear-to-b from-white to-transparent bg-clip-text text-center text-[20.83vw] leading-[0.7] tracking-[-0.0492em] text-transparent"
    >
      {{ TOURNAMENTS_COPY.hero.watermark }}
    </p>

    <!-- The foot bar (`370:17245`): a fall to the page's own black.

         Figma also puts a 15px backdrop blur on this frame, and it is not
         reproduced. A backdrop filter applies at full strength across the whole
         box while the gradient over it starts at transparent, so the blur's top
         edge lands as a straight line ruled across the artwork — here it cut the
         DWF2026 wordmark in half. The gradient alone is what the effect is for:
         the trophy softens into the block below without a seam. Reported from a
         screenshot, and the same fix applies to the news page's featured
         shelf. -->
    <div
      class="relative flex flex-col gap-8 bg-linear-to-b from-transparent via-[#0e0e0e]/75 to-[#0e0e0e] px-5 pt-24 pb-10 md:px-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:px-20 lg:pt-[6vw] lg:pb-[4.17vw]"
    >
      <div class="flex flex-col gap-2.5">
        <!-- Bebas 32/40 at half opacity (`370:17247`). The bullet is
             `aria-hidden`: it separates two fields for the eye, and read aloud
             it is noise between a place and a date. -->
        <p
          class="font-display flex flex-wrap items-center gap-2.5 text-[length:var(--text-display-caption)] leading-[1.25] text-white/50 uppercase"
        >
          <span>{{ event.location }}</span>
          <span aria-hidden>{{ TOURNAMENTS_COPY.hero.separator }}</span>
          <span>{{ event.dateLabel }}</span>
        </p>

        <!-- Inter SemiBold 64/72 (`370:17251`), capped at the design's 1080 so a
             long name breaks where the design breaks it. -->
        <h1
          id="tournament-hero-heading"
          class="font-sans max-w-[1080px] text-[length:var(--text-heading-hero)] leading-[1.125] font-semibold text-white"
        >
          {{ event.name }}
        </h1>
      </div>

      <!-- 320 × 72 flat gold at 8px radius (`372:17392`) — not `GoldCta`, which
           is the landing page's 48px pill with a glow and a travelling sheen.
           Same brand colour, different control. -->
      <TournamentsUnavailableButton
        :notice="TOURNAMENTS_COPY.hero.watchLiveUnavailable"
        class="rounded-btn font-display focus-visible:ring-gold bg-gold flex h-18 w-full items-center justify-center gap-4 px-5 text-[length:var(--text-display-cta)] leading-11 text-black uppercase transition-colors hover:bg-[var(--color-gold-btn-light)] focus-visible:ring-2 focus-visible:outline-none lg:w-80"
      >
        {{ TOURNAMENTS_COPY.hero.watchLive }}
        <img
          src="/assets/tournaments/icon-live-stream.svg"
          alt=""
          width="32"
          height="32"
          class="size-8"
        >
      </TournamentsUnavailableButton>
    </div>
  </section>
</template>
