import { getPageCopy } from "~/lib/api/client"
import type { PageCopyValues } from "~/lib/api/types"

/**
 * A page's text as the backoffice's page editor has it, over the copy in
 * `app/content/` — `copy.text("header.intro", ABOUT_HEADER_COPY.intro)`.
 *
 * **The built-in copy stays the source of last resort.** A field nobody has
 * filled (or one emptied again) is simply absent from the API, and the
 * fallback passed here renders — so a page is never blank, and a page whose
 * text is not in the editor yet is untouched.
 *
 * **In the editor's preview** (`?cms-preview=` in the URL) three things change:
 * the fetch asks for the DRAFT, the panel's keystrokes arrive as overrides
 * (`useCmsOverrides`, filled by `plugins/cms-edit.client.ts`) and win over
 * both, and every fallback read here is recorded, so the panel can show the
 * built-in text as each field's placeholder.
 *
 * Fetched during the server render (`useAsyncData`), like `useHomeCopy`: text
 * that swapped a beat after the page painted would be the first thing a
 * reader saw.
 */
export function usePageCopy(page: string) {
  const route = useRoute()
  const preview = typeof route.query["cms-preview"] === "string"
    ? route.query["cms-preview"]
    : undefined

  const { data } = useAsyncData(
    `page-copy-${page}`,
    () => getPageCopy(page, preview),
    { default: (): PageCopyValues => ({}) },
  )

  const overrides = useCmsOverrides()

  function resolve<T>(key: string, fallback: T): string | string[] | T {
    if (preview) cmsFallbacks.set(key, fallback as string | readonly string[])

    if (key in overrides.value) {
      const override = overrides.value[key]
      return override ?? fallback
    }

    return data.value[key] ?? fallback
  }

  /** A single string field. */
  function text(key: string, fallback: string): string {
    const value = resolve(key, fallback)
    return Array.isArray(value) ? value.join(" ") : (value as string)
  }

  /** A field drawn one line per entry (headings the design breaks). */
  function lines(key: string, fallback: readonly string[]): readonly string[] {
    const value = resolve(key, fallback)
    return typeof value === "string" ? [value] : (value as readonly string[])
  }

  return { text, lines }
}

/**
 * The editor panel's unsaved values, pushed into the preview on every
 * keystroke. `null` = the field was emptied, so the built-in copy shows.
 * Empty everywhere but the preview.
 */
export function useCmsOverrides() {
  return useState<Record<string, string | string[] | null>>("cms-overrides", () => ({}))
}

/**
 * Every built-in text read while rendering the preview, by key — sent to the
 * editor once the page is up, as the panel's placeholders. A plain map, not
 * state: it is written during render and must not trigger one.
 */
export const cmsFallbacks = new Map<string, string | readonly string[]>()
