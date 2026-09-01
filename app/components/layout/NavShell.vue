<script setup lang="ts">
/**
 * The attribute a section wears to say "the bar cannot be transparent over me".
 *
 * Put it on the SECTION rather than listing routes here: which grounds are light
 * is a fact about the page's own composition, and a list of paths in the header
 * would go stale the first time a section moved. Five carry it —
 * `home/FeaturedEvent`, `development/YouthProgram`, `governance/Overview`,
 * `integrity/Principles` and `tournaments/HighlightedTournament` — and they are
 * exactly the five whose own root is `bg-white` and full-bleed.
 *
 * Since the bar went opaque from the second section on, this marker only decides
 * anything on a page whose first section is the whole page. The docblock on the
 * component says why it is kept rather than deleted.
 */
const CONTRAST_SELECTOR = "[data-nav-contrast]"

/**
 * The bar's height, and therefore how deep the band is that decides the state.
 *
 * 112 at `lg` (36 + 60 + 16) and 84 below it, so the larger is used: a band a
 * few pixels too tall flips the bar a few pixels early, which is invisible,
 * while one too short leaves the logo sitting on white for the difference.
 */
const NAV_HEIGHT = 112

/**
 * Makes the header travel with the page, and decides whether it needs a ground
 * of its own.
 *
 * It used to be `absolute` at the document's `y:0` — the Figma placement, where
 * the bar sits on top of the hero rather than in a band of its own. Measured,
 * that meant it scrolled away with the hero and was gone by 150px, logo and all.
 * `fixed` keeps exactly the same overlay look at rest while letting it follow.
 *
 * **Transparent over the FIRST section, opaque from the next one on.** The
 * design draws the bar three times and annotates the frames: `613:23054` has no
 * fill and is labelled "at first section", `613:22937` takes
 * `rgba(14,14,14,0.7)` with a 10px backdrop blur and is labelled "then move to
 * the next section". So the pane is not a reaction to what is underneath — it is
 * a reaction to having left the top of the page.
 *
 * At the top the bar carries no pane because its own contents already hold the
 * glass: the menu pill and the burger are `bg-black/40` with a backdrop blur of
 * their own (S1), so a second pane behind them would double the treatment and
 * put a hard band across the hero's artwork. Past the hero there is no artwork
 * to protect and a great deal of varied ground to sit on, which is what the pane
 * answers — including the white bands (`548:12520`) that used to be the ONLY
 * thing that turned it on.
 *
 * **The light-section rule is kept as well, and it is not redundant.** It reads
 * `[data-nav-contrast]`, and it is what covers a page whose first section is the
 * whole page — the legal documents render one component under `<main>`, so
 * "past the first section" never becomes true there and the pane would never
 * arrive. Nothing marked today is ever a page's first section, so the two rules
 * do not currently overlap; they are OR-ed rather than ordered because either
 * one alone is a reason the bar cannot be transparent.
 *
 * **The two rules are answered by two different mechanisms, and that split is
 * the point.**
 *
 * The light sections keep the `IntersectionObserver`. "Is a white band currently
 * under the bar" is genuinely an overlap between two boxes, the overlap has real
 * area on both sides of every crossing, and the observer answers it off the main
 * thread and fires twice per crossing instead of on every frame of the scroll.
 * The root margin crops the viewport to the bar's own band, so a section counts
 * from the moment its head reaches the bar and stops when its foot passes.
 *
 * **The first section cannot be asked that way, and the attempt produced a bug
 * worth recording.** Every section on the landing page is now a full viewport
 * and a snap point, so the hero's foot comes to rest EXACTLY on the top edge of
 * that band. The rects touch and nothing overlaps — and a zero-area touch is
 * still "intersecting" to the observer, with a ratio of 0. Against the default
 * `threshold: [0]` that means the threshold index never changes and
 * `isIntersecting` never changes, so **no callback is delivered at all** on the
 * one transition that matters.
 *
 * The reported symptom is that fingerprint exactly: leaving the hero for the
 * section below it changed nothing (no callback), carrying on to the third
 * section finally turned the bar on (the hero left the band for real), coming
 * back up to the second kept it on (correct, by luck), and coming back up INTO
 * the hero left it on (no callback again, so the stale value stood). Reaching
 * for a threshold list does not fix it either: thresholds are ratios of the
 * TARGET's area, and the most a 112px band can ever cover of a viewport-tall
 * hero is about a tenth — the numbers that would have to be listed depend on how
 * tall the hero happens to be.
 *
 * So that rule is a scroll comparison instead, and it is a cheap one: the first
 * section's foot is measured ONCE into document space, and each scroll event
 * compares it against `scrollY` — a read of a number, with no layout forced and
 * no geometry recomputed. Being sampled rather than event-driven, it also cannot
 * miss a transition, which is the whole failure above.
 */
/**
 * How opaque the pane is, 0–1 — a number rather than a boolean, and that is the
 * whole of what makes the bar arrive smoothly.
 *
 * A boolean can only be switched, and switching it was what read as rough: the
 * bar crossed its threshold in the middle of a snap animation, so the fade began
 * after the section had already landed and looked bolted on. This is driven by
 * the scroll instead — the pane comes up across the last `paneRamp` pixels
 * before the first section's foot, so it is finished exactly as the next section
 * arrives, and the reader sees the bar materialise as part of the same movement
 * rather than after it.
 *
 * The light sections still force it to 1 outright; they are answered by an
 * observer and have no ramp to ride. The short CSS transition on the element
 * covers that flip, and against a value that is already moving per frame it only
 * takes the last edge off.
 */
const paneOpacity = ref(0)

/**
 * 10px is the design's blur (`effect_72672f49`), scaled by how present the pane
 * is — see the note on the element itself for why it is interpolated and why it
 * is REMOVED at zero rather than set to `blur(0px)`.
 *
 * `-webkit-` is written out rather than left to Vue's prefixer: Safari only
 * dropped the prefix in 18, and this bar is the one element whose failure mode
 * is white type on a white ground.
 */
const paneStyle = computed(() => {
  const shown = paneOpacity.value
  const blur = shown > 0 ? `blur(${(shown * 10).toFixed(2)}px)` : undefined

  return {
    opacity: shown,
    backdropFilter: blur,
    WebkitBackdropFilter: blur,
  }
})

let observer: IntersectionObserver | null = null
const lit = new Set<Element>()

/**
 * Document-space Y of the first section's foot — the scroll position at which
 * the bar stops being over the first section.
 *
 * `Infinity` when there is nothing to measure, and that default is the safe one:
 * the comparison below can then never be true, so the bar falls back to the
 * light-section rule alone — exactly how it behaved before this rule existed.
 */
let firstBottom = Number.POSITIVE_INFINITY

/**
 * Pixels of scroll the pane fades in over, ending at `firstBottom`.
 *
 * Proportional to the viewport rather than a flat number, because the thing it
 * has to keep pace with is a snap animation across a full screen: a fixed 240px
 * is a third of that travel on a laptop and a tenth of it on a large display, so
 * the same constant reads as a fade on one and as a switch on the other. 35% is
 * long enough to cover the eased tail of the snap, where the scroll is slowest
 * and a step would be most visible. The floor is for short windows.
 */
let paneRamp = 320

function apply() {
  const start = firstBottom - paneRamp
  const ramp = Number.isFinite(firstBottom)
    ? Math.min(1, Math.max(0, (window.scrollY - start) / paneRamp))
    : 0

  paneOpacity.value = lit.size > 0 ? 1 : ramp
}

function connect() {
  observer?.disconnect()
  observer = null
  lit.clear()

  // The first section IS the first element under `<main>` on every page here.
  // Read as an element rather than by a marker attribute so a new page cannot
  // forget to opt in — the bar would be silently wrong on it, and being wrong
  // means white type on white ground.
  //
  // Measured here and not on every scroll: `getBoundingClientRect` forces
  // layout, and the answer only changes when the page or the window does. Both
  // of those already call this function.
  paneRamp = Math.max(160, window.innerHeight * 0.35)

  const first = document.querySelector("main")?.firstElementChild ?? null
  firstBottom = first
    ? first.getBoundingClientRect().bottom + window.scrollY
    : Number.POSITIVE_INFINITY

  const light = document.querySelectorAll(CONTRAST_SELECTOR)
  if (light.length > 0) {
    // Crop the observation area to the top `NAV_HEIGHT` pixels of the viewport.
    // The bottom margin is negative by everything below the bar, which is what
    // turns "visible anywhere" into "visible behind the header".
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) lit.add(entry.target)
          else lit.delete(entry.target)
        }
        apply()
      },
      { rootMargin: `0px 0px -${Math.max(0, window.innerHeight - NAV_HEIGHT)}px 0px` },
    )

    for (const target of light) observer.observe(target)
  }

  apply()
}

const nuxtApp = useNuxtApp()

onMounted(() => {
  // `nextTick`, not a bare call. **The layout renders this header BEFORE
  // `<slot/>`**, so when this hook fires the page's `<main>` may not be in the
  // DOM at all and `connect` would find nothing to watch. On a hydrated first
  // load it is there anyway — the server sent it — which is why the bar has
  // always worked on a hard refresh and is exactly what hid this.
  nextTick(connect)

  // `apply` reads one number off `window` and compares it. No layout is forced
  // and nothing is measured, so this is safe to run on every scroll event —
  // which is what makes the first-section rule impossible to miss a step of.
  window.addEventListener("scroll", apply, { passive: true })

  // The margin is computed from the viewport height and the first section's foot
  // is measured against the layout, so a resize invalidates both — and a rotated
  // phone is the case that matters, where the height can halve.
  const onResize = () => connect()
  window.addEventListener("resize", onResize, { passive: true })

  // A new page has different sections, and `page:finish` is the moment they
  // exist. Watching `route.fullPath` was not enough and could not be made
  // enough: the route changes before the incoming page renders, and the home
  // page renders behind a Suspense boundary — `HomeCountdown` awaits its data in
  // `setup` — so its `<main>` arrives one async resolution AFTER any `nextTick`
  // the watcher could schedule. Reaching home from another page therefore left
  // the bar observing nothing, and it stayed transparent the whole way down.
  const unhook = nuxtApp.hook("page:finish", () => nextTick(connect))

  onBeforeUnmount(() => {
    observer?.disconnect()
    window.removeEventListener("scroll", apply)
    window.removeEventListener("resize", onResize)
    unhook()
  })
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 pt-6 pb-4 md:px-10 lg:px-20 lg:pt-9"
  >
    <!-- The pane is always rendered and only its style changes, rather than the
         classes being swapped. A pane that exists on the server as well as the
         client keeps the first render identical on both sides: `paneOpacity`
         starts at 0 either way, so nothing here can disagree at hydration.

         `-z-10` puts it behind the logo and the menu but still inside the
         header's own stacking context, so it cannot reach the page.

         **The blur is ramped with the colour, not switched with it.** It used to
         be toggled, and it had to be: `backdrop-filter` is not switched off by a
         transparent element, so a pane left blurring at `opacity-0` smeared every
         heading that scrolled under the bar with nothing visible to explain why.
         Toggling fixed that and bought the roughness — 10px of blur appearing in
         one frame under a colour that was still fading in. Interpolating the
         radius instead answers both: at `paneOpacity: 0` the property is removed
         altogether, so there is no filter to smear with, and every value above it
         is proportional to how visible the pane already is.

         The filter is dropped rather than set to `blur(0px)`, which would look
         identical and cost real work — a backdrop filter of any radius makes the
         browser snapshot and process what is behind the element on every frame,
         and this bar sits over a page of parallax. -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10 bg-[rgba(14,14,14,0.7)] transition-[opacity,backdrop-filter] duration-150 ease-out"
      :style="paneStyle"
    />

    <slot />
  </header>
</template>
