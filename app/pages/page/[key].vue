<script setup lang="ts">
import { LEGAL_DOCUMENTS } from "~/content/legal"

/**
 * `/page/[key]` — the legal documents, on one route.
 *
 * Terms (`613:24310`) and Privacy (`613:23545`) are the same screen with
 * different clauses in it, and until now they were two page files that differed
 * only in which two constants they imported. The repo owner asked for one page,
 * which is also what the shape of the thing wanted: the key names a document in
 * `LEGAL_DOCUMENTS` and everything else — the header, the contents column, the
 * panel — comes from `LegalDocument` exactly as it did before.
 *
 * **An unknown key is a 404, not an empty document.** `createError` with
 * `fatal: true` renders the error page during SSR with a real status, so a typo
 * or a stale link is reported rather than answered with a page-shaped blank at
 * 200 (D28, on a route this time).
 */
const route = useRoute()

const document = computed(() => {
  const key = route.params.key
  return typeof key === "string" ? LEGAL_DOCUMENTS[key] : undefined
})

if (!document.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  })
}

useSeoMeta({
  title: () => document.value?.seo.title,
  description: () => document.value?.seo.description,
})
</script>

<template>
  <main v-if="document">
    <LegalDocument :copy="document.copy" :sections="document.sections" />
  </main>
</template>
