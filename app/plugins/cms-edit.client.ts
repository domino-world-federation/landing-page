import { cmsFallbacks, useCmsOverrides } from "~/composables/usePageCopy"

/**
 * The page editor's side of the preview — active only when the page is opened
 * with `?cms-preview=` INSIDE a frame (the backoffice's editor screen).
 *
 * The editor and this page talk over `postMessage`, and every message in
 * either direction is pinned to `backofficeOrigin`:
 *
 * - out, `dwf-cms:ready` — the page is up; carries every built-in text read
 *   while rendering (`cmsFallbacks`), which the panel shows as placeholders;
 * - out, `dwf-cms:select` — someone clicked a marked element (`v-cms`);
 * - in, `dwf-cms:values` — the panel's current values, on every keystroke;
 *   they become overrides and win over the draft and the built-in copy;
 * - in, `dwf-cms:highlight` — a field was focused in the panel; its element
 *   scrolls into view and flashes.
 *
 * **The preview never leaves the page being edited.** A click on a marked
 * element is swallowed and becomes a field selection; a click on any other
 * link (the navbar, a card, a button) is swallowed too, and the editor is told
 * (`dwf-cms:navigation-blocked`) so it can say why nothing happened. Router
 * navigations started from code are refused the same way. Staying on the same
 * path is allowed — a page's own filters and anchors still work. Following a
 * link would load another page without the preview's token, into a panel that
 * is still editing the first one.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const params = new URL(window.location.href).searchParams
  if (!params.has("cms-preview")) return

  useHead({ meta: [{ name: "robots", content: "noindex, nofollow" }] })

  const origin = useRuntimeConfig().public.backofficeOrigin
  const framed = window.parent !== window
  if (!framed || !origin) return

  const overrides = useCmsOverrides()
  const send = (message: Record<string, unknown>) => window.parent.postMessage(message, origin)

  const style = document.createElement("style")
  style.textContent = `
    [data-edit-key] { cursor: pointer; }
    [data-edit-key]:hover { outline: 2px dashed #e1b762; outline-offset: 4px; }
    [data-edit-key].cms-flash { outline: 3px solid #e1b762; outline-offset: 4px; }
  `
  document.head.append(style)

  const here = () => window.location.pathname

  /** Whether following this link would leave the page being edited. */
  function leaves(link: HTMLAnchorElement): boolean {
    const href = link.getAttribute("href")
    if (!href || href.startsWith("#")) return false
    const url = new URL(link.href, window.location.href)
    return url.origin !== window.location.origin || url.pathname !== here()
  }

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target as Element | null
      const el = target?.closest<HTMLElement>("[data-edit-key]")
      if (el?.dataset.editKey) {
        event.preventDefault()
        event.stopPropagation()
        send({ type: "dwf-cms:select", key: el.dataset.editKey })
        return
      }

      const link = target?.closest<HTMLAnchorElement>("a[href]")
      if (link && leaves(link)) {
        event.preventDefault()
        event.stopPropagation()
        send({ type: "dwf-cms:navigation-blocked" })
      }
    },
    true,
  )

  // Navigations started from code (`navigateTo`, a button's router push) —
  // refused unless they stay on this path.
  useRouter().beforeEach((to, from) => {
    // The first navigation comes from the router's start location, which has
    // no match — that is the preview page itself arriving, not a departure.
    if (from.matched.length === 0 || to.path === from.path) return true
    send({ type: "dwf-cms:navigation-blocked" })
    return false
  })

  window.addEventListener("message", (event) => {
    if (event.origin !== origin) return
    const data = event.data as { type?: string; key?: string; values?: Record<string, string | string[] | null> }

    if (data?.type === "dwf-cms:values" && data.values) {
      overrides.value = { ...data.values }
    } else if (data?.type === "dwf-cms:highlight" && data.key) {
      // A field can be marked twice (the phone and desktop renderings of the
      // same section both exist, one hidden) — the visible one is the target.
      const target = [...document.querySelectorAll<HTMLElement>(`[data-edit-key="${CSS.escape(data.key)}"]`)]
        .find((el) => el.offsetParent !== null)
      if (!target) return
      target.scrollIntoView({ behavior: "smooth", block: "center" })
      target.classList.add("cms-flash")
      setTimeout(() => target.classList.remove("cms-flash"), 1200)
    }
  })

  nuxtApp.hook("app:mounted", () => {
    // After the first paint, so every section has rendered and read its
    // fallbacks at least once.
    setTimeout(() => {
      const defaults = Object.fromEntries(
        [...cmsFallbacks].map(([key, value]) => [key, Array.isArray(value) ? [...value] : value]),
      )
      send({ type: "dwf-cms:ready", defaults })
    }, 300)
  })
})
