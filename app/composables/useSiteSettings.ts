import { getSiteSettings } from "~/lib/api/client"
import type { SiteSettings } from "~/lib/api/types"

/**
 * The federation's contact details, fetched once for the whole site.
 *
 * Two components read them and they are never on screen together — the footer
 * is on every route, `/contact` adds its own panel above it. A fixed
 * `useAsyncData` key is what makes that ONE request rather than two: Nuxt
 * dedupes by key within a render and replays the result from the payload on the
 * client, so the second caller costs nothing.
 *
 * **Returns an empty object rather than throwing or blanking.** A footer that
 * fails to render because a settings request failed would take every page down
 * with it — the footer is on all of them. Missing keys are the normal case
 * anyway (§5.4 omits blanks), so callers write `?? fallback` once and that same
 * line covers the API being absent, slow, or broken.
 */
export function useSiteSettings() {
  const { data } = useAsyncData("site-settings", () => getSiteSettings(), {
    default: (): SiteSettings => ({}),
  })

  return data
}
