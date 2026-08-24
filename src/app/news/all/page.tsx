import type { Metadata } from "next"

import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { AllNewsTabs } from "@/components/news/AllNewsTabs"
import { NewsGridCard } from "@/components/news/NewsGridCard"
import { NewsSearch } from "@/components/news/NewsSearch"
import { PageHeader } from "@/components/ui/PageHeader"
import { SideTabLayout } from "@/components/ui/SideTabLayout"
import { SupportCard } from "@/components/ui/SupportCard"
import { ALL_NEWS_COPY } from "@/content/news/all"
import { getLatestNews, getNewsCategories } from "@/lib/api/client"

export const metadata: Metadata = {
  title: "All News | Domino World Federation",
  description:
    "The full Domino World Federation news archive — tournament results, governance decisions, membership changes and development programmes, filterable by category.",
}

/**
 * How much of the archive one request asks for.
 *
 * The design draws no pagination here — this is the page you reach when you
 * want everything — so the limit exists only to keep a single request bounded.
 * The moment the federation has filed more than this, the page needs a cursor
 * rather than a bigger number, and `getLatestNews` is where that goes.
 */
const LIMIT = 60

/**
 * `/news/all` — Figma screen `185:13184`.
 *
 * The news page's archive block at full size: two columns of cards instead of
 * three, the category filter moved from a pill strip into the side column, and
 * a "Back" link to `/news` above the title.
 *
 * **Its existence changed a decision on `/news`.** D50 gave that page's "View
 * more" button a `?show=` that grew six at a time, because there was nowhere
 * for it to go. There is now: this screen is what the design means by more, so
 * `/news` shows its designed six and the button comes here (see `NewsArchive`).
 * One mechanism instead of two, and one fewer thing invented.
 *
 * Search is the news page's field — including its corrected placeholder. Figma
 * types "Search Event" here (`185:13193`), which is the gallery header's string
 * pasted onto a news archive; "Event" is wrong about what this page holds, so
 * it reads "Search News" like its parent (D40). It still refuses in the open:
 * there is no search endpoint (B2).
 */
export default async function AllNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  const categories = await getNewsCategories()
  const articles = await getLatestNews(LIMIT, category)

  return (
    // `relative` anchors the navbar, which is `fixed` and overlays the page.
    <div className="relative">
      <Navbar />

      <main>
        <PageHeader
          title={ALL_NEWS_COPY.title}
          back={{ label: ALL_NEWS_COPY.back, href: ALL_NEWS_COPY.backHref }}
          aside={<NewsSearch />}
        />

        <SideTabLayout
          sidebar={
            <>
              <AllNewsTabs categories={categories} active={category} />
              <SupportCard />
            </>
          }
        >
          {articles.length === 0 ? (
            <p className="font-sans text-[length:var(--text-eyebrow)] leading-8 text-white/60">
              {ALL_NEWS_COPY.empty}
            </p>
          ) : (
            // 676-wide cards with a 20px gutter in a 1372px column — two
            // abreast, against the news page's three. Same card either way:
            // both crops are 1.78, so `NewsGridCard` needs nothing new.
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {articles.map((article) => (
                <li key={article.id}>
                  <NewsGridCard article={article} />
                </li>
              ))}
            </ul>
          )}
        </SideTabLayout>
      </main>

      <Footer />
    </div>
  )
}
