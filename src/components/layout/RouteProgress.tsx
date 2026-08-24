"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

/**
 * Milliseconds the bar stays up after the new page is on screen.
 *
 * Most of this site's routes are prerendered and every nav link prefetches, so
 * a navigation is often over in a frame or two. A bar that vanished with it
 * would flicker — long enough to register as a glitch, not long enough to read
 * as an answer. This holds it. It delays nothing: the page swaps the moment it
 * is ready, and only the bar lingers.
 */
const MIN_VISIBLE = 450

/**
 * The bar can never outlive this, whatever happens.
 *
 * A navigation that is cancelled — the reader presses back, or the destination
 * throws — never reaches the watcher below, and a progress bar with no end is
 * worse than none.
 */
const SAFETY = 8000

let bar: HTMLElement | null = null
let removeTimer: number | undefined
let safetyTimer: number | undefined

/**
 * Puts the bar up. Called from the link that is being followed.
 *
 * **Not `useLinkStatus`**, which was the first attempt and the wrong tool here.
 * That hook reports Next's own pending state, which is honest but only becomes
 * true when the destination actually makes the reader wait — and eight of this
 * site's thirteen routes are prerendered while the rest prefetch, so on the
 * navigations this is for it never flips at all. A click is the event that is
 * always there.
 *
 * The node is built by hand rather than rendered, and that is not a shortcut:
 * `backdrop-filter` makes an element the containing block for its
 * `position: fixed` descendants, and the navbar's glass pill has one — a bar
 * rendered inside the menu would be measured against that pill and sit in it.
 * A React portal would need a mounted flag to survive SSR, which means setting
 * state from an effect. Appending a node to `<body>` is what effects are for.
 *
 * Class names are written as literals so Tailwind's source scanner finds them
 * (the call `PageShine` already had to make).
 */
export function startRouteProgress() {
  if (typeof document === "undefined") return

  // A second click while the first is still resolving keeps the bar it already
  // has rather than stacking another on top of it.
  window.clearTimeout(removeTimer)
  if (bar) return

  const track = document.createElement("div")
  // `aria-hidden`: the destination page announces itself when it arrives, and a
  // live region here would have a screen reader say "loading" over every link
  // press on a site where most presses resolve immediately.
  track.setAttribute("aria-hidden", "true")
  track.className =
    "pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] overflow-hidden bg-white/10"

  // The same sweep the loading screen's bar runs, and indeterminate for the
  // same reason: nothing here knows how much of the page has arrived, and a
  // percentage would be invented (D28).
  const thumb = document.createElement("span")
  thumb.className = "loading-sweep bg-gold block h-full w-1/3"

  track.append(thumb)
  document.body.append(track)
  bar = track

  safetyTimer = window.setTimeout(clearBar, SAFETY)
}

/** Takes it down, after the minimum it has to be visible for. */
function endRouteProgress() {
  if (!bar) return
  window.clearTimeout(removeTimer)
  removeTimer = window.setTimeout(clearBar, MIN_VISIBLE)
}

function clearBar() {
  window.clearTimeout(safetyTimer)
  bar?.remove()
  bar = null
}

/**
 * Watches for the page that was asked for actually arriving.
 *
 * Mounted once in the root layout. `usePathname` re-renders it on every
 * navigation, and the effect runs after the new page has been committed — which
 * is the moment the bar has finished saying what it was there to say.
 *
 * It renders nothing; the bar it controls is a node on `<body>`.
 */
export function RouteProgress() {
  const pathname = usePathname()

  useEffect(() => {
    endRouteProgress()
  }, [pathname])

  return null
}
