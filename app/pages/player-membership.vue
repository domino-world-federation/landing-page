<script setup lang="ts">
/**
 * `/player-membership` — Figma screen `629:28323`.
 *
 * The page the navbar's Members dropdown has pointed at since the dropdown was
 * built and which did not exist until now: what a DWF ID is, what holding one
 * grants, who may apply and how it is done, ending on the site's closing call.
 *
 * Five blocks, and the design's own five. Four of them are full screens; "What
 * is DWF ID?" is not — its frame hugs its content (`629:28537`), which is three
 * short paragraphs, and stretching it to a screen would put most of one in
 * empty space. It is the one section here that is as tall as what it says.
 *
 * **The shine is the design's own** (`629:28324`, y2708, 1920 × 2739): a
 * 1920/2739 layer anchored to the document's foot, which reaches the head of the
 * "Who can apply" band — the section whose gradient falls to nothing so it can
 * hand over to it. Rendered by the `default` layout from this meta, the way
 * Development, Governance, Integrity and the federation directory do.
 *
 * It snaps section by section like About, Domino and Tournaments. Declared here
 * rather than in the layout because that layout serves eleven routes and only
 * some of them snap; unhead takes the attribute off again on route change.
 */
definePageMeta({
  shine: { aspectClass: "aspect-[1920/2739]" },
})

useHead({ htmlAttrs: { class: "snap-sections" } })

useSeoMeta({
  title: "Player Membership | Domino World Federation",
  description:
    "The DWF ID — one verified identity across the federation's network. What it is, what it grants, who can apply and how the application works.",
})
</script>

<template>
  <main class="snap-children relative z-10">
    <PlayerMembershipHero />
    <PlayerMembershipWhatIs />
    <PlayerMembershipBenefits />
    <PlayerMembershipApply />
    <PlayerMembershipCta />
  </main>
</template>
