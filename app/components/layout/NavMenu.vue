<script setup lang="ts">
import { onKeyStroke } from "@vueuse/core"

import { NAV_COPY, NAV_ITEMS } from "~/content/navigation"

/**
 * The menu is the only interactive part of the header: the active item is read
 * off the current route, and the narrow layout needs open/closed state. It is
 * kept apart from `Navbar` so the header itself stays markup with nothing to
 * hydrate — the same split RULES §5 asks for.
 */

/**
 * Nine items are a fixed load that cannot shrink, so both size steps are keyed
 * to measured widths rather than stock breakpoints (`--breakpoint-menu`,
 * `--breakpoint-menu-lg`): 1058px of row needs 1400, and the design's own 18px
 * widens it to 1283px, which needs 1600. Below the first, the pill collapses
 * into a disclosure panel.
 *
 * `whitespace-nowrap` is the backstop. The breakpoints decide *whether* the row
 * fits; this guarantees that when it does not — a longer label, another item, a
 * user font scale — it overflows visibly instead of quietly wrapping "About Us"
 * onto two lines and pushing the header 20px taller.
 */
const MENU_ITEM_CLASS =
  "flex items-center whitespace-nowrap rounded-btn px-4 py-2.5 text-[15px] leading-[26px] font-medium tracking-[0.04em] text-white uppercase transition-opacity menu-lg:px-5 menu-lg:py-3 menu-lg:text-lg"

const route = useRoute()
const isOpen = ref(false)

/** Placeholder hrefs; only real routes can ever be active. */
function isActive(href: string): boolean {
  if (href === "#") return false
  return href === "/" ? route.path === "/" : route.path.startsWith(href)
}

// Closing on navigation belongs on the route, not on each link's handler: the
// panel must also shut for a back button or a programmatic push, neither of
// which passes through a click.
watch(() => route.fullPath, () => { isOpen.value = false })

onKeyStroke("Escape", () => { isOpen.value = false })
</script>

<template>
  <nav :aria-label="NAV_COPY.menuLabel" class="relative">
    <!-- Desktop: the glass pill from the design. -->
    <ul
      class="rounded-glass hidden items-center bg-black/40 p-1 backdrop-blur-[10px] menu:flex"
    >
      <li v-for="item in NAV_ITEMS" :key="item.label">
        <NuxtLink
          :to="item.href"
          :aria-current="isActive(item.href) ? 'page' : undefined"
          :class="
            cn(
              MENU_ITEM_CLASS,
              'focus-visible:ring-gold focus-visible:ring-2 focus-visible:outline-none',
              isActive(item.href) ? 'bg-white/12' : 'opacity-50 hover:opacity-100',
            )
          "
        >
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>

    <!-- Mobile: same glass treatment, disclosed on demand. -->
    <button
      type="button"
      :aria-expanded="isOpen"
      aria-controls="nav-panel"
      :aria-label="isOpen ? NAV_COPY.closeMenu : NAV_COPY.openMenu"
      class="rounded-glass focus-visible:ring-gold flex h-11 w-11 items-center justify-center bg-black/40 backdrop-blur-[10px] focus-visible:ring-2 focus-visible:outline-none menu:hidden"
      @click="isOpen = !isOpen"
    >
      <span aria-hidden="true" class="relative block h-4 w-5">
        <span
          :class="
            cn(
              'absolute left-0 block h-0.5 w-5 bg-white transition-transform',
              isOpen ? 'top-[7px] rotate-45' : 'top-0',
            )
          "
        />
        <span
          :class="
            cn(
              'absolute top-[7px] left-0 block h-0.5 w-5 bg-white transition-opacity',
              isOpen && 'opacity-0',
            )
          "
        />
        <span
          :class="
            cn(
              'absolute left-0 block h-0.5 w-5 bg-white transition-transform',
              isOpen ? 'top-[7px] -rotate-45' : 'top-3.5',
            )
          "
        />
      </span>
    </button>

    <!-- `bg-black/95`, not the pill's `/40`: the panel opens directly over the
         hero's gold CTA, and the button is bright enough that `backdrop-blur`
         alone cannot hide it — at 40% its label ghosts straight through the
         menu items. Measured on the overlap, the gold cast falls from
         rgb(27,22,13) at 85% to rgb(6,5,3) here, against rgb(3,3,3) where the
         panel covers plain backdrop. Still translucent, so the glass treatment
         survives. -->
    <ul
      v-if="isOpen"
      id="nav-panel"
      class="rounded-glass absolute top-full right-0 z-10 mt-2 flex w-56 flex-col bg-black/95 p-1 backdrop-blur-[10px] menu:hidden"
    >
      <li v-for="item in NAV_ITEMS" :key="item.label">
        <NuxtLink
          :to="item.href"
          :aria-current="isActive(item.href) ? 'page' : undefined"
          :class="
            cn(
              MENU_ITEM_CLASS,
              'focus-visible:ring-gold w-full focus-visible:ring-2 focus-visible:outline-none',
              isActive(item.href) ? 'bg-white/12' : 'opacity-50 hover:opacity-100',
            )
          "
        >
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
