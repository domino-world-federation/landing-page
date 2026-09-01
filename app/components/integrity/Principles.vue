<script setup lang="ts">
import { INTEGRITY_COPY, INTEGRITY_PRINCIPLES } from "~/content/integrity"

/**
 * Core Principles — Figma node `601:17853`.
 *
 * The page's only white band, and the one the photograph above is covered by. A
 * 362px title column and four principles wrapping 2 × 2 in a 1259px block.
 *
 * **A fixed band, not a screen** — the shape Domino's `FormatSplit`,
 * Development's `YouthProgram` and Governance's `Overview` all have. Figma sizes
 * the frame `hug` around a 280px title column, but the four principles are
 * taller than that, so the floor is theirs: the row is `auto` and only the title
 * column carries the design's 280.
 *
 * `relative z-10` lives on the SECTION rather than on a wrapper the page puts
 * round it. It is what decides that this band covers the photograph, and that
 * fact belongs to the section doing the covering.
 */
const LABEL =
  "font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-black uppercase"
</script>

<template>
  <!-- `data-nav-contrast`: a full-bleed white ground, so the header cannot stay
       transparent while this passes under it. See `NavShell`. -->
  <section
    aria-labelledby="principles-heading"
    data-nav-contrast
    class="relative z-10 bg-white px-5 py-16 text-black md:px-10 lg:px-20 lg:py-[4.17vw]"
  >
    <div class="flex flex-col gap-10 menu:flex-row menu:items-start menu:gap-[7.24vw]">
      <MotionReveal
        :y="40"
        class="menu:h-[max(280px,14.58vw)] menu:shrink-0 menu:grow-[362] menu:basis-0"
      >
        <!-- Bebas 76/72 in black, not the gold gradient the dark sections use:
             gold on white measures 1.9:1 against the 4.5 RULES §10 asks for. -->
        <h2
          id="principles-heading"
          class="font-display text-[length:var(--text-display-sm)] leading-[0.95] text-black uppercase"
        >
          {{ INTEGRITY_COPY.principlesHeading }}
        </h2>
      </MotionReveal>

      <!-- A `<dl>`: each principle is a name and what it commits the federation
           to. 2 × 2 from `menu`, which is where the 1259px block has room for
           two 599px columns. -->
      <dl
        class="grid gap-10 menu:grow-[1259] menu:basis-0 menu:grid-cols-2 menu:gap-x-[3.13vw] menu:gap-y-9"
      >
        <div
          v-for="(principle, i) in INTEGRITY_PRINCIPLES"
          :key="principle.id"
          class="flex flex-col gap-6 menu:gap-9"
        >
          <MotionReveal :y="24" :delay="i * 0.06">
            <dt :class="LABEL">{{ principle.label }}</dt>
          </MotionReveal>
          <dd
            class="font-sans text-[length:var(--text-heading-card)] leading-[1.22] text-[#3F3F3F]"
          >
            {{ principle.detail }}
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
