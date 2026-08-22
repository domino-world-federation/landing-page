import { NEWS_COPY } from "@/content/home/news"
import { getLatestNews } from "@/lib/api/client"
import { Marquee } from "@/components/ui/Marquee"
import { NewsCard } from "@/components/home/NewsCard"

/**
 * Seconds for the strip to travel its own length once.
 *
 * Set from reading speed rather than taste. The track is ~2916px at design
 * size, so 75s moves it about 39px/s — slow enough that a 24px headline stays
 * in view for several seconds as it crosses, which is what makes an
 * always-moving strip legible at all. Faster reads as a ticker and the titles
 * become unreadable; much slower and the motion stops registering as motion.
 */
const LAP = 75

/**
 * The width one full-size card occupies, as a fraction of the viewport.
 *
 * 28.125vw is 540/1920, so at the design width every tile renders at exactly
 * its Figma size and narrower windows scale the whole mosaic down with them
 * rather than overflowing (D14). The floor stops the cards collapsing to
 * unreadable slivers on a phone, where the strip is scrolled past rather than
 * taken in at a glance.
 */
const CARD_W = "w-[max(260px,28.125vw)]"

/** The square pair is 258/540 of a full card, less half the 24px gutter. */
const SQUARE_W = "w-[calc((max(260px,28.125vw)-0.625vw)/2)]"

/**
 * S8 — Figma node `54:3157`. The news mosaic.
 *
 * Figma draws this as a row at `x:-473` — the strip starts off-canvas to the
 * left and its seven slots total ~2916px against a 1920 frame, so the design
 * itself is a still of something already in motion. It cannot be made to fit,
 * and it is not meant to: it travels.
 *
 * The composition is not a uniform row. Five slots are 540×700, and the fourth
 * is a stacked column — a 540×418 card above two 258×258 squares side by side —
 * which is what keeps the strip from reading as a plain filmstrip. Sizes come
 * from `NewsCard`; the arrangement lives here.
 *
 * Server Component. It fetches through `lib/api/client` and passes plain data
 * down; only `Marquee` is client, because only the travel needs to be.
 */
export async function News() {
  const articles = await getLatestNews()

  // The mosaic needs seven slots and the API's `limit` is a request, not a
  // guarantee — a short response would silently drop a tile. Falling back to
  // the widest arrangement the data supports keeps the section rendering.
  const [a1, a2, a3, a4, a5, a6, a7] = articles

  return (
    // No horizontal padding: the strip is meant to run off both edges, which is
    // what tells the reader there is more of it than the window shows.
    //
    // The strip RIDES UP INTO S7 rather than following it. Figma puts S7 at
    // `y:3941` with a height of 960 — ending at 4901 — and starts this row at
    // `y:4701`, so the two overlap by 200px and the cards' tops sit over the
    // foot of the desk photograph. That overlap is the join between the two
    // sections; without it S8 reads as a separate band pushed away by its own
    // padding, which is what it looked like before.
    //
    // 10.42% is 200/1920, written proportionally so the overlap scales with the
    // viewport instead of eating a fixed 200px out of a short mobile card
    // (D14). `relative z-10` lifts the cards over S7's image, which is what
    // makes the overlap read as tucking under rather than being clipped.
    <section className="relative z-10 -mt-[10.42%] overflow-hidden pb-16 lg:pb-24">
      <Marquee duration={LAP} label={NEWS_COPY.regionLabel}>
        {/* `gap-6` is Figma's 24px gutter, and it sits on this wrapper rather
            than on the track so both marquee copies are spaced identically —
            the seam depends on the two halves measuring the same. The trailing
            margin supplies the gutter across the join itself. */}
        <div className="mr-6 flex items-center gap-6">
          {a1 && (
            <NewsCard
              article={a1}
              size="tall"
              className={`shrink-0 ${CARD_W}`}
              sizes="(max-width: 1024px) 60vw, 28vw"
            />
          )}
          {a2 && (
            <NewsCard
              article={a2}
              size="tall"
              className={`shrink-0 ${CARD_W}`}
              sizes="(max-width: 1024px) 60vw, 28vw"
            />
          )}
          {a3 && (
            <NewsCard
              article={a3}
              size="tall"
              className={`shrink-0 ${CARD_W}`}
              sizes="(max-width: 1024px) 60vw, 28vw"
            />
          )}

          {/* Node `55:3178` — the stacked column. `justify-center` matches the
              design, which centres this group against the taller cards beside
              it rather than aligning it to their top. */}
          {a4 && a5 && a6 && (
            <div className={`flex shrink-0 flex-col justify-center gap-6`}>
              <NewsCard
                article={a4}
                size="wide"
                className={CARD_W}
                sizes="(max-width: 1024px) 60vw, 28vw"
              />
              <div className="flex gap-6">
                <NewsCard
                  article={a5}
                  size="square"
                  className={`shrink-0 ${SQUARE_W}`}
                  sizes="(max-width: 1024px) 30vw, 14vw"
                />
                <NewsCard
                  article={a6}
                  size="square"
                  className={`shrink-0 ${SQUARE_W}`}
                  sizes="(max-width: 1024px) 30vw, 14vw"
                />
              </div>
            </div>
          )}

          {a7 && (
            <NewsCard
              article={a7}
              size="tall"
              className={`shrink-0 ${CARD_W}`}
              sizes="(max-width: 1024px) 60vw, 28vw"
            />
          )}
        </div>
      </Marquee>
    </section>
  )
}
