<script setup lang="ts">
import type { OlympicResult } from "~/lib/api/types"
import { OLYMPICS_COPY } from "~/content/tournaments/olympics"

/**
 * One row of the full Olympic table — Figma nodes `648:30580` (closed) and
 * `648:30585` (open).
 *
 * Closed it prints three of the five columns the tournaments-page table
 * carries: year, event, category. Open it adds the four facts Figma writes down
 * the left of the panel and, beside them, the champion's photograph.
 *
 * **A disclosure, not a link to a detail page.** The panel holds four short
 * lines and a picture; a page for that would be a page a reader has to come
 * back from, and the design draws the answer inside the row.
 *
 * **The panel prints only the facts the row was given.** `eventDate`,
 * `location` and `format` arrived after the table did, so a result filed
 * before them opens with two lines instead of four rather than with empty
 * labels beside them — the same §5.4 handling every optional field on the site
 * gets.
 */
const props = defineProps<{ result: OlympicResult }>()

const open = defineModel<boolean>("open", { required: true })

const COPY = OLYMPICS_COPY

const prefersReducedMotion = useReducedMotion()

// Reduced motion collapses the TRANSITION, never the tree (RULES §12).
const transition = computed(() =>
  prefersReducedMotion.value ? { duration: 0 } : { duration: 0.28, ease: EASE },
)

/**
 * The lines down the left of the open panel, in the design's order.
 *
 * Built as a list rather than four hand-written blocks so the ones with nothing
 * to say drop out instead of printing a label over a blank — which is the whole
 * reason these fields are optional.
 */
const facts = computed(() =>
  [
    { label: COPY.facts.event, value: props.result.event },
    { label: COPY.facts.date, value: props.result.eventDate },
    { label: COPY.facts.location, value: props.result.location },
    { label: COPY.facts.format, value: props.result.format },
  ].filter((fact) => Boolean(fact.value)),
)

const panelId = computed(() => `olympic-panel-${props.result.id}`)
const buttonId = computed(() => `olympic-button-${props.result.id}`)
</script>

<template>
  <li class="list-none">
    <div class="rounded-[var(--radius-glass)] bg-white/12 px-6 py-4">
      <!-- The whole row is the control (`648:30580` gives the plus no box of its
           own), so the three columns and the glyph sit inside one button. -->
      <button
        :id="buttonId"
        type="button"
        :aria-expanded="open"
        :aria-controls="panelId"
        :aria-label="
          (open ? COPY.collapse : COPY.expand).replace('%s', result.event)
        "
        class="focus-visible:ring-gold flex w-full items-center gap-4 py-2 text-left focus-visible:rounded-[var(--radius-item)] focus-visible:ring-2 focus-visible:outline-none"
        @click="open = !open"
      >
        <!-- 124 / fill / 290 at the design width (`648:30576`). The two fixed
             columns are dropped below `md`, where three tracks in 375px turn
             every cell into two words a line: the year and the category move
             under the event as a single muted line instead. -->
        <span
          class="font-sans hidden w-[124px] shrink-0 text-[length:var(--text-body-md)] leading-10 text-white md:block"
        >
          {{ result.year }}
        </span>

        <span class="flex min-w-0 flex-1 flex-col">
          <span
            class="font-sans text-[length:var(--text-body-md)] leading-10 text-white"
          >
            {{ result.event }}
          </span>
          <span
            class="font-sans text-[length:var(--text-body-sm)] leading-6 text-white/60 md:hidden"
          >
            {{ result.year }} · {{ result.category }}
          </span>
        </span>

        <span
          class="font-sans hidden w-[290px] shrink-0 text-[length:var(--text-body-md)] leading-10 text-white lg:block"
        >
          {{ result.category }}
        </span>

        <!-- The plus/minus (`81:635` and `81:671`) — one glyph in two states,
             as the FAQ accordion draws it: the vertical bar rotates flat onto
             the horizontal one and fades as it goes, both composited
             properties. Decorative; `aria-expanded` already says the state. -->
        <span aria-hidden="true" class="relative block size-8 shrink-0 lg:size-16">
          <span
            class="absolute top-1/2 left-1/2 h-[6.25%] w-[56.25%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          />
          <Motion
            as="span"
            class="absolute top-1/2 left-1/2 h-[6.25%] w-[56.25%] rounded-full bg-white"
            :style="{ x: '-50%', y: '-50%' }"
            :initial="false"
            :animate="{ rotate: open ? 0 : 90, opacity: open ? 0 : 1 }"
            :transition="transition"
          />
        </span>
      </button>

      <!-- `inert` while closed rather than `aria-hidden`: the panel stays in the
           DOM at zero height, and hiding it from the accessibility tree without
           taking it out of the tab order would strand a keyboard reader inside
           it. `inert` does both. -->
      <Motion
        :id="panelId"
        as="div"
        role="region"
        :aria-labelledby="buttonId"
        :inert="!open"
        :initial="false"
        :animate="{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }"
        :transition="transition"
        class="overflow-hidden"
      >
        <!-- The spacing rides on an inner element: padding on the animated box
             never reaches zero when the height does, so a closed row would keep
             a strip of ground under it. -->
        <div class="pt-5">
          <div
            class="flex flex-col gap-5 rounded-[var(--radius-glass)] bg-white/[0.08] p-5 lg:flex-row"
          >
            <dl class="flex min-w-0 flex-1 flex-col gap-5 lg:gap-[30px]">
              <div v-for="fact in facts" :key="fact.label" class="flex flex-col gap-1">
                <dt
                  class="font-sans text-[length:var(--text-body-sm)] leading-7 text-white/50"
                >
                  {{ fact.label }}
                </dt>
                <dd
                  class="font-sans text-[length:var(--text-display-label)] leading-8 font-semibold text-white"
                >
                  {{ fact.value }}
                </dd>
              </div>
            </dl>

            <!-- 280 × 394 with the name in a gradient at its foot
                 (`648:30605`). Drawn only when there is a photograph: the card
                 IS the photograph, and a gradient over nothing with a name in
                 it is a caption for a picture that was never filed. The name is
                 still in the panel either way — it is what `winners` says. -->
            <figure
              v-if="result.championPhotoUrl"
              class="relative aspect-[280/394] w-full shrink-0 overflow-hidden rounded-[var(--radius-glass)] lg:w-[280px]"
            >
              <NuxtImg
                :src="result.championPhotoUrl"
                :alt="result.championPhotoAlt ?? ''"
                :sizes="imageSizes({ xs: '90vw', lg: '280px' })"
                class="absolute inset-0 size-full object-cover"
              />
              <figcaption
                class="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.7)_50%,rgba(0,0,0,1)_100%)] px-4 pt-12 pb-4"
              >
                <span
                  class="font-sans text-[length:var(--text-body-sm)] leading-6 text-white/70"
                >
                  {{ COPY.championEyebrow }}
                </span>
                <span
                  class="font-sans text-[length:var(--text-display-caption)] leading-[1.375] text-white"
                >
                  {{ result.winners }}
                </span>
              </figcaption>
            </figure>

            <!-- No photograph: the champion is still named, as a fact in the
                 list rather than as a caption on an empty box. -->
            <div v-else class="flex flex-col gap-1 lg:w-[280px] lg:shrink-0">
              <span
                class="font-sans text-[length:var(--text-body-sm)] leading-7 text-white/50"
              >
                {{ COPY.championEyebrow }}
              </span>
              <span
                class="font-sans text-[length:var(--text-display-label)] leading-8 font-semibold text-white"
              >
                {{ result.winners }}
              </span>
            </div>
          </div>
        </div>
      </Motion>
    </div>
  </li>
</template>
