/**
 * The screen ladder `nuxt.config`'s `image.screens` declares, in order.
 *
 * Kept here as well because `imageSizes` has to walk it, and a `sizes` string
 * that names a key the config does not carry is silently parsed as a pixel width
 * instead — `Number.parseInt("menu")` is `NaN`, and the candidate vanishes.
 */
const SCREENS = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "menu",
  "xxl",
  "2xl",
  "3xl",
] as const

type Screen = (typeof SCREENS)[number]

/**
 * Builds a `sizes` string for `<NuxtImg>` from the widths a layout actually
 * uses, expanded across the whole screen ladder.
 *
 * **Why this exists rather than writing `sizes` by hand.** A key in @nuxt/image's
 * `sizes` is not "from this width upwards" — it is the viewport width the
 * candidate is COMPUTED at, and the module emits one `srcset` entry per key. Two
 * consequences, both of which bit this port before it was caught by rendering
 * the page and reading the markup:
 *
 * 1. A bare `sizes="100vw"` is parsed as the key `"1px"`, so the only candidates
 *    generated were **1w and 2w** — a full-bleed hero served as a two-pixel
 *    image. It renders, it validates, and it looks like a bug in the artwork.
 * 2. Naming only the two widths a `next/image` media query mentioned
 *    (`xs:60vw lg:28vw`) emits only two candidates, so a 2560 monitor upscales
 *    the 1024 one.
 *
 * Passing the ladder every step fixes both: the media queries still collapse to
 * the boundaries that were asked for — @nuxt/image shifts each variant's query
 * onto the next one up, so runs of equal values behave as one — while the
 * `srcset` gains a candidate at every screen the site is actually viewed at.
 *
 * `spec` names the breakpoints where the width CHANGES; every step in between
 * carries the last value forward, which is how a `min-width` media query reads.
 *
 * ```ts
 * imageSizes({ xs: "60vw", lg: "28vw" })
 * // below 1024 → 60vw, from 1024 → 28vw, with nine srcset candidates
 * ```
 */
export function imageSizes(spec: Partial<Record<Screen, string>>): string {
  let current = spec.xs

  if (!current) {
    throw new Error("imageSizes: the `xs` step is required — it is the floor.")
  }

  return SCREENS.map((screen) => {
    current = spec[screen] ?? current
    return `${screen}:${current}`
  }).join(" ")
}

/** Full-bleed artwork: the viewport's width at every step. */
export const SIZES_FULL_BLEED = imageSizes({ xs: "100vw" })
