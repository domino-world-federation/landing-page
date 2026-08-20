# Progress — DWF Website

**Terakhir diperbarui:** 2026-08-20

Legenda: `[ ]` belum · `[~]` berjalan · `[x]` selesai · `[!]` terblokir

---

## Ringkasan

| Fase | Status | Keterangan |
|---|---|---|
| 0 — Persiapan aset | `[x]` | Selesai |
| 1 — Scaffold project | `[ ]` | Siap dimulai |
| 2 — Slicing landing page | `[ ]` | 0/14 section — desain sudah terverifikasi |
| 3 — Integrasi API | `[ ]` | Menunggu backend |
| 4 — Portal | `[ ]` | Fase berikutnya |

---

## Blocker aktif

| ID | Blocker | Menghambat | Tindakan |
|---|---|---|---|
| B2 | API belum tersedia (dikerjakan tim lain) | Fase 3 | Pakai mock; minta contoh response |
| B3 | `feature-hq-building.png` 8.8 MB belum dikompres | S4 (Feature HQ) | Kompres sebelum S4 dikerjakan — bukan sebelum scaffold |

Selesai: ~~B1 MCP Figma 403~~ — tersambung 2026-08-20.

---

## Fase 0 — Persiapan aset `[x]`

- [x] Verifikasi MCP Figma terpasang
- [x] Ganti Figma API key & revoke token lama
- [x] Identifikasi seluruh aset dengan memeriksa isinya (bukan menebak dari nama)
- [x] Rename ke konvensi `<kategori>-<nama>[-varian].<ext>`
- [x] Identifikasi 8 logo partner per brand
- [x] Pisahkan `assets/global/` dan `assets/home/`
- [x] Hapus `.DS_Store`
- [x] Tarik struktur desain dari Figma & verifikasi daftar section
- [x] Ekstrak design token (font, tipografi, warna) → `docs/DESIGN-TOKENS.md`

**Temuan:**
- Brand sebenarnya **DWF**, bukan DFW (dari signage render HQ + tagline hero)
- SVG partner bukan vektor: PNG base64 dalam wrapper `<svg>` (PRD R2)
- `feature-hq-building.png` 9.2 MB, perlu optimasi (PRD R3)
- Section nyata **14**, bukan 7 — Countdown, Stats, Resource Library, FAQ
  terlewat karena tanpa aset gambar khusus
- Carousel berita **5 item**, bukan 6 — satu thumbnail tidak terpakai

---

## Fase 1 — Scaffold project `[ ]`

- [ ] `bunx create-next-app@latest --use-bun` — TypeScript, Tailwind, App Router
- [ ] Script `package.json` pakai `bun --bun next <cmd>`
- [ ] Inisialisasi git + `.gitignore` (abaikan `package-lock.json`, `yarn.lock`)
- [ ] Struktur folder sesuai `RULES.md`
- [ ] Pindahkan `assets/` → `public/assets/`
- [ ] `bun add motion` (nama baru `framer-motion`)
- [ ] Font: **Bebas Neue** + **Inter** via `next/font` — variabel `--font-bebas`
      / `--font-inter` (jangan `--font-display`/`--font-sans`, bentrok namespace
      `@theme`)
- [ ] Token di `@theme` (`src/styles/globals.css`) — Tailwind v4 CSS-first,
      **tanpa** `tailwind.config.ts`. Isi sesuai `DESIGN-TOKENS.md` §8
- [ ] Komponen `ParallaxLayer` reusable
- [ ] ESLint + Prettier
- [ ] Path alias `@/`
- [ ] `lib/api/types.ts` — kontrak sementara
- [ ] `lib/api/client.ts` — wrapper + mock

---

## Fase 2 — Slicing landing page `[ ]` — 0/14

Dikerjakan **per section**, berurutan sesuai posisi Y. Tiap section dianggap
selesai bila lolos checklist RULES §14.

| # | Section | Node | Status | Catatan |
|---|---|---|---|---|
| S1 | Navbar | `42:2143` | `[ ]` | Overlay glassmorphism, sticky |
| S2 | Hero | `22:789` | `[ ]` | 3 layer blur — parallax utama |
| S3 | Countdown | `24:1025` | `[ ]` | Butuh timer client + tanggal target |
| S4 | Feature HQ | `31:1085` | `[ ]` | Aset 9.2 MB — kompres dulu |
| S5 | Stats | `37:1874` | `[ ]` | Fokus berpindah saat scroll |
| S6 | Featured Event | `52:3027` | `[ ]` | Latar putih |
| S7 | Intro berita | `53:3067` | `[ ]` | — |
| S8 | Carousel berita | `54:3157` | `[ ]` | 5 item, geser horizontal |
| S9 | Official Partners | `56:4541` | `[ ]` | 8 logo, opacity 25% |
| S10 | Resource Library | `56:4554` | `[ ]` | 4 kartu dokumen |
| S11 | FAQ | `81:690` | `[ ]` | Accordion |
| S12 | Overlay shine | `56:4970` | `[ ]` | Dekoratif, layer parallax |
| S13 | CTA akhir | `56:4698` | `[ ]` | — |
| S14 | Footer | `56:5159` | `[ ]` | Glassmorphism |

### Per section wajib

Tarik node → cocokkan aset → susun markup → styling → responsif
(360/768/1440/1920) → parallax bila ada layer → a11y → tandai selesai.

### Setelah semua section

- [ ] Petakan kecepatan antar layer secara menyeluruh
- [ ] `prefers-reduced-motion` mematikan parallax penuh
- [ ] Uji parallax di perangkat nyata (60fps, cek baterai)
- [ ] Audit Lighthouse (target ≥ 90)
- [ ] Metadata & OG tag
- [ ] Sapuan akhir lintas breakpoint

---

## Fase 3 — Integrasi API `[ ]`

Terblokir B2. Section bergantung API: S3, S5, S6, S8, S10.

- [ ] Terima base URL + contoh response
- [ ] Samakan `types.ts` dengan response asli
- [ ] Ganti implementasi mock di `client.ts`
- [ ] Penanganan error & loading state
- [ ] Atur strategi cache / ISR

---

## Fase 4 — Portal `[ ]`

Belum dimulai. Cakupan di PRD §5.

---

## Catatan keputusan

Keputusan arsitektur dicatat di **PRD §7**. Ubah di sana, bukan di sini.

## Riwayat

| Tanggal | Peristiwa |
|---|---|
| 2026-08-20 | Aset dirapikan & dipisah global/home |
| 2026-08-20 | Stack diputuskan: Next.js 16.3 + TS + Tailwind + `motion` |
| 2026-08-20 | Bun ditetapkan sebagai package manager & runtime (D6) |
| 2026-08-20 | Gaya parallax dikonfirmasi; aturan layer ditulis di RULES §11 (D7, D8) |
| 2026-08-20 | MCP Figma tersambung; 14 section terverifikasi (PRD §4) |
| 2026-08-20 | Design token diekstrak dari Figma → `docs/DESIGN-TOKENS.md` |
