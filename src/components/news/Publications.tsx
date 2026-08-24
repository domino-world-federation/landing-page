import Image from "next/image"

import { DocumentShelf } from "@/components/news/DocumentShelf"
import { DownloadPill } from "@/components/ui/DownloadPill"
import { NEWS_PUBLICATIONS_COPY } from "@/content/news/documents"
import { getResources } from "@/lib/api/client"
import type { ResourceDocument } from "@/lib/api/types"
import { formatShortDate } from "@/lib/utils/date"

/**
 * The publications shelf — Figma node `168:8582`.
 *
 * The press shelf's layout with a taller card: the document's cover fills it and
 * a white bar across the foot carries the date, the title and the file pill.
 * Same entity, same call — only the cover and the height differ, which is why
 * `coverImageUrl` is a field on `ResourceDocument` rather than a type of its
 * own.
 *
 * Unlike the press shelf this one has no link under its heading. That is the
 * design's doing (`168:8583` holds the title alone) and it is left alone: there
 * is no publications archive drawn anywhere in the file to link to.
 */
export async function Publications() {
  const publications = await getResources("Publication")

  if (publications.length === 0) return null

  return (
    <DocumentShelf id="publications" heading={NEWS_PUBLICATIONS_COPY.heading}>
      {publications.map((publication) => (
        <PublicationCard key={publication.id} publication={publication} />
      ))}
    </DocumentShelf>
  )
}

/**
 * One publication — `168:8591`.
 *
 * 560 × 488 with the cover bled to the edges. Figma draws the picture 720 tall
 * inside a 488 frame, i.e. the top two thirds of a portrait page, which is why
 * the crop is anchored to the top rather than centred: a document cover is
 * masthead-first, and centring it would frame the middle of a page of text.
 */
function PublicationCard({ publication }: { publication: ResourceDocument }) {
  return (
    <article className="rounded-card relative flex aspect-[560/488] min-w-0 grow basis-[min(100%,560px)] flex-col justify-end overflow-hidden bg-white">
      {publication.coverImageUrl && (
        <Image
          src={publication.coverImageUrl}
          // Empty: the title is printed on the card directly below, and the
          // cover is a picture OF that title — describing it would say the same
          // words twice.
          alt=""
          fill
          sizes="(min-width: 1024px) 30vw, 100vw"
          className="object-cover object-top"
        />
      )}

      {/* `168:8676` — a black mark at 10% sitting over the cover, a little
          above and right of centre. Decoration, so it is hidden. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- a positioned
          decorative SVG; next/image would wrap it in a layout box that fights
          the percentage placement it needs. */}
      <img
        src="/assets/news/decor-publication-union.svg"
        alt=""
        aria-hidden
        width={231}
        height={250}
        className="pointer-events-none absolute top-[14.75%] left-[29.5%] w-[41.25%] opacity-10"
      />

      {/* `relative` so the bar paints over the cover behind it. */}
      <div className="relative flex items-end justify-between gap-4 bg-white p-5">
        <div className="flex min-w-0 flex-col gap-2">
          {publication.publishedAt && (
            <time
              dateTime={publication.publishedAt}
              className="font-sans text-label-muted text-[length:var(--text-eyebrow)] leading-7 font-medium"
            >
              {formatShortDate(publication.publishedAt)}
            </time>
          )}

          <h3 className="font-display text-[length:var(--text-display-label)] leading-[1.22] text-black uppercase">
            {publication.title}
          </h3>
        </div>

        <DownloadPill
          document={publication}
          label={NEWS_PUBLICATIONS_COPY.downloadLabel}
        />
      </div>
    </article>
  )
}
