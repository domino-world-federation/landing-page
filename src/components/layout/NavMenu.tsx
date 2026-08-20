"use client"

import Link from "next/link"
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
 * Nine items at the design's 18px no longer fit below ~1536px, so the pill
 * collapses into a disclosure panel under `xl`.
 */
const MENU_ITEM_CLASS =
  "flex items-center rounded-btn px-4 py-2.5 text-[15px] leading-[26px] font-medium tracking-[0.04em] text-white uppercase transition-opacity 2xl:px-5 2xl:py-3 2xl:text-lg"

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
      <ul className="rounded-glass hidden items-center bg-black/40 p-1 backdrop-blur-[10px] xl:flex">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, pathname)

          return (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
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
        className="rounded-glass focus-visible:ring-gold flex h-11 w-11 items-center justify-center bg-black/40 backdrop-blur-[10px] focus-visible:ring-2 focus-visible:outline-none xl:hidden"
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
          className="rounded-glass absolute top-full right-0 z-10 mt-2 flex w-56 flex-col bg-black/40 p-1 backdrop-blur-[10px] xl:hidden"
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
                  onClick={() => setIsOpen(false)}
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
