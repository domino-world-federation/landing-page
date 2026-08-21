# Design Tokens — DWF Website

Spesifikasi font, tipografi, dan warna hasil ekstraksi langsung dari Figma
(file `1Q8Ud3Iq0dSR0KXymurySI`, node `1:2`) pada **2026-08-20**.

Seluruh nilai di sini **terbaca dari desain**, bukan perkiraan. Bagian yang belum
diverifikasi ditandai eksplisit.

Aturan pemakaiannya ada di [RULES.md](RULES.md) §6 — dilarang menulis nilai
warna secara hardcode; selalu lewat token.

---

## 1. Font

Dua family, tanpa tambahan lain.

| Peran | Family | Weight terpakai | Sumber |
|---|---|---|---|
| Display | **Bebas Neue** | 400 (Regular) | Google Fonts |
| Teks | **Inter** | 400, 500, 600 | Google Fonts |

Bebas Neue hanya punya satu weight, dan seluruh desain memakainya sebagai huruf
kapital — bukan karena `text-transform`, melainkan karena memang begitu bentuk
font-nya. Jangan mencari weight bold.

### Pemasangan

```ts
// src/app/layout.tsx
import { Bebas_Neue, Inter } from "next/font/google"

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
})
```

`next/font` melakukan self-hosting otomatis — tanpa request ke Google saat
runtime, dan tanpa layout shift.

> **Nama variabelnya sengaja `--font-bebas` / `--font-inter`, bukan
> `--font-display` / `--font-sans`.** Di Tailwind v4, namespace `--font-*`
> adalah milik tema — menulis `--font-display: var(--font-display)` di dalam
> `@theme` membuat variabel merujuk ke dirinya sendiri, dan font gagal termuat
> tanpa pesan error. Pisahkan namanya, lalu jembatani di `@theme` (lihat §8).

---

## 2. Skala tipografi

### Display — Bebas Neue

| Token | Ukuran | Line height | Dipakai di | Node |
|---|---|---|---|---|
| `display-2xl` | 200px | — | Angka stats "84+", "563K" | `47:2684` |
| `display-xl` | 175px | — | Angka stats "1.5K" | `37:1869` |
| `display-lg` | 156px | — | Headline hero | `2:4` |
| `display-md` | 126px | 132px | Headline CTA akhir | `56:4683` |
| `display-sm` | 76px | 72px | Judul FAQ, Resource Library | `81:691` |
| `display-xs` | 64px | — | Angka countdown | `24:1031` |
| `display-2xs` | 40px | — | Pemisah titik dua countdown | `24:1033` |
| `display-btn` | 32px | 40px | Label tombol | `56:4685` |

Perhatikan: **label tombol memakai Bebas Neue 32px**, bukan Inter. Ini mudah
terlewat dan membuat tombol terlihat keliru bila salah.

### Teks — Inter

| Token | Ukuran | Line height | Weight | Dipakai di |
|---|---|---|---|---|
| `text-5xl` | 64px | — | 500 | Judul intro berita |
| `text-4xl` | 40px | 48px | 500 | Label stats |
| `text-3xl` | 36px | 48px | 600 | Pertanyaan FAQ |
| `text-2xl` | 32px | 48px | 400 | Jawaban FAQ |
| `text-xl` | 32px | 40px | 600 | Judul "OFFICIAL PARTNERS" |
| `text-lg` | 24px | 32px | 500 | Tautan footer |
| `text-md` | 24px | — | 600 | Tagline hero |
| `text-base` | 20px | 32px | 400 | Paragraf isi |
| `text-sm` | 20px | 24px | 600 | Label "UPCOMING MATCH" |
| `text-xs` | 18px | 26px | 400 | Teks pendukung hero |
| `text-2xs` | 16px | 24px | 400/500 | Meta, judul kolom footer |
| `text-3xs` | 14px | 22px | 400/500 | Copyright, satuan countdown |

### Letter spacing

| Nilai | Dipakai di | Node |
|---|---|---|
| `0.24em` | Tagline hero "DOMINO WORLD FEDERATION" | `2:3` |
| `0.25em` | Judul "OFFICIAL PARTNERS" | `55:3316` |
| `0.12em` | Label "UPCOMING MATCH" | `24:1027` |

Tracking selebar itu memang disengaja pada teks kapital pendek. Jangan
dinormalkan.

---

## 3. Warna

### Dasar

| Token | Nilai | Keterangan |
|---|---|---|
| `bg` | `#0E0E0E` | Latar utama seluruh halaman |
| `fg` | `#FFFFFF` | Teks utama di atas latar gelap |
| `black` | `#000000` | Teks di atas permukaan terang |
| `surface-light` | `#FFFFFF` | Latar Featured Event, kartu FAQ, kartu Resource |
| `text-muted` | `#616161` | Isi jawaban FAQ |
| `text-dim` | `#818181` | Judul kolom footer |
| `border-light` | `#E0E0E0` | Border tombol kartu Resource |
| `divider` | `#DADADA` | Pembatas antar item FAQ |

### Emas — identitas brand

| Token | Nilai | Sumber |
|---|---|---|
| `gold-light` | `#FFE0A1` | Awal gradient teks |
| `gold-dark` | `#BA8D30` | Akhir gradient teks |
| `gold-btn-light` | `#F1C977` | Pusat gradient tombol primer |
| `gold-btn-dark` | `#A57F40` | Tepi gradient tombol primer |
| `gold-glow` | `#E1B762` | Warna bayangan/glow |
| `gold-logo-dark` | `#AD8752` | Emas tua pada logo |

Dua nilai terakhir cocok dengan warna yang sudah tercatat di RULES §6 —
keduanya berasal dari file logo.

### Opacity yang berulang

| Nilai | Dipakai untuk |
|---|---|
| 0.8 | Teks stats aktif, judul partner |
| 0.6 | Paragraf pendukung, satuan countdown |
| 0.5 | Copyright, tautan legal |
| 0.25 | Deretan logo partner |
| 0.2 | Stats tidak aktif, garis pembatas |

---

## 4. Gradient

Nilai persis dari desain — jangan diperkirakan ulang.

### Teks emas
```css
linear-gradient(90deg, #FFE0A1 0%, #BA8D30 100%)
```
Dipakai: angka "563K", judul "RESOURCE LIBRARY".

### Teks perak
```css
linear-gradient(90deg, #FFF 0%, #999 50%, #FFF 100%)
```
Dipakai: headline hero.

### Tombol primer (emas)
```css
background: radial-gradient(circle at 50% 50%, #F1C977 0%, #A57F40 100%);
border: 3px solid;
border-image: conic-gradient(from 90deg at 50% 50%, #FFF 0%, transparent 100%);
border-radius: 48px;
box-shadow:
  0 0 24px rgba(225,183,98,1),
  0 0 6px  rgba(225,183,98,1),
  inset 0 0 16px rgba(255,255,255,0.8);
```

### Tombol sekunder (perak)
```css
background: linear-gradient(90deg,
  #FFFFFF 0%, #999999 29%, #EDEDED 64%, #CBCBCB 100%);
border-radius: 8px;
```
Teksnya hitam, Bebas Neue 32px.

### Fade ke latar
```css
linear-gradient(180deg, rgba(14,14,14,0) 0%, rgba(14,14,14,1) 100%)
```
Menyatukan tepi bawah gambar dengan latar halaman.

### Vignette radial
```css
radial-gradient(circle at 51% 0%, rgba(82,82,82,0) 47%, rgba(14,14,14,1) 100%)
```

---

## 5. Efek

### Glassmorphism

Dipakai di navbar (`42:2180`) dan footer (`59:8940`) — sama persis:

```css
background: rgba(0, 0, 0, 0.4);
backdrop-filter: blur(10px);
border-radius: 12px;
```

### Kartu countdown

```css
background: linear-gradient(180deg,
  rgba(255,255,255,0.12) 0%, rgba(153,153,153,0) 100%);
backdrop-filter: blur(4px);
border-radius: 24px;
border: 3px solid; /* stroke gradient, lihat catatan */
```

Stroke-nya dua gradient bertumpuk — CSS tidak bisa meniru persis. Pendekatan
paling mendekati: pseudo-element dengan `mask-composite`, atau sederhanakan
jadi satu gradient.

### Blur — layer parallax

Blur di hero **sudah menjadi bagian desain**, bukan efek runtime. Makin besar
blur, makin jauh layer itu berada.

| Layer | Blur | Node |
|---|---|---|
| Gambar belakang | 6.5px | `24:930` |
| Gambar tengah | 4px | `24:929` |
| Subjek utama | 2px | `24:933` |
| Blok teks feature | 2px | `31:1105` |
| Stats tidak aktif | 3.5px | `50:2928` |
| Angka "1.5K" | 10px | `37:1869` |
| Judul intro berita | 7.5px | `55:3224` |

**Jangan menganimasikan blur.** Bake ke aset, atau pasang statis lewat CSS.
Menganimasikannya memaksa repaint tiap frame dan menghancurkan framerate.

### Bayangan

| Token | Nilai | Dipakai |
|---|---|---|
| `shadow-card` | `0 4px 4px rgba(0,0,0,0.25)` | Kartu FAQ |
| `shadow-glow` | `0 0 24px #E1B762, 0 0 6px #E1B762` | Tombol primer |

---

## 6. Spacing & radius

### Padding section

| Nilai | Dipakai di |
|---|---|
| `80px` | Padding standar section (FAQ, footer, Resource Library) |
| `100px 80px` | CTA akhir, Official Partners |
| `60px 80px` | Featured Event |
| `60px 160px` | Isi kartu FAQ |
| `36px 80px 16px` | Navbar |
| `16px 20px` | Padding tombol |
| `24px` | Kartu countdown |

### Gap

`8px` · `10px` · `12px` · `14px` · `16px` · `18px` · `20px` · `24px` ·
`32px` · `36px` · `44px` · `48px` · `52px` · `70px` · `92px` · `100px` · `228px`

Sebagian besar kelipatan 4 — cocok dengan skala bawaan Tailwind.

### Radius

| Token | Nilai | Dipakai |
|---|---|---|
| `rounded-btn` | 8px | Tombol sekunder |
| `rounded-glass` | 12px | Navbar, footer |
| `rounded-item` | 16px | Item FAQ |
| `rounded-card` | 20px | Kartu berita, kartu FAQ, kartu Resource |
| `rounded-countdown` | 24px | Kartu countdown |
| `rounded-pill` | 48px | Tombol primer |

---

## 7. Kanvas

| Properti | Nilai |
|---|---|
| Lebar desain | 1920px |
| Tinggi total | ~8600px |
| Latar | `#0E0E0E` |
| Tinggi hero | 1040px |
| Lebar kartu berita | 540 × 700px |
| Lebar kartu countdown | 498px |
| Lebar kartu Resource | 560px |

Desain hanya tersedia pada **satu breakpoint: 1920px**. Tata letak
tablet dan ponsel belum ada — lihat §9.

---

## 8. Konfigurasi Tailwind

**Tailwind v4 memakai konfigurasi berbasis CSS (`@theme`), bukan
`tailwind.config.ts`.** File JS lama masih bisa dimuat lewat `@config`, tetapi
itu jalur migrasi — untuk project baru, tulis langsung di CSS.

Token didefinisikan di `src/app/globals.css`. Tiap variabel `@theme`
otomatis menghasilkan utility class-nya sendiri:

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* Font — menjembatani variabel dari next/font */
  --font-display: var(--font-bebas), sans-serif;
  --font-sans: var(--font-inter), sans-serif;

  /* Warna dasar */
  --color-bg: #0E0E0E;
  --color-surface-light: #FFFFFF;
  --color-muted: #616161;
  --color-dim: #818181;
  --color-border-light: #E0E0E0;
  --color-divider: #DADADA;

  /* Emas */
  --color-gold: #E1B762;
  --color-gold-light: #FFE0A1;
  --color-gold-dark: #BA8D30;
  --color-gold-btn-light: #F1C977;
  --color-gold-btn-dark: #A57F40;
  --color-gold-logo: #AD8752;

  /* Radius */
  --radius-btn: 8px;
  --radius-glass: 12px;
  --radius-item: 16px;
  --radius-card: 20px;
  --radius-countdown: 24px;
  --radius-pill: 48px;

  /* Bayangan */
  --shadow-card: 0 4px 4px rgb(0 0 0 / 0.25);
  --shadow-glow: 0 0 24px #E1B762, 0 0 6px #E1B762;
}
```

Hasilnya langsung terpakai sebagai `bg-bg`, `text-gold`, `rounded-pill`,
`shadow-glow`, `font-display`, dan seterusnya.

### Ukuran font

Skala display di §2 terlalu besar untuk dipakai mentah sebagai nilai tetap —
156px akan merusak layar ponsel. Definisikan dengan `clamp()` supaya satu class
bekerja di semua lebar:

```css
@theme {
  --text-display-lg: clamp(2.5rem, 8vw, 9.75rem);  /* 40px → 156px */
  --text-display-sm: clamp(2rem, 4vw, 4.75rem);    /* 32px → 76px  */
  --text-display-btn: clamp(1.5rem, 2vw, 2rem);    /* 24px → 32px  */
}
```

Angka pastinya ditentukan saat slicing per section — desain hanya menyediakan
titik 1920px, sisanya keputusan kita (lihat §9 no. 1–2).

---

## 9. Catatan & yang belum terjawab

1. **Hanya ada satu breakpoint.** Desain dibuat untuk 1920px saja. Ukuran
   tablet/ponsel adalah keputusan implementasi, bukan salinan desain —
   perlu dikonfirmasi ke desainer bila tersedia.

2. **Ukuran font display terlalu besar untuk ponsel.** 156px pada layar 360px
   jelas tidak muat. Skala responsif harus dirancang sendiri; usulan:
   `clamp()` dengan basis ~40px di ponsel.

3. **Kontras belum diuji.** Emas `#E1B762` di atas `#0E0E0E` kemungkinan lolos
   4.5:1, tetapi `#BA8D30` (ujung gradient) lebih gelap dan berisiko. Wajib
   diuji sebelum dinyatakan selesai (RULES §10).

4. **Stroke gradient tidak bisa ditiru persis di CSS.** Kartu countdown dan
   tombol primer memakai stroke bergradient bertumpuk. Perlu pendekatan
   `mask-composite` atau penyederhanaan.

5. **Teks jawaban FAQ mengandung penekanan inline** (`**bold**` di tengah
   kalimat). Simpan sebagai konstanta terstruktur, bukan satu string panjang —
   lihat RULES §9.
