<script setup lang="ts">
import {
  PLAYER_MEMBERSHIP_ALT,
  PLAYER_MEMBERSHIP_COPY,
} from "~/content/player-membership"

/**
 * The page's opening screen — Figma `629:28454`, 1920 × 1080.
 *
 * **Layers, not rows.** The design overlaps all three of its parts: the card
 * runs y327–1223 while the copy above it ends around y440 and the button sits at
 * y858, a third of the way UP the card. Built as a column they stack instead,
 * the section grows past the screen, and the composite the design draws — a card
 * standing in light with the call laid across it — never happens. So from `lg`
 * every part is placed by its own fraction of the frame, exactly as the home
 * hero is; below `lg` they fall back to a column, where there is not the height
 * to overlap anything.
 *
 * The light is two blurred ellipses rather than one: `629:28455` is the wide
 * amber wash at 162px of blur and `629:28456` a tighter, brighter core inside
 * it, and one ellipse cannot be both — the same reason the countdown's glow
 * keeps two.
 *
 * `629:28458` is the layer that is easy to miss: a 3084 × 2079 ellipse of the
 * page's own black, blurred 97px, sitting OVER the card rather than under it. It
 * is what makes the glow read as a pool the card stands in rather than as a lit
 * background, and it is what fades the card's own foot into the section.
 */
const COPY = PLAYER_MEMBERSHIP_COPY.hero
</script>

<template>
  <section
    aria-labelledby="player-hero-heading"
    class="relative isolate flex snap-screen flex-col items-center justify-center gap-10 overflow-hidden bg-[linear-gradient(180deg,#262626_0%,#0E0E0E_99%)] px-5 pt-28 pb-16 md:px-10 lg:block lg:h-dvh lg:min-h-0 lg:gap-0 lg:px-20 lg:py-0"
  >
    <!-- 1. The pool. Both ellipses are fractions of the frame, so the light
         scales with the section instead of holding Figma's pixels at one width.

         `ellipse farthest-side`, not `circle`: Figma fits a radial gradient to
         the layer's box, and these are 1341 × 1119 — a circle takes one radius
         for both axes and leaves the falloff wrong on the short one. The trap is
         recorded on the hero CTA in `main.css` and cost this site twice. -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-20">
      <div
        class="absolute top-[53.24%] left-[15.05%] h-[103.6%] w-[69.84%] rounded-full bg-[radial-gradient(ellipse_farthest-side_at_50%_50%,#FFE4AD_0%,#D6A84C_100%)] opacity-50 blur-[162px]"
      />
      <div
        class="absolute top-[68.24%] left-[25.16%] h-[73.61%] w-[49.64%] rounded-full bg-[#FFEBC2] opacity-50 blur-[162px]"
      />
    </div>

    <!-- 2. The card — `629:28457`, x512 y327, 896 square. `-z-10` puts it over
         the pool and under the copy, which is the order Figma stacks them in.

         It settles rather than simply being there: it arrives a little large and
         a little low and comes to rest, which is the one move on this screen. -->
    <MotionReveal
      :y="32"
      :scale="[1.06, 1]"
      :duration="DURATION * 1.4"
      class="relative -z-10 w-[90vw] lg:absolute lg:top-[30.28%] lg:left-[26.67%] lg:w-[46.67%]"
    >
      <NuxtImg
        src="/assets/player-membership/hero-dwf-id.png"
        :alt="PLAYER_MEMBERSHIP_ALT.card"
        :sizes="imageSizes({ xs: '90vw', lg: '47vw' })"
        preload
        loading="eager"
        fetchpriority="high"
        :quality="90"
        class="aspect-square w-full object-contain"
      />
    </MotionReveal>

    <!-- 3. The black pool, OVER the card. Painted after it and at the same
         negative level, so DOM order decides — which is what the design does. -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute top-[71.76%] left-[-30.31%] -z-10 h-[192.5%] w-[160.63%] rounded-full bg-[var(--color-bg)] blur-[97px]"
    />

    <!-- 4. The copy — `629:28459` at x360 y214, a 1200-wide column on a 64px
         gap. Its own 812px measure for the paragraph (`629:28461`). -->
    <div
      class="relative flex flex-col items-center gap-6 text-center lg:absolute lg:inset-x-0 lg:top-[19.81%] lg:gap-[3.33vw]"
    >
      <MotionReveal :y="40" blur-from="10px" class="w-full">
        <h1
          id="player-hero-heading"
          class="font-sans mx-auto max-w-[62.5vw] text-[length:var(--text-heading-claim)] leading-[1.1] font-medium text-white max-lg:max-w-none"
        >
          {{ COPY.title }}
        </h1>
      </MotionReveal>

      <MotionReveal :y="32" :delay="STAGGER" class="w-full">
        <p
          class="font-sans mx-auto max-w-[42.29vw] text-base leading-8 text-white/60 max-lg:max-w-none lg:text-xl"
        >
          {{ COPY.body }}
        </p>
      </MotionReveal>
    </div>

    <!-- 5. The pill — `629:28462` at y858, a third of the way up the card rather
         than below it. `z-10` so it stays over both the card and the black pool
         that fades the card's foot. -->
    <MotionReveal
      :y="24"
      :delay="STAGGER * 2"
      class="relative z-10 w-full max-w-85 lg:absolute lg:inset-x-0 lg:top-[79.44%] lg:max-w-none"
    >
      <!-- The same pill the landing page's hero carries, down to its width:
           `w-fit` let it hug "Apply for DWF ID" and come out a different size
           from the one on the home page, where the design draws both at 340.
           `max-w-70` on a phone rather than the raw 340 for the reason recorded
           there — 340 is 87% of a 390px screen, where at 1920 it is 18%. -->
      <UiGoldCta
        :href="COPY.ctaUrl"
        class="mx-auto w-full max-w-70 sm:max-w-85"
      >
        {{ COPY.cta }}
      </UiGoldCta>
    </MotionReveal>
  </section>
</template>
