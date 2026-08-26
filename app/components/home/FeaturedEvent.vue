<script setup lang="ts">
import { getShowcaseEvents } from "~/lib/api/client"
import { FEATURED_EVENT_COPY } from "~/content/home/featured-event"

/**
 * S6 — Figma node `52:3027`. The featured event.
 *
 * The one section on a white ground, which is the whole point of it: the page
 * runs dark from the hero to the stats and dark again from the news on, so this
 * band is where it opens up. Nothing here inverts a shared component — the
 * buttons, the type colours and the rules are all this section's own.
 *
 * Three columns at the design width: the event's name and particulars, the card,
 * then the prose and the two buttons. Below `lg` they stack in that same order,
 * so the card sits between the name it belongs to and the description of it. All
 * three belong to `EventShowcase`, which owns the pager — they change together,
 * so the selected index has to sit above all of them.
 *
 * Figma's pager reads "1 of 6" and the design writes out only the first event,
 * so the other five are mock (see `MOCK_SHOWCASE_EVENTS`) — same layout, same
 * card, their own name, dates, place and summary. The arrows step through the
 * set and wrap at both ends.
 */
const { data: events } = await useAsyncData(
  "home-showcase-events",
  () => getShowcaseEvents(),
  { default: () => [] },
)
</script>

<template>
  <section
    aria-labelledby="featured-event-heading"
    class="relative w-full bg-white px-5 py-16 text-black md:px-10 lg:px-20 lg:py-[3.125vw]"
  >
    <h2 id="featured-event-heading" class="sr-only">
      {{ FEATURED_EVENT_COPY.heading }}
    </h2>

    <!-- The eyebrow is set against the section's left edge in Figma, outside the
         three columns rather than above them — it labels the whole band. Below
         `lg` there is no room beside the content, so it sits over it. -->
    <div class="flex flex-col gap-8 lg:flex-row lg:gap-11">
      <p
        aria-hidden="true"
        class="font-sans text-xl leading-7 font-medium whitespace-pre-line text-black"
      >
        {{ FEATURED_EVENT_COPY.eyebrow.join("\n") }}
      </p>

      <HomeEventShowcase :events="events" />
    </div>
  </section>
</template>
