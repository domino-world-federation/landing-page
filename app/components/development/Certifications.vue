<script setup lang="ts">
import {
  CERTIFICATIONS_COPY,
  REFEREE_GRADES,
} from "~/content/development/certifications"

// Editable in the backoffice's page editor; the constants are the fallback.
const copy = usePageCopy("development")
/**
 * **Two plain numbered lists since 2026-10-08** — the DWF team's revision. The
 * left column used to be three selectable grade tabs (C, B, A) that swapped the
 * ladder on the right; it is now a read-only list drawn exactly like the right
 * one, numbered 01–03 by position, and the right column always shows the one
 * list the team publishes (stored under the first grade's levels, which is
 * where it was already being edited).
 */
const areas = computed(() =>
  REFEREE_GRADES.map((grade, i) => {
    const cms = `certifications.grades.${i}`
    return {
      id: grade.id,
      marker: String(i + 1).padStart(2, "0"),
      title: copy.text(`${cms}.name`, grade.name),
      body: copy.text(`${cms}.scope`, grade.scope),
      cmsKeys: { title: `${cms}.name`, body: `${cms}.scope` },
    }
  }),
)

const priorities = computed(() => {
  const first = REFEREE_GRADES[0]!
  return first.levels.map((level, j) => {
    const cms = `certifications.${first.id}_levels.${j}`
    return {
      ...level,
      cms,
      marker: copy.text(`${cms}.marker`, level.marker),
      title: copy.text(`${cms}.title`, level.title),
      body: copy.text(`${cms}.body`, level.body),
    }
  })
})
</script>

<template>
  <section
    aria-labelledby="certifications-heading"
    class="flex flex-col justify-center bg-[linear-gradient(180deg,var(--color-bg)_0%,var(--color-surface-dark)_100%)] pt-16 pb-16 lg:snap-screen lg:pt-[var(--nav-clearance)] lg:pb-[4.17vw]"
  >
    <!-- The section pads top and bottom only (`80px 0px`); its two children
         carry the 80px sides themselves. Reproduced rather than flattened
         because the 80px gap between the title and the row is vertical and would
         otherwise have to be re-stated on both. -->
    <div class="flex flex-col gap-10 lg:gap-[4.17vw]">
      <div class="flex flex-col gap-6 px-5 md:px-10 lg:gap-9 lg:px-20">
        <MotionReveal :y="32">
          <p
            v-cms="'certifications.eyebrow'"
            class="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-white uppercase"
          >
            {{ copy.text('certifications.eyebrow', CERTIFICATIONS_COPY.eyebrow) }}
          </p>
        </MotionReveal>

        <MotionReveal :y="40" :delay="STAGGER">
          <h2
            id="certifications-heading"
            v-cms="'certifications.heading'"
            class="font-display w-fit text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
          >
            {{ copy.text('certifications.heading', CERTIFICATIONS_COPY.heading) }}
          </h2>
        </MotionReveal>
      </div>

      <!-- 760 for the areas and the rest for the priorities, with Figma's
           100px between them (5.21vw), written as fractions for the reason D14
           records. Both columns are the same list now — number, title,
           description down a dotted rail — each under its own subtitle. -->
      <div
        class="flex flex-col gap-10 px-5 md:px-10 menu:flex-row menu:gap-[5.21vw] lg:px-20"
      >
        <div class="flex flex-col gap-6 menu:grow-[760] menu:basis-0 lg:gap-9">
          <h3
            v-cms="'certifications.areas_label'"
            class="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-white/60 uppercase"
          >
            {{ copy.text('certifications.areas_label', CERTIFICATIONS_COPY.areasLabel) }}
          </h3>
          <DevelopmentCertificationLadder :levels="areas" />
        </div>

        <div class="flex flex-col gap-6 menu:grow-[900] menu:basis-0 lg:gap-9">
          <h3
            v-cms="'certifications.priorities_label'"
            class="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-white/60 uppercase"
          >
            {{ copy.text('certifications.priorities_label', CERTIFICATIONS_COPY.prioritiesLabel) }}
          </h3>
          <DevelopmentCertificationLadder :levels="priorities" />
        </div>
      </div>
    </div>
  </section>
</template>
