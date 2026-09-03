<script setup lang="ts">
/**
 * The meta the federation edits in the CMS is applied HERE rather than per
 * page, because it is one response for the whole site and every route needs it.
 * Each page keeps its own `useSeoMeta` as the floor; this overrides it wherever
 * a row exists. See `useCmsSeo`.
 */
useCmsSeo()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
