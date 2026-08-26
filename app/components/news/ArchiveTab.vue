<script setup lang="ts">
/**
 * One category tab in the archive strip — `166:8378` when selected, `166:8380`
 * otherwise.
 *
 * The selected tab is a 12%-white chip; the rest sit at half opacity with no
 * chip at all. `aria-current="page"` rather than a `tab` role: these really are
 * links to distinct URLs, and calling them tabs would promise a screen reader
 * arrow-key behaviour that navigation does not have.
 *
 * The Next build carried `scroll={false}` and an explicit `prefetch` here;
 * `router.options.ts` covers the first for every filter strip on the site, and
 * `NuxtLink` prefetches whole routes on visibility by default.
 */
defineProps<{ label: string; href: string; active: boolean }>()
</script>

<template>
  <li>
    <NuxtLink
      :to="href"
      :aria-current="active ? 'page' : undefined"
      :class="
        cn(
          'rounded-btn font-sans focus-visible:ring-gold block px-5 py-3 text-[length:var(--text-label-sm)] leading-relaxed font-medium tracking-[0.04em] whitespace-nowrap text-white uppercase transition-opacity focus-visible:ring-2 focus-visible:outline-none',
          active ? 'bg-white/12' : 'opacity-50 hover:opacity-80',
        )
      "
    >
      {{ label }}
    </NuxtLink>
  </li>
</template>
