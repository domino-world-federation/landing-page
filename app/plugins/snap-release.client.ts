/**
 * Takes the snapping page's scrollport off `<html>` the moment a navigation to
 * another page begins.
 *
 * Four pages carry `snap-sections`, which puts `scroll-snap-type: y mandatory`
 * on the document's scrollport (see `main.css`). `useHead` adds that class when
 * the page mounts and unhead removes it when the page unmounts — and the
 * unmount is one frame too late.
 *
 * Measured leaving `/tournaments` from the middle of the rail: at 68ms the
 * router swapped the document (9412px tall down to 4027) while
 * `scroll-snap-type` was still `y mandatory`, so the browser did what a
 * mandatory scrollport must and pulled the viewport to a snap point — y=2947,
 * a third of the way down the new page. The class came off at 70ms, two
 * milliseconds after the damage. `/news` → an article, from the same offset,
 * landed at 0, because that page does not snap; which is what made this look
 * like one page's bug rather than a rule about all four.
 *
 * `beforeEach` is early enough: it runs before the route resolves, so the class
 * is gone before anything is replaced. A destination that snaps too gets it
 * straight back from its own `useHead` — the class is declared per page, and
 * this only ever removes it in the gap between two of them.
 *
 * Client-only because it is a DOM write, and there is no scrolling to protect
 * during SSR.
 */
export default defineNuxtPlugin(() => {
  const router = useRouter()

  router.beforeEach((to, from) => {
    // A query change on the same page is a filter, not a navigation: nothing is
    // being replaced, and dropping the snap there would break scrolling on the
    // page the reader is still reading.
    if (to.path !== from.path) {
      document.documentElement.classList.remove("snap-sections")
    }
  })
})
