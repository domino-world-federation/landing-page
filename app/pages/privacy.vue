<script setup lang="ts">
import { PRIVACY_COPY } from "~/content/privacy"
import { PRIVACY_SECTIONS } from "~/content/privacy/sections"

/**
 * `/privacy` — Figma screen `174:10759`, inside the file's "Privacy Policy"
 * section.
 *
 * The second legal screen, and the one that proved `LegalDocument` was worth
 * extracting: it is the terms page with eight different clauses in it, down to
 * the header, the contents column, the white card and the 4px rules. The route
 * is therefore copy plus a component.
 */
useSeoMeta({
  title: "Privacy Policy | Domino World Federation",
  description:
    "How the Domino World Federation captures, processes and preserves personal details — what is collected, how it is used, who it is shared with, and the rights registered members hold.",
})
</script>

<template>
  <main>
    <LegalDocument :copy="PRIVACY_COPY" :sections="PRIVACY_SECTIONS" />
  </main>
</template>
