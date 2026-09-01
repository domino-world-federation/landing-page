<script setup lang="ts">
import { FRAMEWORKS_COPY } from "~/content/about/frameworks"

/**
 * Structural Frameworks — Figma node `111:3152`.
 *
 * The panel is a placeholder in the design and is built as one: Figma draws a
 * grey box with an icon and a grey sentence saying what the org chart will show.
 * Reproducing it honestly is the point — a page that quietly invents a
 * federation's committee structure is worse than one that visibly reserves the
 * space for it. See the note in `content/about/frameworks.ts`.
 *
 * The panel has no bottom radius and no bottom padding because it does not end:
 * Figma runs it into the section below (`80px 80px 0`, corners `12px 12px 0 0`),
 * so the box is a surface the page continues over rather than a card sitting on
 * it.
 *
 * The section fades UP into `--color-surface-dark` — transparent at the top,
 * solid at the foot — which is the reverse of Heritage's wash. Mission above it
 * sits on the page background, so the band has to arrive from nothing.
 */
</script>

<template>
  <!-- One screen, like the four sections around it — `566:13603` is 1920 × 1080.
       See `Heritage` for why the height is `dvh` and not the design's ratio. -->
  <section
    class="flex snap-screen flex-col justify-center bg-[linear-gradient(180deg,transparent_0%,var(--color-surface-dark)_100%)] px-5 py-16 md:px-10 lg:px-20 lg:py-[4.17vw]"
  >
    <MotionReveal :y="40">
      <h2
        class="font-sans text-[length:var(--text-heading-section)] leading-[1.1] text-white"
      >
        {{ FRAMEWORKS_COPY.heading }}
      </h2>
    </MotionReveal>

    <!-- 64px between the heading and the panel; 3.33vw is 64/1920. -->
    <MotionReveal :y="48" :delay="STAGGER" class="mt-10 lg:mt-[3.33vw]">
      <!-- 700 of 1760 is the design's ratio, held from `lg` up so the panel
           keeps its proportions with the window; below that it drops to a height
           the sentence fits rather than a shape nothing is in. -->
      <div
        class="flex h-[280px] flex-col items-center justify-center gap-6 rounded-t-[12px] bg-[var(--color-surface-dark)] px-5 text-center lg:h-[39.77vw] lg:max-h-[700px] lg:gap-[2.92vw]"
      >
        <!-- 62 × 56 in Figma. `alt=""` and `aria-hidden` — the mark is
             decoration on a placeholder, and there is nothing for it to name. -->
        <img
          src="/assets/about/icon-frameworks-placeholder.svg"
          alt=""
          aria-hidden="true"
          width="62"
          height="56"
          class="h-10 w-auto lg:h-[min(2.92vw,56px)]"
        >

        <!-- 864 of 1920 — narrow enough that the design's own break is where the
             sentence would break anyway. -->
        <p
          class="font-sans max-w-[864px] text-[length:var(--text-body-sm)] leading-[1.5] text-[var(--color-ink-placeholder)]"
        >
          <!-- A block per line so the design's break survives without a `<br>` a
               translation would have to carry (RULES §9). -->
          <span
            v-for="line in FRAMEWORKS_COPY.placeholder"
            :key="line"
            class="block"
          >{{ line }}</span>
        </p>
      </div>
    </MotionReveal>
  </section>
</template>
