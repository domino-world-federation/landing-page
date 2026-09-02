<script setup lang="ts">
import type { MemberFederation } from "~/lib/api/types"
import { MEMBERS_COPY, MEMBERSHIP_TIERS } from "~/content/members"

/**
 * The record, now shown in a window over the page — `793:3634`.
 *
 * **It carries its own ground, and that is the fix for what it looked like
 * without one.** It stood beside the list before, where a translucent
 * `bg-white/[0.07]` was right: the page behind it was the section's own black.
 * Inside a dialog the same panel let the register show straight through it and
 * the record read as floating text over a blurred page. The design's card is
 * `#161616` at 24 of padding on a 20 radius, and the ground belongs to the card
 * rather than to the dialog — the dialog is the window, this is the thing in
 * it.
 *
 * `h-full` went with it: the card was told the list's height so the two columns
 * stayed level, and there is no list beside it now. `max-h-[85dvh]` in its place
 * so a long record scrolls inside the window rather than growing past it.
 *
 * The website link moved off the corner to `right-14`: the dialog's close button
 * takes the top-right, which is where the design puts it (`793:3656`), and two
 * controls stacked on the same corner is one of them unreachable.
 *
 * The federation's mark, its tier, its name, the year it joined, and a panel of
 * the three facts a reader would write down: who runs it, where it is, how to
 * reach it.
 *
 * **The card is a fixed height** — `h-full` inside a row that stretches to the
 * list beside it, so it is the same box whichever federation is open. Sized to
 * its contents it jumped between 564px and 300px as the reader moved down the
 * list, which resized the whole section under them; a record with less filed in
 * should leave space, not shrink the furniture.
 *
 * **Every row here is conditional, and the panel disappears with them.** A body
 * can be recognised long before it has filed a president or a phone number — see
 * `MemberFederation`. A card that printed the labels anyway would be four
 * headings over nothing, which reads as data that failed to load rather than
 * data that was never given.
 */
const props = defineProps<{ federation: MemberFederation }>()

const COPY = MEMBERS_COPY.directoryDetail

const tier = computed(() =>
  MEMBERSHIP_TIERS.find((t) => t.id === props.federation.tierId),
)

/** The tier dot, drawn the way the map's markers and its legend are: a gradient
 *  disc with the middle punched out, because a `border` cannot take a
 *  gradient. */
const tierDot = computed(() => {
  const t = tier.value
  if (!t) return undefined
  return {
    background: `linear-gradient(0deg, ${t.from} 0%, ${t.to} 100%)`,
    boxShadow: `0 0 4px 0 ${t.from}`,
    mask: "radial-gradient(circle, transparent 0 2px, #000 2px)",
    WebkitMask: "radial-gradient(circle, transparent 0 2px, #000 2px)",
  }
})

const hasPanel = computed(
  () =>
    Boolean(props.federation.president) ||
    Boolean(props.federation.headquarters) ||
    Boolean(props.federation.email) ||
    Boolean(props.federation.phone),
)

const LABEL = "font-sans text-[length:var(--text-label-xs)] leading-6 text-white/50"
const VALUE =
  "font-sans text-[length:var(--text-body-sm)] leading-7 font-medium text-white"
</script>

<template>
  <!-- `role="status"`: the card is what changes when a row is pressed, and it is
       one node that swaps its contents rather than one per federation, so a
       screen reader is told once. -->
  <div
    role="status"
    class="flex max-h-[85dvh] flex-col items-center gap-6 overflow-y-auto rounded-[var(--radius-card)] bg-[#161616] p-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  >
    <div class="relative flex w-full flex-col items-center gap-2">
      <!-- The federation's own site, top-right (`405:28398`). Absent where the
           record has no URL — an arrow that goes nowhere is the silent no-op
           D28 rules out. -->
      <NuxtLink
        v-if="federation.websiteUrl"
        :to="federation.websiteUrl"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="COPY.websiteLabel.replace('%s', federation.name)"
        class="focus-visible:ring-gold absolute top-0 right-14 flex size-10 items-center justify-center rounded-[var(--radius-btn)] bg-black/50 transition-colors hover:bg-black/80 focus-visible:ring-2 focus-visible:outline-none"
      >
        <!-- The shared glyph points LEFT; +135° turns it up-and-right.
             `invert` because it is drawn dark for use on white. -->
        <img
          src="/assets/global/icon-arrow-left.svg"
          alt=""
          aria-hidden="true"
          width="20"
          height="20"
          class="size-5 rotate-135 invert"
        >
      </NuxtLink>

      <!-- The same `#3E3E3E` placeholder the rows carry, at the card's size. -->
      <span
        class="relative size-20 shrink-0 overflow-hidden rounded-[var(--radius-btn)] bg-[#3e3e3e]"
      >
        <NuxtImg
          v-if="federation.flagUrl"
          :src="federation.flagUrl"
          alt=""
          :sizes="imageSizes({ xs: '96px' })"
          class="absolute inset-0 size-full object-cover"
        />
      </span>

      <p v-if="tier" class="flex items-center gap-2">
        <span aria-hidden class="size-3 shrink-0 rounded-full" :style="tierDot" />
        <span class="font-sans text-[length:var(--text-label-xs)] leading-6 text-white/70">
          {{ tier.label }}
        </span>
      </p>

      <p
        class="font-sans text-center text-[length:var(--text-body-md)] leading-8 font-semibold text-balance text-white"
      >
        {{ federation.name }}
      </p>

      <p
        v-if="federation.joinedYear"
        class="font-sans text-[length:var(--text-label-xs)] leading-6 text-white/50"
      >
        {{ COPY.joined(federation.joinedYear) }}
      </p>
    </div>

    <!-- A `<dl>` because every row is a label and its value. -->
    <dl
      v-if="hasPanel"
      class="flex w-full flex-col gap-3.5 rounded-[var(--radius-glass)] bg-white/[0.06] p-4"
    >
      <div v-if="federation.president" class="flex flex-col gap-0.5">
        <dt :class="LABEL">{{ COPY.president }}</dt>
        <dd :class="VALUE">{{ federation.president }}</dd>
      </div>

      <div v-if="federation.headquarters" class="flex flex-col gap-0.5">
        <dt :class="LABEL">{{ COPY.headquarters }}</dt>
        <dd :class="VALUE">{{ federation.headquarters }}</dd>
      </div>

      <div v-if="federation.email || federation.phone" class="flex flex-col gap-0.5">
        <dt :class="LABEL">{{ COPY.contact }}</dt>
        <!-- Real `mailto:`/`tel:` links. These are the one pair of controls on
             the page that CAN act without a backend, so D28's "refuse in the
             open" does not apply to them. -->
        <dd v-if="federation.email" :class="VALUE">
          <a
            :href="`mailto:${federation.email}`"
            class="focus-visible:ring-gold transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:outline-none"
          >
            {{ federation.email }}
          </a>
        </dd>
        <dd v-if="federation.phone" :class="VALUE">
          <a
            :href="`tel:${federation.phone.replace(/\s/g, '')}`"
            class="focus-visible:ring-gold transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:outline-none"
          >
            {{ federation.phone }}
          </a>
        </dd>
      </div>
    </dl>
  </div>
</template>
