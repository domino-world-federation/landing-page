<script setup lang="ts">
/**
 * The header band the site's inner pages open with — Figma nodes `174:11163`
 * (terms), `174:11440` (privacy), `156:7155` (gallery) and `185:13185` (all
 * news).
 *
 * Those four draw the same band with different parts present: terms and privacy
 * carry a "Back" link and the date the document changed; gallery carries the
 * date and a search field; all news carries "Back" and a search field. One
 * component with three optional slots covers all four, which is the point — a
 * band that differs between pages for no reason a reader could name is a defect
 * rather than variation.
 *
 * Promoted here once there were four users (D32/D43). The landing-style headers
 * on About, Domino, Development, News and Contact are deliberately NOT moved:
 * they are the title-plus-intro shape, they have never needed a back link or a
 * date, and rewriting five finished pages to share a component with a different
 * job is regression risk without a payoff.
 *
 * Figma gives every one of these titles `filter: blur(7.5px)`. That is the state
 * it clears FROM, never an animated `filter` (RULES §11) — `SharpeningHeadline`
 * cross-fades two static-blur copies.
 */
defineProps<{
  /** One entry per line; `SharpeningHeadline` takes the array. */
  title: readonly string[]
  /** The "Back" link above the title, where a page has one. */
  back?: { label: string; href: string }
}>()

defineSlots<{
  /** Sits on the title's baseline — the date these pages print there. */
  meta?: () => unknown
  /** The right-hand slot: a search field on the pages that have one. */
  aside?: () => unknown
}>()
</script>

<template>
  <!-- 530px tall in Figma with 100px of padding under the content, bottom
       aligned. `min-h` rather than a height, so a longer translation grows the
       band instead of overflowing it; 27.6vw is 530/1920, so the design width
       reproduces the band exactly and narrower windows fall back to the floor.
       The top padding reserves the `fixed` navbar (~112px at `lg`: 36+60+16). -->
  <section
    class="flex min-h-[420px] flex-col justify-end gap-8 px-5 pt-32 pb-14 md:px-10 lg:min-h-[27.6vw] lg:gap-16 lg:px-20 lg:pb-[5.2vw]"
  >
    <NuxtLink
      v-if="back"
      :to="back.href"
      class="font-display focus-visible:ring-gold group flex w-fit items-center gap-3 text-[length:var(--text-display-caption)] leading-none text-[#aaaaaa] transition-colors hover:text-white focus-visible:ring-2 focus-visible:outline-none"
    >
      <!-- A 32px inline SVG sized in CSS. The shared asset already points LEFT,
           which is the direction this one means, so it is used unturned.
           `invert` because it is drawn in `#0E0E0E` for use on white. -->
      <img
        src="/assets/global/icon-arrow-left.svg"
        alt=""
        width="32"
        height="32"
        class="size-8 invert transition-transform duration-200 group-hover:-translate-x-0.5"
      >
      {{ back.label }}
    </NuxtLink>

    <div
      class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16"
    >
      <!-- `items-end` with a 48px gap: the date sits on the title's baseline
           rather than under it. It wraps below on a phone, where 84px of Inter
           has already taken the row. -->
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-12">
        <h1
          class="font-sans text-[length:var(--text-page-title)] leading-[1.1] font-medium text-white"
        >
          <MotionSharpeningHeadline :lines="title" />
        </h1>
        <slot name="meta" />
      </div>

      <slot name="aside" />
    </div>
  </section>
</template>
