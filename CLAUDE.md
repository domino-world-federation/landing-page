# DWF Website

Website Domino World Federation. Fase 1: landing page **parallax** hasil slicing
Figma. Fase 2: portal (ranking, pemain, turnamen).

## Dokumen

- [docs/PRD.md](docs/PRD.md) — lingkup, keputusan, risiko
- [docs/PROGRESS.md](docs/PROGRESS.md) — status & blocker
- [docs/RULES.md](docs/RULES.md) — standar teknis (**baca sebelum menulis kode**)
- [docs/DESIGN-TOKENS.md](docs/DESIGN-TOKENS.md) — font, tipografi, warna, spacing

## Stack

Next.js 16.3 (App Router) · TypeScript strict · Tailwind · `motion`
**Bun** (package manager + runtime)

## Hal yang mudah keliru

- **Selalu Bun, jangan npm/yarn/pnpm.** `bun install`, `bun add`, `bun run`,
  `bunx`. Script Next memakai `bun --bun next <cmd>`. Commit `bun.lock`.
- **Brand ditulis `DWF`**, bukan `DFW`. Nama folder project (`dfw`) keliru dan
  dibiarkan agar path tidak putus — jangan pakai `dfw` untuk file/komponen baru.
- **Seluruh akses data lewat `lib/api/client.ts`.** Dilarang `fetch` langsung
  dari komponen — backend belum ada, masih memakai mock.
- **Teks UI disimpan sebagai konstanta**, bukan hardcode di JSX (persiapan i18n).
- **Server Component sebagai default.** `"use client"` hanya bila perlu, dan
  diletakkan sedalam mungkin.
- **Parallax:** aset dipisah per layer secara sengaja. Hanya animasikan
  `transform`/`opacity`; `prefers-reduced-motion` mematikan parallax **penuh**.
  Aturan lengkap di RULES §11.
- **Paket animasi bernama `motion`**, bukan `framer-motion` (berganti nama sejak
  rebrand 2025). Import dari `motion/react`.
- Aset: `public/assets/global/` (lintas halaman) vs `public/assets/home/`
  (khusus landing).
- **Commit tanpa atribusi AI.** Tanpa trailer `Co-Authored-By: Claude`, tanpa
  `Generated with`, tanpa emoji bot — di pesan commit maupun deskripsi PR.
  RULES §13.
- **`bun run build` gagal di runtime Bun** (R6). Build pakai `bunx next build`;
  `bun run dev` dengan `--bun` tetap normal.

## Alur kerja

Perbarui `docs/PROGRESS.md` setiap menyelesaikan tugas.
Keputusan arsitektur dicatat di `docs/PRD.md` §7 — satu tempat saja.
