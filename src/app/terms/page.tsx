import type { Metadata } from "next"

import { LegalDocument } from "@/components/legal/LegalDocument"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { TERMS_COPY } from "@/content/terms"
import { TERMS_SECTIONS } from "@/content/terms/sections"

export const metadata: Metadata = {
  title: "Terms & Conditions | Domino World Federation",
  description:
    "The terms of engagement for the Domino World Federation portal — member federation status, intellectual property, code of conduct, tournament participation, liability and governing law.",
}

/**
 * `/terms` — Figma screen `174:11162`, inside the file's "Terms & Conditions"
 * section.
 *
 * The page is `LegalDocument` plus this document's copy. It was hand-built
 * first and generalised the moment the Privacy Policy arrived on the identical
 * screen (D32/D43) — the two cannot drift apart now, and the FAQ screen
 * (`173:9459`) joins them if it is built on the same shell.
 *
 * The site's usual outer shell: navbar overlaying the page, then content, then
 * the footer outside `<main>` as its own landmark. No `PageShine`, no `Join`.
 */
export default function TermsPage() {
  return (
    // `relative` anchors the navbar, which is `fixed` and overlays the page.
    <div className="relative">
      <Navbar />
      <main>
        <LegalDocument copy={TERMS_COPY} sections={TERMS_SECTIONS} />
      </main>
      <Footer />
    </div>
  )
}
