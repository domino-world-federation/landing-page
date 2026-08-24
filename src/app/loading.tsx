import { LOADING_COPY } from "@/content/loading"

/**
 * What a page shows while it is still coming.
 *
 * At the root of `app/`, so it covers every route: Next renders it as the
 * Suspense fallback for whichever segment is navigating. The three dynamic
 * pages — `/faq`, `/gallery`, `/news` — are the ones that can actually reach
 * it, since they render on demand; the static ones are already built and swap
 * in without a wait.
 *
 * **It should be rare, and that is the point.** The tab links prefetch their
 * whole destination, so a filter usually swaps with nothing to wait for. This
 * is for the case that is genuinely slow — a cold visit, a bad connection —
 * where the alternative is a page that appears to have stopped responding.
 *
 * **CSS animation, not `motion`.** A fallback exists precisely when JavaScript
 * has nothing to show yet; an animation that waits for hydration would sit
 * still exactly when it is needed. Both properties here are composited
 * (RULES §12), and the global `prefers-reduced-motion` rule in `globals.css`
 * already collapses them.
 *
 * Server Component — it has to be, since it renders before the page it stands
 * in for.
 */
export default function Loading() {
  return (
    <div
      // `min-h-screen` rather than filling a parent: this replaces the entire
      // page, navbar included, so it owns the viewport while it is up.
      className="bg-bg flex min-h-screen flex-col items-center justify-center gap-10"
      role="status"
      aria-live="polite"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- an inline SVG
          sized in CSS. `next/image` would be the wrong tool twice over: this
          renders before the page it stands in for, and the optimiser would be
          a round trip in front of a screen whose job is to appear now. */}
      <img
        src="/assets/global/logo-dwf-emblem.svg"
        alt=""
        width={96}
        height={96}
        className="loading-mark size-20 lg:size-24"
      />

      {/* The bar is indeterminate on purpose: nothing here knows how much of
          the page has arrived, and a progress bar that invents a percentage is
          the same lie as a control with no backend (D28). It reports that work
          is happening, and nothing more. */}
      <div className="h-1 w-40 overflow-hidden rounded-full bg-white/12">
        <span className="loading-sweep bg-gold block h-full w-1/3 rounded-full" />
      </div>

      <p className="sr-only">{LOADING_COPY.label}</p>
    </div>
  )
}
