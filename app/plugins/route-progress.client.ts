/**
 * The indeterminate bar that goes up while a page is on its way.
 *
 * **Not `<NuxtLoadingIndicator>`.** That component fills a bar towards a
 * percentage, and nothing on the client knows how much of a page has arrived —
 * inventing one is the same lie as a control with no backend (PRD D28). This
 * runs the sweep the loading screen uses instead, which reports that work is
 * happening and nothing more.
 *
 * The React build had to call `startRouteProgress` from every link's `onClick`,
 * because Next gives no hook that fires when a navigation begins and its own
 * pending state never flips for a prerendered route. Nuxt does: `page:start`
 * and `page:finish` bracket exactly the interval the bar is for, so the links
 * are left alone and the bar cannot be started by a click that never navigates.
 *
 * The node is built by hand rather than rendered, and that is not a shortcut:
 * `backdrop-filter` makes an element the containing block for its
 * `position: fixed` descendants, and the navbar's glass pill has one — a bar
 * rendered inside the menu would be measured against that pill and sit in it.
 *
 * Class names are written as literals so Tailwind's source scanner finds them
 * (the call `PageShine` already had to make).
 */

/**
 * Milliseconds the bar stays up after the new page is on screen.
 *
 * Most of this site's routes are prerendered and every nav link prefetches, so a
 * navigation is often over in a frame or two. A bar that vanished with it would
 * flicker — long enough to register as a glitch, not long enough to read as an
 * answer. This holds it. It delays nothing: the page swaps the moment it is
 * ready, and only the bar lingers.
 */
const MIN_VISIBLE = 450

/**
 * The bar can never outlive this, whatever happens.
 *
 * A navigation that is cancelled — the reader presses back, or the destination
 * throws — never reaches `page:finish`, and a progress bar with no end is worse
 * than none.
 */
const SAFETY = 8000

export default defineNuxtPlugin((nuxtApp) => {
  let bar: HTMLElement | null = null
  let removeTimer: number | undefined
  let safetyTimer: number | undefined

  function clearBar() {
    window.clearTimeout(safetyTimer)
    bar?.remove()
    bar = null
  }

  function start() {
    // A second navigation while the first is still resolving keeps the bar it
    // already has rather than stacking another on top of it.
    window.clearTimeout(removeTimer)
    if (bar) return

    const track = document.createElement("div")
    // `aria-hidden`: the destination page announces itself when it arrives, and
    // a live region here would have a screen reader say "loading" over every
    // link press on a site where most presses resolve immediately.
    track.setAttribute("aria-hidden", "true")
    track.className =
      "pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] overflow-hidden bg-white/10"

    // The same sweep the loading screen's bar runs, and indeterminate for the
    // same reason.
    const thumb = document.createElement("span")
    thumb.className = "loading-sweep bg-gold block h-full w-1/3"

    track.append(thumb)
    document.body.append(track)
    bar = track

    safetyTimer = window.setTimeout(clearBar, SAFETY)
  }

  function finish() {
    if (!bar) return
    window.clearTimeout(removeTimer)
    removeTimer = window.setTimeout(clearBar, MIN_VISIBLE)
  }

  nuxtApp.hook("page:start", start)
  nuxtApp.hook("page:finish", finish)
  // A destination that throws still has to take the bar down.
  nuxtApp.hook("vue:error", finish)
})
