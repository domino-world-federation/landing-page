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
dan cara section dibangun — lihat RULES §12.

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

### Sumber desain

`fileKey` **`p1W8bEWU5w3cRYROFNQwKh`** — "Domino World Federation Landing Page
(NEW)", dipakai sejak 2026-08-24 menggantikan salinan lama
`1Q8Ud3Iq0dSR0KXymurySI` (D59). File baru menata tiap halaman dalam SECTION
bernama, jadi layar tidak lagi perlu dicari dari isi `header`-nya (D33). Node
layar yang sudah dibangun **tidak berubah** — kecuali All News, lihat D59.

| Section | Node section | Layar hi-fi | Status |
|---|---|---|---|
| Homepage | `366:16741` | `1:2` | Dibangun |
| About Us | `366:16740` | `69:22` | Dibangun |
| Domino | `366:16739` | `119:4737` | Dibangun 5 blok; hi-fi kini menggambar 8 (R12) |
| Development | `365:16243` | `190:13600` | Dibangun |
| News | `365:16244` | `156:7512` + All News `366:16246` | Dibangun |
| Gallery | `366:16738` | `156:7154` | Dibangun |
| Terms & Conditions | `185:13581` | `174:11162` | Dibangun |
| Privacy Policy | `185:13580` | `174:10759` | Dibangun |
| Contact US | `361:16242` | `176:11563` | Dibangun **tanpa layar ini terbaca** (R14) |
| FAQ | `185:13579` | `173:9459` | Dibangun — pager ditunda (R15) |
| Tournaments | `385:18107` | `366:17181` | Dibangun — potret Champions Hall ditahan (R16) |
| Members | — | hanya wireframe `385:18114` | Hi-fi belum ada |

Satu frame belum terpetakan: `386:18480` (1920×1579, putih, tanpa anak).

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

> Warna emas di RULES §6 (`#E1B762`, `#AD8752`) berasal dari logo. Desain memakai
> rentang lebih luas — token final disusun saat scaffold Tailwind.

Tabel di atas hanya ringkasan. Spesifikasi lengkap — seluruh ukuran font,
line height, letter spacing, gradient, efek, dan spacing — ada di
[DESIGN-TOKENS.md](DESIGN-TOKENS.md).

---

## 5. Rencana fase 2 — Portal

- Tabel ranking dunia (sortir & filter)
- Profil pemain (halaman dinamis per pemain)
- Turnamen: jadwal, bracket, hasil
- Arsip berita + halaman detail artikel
- Area member (registrasi turnamen)
- Kemungkinan multi-bahasa

### Halaman About — dikerjakan lebih dulu

Halaman kedua situs dan halaman pertama fase 2. Ia didahulukan karena statis
seluruhnya kecuali satu daftar, jadi ia menguji pembagian per-halaman (D32) dan
skala tipografi lintas-halaman (D34) tanpa menunggu backend.

**Terverifikasi dari Figma** pada 2026-08-22, node `69:22` — **bukan** node pada
URL yang diberikan (D33). Kanvas 1920 × 10436, 13 blok. Dikerjakan **dua tahap**
atas keputusan pengguna; tahap 1 berhenti di Mission.

| Tahap | Blok | Node | Data |
|---|---|---|---|
| 1 | Header — "The global authority for dominoes." | `119:4799` | Statis |
| 1 | Authority band — foto full-bleed 1920×850 | `79:616` | Statis |
| 1 | Overview — satu-satunya band putih | `84:753` | Statis |
| 1 | Heritage — timeline berjalan | `88:1163` | Mock |
| 1 | Vision — figur + dua wash emas | `102:2793` | Statis |
| 1 | Pillars — tiga blok naik lewat mask | `107:2847` | Statis |
| 1 | Mission — 4 kartu ikon | `107:2997` | Statis |
| 2 | Structural Frameworks (placeholder desain) | `111:3152` | — |
| 2 | Executive Boards — carousel | `112:3590` | Mock |
| 2 | Sub-Committees | `114:3667` | Mock |
| 2 | HQ — memakai ulang `feature-hq-composite.png` | `117:3846` | Statis |

`PageShine` dan `Join` tidak ikut — desain About tidak memuatnya.

### Halaman Development

Halaman keempat, node `190:13600`. Berbeda dari Domino, **hi-fi menggambar
seluruh bloknya** — kekurangan D42 tidak berulang di sini, jadi tidak ada blok
yang ditunda.

| Blok | Node | Data |
|---|---|---|
| Header — "Growing the game" | `190:13657` | Statis |
| Band ruang kelas — foto full-bleed 1920×850 @80% | `190:13660` | Statis |
| Youth Development — satu-satunya band putih | `190:13662` | Statis |
| Official Certifications — 3 grade + tangga 3 level | `190:13674` | Statis |
| Educational Resources — 4 kartu dokumen | `192:14833` | Mock |
| Grassroots Initiatives — 3 kartu bergambar | `192:14877` | Statis |
| Development News — 4 berita | `207:15528` | Mock |
| Federation Support Programs — daftar + form | `202:15013` | Statis |
| CTA "Shape the future of dominoes" | `207:15320` | Statis |

`PageShine` **ikut** di sini (`207:15295`, 1920×2071) — desainnya memuatnya,
tidak seperti About dan Domino. `Join` tetap tidak: itu section landing page,
dan halaman ini menutup dengan CTA-nya sendiri.

### Halaman News

Halaman kelima, node `156:7512` (1920×5089). Node-nya **digali dari kanvas,
bukan dari URL** (D33): empat frame `screen` di file ini tak bernama, dan yang
membedakannya cuma teks header — `156:7154` ternyata **Gallery** ("Search
Event") dan `176:11563` ternyata **FAQ**. Yang benar menulis "Federation News"
dan "Search News".

Wireframe `156:6782` menyebut **tujuh** section; hi-fi menggambar enam. Yang
tidak digambar adalah "Newsletter Subscription" — dan itu **tidak** dibangun,
bukan karena tertunda seperti D42, melainkan karena footer situs sudah
memuatnya sejak S14. Membangun kotak langganan kedua di satu-satunya halaman
yang memang berakhir dengan satu adalah menggandakan kontrolnya, bukan
melengkapi desain.

| Blok | Node | Data |
|---|---|---|
| Header — "Federation News" + search | `156:7513` | Statis |
| Featured band — carousel 1920×850 | `156:7584` | Mock |
| Arsip — tab filter + grid 6 + "View more" | `163:8233` | Mock |
| Press Releases — 4 kartu PDF | `168:8475` | Mock |
| Publications — 2 kartu bersampul | `168:8582` | Mock |
| Media Gallery — collage 5 kolom | `168:8680` | Mock |

`PageShine` **tidak** ikut (desainnya tidak memuatnya, seperti About dan
Domino), dan `Join` juga tidak.

### Halaman Terms & Conditions

Halaman keenam, node `174:11162` (1920×3553), berada di dalam SECTION "Terms &
Conditions" `185:13581` — bukan di level kanvas seperti lima halaman
sebelumnya, jadi tidak terlihat pada penelusuran kanvas biasa.

Satu dari **tiga layar legal** yang digambar di atas cangkang yang sama:
Privacy Policy (`174:10759`, 1920×3045) dan FAQ (`173:9459`, 1920×3365) belum
dibangun. Komponennya sengaja **tetap di `components/terms/`** dan belum
dipromosikan — D32 mensyaratkan komponen pindah saat halaman kedua benar-benar
memakainya, dan menebak bentuk yang dibutuhkan Privacy sebelum membangunnya
adalah cara `ui/` penuh berkas sekali-pakai dulu (D43, D46).

| Blok | Node | Data |
|---|---|---|
| Header — "Back" + judul + tanggal | `174:11163` | Statis |
| Table of Contents — 9 tab + kartu Need Support | `174:11225` | Statis |
| Isi dokumen — kartu putih, 9 klausa | `174:11257` | Statis |

Klausanya **copy, bukan data**: dokumen hukum bukan feed, jadi ia tinggal di
`content/terms/sections.ts` dan tidak lewat `client.ts` — merutekannya ke
endpoint mock akan menjanjikan respons `/terms` yang tidak akan dibangun siapa
pun.

### Halaman Contact

**Dibangun tanpa layar desainnya, padahal layarnya ada.** Saat halaman ini
ditulis (2026-08-24), pencarian menyimpulkan desain hanya menggambar sepuluh
layar dan contact bukan salah satunya, jadi seluruh susunannya diekstrapolasi
dari kartu "Need Support?" sidebar Terms (`174:11252`) — lihat D54. File `(NEW)`
menampik kesimpulan itu: `176:11563` berjudul **"Contact Us"** (`176:11845`),
kolom kiri berisi kanal kontak federasi dan kartu Need Support, kolom kanan satu
kartu putih. Layar itu **sudah ada di file lama** tanpa nama, dan terlewat.
Halaman yang berjalan sekarang harus dicocokkan ulang dengannya. **R14** ditulis
ulang mengikuti temuan ini.

### Halaman Gallery

Halaman kedelapan, node `156:7154` (1920×4827). Halaman **kedua** yang memakai
cangkang side-tab milik layar legal — dan itulah yang akhirnya memindahkan dua
bagian keluar dari `components/terms/` (D55).

| Blok | Node | Data |
|---|---|---|
| Header — judul + tanggal + search | `156:7155` | Statis |
| Kolom event — 5 tab + kartu Need Support | `156:7217` | Mock |
| Album — 3 collage + 1 film | `156:7235` dst | Mock |

Empat album: World Championship London 2026, Asian Masters Tokyo 2026, World
Championship Havana 2025, dan "The Silent War" 2025 — yang terakhir digambar
sebagai **satu still lebar**, bukan collage.

Satu wireframe lain yang belum dibangun: `gallery-wireframe` (`148:5063`).

### Halaman Privacy Policy

Halaman kesembilan, node `174:10759` (1920×3045), di dalam SECTION
`185:13580`. **Layar Terms dengan delapan klausa berbeda di dalamnya** — header,
kolom daftar isi, kartu putih, rule 4px, semuanya sama. Itulah yang membuktikan
`LegalDocument` layak diangkat: rutenya kini copy plus satu komponen (D57).

TODO(design): klausa 8 menaruh sekretariat di "Maison du Sport International,
Lausanne, Switzerland", sedangkan footer (`56:4939`) memberi alamat federasi di
Evans Rd, Singapore. Dua kantor pusat berbeda dalam satu desain — dibiarkan
apa adanya (D44).

### Halaman All News

Halaman kesepuluh, node `185:13184` (1920×2745), rute `/news/all`. Blok arsip
halaman News dalam ukuran penuh: dua kolom kartu alih-alih tiga, filter kategori
pindah dari strip pill ke kolom samping, dan tautan "Back" ke `/news`.

Keberadaannya **mencabut satu keputusan sebelumnya** — lihat D58.

### Halaman FAQ

Halaman kesebelas, node `173:9459` (1920×3365), rute `/faq`. Cangkang side-tab
yang keempat — `ui/PageHeader`, `ui/SideTabLayout`, `ui/SupportCard` (D57) —
tapi **bukan** `LegalDocument`: badannya accordion terfilter, bukan dokumen
bernomor.

| Blok | Node | Data |
|---|---|---|
| Header — Back + judul + search | `174:11468` | Statis |
| Kolom topik — 6 tab + kartu Need Support | `173:9842` | Copy |
| Kartu putih — 10 pertanyaan | `174:10652` | Copy |
| Pager 1-2-3 | `174:10695` | **Tidak dibangun**, lihat R15 |

Pertanyaannya **copy, bukan data** (`content/faq/`), alasan yang sama dengan
klausa legal: FAQ itu dokumen yang ditulis federasi, bukan feed yang diarsipkan.
Kedua filternya karena itu duduk di URL dan dibaca di server — `?category=` dan
`?q=` (D50, D60).

Sampai halaman ini ada, tautan "FAQ" di footer menunjuk `/#faq` — section S11 di
landing page, berisi tiga dari sepuluh pertanyaan. Sekarang menunjuk `/faq`; S11
tetap memegang anchor-nya.

### Halaman Tournaments

Halaman kedua belas, node `366:17181` (1920×7972), rute `/tournaments`. Layar
**pertama yang hanya ada di file `(NEW)`** (D59) — sampai ia muncul,
"Tournaments" adalah satu dari empat item navbar yang menunjuk `#`.

| Blok | Node | Data |
|---|---|---|
| Hero — trofi, wordmark DWF2026, bar acara | `370:17243` | Mock |
| Highlighted Tournaments — band S6 | `372:17314` | Mock |
| All Tournaments — rail + progress bar | `373:17419` | Mock |
| Tournament Regulations — 3 dokumen | `381:17589` | Mock |
| Champions Hall — 4 kartu | `381:17633` | Mock, **tanpa potret** (R16) |
| Media gallery | `381:17695` | Mock, komponen `/news` |
| Olympic Results — tabel 5 kolom | `385:17860` | Mock |
| FAQ + "View more" → `/faq` | `385:17864` | Copy |

Kontrak data bertambah tiga: `Tournament` diperluas (kategori, status
pendaftaran, lokasi tampilan, artwork), lalu `Champion` dan `OlympicResult`
yang baru. Empat fungsi client menyusul — `getTournaments`,
`getHighlightedTournament`, `getChampions`, `getOlympicResults`.

Hero dan band highlighted **membaca satu record yang sama**, karena desain
menamai acara yang sama dengan dua tahun berbeda (D61).

### File desain berganti — 2026-08-25

Atas permintaan pengguna, acuan desain pindah dari `1Q8Ud3Iq0dSR0KXymurySI`
("Copy") ke file yang lebih baru. **Semua node yang tercatat di atas mengacu ke
file lama** dan tidak diverifikasi ulang — halaman Members ke bawah mengacu ke
file baru.

**Ada dua fileKey untuk desain baru yang sama.** Pengguna memberi
`xdogWlTYLSqwh2fBTmxPJi` ("Updated") lebih dulu, lalu
**`oY2v2wq359rIRK4KaItmxc`** (tanpa akhiran) sebagai "ini design nya".
Keduanya diperiksa dan **identik**: kanvas `Finalization` + `Playground` yang
sama, dua belas section dengan node id dan dimensi yang sama persis, dan layar
Domino yang sama sampai ke label tabnya. Jadi node yang tercatat berlaku di
keduanya. **Yang tanpa akhiran dipakai sebagai acuan** karena itu yang terakhir
ditunjuk pengguna; `xdogWlTYLSqwh2fBTmxPJi` adalah salinan yang sama isinya.

File baru jauh lebih rapi: tiap halaman jadi SECTION bernama di kanvas
`Finalization`, jadi tidak perlu lagi menebak `screen` tanpa nama seperti yang
memaksa penelusuran header di halaman News dan Gallery (D33).

Tiga section **baru** yang tidak ada di file lama: `Tournaments` (`385:18107`),
`Members` (`406:609`), dan **`Contact Us` (`361:16242`)** — yang terakhir
mengubah status R14, karena `/contact` dibangun tanpa desain.

### Halaman Members

Halaman dari file baru, screen `386:18480` (1920×5468), section `406:609`.

| Blok | Node | Data |
|---|---|---|
| Hero — judul + intro + pill emas + 4 statistik | `401:19063` | Mock |
| Peta keanggotaan + kunci warna | `404:28159` | Statis |
| Direktori — 6 federasi, 2 kolom | `405:28394` | Mock |
| Membership Benefits — 3 kartu | `405:28521` | Statis |
| Application process — timeline 4 langkah | `406:453` | Statis |
| CTA penutup | `406:479` | Statis |

`PageShine` **ikut** (`406:454`, 1920×1907), berlabuh ke kaki halaman seperti
di Development. **Tidak ada header band** — halaman ini membuka dengan hero
1080px, dan itu keputusan desain yang benar: band untuk halaman yang berupa
dokumen atau arsip, dan halaman ini sebuah ajakan.

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
| D9 | `build` & `start` di runtime **Node**, `dev` tetap `--bun` | `bun --bun next build` gagal: `Failed to load external module … app-page-turbo.runtime.prod.js: Expected CommonJS module to have a function wrapper`. Turbopack memuat runtime CJS lewat jalur yang belum didukung Bun. `dev` diuji terpisah dan normal (HTTP 200). Bun tetap dipakai untuk install & dev — D6 tidak dibatalkan, hanya dipersempit | 2026-08-20 |
| D10 | Commit tanpa atribusi AI | Riwayat git adalah catatan tanggung jawab; yang menekan commit bertanggung jawab atas isinya. Aturan di RULES §14 | 2026-08-20 |
| D11 | Token gerak dipusatkan di `lib/utils/motion.ts`; kurva halaman `[0.25, 0.6, 0.35, 1]` | "Samakan rasanya" harus jadi satu perubahan berkas, bukan sisir per-section. Kurvanya dipilih dari pengukuran, bukan selera: expo-out `[0.22, 1, 0.36, 1]` menempuh 40% perjalanan dalam 10% pertama durasi dan 96% di tengah (puncak 4.5× rata-rata), jadi memanjangkan `duration` hanya menambah waktu mati — kurva terpilih puncaknya 2.46×, yang paling rata dari tujuh kandidat, dan tetap ease-*out* supaya tidak terbaca lag pada gerakan yang dipicu scroll | 2026-08-21 |
| D12 | Navbar `fixed` dan **transparan sampai bawah** | `absolute` mengikat bar ke `y:0` dokumen sehingga ikut tergulung — terukur hilang seluruhnya pada scroll 150px. `fixed` mempertahankan tampilan istirahat yang sama persis. Tetap transparan karena glass sudah ada di pill menu & burger (`bg-black/40` + blur sendiri); panel kedua di belakangnya menggandakan efek dan mencetak pita keras melintasi artwork. Konsekuensi baik: `NavShell` tidak butuh scroll listener, tetap Server Component | 2026-08-21 |
| D13 | Entrance multi-layer dipicu **per grup**, bukan per layer (`EntranceGroup`) | Komposisi bukan penjumlahan layer-nya. Tiap layer yang mengamati dirinya sendiri membuat hero merakit diri bottom-up saat pembaca naik dari S3 — batu bawah melewati ambangnya lebih dulu dan mundur saat tile masih di luar layar — padahal saat load urutannya top-down. Satu `useInView` + context memberi satu boolean ke semua layer, jadi jeda relatif dari desain tetap utuh dari arah mana pun. Default context `true`, sehingga layer tanpa grup tetap berperilaku seperti sebelumnya | 2026-08-21 |
| D14 | Lebar kolom multi-kolom ditulis **proporsional (vw + `flex-1 basis-0`)**, bukan angka Figma harfiah; slicing wajib dicek overflow di semua breakpoint | S6 lolos ke commit dengan halaman scroll ke samping dari 1024 sampai ~1700 (`scrollWidth` 1614/1657/1674 di 1024/1440/1600), karena hanya pernah diperiksa di 1920 tempat ia muat. Tiga kolom pada angka desain harfiah adalah beban tetap yang tidak bisa menyusut — 380+520+380 plus dua gutter 100, eyebrow, dan padding 80 menuntut 1772px window. Aturannya sekarang: angka Figma jadi **plafon**, bukan lebar; kartu diukur sebagai pecahan lebar desain (27.08vw = 520/1920) dan kolom samping membagi sisanya. Tinggi yang bergantung padanya ikut proporsional — 721px tetap membuat tombol menggantung di bawah kartu di tiap lebar di bawah 1920 | 2026-08-21 |
| D15 | Teks S7 diselesaikan **sampai tajam**, menyimpang dari `blur(7.5px)` yang ada di desain | Node `55:3224` membawa blur itu sebagai keadaan istirahat, jadi desain tidak pernah menajamkan kalimatnya. Kalimat itu satu-satunya isi section — versi buram permanen tidak terbaca di ukuran mana pun, dan permintaan eksplisitnya "muncul dari blur sampai terlihat terang". Perlu dikonfirmasi ke desainer; kalau ternyata disengaja, `Reveal` tinggal diberi blur akhir bukan nol | 2026-08-21 |
| D16 | `ParallaxLayer` dapat anchor ketiga **`foot`** (`["start end", "end end"]`); section terakhir halaman wajib memakainya | Anchor default `cross` baru mencapai progress 1 saat kepala section melewati atas viewport — yang tidak pernah terjadi pada section terakhir, karena dokumennya habis lebih dulu. S7 terukur mandek di f≈0,5: halaman berakhir di 5100, penyeberangan butuh 2040px scroll padahal hanya tersedia 960, jadi hanya 27px dari 58px travel yang tersampaikan dan gerakannya tidak terlihat sama sekali. `foot` berakhir saat kaki section bertemu kaki viewport — rentang yang selalu ada, ada section penerus atau tidak. Dipertahankan meski S8 nanti membuat `cross` bisa dijangkau: untuk backdrop full-bleed, gerakan adalah milik kedatangan, bukan kepergian | 2026-08-21 |
| D17 | Gerak yang bisa **di-pause** digerakkan tangan (`useMotionValue` + `useAnimationFrame`), bukan `animate` deklaratif | Animasi deklaratif memperlakukan "paused" sebagai **target berbeda**, bukan pembekuan. Terukur pada marquee S8: `animate={{ x: still ? "0%" : "-50%" }}` membuat hover menarik strip dari −51 kembali ke 0 — melompat ke awal persis di bawah kursor pembaca, kebalikan dari diam untuk dibaca. Menambah offset per frame ke sebuah MotionValue membuat pause berarti *berhenti menambah*, jadi posisinya tinggal di tempat. Tetap satu `transform` di satu track terkomposit (RULES §12): MotionValue menulis langsung ke style tanpa render React | 2026-08-22 |
| D18 | Marquee S8 berjalan otomatis, dengan **berhenti saat hover dan saat fokus** serta berhenti penuh saat reduced-motion | Pilihan pengguna dari empat opsi gerak. Kekhawatirannya disampaikan lebih dulu dan tetap berlaku: teks yang tidak pernah berhenti sulit dibaca dan tautan yang melaju sulit diklik — jadi mitigasinya masuk ke dalam komponen, bukan jadi tambahan. Berhenti-saat-fokus bukan pemanis: tanpa itu pembaca keyboard mengejar tautan yang melintas layar. Salinan kedua strip `aria-hidden` **dan** `inert`, karena menyembunyikan elemen fokusabel dari a11y tree tanpa mengeluarkannya dari tab order mendamparkan pembaca di kontrol yang tak bisa dibacakan | 2026-08-22 |
| D19 | Scrim di atas foto ditulis sebagai **kedalaman tetap** (`min(70%,340px)`), bukan persentase, bila satu komponen melayani beberapa tinggi | Kartu S8 punya tiga rasio dari satu komponen. Angka Figma 331/700 = 47% diambil sebagai persentase gagal di slot pendek: 47% dari 418px hanya 196px dan dari 258px hanya 121px, jadi wash makin curam makin pendek tile-nya. Terukur di kartu `wide`, judul mendarat di kursi yang kena cahaya tanpa bayangan di bawahnya. Kedalaman tetap membuat scrim sama dalamnya di bawah setiap judul; batas 70% menjaganya tidak menelan tile kecil. Judul dari API juga wajib `line-clamp` — Figma menulis judulnya cukup pendek, data tidak menjaminnya | 2026-08-22 |
| D20 | Sambungan S7→S8 adalah **tumpang tindih 200px**, ditulis proporsional (`-mt-[10.42%]`) | Dilaporkan pengguna: S8 terbaca sebagai pita terpisah yang terdorong padding-nya sendiri. Figma memang menumpuknya — S7 di `y:3941` setinggi 960 berakhir 4901, sedangkan baris berita mulai `y:4701`. Tumpang tindih itulah sambungannya: kartu menyelip di bawah kaki foto meja. Ditulis 200/1920 supaya ikut skala, bukan memakan 200px tetap dari kartu mobile yang pendek (D14); `relative z-10` yang membuatnya menyelip, bukan terpotong | 2026-08-22 |
| D21 | Strip partner S9 **berjalan** meski Figma menggambarnya diam, dan logonya **bukan tautan** | Delapan frame 260px berjumlah 2240px di dalam frame 1920 — tidak muat bahkan di lebar desainnya sendiri, jadi sesuatu harus mengalah. Mengecilkan marknya menjatuhkan wordmark di bawah ambang terbaca (`logo-pertamina-fastron` mengisi hampir seluruh frame dan berhenti terbaca di bawah ~150px); menjalankannya menjaga tiap logo ukuran penuh dan memberi kedelapannya giliran. Lap 90s, bukan 75s seperti S8: tidak ada yang perlu dibaca, jadi lajunya drift (~25px/s) bukan ticker. Tanpa tautan karena Figma tidak memberi tujuan dan `Partner.websiteUrl` opsional — delapan anchor ke mana-mana lebih buruk daripada delapan gambar; marknya tetap punya nama untuk pembaca layar | 2026-08-22 |
| D22 | Ambang multi-kolom ditentukan **panjang konten**, bukan lebar kartu | Grid S10 baru 2-up di `menu-lg` (1600), bukan `sm`, karena yang menentukan bukan muat-tidaknya kartu melainkan sisa ruang untuk judul (pilnya tetap 160px). Terukur: 768 → kartu 336px, judul empat baris; 1400 → 390px, tiga baris; 1600 → 455px, judul kembali ke pola `2,2,1,2` yang digambar desain. Ambang yang sama dipakai footer S14. Konsekuensinya `auto-rows-fr` menggantikan tinggi manual 156px Figma (`56:4599`) — desain sedang mengompensasi tangan untuk judul satu baris di sebelah dua baris; baris sama tinggi melakukannya sendiri dan terus melakukannya saat judulnya berubah | 2026-08-22 |
| D23 | Panel FAQ boleh menganimasikan `height` — pengecualian RULES §11 yang **disempitkan**, bukan dilonggarkan | Aturannya menyasar layer scroll-linked di mana reflow mendarat tiap frame dan beberapa layer berebut 16ms yang sama. Panel S11 satu elemen, dipicu klik eksplisit, 280ms, tanpa apa pun beranimasi di sebelahnya. Dua alternatifnya diukur dan lebih buruk: `max-height` tebakan tetap reflow dan salah timing kalau tebakannya meleset; membuka tanpa transisi menjatuhkan pembaca ke paragraf yang sedetik lalu tidak ada. Ikon toggle-nya — yang justru berbagi hot path dengan sisa halaman — tetap `transform`/`opacity`. Panel tertutup pakai `inert` bukan `aria-hidden`, karena menyembunyikan elemen fokusabel tanpa mengeluarkannya dari tab order mendamparkan pembaca keyboard (sama seperti salinan marquee S8) | 2026-08-22 |
| D24 | Token breakpoint kustom ditulis **`rem`**, tidak pernah `px` | Tailwind v4 memancarkan satu blok `@media` per breakpoint dan mengurutkannya menurut nilai, tapi tidak bisa membandingkan `px` dengan `rem` — jadi tiap breakpoint px tersortir di atas *semua* breakpoint rem, `sm` sekalipun. Ditulis `1600px`, `menu-lg:grid-cols-[…]` mendarat di atas `md:grid-cols-2`; keduanya cocok di 1600, spesifisitas seri, aturan belakangan menang, dan footer diam di dua kolom di setiap lebar. Ini menaungi **semua** aturan `menu`/`menu-lg` yang bertabrakan dengan breakpoint rem, bukan cuma footer. Dalam `rem` keduanya berselang di tempatnya: sm · md · lg · xl · menu(87.5) · 2xl · menu-lg(100) | 2026-08-22 |
| D25 | Slope tiap `clamp()` tipografi adalah **`cap / 1920`**, dihitung bukan dikira | Suku tengah `clamp()` adalah yang benar-benar dirender di lebar desain, jadi slope kurang dari cap berarti token tidak pernah mencapai maksimumnya sendiri di layar yang jadi acuan desain. Empat token pendek diam-diam dan tidak ada yang memperingatkan: `display-lg` 153,6 lawan 156; `display-md` 124,8 lawan 126; `display-xs` 63,36 lawan 64; `news-intro` 63,94 lawan 64. Setelah diseragamkan, ke-13 pasang ukuran/leading terukur cocok dengan Figma di 1920. Saat menambah step: bagi, jangan taksir | 2026-08-22 |
| D26 | `isolate` menyegel z-index anak **dan** membuat grupnya tercat satu unit — sibling belakangan menang | Dilaporkan pengguna sebagai wash gelap menimpa kartu FAQ putih. `-z-10` layer shine memang tertahan di dalam pembungkusnya, tapi dari luar pembungkus itu satu unit berurutan-opaque, dan sebagai sibling yang lebih belakang ia menimpa seluruh `<main>` yang tidak punya level sendiri. Layer-nya menjangkau ~500px ke dalam S11. Diperbaiki `relative z-10` di `<main>`. Aturannya: begitu sebuah pembungkus dekorasi diberi `isolate`, konten halaman butuh level eksplisit — bukan mengandalkan urutan dokumen | 2026-08-22 |
| D27 | Track grid ditulis `1fr`, dan `fr` **bukan** lebar | Tiga pembacaan track footer sempat salah dan ketiganya instruktif. `440fr` untuk kolom tengah mengira `fr` itu lebar — padahal ia bagian dari ruang **sisa**, jadi lawan empat track `auto` ia mengambil hampir semuanya. `auto auto … 1fr 1fr` memperbaiki lebar tengah tapi membuat dua kolom tautan hug, menyeret barisnya ke kiri dan meninggalkan emblem di 763 alih-alih 960. Yang benar `1fr 1fr 22.92vw 1fr 1fr` — dan `1fr` polos, bukan `minmax(0,1fr)`: keduanya hanya beda lantai track, dan `1fr` polos menahan minimum `auto` implisitnya sehingga track yang tidak muat dibekukan di ukuran kontennya dan sisanya dibagi ulang. Itu juga yang dilakukan `fill` Figma, yang flexbox di baliknya dan `min-width:auto` miliknya melindungi konten dari himpitan yang sama | 2026-08-22 |
| D28 | Kontrol yang belum punya backend **menolak dengan terang**, bukan diam atau dinonaktifkan | Field newsletter S14 digambar Figma sebagai dekorasi — hanya kotak bertulisan "Enter email" — tapi kotak subscribe yang tidak bisa diketik lebih buruk daripada tidak ada, jadi ia dibangun sebagai form sungguhan (label, `input type="email"`, tombol submit). Karena endpoint belum ada (B2), submit mengatakan begitu lewat `role="status"` alih-alih menelan alamatnya. Dipilih di atas dua alternatif: field yang diam-diam tidak melakukan apa-apa adalah kebohongan, dan menonaktifkannya menghilangkan bentuk desain. Begitu `POST`-nya ada, hanya `onSubmit` yang berubah. Sejalan dengan email yang ditulis teks bukan `mailto:` — alamat desain tidak punya TLD, jadi tautannya membuka compose yang tak akan terkirim | 2026-08-22 |
| D29 | Teks/field yang **tidak boleh wrap** wajib dinolkan kontribusi intrinsiknya (`w-0 min-w-full`, `w-0 flex-1`) | Dilaporkan pengguna dua kali. Menahan alamat email satu baris butuh `whitespace-nowrap` — `break-all` memecahnya "…dwf-or / g" dan `break-words` tetap memecahnya "community@dwf- / org", karena tanda hubung adalah kesempatan break normal yang tidak dihapus `overflow-wrap`. Tapi menolak wrap juga jadi tuntutan: min-content baris nowrap adalah lebar penuhnya, dan clamp menumbuhkannya lebih cepat daripada bagian kolom (204 lawan 194 di 1600; 245 lawan 244 di 1920), jadi track Contact membeku lebih lebar dari saudaranya dan menggeser emblem 7px dari sumbu. `width:0` definit tidak menyumbang ke intrinsic sizing sementara `min-width` persentase resolve ke nol saat pengukuran lalu kembali penuh setelah kolom jadi. Jebakan kembarnya di `<input>`: `size` bawaan ~20 karakter adalah **lebar**, bukan minimum — `min-w-0` menurunkan lantai tapi meninggalkan lebar preferensi, jadi field tetap meminta ~187px dan mengunci min-content kolom di 243. `w-0 flex-1` menurunkannya ke 56. Terukur off-axis 33px → 0 di 1600–2560 | 2026-08-22 |
| D30 | `w-fit` (`fit-content`) **mengabaikan `min-width` anaknya** — lantai lebar harus ada di pembungkus dan anak | Pil S13 render 169px lawan 264 desain, dan `min-w` di tombolnya sendiri tidak berpengaruh: pembungkus `Reveal`-nya `w-fit`, yang resolve terhadap **konten** dan tidak melihat `min-width` anak, jadi pembungkusnya menyusut ke label 169px lalu memotong pil di dalamnya. 264 dipasang sebagai `min-w` di keduanya, bukan lebar tetap — lebar tetap memotong terjemahan lebih panjang (RULES §9), tapi hug murni juga salah karena label Bebas 32 hanya ~129px sehingga padding 20px tidak menjelaskan sisanya dan pil-nya terbaca jelas lebih kurus dari desain. Lantainya proporsional (`min(100%,13.75vw)`) supaya tidak jadi tuntutan tetap di ponsel (D14). Terukur 264×64 di 1920 | 2026-08-22 |
| D31 | Nama aset menyebut **isi file**, bukan tempat ia kebetulan dipakai pertama kali | Audit penamaan menemukan empat nama yang menyesatkan, dan tiga di antaranya sudah menimbulkan biaya nyata. `icon-arrow.svg` menunjuk **kiri** tanpa mengatakannya, sehingga dua komponen harus menjelaskan arahnya lewat komentar dan tanda rotasinya pernah terbalik (−135° membuat panah S8 mengarah ke bawah-kanan). `hero-trophy-hand.png` tidak pernah menyentuh hero — ia `imageUrl` enam event mock S6. `card-shade.svg` menyiratkan bayangan gelap padahal isinya garis cahaya `plus-lighter`. `hq.png` satu-satunya aset tanpa prefiks kategori sehingga tidak ikut mengelompok saat di-sort, dan "hq" ambigu antara *headquarters* dan *high quality*. Jadi `icon-arrow-left`, `event-trophy-hand`, `decor-card-streaks`, `feature-hq-composite` — akhiran `-composite` sekaligus mengingatkan wash-nya sudah terbakar (D22). Dua ikon generik (`icon-arrow-left`, `icon-download`) sekalian pindah ke `global/`: keduanya glyph UI yang pasti terpakai lagi di portal, dan panah kiri sebelumnya terpisah folder dari `icon-arrow-right` tanpa alasan | 2026-08-22 |
| D32 | Komponen dikelompokkan **per halaman**, bukan per tingkat abstraksi | `ui/` memuat 16 file, delapan di antaranya (`EventCard`, `StatsWheel`, `FaqAccordion`, …) punya tepat satu pemakai selamanya. Begitu fase 2 menambah ranking, pemain, dan turnamen, folder itu jadi keranjang 40+ file dan tidak ada lagi yang bisa membedakan mana yang aman dipakai ulang — persis kualitas yang membuat `ui/` berguna. Section dan potongannya kini duduk bersama di `components/home/`, sejajar dengan `public/assets/home/` yang sudah memakai pembagian sama, jadi aset dan kode satu halaman punya satu model mental. Primitif gerak dipisah ke `motion/` karena klasternya memang saling terkait — `ParallaxLayer` dan `SofteningImage` sama-sama mengonsumsi `useEntrance` dari `EntranceGroup`, keterkaitan yang tidak terlihat saat mereka berserak di antara kartu dan accordion. `ui/` tersisa tiga primitif yang benar-benar lintas halaman, dan itu justru gunanya. `NewsletterField` ikut ke `layout/` karena hanya `Footer` yang memakainya; `content/` dicermin jadi `content/home/`. Halaman fase 2 menambah folder sendiri tanpa menyentuh yang sudah ada — G5 | 2026-08-22 |
| D33 | Node desain **dicari dari isinya**, bukan dipercaya dari URL | Node `2037:1140` pada URL About tidak ada di file (dicoba tiga kali, termasuk bentuk tanda hubung) — kemungkinan dari branch lain atau sudah usang. `fileKey`-nya sendiri benar. Halaman ditemukan dengan menelusuri kanvas `0:1` dan membaca teks `header` tiap layar sampai muncul "The global authority for dominoes" di `69:22`. Dicatat karena ini akan berulang: URL Figma dibagikan dari tab yang sedang terbuka, dan tab bisa menunjuk salinan yang sudah tidak ada. Yang stabil adalah `fileKey` + isi layar, bukan `node-id` | 2026-08-22 |
| D34 | Skala tipografi **generik** untuk halaman non-landing; skala home tetap bernama per-section | Skala home bernama menurut tempat pakainya (`--text-faq-answer`, `--text-news-card`) — benar selama satu halaman, menyesatkan begitu About memakai ukuran yang sama untuk hal berbeda. Ditambahkan delapan token yang menyebut **peran**: `--text-eyebrow`, `--text-body-sm|md|lg`, `--text-page-title`, `--text-display-year|pillar|statement`. Inilah yang dipakai halaman fase 2 berikutnya, sehingga skala tidak tumbuh satu token per section selamanya. Token home tidak diubah — mengganti nama 20-an call-site demi keseragaman adalah risiko regresi tanpa imbalan. Slope tiap clamp tetap `cap/1920` empat angka (D25) | 2026-08-22 |
| D35 | Pillars **marquee CSS**; Heritage **strip melangkah sendiri** | Keduanya sempat marquee atas permintaan pengguna ("our heritage ini pakai marquee", "global unity ini marquee ke atas"), dan untuk Pillars itu bertahan. Heritage tidak: hanyutan rata tanpa jeda **terbaca sebagai dekorasi**, dan kartu tergeser dari bawah kalimat yang sedang dibaca ("kalau marquee terlalu halus"). Versi tombol panah yang dicoba berikutnya membuat section mati — tidak ada yang terjadi kecuali ada yang menekan, padahal timeline bukan panel kontrol ("timeline itu auto geser bukan manual arrow"). Yang dipakai: strip **beristirahat lalu melangkah** tiap 1800ms, jeda itulah yang tidak dimiliki versi mulus — gerak yang berhenti adalah gerak yang bisa diikuti mata. Desainnya memang menuntut geser: empat kartu berakhir di x2810 pada frame 1920. Jalan di atas `overflow-x` native, jadi keyboard, trackpad, sentuh, dan momentum sudah benar sejak awal dan auto-advance sekadar menggerakkan `scrollLeft` yang sama; langkahnya 0.9 pitch supaya tepi kartu sebelumnya tersisa — satu pitch penuh terbaca sebagai slideshow. Berbalik arah di ujung, bukan melompat ke awal: ini sejarah dengan entri pertama dan terakhir. Ongkosnya satu Client Component (Pillars tetap Server), dengan `prefers-reduced-motion` dibaca **di dalam effect** sehingga tak ada markup yang bergantung padanya (D15) | 2026-08-22 |
| D36 | Salinan marquee **dikeluarkan dari pohon aksesibilitas**, tiga tingkat | Menggandakan konten demi kemulusan visual berarti pembaca layar mendengar isinya dua kali. Tiga penanganan, karena satu tidak cukup: `<ol>`/kolom salinan `aria-hidden`, gambar salinan `alt=""` supaya tetap benar bila elemennya terbaca sendirian, dan `<h3>` salinan diturunkan jadi `<p>` — tanpa itu halaman melaporkan enam heading di tempat desain punya tiga, dan navigasi heading berjalan menyusuri daftar yang sama dua kali. Kini berlaku untuk Pillars saja; Heritage tidak lagi menggandakan apa pun sejak D35 | 2026-08-22 |
| D37 | Sapuan blur judul dijalankan **per huruf, dengan ramp yang direset tiap baris** | Figma memberi `<h1>` About `filter: blur(7.5px)` — itu state awal, bukan tampilan diamnya. Per **kata** dicoba lebih dulu dan terbaca sebagai enam benda menyala bergantian; yang diminta adalah batas lunak yang berjalan menyusuri baris ("blur dari kiri ke kanan kek contoh ini"). Pada resolusi huruf dengan `DURATION` penuh tiap huruf dan langkah 0.06s, puluhan glyph selalu setengah jernih sekaligus — itulah yang membuatnya gradien, bukan antrean. Hitungannya **restart tiap baris** karena ramp berjalan terus akan menyelesaikan baris pertama sebelum baris kedua mulai, sedangkan desainnya dua baris melunak ke ujung kanannya masing-masing bersamaan ("the ... / for ... / ini blur"). Karena itu copy-nya array baris, bukan satu string. Tetap dua salinan statis yang saling silang opacity — `filter` tidak pernah dianimasikan (RULES §11) — dan huruf dikelompokkan per kata supaya jendela sempit tidak memutus kata di tengah | 2026-08-22 |
| D38 | Glow dan tile Vision **satu layer**, dan posisi desain diletakkan di **tengah** rentang gerak | Keduanya lahir dari bug yang sama. Figma menyisipkan glow 12px **ke dalam** siluet tile di tiap sisi (`102:2785` x717 y113 485×918 vs tile x705 y100 510×1006), jadi ia rim light pada bentuk itu, bukan lampu di belakangnya — begitu hanya tile yang bergerak, glow-nya tertinggal dan berhenti jadi rim light. Satu transform membawa keduanya. Lalu: 100 + 1006 = 1106, persis tinggi section, jadi gambarnya rapat atas-bawah dan gerak apa pun harus mengorbankan satu ujung. Pass sebelumnya menambatkan posisi desain ke **akhir** rentang, sehingga tile duduk 140px terlalu rendah sepanjang section terlihat — memotong studs pudar yang justru bagian dari desain — dan baru tiba di tempatnya ketika section sudah pergi. Kini `top` = 9.04% + setengah travel: framing desain adalah yang dipegang tile di **tengah** perlintasan, saat section tepat di jendela. Yang dikorbankan tetap kakinya, yang sudah pudar habis di PNG dan berada di bawah bagian tergelap vignette; memotong kepalanya berarti menghilangkan globe | 2026-08-22 |
| D39 | Batas Structural Frameworks → Executive Boards **digradasi**, bukan dipotong seperti Figma | Figma mengakhiri panel abu tepat di batas section dan memulai section berikutnya pada `#0e0e0e` polos, sehingga tergambar garis horizontal keras selebar halaman. Dua hal di desainnya sendiri mengatakan garis itu bukan yang dimaksud: sudut panel dibulatkan **hanya di atas** (`12px 12px 0 0`) dan ia tidak punya tepi bawah sama sekali — cara desain mengatakan "berlanjut ke luar frame". Selama artboard dipotong di situ, tidak ada yang membedakan keduanya. Begitu ada halaman di bawahnya, "berlanjut" berbentuk `--color-surface-dark` yang pudar ke `--color-bg` sepanjang Executive Boards. Kebalikan arah wash Heritage, karena Mission di atasnya duduk di latar halaman | 2026-08-22 |
| D40 | Salah ketik **judul** Figma diperbaiki; salah ketik **isi** ditampilkan apa adanya | Dua cacat berlawanan penanganannya di section yang sama. `114:3669` tertulis "Sub-Commitees" satu `t` — itu judul section, kata yang sama dieja benar di seluruh dokumen federasi, jadi memuatnya berarti mengirim salah eja ke halaman produksi atas nama kesetiaan pada mock. Diperbaiki jadi "Sub-Committees" dan dicatat di `content/about/committees.ts`. Sebaliknya jabatan "SECRETARY GENERAL" yang muncul dua kali di kartu 3 & 4 dan dua nama komite yang tertulis huruf kecil **tidak** dikarang ulang: yang pertama butuh keputusan federasi tentang siapa memegang jabatan apa, yang kedua diseragamkan CSS `uppercase` tanpa menyentuh datanya. Garisnya: memperbaiki ejaan kata yang sudah pasti vs mengarang fakta yang belum ada | 2026-08-22 |
| D41 | Carousel Executive Boards menerima `<h2>`-nya sebagai **prop**, bukan me-render sendiri | Figma menaruh judul dan sepasang panah di satu baris `justify-between`. Panahnya butuh state (`atStart`/`atEnd`/posisi), judulnya tidak — dan `"use client"` di section akan menyeret judul, `Reveal`, dan pemanggilan `getBoardMembers()` ikut ke client. Judul tetap dirender Server Component lalu diserahkan sebagai `heading: React.ReactNode`, sehingga island client hanya memiliki tata letak barisnya, bukan isinya (RULES §5). `prefers-reduced-motion` dibaca di dalam handler tombol (D15), dan geserannya memakai jarak antar-kartu yang diukur dari DOM (`offsetLeft` kartu kedua dikurangi pertama) — bukan angka lebar yang ditulis ulang di JS dan akan menyimpang begitu clamp-nya berubah | 2026-08-22 |
| D42 | Halaman Domino dibangun **lima blok dari enam**; blok "Official Game Rules" ditunda | Frame hi-fi `119:4737` mendeklarasikan 1920×6033 tapi anak-anaknya berhenti di y=2180 — tiga blok saja, dan sisanya sudah dipastikan tidak nyasar ke screen tetangga. Wireframe `119:4474` menyebut enam. Dua dari tiga yang tidak digambar tetap dibangun karena wireframe-nya **membawa copy asli**: pertanyaan FAQ lengkap dengan satu jawaban penuh, empat butir referee guidelines, label dokumen — yang diekstrapolasi hanya palet dan chrome-nya, karena wireframe digambar greyscale sedangkan situs ini gelap. Yang ketiga, "Official Game Rules (tabbed interface)" (`119:4553`), **tidak** dibangun: ia satu-satunya yang menuntut komponen tab baru sekaligus copy yang belum ada — lima dari tujuh tabnya berlabel "SCORING" duplikat dan hanya tab pertama punya isi. Dicatat sebagai R12 | 2026-08-22 |
| D43 | Tiga promosi keluar dari folder halaman, dan **arah kepemilikan tipe FAQ dibalik** | RULES §2/D32 baru bisa diuji begitu ada halaman kedua yang memakai sesuatu. `SharpeningHeadline` (About + Domino) pindah ke `components/motion/`, `FaqAccordion` (home + Domino) ke `components/ui/`, dan `vision-globe-tile.png` ke `global/globe-tile.png` tanpa prefiks section — `FormatSplit` memakai `imageRef` yang sama persis, jadi mengunduhnya kedua kali berarti dua salinan 1.9 MB dari satu berkas. Yang paling penting: `FaqItem`/`FaqSegment` dulu tinggal di `content/home/faq.ts`, sehingga `content/domino/faq.ts` harus mengimpor dari folder copy halaman lain — persis ketergantungan antar-halaman yang D32 larang. Tipe dipindah ke komponennya: yang mendefinisikan kontrak adalah yang memakainya, dan `import type` terhapus saat build jadi tak ada client boundary yang tersentuh. `Faq.tsx` (kartu putih berisi copy home) **tetap** di `components/home/` — yang pindah cuma primitifnya | 2026-08-22 |
| D44 | Judul panel doubles **dibetulkan**, body-nya **dibiarkan duplikat** | Penerapan D40 pada cacat baru. `207:15558` menulis judulnya "SINGLES FORMAT" padahal statistiknya benar (2 VS 2 / 7 TILES / 200 pts) dan ia jelas panel doubles — judul itu kata yang sudah pasti, dibetulkan jadi "DOUBLES FORMAT". Body-nya persis byte-per-byte sama dengan panel singles, yang berarti paste yang belum diganti; itu **tidak** diperbaiki. Wireframe `119:4536` memang punya kalimat doubles-nya sendiri ("Teammates must communicate through tile placement…"), tapi dua berkas desain saling bertentangan dan memilih di antaranya keputusan desainer, bukan keputusan kita. Ditandai `TODO(design)` yang menyebut kedua node | 2026-08-22 |
| D45 | `getResources` menerima **`limit`**, dan S10 meminta empat | Cacat yang tumbuh diam-diam. S10 memanggil `getResources()` tanpa argumen dan menggambar apa pun yang dikembalikan; begitu halaman Domino menaruh tiga dokumen di rak yang sama, grid 2×2 desainnya jadi tujuh kartu tanpa error apa pun — dan halaman Development akan membuatnya sebelas. Memfilter per kategori tidak bisa menolong di sini: keempat dokumen S10 justru punya **empat kategori berbeda** (kartunya mencetak kategori itu), jadi tidak ada rak untuk disebut. Yang membatasinya adalah komposisinya sendiri — grid itu empat slot tetap, bukan feed. Jadi jumlahnya dinyatakan di permintaan, persis seperti `getLatestNews(limit)` sudah melakukannya dan dengan alasan yang sama: endpoint asli menerima `?limit=`, sedangkan memotong array hasil fetch di komponen berarti tetap mengunduh seluruh perpustakaan untuk menampilkan empat isinya (RULES §8) | 2026-08-24 |
| D46 | Dua promosi lagi ke `ui/`, dan **rasio `PageShine` dikirim sebagai nama class, bukan angka** | Penerapan D43 pada halaman ketiga. `ResourceCard` (S10 + Development) dan `PageShine` (home + Development) pindah dari `components/home/` ke `components/ui/`. Kartunya berbeda di **satu baris** — S10 mencetak kategori dokumen di atas judul, Development mencetak tanggalnya — jadi baris itu jadi prop `meta`; `downloadLabel` ikut jadi prop supaya tiap halaman tetap memiliki kata-katanya sendiri dan `/development` tidak mengimpor `content/home/`. Untuk shine, kedua halaman memakai **berkas berbeda dengan tinggi berbeda** (1775 vs 2071) atas berkas beam yang sama, jadi `src` dan rasionya berjalan berpasangan: membaca satu berkas pada rasio yang lain menarik fade bawaannya lepas dari kaki halaman. Rasio itu dikirim sebagai **utility literal** (`aspect-[1920/2071]`), bukan angka yang di-interpolasi ke `style` — Tailwind mengekstrak utility dengan memindai teks sumber, jadi nilai yang dirakit saat runtime tidak pernah terlihat olehnya dan layer-nya akan runtuh jadi nol tinggi di build produksi sementara dev tetap benar | 2026-08-24 |
| D47 | Shine `/development` adalah **anak halaman**, bukan grup di kakinya | Di landing page shine membungkus dua blok terakhir dan footer dalam satu `div relative isolate` — susunan yang sudah sekali salah cat (D26) dan yang, sebagai efek samping, menaruh satu section CTA **di luar seluruh landmark halaman**. Halaman ini memakukan layer-nya ke dasar kotak halaman itu sendiri: `isolate` di root menahan `-z-10`-nya agar tidak jatuh ke belakang latar halaman, `<main>` duduk di atasnya dengan `z-10`, dan footer tercat di antara keduanya. Hasilnya sama persis di mata — Figma memulai artwork di `y:5388`, tepat di awal Federation Support Programs, dan mengakhirinya di 7459, kaki dokumen — tanpa satu pun blok konten keluar dari `<main>` | 2026-08-24 |
| D48 | Tombol submit kartu aplikasi **diekstrapolasi**; desain tidak menggambarnya | Cermin D28. Di footer, Figma menggambar kotak langganan tanpa `<input>` sama sekali dan itu dibangun jadi form sungguhan, karena kotak yang tidak bisa diketik lebih buruk daripada tidak ada. Di sini kebalikannya: `207:15160` menggambar dua field lalu berhenti — sebuah form tanpa cara mengirimkannya, yang rusak karena alasan yang sama. Tombolnya ditambahkan memakai chrome tombol bergaris halaman ini dan label kata kerja kartunya sendiri ("Apply for Support"), jadi yang dikarang hanya bentuknya, bukan kata-katanya. Submit-nya **menolak dengan terang** (B2), bukan menelan data federasi. Ditandai `TODO(design)` di `content/development/support.ts` | 2026-08-24 |
| D49 | Putaran roda S5 jadi **spring**, bukan kurva easing halaman | `EASE` dirancang untuk gerak yang **diikuti mata**: berangkat segera, mendarat lembut, terbaca satu gerakan menerus. Itu justru kebalikan dari roda pemilih, yang intinya track **ditangkap dan ditahan** di tiap notch — dengan tween, tiga stat terbaca menggeser, bukan mengklik. Ditukar `{ type: "spring", visualDuration: 0.18, bounce: 0.3 }`: kedatangannya 0,18s dan `bounce` menaruh satu overshoot ~5% satu slot di ujungnya — track lewat sedikit dari notch lalu ditarik kembali masuk. Recoil itulah keseluruhan efeknya; tanpa itu geraknya cuma cepat, dan cepat saja tetap terbaca menggeser. Ditulis `visualDuration`/`bounce` alih-alih `stiffness`/`damping` karena dua angka terakhir tidak menyatakan berapa lama geraknya, sedangkan timing di sini harus dinalar terhadap `HOLD` dan `TURN`. Dua konsekuensi yang tidak kelihatan dari nama spring-nya: (a) `TURN` berhenti berarti "lama transisi" dan jadi **anggaran** — spring tak punya ujung tetap, jadi angkanya harus melampaui *settle*-nya, bukan kedatangannya, supaya interval tak menyala dan rewind sambungan tak mendarat saat track masih bergerak; 0,9 → 0,5. (b) Cross-fade emas↔redup **tidak** ikut spring dan tetap tween 0,16s: `opacity` yang overshoot terpotong di 1 dan terbaca sebagai kedip, dan figur yang menganjal `scale`-nya sendiri bergoyang lepas dari track yang membawanya | 2026-08-24 |
| D50 | Arsip berita difilter lewat **URL**, dan **label tabnya datang dari feed** | Dua keputusan yang saling mengunci. (a) Tiap tab adalah `<a>` ke `?category=`, halaman dirender ulang di server, dan `getLatestNews` memfilter di sana — itu menahan seluruh section tetap Server Component (RULES §5), menjadikan arsip terfilter sebuah tautan yang bisa dikirim ke orang lain, dan menaruh filternya di tempat yang RULES §8 minta: endpoint asli menerima `?category=`, sedangkan island client yang menyaring feed sendiri harus mengunduh semua artikel yang pernah diarsipkan untuk menampilkan enam (D45). "View more" bekerja sama: `?show=` naik enam-enam dan section-nya mengambil ulang dengan limit lebih besar — cursor akan lebih baik melawan backend sungguhan, tapi limit yang tersedia hari ini, dan limit pun tetap API yang bekerja. Nilainya **divalidasi, bukan dipercaya**: `show` adalah yang bisa diketik orang asing di query string, dan yang tak berbatas adalah undangan meminta seluruh arsip sekaligus, jadi diplafon 60. (b) Figma menamai lima tab — All, DWF, Tournaments, Members, Development (`166:8377`) — sementara kategori feed adalah kosakata yang berbeda (Tournament, Governance, Development, Federation, Ranking, Officiating). Daftar desain akan mencetak tab yang memfilter ke nol sekaligus menyembunyikan kategori yang berisi artikel. **Tab yang menuju grid kosong lebih buruk daripada tab yang tidak digambar desainer**, jadi yang diambil dari desain adalah bentuknya dan kata-katanya dari `getNewsCategories()`. Hanya "All" yang copy, karena ia satu-satunya tab yang bukan kategori | 2026-08-24 |
| D51 | Press release dan publikasi memakai ulang **`ResourceDocument`**, bukan entitas baru | Sebuah press release *adalah* dokumen bertanggal dengan tipe dan ukuran berkas — persis yang sudah dilayani `getResources`, dan endpoint kedua akan berbeda dari yang ini hanya pada kata di kategorinya. Keduanya masuk sebagai kategori (`"Press Release"`, `"Publication"`) dan rak-raknya menyebut nama, **bukan** meminta jumlah: rak adalah kategori berisi sebanyak apa pun yang diarsipkan federasi, tidak seperti grid 2×2 S10 yang harus menyatakan jumlah karena empat dokumennya tidak berbagi rak (D45). Yang ditambahkan hanya satu field opsional, `coverImageUrl`, karena satu-satunya rak yang menggambar sampul adalah publikasi — mewajibkannya akan membatalkan setiap dokumen yang sudah diarsipkan tanpa sampul. Galeri media **tidak** ikut jalan ini dan jadi tipe sendiri (`GalleryItem`): ia meja foto, bukan daftar headline — tile tidak punya tanggal, kategori, maupun isi, dan satu foto yang sama bisa menerangi banyak berita atau tidak satu pun | 2026-08-24 |
| D52 | Tiga step tipografi generik ditambahkan; **`--text-label-sm` sengaja tidak memakai ulang `--text-news-card-sm`** | Halaman News menuntut tiga ukuran yang belum ada di skala generik D34: Inter Medium 18/26 berkapital untuk pill tab (`166:8379`), Inter Medium 16/24 untuk pill berkas (`168:8543`), dan Inter SemiBold 28/36 untuk judul kartu di grid (`163:8231`). Yang pertama **numerik identik** dengan `--text-news-card-sm` yang sudah ada — dan tetap dipisah, persis alasan yang sudah dicatat untuk `display-label` lawan `resource-title`: token itu dinamai menurut mosaik S8, dan meminjam nama section landing page ke halaman lain membuatnya berbohong. `--text-label-xs` dibuat token alih-alih `text-base` datar karena 16px adalah *cap* clamp-nya: keduanya sama di 1920, dan hanya token yang menjaga proporsi di monitor 2560 saat kartu di sekitarnya sudah ikut membesar. Slope ketiganya `cap/1920` empat angka (D25) | 2026-08-24 |
| D53 | Penanda daftar isi Terms **mengikuti pembaca**, dan **nomor klausa datang dari posisi, bukan dari string** | Dua cacat sumber yang harus ditangani berbeda. (a) Figma hanya bisa menggambar satu state, jadi ia mengecat klausa pertama sebagai aktif. Menurunkannya apa adanya memberi halaman penanda yang tidak pernah bergerak — lebih buruk daripada tanpa penanda, karena ia menyatakan "Anda di klausa 1" sepanjang dokumen 3553px. Dilacak dengan `IntersectionObserver`, bukan handler scroll: browser melaporkan perlintasannya sendiri di luar main thread, alih-alih halaman mengukur sembilan elemen tiap event. Pitanya sempit (`-120px` membersihkan navbar `fixed`, `-60%` di bawah) supaya tepat satu klausa jadi "yang sedang dibaca", dan bila pita sesaat kosong penandanya **menahan jawaban terakhir** alih-alih padam — penanda yang berkedip di sela lebih buruk daripada yang menunggu. State awalnya klausa pertama di kedua sisi hidrasi dan markup-nya tidak bercabang, jadi RULES §12 aman. (b) Figma mengetik kesembilan judul sebagai "1." — di badan (`174:11261` dst) maupun di daftar isi (`174:11230` dst). Itu artefak daftar bernomor, bukan sembilan klausa yang semuanya klausa satu, dan sekelas dengan empat press release bertanggal sama: dokumen yang seluruh section-nya "1." terbaca rusak. Nomor diambil dari posisi di array dan dirender dari sana di kedua tempat, jadi badan dan daftar isi tak mungkin berselisih | 2026-08-24 |
| D54 | Halaman Contact dibangun dari **satu kalimat desainer**, dan dua hal dipromosikan karena pemakai keduanya muncul | Kelanjutan D48 pada skala jauh lebih besar. D48 mengekstrapolasi sebuah tombol submit; ini mengekstrapolasi seluruh halaman. Yang menahannya tetap jujur adalah bahwa bagian-bagian yang **berisi** semuanya punya sumber: `intro` verbatim dari `174:11254`; kelima topik form adalah lima jenis pertanyaan yang disebut kalimat itu, dalam urutannya, dan **tidak ditambah** — menambah topik keenam berarti memutuskan apa lagi yang ditangani federasi; alamat emailnya milik klausa penutup Terms (`174:11543`); alamat posnya milik footer. Yang dikarang cuma susunan, judul blok, dan label field, semuanya ditandai `TODO(design)` dan dicatat R14. Dua promosi mengikuti aturan D32/D43 — **pemakai kedua, bukan tebakan bahwa akan ada**: `Field` milik `SupportForm` pindah ke `ui/FormField` tanpa berubah sedikit pun (plus varian `multiline`, karena pesan itu paragraf bukan baris), dan alamat pos pindah dari `content/footer.ts` ke `content/federation.ts` supaya halaman tidak mengimpor copy milik komponen lain — persis ketergantungan yang harus dibongkar D43. Email **tidak** ikut dipromosikan: desain memberi dua alamat berbeda, satu malformed dan dirender teks, satu well-formed dan dirender tautan, dan menyatukannya berarti memutuskan alamat mana yang sebenarnya dipakai federasi | 2026-08-24 |
| D55 | Halaman kedua akhirnya memindahkan **`SupportCard` dan chrome side-tab** ke `ui/`, tapi **bukan logikanya** | Penerapan D32/D43 yang keempat, dan yang paling bersih sejauh ini karena sumbernya benar-benar identik: kartu "Need Support?" Gallery (`173:10083`) sama kata per kata dengan milik Terms (`174:11252`), dan baris side-tab-nya sama piksel per piksel — bar emas 4px, hairline `#353535`, Bebas 32/40, padding yang sama. Keduanya naik: `ui/SupportCard` dengan copy-nya ke `content/support-card.ts` (ia milik komponen yang di-mount banyak halaman, seperti footer dan nav), dan `ui/SideTabs` sebagai `SideTabList` + `SideTab`. Yang **tidak** ikut naik adalah artinya: kolom Terms sebuah daftar isi yang melompat di dalam dokumen dan menandai posisi pembaca lewat `IntersectionObserver` (D53), sedangkan kolom Gallery sebuah filter yang menulis ulang halaman lewat `?event=`. Jadi yang dibagi rupanya, dan tiap halaman menyimpan gagasannya sendiri tentang baris mana yang "sekarang" — `SideTab` bahkan menerima `current` (`"page"` lawan `"true"`) karena keduanya menjawab pertanyaan `aria-current` yang berbeda. `ui/SideTabs` sengaja tanpa `"use client"` supaya kolom Terms (client, melacak scroll) dan kolom Gallery (server, state-nya di URL) sama-sama bisa memakainya | 2026-08-24 |
| D56 | Bentuk album galeri **diturunkan dari jumlah isinya**, bukan dari field layout | Figma menggambar tiga album sebagai collage 4×2 dan satu ("The Silent War") sebagai satu still 1292×726 dengan tombol play. Menambahkan `layout: "collage" | "feature"` ke `GalleryAlbum` sempat jadi pilihan jelas dan ditolak: itu backend yang memutuskan rupa halaman, padahal album yang sama tetap harus tersusun ulang di ponsel, dan begitu ada album kedua berisi satu foto, seseorang harus ingat menyetel field-nya. `items.length === 1` sudah menjawab pertanyaannya dan tidak bisa berselisih dengan isinya. Collage-nya sendiri **tidak diposisikan tangan**: empat kolom, dua baris, tile video `row-span-2`, dan auto-placement CSS menjatuhkan sisa fotonya persis ke sel yang digambar Figma. Satu hal desain yang **tidak** ditiru — collage-nya 1648 lebar melawan 1452 yang disediakan kolomnya, jadi di 1920 ia meluber ke kanan. Meluberkan **grid** berarti kolom keempatnya separuh tersembunyi selamanya, tidak seperti strip halaman News yang bisa didorong; jadi grid-nya dipaskan ke kolom — komposisi, gutter dan tinggi barisnya tetap milik desain, hanya lebar kolomnya yang lentur | 2026-08-24 |
| D57 | Halaman ketiga dan keempat mengangkat **cangkang halaman**, bukan cuma potongannya | Sampai sini yang dipromosikan selalu potongan kecil (kartu, baris tab, field). Privacy dan All News membuat empat halaman memakai bentuk yang sama, dan tiga hal naik sekaligus: `ui/PageHeader` (band header dengan tiga slot opsional — Back, tanggal, search — karena Terms punya Back+tanggal, Gallery punya tanggal+search, All News punya Back+search, dan band yang berbeda antar halaman tanpa alasan yang bisa disebut pembaca adalah cacat, bukan variasi); `ui/SideTabLayout` (dua kolom 468+1452, sidebar **kedua di source** dan ditarik dengan `order` supaya pembaca ponsel dan pembaca layar bertemu isinya dulu, bukan indeksnya); dan `components/legal/LegalDocument` — seluruh halaman legal minus navbar dan footer, sehingga `/terms` dan `/privacy` masing-masing tinggal copy plus satu komponen dan **tidak bisa lagi menyimpang** seperti dua salinan buatan tangan. Yang sengaja **tidak** ikut: header bergaya landing di About, Domino, Development, News dan Contact. Bentuknya judul-plus-intro, tidak satu pun pernah butuh Back atau tanggal, dan menulis ulang lima halaman jadi untuk berbagi komponen dengan tugas berbeda adalah risiko regresi tanpa imbalan (D32) | 2026-08-24 |
| D58 | **`?show=` di halaman News dicabut**; "View more" pergi ke `/news/all` | Mencabut sebagian D50. Waktu blok arsip dibangun, "View more" harus melakukan sesuatu dan tidak ada tujuan yang digambar desain, jadi ia menumbuhkan `?show=` enam-enam dengan plafon 60 — mekanisme yang dikarang, lengkap dengan validasi untuk angka yang bisa diketik orang asing di query string. `185:13184` ternyata **adalah** tujuan itu: sebuah layar bernama "All News", dua kolom, dengan tautan "Back" yang menunjuk balik ke `/news`. Jadi blok arsip menampilkan enam yang digambar desain dan tombolnya membuka halaman yang memang digambar untuknya. Satu mekanisme alih-alih dua, satu hal karangan berkurang, dan filternya ikut berjalan (`?category=` diteruskan) supaya membuka arsip dari grid terfilter tidak diam-diam membuang filternya. Sisa D50 tetap berlaku: tab masih tautan, filter masih di server, label tab masih dari feed — dan untuk ketiga kalinya, karena kosakata tab All News (dwf, tournament, membership, development) berbeda lagi dari kosakata feed | 2026-08-24 |
| D59 | Sumber desain pindah ke file **`(NEW)`**, dan pindahnya **membalik dua risiko sekaligus** | `fileKey` desain berganti dari `1Q8Ud3Iq0dSR0KXymurySI` ("Copy") ke `p1W8bEWU5w3cRYROFNQwKh` ("NEW"), diserahkan pengguna 2026-08-24. Bukan sekadar salinan: dua belas halaman kini duduk dalam **SECTION bernama**, sehingga layar bisa ditunjuk lewat namanya alih-alih ditelusuri dari teks `header` tiap frame seperti yang D33 paksa selama ini. Node layar yang sudah dibangun terbawa utuh — `1:2`, `69:22`, `119:4737`, `190:13600`, `156:7512`, `156:7154`, `174:11162`, `174:10759`, `176:11563` semuanya masih terbaca, jadi tidak ada dokumen di repo yang menunjuk node mati. Satu berubah nomor: layar All News `185:13184` (D58) tidak ada lagi, dan yang ada di section News adalah `366:16246` — ukuran, susunan dan tinggi 2745px identik. Yang **baru** digambar: seluruh halaman Tournaments (`366:17181`, sebelas blok, 1920×7972), yang berarti item nav "Tournaments" akhirnya punya tujuan; "Members" tetap `#` karena ia cuma wireframe (`385:18114`). Dua risiko berbalik arah dan keduanya dicatat ulang. **R12:** `119:4737` dulu mendeklarasikan 1920×6033 tapi berhenti menggambar di y=2180 (D42); sekarang ia 1920×5223 dan menggambar tuntas sampai footer — termasuk `277:15676` "The Rulebook", blok tab yang justru ditunda karena hi-fi-nya tidak ada. Dua blok yang dulu diekstrapolasi dari wireframe greyscale kini punya hi-fi sendiri (`359:15793`, `361:16085`), jadi yang sudah dibangun harus dicocokkan ulang, bukan dianggap selesai. **R14:** layar "Contact Us" ternyata ada — `176:11563`, judulnya terbaca di `176:11845` — dan ia **sudah ada di file lama** sebagai frame tanpa nama. Jadi D33 berlaku ke arah sebaliknya: mengidentifikasi layar dari isinya bisa gagal dengan **melewatkan** layar, bukan cuma dengan salah menunjuk, dan "desainer tidak menggambarnya" adalah kesimpulan yang jauh lebih berat daripada "belum ketemu" | 2026-08-24 |
| D60 | Halaman FAQ memakai **copy, bukan feed** — dan search-nya akhirnya benar-benar mencari | Tiga keputusan yang saling mengunci di satu halaman. (a) Sepuluh pertanyaannya tinggal di `content/faq/`, bukan lewat `client.ts`. FAQ adalah dokumen yang ditulis federasi seperti klausa legal, bukan arsip yang diisi terus seperti berita — merutekannya ke endpoint mock berarti menjanjikan respons `/faq` yang tidak akan dibangun siapa pun, persis alasan `/terms` tidak melakukannya. Konsekuensinya kedua filter duduk di tempat yang sama, URL dibaca di server, jadi `?category=` dan `?q=` berperilaku seperti `?event=` Gallery (D50) dan halaman tetap Server Component seluruhnya. (b) **Search-nya bekerja**, tidak seperti kotak identik di `/news` dan `/gallery` yang menolak dengan terang karena tidak ada endpoint dan tidak ada apa pun yang dimuat untuk dicocokkan (D28, B2). Di sini yang dicari adalah copy halaman itu sendiri, yang sudah di tangan — jadi ia `<form method="get">` polos ke `/faq`, cocok di server, hasilnya URL yang bisa dikirim, dan **jalan tanpa JavaScript sama sekali**. Tidak ada mekanisme baru yang dikarang: `?q=` adalah filter query string yang sama dengan `?category=`, bukan `?show=` yang dicabut D58. Pertanyaan **dan** jawaban ikut dicari, karena bold di tengah kalimat itu tipografi — sebuah frasa tidak boleh hilang dari pencarian gara-gara ditebalkan. (c) Tab hanya dicetak untuk laci yang berisi. Desain menamai lima (`173:9528` dst) sementara sepuluh pertanyaannya jatuh ke dua, jadi daftar harfiah akan mencetak tiga tab menuju kartu kosong — untuk ketiga kalinya, tab yang menuju kosong lebih buruk daripada tab yang tidak dicetak (D50). Ketiganya muncul sendiri begitu ada pertanyaan yang diarsipkan di sana | 2026-08-24 |
| D61 | Halaman Tournaments: **satu record untuk dua blok**, dua komponen halaman lain dipakai ulang, dan rail-nya scroller asli | Empat keputusan pada satu halaman. (a) Hero (`370:17251`) menulis "Caribbean Domino Open 2026" sementara band di bawahnya (`372:17318`) menulis "CARIBBEAN DOMINO OPEN 2024" — acara yang sama, dua tahun, tanggal Oktober 2026 di keduanya. Dua blok yang berselisih tentang acara apa yang sedang dibuka adalah cacat, bukan variasi, jadi keduanya membaca `getHighlightedTournament()` dan **tidak bisa** berselisih; tahunnya sendiri ikut tanggal, karena tanggal punya dua suara (mock `e1`, yang otomatis membetulkan S6 juga). (b) Band highlighted **bukan** `EventShowcase`. Komponen itu client karena satu hal — pager enam acara — dan blok ini tidak punya pager sama sekali; memakainya berarti membuat pager opsional, mengganti copy tombolnya, dan mengirim bundle client untuk tiga kolom statis. Garis D57, diterapkan lagi. (c) Yang **memang** dipakai ulang adalah dua hal yang benar-benar identik: kolase media halaman News (`MediaGallery`, kini menerima satu prop warna judul) dan kartu dokumen shelf pers, yang naik jadi `ui/DocumentCard` bersama `ui/DownloadPill` — pemakai kedua, bukan tebakan (D32/D43). (d) Dua rail-nya **scroller native**, bukan carousel transform: desain menggambar empat kartu berjajar dengan panah di atas dan scrollbar tangan di bawah, jadi baris itu benar-benar scroll — sentuhan dan trackpad dapat gestur yang sudah mereka harapkan, keyboard menjangkau tiap kartu dengan tab, dan panahnya jadi kemudahan di atasnya. Yang client cuma posisi scroller; kartunya tetap dirender server dan dioper sebagai `children` | 2026-08-24 |
| D62 | Acuan desain pindah ke file **"Updated"**; node lama **tidak** diverifikasi ulang | Pengguna mengganti file ke `xdogWlTYLSqwh2fBTmxPJi` pada 2026-08-25. Godaannya adalah menyisir ulang seluruh `docs/` dan memetakan setiap node ke file baru; itu ditolak karena dua alasan. Pertama, ia pekerjaan besar yang tidak menghasilkan apa pun yang bisa dilihat — sepuluh halaman yang sudah jadi tidak berubah karena angkanya berubah. Kedua, dan lebih penting: node lama **masih benar tentang file lama**, dan file lama masih ada. Yang salah bukan angkanya melainkan asumsi bahwa hanya ada satu file, jadi yang diperbaiki adalah asumsi itu — §5 menyatakan batasnya secara eksplisit (halaman sampai Gallery mengacu file lama, Members ke bawah file baru). Verifikasi ulang dilakukan saat sebuah halaman lama benar-benar disentuh, bukan sebelumnya. File baru menyelesaikan masalah lain secara gratis: tiap halaman kini SECTION bernama, jadi penelusuran header yang dipaksa D33 di halaman News dan Gallery tidak perlu lagi | 2026-08-25 |
| D63 | Kunci warna peta Members adalah **legend, bukan filter** — dan "Show All" dibuang | Figma menggambarnya sebagai strip pill dengan "Show All" terpilih, persis chrome navbar, yang membacanya sebagai kontrol. Tapi kelima puluh tujuh penanda **ter-bake di dalam satu SVG hasil ekspor** dengan warna tier-nya masing-masing (5 continent, 34 national, 11 regional, 7 club — dihitung dari artwork-nya sendiri), jadi tidak ada data penanda untuk difilter dan tidak akan ada sampai backend menyediakannya (B2). Dua jalan keluar ditolak: menyunting SVG-nya dengan tangan untuk menyisipkan kelas per tier akan pecah diam-diam saat desainer mengekspor ulang, dan mengarang koordinat penanda sendiri berarti mengarang geografi keanggotaan. Yang tersisa adalah D28: kontrol yang tidak bisa melakukan tugasnya tidak dikirim dengan rupa kontrol. Jadi tier disajikan sebagai apa yang **frame dalam desainnya sendiri** namai — `legend` — dan "Show All" dibuang, karena sebuah kunci tidak punya yang bisa ditampilkan atau disembunyikan. Callout "Jakarta, ID" tetap: ia satu contoh yang digambar sekali, bukan daftar | 2026-08-25 |
| D64 | Halaman Members **tidak memakai header band**, dan judulnya tidak lewat `SharpeningHeadline` | Tujuh halaman dalam sebelumnya membuka dengan band yang sama, dan konsistensi itu dijaga keras — "lima halaman satu situs yang membuka berbeda tanpa alasan yang bisa disebut pembaca adalah cacat". Di sini desain membuka dengan hero 1080px penuh: judul rata tengah, pill emas, empat angka di kakinya. Itu diikuti, karena alasannya bisa disebut: band adalah pembuka untuk halaman yang berupa dokumen atau arsip, sedangkan halaman ini sebuah ajakan, dan hero-nya bekerja seperti hero landing page. Konsekuensi yang menguatkan pembacaan itu: Figma **tidak** memberi judul ini `blur(7.5px)` (`401:19069`), satu-satunya judul halaman di file yang tidak punya — jadi tidak ada yang perlu dijernihkan dan `SharpeningHeadline` tidak dipakai. Tiga komponen justru dipakai ulang apa adanya karena desainnya memang menggambar benda yang sama: `GoldCta` (pill `401:19075` identik sampai stroke conic 3px dan glow-nya), `SilverCta`, dan `PageShine` | 2026-08-25 |
| D65 | Ritme vertikal hero Members **diukur, bukan dialirkan** — dan glow diposisikan terhadap kotak **ekspor**, bukan kotak node | Figma menaruh keempat bagiannya absolut: konten di y:214, pill di 604, angka di 805. Kolom ber-gap rata tidak menghasilkan itu — ia menengahkan semuanya, dan akibatnya glow berakhir di belakang elemen yang salah alih-alih melengkung tepat di atas pill. Jaraknya kini ditulis sebagai `vw` terhadap kanvas 1920 (`pt-[11.15vw]`, `mt-[8.39vw]`, `mt-[6.72vw]`), jadi blok itu tepat di lebar desain dan tetap proporsional di kedua sisinya. Bagian yang tidak kelihatan sampai diukur: Figma melaporkan layer glow 1920×435 di y:480, tapi **berkasnya keluar 2120×635** — blur 50px meluber 100px ke setiap sisi. Memposisikannya dengan angka node berarti 100px terlalu rendah dan 200px terlalu sempit, jadi selisihnya dikembalikan (`w-[110.42%]`, `top-[35.2%]`). Pelajaran umumnya: untuk aset ber-blur, angka Figma menggambarkan bentuknya, bukan berkasnya | 2026-08-25 |
| D66 | Angka yang menghitung naik jadi **primitif `motion/CountUp`**, dan **server tetap merender angka finalnya** | Diminta pengguna untuk statistik hero. Tiga hal ditetapkan sekali di satu tempat, bukan diulang tiap pemakai. (a) **Urutan hidrasi.** Render pertama di klien mengeluarkan angka final, sama dengan server — hidrasi membandingkan teks, dan komponen yang mulai dari "0" sementara server mengirim "142" membuat React membuang subtree-nya. Reset ke nol terjadi di frame `requestAnimationFrame` pertama, setelah hidrasi cocok. Efek sampingnya justru benar: pembaca tanpa JavaScript melihat angka sungguhan, yang memang fallback yang tepat untuk angka yang berarti sesuatu. Harganya satu-dua frame angka final sebelum hitungan mulai; alternatifnya layout effect, yang diperingatkan Next saat SSR. (b) **Bentuk angkanya dipertahankan, bukan ditebak.** "850+" menyimpan plusnya dan "1.420" menyimpan pemisahnya — dan pemisah hanya dianggap pengelompok kalau ia benar-benar mengelompok tiga-tiga, karena itulah yang menentukan hitungannya berhenti di 1420 atau di 1,42. Nilai yang tidak terbaca dicetak apa adanya tanpa animasi. (c) **`requestAnimationFrame`, bukan `animate()`.** Ini teks, bukan transform, dan animasi nilai motion dibentuk untuk menggerakkan style — diuji di node, `animate(0, target, {onUpdate})` menyelesaikan diri tanpa pernah melewatkan nilai antara. Kurvanya tetap kurva halaman ini, disampel dari `EASE` lewat `cubicBezier` yang diekspor motion. `prefers-reduced-motion` **tidak pernah** mereset: angkanya diam di tempat server menaruhnya, yaitu animasi yang runtuh ke keadaan akhirnya persis seperti minta RULES §12 | 2026-08-25 |
| D67 | Halaman Domino **dibangun ulang dari hi-fi**, dan copy hasil tebakan wireframe ternyata **tidak perlu diubah sama sekali** | File "Updated" menggambar layar Domino lengkap (5223px, dari 6033px yang dulu berhenti menggambar di y=2180). Tiga akibat. (a) **R12 ditutup**: blok "Official Game Rules" kini ada sebagai "The Rulebook" (`277:15676`). Desain menggambar enam tab dan isi satu; strip tabnya dirender dari data seperti kategori arsip berita (D50), jadi hari ini satu set aturan berarti satu tab — dan dengan satu tab strip-nya tidak digambar, karena tab bar bertab tunggal adalah chrome yang berpura-pura jadi kontrol, dan lima tab yang tidak membuka apa pun adalah no-op diam yang dilarang D28. (b) **Dua blok yang dulu dibangun dari wireframe diturunkan ulang dari hi-fi**: Referee Guidelines (`359:15793`) berubah bentuk total — satu dokumen di kartu gelap kiri alih-alih tiga dalam daftar, empat tugas dua-dua alih-alih satu kolom, dua regulasi jadi tombol kaca — dan FAQ (`361:16085`) berubah dari section putih penuh jadi kartu putih di atas gradien. (c) Yang paling berguna diketahui: **tidak satu kata pun berubah**. Intro dan keempat tugas wasit persis sama antara wireframe dan hi-fi, dan ketiga dokumen yang dibutuhkan sudah ada di mock dengan judul yang tepat. Jadi D42 — membangun dari wireframe saat hi-fi berhenti — terbukti aman untuk copy dan hanya berisiko untuk tata letak, yang memang bagian yang ditandai sebagai tebakan | 2026-08-25 |

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
| ~~R3~~ | ~~`feature-hq-building.png` 9.2 MB (4096×2458)~~ | — | **Selesai 2026-08-21.** File dihapus dari repo; S4 memakai `feature-hq-composite.png` 1920×1080 (1.1 MB) dari desainer, yang sekaligus sudah membakar ketiga wash section-nya |
| R4 | Kontrak API meleset dari response asli | Rework di fase 2 | Isolasi di `lib/api/`; minta contoh response ke tim backend sedini mungkin |
| ~~R5~~ | ~~Penempatan `decor-light-beam.png` & `partners/` (global vs home) belum pasti~~ | — | **Selesai 2026-08-22, lihat D31.** `decor-light-beam.png` ternyata aset mati — nol referensi, dimensinya identik `decor-shine.svg` (1920×1775) yang benar-benar dipakai `PageShine`, jadi ia kembaran raster yang kalah pilih dan dihapus bersama `card-dwf2026-badge.png` (panel `EventCard` digambar CSS). Status `partners/` masih menunggu pertanyaan terbuka #2 |
| ~~R6~~ | ~~Runtime Bun di Vercel masih public beta~~ | — | **Terbukti 2026-08-20, lihat D9.** `bun --bun next build` gagal (`Expected CommonJS module to have a function wrapper`). Build & start dipindah ke Node; `dev` tetap `--bun` |
| R7 | Parallax berat merusak target performa (G4/G6), terutama di ponsel kelas bawah | Skor Lighthouse turun, scroll patah-patah | Batasi 3–4 layer per viewport; kompres aset lebih dulu; kurangi/nonaktifkan layer di mobile; uji di perangkat nyata |
| R8 | Parallax memicu motion sickness | Masalah aksesibilitas | `prefers-reduced-motion` mematikan parallax **penuh**, bukan memperlambat |
| R9 | Aset di Figma belum dipetakan ke file lokal — `imageRef` desain belum dicocokkan dengan file di `assets/` | Salah pasang gambar saat slicing | Cocokkan per section saat pengerjaan; unduh via MCP bila ada yang belum tersedia. **S2 & S4 selesai dipetakan** (lihat tabel di bawah) |
| R10 | **Enam belas** aset melewati ambang 1 MB RULES §7. Home: `event-trophy-hand.png` 2.4 MB (1792×2400, slot tampil 402×720), `hero-domino-tile.png` dan `feature-hq-composite.png` ~1.1 MB. About tahap 1 (2026-08-22): `global/globe-tile.png` 1.9 MB (1960×3865) — dulu `about/vision-globe-tile.png`, dipindah saat halaman Domino memakai berkas yang sama (D43) —, `authority-leadership-group.png` 1.8 MB (2400×1252), `pillars-olympic-rings.png` 1.7 MB (2340×1560), `heritage-card-04.png` 1.4 MB, `heritage-card-01.png` 1.1 MB. About tahap 2: `board-portrait-02.png` 1.9 MB, `-04.png` 1.4 MB, `-03.png` 1.1 MB — ketiganya tampil di slot 540×700. Domino: `band-table-match.png` **2.8 MB** (2340×1560), aset terbesar di repo dan satu-satunya yang `priority`. Development (2026-08-24): `grassroots-plaza.png` 2.2 MB, `band-classroom-session.png` 1.5 MB, `grassroots-mobile-academy.png` 1.4 MB, `grassroots-rural-kit.png` 1.1 MB. News (2026-08-24) menambah **lima** lagi, jadi totalnya **dua puluh satu** — lalu Tournaments (2026-08-24) menambah **empat**, jadi **dua puluh lima**: `hero-trophy-hand.png` 2.3 MB (LCP halaman itu) dan tiga poster kartu `poster-card-*.png` ~1.7 MB masing-masing, di luar daftar di bawah ini: `featured-giant-tiles.png` **4.9 MB** (2722×1536) — aset terbesar di repo, melewati `band-table-match.png`, dan satu-satunya di halaman ini yang `priority` — lalu `news-tile-run-player.png` 1.6 MB, `news-player-at-table.png` 1.3 MB, `gallery-team-portrait.png` 1.2 MB, `news-podium-ceremony.png` 1.2 MB | Skor Lighthouse turun (G4), scroll parallax patah di ponsel (R7) | **Sengaja ditunda sampai setelah presentasi** — diputuskan pengguna 2026-08-22, dan keputusan itu berlaku untuk aset About, Domino dan Development juga. Dua yang paling mendesak sekarang keduanya `priority` tepat di bawah fold, jadi keduanya jadi LCP halamannya masing-masing: `band-table-match.png` di `/domino` dan `band-classroom-session.png` di `/development`. `featured-giant-tiles.png` menjadi yang ketiga dan yang terberat: ia LCP `/news` dan satu-satunya aset 4 MB+ di repo. Tiga aset grassroots tidak `priority` dan tampil di slot ~573×764, jadi next/image sudah menurunkan ukurannya — yang tersisa adalah biaya penyimpanan repo, bukan biaya muat. Menggantikan R3, yang menutup kasus lama tapi tidak mencatat yang masih terbuka |
| R11 | `board-portrait-02.png` adalah foto stok seorang **tokoh publik nyata yang mudah dikenali**, dipakai sebagai wakil presiden DWF fiktif | Masalah hak citra bila terbit apa adanya — orang itu tidak pernah menyetujui asosiasi dengan federasi ini | Sudah ditandai `TODO(design)` di `mock/index.ts`, dan `alt`-nya sengaja tidak menyebut nama siapa pun. Perlu keputusan pemilik repo: ganti dengan potret yang benar-benar stok, atau tunggu foto pengurus asli. **Harus selesai sebelum publikasi**, bukan sebelum presentasi |
| R12 | Blok "Official Game Rules" halaman Domino **belum dibangun** — halaman berjalan lima blok, sedangkan hi-fi `119:4737` kini menggambar delapan (D42, D59) | Halaman Domino tidak pernah menyatakan aturan mainnya sendiri; pembaca yang datang mencari cara bermain hanya menemukan format, regulasi dan FAQ. Sejak D59 dampaknya bertambah: dua blok yang sudah dibangun (regulations, FAQ) diekstrapolasi dari wireframe greyscale waktu hi-fi-nya belum ada, dan sekarang hi-fi-nya ada — keduanya bisa menyimpang dari desain tanpa ada yang tahu | **Tidak lagi menunggu desain.** File `(NEW)` menggambar blok itu sebagai `277:15676` "The Rulebook" — judul gradien emas, baris tab (`288:15756`), kartu isi (`289:15776`) — beserta `359:15793` dan `361:16085` untuk dua blok yang dulu ditebak. Yang tersisa murni implementasi: bangun blok Rulebook di antara Format Split dan Regulations (urutan hi-fi: y=2180), lalu cocokkan dua blok ekstrapolasi dengan hi-fi-nya. Copy tab masih perlu dibaca ulang dari `288:15756` — keluhan lama bahwa lima dari tujuh tab wireframe berlabel "SCORING" duplikat berlaku untuk **wireframe**, dan hi-fi belum diperiksa per tab **SELESAI 2026-08-25.** File desain "Updated" menggambar bloknya (`277:15676`, "The Rulebook") — kedua hal yang ditunggu akhirnya datang. Tab-nya masih belum sepenuhnya bernama ("rules 4/5/6"), jadi strip tabnya dirender dari data: satu set aturan punya copy, jadi satu tab — dan dengan satu tab strip-nya tidak digambar sama sekali (D67) |
| R13 | **Aset foto halaman News bukan foto domino.** Lima dari enam gambar grid dan seluruh tile galeri adalah foto pers **45th FIDE Chess Olympiad (Budapest 2024)**, FIDE Freestyle Chess World Championship 2026 dan turnamen catur lain — orang sungguhan yang bisa dikenali (tim nasional India dan Uzbekistan, upacara medali, pemain di papan), lengkap dengan branding FIDE, nama sponsor dan papan skor yang terbaca. Sampul kartu publikasi bukan dokumen DWF sama sekali: ia halaman hasil pindaian milik **Assistance League® National Resource Development Committee, Resource Library, Juli 2012**, berisi petunjuk memindai dokumen dan surat ketetapan IRS. Hanya dua aset yang on-topic — band featured (`featured-giant-tiles.png`) dan `news-tile-run-player.png`. **Sejak halaman Gallery (2026-08-24) foto-foto itu dipakai dua halaman**: ketujuhnya pindah ke `assets/global/` karena `/gallery` menyusun ulang enam di antaranya jadi collage per event, dan ketiga album turnamennya berbagi set foto yang sama persis — itu pun desainnya (`156:7243`, `156:7276`, `156:7303` merujuk `imageRef` yang sama). Satu-satunya aset galeri yang on-topic justru yang paling baru, `gallery/film-global-final-arena.png`: arena hitam-putih bertuliskan "DOMINO GLOBAL FINAL" — tapi ia cuma 512×279 dan dipasang di slot 1292×726, jadi ia akan terlihat lunak | Tiga hal sekaligus, dan yang ketiga paling serius: (a) olahraganya salah di halaman berita federasi domino; (b) merek dan logo sponsor pihak ketiga ikut tayang; (c) **headline DWF karangan menempel pada foto atlet sungguhan** — kartu-kartunya dilabeli "New training centers approved for asia-pacific region" dan sejenisnya. Sekelas R11, tapi berlipat: di sana satu potret, di sini seluruh perbendaharaan foto satu halaman | **Dipasang apa adanya atas keputusan pengguna, 2026-08-24**, setelah tiga pilihan diajukan (pakai ulang aset domino yang sudah di repo / pasang apa adanya / slot kosong menunggu desain). Yang bisa dilakukan tanpa membatalkan keputusan itu sudah dilakukan: nama berkas menyebut **isi foto yang sebenarnya**, bukan berita yang dilekatkan padanya, dan `imageAlt` menggambarkan yang terlihat **tanpa menyebut nama, negara, atau ajang** siapa pun. Seperti R11: **harus selesai sebelum publikasi**, bukan sebelum presentasi — dan penyelesaiannya keputusan pemilik repo, bukan implementasi |
| R14 | **Halaman `/contact` dibangun tanpa layar desainnya, dan layar itu ternyata ada.** Ia ditulis dari satu kalimat di kartu "Need Support?" sidebar Terms (`174:11252`) karena pencarian menyimpulkan desain tidak pernah menggambar halaman kontak (D54). File `(NEW)` menunjukkan sebaliknya: `176:11563`, section "Contact US", judul "Contact Us" di `176:11845` — dan frame itu **sudah ada di file lama**, hanya tanpa nama (D59) | Susunan halaman, judul tiap blok, dan seluruh field form-nya ekstrapolasi, dan sekarang ada desain yang bisa membantahnya baris per baris. Bentuk yang sudah terbaca berbeda dari yang dibangun: desain memakai cangkang side-tab (`ui/SideTabLayout`) dengan kolom kiri berisi kanal kontak federasi plus kartu Need Support, dan satu kartu putih 1452px di kanan — bukan susunan blok bertumpuk | Turun dari "menunggu desainer" jadi **menunggu implementasi**: cocokkan `/contact` dengan `176:11563` sebelum publikasi, dan cabut `TODO(design)` di `content/contact/index.ts` yang terbukti punya sumber. Catatan proses yang lebih penting dari halamannya sendiri ada di D59. Dua layar lain masih digambar dan belum dibangun — FAQ `173:9459` dan Tournaments `366:17181`; keduanya menunggu implementasi, jadi tidak masuk daftar risiko | **Diperbarui 2026-08-25:** file desain baru memuat section **`Contact Us` (`361:16242`)** — layar yang dulu tidak ada kini ada. Risiko ini belum bisa ditutup begitu saja: halaman yang berjalan dibangun dari satu kalimat, dan hampir pasti tidak berbentuk seperti layar itu. Langkah berikutnya membandingkan `/contact` dengan `361:16242` dan menyesuaikan, bukan menandainya selesai |
| R15 | **Pager halaman FAQ tidak dibangun** (`174:10695`) — desain menggambar tiga halaman bernomor, repo punya sepuluh pertanyaan, yaitu isi halaman pertamanya saja (D60) | Pembaca melihat sepuluh pertanyaan dan tidak ada yang memberi tahu bahwa desainer membayangkan sekitar tiga puluh. Bila jumlahnya benar-benar tumbuh dan pager tetap tidak ada, kartu ini akan memanjang tanpa batas | **Menunggu copy, bukan implementasi.** Membangunnya sekarang berarti tombol "2" dan "3" yang membuka kartu kosong — kontrol yang berbohong, persis yang D28 tolak, dan alasan yang sama membuat tab Rulebook Domino tidak dibangun di atas isi yang belum ditetapkan (D42). Sembilan dari sepuluh jawaban juga masih placeholder bertanda `TODO(copy)` di `content/faq/items.ts` — hanya `174:10662` yang ditulis desain — jadi yang dibutuhkan halaman ini memang copy. Begitu ada, pager-nya komponen lima menit dan paging-nya `?page=` di server seperti dua filter yang sudah ada |
| R16 | **Champions Hall menamai empat tokoh publik nyata sebagai juara federasi ini.** Desain (`381:17639`) mengisi keempat kartunya dengan foto orang sungguhan yang mudah dikenali — juara catur dunia di depan papan lengkap dengan logo sponsor di kemejanya, dan seorang mantan pesepakbola di atas panggung — lalu mengetik **nama asli mereka** di bawahnya sebagai juara 2024 dan 2023 DWF | Sekelas R11 dan R13 tapi berbeda jenis, dan lebih berat: di sana judul karangan menempel pada atlet yang tidak disebut namanya, di sini **seluruh kartu adalah klaim identitas**. Menayangkannya berarti menyatakan bahwa orang bernama itu memenangkan gelar yang tidak pernah ada — pernyataan palsu tentang orang yang bisa dikenali, bukan aset placeholder yang menunggu diganti | **Fotonya dipasang atas keputusan pemilik repo, 2026-08-24** — diambil setelah risikonya diajukan, dengan alasan ini prototipe dan aset desain masuk apa adanya, seperti R13. **Namanya tidak ikut.** Yang membedakan kartu ini dari R13 adalah klaim identitasnya: nama asli di bawah wajah asli menyatakan orang itu memenangkan gelar yang tidak ada, sedangkan nama placeholder membiarkan fotonya jadi foto. Jadi yang tayang adalah foto desain dengan nama dalam register yang dipakai tabel hasil desain sendiri — dua di antaranya (Marcus Johnson, Alicia Brown) memang tulisan desainer. `portraitAlt` menggambarkan yang terlihat **tanpa menyebut nama, negara, atau ajang** (praktik R13). Berkasnya diperkecil ke 1400px sisi panjang saat masuk; aslinya sampai 14 MB untuk kartu yang tampil 540. `Champion.portraitUrl` tetap opsional, jadi kartu tanpa potret jatuh ke panel gradien. **Harus selesai sebelum publikasi**, bukan sebelum presentasi: perlu foto dan nama juara asli |

Pemetaan `imageRef` → file lokal, diisi per section:

| Section | Node | `imageRef` (8 char) | File lokal | Dimensi |
|---|---|---|---|---|
| S2 | `24:929` | `e3f63834` | `global/decor-rock-top.png` | 888×361 |
| S2 | `24:930` | `f621e13a` | `global/decor-rock-bottom.png` | 970×403 |
| S2 | `24:933` | `19ebcbf4` | `home/hero-domino-tile.png` | 1882×2267 |
| S4 | `31:1086` | `1008bddc` | `global/feature-hq-composite.png` | 1920×1080 |
| About HQ | `117:3847` | `1008bddc` | `global/feature-hq-composite.png` | 1920×1080 |
| Domino band | `131:4832` | `91c171e2` | `domino/band-table-match.png` | 2340×1560 |
| Domino format | `131:4834`, `207:15558` | `8c88e9f6` | `global/globe-tile.png` | 1960×3865 |

Aset batu dipakai lintas halaman, jadi berada di `global/`; ukurannya kira-kira
1× ukuran tampil sedangkan referensi Figma diekspor 2×.

`feature-hq-composite.png` **bukan** ekspor mentah `imageRef` itu: file dari
desainer sudah komposit satu frame penuh — foto plus vignette `31:1089`,
penggelapan `31:1103`, dan fade `37:1848` — sedangkan `imageRef`-nya hanya
lapisan fotonya (2226×1335.6, digeser ke `-153,-164`). Karena itu S4 tidak
menggambar wash apa pun di CSS, dan karena itu pula namanya berakhiran
`-composite` (D31).

Dua panel format Domino memakai satu `imageRef` yang sama, ditempatkan di
`x625` (panel perak) dan `x−255` (panel emas) — dalam koordinat section keduanya
jatuh di titik yang sama (80 + 625 = 705, 960 − 255 = 705). Jadi itu **satu figur
yang membelah jahitan**, masing-masing panel memotong bagiannya sendiri, bukan
dua gambar. Berkasnya sama pula dengan tile Vision di halaman About, karena itu
ia pindah ke `global/` alih-alih diunduh kedua kali (D43).

Section HQ halaman About memakai `imageRef` yang **sama persis**, dengan geometri
lapisan foto yang sama pula, jadi filenya pindah dari `home/` ke `global/`
(RULES §2) alih-alih diunduh kedua kali dengan nama lain. Wash yang digambar
Figma di atasnya (`117:3848`, `117:3849`, `117:3855`) juga tidak direproduksi —
alasannya identik dengan S4: ketiganya sudah terbakar di ekspor, dan
menggambarnya lagi akan menggelapkan fotonya dua kali.

---

## 10. Pertanyaan terbuka

1. Base URL API dan contoh response — kapan tersedia dari tim backend?
2. Apakah strip partner juga muncul di halaman lain, atau hanya landing page?
3. Domain produksi dan target hosting (Vercel?)
4. Sumber konten berita — hardcode, CMS, atau API?
5. Apakah ada brand guideline resmi (font, warna) di luar file Figma?
6. Alamat tujuan delapan logo partner — sampai ada, marknya sengaja bukan
   tautan (D21).
7. Alamat email footer di desain (`community@dwf-org`) tidak punya TLD. Sengaja
   atau salah ketik? Selama belum dipastikan ia dirender teks, bukan `mailto:`
   (D28).
8. Endpoint newsletter — field-nya sudah form sungguhan dan tinggal menukar
   `onSubmit` begitu `POST`-nya ada (D28, blocker B2).
