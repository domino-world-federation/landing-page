<script setup lang="ts">
import { GOVERNANCE_COPY } from "~/content/governance"

/**
 * Overview — Figma node `613:24895`.
 *
 * The page's only white band, and that is its job: everything above it is the
 * dark header and its photograph, everything below is dark again. This is where
 * the page states what the federation IS.
 *
 * **A fixed band, not a screen** — the shape Domino's `FormatSplit` and
 * Development's `YouthProgram` have. Figma sizes the frame `hug`: 80px of
 * padding around a 280px title column, so 440 at the design width. The inner row
 * carries the 280 as `14.58vw` with a floor, so the band keeps its proportion at
 * every width and stops collapsing onto its own type on a narrow desktop.
 *
 * `relative z-10` lives on the SECTION rather than on a wrapper the page puts
 * round it. It is what decides that this band covers the photograph above it
 * rather than the other way round, and that fact belongs to the section doing
 * the covering.
 *
 * Three columns of Figma's own numbers: a 362px title column, then a 1259px
 * block holding two paragraphs. Written as `grow`/`basis-0` fractions rather
 * than widths (D14) — the ratio is the design's intent and the pixels are not.
 */

const COPY = GOVERNANCE_COPY.overview

const LABEL =
  "font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-black uppercase"
const BODY =
  "font-sans text-[length:var(--text-heading-card)] leading-[1.22] text-[#3F3F3F]"
</script>

<template>
  <!-- `data-nav-contrast`: a full-bleed white ground, so the header cannot stay
       transparent while this passes under it — its wordmark and menu labels are
       white. See `NavShell`. -->
  <section
    aria-labelledby="governance-overview-heading"
    data-nav-contrast
    class="relative z-10 bg-white px-5 py-16 text-black md:px-10 lg:px-20 lg:py-[4.17vw]"
  >
    <!-- 1760 − 362 − 1259 leaves 139px between the columns at design width
         (7.24vw), which is what `space-between` resolves to there. -->
    <div
      class="flex flex-col gap-10 menu:h-[max(280px,14.58vw)] menu:flex-row menu:items-start menu:gap-[7.24vw]"
    >
      <div
        class="flex flex-col gap-6 menu:shrink-0 menu:grow-[362] menu:basis-0 menu:gap-9"
      >
        <MotionReveal :y="32">
          <p :class="LABEL">{{ COPY.eyebrow }}</p>
        </MotionReveal>

        <!-- Bebas 76/72 in black, not the gold gradient the dark sections use:
             gold on white measures 1.9:1 against the 4.5 RULES §10 asks for. -->
        <MotionReveal :y="40" :delay="STAGGER">
          <h2
            id="governance-overview-heading"
            class="font-display text-[length:var(--text-display-sm)] leading-[0.95] text-black uppercase"
          >
            {{ COPY.heading }}
          </h2>
        </MotionReveal>
      </div>

      <!-- A `<dl>`: each column is a label and the paragraph it heads. -->
      <dl
        class="flex flex-col gap-10 menu:grow-[1259] menu:basis-0 menu:flex-row menu:gap-[3.13vw]"
      >
        <div class="flex flex-1 flex-col gap-6 menu:gap-9">
          <dt :class="LABEL">{{ COPY.mandateLabel }}</dt>
          <dd :class="BODY">{{ COPY.mandate }}</dd>
        </div>
        <div class="flex flex-1 flex-col gap-6 menu:gap-9">
          <dt :class="LABEL">{{ COPY.missionLabel }}</dt>
          <dd :class="BODY">{{ COPY.mission }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>
