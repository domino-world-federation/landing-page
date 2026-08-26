<script setup lang="ts">
import {
  CERTIFICATIONS_COPY,
  REFEREE_GRADES,
} from "~/content/development/certifications"

/**
 * Official Certifications — Figma node `190:13674`.
 *
 * The band that carries the page from the white youth section back into the
 * dark. Its fill is Figma's own `#0E0E0E → #262626` top-down wash, which is why
 * it meets the section above it at the page background and hands the section
 * below it `--color-surface-dark` — the same pair About's Heritage and Vision
 * use to meet without a seam.
 *
 * Two lists side by side, and they are two different ladders rather than one: on
 * the left the three referee grades, on the right the three coaching levels.
 * Figma gives neither a heading of its own, so each gets an `sr-only` one — an
 * unnamed list is not navigable, and printing a heading the design does not draw
 * would be the louder change.
 */
</script>

<template>
  <section
    aria-labelledby="certifications-heading"
    class="bg-[linear-gradient(180deg,var(--color-bg)_0%,var(--color-surface-dark)_100%)] py-16 lg:py-[4.17vw]"
  >
    <!-- The section pads top and bottom only (`80px 0px`); its two children
         carry the 80px sides themselves. Reproduced rather than flattened
         because the 80px gap between the title and the row is vertical and would
         otherwise have to be re-stated on both. -->
    <div class="flex flex-col gap-10 lg:gap-[4.17vw]">
      <div class="flex flex-col gap-6 px-5 md:px-10 lg:gap-9 lg:px-20">
        <MotionReveal :y="32">
          <p
            class="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-white uppercase"
          >
            {{ CERTIFICATIONS_COPY.eyebrow }}
          </p>
        </MotionReveal>

        <MotionReveal :y="40" :delay="STAGGER">
          <h2
            id="certifications-heading"
            class="font-display w-fit bg-[image:var(--gradient-gold-text)] bg-clip-text text-[length:var(--text-display-sm)] leading-[0.95] text-transparent uppercase"
          >
            {{ CERTIFICATIONS_COPY.heading }}
          </h2>
        </MotionReveal>
      </div>

      <!-- 760 for the grades and the rest for the ladder, with Figma's 100px
           between them (5.21vw). The grade column is the one with a fixed width
           in the design, and it is written as a fraction for the reason D14
           records — a fixed 760 plus a 100 gutter is a 860px demand that a 1024
           window cannot pay while still leaving the ladder a column. -->
      <div
        class="flex flex-col gap-10 px-5 md:px-10 menu:flex-row menu:gap-[5.21vw] lg:px-20"
      >
        <div class="flex flex-col gap-4 menu:grow-[760] menu:basis-0 lg:gap-6">
          <h3 class="sr-only">{{ CERTIFICATIONS_COPY.gradesLabel }}</h3>

          <ul class="flex list-none flex-col gap-4 lg:gap-6">
            <li v-for="(grade, i) in REFEREE_GRADES" :key="grade.id" class="flex">
              <MotionReveal :y="24" :delay="STAGGER * i" class="w-full">
                <!-- Node `192:14573`: a 24px-radius row at 50% of
                     `surface-card`, padded 16 with an extra 8 on the right where
                     the badge already supplies the left. -->
                <div
                  class="rounded-[var(--radius-panel)] bg-[var(--color-surface-card)]/50 flex items-center gap-5 p-4 pr-6"
                >
                  <!-- The badge — a 108px column at 16% white, the letter over
                       the word "GRADE". -->
                  <div
                    class="flex w-20 shrink-0 flex-col items-center gap-1 rounded-[var(--radius-glass)] bg-white/16 py-2 lg:w-[5.63vw]"
                  >
                    <span
                      class="font-sans text-[length:var(--text-body-xl)] leading-[1.17] font-semibold text-white"
                    >
                      {{ grade.letter }}
                    </span>
                    <span
                      class="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60 uppercase"
                    >
                      {{ CERTIFICATIONS_COPY.gradeWord }}
                    </span>
                  </div>

                  <div class="flex flex-col gap-2 lg:gap-3">
                    <h4
                      class="font-display text-[length:var(--text-display-year)] leading-[1.15] text-white"
                    >
                      {{ grade.name }}
                    </h4>
                    <p
                      class="font-sans text-[length:var(--text-eyebrow)] leading-7 text-white/60"
                    >
                      {{ grade.scope }}
                    </p>
                  </div>
                </div>
              </MotionReveal>
            </li>
          </ul>
        </div>

        <div class="menu:grow-[900] menu:basis-0">
          <h3 class="sr-only">{{ CERTIFICATIONS_COPY.levelsLabel }}</h3>
          <DevelopmentCertificationLadder />
        </div>
      </div>
    </div>
  </section>
</template>
