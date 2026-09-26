<script setup lang="ts">
import { BOARDS_COPY, EXECUTIVE_COMMITTEE } from "~/content/about/boards"

/**
 * Executive Boards — Figma node `112:3590`.
 *
 * The band Structural Frameworks' wash ends on: `--color-surface-dark` at the
 * top, back to the page background at the foot.
 *
 * That fade is a deliberate departure from the design, and it is worth saying
 * why. Figma ends the grey panel exactly on the section boundary and starts this
 * one on plain `#0e0e0e`, which draws a hard horizontal line across the full
 * width of the page. The panel's corners are rounded at the TOP only and it
 * carries no bottom edge — the design's own way of saying it continues past the
 * frame — so the line is where the artboard was cut, not something meant to be
 * seen. Fading the same colour out over this section is what "continues" looks
 * like once there is a page below it.
 *
 * ── It was a carousel of portraits, and it is a list of names now ──
 *
 * The federation asked for faces to come off About (2026-09-26). What replaced
 * the strip is not a stripped-down version of it: a card whose picture is taken
 * away is a caption floating in an empty frame, and four of those in a row that
 * still scrolls is a control that moves nothing worth moving. So the section is
 * rebuilt as what it now actually is — a statement, the offices, and the people
 * holding them.
 *
 * The committee grew from four to ten in the same pass, which settles the layout
 * on its own: ten portraits would have been a carousel nobody reaches the end
 * of, and ten names are a list read at a glance.
 *
 * **`AboutBoardCarousel` and `AboutBoardCard` are NOT dead.** `/tournaments`
 * still draws its own leadership strip with them, from the API. Both stay.
 *
 * The heading keeps Figma's "Executive Boards" even though the copy beneath it
 * says "Executive Committee" throughout — renaming a section heading was not
 * part of the request, and it is one word to change if the federation wants the
 * two to agree.
 */
const COPY = EXECUTIVE_COMMITTEE
</script>

<template>
  <section
    class="bg-[linear-gradient(180deg,var(--color-surface-dark)_0%,var(--color-bg)_100%)] px-5 pt-28 pb-16 md:px-10 lg:px-20 lg:pt-[max(var(--nav-clearance),4.17vw)] lg:pb-[4.17vw]"
  >
    <div class="flex flex-col gap-10 lg:gap-[3.125vw]">
      <MotionReveal :y="40">
        <!-- The gold statement heading `Mission` uses — see
             `StructuralFrameworks` for why it carries `w-fit`. -->
        <h2
          class="font-display w-fit text-gold-gradient text-[length:var(--text-display-statement)] leading-[1.08]"
        >
          {{ BOARDS_COPY.heading }}
        </h2>
      </MotionReveal>

      <!-- 824px, the measure About's own opening claim is set to: this is the
           same kind of sentence and is read at the same width. -->
      <MotionReveal :y="32" :delay="0.08">
        <p
          class="font-sans max-w-[824px] text-[length:var(--text-eyebrow)] leading-8 text-white/60"
        >
          {{ COPY.intro }}
        </p>
      </MotionReveal>

      <!-- A description list, because that is the shape: an office, and who
           holds it. A screen reader says "President, Jacqueline Wong" as one
           pair rather than reading ten unrelated lines.

           `<dl>` cannot take a grid directly and keep that pairing — the rows
           have to stay whole — so each pair is wrapped in its own `<div>`,
           which the spec allows and which is what the columns are laid on. -->
      <MotionReveal :y="32" :delay="0.16">
        <dl class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="officer in COPY.officers"
            :key="officer.role"
            class="flex flex-col gap-2"
          >
            <dt
              class="font-sans text-[length:var(--text-eyebrow)] leading-7 text-white/70 uppercase"
            >
              {{ officer.role }}
            </dt>
            <dd
              class="font-sans text-[length:var(--text-body-xl)] leading-[1.17] text-white"
            >
              {{ officer.name }}
            </dd>
          </div>
        </dl>
      </MotionReveal>

      <!-- One heading over five names rather than five rows repeating the same
           office, which is how the federation wrote it and how it reads. The
           `<ul>` is what tells a screen reader how many there are before it
           starts. -->
      <MotionReveal :y="32" :delay="0.24">
        <div class="flex flex-col gap-4">
          <h3
            class="font-sans text-[length:var(--text-eyebrow)] leading-7 text-white/70 uppercase"
          >
            {{ COPY.membersLabel }}
          </h3>
          <ul
            class="grid list-none grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            <li
              v-for="member in COPY.members"
              :key="member"
              class="font-sans text-[length:var(--text-body-xl)] leading-[1.17] text-white"
            >
              {{ member }}
            </li>
          </ul>
        </div>
      </MotionReveal>

      <MotionReveal :y="32" :delay="0.32">
        <p
          class="font-sans max-w-[824px] text-[length:var(--text-eyebrow)] leading-8 text-white/60"
        >
          {{ COPY.closing }}
        </p>
      </MotionReveal>
    </div>
  </section>
</template>
