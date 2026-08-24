import { DownloadPill } from "@/components/ui/DownloadPill"
import type { ResourceDocument } from "@/lib/api/types"
import { formatShortDate } from "@/lib/utils/date"

/**
 * A filed document as a white card — Figma nodes `168:8538` (news press shelf)
 * and `381:17594` (tournament regulations).
 *
 * 560 wide in a 1136 column, so two sit abreast with the design's 16px gutter.
 * `basis` rather than a fixed width: a fixed one would not wrap to a single
 * column on a phone, and the card is a row of text beside a pill that needs the
 * room it needs.
 *
 * Promoted out of `components/news/` on its second user (D32/D43). The two
 * designs are the same frame — date over a Bebas title, file pill bottom-right,
 * 20px radius — which is what makes it a shared card rather than two that
 * happen to look alike.
 *
 * Server Component.
 */
export function DocumentCard({
  document,
  downloadLabel,
}: {
  document: ResourceDocument
  /** Passed through to the pill; `%1` is the title, `%2` the file description. */
  downloadLabel: string
}) {
  return (
    <article className="rounded-card flex min-w-0 grow basis-[min(100%,560px)] items-end justify-between gap-4 bg-white px-5 py-4">
      <div className="flex min-w-0 flex-col gap-2">
        {/* Inter Medium 20/28 in `#999999`. The date is optional on the type
            because most of the library carries none; a card missing one drops
            the line rather than printing an empty row. */}
        {document.publishedAt && (
          <time
            dateTime={document.publishedAt}
            className="font-sans text-label-muted text-[length:var(--text-eyebrow)] leading-7 font-medium"
          >
            {formatShortDate(document.publishedAt)}
          </time>
        )}

        {/* Bebas 36/44. `uppercase` is the card's, not the string's (D40). */}
        <h3 className="font-display text-[length:var(--text-display-label)] leading-[1.22] text-black uppercase">
          {document.title}
        </h3>
      </div>

      <DownloadPill document={document} label={downloadLabel} />
    </article>
  )
}
