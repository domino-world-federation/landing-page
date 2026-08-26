<script setup lang="ts">
import type { IsoDateString } from "~/lib/api/types"
import type { Remaining } from "~/utils/date"
import { COUNTDOWN_COPY } from "~/content/home/countdown"

/**
 * The only interactive part of S3 — the digits, and nothing else (RULES §5).
 *
 * The first render deliberately shows nothing rather than a computed value: the
 * server has no idea what "now" is on the visitor's clock, so any number it
 * printed would be replaced on hydration and Vue would report the mismatch. The
 * card reserves the row's height either way, so no layout shift follows.
 */
const props = defineProps<{ startsAt: IsoDateString }>()

const UNITS = [
  { key: "days", label: COUNTDOWN_COPY.units.days },
  { key: "hours", label: COUNTDOWN_COPY.units.hours },
  { key: "mins", label: COUNTDOWN_COPY.units.mins },
] as const

const remaining = ref<Remaining | null>(null)

/** "5 days, 13 hours, 42 minutes" — spoken, so the units are spelled out. */
function describe(value: Remaining): string {
  if (value.isOver) return COUNTDOWN_COPY.started

  const parts = [
    [value.days, "day"],
    [value.hours, "hour"],
    [value.mins, "minute"],
  ] as const

  const spoken = parts
    .filter(([n]) => n > 0)
    .map(([n, unit]) => `${n} ${unit}${n === 1 ? "" : "s"}`)
    .join(", ")

  return COUNTDOWN_COPY.remaining.replace("{time}", spoken || "under a minute")
}

const spoken = computed(() =>
  remaining.value ? describe(remaining.value) : "",
)

onMounted(() => {
  let interval: ReturnType<typeof setInterval> | undefined

  function tick() {
    remaining.value = getRemaining(props.startsAt, Date.now())
  }

  tick()

  // Ticking every second would repaint the row sixty times for every one time it
  // changes — the smallest unit shown is minutes. Aligning to the top of the
  // next minute keeps the flip on time without polling.
  const msToNextMinute = 60_000 - (Date.now() % 60_000)
  const timeout = setTimeout(() => {
    tick()
    interval = setInterval(tick, 60_000)
  }, msToNextMinute)

  onBeforeUnmount(() => {
    clearTimeout(timeout)
    if (interval) clearInterval(interval)
  })
})

// A card whose event is swapped out re-reads the clock rather than counting
// towards the date it was mounted with.
watch(() => props.startsAt, (next) => {
  if (import.meta.client) remaining.value = getRemaining(next, Date.now())
})
</script>

<template>
  <div class="flex items-center justify-between">
    <!-- One live region for the whole row, so a change is announced as a
         sentence instead of three loose numbers. -->
    <p class="sr-only" aria-live="polite">{{ spoken }}</p>

    <template v-for="(unit, index) in UNITS" :key="unit.key">
      <span
        v-if="index > 0"
        aria-hidden="true"
        class="font-display text-[length:var(--text-display-2xs)] leading-none text-white"
      >:</span>

      <div aria-hidden="true" class="flex flex-1 flex-col items-center gap-3">
        <!-- `tabular-nums` so the digits keep their column as they tick. -->
        <span
          class="font-display text-[length:var(--text-display-xs)] leading-none text-white tabular-nums"
        >
          {{ remaining ? padUnit(remaining[unit.key]) : "--" }}
        </span>
        <span class="font-sans text-sm leading-[22px] text-white/60 uppercase">
          {{ unit.label }}
        </span>
      </div>
    </template>
  </div>
</template>
