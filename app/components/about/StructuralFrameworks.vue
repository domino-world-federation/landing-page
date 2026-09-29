<script setup lang="ts">
import { FRAMEWORKS_COPY } from "~/content/about/frameworks"

/**
 * Our Global Network — Figma node `1097:3096`, the redraw of Structural
 * Frameworks (`111:3152`) that replaces its placeholder panel with the org chart
 * it was holding a place for.
 *
 * **The chart is a figure, not a list of links.** Three tiers — the federation,
 * national federations, their players and clubs — drawn once each, with the
 * caption under it as its `<figcaption>`. It reads in DOM order as apex, then
 * each federation followed by its members, which is the hierarchy said aloud;
 * the connectors are `aria-hidden` because they only restate that order.
 *
 * **Everything is a fraction of the 1360px chart** (D14): a column is 400 of it
 * (29.41%), the gap 80 (5.88%), so a column's centre sits at 14.71%, 50% and
 * 85.29% — which is where the gold branches have to land. Written as those
 * percentages, the connectors stay on the cards at every width without being
 * measured.
 *
 * **The gold branches are two boxes a side**, each drawing two edges of the
 * path: one curves off the trunk and runs sideways, the other picks the
 * horizontal up and turns it down onto the card. Their horizontals overlap on
 * the same line, so the join cannot show; each stops a radius short of the
 * other's corner so neither box's square end pokes past the curve.
 *
 * **One screen, never more** (repo owner's call): from `lg` the section is
 * exactly `100dvh` and the panel takes whatever the heading row leaves. So
 * every size in the chart is written in `--u`, which is `min(1vw, 1.7778dvh)`
 * — a design pixel at 1920 × 1080, and whichever axis runs out first
 * everywhere else. In `vw` alone a wide, short window (1920 × 900) keeps the
 * chart at full size and pushes the caption off the screen.
 *
 * Below `lg` there is no room for three 400px columns, so the chart stacks —
 * the apex, then each federation over its members — and the connectors are
 * not drawn; the grey drop between a federation and its members stays, since a
 * stacked pair still needs it.
 *
 * The panel has no bottom radius and runs into the section below, as the
 * placeholder did. The section fades UP into `--color-surface-dark` —
 * transparent at the top, solid at the foot — so the band arrives from the page
 * background Mission sits on.
 */
// Editable in the backoffice's page editor; the constants are the fallback.
const copy = usePageCopy("about")
const CHART = computed(() => {
  const chart = FRAMEWORKS_COPY.chart
  return {
    apexShort: copy.text("frameworks.apex_short", chart.apexShort),
    apexName: copy.text("frameworks.apex_name", chart.apexName),
    federation: copy.text("frameworks.federation", chart.federation),
    countries: copy.lines("frameworks.countries", chart.countries),
    members: copy.text("frameworks.members", chart.members),
    membersDetail: copy.text("frameworks.members_detail", chart.membersDetail),
  }
})
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
    <!-- The heading and its paragraph share a row from `lg`, the header
         band's arrangement — stacked, the paragraph costs the chart the
         height it needs to fit the screen. -->
    <div
      class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-[calc(var(--u)*4)]"
    >
      <MotionReveal :y="40">
        <!-- The gold statement heading `Mission` uses — Bebas 100/108 under
             the `text-gold-gradient` sweep. `w-fit` is not decoration: the
             sweep is `bg-clip-text`, painted across the element's box before
             it is clipped to the glyphs, so the box has to hug the type. -->
        <h2
          id="frameworks-heading"
          v-cms="'frameworks.heading'"
          class="font-display w-fit text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08] lg:text-[length:calc(var(--u)*5.2083)]"
        >
          {{ copy.text('frameworks.heading', FRAMEWORKS_COPY.heading) }}
        </h2>
      </MotionReveal>

      <!-- Inter 20/32 at 70%, 640 of 1920 — a paragraph beside a heading, the
           way every page header sets its intro. -->
      <MotionReveal :y="32" :delay="STAGGER" class="lg:max-w-[calc(var(--u)*33.33)]">
        <p
          v-cms="'frameworks.intro'"
          class="font-sans text-[length:var(--text-eyebrow)] leading-[1.6] text-white/70 lg:text-[length:calc(var(--u)*1.0417)]"
        >
          {{ copy.text('frameworks.intro', FRAMEWORKS_COPY.intro) }}
        </p>
      </MotionReveal>
    </div>

    <MotionReveal
      :y="48"
      :delay="STAGGER * 2"
      class="mt-10 flex min-h-0 flex-1 flex-col lg:mt-[calc(var(--u)*2.5)]"
    >
      <!-- 50px top corners (`1097:3098`). The chart and caption are centred
           in whatever height the screen leaves. -->
      <figure
        class="flex flex-1 flex-col items-center justify-center gap-10 rounded-t-[24px] bg-[var(--color-surface-dark)] px-5 py-8 lg:gap-[calc(var(--u)*2.6)] lg:rounded-t-[calc(var(--u)*2.6)] lg:px-0 lg:py-[calc(var(--u)*2)]"
      >
        <!-- 1360 of 1920. The two custom properties are the connectors'
             stroke (8px) and corner radius (20px) at 1920. -->
        <div
          class="flex w-full max-w-[480px] flex-col [--line:max(3px,calc(var(--u)*0.4167))] [--r:calc(var(--u)*1.0417)] lg:w-[calc(var(--u)*70.83)] lg:max-w-none"
        >
          <!-- The apex (`1097:3102`): the radial gold, a white hairline, the
               glow, and the emblem at 20% behind the type. -->
          <div
            class="relative mx-auto flex w-full flex-col gap-3 overflow-hidden rounded-xl border border-white bg-[radial-gradient(circle_at_50%_50%,#F1C977_0%,#A57F40_100%)] px-5 py-6 text-center shadow-[0_0_24px_0_#E1B762,0_0_6px_0_#E1B762,inset_0_0_16px_0_rgba(255,255,255,0.8)] lg:w-[29.41%] lg:gap-[calc(var(--u)*0.83)] lg:py-[calc(var(--u)*1.25)]"
          >
            <img
              src="/assets/about/decor-frameworks-emblem.svg"
              alt=""
              aria-hidden="true"
              width="146"
              height="158"
              class="pointer-events-none absolute top-[-24px] left-1/2 h-[158px] w-auto -translate-x-1/2 lg:top-[calc(var(--u)*-1.25)] lg:h-[calc(var(--u)*8.23)]"
            >
            <p
              v-cms="'frameworks.apex_short'"
              class="font-display relative bg-[linear-gradient(180deg,#1A1307_0%,#523E1D_100%)] bg-clip-text text-[length:var(--text-display-apex)] leading-[0.73] text-transparent lg:text-[length:calc(var(--u)*3.125)]"
            >
              {{ CHART.apexShort }}
            </p>
            <p
              v-cms="'frameworks.apex_name'"
              class="font-display relative text-[length:var(--text-display-caption)] leading-[1.2] text-[#523E1D] lg:text-[length:calc(var(--u)*1.6667)]"
            >
              {{ CHART.apexName }}
            </p>
          </div>

          <!-- The gold branches, 120px tall at 1920. `lg` only. -->
          <div aria-hidden="true" class="relative hidden h-[calc(var(--u)*6.25)] lg:block">
            <span
              class="absolute inset-y-0 left-1/2 w-[var(--line)] -translate-x-1/2 bg-[#E1B762]"
            />
            <span
              class="absolute top-0 right-[calc(50%-var(--line)/2)] left-[calc(14.705%+var(--r))] h-[calc(50%+var(--line)/2)] rounded-br-[var(--r)] border-r-[length:var(--line)] border-b-[length:var(--line)] border-[#E1B762]"
            />
            <span
              class="absolute top-[calc(50%-var(--line)/2)] right-[calc(50%+var(--r))] bottom-0 left-[calc(14.705%-var(--line)/2)] rounded-tl-[var(--r)] border-t-[length:var(--line)] border-l-[length:var(--line)] border-[#E1B762]"
            />
            <span
              class="absolute top-0 right-[calc(14.705%+var(--r))] left-[calc(50%-var(--line)/2)] h-[calc(50%+var(--line)/2)] rounded-bl-[var(--r)] border-b-[length:var(--line)] border-l-[length:var(--line)] border-[#E1B762]"
            />
            <span
              class="absolute top-[calc(50%-var(--line)/2)] right-[calc(14.705%-var(--line)/2)] bottom-0 left-[calc(50%+var(--r))] rounded-tr-[var(--r)] border-t-[length:var(--line)] border-r-[length:var(--line)] border-[#E1B762]"
            />
          </div>

          <!-- 3 × 400 with 80 between them, as fractions of the 1360. -->
          <div class="mt-10 grid gap-10 lg:mt-0 lg:grid-cols-3 lg:gap-x-[5.88%]">
            <div
              v-for="(country, i) in CHART.countries"
              :key="i"
              class="flex flex-col items-stretch"
            >
              <!-- `1097:3106`: a pale steel face with a gradient edge — two
                   backgrounds, one clipped to the padding and one to the
                   border, since `border-image` cannot round. -->
              <div
                class="flex flex-col gap-2 rounded-xl border-2 border-transparent px-5 py-4 text-center [background:linear-gradient(180deg,#8F8F8F_0%,#E2E2E2_100%)_padding-box,linear-gradient(0deg,#525252_0%,#828282_100%)_border-box] shadow-[inset_0_0_16px_0_rgba(255,255,255,0.8)] lg:gap-[calc(var(--u)*0.4)] lg:px-[calc(var(--u)*1.67)] lg:py-[calc(var(--u)*1.04)]"
              >
                <p
                  v-cms="'frameworks.federation'"
                  class="font-display text-[length:var(--text-display-node)] leading-none text-[#2B2B2B] lg:text-[length:calc(var(--u)*2.5)]"
                >
                  {{ CHART.federation }}
                </p>
                <p
                  v-cms="'frameworks.countries'"
                  class="font-sans text-[length:var(--text-eyebrow)] leading-[1.6] font-medium text-[var(--color-ink-placeholder)] lg:text-[length:calc(var(--u)*1.0417)]"
                >
                  {{ country }}
                </p>
              </div>

              <!-- 80px grey drop (`1097:3124`), light at the top. -->
              <span
                aria-hidden="true"
                class="mx-auto h-10 w-[var(--line)] bg-[linear-gradient(180deg,#B8B8B8_0%,#525252_100%)] lg:h-[calc(var(--u)*4.17)]"
              />

              <!-- `1097:3115` -->
              <div
                class="flex flex-col items-center gap-2 rounded-xl bg-[#171717] px-5 py-4 text-center lg:gap-[calc(var(--u)*0.4)] lg:px-[calc(var(--u)*1.67)] lg:py-[calc(var(--u)*1.04)]"
              >
                <p
                  v-cms="'frameworks.members'"
                  class="font-display bg-[linear-gradient(90deg,#FFFFFF_0%,#999999_100%)] bg-clip-text text-[length:var(--text-display-node)] leading-none text-transparent lg:text-[length:calc(var(--u)*2.5)]"
                >
                  {{ CHART.members }}
                </p>
                <p
                  v-cms="'frameworks.members_detail'"
                  class="font-sans text-[length:var(--text-eyebrow)] leading-[1.6] font-medium text-[var(--color-ink-placeholder)] lg:text-[length:calc(var(--u)*1.0417)]"
                >
                  {{ CHART.membersDetail }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Inter 24/36 in the placeholder grey, 864 of 1920. A block per line
             so the design's break survives without a `<br>` (RULES §9). -->
        <figcaption
          v-cms="'frameworks.caption'"
          class="font-sans max-w-[864px] text-center text-[length:var(--text-body-sm)] leading-[1.5] text-[var(--color-ink-placeholder)] lg:max-w-[calc(var(--u)*45)] lg:text-[length:calc(var(--u)*1.25)]"
        >
          <span
            v-for="line in copy.lines('frameworks.caption', FRAMEWORKS_COPY.caption)"
            :key="line"
            class="lg:block"
          >{{ line }} </span>
        </figcaption>
      </figure>
    </MotionReveal>
  </section>
</template>
