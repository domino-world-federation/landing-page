<script setup lang="ts">
import type { ShowcaseEvent } from "~/lib/api/types"

/**
 * Where the furniture sits on the picture, as fractions of Figma's 810 × 540
 * frame (`561:13301`). Percentages rather than pixels for the reason the card
 * has always used them: the box is a fraction of the viewport at every
 * breakpoint, so anything placed in pixels would drift off its mark the moment
 * the card is not 810 wide.
 */
/** 225/810 — where both tabs start, and 360/810 how wide they run. */
const TAB_LEFT = "left-[27.778%]"
const TAB_WIDTH = "w-[44.444%]"
/** 48/540. */
const TAB_HEIGHT = "h-[8.889%]"
/** 233/360 — the label's own text box, which is narrower than the tab because
 *  the tab is a trapezoid and its lower edge is the short one. */
const TAB_TEXT_WIDTH = "w-[64.7%]"

/**
 * The card in S6 — Figma node `561:13301`. The event's picture, 810 × 540, with
 * a tab clipped to each of its long edges: the dates across the top, and how
 * long registration has left across the bottom.
 *
 * **The dates used to float on the picture in a blurred pill and now sit in the
 * top tab.** The revision drops the pill (`561:13303`) entirely and gives the
 * date the tab that "Registration ends in 3 days" used to have, moving that down
 * to the foot. One less floating element over the photograph, and the two facts
 * a reader wants from a card at a glance — when, and how long they have — end up
 * on its two edges rather than one being buried mid-frame.
 *
 * The tab type also stops being black-at-60%: the revision sets a flat `#666666`
 * (`601:18950`), which holds its value against whatever part of the picture the
 * trapezoid happens to cover instead of taking a tint from it.
 *
 * **It used to be built, and is now printed.** Until the redraw this was a
 * layered composition at 520 × 720 — a gold gradient panel, the federation
 * watermark ghosted into it, the trophy photograph, the event's own year set as
 * live text across the foot, and light streaks blended over the lot — with the
 * watermark and the trophy drifting gently in step. The redraw replaces all of
 * it with one landscape raster (`561:13302`) in which every one of those layers
 * is already flattened, and turns the card on its side while it is at it.
 *
 * Two things follow from that, and both are the design's call rather than an
 * omission here. The drift is gone: there are no longer two layers to move
 * against each other, and scaling a flattened photograph is a different effect,
 * not the same one. And the wordmark is now part of the image, so it reads
 * "DWF2026" for every event in the pager instead of taking its year from
 * `dateLabel` — see the note in `EventShowcase`.
 *
 * The frame keeps its own radial gradient underneath (`circle at 117% -2%`)
 * even though the picture covers it. That is Figma's own stack, and it is not
 * quite invisible: the frame is a 12px radius and the picture an 8px one, so a
 * sliver of gold shows at each corner where the two curves part.
 */
defineOptions({ inheritAttrs: false })

defineProps<{ event: ShowcaseEvent }>()

const attrs = useAttrs()
const passThrough = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const rootClass = computed(() =>
  cn(
    // 810 × 540 in Figma. The ratio is carried rather than the pixels, so the
    // card can shrink on a narrow screen without the furniture on it
    // re-composing — every layer below is placed as a percentage of this box.
    "relative aspect-[810/540] w-full max-w-[810px] shrink-0",
    "rounded-glass bg-[radial-gradient(circle_at_117%_-2%,#c3ae86_0%,#4f4332_100%)]",
    attrs.class as string | undefined,
  ),
)

// Figma's 18px as a fraction of the design width rather than as a fixed size.
// The tab is 44.4% of a card that is itself a fraction of the window, so on a
// phone it is ~155px wide; 18px held literally would put "Registration ends in
// 3 days" straight through both ends of it. The floor is where the label is
// still legible rather than where it still fits.
const TAB_TEXT = "text-[length:clamp(0.625rem,0.9375vw,1.125rem)]"

const tabClass = computed(() => cn("absolute", TAB_LEFT, TAB_WIDTH, TAB_HEIGHT))
</script>

<template>
  <div v-bind="passThrough" :class="rootClass">
    <!-- The picture. `rounded-[8px]` is Figma's own inner radius against the
         frame's 12 — see the note above for why the two differ. -->
    <NuxtImg
      :src="event.imageUrl"
      :alt="event.imageAlt"
      :sizes='imageSizes({ xs: "90vw", menu: "45vw" })'
      :quality="90"
      class="absolute inset-0 size-full rounded-[8px] object-cover"
    />

    <!-- The two tabs (`601:18945`, `601:18951`). One shape used twice: a white
         trapezoid whose WIDE edge is the one it hangs from, so the lower tab is
         the same file turned over. The rotation is on the artwork alone — the
         label sits in its own element above it and stays the right way up.

         The shape is decorative and the words on it are not: the tabs carry the
         dates and when registration closes, and the dates are the one fact that
         also appears in the left column — the rest exists nowhere else on the
         page. So the SVG is `aria-hidden` scenery and the text is real text over
         it, rather than one flattened picture of both.

         Uppercased in CSS, as Figma sets it ("MAR 18 - 21, 2027"), rather than
         in the data: `dateLabel` is shared with the left column, which sets it
         in sentence case, and one field cannot be stored in two cases. -->
    <div :class="cn(tabClass, 'top-0')">
      <img
        src="/assets/home/decor-event-label.svg"
        alt=""
        aria-hidden="true"
        width="360"
        height="48"
        class="absolute inset-0 size-full"
      >
      <p class="relative flex size-full items-center justify-center">
        <span
          :class="
            cn(
              'font-sans text-center leading-[1.4] font-medium text-[#666666] uppercase',
              TAB_TEXT,
              TAB_TEXT_WIDTH,
            )
          "
        >
          {{ event.dateLabel }}
        </span>
      </p>
    </div>

    <div :class="cn(tabClass, 'bottom-0')">
      <img
        src="/assets/home/decor-event-label.svg"
        alt=""
        aria-hidden="true"
        width="360"
        height="48"
        class="absolute inset-0 size-full rotate-180"
      >
      <p class="relative flex size-full items-center justify-center">
        <span
          :class="
            cn(
              'font-sans text-center leading-[1.4] font-medium text-[#666666]',
              TAB_TEXT,
              TAB_TEXT_WIDTH,
            )
          "
        >
          {{ event.registrationLabel }}
        </span>
      </p>
    </div>
  </div>
</template>
