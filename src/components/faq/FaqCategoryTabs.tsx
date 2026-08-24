import { SideTab, SideTabList } from "@/components/ui/SideTabs"
import { FAQ_PAGE_COPY } from "@/content/faq"
import {
  FAQ_CATEGORIES,
  type FaqCategory,
  type FaqPageItem,
} from "@/content/faq/items"

/**
 * The topic column — Figma node `173:9842`.
 *
 * The legal contents column's rows (`ui/SideTabs`, D32/D43) doing the gallery's
 * job rather than the terms document's: each row is a link to `?category=`, the
 * page re-renders on the server with one drawer of questions, and the whole
 * section stays a Server Component (D50).
 *
 * **Only the drawers that hold something are listed.** The design names five —
 * general, dwf, tournament, membership, development (`173:9528` and siblings) —
 * but the ten questions it writes fall into two of them, so printing all five
 * would give the page three tabs that filter to an empty card. A tab leading
 * nowhere is worse than a tab the designer drew and the copy has not caught up
 * with (D50, for the third time); the missing three appear on their own the
 * moment a question is filed under them.
 *
 * A live search is carried across a tab click rather than dropped, so narrowing
 * by topic while searching does not silently throw the search away — the same
 * reason `/news/all` forwards `?category=` into its archive link (D58).
 *
 * Server Component.
 */
export function FaqCategoryTabs({
  items,
  active,
  query,
}: {
  /** The whole list, not the filtered one: the column always shows the way out
   *  of a filter. */
  items: readonly FaqPageItem[]
  /** The `?category=` slug, or `undefined` for "All FAQs". */
  active?: string
  /** The live `?q=`, forwarded so a tab click keeps it. */
  query?: string
}) {
  const search = query ? `q=${encodeURIComponent(query)}` : ""
  const href = (category?: FaqCategory) => {
    const params = [
      category ? `category=${category}` : "",
      search,
    ].filter(Boolean)
    return params.length ? `/faq?${params.join("&")}` : "/faq"
  }

  return (
    // No heading above the list: the design gives this column none, unlike the
    // legal contents with its "Table of Contents" line.
    // `scroll={false}` on every row: the reader is already looking at the
    // questions when they narrow them, and jumping to the top of the document
    // to swap a list in place is what reads as a reload.
    <SideTabList label={FAQ_PAGE_COPY.filterLabel}>
      <SideTab href={href()} active={active === undefined} scroll={false}>
        {FAQ_PAGE_COPY.allTab}
      </SideTab>

      {FAQ_CATEGORIES.filter((category) =>
        items.some((item) => item.category === category.id),
      ).map((category) => (
        <SideTab
          key={category.id}
          href={href(category.id)}
          active={active === category.id}
          scroll={false}
        >
          {category.label}
        </SideTab>
      ))}
    </SideTabList>
  )
}
