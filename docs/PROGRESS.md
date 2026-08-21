# Progress — DWF Website

**Terakhir diperbarui:** 2026-08-21

Legenda: `[ ]` belum · `[~]` berjalan · `[x]` selesai · `[!]` terblokir

---

## Ringkasan

| Fase | Status | Keterangan |
|---|---|---|
| 0 — Persiapan aset | `[x]` | Selesai |
| 1 — Scaffold project | `[x]` | Selesai — build, lint, typecheck lolos |
| 2 — Slicing landing page | `[ ]` | 4/14 section — S1–S4 selesai, lanjut S5 |
| 3 — Integrasi API | `[ ]` | Menunggu backend |
| 4 — Portal | `[ ]` | Fase berikutnya |

---

## Blocker aktif

| ID | Blocker | Menghambat | Tindakan |
|---|---|---|---|
| B2 | API belum tersedia (dikerjakan tim lain) | Fase 3 | Pakai mock; minta contoh response |

Selesai: ~~B1 MCP Figma 403~~ — tersambung 2026-08-20.
~~B3 `feature-hq-building.png` 8.8 MB~~ — beres 2026-08-21: file 9.2 MB dihapus
dari repo, S4 memakai `hq.png` 1920×1080 dari desainer (lihat catatan S4).

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

## Fase 1 — Scaffold project `[x]`

- [x] `bunx create-next-app@latest --use-bun` — TypeScript, Tailwind, App Router
- [x] Script `package.json` — `dev` pakai `--bun`; `build`/`start` di Node (D9)
- [x] Inisialisasi git + `.gitignore` (abaikan `package-lock.json`, `yarn.lock`,
      `pnpm-lock.yaml`)
- [x] Struktur folder sesuai `RULES.md`
- [x] Pindahkan `assets/` → `public/assets/` (25 file)
- [x] `bun add motion` — terpasang 13.1.1
- [x] Font: **Bebas Neue** + **Inter** via `next/font` — variabel `--font-bebas`
      / `--font-inter` (jangan `--font-display`/`--font-sans`, bentrok namespace
      `@theme`)
- [x] Token di `@theme` (`src/app/globals.css`) — Tailwind v4 CSS-first,
      **tanpa** `tailwind.config.ts`. Isi sesuai `DESIGN-TOKENS.md` §8
- [x] Komponen `ParallaxLayer` reusable
- [x] Path alias `@/`
- [x] `lib/api/types.ts` — kontrak sementara
- [x] `lib/api/client.ts` — wrapper + mock
- [x] `lib/utils/cn.ts` — `clsx` + `tailwind-merge`
- [ ] Prettier — ESLint sudah jalan, formatter belum dipasang

### Hasil verifikasi

| Perintah | Hasil |
|---|---|
| `bunx next build` | ✅ lolos, 2 route statis |
| `bun run typecheck` | ✅ bersih |
| `bun run lint` | ✅ bersih |
| `bun run dev` (`--bun`) | ✅ HTTP 200, kedua font ter-load |

**Catatan:** `globals.css` ada di `src/app/`, bukan `src/styles/` — mengikuti
letak bawaan `create-next-app` supaya import relatifnya tetap sederhana.
RULES §2 menyebut `styles/`; folder itu dipakai nanti bila ada CSS di luar token.

---

## Fase 2 — Slicing landing page `[ ]` — 4/14

Dikerjakan **per section**, berurutan sesuai posisi Y. Tiap section dianggap
selesai bila lolos checklist RULES §15.

| # | Section | Node | Status | Catatan |
|---|---|---|---|---|
| S1 | Navbar | `42:2143` | `[x]` | Overlay `fixed`, transparan; glass ada di pill & burger — lihat catatan |
| S2 | Hero | `22:789` | `[x]` | 3 layer parallax + animasi entrance |
| S3 | Countdown | `24:1025` | `[x]` | Kartu glass menimpa hero — lihat catatan |
| S4 | Feature HQ | `31:1085` | `[x]` | Parallax scroll pertama + entrance blur — lihat catatan |
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

**Catatan S1.** Di Figma navbar berada di `y:0` menimpa hero, bukan menempati
band sendiri. Awalnya diterjemahkan jadi `absolute` — dan itu keliru: `absolute`
mengikat bar ke `y:0` **dokumen**, jadi ia ikut tergulung bersama hero dan sudah
hilang seluruhnya (logo sekalian) pada scroll 150px. Terukur `position: absolute`
dengan `headerTopInViewport` mencapai −946. `fixed` memberi tampilan istirahat
yang persis sama sambil membuatnya ikut turun.

Barnya **transparan sampai bawah**, disengaja. Glass-nya sudah ada di isi bar —
pill menu dan burger memakai `bg-black/40` plus blur sendiri — jadi panel kedua
di belakangnya menggandakan efek dan mencetak pita keras melintasi artwork.
Sempat dicoba varian "condensed" (`bg-black/55` + blur 10px setelah 48px scroll)
dan dibatalkan karena alasan itu. Konsekuensinya `NavShell` tidak butuh hook
apa pun dan tetap Server Component: `fixed` itu class, bukan scroll listener.

Kekhawatiran lama "S4 dan seterusnya berlatar putih jadi teks putih akan hilang"
ternyata tidak berlaku untuk S4 — `hq.png` gelap. Kalau nanti ada section
berlatar terang di belakang bar, yang dibutuhkan varian gelap untuk pill dan
burger, bukan panel untuk seluruh header.

Sembilan menu pada 18px tidak muat di bawah ~1536px, jadi pill diringkas jadi
panel disclosure di bawah `xl`. Ukuran teks turun ke 15px di `xl`, kembali 18px
sesuai desain di `2xl`.

Terverifikasi 360/768/1440/1920: tanpa scroll horizontal, panel mobile berisi
9 item dan tetap di dalam viewport. **Sisa dicek:** ikon burger saat terbuka
tampak satu garis, belum jelas bug transform atau artefak screenshot.

Breakpoint pill **diukur, bukan dipilih dari daftar bawaan**. Sembilan item
adalah beban tetap yang tidak bisa menyusut: pada 15px barisnya 1058px dan
header baru menyediakan segitu di **1400px**, sedangkan 18px sesuai desain
melebarkannya jadi 1283px yang butuh **1600px**. Sebelumnya pill muncul di `xl`
(1280) — kurang 26px, jadi "About Us" pecah dua baris — lalu naik ke 18px di
`2xl` (1536) yang **memecahnya lagi** setelah sempat muat: melebarkan window
justru memperburuk. Dua angka itu jadi token `--breakpoint-menu` dan
`--breakpoint-menu-lg`. `whitespace-nowrap` dipasang sebagai jaring pengaman —
kalau suatu saat tetap tidak muat (label baru, item tambahan, font scale
pengguna) ia meluber terlihat, bukan diam-diam wrap dan menaikkan tinggi header
20px. Terukur ulang 1280→1920: tidak ada wrap, tinggi header tetap 112px.

**Catatan S2.** Stage (`absolute inset-0`) **adalah** ruang koordinatnya: tiap
layer memakai persentase terhadap section. Dari `lg` section membawa rasio
desain sendiri, jadi persentasenya angka Figma apa adanya; di bawah `lg` kotak
yang sama berbentuk potret dan tiap layer membawa set angka kedua.

Satu frame di-scale (`w-[190%]` → `md:135%` → `lg:100%`) dicoba lebih dulu dan
**itu justru sumber kekacauan di HP**: kotak 1920 × 1040 cuma ~210px tinggi di
layar 390px, jadi seluruh komposisi memampat jadi satu pita di bawah navbar dan
menyisakan celah abu-abu mati antara headline dan CTA — seperempat layar tanpa
isi. Melebarkan frame untuk mengisi tinggi itu juga tidak bisa, karena tiap
layer diukur sebagai pecahan frame: tile ikut membesar dengan laju yang sama
dan menelan headline yang mestinya ia lewati. Jadi HP mendapat susunan sendiri
atas tiga layer yang sama, tetap memakai diagonal desain — rock kanan-atas,
tile menembus tengah, rock kiri-bawah — disebar ke seluruh tinggi, bukan
ditumpuk dalam satu pita. Rock bawah sengaja diletakkan menembus celah
headline→CTA tadi.

Ukuran layer di HP tidak bisa ikut pecahan Figma: rock di 45% kotak potret cuma
serpih kecil mengambang, sementara di 1920 pecahan yang sama adalah bentangan
lebar. Diukur ke viewport (rock 70%/78%, tile 30%) sehingga bobotnya sama dan
tepi luarnya keluar layar persis seperti desain keluar frame. Tile ditahan di
**30% viewport** — porsi yang sama dengan di 1920 — dan tepi bawahnya berhenti
di dalam baris pertama headline, jadi ia melintasi "WITHOUT" dan meninggalkan
baris kedua bersih. Terukur per baris dengan `Range.getClientRects()`: 45–49%
di baris satu, **0%** di baris dua.

Vignette bawah `lg`-only dan itu disengaja: ia memudar ke `--color-bg`, warna
yang benar hanya di tempat vignette desain berada. Di HP section masih di tengah
gradient pada kakinya, jadi fade yang sama terbaca sebagai pita gelap — dan tidak
ada yang perlu di-*ground* di sana karena rock berhenti jauh sebelum tepi bawah.

Overhang kiri-kanan rock memang sengaja dan dikurung `overflow-hidden` —
`scrollWidth == clientWidth` di 360/390/768, jadi bukan bug meski terdeteksi
"overflow" oleh probe.

Tile **di depan** headline, sesuai urutan child Figma. Sempat tidak: stage-nya
`z-auto`, yang **bukan** stacking context, jadi `z-30` tile dan `z-0` headline
sama-sama diadu langsung ke section dan headline menang karena lebih akhir di
DOM. Diperbaiki dengan `z-10` di stage; `isolate` di section dipasang bersamanya
supaya `z-60` blok CTA tetap kalah dari `z-50` navbar di konteks root.

**Tinggi section: `h-[max(840px,54.17vw)]`, bukan `aspect`.** 54,17vw itu rasio
desain (1040/1920), jadi di 1920 section tepat 1040px dan semua persentase di
dalamnya angka Figma. `max()` memberi lantai, karena rasio saja membuat window
lebih sempit menghasilkan hero lebih pendek (780px di 1440, 693px di 1280)
sementara isinya tidak menyusut sama sekali: CTA tetap 72px dan dua baris copy
~132px. Isi berhenti muat di bawah ~1480px — persis tempat tombol mulai menimpa
"WITHOUT" (terukur 7px di 1440, 26px di 1280). Tiap pixel tinggi membeli 0,56
celah (headline di 0,44H, blok menggantung di bawah), jadi 840 menuntaskannya.

Ditulis sebagai **height**, bukan `aspect-[1920/1040] min-h-[840px]` — itu
percobaan pertama dan sebuah jebakan: `aspect-ratio` berlaku dua arah, jadi
lantainya berbalik lewat rasio dan memaksa section **1551px lebar**; seluruh
halaman scroll ke samping di tiap lebar di bawah itu (`scrollWidth` 1551 pada
viewport 1280). Height tidak bisa mendorong width.

Padding blok CTA di `lg` juga ikut proporsional (`gap-[3.33vw]`,
`pb-[5.6vw]` = 64 dan 108 dibagi 1920). Sebelumnya px tetap: blok itu 373px di
**semua** lebar — 36% hero di 1920 tapi 48% di 1440.

**Warning dev server & hydration.** `quality={90}` pada tile perlu didaftarkan
di `next.config.ts` (`images.qualities: [75, 90]`) — Next 16 hanya melayani
angka yang terdaftar, selebihnya warning dan turun ke 75. Kedua rock diberi
`priority` karena Next menandainya sebagai elemen LCP; justru karena dekoratif
ia **lebih** perlu di-preload, sebab animasi entrance jalan sejak mount entah
bitmap-nya sudah tiba atau belum — tanpa itu rock memainkan 1,6 detik retreat
sebagai kotak kosong lalu muncul telat.

Log server yang sama memunculkan hal yang lebih serius: **hydration failure**
saat `prefers-reduced-motion: reduce`. `useReducedMotion()` bernilai `null` di
server dan `true` di client, dan tiga komponen memakainya untuk **mencabangkan
markup** — `SofteningImage` mengirim dua salinan gambar dari server tapi hanya
mau satu di client, `GoldCta` mengirim span sheen lalu menghilangkannya,
`ParallaxLayer` menukar isi `style`. React tidak bisa menambal beda pohon, jadi
seluruh hero dibuang dan dirender ulang di client. Diperbaiki dengan merender
pohon yang sama di kedua sisi dan hanya menolkan **nilai** geraknya:
rentang `useTransform` jadi `0%` dan transisi jadi `duration: 0`. Terukur di
1440 — travel rock **16,3px** saat normal, **0px** saat reduce, resting state
identik di kedua mode, dan console bersih. Konvensinya ditulis di RULES §12.

Parallax berbasis scroll tidak berguna di sini — hero satu-satunya
section saat itu, tidak ada ruang scroll (terukur: `y` tetap 0 di tiap fraksi),
jadi dipakai animasi entrance sekali jalan. Blur **tidak** dianimasikan
(RULES §12): `SofteningImage` menumpuk dua salinan ber-blur statis dan hanya
menyilangkan `opacity`.

`hero-domino-tile.svg` **tidak dipakai** — isinya PNG 1882 × 2267 yang sama
persis dalam base64, jadi tidak menambah ketajaman, ukurannya 1.4 MB, dan
sebagai SVG ia melewati optimiser Next. Dipakai PNG-nya dengan `quality={90}`.

Urutan entrance: dua rock menyusut ke `0.82` selama 1.6s dengan origin di sisi
luar masing-masing supaya tepi luarnya tetap terpaku, lalu tile masuk pada
`delay: 0.5` — **menimpa** gerak rock, bukan mengantre setelahnya. Tile juga
menegak saat masuk (`rotate: -16° → -4°`). Miring bawaan aset terukur 26,3° dari
vertikal (analisis principal-axis pada PNG-nya) dan node Figma `24:933` tidak
menambah rotasi sama sekali, jadi `0` = kemiringan mentah aset, bukan tegak.

**Catatan S3.** Di Figma kartu ada di `x:711, y:785` menimpa hero (tinggi 1040)
dan menjulur ~150px melewati batas bawahnya. Karena hero memakai
`overflow-hidden` untuk mengurung rock, kartu tidak bisa tinggal di dalamnya —
penempatan dilakukan di `page.tsx` lewat `-mt-[13.3%]`. Margin persen dihitung
terhadap **lebar**, dan tinggi hero terkunci ke lebar, jadi posisinya tetap di
semua lebar.

Overlap-nya menunggu **`menu` (1400)**, bukan `lg`. Menarik kartu ke atas
menaruhnya *menembus* baris terakhir hero, tempat Figma menempel copy mission
mepet kiri dan blok accountability mepet kanan. Kartu itu 498px tetap dan
di-center, jadi baris tersebut butuh 80 + 288 + 498 + 316 + 80 — baru muat di
1290px. Di bawah itu kartu menggigit ujung "…and setting fair global standards"
di kiri dan tombol "Official Rules" di kanan (terukur 41px dan 5px di 1440/1280
sebelum mission dibatasi; 105px dan 133px di 1024). Copy mission juga dipersempit
ke 288px khusus di rentang `menu`→`menu-lg`, karena hanya di situ kartu berada
sebaris dengannya. Di bawah `menu` kartu mengalir biasa mengikuti hero.

Stroke 3px-nya dua gradient bertumpuk. Sempat dipasang sebagai background
wrapper dengan fill di-inset — **keliru**: fill kartu semi-transparan, jadi
gradient menembus ke seluruh permukaan dan meninggalkan garis diagonal.
Diperbaiki dengan pseudo-element `mask-composite` (`.countdown-stroke`), sesuai
catatan DESIGN-TOKENS §5.

Tanggal desain "Sun, Aug 17, 2026" tidak dipakai apa adanya: 17 Agustus 2026
jatuh hari **Senin**, dan tanggalnya sudah lewat. Hari diturunkan dari tanggal
lewat `Intl` dengan locale + timezone dikunci ke UTC — tanpa itu SSR dan
hydration memakai zona berbeda dan React melempar mismatch. Digit countdown
sengaja kosong (`--`) di render pertama karena server tidak tahu jam pengunjung;
tingginya sudah dipesan jadi tidak ada layout shift. Timer berdetak per menit,
diselaraskan ke pergantian menit — bukan per detik.

**Catatan S4.** `hq.png` (1920×1080, dari desainer) adalah komposit desain
sendiri: **ketiga wash sudah dibakar ke dalamnya** — vignette atas (`31:1089`),
penggelapan yang memikul teks (`31:1103`), dan fade ke warna halaman di kaki
(`37:1848`). Terukur, baris paling atas dan paling bawahnya persis `#0e0e0e` =
`--color-bg`, jadi ia bertemu latar halaman tanpa sambungan dan **tidak** diberi
overlay CSS apa pun. Menggambar ulang wash itu di atasnya akan menggelapkan
gambar dua kali.

Bakenya juga alasan gambar ini bukan `object-cover` pada crop sembarang: fade-nya
terlukis di posisi tetap, jadi memotongnya di atas atau bawah mengembalikan tepi
keras. Section membawa rasio 16:9 gambarnya sendiri dari `lg` ke atas; crop baru
mengetat di layar sempit tempat kehilangan tidak terhindarkan.

**Sambungan keras yang dilaporkan** datang dari versi pertama, yang meniru cara
S2 dan memasang vignette `radial-gradient(ellipse 130% 100% …)`. Mengunci radius
vertikal ke tinggi kotak mendorong tepi bawah ke stop `100%` yang **penuh opak**
— wash-nya solid persis di tempat ia terpotong, jadi garis melintang selebar
halaman. Sempat diperbaiki ke `circle farthest-corner` (spec Figma sendiri, benar
karena kotak 1920×370 membuat radius ~1047px sehingga tepi bawah jatuh di dalam
stop `transparent 47%`), lalu seluruh overlay dibuang begitu `hq.png` dipakai.

Ini section pertama yang punya ruang scroll di atasnya, jadi berbeda dari hero ia
memakai **parallax scroll sungguhan** — S2 tidak, di sana belum ada yang bisa
di-scroll. Satu layer bergerak (`speed={8}`, lebih lambat dari apa pun di hero
karena ia latar), jauh di bawah plafon 3–4 layer RULES §12.

Gambar masuk dari `1.14` menyusut ke `1`, dan **scale itu naik di dalam** wrapper
parallax, bukan di sampingnya: elemen luar memiliki `y` dari posisi scroll,
elemen dalam memiliki `scale` sekali jalan, jadi keduanya tidak pernah menulis ke
properti transform yang sama. Skalanya tidak pernah turun di bawah `1` supaya
tepi fade bawaan gambar tidak pernah tertarik masuk ke frame di tengah animasi.

Teks naik dari bawah sambil menajam, dikerjakan komponen baru `Reveal` —
`whileInView`, bukan animasi saat mount seperti hero. Section di bawah lipatan
yang mulai saat mount sudah selesai bergerak sebelum ada yang melihatnya;
`whileInView` membelanjakan entrance-nya saat section dibaca.

Entrance-nya **mengulang**: `once` default `false`, jadi scroll melewati section
lalu kembali memutar animasinya lagi. Section ini satu viewport penuh gambar
dengan headline empat kata — tempat pembaca menggulung balik, dan entrance sekali
jalan membuat kunjungan kedua datar. Arah baliknya diberi timing sendiri
(`RESET_DURATION` 0.3s, `easeOut`) karena reset bukan bagian pertunjukan: ia
hanya perlu selesai sebelum pembaca sampai lagi. Karena itu transition-nya
ditempel **di dalam** tiap target (`TargetAndTransition` menerima key
`transition`), bukan di prop `transition` yang berlaku untuk kedua arah.
Terverifikasi di 1440: tersembunyi di atas (`opacity 0`, `y 48`) → tampil saat
di-scroll (`1`, `0`) → **reset** saat menjauh → **berputar lagi** saat kembali.

Blur **tidak**
dianimasikan (RULES §12): sama seperti `SofteningImage`, dua salinan ber-blur
statis disilangkan opacity-nya, salinan buram `aria-hidden` dan salinan tajam
yang memikul teks asli sekaligus menentukan tinggi wrapper.

Reduced-motion menempuh jalur RULES §12 sejak awal — hanya `duration` yang
dinolkan, pohonnya identik di server dan client. Terverifikasi 360/768/1440/1920:
tanpa scroll horizontal, console bersih (tidak ada hydration failure), dan
opacity ketiga salinan buram `[0, 0, 0]` setelah animasi tuntas — tidak ada
salinan yang tertinggal buram.

Headline Bebas 95/95 (`31:1094`) berada di antara `display-sm` (76) dan
`display-md` (126), jadi ia diberi step sendiri `--text-display-feature`
ketimbang dibulatkan ke tetangganya. Lantai `2rem`-nya ditentukan pemenggalan
baris: di atas ~34px baris terpanjang berhenti muat di layar 360px.

Copy desain punya satu typo yang diperbaiki: "…international
federationrecognized for the sport…" — dua kata menyatu di tempat baris patah di
mock. Spasinya dikembalikan.

**Catatan animasi (lintas section).** Kurva, durasi, dan jarak antar langkah
sekarang tinggal di `src/lib/utils/motion.ts` — `EASE`, `DURATION` (1.4s),
`STAGGER` (0.16s) — supaya "samakan rasanya" jadi satu perubahan berkas, bukan
per-section. S2 dan S4 sama-sama menariknya dari sana.

Keluhan "kurang smooth, terlalu cepat" ternyata **soal bentuk kurva, bukan
durasi**. Kurva awal `[0.22, 1, 0.36, 1]` (expo-out) di-sample secara numerik:
ia menempuh **40% perjalanan dalam 10% pertama durasi dan 96% saat setengah
jalan**, dengan kecepatan puncak **4.5×** rata-ratanya. Artinya memanjangkan
`duration` tidak melembutkannya sama sekali — bagian yang terlihat tetap sama
mendadak, yang bertambah hanya waktu mati di ujung; mata membaca lonjakan itu
sebagai sentakan. Tujuh kurva dibandingkan; yang dipakai `[0.25, 0.6, 0.35, 1]`
punya puncak terendah (**2.46×** rata-rata), 24% di 10% dan 87% di tengah. Tetap
ease-*out*, bukan in-out: varian in-out menganggur di seperempat pertama (baru
5% perjalanan pada 25% durasi) dan itu terbaca sebagai lag untuk gerakan yang
dipicu scroll pembaca sendiri.

Copy S2 **sengaja diam**. Entrance hero adalah artwork yang merakit dirinya saat
load, dan itu saja — kata-katanya adalah hasil yang dituju layer bergerak, jadi
sudah di tempatnya sebelum batu mulai mundur. `Reveal` sempat dipasang di
tagline/headline/CTA dan dicabut kembali: section ini ada di layar saat load,
jadi entrance berbasis scroll entah langsung menyala (menambah entrance kedua
yang bersaing dengan entrance layer) atau menunggu scroll yang sudah tidak
menyisakan apa pun untuk diungkap.

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
| 2026-08-20 | Gaya parallax dikonfirmasi; aturan layer ditulis di RULES §12 (D7, D8) |
| 2026-08-20 | MCP Figma tersambung; 14 section terverifikasi (PRD §4) |
| 2026-08-20 | Design token diekstrak dari Figma → `docs/DESIGN-TOKENS.md` |
| 2026-08-20 | Fase 1 selesai: scaffold Next 16.3.1 + Tailwind v4 + Bun, commit awal |
| 2026-08-20 | R6 terbukti: `build` gagal di runtime Bun → pindah ke Node (D9) |
| 2026-08-20 | Commit dilarang mencantumkan atribusi AI (D10, RULES §14) |
| 2026-08-20 | Komentar kode wajib bahasa Inggris (RULES §4); seluruh `src/` diterjemahkan |
| 2026-08-20 | S1 Navbar selesai — overlay, bukan sticky (alasan di Fase 2) |
| 2026-08-21 | S2 Hero selesai — entrance sekali jalan (tidak ada ruang scroll), `SofteningImage` menggantikan animasi blur |
| 2026-08-21 | S3 Countdown selesai — kartu menimpa hero via `page.tsx`, stroke gradient pakai `mask-composite` |
| 2026-08-21 | S1 breakpoint menu diukur ulang → token `--breakpoint-menu` (1400) & `--breakpoint-menu-lg` (1600); panel mobile `bg-black/95` |
| 2026-08-21 | S2 tile diperbaiki ke depan headline (`z-auto` bukan stacking context); `isolate` di section |
| 2026-08-21 | S2 mobile disusun ulang — tiap layer punya koordinat sendiri, frame ter-scale dibuang |
| 2026-08-21 | S2 desktop 1024–1600 diperbaiki: tinggi `h-[max(840px,54.17vw)]`, padding blok CTA jadi vw, overlap kartu mulai di `menu` |
| 2026-08-21 | `images.qualities: [75, 90]` di `next.config.ts`; kedua rock diberi `priority` (warning LCP) |
| 2026-08-21 | Hydration failure saat reduced-motion diperbaiki — cabang markup diganti nilai gerak yang dinolkan; konvensi ditulis di RULES §12 |
| 2026-08-21 | B3 beres — `feature-hq-building.png` 9.2 MB dihapus dari repo; S4 memakai `hq.png` 1920×1080 dari desainer |
| 2026-08-21 | S4 Feature HQ selesai — parallax scroll pertama, komponen `Reveal` (entrance saat masuk viewport + blur cross-fade) |
| 2026-08-21 | Sambungan keras di kaki S3→S4 diperbaiki: vignette CSS dibuang, wash sudah ter-bake di `hq.png` |
| 2026-08-21 | `Reveal` mengulang saat scroll balik (`once` default `false`), arah reset diberi timing sendiri |
| 2026-08-21 | Token gerak dipusatkan di `lib/utils/motion.ts`; kurva diganti `[0.25, 0.6, 0.35, 1]` setelah expo-out diukur front-loaded (D11) |
| 2026-08-21 | Navbar jadi `fixed` — `absolute` terbukti ikut tergulung dan hilang di 150px — dan tetap transparan sampai bawah (D12) |
