// Placeholder fase 1. Section asli (S1–S14) menyusul satu per satu —
// lihat docs/PROGRESS.md fase 2.

const COPY = {
  tagline: "Domino World Federation",
  headline: "Dominoes Without Borders",
  status: "Scaffold selesai — slicing section dimulai dari S1 Navbar.",
} as const

export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-sans text-dim text-sm tracking-[0.24em] uppercase">
        {COPY.tagline}
      </p>
      <h1 className="font-display text-[length:var(--text-display-sm)] leading-none text-white uppercase">
        {COPY.headline}
      </h1>
      <p className="font-sans text-dim max-w-md text-base">{COPY.status}</p>
    </main>
  )
}
