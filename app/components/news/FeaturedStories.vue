<script setup lang="ts">
import {
  useDocumentVisibility,
  useElementHover,
  useFocusWithin,
  useIntervalFn,
} from "@vueuse/core"
import type { NewsArticle } from "~/lib/api/types"
import { NEWS_FEATURED_COPY } from "~/content/news/featured"

/** Seconds. Short: this is a swap the reader asked for, not an entrance. */
const FADE = 0.35

/**
 * Seconds a story holds the band before the next one takes it.
 *
 * Seven, not the three or four a picture carousel usually runs at, because what
 * has to be finished here is a SENTENCE: an eyebrow, a headline that wraps to
 * two lines at the design width, and a button. Timed against reading the
 * longest headline in the mock rather than against the photograph, which needs
 * no time at all.
 */
const DWELL = 7

/**
 * The featured band — Figma node `156:7584`, 1920 × 850 full bleed.
 *
 * A photograph with a gradient shelf across its lower half carrying the story's
 * eyebrow, its headline and a gold button, and a pager in the corner stepping
 * through the federation's featured stories.
 *
 * **It advances by itself, and stops the moment anyone is reading it.** It did
 * not until the federation asked for it, and the objection recorded here then
 * still stands on its own terms: a headline is a sentence, and copy that slides
 * away mid-read is copy nobody finishes. So the timer is not simply switched
 * on — it yields, in four ways:
 *
 *   - `prefers-reduced-motion` stops it dead. Not slowed: an animation the
 *     reader has asked not to see does not get a longer version (RULES §12).
 *   - Hovering the band or focusing anything inside it pauses it. Both, because
 *     a mouse reader and a keyboard reader hold their attention differently and
 *     neither should have to race the clock.
 *   - A hidden tab pauses it, so a band left open in the background is not
 *     still turning when the reader comes back to it.
 *   - Pressing prev/next restarts the dwell, so a story the reader chose gets
 *     the full seven seconds rather than the remainder of someone else's.
 *
 * `DWELL` is the other half of the answer: seven seconds is set against reading
 * the headline, not against looking at the photograph.
 *
 * The counter's `aria-live` is switched OFF while the timer is what moved the
 * band. Announcing "2 of 6" every seven seconds, forever, is not information —
 * it is a screen reader talking over whatever the reader is actually doing. It
 * comes back the instant a reader presses a button, which is the case it was
 * added for.
 *
 * The picture cross-fades rather than sliding. Only `opacity` animates
 * (RULES §12), and only the active story is mounted — six 1920-wide photographs
 * stacked and faded would mean downloading all six to show one, so
 * `AnimatePresence` holds the outgoing one just long enough to fade it out.
 *
 * The whole band carries the index rather than an island inside it: unlike the
 * boards carousel (D41), every part of it changes — the picture, the eyebrow,
 * the headline and the button's target — so there is no static half to leave
 * behind.
 */
const props = defineProps<{ stories: NewsArticle[] }>()

const prefersReducedMotion = useReducedMotion()
const index = ref(0)

// Nothing flagged: the band would be an empty 850px hole, so the section stands
// down entirely rather than printing furniture around no story. Not a branch on
// `useReducedMotion` — this is data, identical on both sides of hydration, so
// RULES §12's warning does not apply.
const story = computed(() => props.stories[index.value])

const transition = computed(() =>
  prefersReducedMotion.value ? { duration: 0 } : { duration: FADE, ease: EASE },
)

// Wraps in both directions: the pager is two buttons and a count, with no
// disabled state drawn, so running off either end returns to the other.
function advance(delta: number) {
  const total = props.stories.length
  if (total === 0) return
  index.value = (index.value + delta + total) % total
}

/**
 * The band's own element, so the pause can be measured on what the reader is
 * actually pointing at rather than on the page.
 */
const band = useTemplateRef<HTMLElement>("band")

const hovered = useElementHover(band)
const { focused } = useFocusWithin(band)
const visibility = useDocumentVisibility()

/**
 * Whether the reader, rather than the clock, moved the band last.
 *
 * Drives the counter's `aria-live` and nothing else — see the note above on why
 * an auto-advancing carousel must not keep announcing itself.
 */
const steppedByReader = ref(false)

/**
 * One story is not a carousel: with nothing to turn to, a timer would fire
 * every seven seconds to set the index to the value it already holds.
 */
const canAutoplay = computed(
  () =>
    props.stories.length > 1 &&
    !prefersReducedMotion.value &&
    !hovered.value &&
    !focused.value &&
    visibility.value === "visible",
)

const { pause, resume } = useIntervalFn(() => advance(1), DWELL * 1000, {
  // Started by the watcher below, never on creation: before the first paint
  // there is no preference, no hover and no visibility to read, and a timer
  // begun there would be one the conditions never got a say in.
  immediate: false,
})

/**
 * **`onMounted`, and that is not tidiness.** `watchEffect` alone runs during
 * SSR too, so every render of `/news` on the server would call `resume()` and
 * leave a `setInterval` running in the Nitro process — advancing an index no
 * one will ever see, once per visitor, on a page that is on the site's main
 * navigation. The band cannot turn before it exists, so the clock starts when
 * it does.
 *
 * Registered inside the mount hook but still owned by the component's scope, so
 * it is torn down with the component like any other effect.
 */
onMounted(() => {
  watchEffect(() => (canAutoplay.value ? resume() : pause()))
})

/** The pager's own handler: the reader's press restarts the dwell. */
function step(delta: number) {
  steppedByReader.value = true
  advance(delta)

  // `resume()` on a running interval starts the count again from now. Without
  // it, a story chosen one second before the timer fired would be shown for
  // that one second.
  if (canAutoplay.value) resume()
}
</script>

<template>
  <!-- 850/1920. `aspect` above `lg` so the band keeps the design's proportion at
       any width; below it the shelf's copy decides the height and the picture
       fills whatever that leaves. -->
  <section
    v-if="story"
    ref="band"
    :aria-label="NEWS_FEATURED_COPY.regionLabel"
    aria-roledescription="carousel"
    class="relative isolate min-h-[520px] w-full overflow-hidden lg:aspect-[1920/850] lg:min-h-0"
  >
    <AnimatePresence :initial="false">
      <Motion
        :key="story.id"
        as="div"
        class="absolute inset-0 -z-10"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="transition"
      >
        <!-- The band prints the headline beside the picture, so the alt text
             describes the photograph rather than repeating the story. Empty when
             the feed gave no description — better silent than wrong.

             Figma hangs the picture 89px above the frame (`163:7627`), which is
             a downward crop of a taller image, so the interesting part sits
             above centre.

             The first story is the page's LCP: it is the largest thing above the
             fold once the header band scrolls. Only the first, and only while it
             is the one showing. -->
        <NuxtImg
          :src="story.heroImageUrl ?? story.thumbnailUrl"
          :alt="story.heroImageAlt ?? ''"
          :sizes="SIZES_FULL_BLEED"
          :preload="index === 0 || undefined"
          :loading="index === 0 ? 'eager' : 'lazy'"
          :fetchpriority="index === 0 ? 'high' : undefined"
          class="absolute inset-0 size-full object-cover object-[center_35%]"
        />
      </Motion>
    </AnimatePresence>

    <!-- The shelf. Figma puts it at y:424 of 850 — the lower half — with a
         `#0E0E0E` gradient from nothing to opaque, so the picture reads through
         the top of it and the copy sits on solid ground at the bottom.

         Figma's 15px backdrop blur on the same frame is not reproduced. A
         backdrop filter applies at full strength across the whole box while the
         gradient over it starts at transparent, so its top edge lands as a
         straight line ruled across the photograph. The gradient is what makes
         the copy legible; the blur only added a seam. Reported from a screenshot
         of the tournament hero, which drew the identical bar. -->
    <div
      class="absolute inset-x-0 bottom-0 flex flex-col gap-8 bg-linear-to-b from-transparent via-[#0e0e0e]/75 to-[#0e0e0e] px-5 pt-24 pb-8 md:px-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:px-20 lg:pt-32 lg:pb-20"
    >
      <AnimatePresence mode="wait" :initial="false">
        <Motion
          :key="story.id"
          as="div"
          class="flex flex-col gap-2.5 lg:max-w-[1080px]"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="transition"
        >
          <!-- Bebas 32/40 at 50%. Figma puts the opacity on the wrapper
               (`162:7607`) rather than on each of the three texts, which is the
               same result and says the one thing it means. -->
          <p
            class="font-display flex flex-wrap items-center gap-2.5 text-[length:var(--text-display-caption)] leading-[1.25] text-white/50"
          >
            <span>{{ NEWS_FEATURED_COPY.eyebrow }}</span>
            <!-- The bullet is drawn as its own text node in Figma. It is
                 punctuation between two labels, not content, so it is hidden
                 rather than read out as "bullet" between them. -->
            <span aria-hidden>&bull;</span>
            <time :datetime="story.publishedAt">
              {{ formatShortDate(story.publishedAt) }}
            </time>
          </p>

          <!-- Inter SemiBold 64/72. `--text-body-2xl` is that step. -->
          <h2
            class="font-sans text-[length:var(--text-body-2xl)] leading-[1.125] font-semibold text-white"
          >
            {{ story.title }}
          </h2>
        </Motion>
      </AnimatePresence>

      <div class="flex shrink-0 flex-col gap-6 lg:w-[320px]">
        <!-- Figma's own button (`162:7611`): flat `#E1B762`, not the landing
             page's gradient `GoldCta` pill. Left as drawn — the two are
             different buttons and swapping one for the other would put the
             hero's chrome on a page that never asks for it. -->
        <NuxtLink
          :to="`/news/${story.slug}`"
          class="bg-gold rounded-btn font-display focus-visible:ring-gold flex h-18 items-center justify-center gap-4 px-5 text-[length:var(--text-body-lg)] leading-none text-black transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none"
        >
          {{ NEWS_FEATURED_COPY.readCta }}
          <!-- A 32px inline SVG sized in CSS. The shared arrow points LEFT, and
               +135° brings it round to up-and-right: the "opens an article"
               glyph rather than the straight rightward arrow that would read as
               "next item". −135° aims it down-right, which is the easy mistake.
               Drawn in `#0E0E0E` already, and this sits on gold, so no
               `invert`. -->
          <img
            src="/assets/global/icon-arrow-left.svg"
            alt=""
            width="32"
            height="32"
            class="size-8 rotate-135"
          >
        </NuxtLink>

        <div
          v-if="stories.length > 1"
          class="flex items-center justify-between gap-4"
        >
          <NewsFeaturedPagerButton
            :label="NEWS_FEATURED_COPY.previous"
            @press="step(-1)"
          />

          <!-- `aria-live` because the buttons beside it do not change their own
               labels — without it, a reader pressing "next" hears nothing at all
               happen. -->
          <p
            :aria-live="steppedByReader ? 'polite' : 'off'"
            class="font-display text-[length:var(--text-display-caption)] leading-none text-white"
          >
            {{
              NEWS_FEATURED_COPY.position
                .replace("%1", String(index + 1))
                .replace("%2", String(stories.length))
            }}
          </p>

          <NewsFeaturedPagerButton
            :label="NEWS_FEATURED_COPY.next"
            flip
            @press="step(1)"
          />
        </div>
      </div>
    </div>
  </section>
</template>
