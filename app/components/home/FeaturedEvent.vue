<script setup lang="ts">
import { getShowcaseEvents } from "~/lib/api/client"
import { FEATURED_EVENT_COPY } from "~/content/home/featured-event"

/**
 * S6 — Figma node `561:13281`. The featured event.
 *
 * The one section on a white ground, which is the whole point of it: the page
 * runs dark from the hero to the stats and dark again from the news on, so this
 * band is where it opens up. Nothing here inverts a shared component — the
 * buttons, the type colours and the rules are all this section's own.
 *
 * Three columns at the design width: the event's name and particulars, the card,
 * then the prose and the two buttons. Below `menu-lg` they stack in that same
 * order, so the card sits between the name it belongs to and the description of
 * it. All three belong to `EventShowcase`, which owns the pager — they change
 * together, so the selected index has to sit above all of them.
 *
 * The redraw changed the middle column and left the outer two alone: the gold
 * 520 × 720 panel became an 810 × 540 picture with a date pill and two tabs on
 * it, and the gutters between the columns went from 100px to 20. The section's
 * own frame is untouched — 60px 80px of padding, 44px from the eyebrow to the
 * columns.
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
  <!-- A column, `justify-center`, one screen tall: `561:13281` is
       1920 × 1080 with `padding: 120px 80px` and a 36px gap between the eyebrow
       and the row. 6.25vw is 120/1920 and 1.875vw is 36/1920, so both hold their
       proportions at every width.

       `min-h`, not `h`: below `menu-lg` the three columns stack, and at that
       point the content is taller than a phone screen and has to be allowed to
       grow past it. The padding drops to flat values there for the same reason —
       6.25vw of a 390px phone is 24px, which is not the breathing room the
       design is describing.

       `data-nav-contrast` is what tells the header it cannot stay transparent
       here. This is the page's only full-bleed light ground, and a white
       wordmark on it is invisible — see `NavShell`. -->
  <section
    aria-labelledby="featured-event-heading"
    data-nav-contrast
    class="relative flex snap-screen w-full snap-start snap-always flex-col justify-center gap-8 bg-white px-5 py-16 text-black md:px-10 lg:gap-[1.875vw] lg:px-20 lg:py-[6.25vw]"
  >
    <h2 id="featured-event-heading" class="sr-only">
      {{ FEATURED_EVENT_COPY.heading }}
    </h2>

    <!-- Above the row and full width, which is where the revision moved it: it
         labels the whole band rather than standing beside the first column.
         Inter Medium 20/28 in black (`561:13282`), and uppercased in CSS rather
         than in the data so a translation with no uppercase form is not mangled
         — the same call `NEWS_COPY.eyebrow` makes. -->
    <p
      aria-hidden="true"
      class="font-sans text-xl leading-7 font-medium text-black uppercase"
    >
      {{ FEATURED_EVENT_COPY.eyebrow }}
    </p>

    <HomeEventShowcase :events="events" />
  </section>
</template>
