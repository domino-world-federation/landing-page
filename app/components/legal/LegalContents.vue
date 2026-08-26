<script setup lang="ts">
import type { LegalSection } from "~/content/legal"

/**
 * A legal document's contents column — Figma nodes `174:11226` (terms) and
 * `174:10821` (privacy).
 *
 * Links over hairline dividers, the current one marked with a gold bar. The rows
 * themselves are `ui/SideTab`, shared with the gallery's event filter; what lives
 * here is the only thing those columns do differently — deciding which row is
 * current.
 *
 * **The mark follows the reader.** Figma can only draw one state, so it paints
 * the first clause active; shipping that literally would give the page a marker
 * that never moves, which is worse than no marker at all — it would say "you are
 * in clause 1" for the whole document.
 *
 * Tracked with an `IntersectionObserver` rather than a scroll handler: the
 * browser reports the crossings itself, off the main thread, instead of the page
 * measuring every clause on every scroll event. The band is the top of the
 * viewport under the `fixed` navbar — `-120px` clears the bar, and the `-60%`
 * bottom keeps the band narrow so exactly one clause is ever "the one being
 * read" rather than every clause on screen.
 *
 * The initial state is the first clause on both sides of hydration, and the
 * markup does not branch on anything the server cannot know — the observer only
 * ever changes which existing node carries which class (RULES §12).
 */
const props = defineProps<{
  sections: readonly LegalSection[]
  title: string
  label: string
}>()

const activeId = ref(props.sections[0]?.id ?? "")

// Which clauses are inside the band right now. A plain Set rather than reactive
// state: it is written on every crossing and only the derived `activeId` should
// re-render anything.
const inBand = new Set<string>()

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const { id } = entry.target
        if (entry.isIntersecting) inBand.add(id)
        else inBand.delete(id)
      }

      // The topmost clause in the band wins, which is source order — the
      // observer hands entries back in whatever order they fired.
      const first = props.sections.find((section) => inBand.has(section.id))
      // Falls back to holding the last answer rather than clearing: between two
      // clauses the band can briefly contain none, and a marker that blinks off
      // in the gaps is worse than one that waits.
      if (first) activeId.value = first.id
    },
    { rootMargin: "-120px 0px -60% 0px" },
  )

  for (const section of props.sections) {
    const element = document.getElementById(section.id)
    if (element) observer.observe(element)
  }

  onBeforeUnmount(() => observer.disconnect())
})
</script>

<template>
  <UiSideTabList :label="label" :heading="title">
    <UiSideTab
      v-for="(section, index) in sections"
      :key="section.id"
      :href="`#${section.id}`"
      :active="section.id === activeId"
      current="true"
    >
      <!-- The number comes from the position, never from the string — Figma
           types every heading in both documents as "1." (see the sections
           files). -->
      {{ index + 1 }}. {{ section.heading }}
    </UiSideTab>
  </UiSideTabList>
</template>
