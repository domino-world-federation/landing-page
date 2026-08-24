import type { ReactNode } from "react"

/**
 * The two-column body the side-tab pages share — 468 + 1452 at the design
 * width (`174:11225` beside `174:11257`, and the same split on privacy,
 * gallery and all news).
 *
 * **The sidebar comes second in the source and is pulled back with `order`.**
 * A reader on a phone — and a screen reader at any width — should meet the
 * content before its index, rather than nine contents links or five filter tabs
 * before the first word.
 *
 * Sticky above `lg`, because every page that uses this is long: the terms
 * document is 3553px at the design width and the gallery archive 4827. `top`
 * clears the `fixed` navbar; the `max-h` with its own scroll keeps the column
 * usable on a short window, where the tabs plus the support card are taller
 * than the viewport.
 *
 * Server Component: a layout.
 */
export function SideTabLayout({
  sidebar,
  children,
}: {
  sidebar: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-10 px-5 pb-16 md:px-10 lg:flex-row lg:items-start lg:gap-12 lg:px-20 lg:pb-24">
      <div className="flex flex-col gap-10 lg:order-first lg:w-[388px] lg:shrink-0">
        <div className="flex flex-col gap-10 lg:sticky lg:top-32 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto">
          {sidebar}
        </div>
      </div>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
