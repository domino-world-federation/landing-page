<script setup lang="ts">
import type { EthicsClause } from "~/content/integrity/ethics"

/** The design's resting strength for a clause waiting its turn (`762:1337`). */
const IDLE = 0.4

/**
 * One clause of the code of ethics — Figma `762:1325` and its two siblings.
 *
 * The pillars block with its eyebrow and title replaced by a number, and it
 * behaves the same way: the whole block dims when it is not the one in the lit
 * slot, and its sentence only reads itself while it IS, so the reading front is
 * always where the reader is looking rather than running invisibly at the top of
 * the column.
 *
 * `0.4` rather than the pillars' `0.5` because that is what this frame draws —
 * `762:1337` sets the third clause's fill to `rgba(255,255,255,0.4)`, which also
 * happens to be `ReadingText`'s own unread colour. A clause waiting its turn and
 * a word not yet reached therefore sit at the same strength, which is the design
 * saying they are the same state.
 *
 * The duplicate's numbers stay out of the document outline — the column pads the
 * list at both ends, and otherwise the page reports five clauses where the
 * federation publishes three.
 */
const props = withDefaults(
  defineProps<{
    clause: EthicsClause
    duplicate: boolean
    focused?: boolean
    /**
     * Whether the sentence should be reading itself right now. Separate from
     * `focused`, and it has to be: `focused` is true from mount for whichever
     * clause starts in the slot, so a sentence keyed to it alone would read
     * itself while the section was still screens below the fold and arrive
     * already finished. The column supplies this from its own on-screen state.
     */
    reading?: boolean
  }>(),
  { focused: false, reading: false },
)

const numberTag = computed(() => (props.duplicate ? "p" : "h3"))

const prefersReducedMotion = useReducedMotion()

// Reduced motion collapses the TRANSITION, never the tree (RULES §12).
const dim = computed(() =>
  prefersReducedMotion.value
    ? { duration: 0 }
    : { duration: DURATION, ease: EASE },
)
</script>

<template>
  <Motion
    as="div"
    class="column-block flex flex-col"
    :initial="{ opacity: IDLE }"
    :animate="{ opacity: focused ? 1 : IDLE, transition: dim }"
    :style="{ willChange: 'opacity' }"
  >
    <!-- Bebas 72/64 (`762:1328`) — a number set tighter than its own font size,
         which is the step the pillars' titles take and the same token.

         It is the clause's heading: there is no other name for "01", and a
         reader tabbing by heading should find three of them. -->
    <component
      :is="numberTag"
      class="font-display text-[length:var(--text-display-pillar)] leading-[0.89] text-white"
    >
      {{ clause.number }}
    </component>

    <!-- Inter 36/56 and a 40px gap above it — the frame's own `gap: 40`. -->
    <p class="font-sans mt-10 text-[length:var(--text-body-lg)] leading-[1.56]">
      <MotionReadingText :text="clause.body" :active="reading" />
    </p>
  </Motion>
</template>
