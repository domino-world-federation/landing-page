import Link from "next/link"
import type { ReactNode } from "react"

/**
 * The side-tab column's chrome — Figma nodes `174:11226` (terms) and
 * `173:10082` (gallery).
 *
 * Both pages draw the identical list: rows of Bebas 32/40 separated by 1px
 * hairlines, the current one marked with a 4px gold bar in the margin and gold
 * type. Only the meaning differs — the terms column is a table of contents that
 * jumps within the document, the gallery column filters the page to one event —
 * so what is shared here is the appearance, and each page keeps its own idea of
 * which row is current.
 *
 * Presentational and server-safe: no `"use client"`, so the terms column (a
 * Client Component, because it tracks the reader's position) and the gallery
 * column (a Server Component, because its state is in the URL) can both use it.
 */
export function SideTabList({
  label,
  heading,
  children,
}: {
  /** Names the column for assistive tech. */
  label: string
  /** The small grey line above the list, where a page has one — the terms
   *  column is headed "Table of Contents"; the gallery column is not headed
   *  at all. */
  heading?: string
  children: ReactNode
}) {
  return (
    <nav aria-label={label} className="flex flex-col gap-2">
      {heading && (
        <p className="font-sans text-label-muted text-[length:var(--text-eyebrow)] leading-7 font-medium">
          {heading}
        </p>
      )}
      <ol className="flex flex-col">{children}</ol>
    </nav>
  )
}

/**
 * One row — `174:11228` when current, `174:11232` otherwise.
 *
 * The gold bar REPLACES the inactive row's left padding rather than adding to
 * it, so the type keeps one left edge down the column and the bar reads as a
 * marker in the margin instead of shunting the row across.
 */
export function SideTab({
  href,
  active,
  /** `"page"` where the row is a destination the reader is on; `"true"` where
   *  it marks a position within the current page, as the terms contents do. */
  current = "page",
  scroll,
  children,
}: {
  href: string
  active: boolean
  current?: "page" | "true"
  scroll?: boolean
  children: ReactNode
}) {
  return (
    <li
      // The hairline between rows (`174:11231`). On the item and skipped on the
      // first, so a list of n rows carries n−1 rules and none at its head.
      className="border-t border-[#353535] first:border-t-0"
    >
      <Link
        href={href}
        aria-current={active ? current : undefined}
        scroll={scroll}
        className={`font-display focus-visible:ring-gold flex items-center gap-3 py-6 text-[length:var(--text-display-caption)] leading-[1.25] transition-colors focus-visible:ring-2 focus-visible:outline-none ${
          active ? "text-gold" : "text-muted hover:text-white/80 pl-4"
        }`}
      >
        {active && <span aria-hidden className="bg-gold h-9 w-1 shrink-0" />}
        <span>{children}</span>
      </Link>
    </li>
  )
}
