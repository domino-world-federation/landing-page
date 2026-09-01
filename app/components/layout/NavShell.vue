<script setup lang="ts">
/**
 * The attribute a section wears to say "the bar cannot be transparent over me".
 *
 * Put it on the SECTION rather than listing routes here: which grounds are light
 * is a fact about the page's own composition, and a list of paths in the header
 * would go stale the first time a section moved. Three carry it today —
 * `home/FeaturedEvent`, `development/YouthProgram` and
 * `tournaments/HighlightedTournament` — and they are exactly the three whose own
 * root is `bg-white` and full-bleed.
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
 * **Transparent by default, and opaque over a light section.** At rest the bar
 * carries no pane, by design: its own contents already hold the glass — the menu
 * pill and the burger are `bg-black/40` with a backdrop blur of their own (S1) —
 * so a second pane behind them would double the treatment and put a hard band
 * across the artwork. What passes underneath shows through untouched.
 *
 * That only works while what passes underneath is dark. Over the white event
 * band the white wordmark and the white menu labels land on white and the header
 * disappears. Figma's answer is `548:12520`: the bar takes `rgba(14,14,14,0.7)`
 * and a 10px backdrop blur — the same material as the pill, scaled to the full
 * width — so the type keeps its ground without the design gaining a solid header.
 *
 * **Why an observer rather than a scroll handler.** The question is only ever
 * "is a light section currently under the bar", which is an intersection between
 * two boxes; `IntersectionObserver` answers it off the main thread and fires
 * twice per crossing instead of on every frame of the scroll. The root margin
 * crops the viewport down to the bar's own band, so a section counts from the
 * moment its head reaches the bar and stops counting when its foot passes.
 */
const contrast = ref(false)

let observer: IntersectionObserver | null = null
const lit = new Set<Element>()

function connect() {
  observer?.disconnect()
  lit.clear()
  contrast.value = false

  const targets = document.querySelectorAll(CONTRAST_SELECTOR)
  if (targets.length === 0) return

  // Crop the observation area to the top `NAV_HEIGHT` pixels of the viewport.
  // The bottom margin is negative by everything below the bar, which is what
  // turns "visible anywhere" into "visible behind the header".
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) lit.add(entry.target)
        else lit.delete(entry.target)
      }
      contrast.value = lit.size > 0
    },
    { rootMargin: `0px 0px -${Math.max(0, window.innerHeight - NAV_HEIGHT)}px 0px` },
  )

  for (const target of targets) observer.observe(target)
}

const route = useRoute()

onMounted(() => {
  connect()

  // The margin is computed from the viewport height, so a resize invalidates it
  // — and a rotated phone is the case that matters, where the height can halve.
  const onResize = () => connect()
  window.addEventListener("resize", onResize, { passive: true })

  // A new page has different sections. `nextTick` because the route changes
  // before the incoming page's DOM exists, and observing the outgoing one's
  // nodes would leave the bar reading a page that is no longer there.
  const stop = watch(
    () => route.fullPath,
    () => nextTick(connect),
  )

  onBeforeUnmount(() => {
    observer?.disconnect()
    window.removeEventListener("resize", onResize)
    stop()
  })
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 pt-6 pb-4 md:px-10 lg:px-20 lg:pt-9"
  >
    <!-- The pane is always rendered and only its opacity changes, rather than
         the classes being swapped. Two reasons. `backdrop-filter` cannot be
         transitioned in any useful way, but an element that carries one can be
         faded, and fading it takes the blurred backdrop with it — so the bar
         arrives and leaves instead of snapping. And a pane that exists on the
         server as well as the client keeps the first render identical on both
         sides; `contrast` starts `false` either way, so nothing here can
         disagree at hydration.

         `-z-10` puts it behind the logo and the menu but still inside the
         header's own stacking context, so it cannot reach the page. -->
    <!-- The BLUR is toggled as well as the opacity, and it has to be.
         `backdrop-filter` is not switched off by a transparent element: the pane
         sat at `opacity-0` over every dark section and went on blurring whatever
         passed beneath it, so a heading scrolling under the header came out
         smeared with no pane visible to explain why. Only the colour can be
         faded; the filter is either on or off. -->
    <div
      aria-hidden="true"
      :class="
        cn(
          'pointer-events-none absolute inset-0 -z-10 bg-[rgba(14,14,14,0.7)] transition-opacity duration-300',
          contrast
            ? 'opacity-100 backdrop-blur-[10px]'
            : 'opacity-0 backdrop-blur-none',
        )
      "
    />

    <slot />
  </header>
</template>
