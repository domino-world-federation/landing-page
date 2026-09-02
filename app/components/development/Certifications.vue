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

/**
 * Which grade the strip is showing. `C` first — the list runs entry-level
 * upwards, so the tab a reader lands on is the one they are most likely to be
 * asking about, and the ladder reads in its own direction from there.
 */
const activeGradeId = ref(REFEREE_GRADES[0]!.id)

const activeGrade = computed(
  () =>
    REFEREE_GRADES.find((grade) => grade.id === activeGradeId.value)
    ?? REFEREE_GRADES[0]!,
)
</script>

<template>
  <section
    aria-labelledby="certifications-heading"
    class="flex snap-screen flex-col justify-center bg-[linear-gradient(180deg,var(--color-bg)_0%,var(--color-surface-dark)_100%)] pt-28 pb-16 lg:pt-[var(--nav-clearance)] lg:pb-[4.17vw]"
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
            class="font-display w-fit text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
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
        <!-- **The design's three rows, and each one selects.** They stay stacked
             exactly as `192:14573` draws them — badge, name, scope — because
             that is the shape a reader scans a ladder in. What the press changes
             is the column beside them: the pathway on the right answers the
             grade, where it used to be one fixed ladder standing next to three
             rows it had no relationship with.

             `role="tablist"` with `aria-selected` / `aria-controls` rather than
             three plain buttons: a screen reader is told this is a set of three,
             which one is current, and that the panel opposite belongs to it —
             none of which the visual highlight says on its own. Same
             construction the Rulebook's format strip uses.

             `text-left` because a `<button>` centres its content by default, and
             these rows are read rather than pressed like a pill. -->
        <div
          role="tablist"
          :aria-label="CERTIFICATIONS_COPY.gradesLabel"
          class="flex flex-col gap-4 menu:grow-[760] menu:basis-0 lg:gap-6"
        >
          <h3 class="sr-only">{{ CERTIFICATIONS_COPY.gradesLabel }}</h3>

          <MotionReveal
            v-for="(grade, i) in REFEREE_GRADES"
            :key="grade.id"
            :y="24"
            :delay="STAGGER * i"
            class="w-full"
          >
            <button
              type="button"
              role="tab"
              :aria-selected="grade.id === activeGradeId"
              aria-controls="certification-pathway"
              :class="
                cn(
                  'focus-visible:ring-gold flex w-full items-center gap-5 rounded-[var(--radius-panel)] p-4 pr-6 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  // **Only the selected row has a ground.** The other two sit
                  // on the page itself, so the panel IS the selection rather
                  // than a shade of it — at 50% against 100% the three read as
                  // three panels of slightly different greys, a difference the
                  // eye has to measure rather than see. The badge keeps its own
                  // square on every row, which is what still marks them a set.
                  grade.id === activeGradeId
                    ? 'bg-[var(--color-surface-card)]'
                    : 'bg-transparent hover:bg-[var(--color-surface-card)]/40',
                )
              "
              @click="activeGradeId = grade.id"
            >
              <!-- The badge — a 108px column at 16% white, the letter over the
                   word "GRADE". -->
              <span
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
              </span>

              <span class="flex min-w-0 flex-1 flex-col gap-2 lg:gap-3">
                <span
                  class="font-display text-[length:var(--text-display-year)] leading-[1.15] text-white"
                >
                  {{ grade.name }}
                </span>
                <span
                  class="font-sans text-[length:var(--text-eyebrow)] leading-7 text-white/60"
                >
                  {{ grade.scope }}
                </span>
              </span>

              <!-- `601:19349` — a bare 48px outline arrow, NOT a glyph in a dark
                   square. The square is the federation register's treatment and
                   it was wrong here: that list sits on a photograph and needs a
                   ground under its control, where this row already has one of
                   its own and a second filled shape inside it is a panel within
                   a panel.

                   Drawn rather than fetched: three points and a stroke cost less
                   than the request would, and `currentColor` is what lets it
                   take the row's own colour without a second file.

                   It marks the selected row rather than every row: on all three
                   it is decoration, on one it says which pathway the column
                   opposite is showing. `aria-hidden` because the button around
                   it already carries the name. -->
              <svg
                v-if="grade.id === activeGradeId"
                aria-hidden="true"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                class="size-9 shrink-0 text-white lg:size-12"
              >
                <path
                  d="M9 5.5 L15.5 12 L9 18.5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </MotionReveal>
        </div>

        <div
          id="certification-pathway"
          role="tabpanel"
          class="menu:grow-[900] menu:basis-0"
        >
          <h3 class="sr-only">{{ CERTIFICATIONS_COPY.levelsLabel }}</h3>
          <!-- `:key` so the pathway re-enters when the grade changes: swapped in
               place, three blocks of copy changing under the reader read as a
               glitch rather than as an answer to the press. -->
          <DevelopmentCertificationLadder
            :key="activeGrade.id"
            :levels="activeGrade.levels"
          />
        </div>
      </div>
    </div>
  </section>
</template>
