import type { Metadata } from "next"

import { LegalDocument } from "@/components/legal/LegalDocument"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { PRIVACY_COPY } from "@/content/privacy"
import { PRIVACY_SECTIONS } from "@/content/privacy/sections"

export const metadata: Metadata = {
  title: "Privacy Policy | Domino World Federation",
  description:
    "How the Domino World Federation captures, processes and preserves personal details — what is collected, how it is used, who it is shared with, and the rights registered members hold.",
}

/**
 * `/privacy` — Figma screen `174:10759`, inside the file's "Privacy Policy"
 * section.
 *
 * The second legal screen, and the one that proved `LegalDocument` was worth
 * extracting: it is the terms page with eight different clauses in it, down to
 * the header, the contents column, the white card and the 4px rules. The route
 * is therefore copy plus a component.
 */
export default function PrivacyPage() {
  return (
    // `relative` anchors the navbar, which is `fixed` and overlays the page.
    <div className="relative">
      <Navbar />
      <main>
        <LegalDocument copy={PRIVACY_COPY} sections={PRIVACY_SECTIONS} />
      </main>
      <Footer />
    </div>
  )
}
