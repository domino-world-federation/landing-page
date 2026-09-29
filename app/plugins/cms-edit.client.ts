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
 * A click on a marked element is swallowed rather than followed: several are
 * links or buttons, and following one would navigate the preview away from
 * the page being edited.
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

  document.addEventListener(
    "click",
    (event) => {
      const el = (event.target as Element | null)?.closest<HTMLElement>("[data-edit-key]")
      if (!el?.dataset.editKey) return
      event.preventDefault()
      event.stopPropagation()
      send({ type: "dwf-cms:select", key: el.dataset.editKey })
    },
    true,
  )

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
