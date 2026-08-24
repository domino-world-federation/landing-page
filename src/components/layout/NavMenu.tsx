"use client"

import Link from "next/link"

import { startRouteProgress } from "@/components/layout/RouteProgress"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { NAV_COPY, NAV_ITEMS } from "@/content/navigation"
import { cn } from "@/lib/utils/cn"

/**
 * Client-side only because the active item depends on `usePathname`, and the
 * mobile panel needs open/closed state. Kept separate from `Navbar` so the
 * header itself stays a Server Component (RULES §5).
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

/** Placeholder hrefs; only real routes can ever be active. */
function isActive(href: string, pathname: string): boolean {
  if (href === "#") return false
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}

export function NavMenu() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false)
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isOpen])

  return (
    <nav aria-label={NAV_COPY.menuLabel} className="relative">
      {/* Desktop: the glass pill from the design. */}
      <ul className="rounded-glass hidden items-center bg-black/40 p-1 backdrop-blur-[10px] menu:flex">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, pathname)

          return (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                // Puts the progress bar up. Skipped for the page already open
                // and for the placeholders, neither of which navigates — a bar
                // that came up for a click that goes nowhere would never be
                // taken down by the watcher.
                onClick={
                  active || item.href === "#" ? undefined : startRouteProgress
                }
                className={cn(
                  MENU_ITEM_CLASS,
                  "focus-visible:ring-gold focus-visible:ring-2 focus-visible:outline-none",
                  active ? "bg-white/12" : "opacity-50 hover:opacity-100",
                )}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Mobile: same glass treatment, disclosed on demand. */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="nav-panel"
        aria-label={isOpen ? NAV_COPY.closeMenu : NAV_COPY.openMenu}
        className="rounded-glass focus-visible:ring-gold flex h-11 w-11 items-center justify-center bg-black/40 backdrop-blur-[10px] focus-visible:ring-2 focus-visible:outline-none menu:hidden"
      >
        <span aria-hidden="true" className="relative block h-4 w-5">
          <span
            className={cn(
              "absolute left-0 block h-0.5 w-5 bg-white transition-transform",
              isOpen ? "top-[7px] rotate-45" : "top-0",
            )}
          />
          <span
            className={cn(
              "absolute top-[7px] left-0 block h-0.5 w-5 bg-white transition-opacity",
              isOpen && "opacity-0",
            )}
          />
          <span
            className={cn(
              "absolute left-0 block h-0.5 w-5 bg-white transition-transform",
              isOpen ? "top-[7px] -rotate-45" : "top-3.5",
            )}
          />
        </span>
      </button>

      {isOpen && (
        <ul
          id="nav-panel"
          // `bg-black/95`, not the pill's `/40`: the panel opens directly over
          // the hero's gold CTA, and the button is bright enough that
          // `backdrop-blur` alone cannot hide it — at 40% its label ghosts
          // straight through the menu items. Measured on the overlap, the
          // gold cast falls from rgb(27,22,13) at 85% to rgb(6,5,3) here,
          // against rgb(3,3,3) where the panel covers plain backdrop. Still
          // translucent, so the glass treatment survives.
          className="rounded-glass absolute top-full right-0 z-10 mt-2 flex w-56 flex-col bg-black/95 p-1 backdrop-blur-[10px] menu:hidden"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href, pathname)

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  // Closing on navigation belongs on the event, not in an
                  // effect — a route change would otherwise cascade a render.
                  onClick={() => {
                    setIsOpen(false)
                    if (!active && item.href !== "#") startRouteProgress()
                  }}
                  className={cn(
                    MENU_ITEM_CLASS,
                    "focus-visible:ring-gold w-full focus-visible:ring-2 focus-visible:outline-none",
                    active ? "bg-white/12" : "opacity-50 hover:opacity-100",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </nav>
  )
}
