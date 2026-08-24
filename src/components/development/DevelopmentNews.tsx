import { DevelopmentNewsCard } from "@/components/development/DevelopmentNewsCard"
import { Reveal } from "@/components/motion/Reveal"
import { DEVELOPMENT_NEWS_COPY } from "@/content/development/news"
import { getLatestNews } from "@/lib/api/client"
import { STAGGER } from "@/lib/utils/motion"

/**
 * Development News — Figma node `207:15528`.
 *
 * Four stories in a 2×2. They come from the same feed S8's mosaic reads, asked
 * for by desk rather than filtered here (RULES §8): the real endpoint takes
 * `?category=`, and a component slicing the whole feed would keep downloading
 * every article the federation has published to show four of them.
 *
 * **The desk holds five stories and the grid draws four**, which is the design's
 * own count. `n4` ("Youth Development Programme Launches") was filed under
 * Development before this page existed and genuinely belongs there, so the four
 * shown are the four most recent and February's referee seminar falls off the
 * end. Asking for five instead would leave the second row ragged; recategorising
 * a real development story to make the numbers come out is worse than both.
 *
 * Server Component (`async`); only the entrances are client.
 */
export async function DevelopmentNews() {
  const articles = await getLatestNews(4, "Development")

  return (
    <section
      aria-labelledby="development-news-heading"
      className="flex flex-col gap-10 px-5 py-16 md:px-10 lg:gap-[3.13vw] lg:px-20 lg:py-[3.13vw]"
    >
      <div className="flex flex-col gap-6 lg:gap-9">
        <Reveal y={32}>
          <p className="font-sans text-[length:var(--text-eyebrow)] leading-7 font-medium text-white uppercase">
            {DEVELOPMENT_NEWS_COPY.eyebrow}
          </p>
        </Reveal>

        <Reveal y={40} delay={STAGGER}>
          <h2
            id="development-news-heading"
            className="font-display w-fit bg-[image:var(--gradient-gold-text)] bg-clip-text text-[length:var(--text-display-sm)] leading-[0.95] text-transparent uppercase"
          >
            {DEVELOPMENT_NEWS_COPY.heading}
          </h2>
        </Reveal>
      </div>

      {/* Figma states this as a wrapping row of four 862px cards inside 1760,
          which is a 2×2. Written as a real grid, and 2-up only from `menu`:
          each card is a square thumbnail plus a 36px headline, and below 1400
          the pair leaves the headline a column narrow enough to take four
          lines against the design's two. */}
      <ul className="grid list-none gap-8 menu:grid-cols-2 lg:gap-9">
        {articles.map((article, i) => (
          <li key={article.id} className="flex">
            <Reveal y={32} delay={STAGGER * i} className="w-full">
              <DevelopmentNewsCard article={article} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
