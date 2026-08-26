<script setup lang="ts">
import { getMemberFederations } from "~/lib/api/client"
import { MEMBERS_COPY } from "~/content/members"

/** The design's table is two columns of three (`405:28396`). */
const ROWS = 6

/**
 * The members directory — Figma node `405:28394`.
 *
 * A gold Bebas 100 heading, six federations in two columns, and a glass button
 * to the full list. The count is stated in the request rather than sliced here:
 * the table is a fixed composition, not a shelf that grows, so a directory that
 * gained a seventh member would otherwise quietly break the two-by-three (D45).
 */
const { data: federations } = await useAsyncData(
  "members-directory",
  () => getMemberFederations(ROWS),
  { default: () => [] },
)

// Two columns of three, filled DOWN each column as Figma fills them —
// Indonesia, Jamaica, Mexico on the left; USA, China, Brazil on the right.
const columns = computed(() => {
  const half = Math.ceil(federations.value.length / 2)
  return [federations.value.slice(0, half), federations.value.slice(half)]
})
</script>

<template>
  <section
    v-if="federations.length > 0"
    aria-labelledby="directory-heading"
    class="flex flex-col items-center gap-8 px-5 py-10 md:px-10 lg:gap-12 lg:px-20 lg:py-[3.125vw]"
  >
    <!-- Bebas 100 through the page's gold gradient. `uppercase` is the
         heading's, not the string's (D40). -->
    <h2
      id="directory-heading"
      class="font-display bg-[image:var(--gradient-gold-text)] bg-clip-text text-center text-[length:var(--text-display-statement)] leading-[1.08] text-transparent uppercase"
    >
      {{ MEMBERS_COPY.directoryHeading }}
    </h2>

    <div class="flex w-full flex-col gap-2 lg:flex-row">
      <ul
        v-for="(column, index) in columns"
        :key="index"
        class="flex flex-1 flex-col gap-2"
      >
        <MembersRow
          v-for="federation in column"
          :key="federation.id"
          :federation="federation"
        />
      </ul>
    </div>

    <!-- `405:28518` — 20% white glass, 320 × 64. Not `SilverCta`: that is the
         gradient pill, and this is a different button the design draws
         differently. -->
    <NuxtLink
      :to="MEMBERS_COPY.directoryCtaHref"
      class="rounded-btn font-display focus-visible:ring-gold flex h-16 w-full max-w-[320px] items-center justify-center bg-white/20 px-5 text-[length:var(--text-display-btn)] leading-10 text-white uppercase transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:outline-none"
    >
      {{ MEMBERS_COPY.directoryCta }}
    </NuxtLink>
  </section>
</template>
