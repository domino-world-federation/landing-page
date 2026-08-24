import { LegalBody } from "@/components/legal/LegalBody"
import { LegalContents } from "@/components/legal/LegalContents"
import { PageHeader } from "@/components/ui/PageHeader"
import { SideTabLayout } from "@/components/ui/SideTabLayout"
import { SupportCard } from "@/components/ui/SupportCard"
import type { LegalDocumentCopy, LegalSection } from "@/content/legal"
import { formatShortDate } from "@/lib/utils/date"

/**
 * A whole legal page, minus the navbar and the footer — Figma screens
 * `174:11162` (terms) and `174:10759` (privacy), which are one screen with
 * different clauses in it.
 *
 * Both routes are this component plus their own copy, so the two pages cannot
 * drift apart the way two hand-built copies of the same screen would. The FAQ
 * screen (`173:9459`) was offered this component and did NOT take it: it draws
 * the same shell, but its body is a filtered accordion rather than a numbered
 * document, so `/faq` shares `PageHeader`, `SideTabLayout` and `SupportCard`
 * and stops there (D57's line, applied).
 *
 * Server Component; only the contents column is client.
 */
export function LegalDocument({
  copy,
  sections,
}: {
  copy: LegalDocumentCopy
  sections: readonly LegalSection[]
}) {
  return (
    <>
      <PageHeader
        title={copy.title}
        back={{ label: copy.back, href: copy.backHref }}
        meta={
          // Inter Medium 24/32 in `#AAAAAA`. A `<time>` because it is one — the
          // machine-readable value is the ISO string the copy file stores.
          <time
            dateTime={copy.updatedAt}
            className="font-sans text-[length:var(--text-body-sm)] leading-8 font-medium text-[#aaaaaa]"
          >
            {copy.updatedLabel.replace("%s", formatShortDate(copy.updatedAt))}
          </time>
        }
      />

      <SideTabLayout
        sidebar={
          <>
            <LegalContents
              sections={sections}
              title={copy.contentsTitle}
              label={copy.contentsLabel}
            />
            <SupportCard />
          </>
        }
      >
        <LegalBody sections={sections} />
      </SideTabLayout>
    </>
  )
}
