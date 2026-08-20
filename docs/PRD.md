# PRD — Domino World Federation (DWF)

**Status:** Draft
**Terakhir diperbarui:** 2026-08-20
**Pemilik:** monsky-dev

---

## 1. Ringkasan

Website resmi Domino World Federation (DWF) — badan federasi domino tingkat dunia.
Fase pertama adalah **landing page** hasil slicing desain Figma. Fase berikutnya
berkembang menjadi **portal** (ranking, profil pemain, turnamen, area member).

Karena portal sudah pasti menyusul, arsitektur fase 1 disiapkan agar tidak perlu
migrasi framework di tengah jalan.

Landing page bergaya **parallax**: aset dipisah per layer agar tiap elemen
bergerak dengan kecepatan berbeda saat scroll. Ini menentukan cara aset disusun
dan cara section dibangun — lihat RULES §11.

### Catatan nama

Signage pada render gedung HQ berbunyi **"DWF — Domino World Federation"**.
Nama folder project (`dfw`) adalah kekeliruan urutan huruf. **Brand resmi = DWF.**
Semua nama file, komponen, dan teks memakai `DWF`. Nama folder dibiarkan apa adanya
agar tidak memutus path yang sudah ada.

---

## 2. Tujuan & Non-Tujuan

### Tujuan fase 1

| # | Tujuan | Ukuran keberhasilan |
|---|---|---|
| G1 | Landing page presisi terhadap desain Figma | Selisih visual ≤ 2px pada breakpoint desktop |
| G2 | Responsif penuh | Rapi di 360px → 1920px, tanpa scroll horizontal |
| G3 | Siap SEO | Metadata, OG tag, semantic HTML, heading hierarkis |
| G4 | Performa | Lighthouse ≥ 90 (Performance, Accessibility, SEO) |
| G5 | Siap portal | Struktur folder & data layer tidak perlu dibongkar di fase 2 |
| G6 | Parallax mulus | 60fps saat scroll; mati penuh saat `prefers-reduced-motion` |

### Non-tujuan fase 1

- Autentikasi / area member
- Dashboard admin & CMS
- Multi-bahasa (lihat §7 — keputusan i18n)
- Integrasi API nyata (backend belum tersedia)
- Fitur realtime (live score)

---

## 3. Pengguna

| Persona | Kebutuhan | Implikasi |
|---|---|---|
| Penggemar domino | Berita, jadwal turnamen, hasil | Konten mudah dipindai, gambar cepat termuat |
| Pemain / atlet | Ranking, cara mendaftar turnamen | CTA registrasi jelas |
| Sponsor & partner | Kredibilitas federasi, exposure logo | Section partner tampil menonjol |
| Media / pers | Aset brand, kontak resmi | Halaman berita & kontak terstruktur |

---

## 4. Ruang lingkup fase 1 — Landing page

**Terverifikasi dari Figma** pada 2026-08-20 (node `1:2`).
Kanvas 1920 × ~8600px, latar `#0E0E0E`.

Urutan berdasarkan koordinat Y di desain:

| # | Y | Section | Node | Data |
|---|---|---|---|---|
| S1 | 0 | Navbar — overlay, glassmorphism | `42:2143` | Statis |
| S2 | 0 | Hero — 1920×1040, 3 layer blur bertingkat | `22:789` | Statis |
| S3 | 785 | Countdown World Championship | `24:1025` | Mock |
| S4 | 1197 | Feature — gedung HQ | `31:1085` | Statis |
| S5 | 2065 | Stats federasi | `37:1874` | Mock |
| S6 | 3092 | Featured Event — latar putih | `52:3027` | Mock |
| S7 | 3941 | Intro berita | `53:3067` | Statis |
| S8 | 4701 | Carousel berita — **5 item** | `54:3157` | Mock |
| S9 | 5401 | Official Partners | `56:4541` | Statis |
| S10 | 5818 | Resource Library — 4 kartu | `56:4554` | Mock |
| S11 | 6306 | FAQ | `81:690` | Statis |
| S12 | 6826 | Overlay shine | `56:4970` | Dekoratif |
| S13 | 7374 | CTA akhir | `56:4698` | Statis |
| S14 | 7982 | Footer | `56:5159` | Statis |

### Selisih dari asumsi awal

Inventaris aset melewatkan empat hal — semuanya ditemukan setelah MCP tersambung:

- **Countdown**, **Stats**, **Resource Library**, dan **FAQ** tidak terdeteksi
  karena murni tipografi/komponen, tanpa aset gambar khusus
- Carousel berita berisi **5 item**, bukan 6 — satu thumbnail tidak terpakai
- Section "Featured Event" berlatar **putih**, satu-satunya yang memutus latar gelap

### Isi terverifikasi

- Headline hero: **"DOMINOES WITHOUT BORDERS"** (Bebas Neue 156px)
- Tagline: "DOMINO WORLD FEDERATION" — mengonfirmasi **DWF** (D5)
- Stats: 84+ Member Federation · 563K Registered Players · 1.5K Certified Referees
- Resource Library: statutes, rulebooks, governance documentation

### Partner terdaftar (8)

Pertamina Fastron · DRX · BAIC · JHL Collection · kart.inc · adamare The Villa ·
Bahn Hoft · LXVR

### Design token (dari Figma)

| Token | Nilai |
|---|---|
| Latar | `#0E0E0E` |
| Font display | **Bebas Neue** — 76 / 156 / 175 / 200px |
| Font teks | **Inter** — 400/500/600, 18–40px |
| Gradient emas | `#FFE0A1` → `#BA8D30` |
| Tombol primer | radial `#F1C977` → `#A57F40`, border konik putih 3px, glow `0 0 24px #E1B762`, radius 48px |
| Tombol sekunder | gradient perak `#FFFFFF` → `#999` → `#EDEDED` → `#CBCBCB`, radius 8px |
| Glassmorphism | `rgba(0,0,0,0.4)` + `backdrop-blur(10px)`, radius 12px |
| Kartu countdown | gradient putih 12%→0%, stroke gradient, `backdrop-blur(4px)`, radius 24px |

> Warna emas di RULES §5 (`#E1B762`, `#AD8752`) berasal dari logo. Desain memakai
> rentang lebih luas — token final disusun saat scaffold Tailwind.

Tabel di atas hanya ringkasan. Spesifikasi lengkap — seluruh ukuran font,
line height, letter spacing, gradient, efek, dan spacing — ada di
[DESIGN-TOKENS.md](DESIGN-TOKENS.md).

---

## 5. Rencana fase 2 — Portal

Belum dikerjakan; dicatat agar keputusan arsitektur fase 1 tetap sejalan.

- Tabel ranking dunia (sortir & filter)
- Profil pemain (halaman dinamis per pemain)
- Turnamen: jadwal, bracket, hasil
- Arsip berita + halaman detail artikel
- Area member (registrasi turnamen)
- Kemungkinan multi-bahasa

---

## 6. Stack teknis

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Framework | **Next.js 16.3** (App Router) | Server Components untuk API tanpa bocorkan key; ISR untuk ranking; SEO kuat; satu-satunya yang menutup landing + portal tanpa migrasi |
| Bahasa | **TypeScript** (strict) | Response API di-type sebagai kontrak sebelum backend siap |
| Styling | **Tailwind CSS 4.3** | Cocok untuk slicing 1:1 dari Figma. v4 memakai konfigurasi CSS-first (`@theme`), bukan `tailwind.config.ts` |
| Animasi & parallax | **`motion` 13.x** (nama baru `framer-motion`, import `motion/react`) | `useScroll` + `useTransform` memadai untuk parallax scroll-linked di React |
| Data client | **TanStack Query** | Hanya untuk bagian interaktif fase 2; fase 1 cukup `fetch` di Server Component |
| Gambar | **next/image** | Auto WebP/AVIF + resize — penting, aset terbesar 9.2 MB |
| Package manager & runtime | **Bun 1.3.13** | Standar kerja yang berlaku. Install & build jauh lebih cepat; Next dijalankan dengan flag `--bun` |

### Alternatif yang dipertimbangkan

- **Astro 7.2** — lebih ringan dan skor performa lebih tinggi untuk landing page murni.
  Ditolak karena portal sudah pasti menyusul; island model menyulitkan tabel
  interaktif dan area member, dan migrasi di tengah jalan jauh lebih mahal.
- **Nuxt / Vue** — setara secara teknis. Ditolak karena tidak ada alasan tim.

---

## 7. Keputusan yang sudah diambil

| ID | Keputusan | Alasan | Tanggal |
|---|---|---|---|
| D1 | Next.js, bukan Astro | Portal menyusul; hindari migrasi | 2026-08-20 |
| D2 | Landing dulu, portal kemudian | Permintaan bertahap | 2026-08-20 |
| D3 | Mock data layer, bukan tunggu API | Backend dikerjakan tim lain, belum tersedia | 2026-08-20 |
| D4 | English-only, **tanpa** route `[locale]` | Belum dibutuhkan. Mitigasi: semua teks disimpan sebagai konstanta terpisah, bukan hardcode di JSX — ekstraksi ke file translasi nanti tidak membongkar struktur route | 2026-08-20 |
| D5 | Brand ditulis `DWF` | Sesuai signage di render HQ | 2026-08-20 |
| D6 | Bun sebagai package manager & runtime | Standar kerja yang berlaku. Next dijalankan via `bun --bun next` | 2026-08-20 |
| D7 | Landing page bergaya parallax | Arahan desain; aset memang sudah dipisah per layer | 2026-08-20 |
| D8 | Pakai paket `motion`, bukan `framer-motion` | Pustaka sama, nama paket berganti sejak rebrand 2025. Import dari `motion/react` | 2026-08-20 |

---

## 8. Kontrak data (sementara)

Backend belum ada. Type ditulis lebih dulu sebagai **kontrak sementara**; seluruh
akses data melewati satu wrapper (`lib/api/client.ts`) sehingga penukaran
mock → API nyata tidak menyentuh komponen.

Entitas yang diantisipasi: `NewsArticle`, `Partner`, `Player`, `Tournament`, `Ranking`.

> Saat response asli tersedia, sesuaikan `lib/api/types.ts` lebih dulu.
> TypeScript akan menunjuk seluruh lokasi yang perlu diperbaiki.

---

## 9. Risiko

| ID | Risiko | Dampak | Mitigasi |
|---|---|---|---|
| ~~R1~~ | ~~MCP Figma `403 Token expired`~~ | — | **Selesai 2026-08-20.** MCP tersambung, node `1:2` terbaca, §4 sudah diverifikasi |
| R2 | SVG partner bukan vektor — hanya PNG base64 dalam wrapper `<svg>` (0 `<path>`); `logo-lxvr.svg` 120 KB untuk 218×125 | Tidak scalable, ukuran boros | Export ulang dari Figma dengan outline text, atau pakai PNG langsung |
| R3 | `feature-hq-building.png` 9.2 MB (4096×2458) | Merusak target G4 | Resize + WebP via `next/image`; pertimbangkan pre-compress |
| R4 | Kontrak API meleset dari response asli | Rework di fase 2 | Isolasi di `lib/api/`; minta contoh response ke tim backend sedini mungkin |
| R5 | Penempatan `decor-light-beam.png` & `partners/` (global vs home) belum pasti | Refactor path kecil | `shine` terkonfirmasi hanya dipakai sekali di landing (Y 6826) → tetap di `home/`. Status `partners/` menunggu keputusan halaman lain (pertanyaan terbuka #2) |
| R9 | Aset di Figma belum dipetakan ke file lokal — `imageRef` desain belum dicocokkan dengan file di `assets/` | Salah pasang gambar saat slicing | Cocokkan per section saat pengerjaan; unduh via MCP bila ada yang belum tersedia |
| R6 | Runtime Bun di Vercel masih public beta | Deploy produksi bisa terhambat | Aktifkan via `"bunVersion": "1.x"` di `vercel.json`. Bila bermasalah, Bun tetap dipakai untuk install & build, runtime jatuh ke Node — tanpa perubahan kode |
| R7 | Parallax berat merusak target performa (G4/G6), terutama di ponsel kelas bawah | Skor Lighthouse turun, scroll patah-patah | Batasi 3–4 layer per viewport; kompres aset lebih dulu; kurangi/nonaktifkan layer di mobile; uji di perangkat nyata |
| R8 | Parallax memicu motion sickness | Masalah aksesibilitas | `prefers-reduced-motion` mematikan parallax **penuh**, bukan memperlambat |

---

## 10. Pertanyaan terbuka

1. Base URL API dan contoh response — kapan tersedia dari tim backend?
2. Apakah strip partner juga muncul di halaman lain, atau hanya landing page?
3. Domain produksi dan target hosting (Vercel?)
4. Sumber konten berita — hardcode, CMS, atau API?
5. Apakah ada brand guideline resmi (font, warna) di luar file Figma?
