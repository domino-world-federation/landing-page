import { DocumentShelf } from "@/components/news/DocumentShelf"
import { DocumentCard } from "@/components/ui/DocumentCard"
import { NEWS_PRESS_COPY } from "@/content/news/documents"
import { getResources } from "@/lib/api/client"

/**
 * The press shelf — Figma node `168:8475`.
 *
 * Four white cards, two abreast, each a date over a title with the file pill
 * bottom-right. The documents come from the same library the Domino and
 * Development pages read (`getResources`, RULES §8): a press release IS a
 * document with a date, a type and a size, and a second endpoint would have
 * differed from this one only in the word on its category.
 *
 * The card itself now lives in `ui/DocumentCard`: the tournament page's
 * regulations shelf draws the identical frame, and a component moves on its
 * second user (D32/D43).
 *
 * Server Component throughout — nothing here has state.
 */
export async function PressReleases() {
  // Named rather than limited: this shelf is a category with however many
  // documents the federation has filed in it, unlike S10's fixed 2×2 grid
  // which had to state a count because its four documents share no shelf (D45).
  const releases = await getResources("Press Release")

  if (releases.length === 0) return null

  return (
    <DocumentShelf
      id="press"
      heading={NEWS_PRESS_COPY.heading}
      aside={
        <a
          href={NEWS_PRESS_COPY.archiveHref}
          className="font-sans focus-visible:ring-gold group flex w-fit items-center gap-3 text-[length:var(--text-eyebrow)] leading-8 text-white focus-visible:ring-2 focus-visible:outline-none"
        >
          {NEWS_PRESS_COPY.archiveLink}
          {/* eslint-disable-next-line @next/next/no-img-element -- a 24px
              inline SVG sized in CSS. The shared glyph points LEFT; +135°
              turns it up-and-right, the "opens something" arrow. `invert`
              because it is drawn dark for use on white. */}
          <img
            src="/assets/global/icon-arrow-left.svg"
            alt=""
            width={24}
            height={24}
            className="size-6 rotate-135 invert transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </a>
      }
    >
      {releases.map((release) => (
        <DocumentCard
          key={release.id}
          document={release}
          downloadLabel={NEWS_PRESS_COPY.downloadLabel}
        />
      ))}
    </DocumentShelf>
  )
}
