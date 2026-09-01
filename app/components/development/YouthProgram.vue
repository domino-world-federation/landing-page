<script setup lang="ts">
import { YOUTH_COPY, YOUTH_STATS } from "~/content/development/youth"

/**
 * Youth Development — Figma node `190:13662`.
 *
 * The page's only white band, and that is its job: everything above it is the
 * dark header and its photograph, everything below is dark again from the
 * certifications down. This is where the page opens up. Nothing shared is
 * inverted for it — the type colours and the button's outline belong to this
 * section, the same way S6 owns its own light palette.
 *
 * Three columns of Figma's own numbers: a 362px title column, then a 1259px
 * block holding the paragraph and, beside it, the two figures over the
 * curriculum button. Written as `grow`/`basis-0` fractions rather than widths
 * (D14) — the ratio is the design's intent and the pixels are not, so the
 * columns divide whatever row they are given instead of demanding 1760px of it.
 *
 * **A fixed band, not a screen** — the same shape Domino's `FormatSplit` has,
 * and for the same reason. Figma sizes this frame `hug`: 80px of padding around
 * a 280px title column, so 440 at the design width. Given `snap-screen` instead
 * it took a whole 1080 and the copy floated in the middle of an empty white
 * field, which is a different section from the one drawn. The inner row carries
 * the 280 as `14.58vw` with a floor, so the band keeps its proportion at every
 * width and stops collapsing onto its own type on a narrow desktop.
 *
 * `relative z-10` lives on the SECTION rather than on a wrapper the page puts
 * round it — again Domino's arrangement. It is what decides that this band
 * covers the photograph above it rather than the other way round, and that fact
 * belongs to the section that does the covering.
 */
</script>

<template>
  <!-- `data-nav-contrast`: a full-bleed white ground, so the header cannot stay
       transparent while this passes under it — its wordmark and menu labels are
       white. See `NavShell`. -->
  <section
    aria-labelledby="youth-heading"
    data-nav-contrast
    class="relative z-10 bg-white px-5 py-16 text-black md:px-10 lg:px-20 lg:py-[4.17vw]"
  >
    <!-- 1760 − 362 − 1259 leaves 139px between the columns at design width
         (7.24vw), which is what `space-between` resolves to there. -->
    <div
      class="flex flex-col gap-10 menu:h-[max(280px,14.58vw)] menu:flex-row menu:items-center menu:gap-[7.24vw]"
    >
      <div
        class="flex flex-col gap-6 menu:shrink-0 menu:grow-[362] menu:basis-0 menu:gap-9"
      >
        <MotionReveal :y="32">
          <p
            class="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-black uppercase"
          >
            {{ YOUTH_COPY.eyebrow }}
          </p>
        </MotionReveal>

        <!-- Bebas 76/72 in black, not the gold gradient the dark sections use:
             gold on white measures 1.9:1 against the 4.5 RULES §10 asks for,
             which is the same call S11's FAQ card made. -->
        <MotionReveal :y="40" :delay="STAGGER">
          <h2
            id="youth-heading"
            class="font-display text-[length:var(--text-display-sm)] leading-[0.95] text-black uppercase"
          >
            {{ YOUTH_COPY.heading }}
          </h2>
        </MotionReveal>
      </div>

      <div
        class="flex flex-col gap-10 menu:grow-[1259] menu:basis-0 menu:flex-row menu:items-center menu:gap-[3.13vw]"
      >
        <!-- Inter Regular 36/44 in `--color-ink-body`, the grey this site sets
             body copy in on a white ground. -->
        <MotionReveal :y="32" :delay="STAGGER" class="menu:flex-1">
          <p
            class="font-sans text-[length:var(--text-body-lg)] leading-[1.22] text-[var(--color-ink-body)]"
          >
            {{ YOUTH_COPY.intro }}
          </p>
        </MotionReveal>

        <!-- Figma stacks the figures and the button with `space-between` across
             the column's full height. `justify-between` says the same thing
             without the fixed height, so the button stays at the foot however
             the paragraph beside it wraps. -->
        <div
          class="flex flex-col items-start justify-between gap-8 menu:min-h-[14.58vw] menu:shrink-0"
        >
          <MotionReveal :y="32" :delay="STAGGER * 2">
            <!-- A description list, not two divs: each figure is the value of
                 the label under it, and `<dl>` is the one element that says
                 so. -->
            <dl class="flex flex-wrap gap-8 lg:gap-[3.13vw]">
              <div
                v-for="stat in YOUTH_STATS"
                :key="stat.id"
                class="flex flex-col gap-3 lg:gap-6"
              >
                <dt
                  class="font-sans text-[length:var(--text-body-2xl)] leading-[1.13] font-bold text-black"
                >
                  {{ stat.figure }}
                </dt>
                <dd
                  class="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-black"
                >
                  {{ stat.label }}
                </dd>
              </div>
            </dl>
          </MotionReveal>

          <!-- Node `190:14528`: a white pill with a 1px `border-light` outline,
               the label at one end and a 16px glyph at the other. Unlike the
               resource cards' pill this one IS the control — there is no card
               behind it to stretch an anchor over — so it is a real link with a
               real focus ring. -->
          <MotionReveal :y="24" :delay="STAGGER * 3">
            <a
              :href="YOUTH_COPY.downloadHref"
              :aria-label="YOUTH_COPY.downloadLabel"
              class="group rounded-btn flex w-fit items-center gap-3 border border-[var(--color-border-light)] bg-white px-6 py-4 transition-colors hover:border-[var(--color-silver-mid)] focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none"
            >
              <span
                class="font-sans text-sm leading-6 font-medium text-[var(--color-ink-pill)] uppercase lg:text-base"
              >
                {{ YOUTH_COPY.downloadCta }}
              </span>
              <span class="flex size-6 shrink-0 items-center justify-center">
                <!-- Drawn in `#1A1C1D` for light grounds, which is exactly where
                     this one sits, so no `invert`. -->
                <img
                  src="/assets/global/icon-download.svg"
                  alt=""
                  width="16"
                  height="16"
                  class="size-4 transition-transform duration-200 group-hover:translate-y-0.5"
                >
              </span>
            </a>
          </MotionReveal>
        </div>
      </div>
    </div>
  </section>
</template>
