# DWF Website

Website Domino World Federation. Fase 1: landing page **parallax** hasil slicing
Figma. Fase 2: portal (ranking, pemain, turnamen).

Project ini menggantikan build Next yang mendahuluinya — foldernya sudah tidak
ada di repo. Arsipnya `../landing-page-next.zip`, dan riwayat git-nya di
`git@github.com:domino-world-federation/landing-page.git` branch `main`.

## Dokumen

Pindahan utuh dari project Next, byte-identik — dokumen produk dan standar tidak
ikut berubah karena frameworknya berubah:

- [docs/PRD.md](docs/PRD.md) — lingkup, keputusan, risiko
- [docs/PROGRESS.md](docs/PROGRESS.md) — status & blocker
- [docs/RULES.md](docs/RULES.md) — standar teknis (**baca sebelum menulis kode**)
- [docs/DESIGN-TOKENS.md](docs/DESIGN-TOKENS.md) — font, tipografi, warna, spacing
- [docs/FIGMA-HOME.md](docs/FIGMA-HOME.md) — angka desain halaman depan, disalin
  dari Figma. **Baca ini dulu sebelum menarik data Figma untuk home** — fileKey,
  peta section, dan ukuran yang sudah diukur ada di sana

**Beberapa pasal RULES ditulis untuk Next dan sudah tidak berlaku apa adanya** —
§5 (Server Component), §7 (`next/image`), §11 (`motion/react`), §13 (`bun --bun
next`). Yang menggantikannya ada di [README.md](README.md) §"What changed, and
why", lengkap dengan alasannya. Dokumennya sengaja tidak ditulis ulang: ia
catatan resmi project, dan README yang memuat delta-nya.

## Stack

Nuxt 4.5 · Vue 3.5 · TypeScript strict · Tailwind v4 · `motion-v`
**Bun** (package manager)

## Hal yang mudah keliru

- **Selalu Bun, jangan npm/yarn/pnpm.** `bun install`, `bun add`, `bun run`,
  `bunx`. Commit `bun.lock`. Tidak ada flag `--bun`: `nuxt` CLI berjalan di Node
  lewat shebang-nya sendiri, jadi Bun di sini murni task runner.
- **Brand ditulis `DWF`**, bukan `DFW`. Nama folder induk (`dfw`) keliru dan
  dibiarkan agar path tidak putus — jangan pakai `dfw` untuk file/komponen baru.
- **Seluruh akses data lewat `app/lib/api/client.ts`.** Dilarang `fetch`
  langsung dari komponen — backend belum ada, masih memakai mock (B2).
- **Teks UI disimpan sebagai konstanta** di `app/content/`, bukan hardcode di
  template (persiapan i18n).
- **Fetch lewat `useAsyncData`**, bukan `await` telanjang — itu yang menjalankan
  fetch saat SSR dan menitipkan hasilnya lewat payload. Bungkus handler-nya dalam
  arrow: `useAsyncData("k", () => getX())`. Tanpa arrow, Nuxt mengirim objek
  aplikasi sebagai argumen pertama getter.
- **Parallax:** aset dipisah per layer secara sengaja. Hanya animasikan
  `transform`/`opacity`; `prefers-reduced-motion` mematikan parallax **penuh**.
  Aturan lengkap di RULES §12 — pasal itu masih berlaku utuh.
- **Paket animasi bernama `motion-v`** (port Vue resmi dari organisasi Motion),
  bukan `motion` atau `framer-motion`. `whileTap` bernama `whilePress`;
  `viewport` bernama `inViewOptions`.
- **`sizes` gambar selalu lewat `imageSizes()`**, jangan ditulis tangan.
  `sizes="100vw"` telanjang menghasilkan srcset 1w/2w — lolos build, lolos
  typecheck, dan terlihat seperti aset rusak. Alasannya di
  [app/utils/image-sizes.ts](app/utils/image-sizes.ts).
- **SVG pakai `<img>` biasa, raster pakai `<NuxtImg>`.** Pipeline image akan
  mengembalikan byte yang sama untuk SVG (RULES §7).
- Aset: `public/assets/global/` (lintas halaman) vs `public/assets/home/`
  (khusus landing).
- **Commit tanpa atribusi AI.** Tanpa trailer `Co-Authored-By: Claude`, tanpa
  `Generated with`, tanpa emoji bot — di pesan commit maupun deskripsi PR.
  RULES §14.
- **Config PM2 bernama `ecosystem.config.cjs`, bukan `.js`.** `package.json`
  punya `"type": "module"`, dan file `.js` diparse sebagai ESM — tidak error,
  tapi `apps` jadi `undefined` tanpa pesan apa pun.

## Alur kerja

Perbarui `docs/PROGRESS.md` setiap menyelesaikan tugas.
Keputusan arsitektur dicatat di `docs/PRD.md` §7 — satu tempat saja.
