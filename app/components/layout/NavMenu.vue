<script setup lang="ts">
import { onKeyStroke } from "@vueuse/core"

import type { NavItem } from "~/content/navigation"
import { NAV_COPY, NAV_ITEMS } from "~/content/navigation"

/**
 * The menu is the only interactive part of the header: the active item is read
 * off the current route, and the narrow layout needs open/closed state. It is
 * kept apart from `Navbar` so the header itself stays markup with nothing to
 * hydrate — the same split RULES §5 asks for.
 */

/**
 * Nine items are a fixed load that cannot shrink, and the row is sized as a
 * SHARE of the window rather than in the design's raw pixels.
 *
 * It used to be two measured steps — 15px up to 1600, then the design's 18px —
 * and the second step is what the repo owner reported as the navbar being too
 * big. It was not too big in pixels: measured against the Figma frame the pill
 * comes out at 1278px in both. It was too big for the window it was in. The
 * design is drawn at 1920, where 1283px of menu is 67% of the width; the same
 * 1283px on an 1800px screen is 71%, and the four points are what the eye reads
 * as a heavier bar.
 *
 * So the type and the padding carry the design's own slopes — 18/1920, 20/1920,
 * 12/1920 — and the row holds its 67% at every width. `--text-nav` documents the
 * type step; the two paddings are written here because they are this component's
 * and nothing else reads them.
 *
 * The floors are the old 15px step, and they still do the job that step did:
 * they take over at 1600 and hold the nine items on one line down to `menu`
 * (1400), below which the pill collapses into a disclosure panel.
 *
 * `whitespace-nowrap` is the backstop. The sizing decides *whether* the row
 * fits; this guarantees that when it does not — a longer label, another item, a
 * user font scale — it overflows visibly instead of quietly wrapping "About Us"
 * onto two lines and pushing the header 20px taller.
 *
 * Leading is a ratio, not the design's 26px: a fixed line box against a type
 * size that moves would make the pill taller in proportion as the labels got
 * smaller. 26/18 is the design's own.
 */
const MENU_ITEM_CLASS =
  "flex items-center whitespace-nowrap rounded-btn px-[clamp(1rem,1.0417vw,1.25rem)] py-[clamp(0.625rem,0.625vw,0.75rem)] text-nav leading-[1.4444] font-medium tracking-[0.04em] text-white uppercase transition-opacity"

/**
 * Shared by the pill's dropdown and by the panel's indented rows: 12px on every
 * side (`613:23050`), on the same slope as everything else in the bar so it
 * shrinks with the labels rather than swallowing them.
 */
const SUBMENU_ITEM_CLASS =
  "rounded-btn flex w-full items-center whitespace-nowrap p-[clamp(0.625rem,0.625vw,0.75rem)] text-nav leading-[1.4444] font-medium tracking-[0.04em] text-white uppercase transition-[opacity,background-color] focus-visible:ring-gold focus-visible:ring-2 focus-visible:outline-none"

const route = useRoute()
const isOpen = ref(false)

/**
 * Which parent's dropdown is showing, by label. One `ref` rather than a flag per
 * item, because only one can ever be open: the pill is a single row and two
 * panels hanging off it would overlap.
 */
const openLabel = ref<string | null>(null)

/** Placeholder and absent hrefs; only real routes can ever be active. */
function isActive(href?: string): boolean {
  if (!href || href === "#") return false
  return href === "/" ? route.path === "/" : route.path.startsWith(href)
}

/**
 * Whether an item or anything under it is the current page. A parent has no
 * destination of its own, so without this the pill holding the open menu would
 * be the one item in the bar that never lit up for the page the reader is on.
 */
function isBranchActive(item: NavItem): boolean {
  return isActive(item.href) || (item.children?.some((c) => isActive(c.href)) ?? false)
}

/** A stable id for the group label the narrow panel gives its children. */
function groupId(label: string): string {
  return `nav-group-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
}

function toggleSubmenu(item: NavItem) {
  openLabel.value = openLabel.value === item.label ? null : item.label
}

/**
 * Closes only when focus has genuinely left the item — `focusout` fires on every
 * move INSIDE it too, including the step from the parent link to its own arrow,
 * so without this check tabbing towards the dropdown is what shuts it.
 *
 * `relatedTarget` is null when focus leaves the document altogether (another
 * window, the URL bar); `contains(null)` is false, so that closes, which is
 * right.
 */
function onFocusOut(event: FocusEvent) {
  const item = event.currentTarget as HTMLElement
  if (!item.contains(event.relatedTarget as Node | null)) openLabel.value = null
}

// Closing on navigation belongs on the route, not on each link's handler: the
// panel must also shut for a back button or a programmatic push, neither of
// which passes through a click.
watch(() => route.fullPath, () => {
  isOpen.value = false
  openLabel.value = null
})

onKeyStroke("Escape", () => {
  isOpen.value = false
  openLabel.value = null
})
</script>

<template>
  <nav :aria-label="NAV_COPY.menuLabel" class="relative">
    <!-- Desktop: the glass pill from the design.

         `mouseenter` sets the open item on EVERY row, not only on the ones that
         have a dropdown — a childless neighbour sets it to `null`, which is what
         closes the panel when the pointer slides sideways off Members. -->
    <ul
      class="rounded-glass hidden items-center bg-black/40 p-1 backdrop-blur-[10px] menu:flex"
    >
      <li
        v-for="item in NAV_ITEMS"
        :key="item.label"
        class="relative"
        @mouseenter="openLabel = item.children ? item.label : null"
        @mouseleave="openLabel = null"
        @focusout="onFocusOut"
      >
        <!-- **A parent opens the menu and goes nowhere.** The whole pill is one
             button, where it used to be a link to the section's own page with
             the arrow as a separate control beside it. That split was the wrong
             shape: on a touch screen a tap is the only gesture there is, so the
             press that should have shown the reader two pages jumped them to one
             of them instead. The destination is not lost — the federation
             directory is the first item in the list this opens.

             One control also makes `aria-expanded` describe the thing that was
             pressed rather than a sibling of it, and needs no label of its own:
             the button says "Members". -->
        <button
          v-if="item.children"
          type="button"
          :aria-expanded="openLabel === item.label"
          :class="
            cn(
              MENU_ITEM_CLASS,
              'gap-2',
              'focus-visible:ring-gold focus-visible:ring-2 focus-visible:outline-none',
              isBranchActive(item) || openLabel === item.label
                ? 'bg-white/12'
                : 'opacity-50 hover:opacity-100',
            )
          "
          @click="toggleSubmenu(item)"
          @focus="openLabel = item.label"
        >
          {{ item.label }}

          <!-- `vuesax/bold/arrow-down` (`613:22984`), inlined rather than
               fetched: it is 24px of solid triangle, so a request would cost
               more than the path does. It does NOT flip when the menu opens —
               the design draws it pointing down in both states. -->
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            class="size-[clamp(1.25rem,1.25vw,1.5rem)] shrink-0 fill-current"
          >
            <path
              d="M18.29 9.71 13.4 14.6a1.98 1.98 0 0 1-2.8 0L5.71 9.71C5.08 9.08 5.53 8 6.42 8h11.16c.89 0 1.34 1.08.71 1.71Z"
            />
          </svg>
        </button>

        <NuxtLink
          v-else
          :to="item.href ?? '#'"
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

        <!-- `613:23049`: 330px, left-aligned under its parent, 5px below the
             pill — and that 5px is the wrapper's PADDING rather than a margin on
             the glass. A margin would leave five pixels of nothing between the
             item and the panel, and crossing nothing fires `mouseleave`: the
             menu would shut in the gap on the way to the thing it is offering.
             As padding the strip belongs to the item, so the pointer never
             leaves. -->
        <div
          v-if="item.children && openLabel === item.label"
          class="absolute top-full left-0 z-10 pt-[5px]"
        >
          <ul
            class="rounded-glass flex w-[clamp(17.1875rem,17.1875vw,20.625rem)] flex-col gap-1 bg-black/40 p-1 backdrop-blur-[10px]"
          >
            <li v-for="child in item.children" :key="child.label">
              <NuxtLink
                :to="child.href"
                :aria-current="isActive(child.href) ? 'page' : undefined"
                :class="
                  cn(
                    SUBMENU_ITEM_CLASS,
                    isActive(child.href)
                      ? 'bg-white/12'
                      : 'opacity-50 hover:bg-white/12 hover:opacity-100',
                  )
                "
              >
                {{ child.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
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
      class="rounded-glass absolute top-full right-0 z-10 mt-2 flex w-72 flex-col bg-black/95 p-1 backdrop-blur-[10px] menu:hidden"
    >
      <li v-for="item in NAV_ITEMS" :key="item.label">
        <!-- A parent is a heading here, not a control. Its children are already
             listed under it, so there is nothing for it to open — and it has no
             destination of its own to offer, so an anchor would be a link to
             nowhere. `aria-labelledby` on the list is what carries the grouping
             that the visual indent shows.

             This panel only exists on a screen too narrow for the pill, which is
             a screen with no hover to open a dropdown with; a second level of
             tapping to reach two links is a worse answer than two indented rows.
             `w-56` became `w-72` for them: the labels are `whitespace-nowrap`,
             so "FEDERATION MEMBERS" plus its indent ran past 224px. -->
        <p
          v-if="item.children"
          :id="groupId(item.label)"
          :class="cn(MENU_ITEM_CLASS, 'w-full opacity-50')"
        >
          {{ item.label }}
        </p>

        <NuxtLink
          v-else
          :to="item.href ?? '#'"
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

        <ul
          v-if="item.children"
          :aria-labelledby="groupId(item.label)"
          class="flex flex-col"
        >
          <li v-for="child in item.children" :key="child.label">
            <NuxtLink
              :to="child.href"
              :aria-current="isActive(child.href) ? 'page' : undefined"
              :class="
                cn(
                  SUBMENU_ITEM_CLASS,
                  'pl-8',
                  isActive(child.href)
                    ? 'bg-white/12'
                    : 'opacity-50 hover:opacity-100',
                )
              "
            >
              {{ child.label }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
