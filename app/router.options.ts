import type { RouterConfig } from "@nuxt/schema"

/**
 * Where the page lands after a navigation.
 *
 * Nuxt's default sends every route change to the top, which is right when the
 * destination is a different page and wrong for the filter strips on `/page/faq`,
 * `/gallery`, the news archive and `/tournaments/all`. Those are links — the
 * filter lives in the URL so it can be shared (D50) — but the reader is already
 * looking at the list when they narrow it, and jumping to the top of the
 * document to swap a list in place is what reads as a reload. The Next build
 * said so per link, with `scroll={false}`; here it is one rule, which also
 * covers a filter changed by the back button.
 *
 * A changed hash still wins: that IS a request to move somewhere on the page,
 * and it is how the legal contents column works.
 *
 * **Returning the position synchronously is deliberate.** The obvious repair for
 * "the new page opens halfway down" is to wait here for `page:finish` before
 * handing the position back, the way Nuxt's own built-in `scrollBehavior` does.
 * That is not what was wrong: the culprit was `scroll-snap-type: y mandatory`
 * surviving one frame into the next document, and it is fixed where it happens —
 * `plugins/snap-release.client.ts`, which takes the class off before anything is
 * replaced. Waiting here as well would only delay a scroll that now lands.
 */
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    if (to.hash) {
      /*
       * **The offset is applied HERE, and `scroll-mt` alone never did it.**
       *
       * This used to return the element with no offset, on the reasoning that
       * the target's own `scroll-margin-top` would keep it clear of the `fixed`
       * navbar and applying both would subtract twice. That was wrong about the
       * mechanism: `scroll-margin` is honoured by `scrollIntoView()` and by the
       * browser's own fragment navigation, and by nothing else. These links are
       * `NuxtLink`s, so the router scrolls instead — and it computes the target
       * from `getBoundingClientRect()`, which knows nothing about scroll margin.
       * Every contents link landed its heading at y=0, underneath the bar.
       *
       * The number is still not written here. It is read back off the target's
       * own `scroll-margin-top`, so the stylesheet stays the one place that
       * decides it — `--anchor-offset` in `main.css` — and any element given a
       * `scroll-mt-*` is handled without this file learning about it.
       *
       * `getElementById`, not `querySelector`: the legal documents' ids are the
       * API's row ids, so `#3` is a real target and an invalid CSS selector.
       */
      const id = decodeURIComponent(to.hash.slice(1))
      const target = import.meta.client ? document.getElementById(id) : null
      const offset = target
        ? Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0
        : 0

      return { el: to.hash, top: offset, behavior: "smooth" }
    }

    // Same route, different query: a filter was applied. Stay put.
    if (to.path === from.path) return false

    return { left: 0, top: 0 }
  },
}
