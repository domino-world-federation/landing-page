<script setup lang="ts">
import { getMembershipStats } from "~/lib/api/client"
import { MEMBERS_COPY } from "~/content/members"

/**
 * The members hero — Figma node `401:19063`, 1920 × 1080 full bleed.
 *
 * This page does NOT open on the header band the other inner pages share. It
 * opens on a centred title over a gradient with a gold pill under it and four
 * figures across the foot, and that is the design's call rather than an
 * oversight to correct: the band is for pages that are documents or archives,
 * and this one is a pitch (D64).
 *
 * The title is not run through `SharpeningHeadline` for the same reason — Figma
 * gives it no `blur(7.5px)` start (`401:19069`), unlike every header-band title
 * in the file. Nothing to clear from, so nothing clears.
 *
 * **The vertical rhythm is measured, not flowed.** Figma positions all four
 * pieces absolutely — content at y:214, pill at 604, figures at 805 — and an
 * evenly-gapped column does not reproduce that: it centres everything and the
 * glow ends up behind the wrong element. The gaps below are the design's own
 * distances written as `vw` against the 1920 canvas, so the block is exact at
 * the design width and stays proportional either side of it.
 */
const { data: stats } = await useAsyncData(
  "members-stats",
  () => getMembershipStats(),
  { default: () => [] },
)
</script>

<template>
  <!-- `isolate` so the glow can sit at `-z-10` without sliding behind the
       section's own background. -->
  <section
    class="relative isolate flex min-h-[640px] flex-col items-center overflow-hidden bg-linear-to-b from-[#262626] to-[#0e0e0e] px-5 pt-36 pb-16 md:px-10 lg:min-h-[56.25vw] lg:px-20 lg:pt-[11.15vw] lg:pb-[5.36vw]"
  >
    <!-- `401:19068` — a blurred radial wash arcing across the middle of the
         block, behind the pill.

         Placed against the EXPORT's box rather than the node's. Figma reports
         the layer as 1920 × 435 at y:480, but the file comes out 2120 × 635: the
         50px blur bleeds 100px past the shape on every side. Positioning it by
         the node's numbers would therefore sit it 100px low and 200px narrow, so
         the extra is added back — 2120/1920 wide, and a top of (480 − 100)/1080.

         The asset is also HAND-EDITED: Figma exported the layer blur as
         `stdDeviation="50"` and it rendered as a brown haze rather than the
         bright arc on the canvas. It is 25 in the file, checked against a
         screenshot of this page. A re-export undoes that — there is a note
         inside the SVG saying so.

         `pointer-events-none` so it cannot swallow a click on the pill over
         it. -->
    <img
      src="/assets/members/decor-hero-glow.svg"
      alt=""
      aria-hidden
      class="pointer-events-none absolute top-[35.2%] left-1/2 -z-10 w-[110.42%] max-w-none -translate-x-1/2"
    >

    <div class="flex w-full max-w-[1200px] flex-col items-center gap-8 lg:gap-16">
      <!-- Inter Medium 84, centred. -->
      <h1
        class="font-sans text-center text-[length:var(--text-page-title)] leading-[1.1] font-medium text-white"
      >
        {{ MEMBERS_COPY.heroTitle }}
      </h1>

      <!-- 728 of the design's 1920, centred under the title. -->
      <p
        class="font-sans max-w-[728px] text-center text-[length:var(--text-eyebrow)] leading-8 text-white/60"
      >
        {{ MEMBERS_COPY.heroIntro }}
      </p>
    </div>

    <!-- 604 − 443 = 161px below the copy at the design width. `401:19075` is the
         landing page's gold pill exactly — the same radial fill, the same 3px
         conic stroke, the same glow, the same 48px radius and Bebas 36 label
         through the ink gradient. So it is `GoldCta`, not a second button that
         happens to look like it. -->
    <UiGoldCta
      :href="MEMBERS_COPY.heroCtaHref"
      class="mt-10 lg:mt-[8.39vw] lg:w-[340px]"
    >
      {{ MEMBERS_COPY.heroCta }}
    </UiGoldCta>

    <!-- `404:19188` — four figures across the foot, 129px below the pill. A
         `<dl>` because each is a label and a value; the design puts the value
         above the label, which `flex-col-reverse` gives without reversing the
         markup. -->
    <dl
      class="mt-12 flex w-full flex-wrap items-start justify-center gap-x-3 gap-y-10 lg:mt-[6.72vw]"
    >
      <div
        v-for="stat in stats"
        :key="stat.id"
        class="flex w-[calc(50%-0.75rem)] flex-col-reverse items-center gap-6 lg:w-[400px]"
      >
        <dt
          class="font-sans text-center text-[length:var(--text-body-md)] leading-[1.25] font-medium text-white/80"
        >
          {{ stat.label }}
        </dt>
        <!-- Bebas 100 through the page's gold gradient. The gradient is painted
             through the glyphs, so it has to stay on the element the text is in
             — `CountUp` renders spans inside this one and none of them
             re-declare a fill. -->
        <dd
          class="font-display bg-[image:var(--gradient-gold-text)] bg-clip-text text-center text-[length:var(--text-display-statement)] leading-none text-transparent"
        >
          <MotionCountUp :value="stat.value" />
        </dd>
      </div>
    </dl>
  </section>
</template>
