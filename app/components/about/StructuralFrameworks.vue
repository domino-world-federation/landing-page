<script setup lang="ts">
import { FRAMEWORKS_COPY } from "~/content/about/frameworks"

/**
 * Structural Frameworks — Figma node `1097:3096`, with the DWF team's org chart
 * (2026-10-23) in the panel. The team's revision replaces the whole of what
 * the design drew there as "Our Global Network": the heading, the paragraph
 * beside it, the chart of the federation over three national federations and
 * the caption under it. The national federations cannot be listed yet, and the
 * paragraph and caption were both about them.
 *
 * **The chart is a figure, not a list of links.** Four officers in one column —
 * the President in the apex's gold, the rest in the design's steel — and the
 * three bodies the last officer branches into. It reads in DOM order as the line of command said aloud; the
 * connectors are `aria-hidden` because they only restate that order.
 *
 * **Everything is a fraction of the 1360px chart** (D14): a column is 400 of it
 * (29.41%), the gap 80 (5.88%), so a column's centre sits at 14.71%, 50% and
 * 85.29% — which is where the branches have to land. Written as those
 * percentages, the connectors stay on the cards at every width without being
 * measured. The officers take the middle column's width.
 *
 * **The branches are two boxes a side**, each drawing two edges of the path:
 * one curves off the trunk and runs sideways, the other picks the horizontal up
 * and turns it down onto the card. Their horizontals overlap on the same line,
 * so the join cannot show; each stops a radius short of the other's corner so
 * neither box's square end pokes past the curve.
 *
 * **One screen, never more** (repo owner's call): from `lg` the section is
 * exactly `100dvh` and the panel takes whatever the heading row leaves. So
 * every size in the chart is written in `--u`, which is `min(1vw, 1.7778dvh)`
 * — a design pixel at 1920 × 1080, and whichever axis runs out first
 * everywhere else. In `vw` alone a wide, short window (1920 × 900) keeps the
 * chart at full size and pushes its foot off the screen.
 *
 * Below `lg` the three bodies stack under the officers and the branches are not
 * drawn; one drop joins the treasurer to the first of them.
 *
 * The panel has no bottom radius and runs into the section below, as the
 * placeholder did. The section fades UP into `--color-surface-dark` —
 * transparent at the top, solid at the foot — so the band arrives from the page
 * background Mission sits on.
 */
// Editable in the backoffice's page editor; the constants are the fallback.
const copy = usePageCopy("about")
const CHART = computed(() => ({
  officers: copy.lines("frameworks.officers", FRAMEWORKS_COPY.chart.officers),
  bodies: copy.lines("frameworks.bodies", FRAMEWORKS_COPY.chart.bodies),
}))
</script>

<template>
  <!-- `--nav-clearance` under the head, like every other stop on this page:
       the section comes to rest under the fixed bar. No bottom padding from
       `lg` — the panel runs to the foot of the screen and into the section
       below, as Figma draws it (`140px 80px 0`). -->
  <section
    aria-labelledby="frameworks-heading"
    class="flex snap-screen flex-col bg-[linear-gradient(180deg,transparent_0%,var(--color-surface-dark)_100%)] px-5 pt-28 pb-16 [--u:min(1vw,1.7778dvh)] md:px-10 lg:h-dvh lg:min-h-0 lg:px-20 lg:pt-[var(--nav-clearance)] lg:pb-0"
  >
    <MotionReveal :y="40">
      <!-- The gold statement heading `Mission` uses — Bebas 100/108 under the
           `text-gold-gradient` sweep. `w-fit` is not decoration: the sweep is
           `bg-clip-text`, painted across the element's box before it is clipped
           to the glyphs, so the box has to hug the type. -->
      <h2
        id="frameworks-heading"
        v-cms="'frameworks.heading'"
        class="font-display w-fit text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] lg:text-[length:calc(var(--u)*5.2083)]"
      >
        {{ copy.text('frameworks.heading', FRAMEWORKS_COPY.heading) }}
      </h2>
    </MotionReveal>

    <MotionReveal
      :y="48"
      :delay="STAGGER"
      class="mt-10 flex min-h-0 flex-1 flex-col lg:mt-[calc(var(--u)*2.5)]"
    >
      <!-- 50px top corners (`1097:3098`). The chart is centred in whatever
           height the screen leaves. Named by the section heading, since it has
           no caption of its own. -->
      <figure
        aria-labelledby="frameworks-heading"
        class="flex flex-1 flex-col items-center justify-center rounded-t-[24px] bg-[var(--color-surface-dark)] px-5 py-8 lg:gap-[calc(var(--u)*2.6)] lg:rounded-t-[calc(var(--u)*2.6)] lg:px-0 lg:py-[calc(var(--u)*2)]"
      >
        <!-- 1360 of 1920. The custom properties are the connectors' stroke
             (8px), corner radius (20px) and the drop between officers (40px)
             at 1920. -->
        <div
          class="flex w-full max-w-[480px] flex-col [--drop:calc(var(--u)*2.0833)] [--line:max(3px,calc(var(--u)*0.4167))] [--r:calc(var(--u)*1.0417)] lg:w-[calc(var(--u)*70.83)] lg:max-w-none"
        >
          <template v-for="(officer, i) in CHART.officers" :key="i">
            <!-- The drop above each officer but the first: gold out of the
                 President, grey, light at the top, between the rest. -->
            <span
              v-if="i > 0"
              aria-hidden="true"
              class="mx-auto h-8 w-[var(--line)] lg:h-[var(--drop)]"
              :class="i === 1 ? 'bg-[#E1B762]' : 'bg-[linear-gradient(180deg,#B8B8B8_0%,#525252_100%)]'"
            />

            <!-- The President is the apex (`1097:3102`): the radial gold, a
                 white hairline, the glow, and the emblem at 20% behind the
                 type. -->
            <div
              v-if="i === 0"
              class="relative mx-auto flex w-full items-center justify-center overflow-hidden rounded-xl border border-white bg-[radial-gradient(circle_at_50%_50%,#F1C977_0%,#A57F40_100%)] px-5 py-5 text-center shadow-[0_0_24px_0_#E1B762,0_0_6px_0_#E1B762,inset_0_0_16px_0_rgba(255,255,255,0.8)] lg:w-[29.41%] lg:py-[calc(var(--u)*0.83)]"
            >
              <img
                src="/assets/about/decor-frameworks-emblem.svg"
                alt=""
                aria-hidden="true"
                width="146"
                height="158"
                class="pointer-events-none absolute top-1/2 left-1/2 h-[120px] w-auto -translate-x-1/2 -translate-y-1/2 opacity-60 lg:h-[calc(var(--u)*5.5)]"
              >
              <p
                v-cms="'frameworks.officers'"
                class="font-display relative bg-[linear-gradient(180deg,#1A1307_0%,#523E1D_100%)] bg-clip-text text-[length:var(--text-display-node)] leading-none text-transparent lg:text-[length:calc(var(--u)*3.125)]"
              >
                {{ officer }}
              </p>
            </div>

            <!-- `1097:3106`: a pale steel face with a gradient edge — two
                 backgrounds, one clipped to the padding and one to the border,
                 since `border-image` cannot round. -->
            <div
              v-else
              class="mx-auto flex w-full items-center justify-center rounded-xl border-2 border-transparent px-5 py-4 text-center [background:linear-gradient(180deg,#8F8F8F_0%,#E2E2E2_100%)_padding-box,linear-gradient(0deg,#525252_0%,#828282_100%)_border-box] shadow-[inset_0_0_16px_0_rgba(255,255,255,0.8)] lg:w-[29.41%] lg:py-[calc(var(--u)*1.04)]"
            >
              <p
                v-cms="'frameworks.officers'"
                class="font-display text-[length:var(--text-display-node)] leading-none text-[#2B2B2B] lg:text-[length:calc(var(--u)*2.5)]"
              >
                {{ officer }}
              </p>
            </div>
          </template>

          <!-- Below `lg`: one drop onto the stacked bodies. -->
          <span
            aria-hidden="true"
            class="mx-auto h-8 w-[var(--line)] bg-[linear-gradient(180deg,#B8B8B8_0%,#525252_100%)] lg:hidden"
          />

          <!-- The branches, 96px tall at 1920. `lg` only. -->
          <div
            aria-hidden="true"
            class="relative hidden h-[calc(var(--u)*5)] [--c:#808080] lg:block"
          >
            <span
              class="absolute inset-y-0 left-1/2 w-[var(--line)] -translate-x-1/2 bg-[var(--c)]"
            />
            <span
              class="absolute top-0 right-[calc(50%-var(--line)/2)] left-[calc(14.705%+var(--r))] h-[calc(50%+var(--line)/2)] rounded-br-[var(--r)] border-r-[length:var(--line)] border-b-[length:var(--line)] border-[var(--c)]"
            />
            <span
              class="absolute top-[calc(50%-var(--line)/2)] right-[calc(50%+var(--r))] bottom-0 left-[calc(14.705%-var(--line)/2)] rounded-tl-[var(--r)] border-t-[length:var(--line)] border-l-[length:var(--line)] border-[var(--c)]"
            />
            <span
              class="absolute top-0 right-[calc(14.705%+var(--r))] left-[calc(50%-var(--line)/2)] h-[calc(50%+var(--line)/2)] rounded-bl-[var(--r)] border-b-[length:var(--line)] border-l-[length:var(--line)] border-[var(--c)]"
            />
            <span
              class="absolute top-[calc(50%-var(--line)/2)] right-[calc(14.705%-var(--line)/2)] bottom-0 left-[calc(50%+var(--r))] rounded-tr-[var(--r)] border-t-[length:var(--line)] border-r-[length:var(--line)] border-[var(--c)]"
            />
          </div>

          <!-- 3 × 400 with 80 between them, as fractions of the 1360. The
               dark card is `1097:3115`'s, with the name in Inter. -->
          <ul class="grid gap-4 lg:grid-cols-3 lg:gap-x-[5.88%]">
            <li
              v-for="(body, i) in CHART.bodies"
              :key="i"
              v-cms="'frameworks.bodies'"
              class="flex min-h-[88px] items-center justify-center rounded-xl bg-[#171717] px-5 py-4 text-center font-sans text-[length:var(--text-body-sm)] leading-[1.5] text-white/80 lg:min-h-[calc(var(--u)*6.25)] lg:px-[calc(var(--u)*2.5)] lg:text-[length:calc(var(--u)*1.25)]"
            >
              {{ body }}
            </li>
          </ul>
        </div>

      </figure>
    </MotionReveal>
  </section>
</template>
