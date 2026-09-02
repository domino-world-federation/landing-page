<script setup lang="ts">
import {
  APPLICATION_STEPS,
  ELIGIBILITY_REQUIREMENTS,
  PLAYER_MEMBERSHIP_COPY,
} from "~/content/player-membership"

/**
 * Who can apply, and how — Figma `629:28600`, 1920 × 1080.
 *
 * Two columns 100px apart, each a gold heading over an intro and a list. One
 * section rather than two because the design draws one frame: the requirements
 * on the left ARE what the steps on the right ask for, and splitting them would
 * put a snap stop between a question and its answer.
 *
 * The two lists are different shapes and both are `<ol>`/`<ul>` on purpose —
 * the requirements are a set (a tick each, no order), the steps are a sequence
 * (numbered, and the numbers come from the list rather than from the data).
 */
const ELIGIBILITY = PLAYER_MEMBERSHIP_COPY.eligibility
const PROCESS = PLAYER_MEMBERSHIP_COPY.process
</script>

<template>
  <!-- The frame's own fall from the page's black to nothing, which is what hands
       this section over to the shine behind the one after it. -->
  <section
    aria-labelledby="apply-heading"
    class="flex snap-screen flex-col justify-center gap-10 bg-[linear-gradient(180deg,var(--color-bg)_0%,transparent_100%)] px-5 pt-28 pb-16 md:px-10 lg:gap-[4.17vw] lg:px-20 lg:pt-[max(var(--nav-clearance),7.29vw)] lg:pb-[4.17vw]"
  >
    <h2 id="apply-heading" class="sr-only">
      {{ ELIGIBILITY.heading }}
    </h2>

    <div class="flex flex-col gap-12 lg:flex-row lg:gap-[5.21vw]">
      <div class="flex flex-1 flex-col gap-6 lg:gap-9">
        <MotionReveal :y="40" blur-from="10px">
          <p
            class="font-display w-fit text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
          >
            {{ ELIGIBILITY.heading }}
          </p>
        </MotionReveal>

        <MotionReveal :y="32" :delay="STAGGER">
          <div class="flex flex-col gap-6 lg:gap-9">
            <p
              class="font-sans text-[length:var(--text-body-sm)] leading-[1.5] text-white/40"
            >
              {{ ELIGIBILITY.intro }}
            </p>

            <!-- `629:28606`: a 36px tick and a line of 20/28, 36 apart. The
                 tick is `aria-hidden` — a list of requirements read out as
                 "tick, tick, tick" is the glyph announced five times and the
                 requirement never. -->
            <ul class="flex flex-col gap-6 lg:gap-9">
              <li
                v-for="requirement in ELIGIBILITY_REQUIREMENTS"
                :key="requirement"
                class="flex items-center gap-3"
              >
                <img
                  src="/assets/global/icon-check-circle.svg"
                  alt=""
                  aria-hidden="true"
                  width="36"
                  height="36"
                  class="size-9 shrink-0"
                >
                <span
                  class="font-sans text-[length:var(--text-eyebrow)] leading-7 text-white"
                >
                  {{ requirement }}
                </span>
              </li>
            </ul>
          </div>
        </MotionReveal>
      </div>

      <div class="flex flex-1 flex-col gap-6 lg:gap-9">
        <MotionReveal :y="40" :delay="STAGGER" blur-from="10px">
          <h3
            class="font-display w-fit text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] uppercase"
          >
            {{ PROCESS.heading }}
          </h3>
        </MotionReveal>

        <MotionReveal :y="32" :delay="STAGGER * 2">
          <div class="flex flex-col gap-6 lg:gap-9">
            <p
              class="font-sans text-[length:var(--text-body-sm)] leading-[1.5] text-white/40"
            >
              {{ PROCESS.intro }}
            </p>

            <!-- `629:28626`. The step's number is the list's own — `<ol>` counts
                 and the marker is drawn from the counter, so a step inserted in
                 the middle cannot leave the numbering behind the way a number in
                 the data would. -->
            <ol class="flex list-none flex-col gap-7">
              <li
                v-for="(step, i) in APPLICATION_STEPS"
                :key="step.id"
                class="flex items-center gap-3"
              >
                <span
                  aria-hidden="true"
                  class="font-sans text-[length:var(--text-eyebrow)] leading-7 text-white"
                >
                  {{ i + 1 }}.
                </span>

                <div class="flex flex-col gap-3">
                  <!-- Inter Bold 20/28 (`629:28630`). -->
                  <p
                    class="font-sans text-[length:var(--text-eyebrow)] leading-7 font-bold text-white"
                  >
                    {{ step.title }}
                  </p>
                  <p
                    class="font-sans text-[length:var(--text-eyebrow)] leading-7 text-white/40"
                  >
                    {{ step.body }}
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </MotionReveal>
      </div>
    </div>
  </section>
</template>
