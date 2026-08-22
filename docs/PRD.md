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
| ~~R3~~ | ~~`feature-hq-building.png` 9.2 MB (4096×2458)~~ | — | **Selesai 2026-08-21.** File dihapus dari repo; S4 memakai `hq.png` 1920×1080 (1.1 MB) dari desainer, yang sekaligus sudah membakar ketiga wash section-nya |
| R4 | Kontrak API meleset dari response asli | Rework di fase 2 | Isolasi di `lib/api/`; minta contoh response ke tim backend sedini mungkin |
| R5 | Penempatan `decor-light-beam.png` & `partners/` (global vs home) belum pasti | Refactor path kecil | `shine` terkonfirmasi hanya dipakai sekali di landing (Y 6826) → tetap di `home/`. Status `partners/` menunggu keputusan halaman lain (pertanyaan terbuka #2) |
| R9 | Aset di Figma belum dipetakan ke file lokal — `imageRef` desain belum dicocokkan dengan file di `assets/` | Salah pasang gambar saat slicing | Cocokkan per section saat pengerjaan; unduh via MCP bila ada yang belum tersedia. **S2 & S4 selesai dipetakan** (lihat tabel di bawah) |

Pemetaan `imageRef` → file lokal, diisi per section:

| Section | Node | `imageRef` (8 char) | File lokal | Dimensi |
|---|---|---|---|---|
| S2 | `24:929` | `e3f63834` | `global/decor-rock-top.png` | 888×361 |
| S2 | `24:930` | `f621e13a` | `global/decor-rock-bottom.png` | 970×403 |
| S2 | `24:933` | `19ebcbf4` | `home/hero-domino-tile.png` | 1882×2267 |
| S4 | `31:1086` | `1008bddc` | `home/hq.png` | 1920×1080 |

Aset batu dipakai lintas halaman, jadi berada di `global/`; ukurannya kira-kira
1× ukuran tampil sedangkan referensi Figma diekspor 2×.

`hq.png` **bukan** ekspor mentah `imageRef` itu: file dari desainer sudah
komposit satu frame penuh — foto plus vignette `31:1089`, penggelapan `31:1103`,
dan fade `37:1848` — sedangkan `imageRef`-nya hanya lapisan fotonya (2226×1335.6,
digeser ke `-153,-164`). Karena itu S4 tidak menggambar wash apa pun di CSS.
| ~~R6~~ | ~~Runtime Bun di Vercel masih public beta~~ | — | **Terbukti 2026-08-20, lihat D9.** `bun --bun next build` gagal (`Expected CommonJS module to have a function wrapper`). Build & start dipindah ke Node; `dev` tetap `--bun` |
| R7 | Parallax berat merusak target performa (G4/G6), terutama di ponsel kelas bawah | Skor Lighthouse turun, scroll patah-patah | Batasi 3–4 layer per viewport; kompres aset lebih dulu; kurangi/nonaktifkan layer di mobile; uji di perangkat nyata |
| R8 | Parallax memicu motion sickness | Masalah aksesibilitas | `prefers-reduced-motion` mematikan parallax **penuh**, bukan memperlambat |

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
