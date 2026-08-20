# Rules — Standar Kerja DWF Website

Aturan teknis yang mengikat seluruh kode di repo ini.
Konteks produk ada di [PRD.md](PRD.md); status pengerjaan di [PROGRESS.md](PROGRESS.md).

---

## 1. Penamaan

### File & folder

| Jenis | Konvensi | Contoh |
|---|---|---|
| Komponen React | PascalCase | `HeroSection.tsx` |
| Hook | camelCase, awalan `use` | `useMediaQuery.ts` |
| Utility / config | kebab-case | `format-date.ts` |
| Type | PascalCase, kata benda tunggal | `NewsArticle`, bukan `NewsArticles` |
| Folder | kebab-case | `components/sections/` |
| Aset | `<kategori>-<nama>[-varian].<ext>` | `logo-dwf-horizontal.svg` |
| Route | kebab-case | `app/tournament-schedule/` |

Aturan aset: kategori di depan agar file sejenis mengelompok saat di-sort.
Angka **selalu** dipad 2 digit (`news-thumb-01`, bukan `news-1`) supaya urutannya
tetap benar setelah melewati 9. Tanpa spasi, tanpa PascalCase.

### Brand

Tulis **DWF** (Domino World Federation) di seluruh kode, komentar, dan teks UI.
Nama folder project `dfw` keliru dan dibiarkan agar tidak memutus path.
Jangan pakai `dfw` untuk nama file, komponen, atau variabel baru.

---

## 2. Struktur folder

```
src/
  app/                    # route App Router
    layout.tsx
    page.tsx
  components/
    sections/             # section landing — 1 file per section
    ui/                   # komponen reusable (Button, Card)
    layout/               # Header, Footer
  lib/
    api/
      types.ts            # kontrak data
      client.ts           # wrapper fetch — satu-satunya pintu data
      mock/               # data dummy
    utils/
  content/                # teks statis (persiapan i18n)
  styles/
public/assets/
  global/                 # dipakai lintas halaman
    partners/
  home/                   # khusus landing page
docs/
```

Aturan penempatan aset: membawa identitas brand **atau** berulang lintas
halaman → `global/`. Terikat pada satu section → `home/` (atau folder halaman
terkait).

---

## 3. TypeScript

- `strict: true`. Tanpa pengecualian.
- **Dilarang `any`.** Pakai `unknown` lalu persempit tipenya.
- Type untuk data eksternal ditulis di `lib/api/types.ts`, tidak berserakan.
- Props komponen di-type eksplisit; hindari `React.FC`.
- Utamakan `type` untuk bentuk data, `interface` untuk kontrak yang di-extend.
- Tanpa `@ts-ignore`. Bila benar-benar terpaksa, pakai `@ts-expect-error`
  disertai komentar alasan.

---

## 4. Komentar

**Seluruh komentar di dalam kode ditulis dalam bahasa Inggris.** Berlaku untuk
komentar baris, blok, JSDoc, nama variabel, dan pesan `@ts-expect-error`.

Dokumentasi di `docs/` tetap bahasa Indonesia — batasnya jelas: apa pun yang
ada di dalam `src/` berbahasa Inggris, apa pun di `docs/` berbahasa Indonesia.

```ts
// ✅
// Bound useScroll to this element; without a target the whole page counts.

// ❌
// Batasi useScroll ke elemen ini; tanpa target seluruh halaman ikut terhitung.
```

Alasannya: kode memakai identifier dan istilah teknis berbahasa Inggris, jadi
komentar sebahasa membuat kalimatnya utuh. Ini juga menjaga repo tetap terbaca
bila ada kontributor non-Indonesia di fase portal.

Isi komentarnya: **jelaskan alasan, bukan mekanisme.** Kode sudah menyatakan
apa yang terjadi; komentar dipakai untuk hal yang tidak terbaca dari kode —
kenapa sebuah nilai dipilih, kenapa jalur yang jelas justru dihindari.

```ts
// ✅ menerangkan sebab
// Figma names this --font-display, but that collides with Tailwind's
// @theme namespace and silently resolves to itself.

// ❌ mengulang kode
// Set the font variable
```

Rujukan ke dokumen boleh tetap memakai nomornya (`RULES §11`, `PRD D9`) —
itu penunjuk lokasi, bukan kalimat.

---

## 5. Komponen

- **Server Component sebagai default.** Tambahkan `"use client"` hanya bila
  memang perlu (state, effect, event handler, animasi/parallax).
- Satu komponen = satu tanggung jawab. Section melebihi ~150 baris → pecah.
- Turunkan `"use client"` ke titik terdalam: bungkus tombol interaktifnya,
  jangan seluruh halaman.
- Tanpa default export untuk komponen, kecuali file `page.tsx`/`layout.tsx`
  yang memang mewajibkan.

Urutan isi file:

```tsx
// 1. import
// 2. type
// 3. constants (copy, config)
// 4. component
```

---

## 6. Styling

- Tailwind untuk semua styling. CSS kustom hanya bila Tailwind tidak mampu.
- **Dilarang nilai warna hardcode.** Pakai token dari blok `@theme` di
  `src/app/globals.css`. Daftar lengkap warna, tipografi, gradient, dan
  spacing — [DESIGN-TOKENS.md](DESIGN-TOKENS.md). Warna brand: emas `#E1B762`,
  emas tua `#AD8752`.
- Tailwind v4 memakai konfigurasi **CSS-first**. Tidak ada `tailwind.config.ts`;
  token baru ditambahkan ke `@theme`, bukan ke file JS.
- Mobile-first: gaya dasar untuk layar kecil, lalu naik lewat `sm:` `md:` `lg:`.
- Urutan class: layout → spacing → sizing → typography → visual → state.
- Class kondisional memakai `clsx`/`cn`, bukan rangkaian template string.
- Tanpa `!important`.

---

## 7. Gambar

- **Selalu `next/image`**, jangan `<img>`.
- `alt` wajib deskriptif. Gambar murni dekoratif: `alt=""`.
- Gambar hero (above the fold): beri `priority`.
- Aset di atas 1 MB dioptimasi lebih dulu sebelum masuk repo.
  `feature-hq-building.png` (9.2 MB) belum dioptimasi — lihat PRD R3.
- Sertakan `sizes` untuk gambar responsif agar srcset tidak boros.

---

## 8. Data & API

**Aturan utama:** seluruh akses data melewati `lib/api/client.ts`.
Dilarang memanggil `fetch` langsung dari komponen.

Alasannya: backend belum ada. Saat API nyata siap, hanya `client.ts` yang
berubah — komponen tidak tersentuh.

- Type ditulis lebih dulu di `types.ts` sebagai kontrak.
- Bentuk mock **wajib** menyerupai response asli, termasuk field opsional.
- Fetch data di Server Component bila memungkinkan; TanStack Query hanya untuk
  bagian client yang interaktif.
- Kredensial API tidak pernah menyentuh Client Component.
- Setiap pemanggilan data punya penanganan error dan loading state.

---

## 9. Teks & i18n

Situs saat ini English-only tanpa route `[locale]` (PRD D4).

Agar i18n bisa ditambahkan nanti tanpa membongkar struktur:

- **Dilarang hardcode teks di tengah JSX.** Simpan sebagai konstanta di atas
  komponen, atau di `src/content/`.
- Satu sumber teks per section, mudah diekstrak ke file translasi.

```tsx
// ✅
const COPY = {
  title: "Domino World Federation",
  cta: "Join the tournament",
} as const

// ❌
<h1>Domino World Federation</h1>
```

---

## 10. Aksesibilitas

- HTML semantik: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.
- Satu `<h1>` per halaman; hierarki heading tidak melompat.
- Kontras teks minimal 4.5:1 (emas di atas gelap perlu dicek).
- Seluruh elemen interaktif dapat diakses keyboard dan punya focus state.
- Ikon tanpa teks wajib `aria-label`.
- Animasi menghormati `prefers-reduced-motion`.

---

## 11. Animasi

Pustaka: **`motion`** — nama baru `framer-motion` sejak rebrand 2025.
Install `bun add motion`, import dari `motion/react`. Jangan pasang paket
`framer-motion` yang lama.

```tsx
import { motion, useScroll, useTransform } from "motion/react"
```

- Animasikan `transform` dan `opacity` saja — hindari properti yang memicu
  layout reflow.
- Durasi 200–400ms untuk interaksi mikro.
- Komponen beranimasi butuh `"use client"` — letakkan sedalam mungkin agar
  tidak menyeret seluruh section ke client.
- Hormati `prefers-reduced-motion`.

---

## 12. Parallax

Situs ini bergaya **parallax**. Aset sengaja dipisah per layer supaya tiap
elemen bisa bergerak dengan kecepatan berbeda.

### Prinsip

- Kedalaman ditentukan **kecepatan**: layer belakang bergerak paling lambat,
  layer depan paling cepat. Latar dekoratif < subjek utama < elemen foreground.
- **Hanya `transform` dan `opacity`.** Dilarang menganimasikan `top`, `left`,
  `margin`, `width`, atau `height` — semuanya memicu reflow tiap frame.
- Beri `will-change: transform` pada layer yang bergerak, tapi jangan diobral —
  tiap layer memakan memori GPU.
- Satu section = satu container `relative`; layer di dalamnya `absolute`
  dengan `z-index` eksplisit dan berurutan.

### Implementasi

Pakai `useScroll` + `useTransform` dari `motion/react`:

```tsx
"use client"

import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"

export function ParallaxLayer({ speed = 0.5, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`])

  return (
    <div ref={ref}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}
```

Selalu batasi `useScroll` dengan `target` ke section terkait — tanpa itu,
seluruh halaman ikut terhitung dan efeknya meleset.

### Wajib

- **`prefers-reduced-motion`: parallax dimatikan penuh**, bukan sekadar
  diperlambat. Gerakan terkait scroll adalah pemicu utama motion sickness.
  Layer tetap tampil di posisi diamnya.
- **Mobile:** kurangi jumlah layer atau nonaktifkan. Parallax berat menguras
  baterai dan sering patah-patah di perangkat kelas bawah.
- Layar tidak boleh melompat/bergeser saat layer masuk — kunci tinggi
  container agar tidak menggeser layout.
- Layer dekoratif memakai `aria-hidden="true"` dan `alt=""`.
- Uji di perangkat nyata, bukan hanya device toolbar browser.

### Batas performa

- Maksimal **3–4 layer bergerak** per viewport.
- Jangan pasang parallax pada gambar yang belum dioptimasi —
  `feature-hq-building.png` (9.2 MB) wajib dikompres lebih dulu (PRD R3).
- Target 60fps. Kalau turun, kurangi layer — jangan turunkan kualitas gambar
  sebagai jalan pintas.

---

## 13. Package manager — Bun

**Selalu Bun.** Jangan `npm`, `yarn`, atau `pnpm`.

| Keperluan | Perintah |
|---|---|
| Install dependency | `bun install` |
| Tambah / hapus paket | `bun add <pkg>` · `bun remove <pkg>` |
| Jalankan script | `bun run dev` · `bun run build` |
| Eksekusi paket sekali pakai | `bunx <pkg>` (bukan `npx`) |
| Scaffold project | `bunx create-next-app@latest --use-bun` |

Next.js dijalankan di atas runtime Bun lewat flag `--bun` — **kecuali `build`
dan `start`**:

```json
{
  "scripts": {
    "dev": "bun --bun next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

Tanpa `--bun`, Bun hanya bertindak sebagai package manager sementara Next tetap
berjalan di Node.

> **Kenapa `build` tidak pakai `--bun`.** Diuji 2026-08-20 dan gagal:
> `Failed to load external module … app-page-turbo.runtime.prod.js:
> Expected CommonJS module to have a function wrapper`. Turbopack memuat runtime
> CJS lewat jalur yang belum didukung Bun. `dev` diuji terpisah dan normal.
> Coba lagi setelah Bun naik versi; kalau sudah lolos, kembalikan `--bun`.
> Detail: PRD D9.

Aturan lockfile: commit `bun.lock`. Jangan pernah commit `package-lock.json`
atau `yarn.lock` — kalau muncul, hapus.

Seluruh perintah di dokumentasi dan contoh kode ditulis dengan Bun.

> Deploy ke Vercel: runtime Bun masih public beta, aktif lewat
> `"bunVersion": "1.x"` di `vercel.json`. Bila belum stabil saat deploy,
> Bun tetap dipakai untuk install & build, runtime produksi jatuh ke Node.

---

## 14. Git

Format commit: `<type>: <deskripsi>`

Type: `feat` · `fix` · `style` · `refactor` · `docs` · `chore` · `perf`

```
feat: add hero section
fix: correct partner logo aspect ratio
chore: optimize hq building image
```

- Commit atomik — satu perubahan logis per commit.
- Branch: `feat/nama-fitur`, `fix/nama-bug`.
- Jangan commit `.DS_Store`, `.env*`, `node_modules/`, `package-lock.json`,
  `yarn.lock`.
- Jangan commit rahasia. Figma API key ada di `~/.claude.json`, **bukan** di repo.

### Penulis commit

Commit ditulis atas nama pemilik repo saja. **Dilarang mencantumkan AI sebagai
penulis atau co-author** — tanpa trailer `Co-Authored-By: Claude`, tanpa
`Generated with`, tanpa emoji bot di pesan commit maupun deskripsi PR.

```
# ✅
feat: add hero section

# ❌
feat: add hero section

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

Alasannya: riwayat git adalah catatan tanggung jawab. Yang menekan commit
bertanggung jawab atas isinya, terlepas dari alat bantu yang dipakai.

---

## 15. Sebelum menandai selesai

- [ ] `bun run build` lolos tanpa error
- [ ] Tanpa error TypeScript
- [ ] Tanpa warning ESLint
- [ ] Diuji di 360px, 768px, 1440px, 1920px
- [ ] Tanpa scroll horizontal di semua breakpoint
- [ ] Gambar memakai `next/image` dan punya `alt`
- [ ] Tanpa `console.log` tersisa
- [ ] Tanpa warna hardcode
- [ ] `PROGRESS.md` diperbarui

---

## 16. Pemeliharaan dokumen

| Dokumen | Isi | Kapan diperbarui |
|---|---|---|
| `PRD.md` | Apa & mengapa; keputusan; risiko | Ada keputusan atau perubahan lingkup |
| `PROGRESS.md` | Status & blocker | Setiap menyelesaikan tugas |
| `RULES.md` | Standar teknis | Ada konvensi baru yang disepakati |
| `DESIGN-TOKENS.md` | Font, tipografi, warna, spacing | Ada token baru terbaca dari Figma |

Keputusan arsitektur dicatat di PRD §7 — satu tempat saja, jangan digandakan.
