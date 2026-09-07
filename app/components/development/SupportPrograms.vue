<script setup lang="ts">
import { SUPPORT_BENEFITS, SUPPORT_COPY } from "~/content/development/support"

/**
 * Federation Support Programs — Figma node `202:15013`.
 *
 * A 452px column of claims on the left and an 1136px application card on the
 * right. The widths are Figma's and are written as fractions for the reason D14
 * records; the card is the wider half, which is unusual for this page and is the
 * point — everything above asks the reader to read, and this asks them to apply.
 *
 * This is where the page's shine begins (`207:15295` starts at the same `y`), so
 * the section sits inside the shine's stacking context on the page rather than
 * carrying a background of its own.
 */
</script>

<template>
  <section
    aria-labelledby="support-heading"
    class="flex snap-screen flex-col justify-center px-5 pt-28 pb-16 md:px-10 lg:px-20 lg:pt-[var(--nav-clearance)] lg:pb-[3.13vw]"
  >
    <div
      class="flex flex-col gap-10 menu:flex-row menu:justify-between menu:gap-[8.96vw]"
    >
      <div
        class="flex flex-col gap-5 menu:shrink-0 menu:grow-[452] menu:basis-0 lg:gap-[1.35vw]"
      >
        <MotionReveal :y="32">
          <p
            class="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-white uppercase"
          >
            {{ SUPPORT_COPY.eyebrow }}
          </p>
        </MotionReveal>

        <MotionReveal :y="40" :delay="STAGGER">
          <h2
            id="support-heading"
            class="font-display text-gold-gradient text-[length:var(--text-display-sm)] leading-[0.95] uppercase"
          >
            {{ SUPPORT_COPY.heading }}
          </h2>
        </MotionReveal>

        <MotionReveal :y="32" :delay="STAGGER * 2">
          <p class="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60">
            {{ SUPPORT_COPY.intro }}
          </p>
        </MotionReveal>

        <MotionReveal :y="24" :delay="STAGGER * 3">
          <h3 class="sr-only">{{ SUPPORT_COPY.benefitsLabel }}</h3>
          <ul class="flex list-none flex-col">
            <!-- Figma pads each row `12px 20px 12px 0` — the trailing space is
                 on the right, where nothing follows, so the row's own padding is
                 vertical only and the 20 is dropped. -->
            <li
              v-for="benefit in SUPPORT_BENEFITS"
              :key="benefit.id"
              class="flex items-center gap-2 py-3"
            >
              <!-- 32 × 32 in Figma. `alt=""` — the tick says "included", which
                   is what the list around it already says; naming it would
                   prefix every item with the word "tick". -->
              <img
                src="/assets/global/icon-check-circle.svg"
                alt=""
                width="32"
                height="32"
                class="size-6 shrink-0 lg:size-8"
              >
              <span
                class="font-display text-[length:var(--text-display-item)] leading-[1.33] text-white"
              >
                {{ benefit.text }}
              </span>
            </li>
          </ul>
        </MotionReveal>
      </div>

      <MotionReveal :y="40" :delay="STAGGER" class="menu:grow-[1136] menu:basis-0">
        <DevelopmentSupportForm />
      </MotionReveal>
    </div>
  </section>
</template>
