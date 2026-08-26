<script setup lang="ts">
import type { FederationStat } from "~/lib/api/types"

/**
 * One rendering of a stat — a label on the left, a figure on the right.
 *
 * `tone` picks between the two treatments the wheel cross-fades: the focused
 * copy is gold and sharp, the idle one is white, dim and blurred. They are
 * separate copies rather than one animated element because neither the blur nor
 * the gradient can be animated — `filter` repaints every frame (RULES §12) and a
 * gradient has nothing to interpolate.
 */
const props = defineProps<{
  stat: FederationStat
  visible: number
  scale: number
  transition: object
  tone: "focus" | "idle"
}>()

const focus = computed(() => props.tone === "focus")
</script>

<template>
  <Motion
    as="div"
    class="absolute inset-0 flex items-center justify-between gap-6"
    :initial="false"
    :animate="{ opacity: visible, scale }"
    :transition="transition"
  >
    <span
      :class="
        cn(
          'font-sans text-[length:var(--text-stat-label)] leading-tight font-medium text-white',
          !focus && 'blur-[3.5px]',
        )
      "
    >
      {{ stat.label }}
    </span>

    <span
      :class="
        cn(
          'font-display text-[length:var(--text-display-stat)] leading-none',
          focus
            ? 'bg-[image:var(--gradient-gold-text)] bg-clip-text text-transparent'
            : 'bg-linear-to-b from-white to-white/40 bg-clip-text text-transparent blur-[10px]',
        )
      "
    >
      {{ stat.value }}
    </span>
  </Motion>
</template>
