# Figma — halaman Home

Salinan angka desain halaman depan, supaya slicing tidak perlu menarik ulang
data Figma tiap kali. **Bukan pengganti file desainnya** — lihat §"Batas
dokumen ini" sebelum memakai apa pun di sini sebagai kebenaran akhir.

## File

| | |
|---|---|
| fileKey | `oY2v2wq359rIRK4KaItmxc` |
| Nama | Domino World Federation Landing Page |
| Kanvas | `Finalization` (`0:1`) + `Playground` (`414:610`) |
| Section | `Homepage` (`366:16741`) |
| **Layar home** | **`1:2`**, 1920 × 9183, fill `#0E0E0E` |
| URL | `figma.com/design/oY2v2wq359rIRK4KaItmxc/…?node-id=1-2` |

PRD §5 mencatat kenapa file ini yang jadi acuan, dan bahwa
`xdogWlTYLSqwh2fBTmxPJi` ("Updated") serta `VHKnrwJJW8Se8g1IUyELsY`
("REVISION") isinya sama untuk halaman ini.

**Frame Figma itu layarnya.** 1920 × 1080 adalah satu viewport, bukan pita —
tiap section digambar setinggi layar penuh, dan apa pun yang digantung di kaki
sebuah section digambar duduk di fold. Itu yang jadi lantai `min(100dvh,75vw)`
di `Hero` dan `FeatureHq`.

## Peta section

`y` relatif terhadap layar `1:2`. Kolom terakhir komponen yang membangunnya.

| y | Node | Ukuran | Isi | Komponen |
|---:|---|---|---|---|
| 0 | `42:2143` | 1920 × hug | navbar | `layout/Navbar` |
| 0 | `22:789` | 1920 × 1080 | hero "Dominoes Without Borders" | `home/Hero` |
| 768 | `24:1025` | 498 × 292 | kartu upcoming match | `home/Countdown` |
| 1080 | `31:1085` | 1920 × 1080 | foto HQ + "Ready to Join?" | `home/FeatureHq` |
| 2164 | `37:1874` | 1920 × 1080 | roda statistik | `home/Stats` |
| 3244 | `561:13281` | 1920 × 1080 | Featured Tournament (putih) | `home/FeaturedEvent` |
| 4324 | `53:3067` | 1920 × 1080 | berita | `home/News` |
| 5404 | `56:4541` | 1920 × 444 | Official Partners | `home/Partners` |
| 5848 | `56:4554` | 1920 × hug | resources | `home/Resources` |
| 6484 | `81:690` | 1920 × 1080 | FAQ | `home/Faq` |
| 6484 | `56:4970` | 1920 × 2695 | shine (SVG, di belakang FAQ→footer) | `ui/PageShine` |
| 7564 | `56:4698` | 1920 × 1080 | CTA "Bring Your Nation" | `home/Join` |
| 8644 | `56:5159` | 1920 × hug | footer | `layout/Footer` |

## Navbar (`42:2143`)

Padding `36 80 16`. Logo `42:2144` 155,69 × 60.

Pil `42:2180`: `rgba(0,0,0,.4)`, blur 10, radius 12, padding 4. Item
`12 20`, radius 8; aktif `rgba(255,255,255,.12)`, sisanya `opacity .5`. Label
Inter Medium **18/26**, `0.04em`, UPPER.

**Tiga status, dan section `613:22936` memberi anotasinya:**

| Node | Fill | Anotasi |
|---|---|---|
| `613:23054` | tanpa fill | "at first section" |
| `613:22937` | `rgba(14,14,14,.7)` + blur 10 | "then move to the next section" |
| `613:22993` | sama + submenu terbuka | "hover dropdown" |

Submenu `613:23049`: absolut, 330 lebar, rata kiri dengan induknya, 5px di
bawah pil. `rgba(0,0,0,.4)` + blur 10, radius 12, padding 4, gap 4. Item
padding **12** di semua sisi, radius 8; hover/aktif `rgba(255,255,255,.12)`,
sisanya `opacity .5`. Isi: `FEDERATION MEMBERS`, `PLAYER MEMBERSHIP`. Item
induknya (`613:23038`) tumbuh ikon `vuesax/bold/arrow-down` 24 × 24 dengan gap 8.

## Hero (`22:789`) — 1920 × 1080

| Elemen | Node | Posisi | Catatan |
|---|---|---|---|
| tagline | `2:3` | x677 y381, 479 × 29 | Inter SemiBold 24, `0.24em`, gradien 90° putih→#999→putih **selebar node** |
| headline | `2:4` | x268 y460, 1385 × 109 | Bebas 156, gradien sama, **selebar node** |
| CTA emas | `31:1117` | x790 y630, 340 × 72 | radius 48, radial `#F1C977`→`#A57F40`, stroke conic 3px, glow |
| misi | `31:1106` | x80 y785, 433 × 78 | Inter 18/26 |
| akuntabilitas | `673:1414` | x1525 y785, 315 × 52 | Inter 18/26, rata kanan |
| Official Rules | `673:1415` | x1548 y869, 292 × 64 | `rgba(255,255,255,.2)`, radius 8 |
| batu atas | `24:929` | x914 y0, 871,5 × 352,5 | blur 4 |
| batu bawah | `24:930` | x162 y690, 944 × 390 | blur 6,5 |
| ubin domino | `24:933` | x677 y176, 585,04 × 636,46 | blur 2, `objectFit: cover` |
| vignette kaki | `22:791` | y710, 1920 × 370 | radial `51% 0%`, transparan 47% → `#0E0E0E` |

Jarak yang bukan koordinat: CTA→baris copy **83**, sisa di bawah elemen
terakhir **147**, teks akuntabilitas→tombolnya **32**.

## Kartu upcoming match (`24:1025`) — 498 × 292

Kolom, padding 20, gap 16, radius **24 24 0 0**, isian gradien
`rgba(255,255,255,.12)`→transparan, dua stroke 3px, blur latar 4.

- Baris kepala `24:1026` (**57** tinggi): bendera 48 lingkaran, gap 16, kolom
  gap 12 — judul Inter SemiBold 20/24 `0.12em` UPPER, lalu
  `lokasi • tanggal` Inter 16/24 opacity .6 dengan gap 12.
- Kotak timer `24:1029` (**99** tinggi = 12 + 45 + 8 + 22 + 12): baris,
  padding 12, gap 12, `rgba(14,14,14,.5)`, radius 12. Digit Bebas **64 tanpa
  line height** — auto Bebas setinggi capsnya, jadi kotaknya 45. Label Inter
  14/22 opacity .6. Pemisah `:` Bebas 40.
- Tombol `24:1042`: penuh, tinggi 64, radius 8, gradien perak 90°, Bebas 32/40.

## Ready to Join (`31:1085`) — 1920 × 1080

Foto `31:1086` (2226 × 1335,6 di x−153 y−164) dengan tiga wash yang **sudah
dibakar** ke `feature-hq-composite.png`: vignette atas `31:1089`, penggelap
turun `31:1103`, fade ke `#0E0E0E` di kaki `37:1848`.

Kolom teks `31:1105` di **x503,5 y342, lebar 913**, gap 44, blur 2:

| Node | Isi |
|---|---|
| `31:1094` | Bebas **95/95**, gradien emas 90°, `READY TO JOIN?\nSTART Your journey with dwf` |
| `31:1101` | Inter 20/28 putih, FILL kolomnya |
| `31:1489` | 223 × 64, `rgba(255,255,255,.2)`, radius 8, Bebas 32/40, `EXPLORE DWF ID` |

## Roda statistik (`37:1874`) — 1920 × 1080

Baris, padding `20 80`, `space-between`.

**Kiri `702:1497`** (lebar 783,5, gap 36):

- Rail `702:1487`: kolom lebar **24**, gap **32**, `padding-top 60`,
  `justify-center`, tinggi mengikuti. Empat titik; yang aktif (**kedua**)
  ellipse **24** gradien `135deg #FFE0A1 → #BA8D30`, sisanya **16** putih
  `opacity .12`. Padding 60 itulah yang mendudukkan titik kedua sebaris dengan
  slot fokus (pusat titik 302 lawan label 300).
- Label `55:3239`: kolom gap **228**, Inter Medium **40/48** —
  `Continents` (blur 3,5, .6), `National Federation` (.8, tajam),
  `Regional` (blur 3,5, .6).

**Kanan `50:2927`** (kolom, rata kanan, gap 92): `6` (Bebas 200, gradien putih
ke transparan, blur 4) · `142` (Bebas 200, gradien emas 90°) · `1.420` (Bebas
**175**, blur 10). Garis pemisah `47:2654`/`47:2656`: 591 × 4, gradien
transparan→putih, opacity .4. Sepasang lagi (`56:5979`, `56:5977`) 591 × 8 di
`opacity 0` — artefak tata letak, tidak merender.

Urutan array = urutan gambar = urutan baca: Continents → Member Federation →
Regional → Annual Event. Frame yang digambar Figma (Continents di atas National
Federation di atas Regional, titik kedua emas) adalah **notch 1**, bukan keadaan
diam — ia tampil persis begitu saat pembaca sampai ke sana.

## Batas dokumen ini

- Hanya layar `1:2`. Halaman lain tidak tercakup.
- Angka di sini **hasil pembacaan**, dan sebagiannya diukur dari ekspor PNG
  karena Figma melaporkan frame hug-height tanpa dimensi (tinggi 57 dan 99 di
  kartu countdown, misalnya). Frame ber-fill mengekspor kotak sebenarnya; frame
  tanpa fill mengekspor ink-nya — jangan campur keduanya.
- Section Partners, Resources, News, FAQ, Join dan footer baru terdaftar di
  peta, isinya belum diturunkan ke sini.
- Kalau desainnya berubah, **dokumen ini yang basi**, bukan Figma. Perbarui di
  sini begitu sebuah section ditarik ulang.
