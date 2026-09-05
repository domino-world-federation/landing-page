import { getHomeCopy } from "~/lib/api/client"
import type { HomeCopy } from "~/lib/api/types"

/**
 * The home page's editable copy, fetched once for the page.
 *
 * `home/Hero` and `home/Join` are the two readers, and they sit at opposite
 * ends of the same page — the fixed key is what keeps that a single request.
 *
 * **The hero is the first thing anyone sees, so this must resolve during the
 * server render.** `useAsyncData` awaited in setup does exactly that; fetching
 * on mount instead would draw the headline a beat after the page, and a hero
 * that swaps its own words is the worst possible first impression.
 */
export function useHomeCopy() {
  const { data } = useAsyncData("home-copy", () => getHomeCopy(), {
    default: (): HomeCopy => ({ hero: {}, closing: {} }),
  })

  return data
}
