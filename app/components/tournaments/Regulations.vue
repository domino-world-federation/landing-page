<script setup lang="ts">
import { getResources } from "~/lib/api/client"
import { TOURNAMENTS_COPY } from "~/content/tournaments"

/**
 * Tournament Regulations — Figma node `381:17589`.
 *
 * A gold heading on the left, the documents wrapping in a 1136 column on the
 * right. The cards are `ui/DocumentCard`, which the news press shelf drew first
 * and which this block draws identically (D32/D43) — date over a Bebas title
 * with the file pill bottom-right.
 *
 * Asked for by category rather than by count: this is a shelf holding however
 * many documents the federation files under it, unlike S10's 2×2 grid which had
 * to state a number because its four documents share no shelf (D45).
 */
const { data: documents } = await useAsyncData(
  "tournament-regulations",
  () => getResources("Tournament Regulations"),
  { default: () => [] },
)
</script>

<template>
  <section
    v-if="documents.length > 0"
    aria-labelledby="tournament-regulations-heading"
    class="bg-bg px-5 py-16 md:px-10 lg:px-20 lg:py-[3.125vw]"
  >
    <div class="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-16">
      <MotionReveal :y="24">
        <!-- Bebas 76/72, held to 360px in the design so it sets as two lines
             beside the shelf (`381:17631`). -->
        <h2
          id="tournament-regulations-heading"
          class="font-display bg-[image:var(--gradient-gold-text)] bg-clip-text text-[length:var(--text-display-sm)] leading-[0.95] text-transparent uppercase lg:w-[360px]"
        >
          {{ TOURNAMENTS_COPY.regulations.heading }}
        </h2>
      </MotionReveal>

      <!-- 1136 wide with a 16px gutter, so two 560 cards sit abreast and the
           third wraps — which is what the design draws. `flex-wrap` with the
           card's own `basis` does that at every width rather than at one. -->
      <div class="flex flex-wrap items-start gap-4 lg:w-[59.17vw]">
        <UiDocumentCard
          v-for="document in documents"
          :key="document.id"
          :document="document"
          :download-label="TOURNAMENTS_COPY.regulations.downloadLabel"
        />
      </div>
    </div>
  </section>
</template>
