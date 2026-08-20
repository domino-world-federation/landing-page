// Phase 1 placeholder. The real sections (S2–S14) land one at a time —
// see docs/PROGRESS.md, phase 2.

import { Navbar } from "@/components/layout/Navbar"

const COPY = {
  tagline: "Domino World Federation",
  headline: "Dominoes Without Borders",
  status: "S1 Navbar done — S2 Hero is next.",
} as const

export default function HomePage() {
  return (
    // `relative` anchors the navbar, which overlays the hero (S1).
    <div className="relative">
      <Navbar />

      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="font-sans text-dim text-sm tracking-[0.24em] uppercase">
          {COPY.tagline}
        </p>
        <h1 className="font-display text-[length:var(--text-display-sm)] leading-none text-white uppercase">
          {COPY.headline}
        </h1>
        <p className="font-sans text-dim max-w-md text-base">{COPY.status}</p>
      </main>
    </div>
  )
}
