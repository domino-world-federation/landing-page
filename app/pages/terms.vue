<script setup lang="ts">
import { TERMS_COPY } from "~/content/terms"
import { TERMS_SECTIONS } from "~/content/terms/sections"

/**
 * `/terms` — Figma screen `174:11162`, inside the file's "Terms & Conditions"
 * section.
 *
 * The page is `LegalDocument` plus this document's copy. It was hand-built first
 * and generalised the moment the Privacy Policy arrived on the identical screen
 * (D32/D43) — the two cannot drift apart now, and the FAQ screen (`173:9459`)
 * joins them if it is built on the same shell.
 *
 * The site's usual outer shell comes from the `default` layout: navbar
 * overlaying the page, then content, then the footer outside `<main>` as its own
 * landmark. No `PageShine`, no `Join`.
 */
useSeoMeta({
  title: "Terms & Conditions | Domino World Federation",
  description:
    "The terms of engagement for the Domino World Federation portal — member federation status, intellectual property, code of conduct, tournament participation, liability and governing law.",
})
</script>

<template>
  <main>
    <LegalDocument :copy="TERMS_COPY" :sections="TERMS_SECTIONS" />
  </main>
</template>
