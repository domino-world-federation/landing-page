import Link from "next/link"

import { NewsGridCard } from "@/components/news/NewsGridCard"
import { SilverCta } from "@/components/ui/SilverCta"
import { NEWS_ARCHIVE_COPY } from "@/content/news/archive"
import { getLatestNews, getNewsCategories } from "@/lib/api/client"

/** The design's grid is six tiles, three abreast, two rows (`165:8250`). */
const PAGE = 6

/** The grid's own anchor, so "view more" returns the reader to the tiles
 *  rather than to the top of the document. */
const ANCHOR = "latest-articles"

type NewsArchiveProps = {
  /** From `?category=`. Absent means every category — the "All" tab. */
  category?: string
}

/**
 * The archive — Figma nodes `166:8431` (the filter) and `165:8250` (the grid).
 *
 * **The filter is links, not state.** Each tab is an `<a>` to `?category=`, the
 * page re-renders on the server, and `getLatestNews` filters there. That is
 * three things at once: it keeps the whole section a Server Component
 * (RULES §5), it makes a filtered archive a URL somebody can send to somebody
 * else, and it puts the filtering where RULES §8 wants it — the real endpoint
 * takes `?category=`, whereas a client island sifting the feed would download
 * every article the federation has filed in order to show six of them (D45).
 *
 * **The tab labels come from the feed.** Figma names five — All, DWF,
 * Tournaments, Members, Development (`166:8377`) — and the feed's categories
 * are a different vocabulary, so the design's list would print tabs that filter
 * to nothing while hiding categories that have articles in them. The design's
 * five are the shape; `getNewsCategories` supplies the words. Only "All" is
 * copy, because it is the one tab that is not a category.
 *
 * **"View more" goes to `/news/all`.** It used to grow a `?show=` in steps of
 * six, because when this section was built there was nowhere for it to lead.
 * There is now — `185:13184` is the full archive, two columns wide with a
 * "Back" link pointing here — so this block shows the six the design draws and
 * the button opens the page the design drew for it. One mechanism instead of
 * two, and one fewer thing invented.
 */
export async function NewsArchive({ category }: NewsArchiveProps) {
  const categories = await getNewsCategories()

  // One over the page: if the extra article comes back there is more archive to
  // open, and if it does not the button has nothing to lead to. Cheaper than a
  // second call for a count, and it cannot disagree with the list.
  const fetched = await getLatestNews(PAGE + 1, category)
  const articles = fetched.slice(0, PAGE)
  const hasMore = fetched.length > PAGE

  const tabHref = (next?: string) => {
    const query = next ? `?category=${encodeURIComponent(next)}` : ""
    return `/news${query}#${ANCHOR}`
  }

  // The filter travels with the reader: opening the archive from a filtered
  // grid should not silently drop the filter on the way.
  const allHref = category
    ? `/news/all?category=${encodeURIComponent(category)}`
    : "/news/all"

  return (
    <section
      id={ANCHOR}
      aria-labelledby="archive-heading"
      // `#1E1E1E` to `#0E0E0E` (`163:8233`) — the band lifts off the page
      // background at the top and settles back onto it at the bottom, which is
      // what separates the grid from the two document shelves under it without
      // drawing a rule.
      className="flex scroll-mt-28 flex-col gap-8 bg-linear-to-b from-[#1e1e1e] to-[#0e0e0e] px-5 py-10 md:px-10 lg:gap-8 lg:px-20 lg:py-[3.125vw]"
    >
      <h2 id="archive-heading" className="sr-only">
        {NEWS_ARCHIVE_COPY.heading}
      </h2>

      {/* The pill strip carries the navbar's chrome exactly — 40% black under a
          10px backdrop blur, 12px radius, 4px of padding (`166:8377` against
          `156:7563`). Same component in the design system, so the same numbers
          here. `overflow-x-auto` because the strip is as long as the feed's
          vocabulary, which the page does not control. */}
      <nav
        aria-label={NEWS_ARCHIVE_COPY.filterLabel}
        className="-mx-5 overflow-x-auto px-5 md:-mx-10 md:px-10 lg:-mx-20 lg:px-20"
      >
        <ul className="flex w-max items-center gap-0 rounded-[var(--radius-glass)] bg-black/40 p-1 backdrop-blur-[10px]">
          <Tab
            label={NEWS_ARCHIVE_COPY.allTab}
            href={tabHref()}
            active={category === undefined}
          />
          {categories.map((name) => (
            <Tab
              key={name}
              label={name}
              href={tabHref(name)}
              active={category === name}
            />
          ))}
        </ul>
      </nav>

      {articles.length === 0 ? (
        <p className="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60">
          {NEWS_ARCHIVE_COPY.empty}
        </p>
      ) : (
        // 572-wide tiles with a 20px gutter: three of them plus two gutters is
        // 1756 against the 1760 the section's 80px margins leave, so the
        // design's row is a plain three-column grid rather than a measured one.
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <li key={article.id}>
              <NewsGridCard article={article} />
            </li>
          ))}
        </ul>
      )}

      {/* `166:8428` — the silver pill, centred under the grid. Hidden once the
          six on screen ARE the feed: a button leading to an archive that holds
          nothing more is the silent no-op D28 ruled out. */}
      {hasMore && (
        <div className="flex justify-center">
          <SilverCta href={allHref} className="lg:min-w-[18.75vw]">
            {NEWS_ARCHIVE_COPY.more}
          </SilverCta>
        </div>
      )}
    </section>
  )
}

/**
 * One category tab — `166:8378` when selected, `166:8380` otherwise.
 *
 * The selected tab is a 12%-white chip; the rest sit at half opacity with no
 * chip at all. `aria-current="page"` rather than a `tab` role: these really are
 * links to distinct URLs, and calling them tabs would promise a screen reader
 * arrow-key behaviour that navigation does not have.
 */
function Tab({
  label,
  href,
  active,
}: {
  label: string
  href: string
  active: boolean
}) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        scroll={false}
        // The whole destination, not just the shared shell: `/news` renders
        // dynamically, so Next's default prefetch leaves the click waiting on
        // a server render and the strip reads as loading. Six pills, all on
        // screen — see `SideTab`, which makes the same call.
        prefetch
        className={`rounded-btn font-sans focus-visible:ring-gold block px-5 py-3 text-[length:var(--text-label-sm)] leading-relaxed font-medium tracking-[0.04em] whitespace-nowrap text-white uppercase transition-opacity focus-visible:ring-2 focus-visible:outline-none ${
          active ? "bg-white/12" : "opacity-50 hover:opacity-80"
        }`}
      >
        {label}
      </Link>
    </li>
  )
}
