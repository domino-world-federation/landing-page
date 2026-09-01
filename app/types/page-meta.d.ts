/**
 * Extra keys this site's pages set through `definePageMeta`.
 *
 * The Next build wrote the page's outer shell into every route file, so the two
 * pages that paint a `PageShine` behind their own content declared it in their
 * own markup. Here that shell is a layout, and a page cannot simply add a
 * sibling to its `<main>`: a route component has to have exactly one root
 * element or `<NuxtPage>` has nothing to transition. So the shine is declared
 * rather than rendered, and the layout puts it where it belongs.
 */
declare module "#app" {
  interface PageMeta {
    /**
     * The gold wash across the page's last third.
     *
     * Setting it also gives the page's outer wrapper `isolate`, which is not a
     * separate decision: the layer sits at `-z-10`, and without a stacking
     * context to be behind it slides underneath the page background itself. The
     * two always travel together, so they are one key.
     *
     * `aspectClass` is how much of the page's foot the layer covers, and it is
     * per-page because the three designs lit different amounts of theirs. It is
     * a literal Tailwind utility because the class scanner reads source text: a
     * ratio interpolated into a style would never be seen, and the layer would
     * collapse to zero height in a production build.
     *
     * There is no `src` any more. Each page used to name its own exported SVG;
     * the layer is now drawn entirely in CSS over a black ground.
     */
    shine?: { aspectClass: string }
  }
}

export {}
