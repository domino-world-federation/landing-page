# DWF Website — Nuxt

Port Nuxt 4 dari [`../landing-page`](../landing-page) (Next 16). Tiga belas route
yang sama, copy yang sama, aset yang sama, keputusan desain yang sama.

Aturan produk dan teknis tetap yang di
[`../landing-page/docs/`](../landing-page/docs/) — PRD, RULES, DESIGN-TOKENS,
PROGRESS. Dokumen ini hanya mencatat **apa yang berubah karena frameworknya
berubah**, dan kenapa.

## Menjalankan

```bash
bun install
bun run dev        # http://localhost:3000
bun run build      # lalu: node .output/server/index.mjs
bun run typecheck  # vue-tsc lewat nuxt typecheck
bun run lint       # eslint (@nuxt/eslint)
```

Selalu Bun, jangan npm/yarn/pnpm. Commit `bun.lock`.

## Struktur

Nuxt 4 memakai `app/` sebagai srcDir, jadi seluruh folder yang dimiliki framework
ada di dalamnya. `public/`, `server/` dan `shared/` tetap di akar.

```
app/
  app.vue              NuxtLayout > NuxtPage
  assets/css/main.css  token @theme — pindahan langsung dari globals.css
  components/          auto-import; nama render = <Folder><File>
    motion/            primitif gerak (ParallaxLayer, Reveal, …)
    layout/            Navbar, Footer, dan potongannya
    ui/                primitif lintas halaman
    home/ about/ …     section milik satu halaman
  composables/         useEntrance, useDragToPan
  content/             teks statis (persiapan i18n)
  layouts/             default.vue, home.vue
  lib/api/             kontrak data, client, mock
  pages/               13 route
  plugins/             route-progress.client.ts
  types/               tipe bersama + augmentasi PageMeta
  utils/               auto-import: cn, tanggal, konstanta gerak, imageSizes
public/assets/         110 file, disalin apa adanya
```

Penamaan file komponen **menanggalkan prefiks foldernya**: Nuxt merender
`about/Header.vue` sebagai `<AboutHeader>`, jadi menyimpan `AboutHeader.vue` akan
menghasilkan `<AboutAboutHeader>`. Nama yang dirender karena itu identik dengan
nama komponen di build Next.

## Apa yang berubah, dan kenapa

| Next | Nuxt | Alasan |
|---|---|---|
| Server / Client Component | SFC biasa | Nuxt merender semuanya di server lalu menghidrasi; tak ada batas yang perlu ditandai. Pemisahan komponen tetap dipertahankan — ia tetap benar sebagai pemisahan tanggung jawab. |
| `async` Server Component | `useAsyncData` | Menjalankan fetch saat SSR dan menitipkan hasilnya lewat payload, jadi browser tidak meminta ulang. |
| `searchParams` | `useRoute().query` | Filter tetap di URL, tetap dirender server, tetap bisa dikirim sebagai tautan (D50). |
| `metadata` | `useSeoMeta` | |
| shell halaman ditulis ulang tiap route | `layouts/default.vue` + `home.vue` | Navbar dan footer jadi satu tempat. |
| `next/image` | `<NuxtImg>` | Untuk raster. SVG memakai `<img>` biasa — pipeline image akan mengembalikan byte yang sama (RULES §7). |
| `next/font` | `@nuxt/fonts` | Self-host by family name, jadi jembatan `--font-bebas`/`--font-inter` yang dulu perlu (DESIGN-TOKENS §1) tidak diperlukan lagi. |
| `motion/react` | `motion-v` | Port Vue resmi dari organisasi Motion, di atas `framer-motion@13` yang sama. `whileTap` bernama `whilePress`; `viewport` bernama `inViewOptions`. |
| `RouteProgress` + `onClick` per link | `plugins/route-progress.client.ts` | Nuxt punya hook `page:start`/`page:finish`; Next tidak, sehingga bar-nya dulu harus dipasang manual ke tiap link. |
| `scroll={false}` per link | `app/router.options.ts` | Satu aturan untuk semua strip filter, dan ikut berlaku saat filter diubah lewat tombol back. |
| `process.env.NEXT_PUBLIC_API_BASE_URL` | `runtimeConfig.public.apiBaseUrl` | Nilai runtime, bukan inline saat build. Override: `NUXT_PUBLIC_API_BASE_URL`. |
| `next: { revalidate: 300 }` | — | Nuxt tidak punya padanan per-request, dan memang tidak seharusnya: cache itu milik Nitro. Saat API ada, lima menitnya jadi `routeRules` di `nuxt.config`. |
| `app/loading.tsx` | tidak ada | **Bukan kelalaian.** Layar itu ada karena Next mengosongkan halaman lama saat menunggu segmen baru. Nuxt menahan halaman lama dan menaikkan indikator, jadi tidak ada momen kosong yang perlu diisi. Bar sapuannya sama persis. `content/loading.ts` disimpan untuk kalau fallback semacam itu suatu saat dibutuhkan. |

### `sizes` — beda sintaks, dan satu jebakan

`sizes` di `@nuxt/image` bukan string media query seperti `next/image`. Kuncinya
adalah **lebar tempat kandidat dihitung**, dan tiap kunci menghasilkan satu entri
`srcset`.

`sizes="100vw"` telanjang dibaca sebagai kunci `1px` — hasilnya `srcset` selebar
**1w dan 2w**. Ia lolos build, lolos typecheck, dan terlihat seperti aset yang
rusak. Ditemukan dengan merender halaman lalu membaca markup-nya.

Karena itu tidak ada `sizes` yang ditulis tangan: semuanya lewat
`imageSizes({ xs: "60vw", lg: "28vw" })` di [`app/utils/image-sizes.ts`](app/utils/image-sizes.ts),
yang memuai spesifikasi itu ke seluruh tangga breakpoint. Media query-nya tetap
runtuh ke batas yang diminta, dan `srcset` dapat kandidat di tiap lebar yang
benar-benar dipakai.

### `noUncheckedIndexedAccess`

Nyala secara bawaan di Nuxt 4; tsconfig Next tidak memilikinya. Tetap dipakai —
ini lebih ketat dan konvensi frameworknya. Indeks literal ke array `as const`
ditegaskan dengan `!` di tiga file copy FAQ.

## Yang belum dikerjakan

Sama dengan build Next, dan bukan hal baru:

- **B2** — API belum ada; seluruh getter menyajikan `mock/`.
- **R12** — dua blok Domino masih ekstrapolasi dari wireframe.
- **R14** — `/contact` berdiri di atas satu kalimat desainer.
- **R15** — pager FAQ tidak dibangun (halaman 2–3 akan kosong).
- **R16** — Champions Hall memakai potret asli dengan nama placeholder.

Yang **belum** diverifikasi di port ini: **pixel-parity terhadap Figma**. Build,
typecheck, lint bersih, ketiga belas route membalas 200 dengan satu `<h1>`, dan
seluruh section ter-render — tetapi belum ada yang membandingkan hasilnya dengan
desain di 360/768/1440/1920 (RULES §15). Itu langkah berikutnya.
