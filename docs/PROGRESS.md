# Progress — DWF Website

**Terakhir diperbarui:** 2026-08-22

Legenda: `[ ]` belum · `[~]` berjalan · `[x]` selesai · `[!]` terblokir

---

## Ringkasan

| Fase | Status | Keterangan |
|---|---|---|
| 0 — Persiapan aset | `[x]` | Selesai |
| 1 — Scaffold project | `[x]` | Selesai — build, lint, typecheck lolos |
| 2 — Slicing landing page | `[~]` | 14/14 section selesai; sisa checklist "setelah semua section" |
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
- [x] Prettier — belum jadi dependency; dijalankan lewat
      `bunx prettier --no-semi --write <file>`. Repo **tanpa titik koma** di
      akhir baris; `docs/` tidak diformat Prettier
- [x] Lint: `bun run lint` (script-nya `eslint` polos). **Jangan**
      `next lint --dir` — flag itu sudah tidak valid di Next 16

### Hasil verifikasi

| Perintah | Hasil |
|---|---|
| `bunx next build` | ✅ lolos, 2 route statis (diulang 2026-08-22 setelah S14) |
| `bun run typecheck` | ✅ bersih |
| `bun run lint` | ✅ bersih — 0 error, 0 warning (2026-08-22) |
| `bunx prettier --check "src/**/*.{ts,tsx,css}"` | ✅ seluruh berkas sesuai |
| `bun run dev` (`--bun`) | ✅ HTTP 200, kedua font ter-load |

**Catatan:** `globals.css` ada di `src/app/`, bukan `src/styles/` — mengikuti
letak bawaan `create-next-app` supaya import relatifnya tetap sederhana.
RULES §2 menyebut `styles/`; folder itu dipakai nanti bila ada CSS di luar token.

---

## Fase 2 — Slicing landing page `[~]` — 14/14 section

Dikerjakan **per section**, berurutan sesuai posisi Y. Tiap section dianggap
selesai bila lolos checklist RULES §15.

| # | Section | Node | Status | Catatan |
|---|---|---|---|---|
| S1 | Navbar | `42:2143` | `[x]` | Overlay `fixed`, transparan; glass ada di pill & burger — lihat catatan |
| S2 | Hero | `22:789` | `[x]` | 3 layer parallax + animasi entrance |
| S3 | Countdown | `24:1025` | `[x]` | Kartu glass menimpa hero — lihat catatan |
| S4 | Feature HQ | `31:1085` | `[x]` | Parallax scroll pertama + entrance blur — lihat catatan |
| S5 | Stats | `37:1874` | `[x]` | Roda angka berputar sendiri — lihat catatan |
| S6 | Featured Event | `52:3027` | `[x]` | Latar putih, pager 6 event — lihat catatan |
| S7 | Intro berita | `53:3067` | `[x]` | Foto naik saat scroll, kalimat keluar dari blur |
| S8 | Mosaik berita | `54:3157` | `[x]` | Marquee 7 slot, masuk ke S7 — lihat catatan |
| S9 | Official Partners | `56:4541` | `[x]` | 8 logo opacity 25%, strip berjalan — lihat catatan |
| S10 | Resource Library | `56:4554` | `[x]` | 4 kartu, grid 2×2 mulai `menu-lg` — lihat catatan |
| S11 | FAQ | `81:690` | `[x]` | Accordion satu terbuka; kartu putih — lihat catatan |
| S12 | Overlay shine | `56:4970` | `[x]` | Dekoratif, `ui/PageShine`, anchor `foot` — lihat catatan |
| S13 | CTA akhir | `56:4698` | `[x]` | Headline + prosa + pil perak `SilverCta` — lihat catatan |
| S14 | Footer | `56:5159` | `[x]` | Glass pane 5 kolom; emblem di sumbu halaman — lihat catatan |

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
jadi dipakai animasi entrance. Setelah S3 dan S4 ada, ruang scroll itu muncul:
parallax-nya aktif (terukur travel rock-top 31,9px, rock-bottom 17,7px, tile
123,4px) dan entrance-nya diberi pemicu viewport supaya mengulang — lihat catatan
animasi di bawah. Blur **tidak** dianimasikan (RULES §12): `SofteningImage`
menumpuk dua salinan ber-blur statis dan hanya menyilangkan `opacity`.

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

Teks naik dari bawah sambil menajam, dikerjakan komponen baru `Reveal`, yang
memakai `whileInView`. Section di bawah lipatan yang mulai bergerak saat mount
sudah selesai sebelum ada yang melihatnya; `whileInView` membelanjakan
entrance-nya saat section dibaca. Hero memakai jalur berbeda untuk kebutuhan yang
sama (`EntranceGroup`) karena layer-nya harus berangkat serentak, bukan
sendiri-sendiri — alasannya di catatan animasi.

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

**Catatan S5.** Desainnya (`37:1874`) sebuah **roda pemilih**: dua garis
mengapit satu slot fokus, angka di dalamnya emas, ukuran penuh dan tajam,
sedangkan yang di atas dan di bawah redup, mengecil, dan buram. Jadi yang diam
adalah bingkainya, yang bergerak isinya — tiap stat naik melewati slot fokus
bergantian, berputar sendiri tiap 2,6 detik, bukan mengikuti scroll.

Daftarnya **dirender dua kali** karena roda tidak punya ujung. Setelah satu lap
penuh, track menampilkan sel yang *isinya* identik dengan titik berangkat, jadi
resetnya tak terlihat: indeks meloncat dari `N+1` ke `1` dengan transisi
dinolkan dan ketiga sel yang terlihat membawa tiga stat yang sama pada tiga
offset yang sama. Terukur di sambungan: tidak ada yang berubah di layar.

Offsetnya **persentase**, bukan pixel. Tiap sel tepat setinggi satu slot, jadi
menggeser track sebesar `100 / jumlah sel` persen tingginya sendiri memindahkan
tepat satu slot di viewport mana pun tanpa mengukur apa pun. `calc()` atas
variabel CSS tidak bisa di-interpolasi, dan nilai pixel terukur menuntut baca
layout tiap resize.

Desain memperlakukan slot atas dan bawah **berbeda** — yang bawah buram dan
mengecil, yang atas tidak. Asimetri itu terbaca sebagai kedalaman pada frame
diam, tapi **tidak selamat saat berputar**: tiap stat melewati kedua slot, jadi
ia akan buram saat masuk dan tidak saat keluar. Kedua tetangga diberi perlakuan
slot bawah, yang memikul kesan roda melengkung menjauh.

Rodanya `aria-hidden` dan section merender `<dl>` `sr-only` di sampingnya:
roda mengulang tiga stat yang sama selamanya, dan pembaca layar yang
mengikutinya akan mendengarnya berulang dalam urutan acak tergantung interval
berhenti di mana. Angkanya **diambil dari API** (`getFederationStats`), bukan
ditulis di JSX — angka yang berubah itu data; yang tersisa sebagai copy hanya
nama section untuk assistive tech.

Interval hanya jalan saat section terlihat (`useInView`, `amount: 0.3`) — timer
yang berputar melawan elemen di luar layar adalah baterai untuk tidak ada apa-apa.

Di Figma frame ini di `y:2065` sementara S4 berakhir di `2277`, jadi di kanvas
stats duduk di 212px terakhir gedung — pita fade-to-background-nya. Menarik
section ke atas sebanyak itu **sempat dicoba dan dicabut**: di 1920 terbaca
seperti desain, tapi overlap-nya diukur terhadap tinggi `56.25vw` milik S4, dan
di bawah `lg` section itu meninggalkan rasionya dan mengikuti copy — jadi
tarikan yang sama mendaratkan angka pertama di tempat berbeda tiap lebar.
Section berdiri sendiri, sambungannya diserahkan ke fade bawaan S4 yang memang
sudah berakhir di `#0e0e0e`.

**Catatan S6.** Satu-satunya section berlatar putih, dan itu justru intinya:
halaman gelap dari hero sampai stats dan gelap lagi dari berita ke bawah, jadi
band ini tempat ia membuka. Tidak ada komponen bersama yang di-invert — tombol,
warna teks, dan garisnya milik section ini sendiri.

Pager Figma berbunyi "1 of 6" tapi desain hanya menulis satu event, jadi lima
sisanya mock (`MOCK_SHOWCASE_EVENTS`). Panah **membungkus di kedua ujung**, jadi
tidak ada tombol yang jadi jalan buntu; posisinya dieja "n of 6" sehingga tidak
ambigu ke mana wrap mendarat. Terverifikasi 1→2→…→6→1 dan prev→6, dengan tahun
di kartu ikut berganti (`DWF2026` → `DWF2027`).

**Watermark sempat hilang sama sekali**, dan sebabnya bukan gagal load seperti
dugaan awal (`naturalWidth: 0` ternyata artefak probe yang membaca di
`evaluate` yang sama dengan scroll — diberi jeda 1500ms hasilnya `295`).
Sebabnya: **8% dari Figma sudah terbakar di alpha channel PNG-nya**. Diukur
dengan mendekode IHDR/IDAT dan meng-unfilter scanline-nya di Python — alpha
puncak 20/255 ≈ 0,078 — jadi class `opacity-[0.08]` mengalikannya sekali lagi
jadi ~0,6%. Class-nya dibuang. `brightness-0` juga dicabut atas permintaan:
mark-nya menahan tonenya sendiri yang pucat di atas emas.

Animasi kartu: watermark dan trofi **bergerak searah dan sefase** — saat tangan
naik, mark di belakangnya membesar. Sempat berlawanan (mark mengecil saat tangan
naik) dan itu terbaca sebagai dua layer bergiliran, bukan satu benda bernapas.
Keduanya satu durasi dari satu pose istirahat; terverifikasi dengan menyampel
`DOMMatrix` tiap 250ms — puncaknya bersamaan di ~750ms. Satu lap 4 detik
(`DRIFT` 2s, mirror).

Ganti event adalah **tukar biasa, bukan transisi**. Band-nya padat teks — nama,
dua field, satu paragraf, pager, dua tombol — dan mem-fade semuanya tiap tekan
membuat seluruh section bergerak tiap kali pembaca melangkah. Drift di dalam
kartu satu-satunya gerakan di sini, dan ia terus jalan melewati pergantian
karena kartunya sendiri tidak pernah unmount.

**Pemenggalan judul** "Caribbean / Domino / Open 2024" direproduksi
`text-balance`, bukan newline di data: wrap biasa memberi "Caribbean / Domino
Open / 2024" karena mengisi baris dulu baru pindah. Break keras harus ditulis
per event dan tetap salah di bawah 380px. Terukur per baris dengan `Range`
karakter demi karakter — dari enam nama, hanya ini yang berbeda saat dibalance.

**Panah sempat lompat-lompat** saat judul pendek: terukur geser sampai 100px di
1920, 89px di 1600, 28px di 1440/1024. `min-h` tetap ditolak karena titik wrap
bergantung pada lebar kolom **dan** ukuran font, dua-duanya berubah tiap
breakpoint. Gantinya tiap kandidat string ditumpuk di **satu sel grid** yang
sama (`col-start-1 row-start-1`, `invisible`, `aria-hidden`) sehingga sel
setinggi yang tertinggi dan mengukur ulang dirinya sendiri di tiap lebar — dan
tetap benar saat API asli mengirim nama yang belum pernah dilihat siapa pun.
Sisa 28px ternyata dari "Santo Domingo, Dominican Republic" yang wrap di field
Location, jadi field-nya ikut dipesan. Hasil akhir: **spread 0px di keenam
viewport**. Versi pertama pemesanan ini membungkus `<dd>` dalam div dan
**merusak `<dl>`**; diperbaiki dengan prop `as` supaya grid-nya *adalah* `<dd>`.

Seluruh kolom kiri satu `aria-live="polite"`, bukan hanya hitungan pager:
menekan panah mengubah nama, tanggal, dan tempat sekaligus, dan mengumumkan
"2 of 6" saja memberi tahu ada yang bergerak tanpa menyebut ke mana. Hitungan
yang terlihat `aria-hidden` supaya tidak terbaca dua kali.

**Cacat lebar yang lolos ke commit dan ditemukan saat S7.** Section ini hanya
pernah dicek di 1920, tempat ia muat. Tiga kolom pada angka Figma harfiah
(380 + 520 + 380 + dua gutter 100 + eyebrow + padding 80) butuh **1772px**
window sebelum muat, sementara barisnya mulai di `lg` — jadi **seluruh halaman
scroll ke samping dari 1024 sampai ~1700**: `scrollWidth` terukur 1614 di 1024,
1657 di 1440, 1674 di 1600. Diperbaiki dua langkah: baris pindah ke `menu`
(1400), dan lebarnya jadi proporsional — kartu `27.08vw` (= 520/1920, dibatasi
ukuran desain) dan kolom samping `flex-1 basis-0` dengan 380 sebagai plafon,
jadi 1920 tetap persis seperti sebelumnya dan window sempit membagi sisanya
rata. Tinggi kolom kanan ikut kartu (`min(720px,37.5vw)`), bukan 721 tetap —
kalau tidak, tombolnya menggantung di bawah kartu di tiap lebar di bawah 1920.
Terukur ulang 1920–390: `scrollWidth == clientWidth` di semua lebar, tombol
tetap rata dengan kaki kartu (`footDelta 0`), dan spread pager tetap 0px.
Pelajaran dicatat: **cek overflow di semua breakpoint, bukan hanya lebar desain.**

**Catatan S7.** Satu foto dan satu kalimat — itu seluruh section-nya. Ia engsel
antara band event putih di atas dan berita gelap di bawah, jadi kaki gambarnya
harus bertemu `--color-bg` tanpa sambungan.

Dan itu terjadi **tanpa CSS kita sama sekali**. `feature-domino-desk.png` adalah
komposit desain sendiri: Figma menumpuk foto 1920×1464 (`53:3068`, offset
`y:-489`) di bawah wash `rgba(14,14,14,0) → rgba(14,14,14,1)` (`53:3070`), dan
ekspornya adalah tumpukan itu yang sudah diratakan dan dipotong ke frame
1920×960. Terukur dengan mendekode PNG-nya: baris paling bawah terbaca
**14,14,14** — persis `--color-bg` — sementara baris atas masih penuh detail
(luma puncak 246). Menggambar ulang wash itu akan menggelapkan kakinya dua kali,
jebakan yang sama dengan `hq.png` di S4.

Bake itu juga yang membuat parallax-nya aman. Gambar bergerak **naik**
(`speed={-14}`), jadi tepi bawahnya terangkat dan meninggalkan pita latar
halaman — dan pita itu warnanya sama dengan baris terakhir gambar, jadi
sambungannya tak terlihat. Arah sebaliknya akan menarik tepi atas yang terang
dan penuh detail masuk ke frame dan memperlihatkan potongan keras. Terverifikasi
pada scroll maksimum setelah gambar terangkat 134px: kaki section bersih, tidak
ada garis maupun potongan.

**Naiknya sempat tidak terlihat sama sekali, dan penyebabnya dua hal sekaligus.**
Versi pertama memakai `speed={-6}` dengan anchor default `cross`
(`["start end", "end start"]`), yang baru mencapai progress 1 ketika **kepala**
section melewati atas viewport. S7 adalah section terakhir halaman, jadi itu
tidak pernah terjadi — dokumennya keburu habis. Terukur: halaman berakhir di
5100, penyeberangannya butuh 2040px scroll padahal hanya ada 960, sehingga layer
mandek di f≈0,5 dan hanya menyampaikan **27px** dari 58px travel-nya. 27px pada
frame 960 adalah 2,8% — di bawah ambang terlihat untuk still life tanpa tepi
keras di dekat batas frame.

Perbaikannya dua-duanya: anchor baru **`foot`** (`["start end", "end end"]`)
yang selesai saat **kaki** section bertemu kaki viewport — rentang scroll yang
selalu ada, ada section berikutnya atau tidak — dan travel dinaikkan ke 14%
(~134px). Terukur sesudahnya di 1920: `y` 0 → −26,9 → −53,8 → −80,6 → −107,5 →
**−134,4**, tuntas persis di scroll maksimum. Per lebar: −134,4 / −100,8 / −78,4
/ −58,8 / −58,8 di 1920/1440/1024/768/390.

S8 kini sudah terpasang, jadi S7 bukan lagi section terakhir dan `cross` bisa
dijangkau penuh. `foot` tetap dipertahankan dengan sengaja — untuk backdrop
full-bleed, gerakannya milik *kedatangan*, bukan kepergian; layer selesai selagi
section masih utuh di layar lalu diam saat keluar. Lagipula S8 menimpanya 200px,
jadi kaki foto tertutup kartu justru saat `cross` baru mau bekerja.

Kalimatnya **keluar dari blur, membesar dari 0,86 ke ukuran istirahatnya, dan
menerang** — itu satu-satunya entrance di sini. Ia **tidak ikut naik**: gambar
di belakangnya sudah bergerak ke atas, dan benda kedua yang bergerak ke arah
sama di frame sekosong ini terbaca sebagai section melorot, bukan kata yang
datang. Membesar dari tengah terbaca sebagai *mendekat* — sumbu yang berbeda
dari drift meja, jadi keduanya tidak berebut. Skala itu transform pada satu
layer terkomposit, bukan re-layout, jadi tidak ada yang reflow (RULES §12).

Blur **tidak** dianimasikan (RULES §12) — `Reveal` menyilangkan opacity dua
salinan ber-blur statis. Terukur luma puncak di kotak teks: 185 → 194 → 240 →
**255**, jadi "sampai terlihat terang" memang terjadi dan bukan sekadar tajam;
skalanya `0.86 → 0.896 → 0.946 → 0.981 → 1` (lebar teks 867 → 1008px).
Entrance-nya mengulang: terukur `[1,0]`/`0.86` saat di luar layar → `[0,1]`/`1`
setelah tuntas → kembali `[1,0]`/`0.86` saat menjauh → `[0,1]`/`1` lagi saat
kembali.

**Satu penyimpangan dari desain, disengaja.** Node `55:3224` membawa
`blur(7.5px)` sebagai **keadaan istirahat** — desain tidak pernah menajamkan
kalimat itu. Di sini ia diselesaikan sampai tajam, karena kalimat itu satu-satunya
isi section dan versi yang buram permanen tidak terbaca di ukuran mana pun.
Perlu dikonfirmasi ke desainer.

Ukurannya Inter Medium 64 — satu-satunya tempat di halaman font body diset
sebesar itu, jadi ia dapat step sendiri `--text-news-intro` (3,33vw = 64/1920)
ketimbang meminjam step display; section ini memang diset Inter, bukan Bebas.
`text-balance` meratakan dua barisnya: wrap biasa di 1440 memberi tujuh kata di
atas satu kata, sedangkan balance memenggal setelah "updates" — break yang sama
dengan kotak 1008px Figma di lebar desain — dan terukur mendarat di situ di
setiap lebar yang wrap sama sekali (1920/1600/1440/390).

**Catatan S8.** Figma menggambar section ini sebagai satu baris di `x:-473` —
strip-nya sudah mulai di luar kanvas sebelah kiri, dan tujuh slotnya berjumlah
~2916px melawan frame 1920. Desainnya sendiri adalah **potret sesuatu yang sudah
bergerak**; ia tidak bisa dan tidak dimaksudkan untuk muat.

Komposisinya bukan baris seragam: lima slot 540×700, dan slot keempat adalah
kolom bertumpuk — kartu 540×418 di atas dua kotak 258×258 berdampingan. Itulah
yang membuat strip tidak terbaca sebagai filmstrip biasa. Ukuran hidup di
`NewsCard` (tiga rasio), susunannya di `News.tsx`.

**Geraknya marquee otomatis, dipilih pengguna** dari empat opsi (drag+panah,
scroll native, scroll-linked, auto). Kekhawatiran sudah disampaikan sebelum
dibangun: teks yang tidak pernah berhenti sulit dibaca dan tautan yang melaju
sulit diklik. Mitigasinya jadi bagian dari komponen, bukan tambahan — strip
**berhenti saat hover dan saat fokus masuk** ke mana pun di dalamnya, yang
sekaligus membuatnya bisa dijalankan keyboard.

**Pause-nya sempat justru melempar strip balik ke awal.** Versi pertama memakai
`animate={{ x: still ? "0%" : "-50%" }}`; terukur "sebelum hover −51, saat hover
0 → 0". Pause deklaratif bukan *membekukan*, ia mengganti **target**. Ditulis
ulang dengan `useMotionValue` + `useAnimationFrame` + akumulator `useRef`,
sehingga pause berarti "berhenti menambah" dan posisinya tinggal di tempat.
Terukur ulang: hover membeku di −52 dan bertahan, lanjut di −86; fokus membeku
di −44. Tetap satu `transform` di satu track terkomposit (RULES §12) —
MotionValue menulis langsung ke style tanpa render React.

Loop-nya trik dua salinan: anak-anaknya dirender dua kali dan track digeser 0%
→ −50%, jadi salinan kedua mendarat persis di tempat salinan pertama mulai.
Dibuktikan dengan angka, bukan mata: rasio setengah/track terukur tepat **0,5**
(2832/5664), dan lajunya seragam −34px per 900ms tanpa tersendat. Salinan kedua
`aria-hidden` **dan** `inert` — menyembunyikan elemen fokusabel dari a11y tree
tanpa mengeluarkannya dari tab order akan mendamparkan pembaca keyboard di
kontrol yang tak bisa dibacakan. Terukur 7 tautan tabbable dari 14 total.
`prefers-reduced-motion` menghentikannya **penuh** lewat nilai animasi, bukan
cabang markup — terukur `0 → 0 FULLY STOPPED`, 0 error hidrasi.

**Scrim kartunya sempat proporsional dan itu keliru.** Node `55:3216` memberi
frame gradien 331 dari 700px kartu, yaitu 47% bagian bawah. Diambil sebagai
**persentase** ia gagal di kartu pendek: 47% dari slot 418px hanya 196px dan
dari kotak 258px hanya 121px, jadi wash-nya makin curam makin pendek tile-nya —
terukur di kartu `wide`, judulnya mendarat di kursi yang kena cahaya tanpa
bayangan sama sekali di bawahnya. Diganti 340px tetap (angka desain di ukuran
desain), dibatasi 70% agar tidak menelan tile kecil. Judulnya `line-clamp-2`:
Figma menulis tiap judul cukup pendek untuk dua baris, tapi judul di sini datang
dari API dan tidak ada yang menjaminnya.

**S8 masuk ke dalam S7, tidak mengikutinya** — dikoreksi setelah dilaporkan
pengguna. Figma menaruh S7 di `y:3941` setinggi 960 (berakhir 4901) dan memulai
baris ini di `y:4701`: **tumpang tindih 200px**, dan kaki foto meja jadi tempat
kartu-kartu itu menyelip. Ditulis proporsional `-mt-[10.42%]` (200/1920) supaya
ikut skala, bukan memakan 200px tetap dari kartu mobile yang pendek (D14).
`relative z-10` yang membuatnya terbaca menyelip, bukan terpotong. Terukur: s7
`{top 4140, bottom 5100}`, s8 `{top 4900}` → `overlap 200`, persis Figma.

Panahnya **+135°, bukan −135°** — asetnya menunjuk **kiri** (pager S6 memakainya
dua arah), jadi −135° justru mengarahkannya ke bawah-kanan; itu percobaan
pertama dan salah. Tandanya mudah terbalik, sudah dicatat di komentar kode.

Kartu bukan cuma tombol panahnya yang bisa diklik: target 48px di pojok itu
buruk untuk kartu sebesar ini, jadi panahnya ditahan sebagai isyarat visual
(`aria-hidden`, tidak fokusabel) dan anchor-nya direntangkan ke seluruh tile
lewat `after:inset-0` — satu tab stop per kartu, nama aksesibel tetap judulnya.

Kontennya **tujuh artikel unik** (pilihan pengguna): Figma mengulang artwork di
beberapa slot, tapi mock kini punya tujuh judul dan tujuh gambar berbeda —
termasuk `news-thumb-06` yang sebelumnya menganggur. `getLatestNews` default
`limit = 7` karena itu yang digambar mosaiknya; default lebih kecil akan
membuat komposisinya kurang satu tile tanpa error.

Lebar kartu `max(260px, 28.125vw)` — 28,125vw adalah 540/1920, jadi di lebar
desain tiap tile persis ukuran Figma-nya dan jendela sempit menyusutkan seluruh
mosaik ketimbang meluber (D14); lantai 260px menahan kartu jadi serpihan tak
terbaca di ponsel. Terverifikasi 1920/1440/1024/768/390: 540/405/288/260/260,
kedua salinan tetap identik di tiap lebar, tanpa scroll horizontal.

**Catatan S9.** Figma menggambar delapan logo **diam dan rata tengah**, tapi
delapan frame 260px berjumlah 2240px di dalam frame 1920 — di lebar desainnya
sendiri pun tidak muat. Mengecilkan marknya sampai muat menjatuhkan wordmark di
bawah ambang terbaca (`logo-pertamina-fastron` mengisi hampir seluruh frame dan
berhenti terbaca di bawah ~150px), jadi strip-nya dibuat **berjalan** memakai
`Marquee` yang sama dengan S8 — tiap logo tetap ukuran penuh dan kedelapannya
kebagian giliran. Lap-nya 90 detik, lebih lambat dari 75 detik S8 walau
track-nya lebih pendek: ini logo, bukan judul; tidak ada yang perlu dibaca, jadi
tugasnya menghanyut (~25px/detik) bukan jadi ticker yang menarik mata keluar
dari section sekitarnya.

Logonya **bukan tautan**. Figma tidak memberi tujuan dan `Partner.websiteUrl`
opsional — sampai federasi memberi alamatnya, delapan anchor ke mana-mana lebih
buruk daripada delapan gambar. Marknya tetap punya nama untuk pembaca layar,
jadi daftarnya terbaca tanpa harus bisa diklik. Opacity 25% adalah section-nya
sendiri: partner **diakui** di sini, bukan diiklankan.

**Catatan S10.** Dua kolom `space-between`: 356 kiri, 1136 grid, jadi sisanya
268px (13.96vw). Ditulis `basis-0` + `grow-[356]`/`grow-[1136]`, bukan lebar
tetap — menahan kolom kiri di 356 sementara grid menyusut memberi prosa measure
lebih lebar daripada kartu di sebelahnya di tiap lebar di bawah 1920 (D14).

Grid 2×2 baru mulai di `menu-lg` (1600), bukan `sm`. Yang menentukan bukan lebar
kartunya melainkan sisa ruang untuk judul, karena pil dokumennya tetap 160px.
Terukur: di 768 grid 2-up memberi kartu 336px dan judul empat baris; di 1400
memberi 390px dan tiga baris; baru di 1600 kartunya mencapai 455px dan judulnya
kembali ke pola `2,2,1,2` — yang digambar desain. Di bawah itu ditumpuk satu per
baris, di mana tiap judul muat satu baris.

`auto-rows-fr` menyamakan kedua baris. Figma memberi kartu ketiga tinggi
eksplisit 156px sementara yang lain hug (`56:4599`) — desain sedang mengompensasi
manual judul satu baris di sebelah judul dua baris. Baris yang sama tinggi
melakukannya sendiri dan terus melakukannya saat judulnya berubah.

**Catatan S11.** Kartu putih 20px di atas ground gelap; itu seluruh
treatment-nya. Padding dalamnya `60px 160px` ditulis pecahan (8.33vw = 160/1920)
— harfiah ia masih menuntut 320px dari tablet 768px dan menyisakan kolom
pertanyaan lebih sempit daripada gutter di sekelilingnya (D14).

Judulnya **hitam, bukan gradien emas** seperti heading lain. Kartunya putih dan
emas di atas putih gagal kontras di ketiga stop brand (`#E1B762` di putih 1,9:1
lawan 4,5 yang diminta RULES §10). Figma mengambil keputusan yang sama.

**Satu terbuka pada satu waktu.** Figma menggambar tepat satu item terbuka
(`81:696`) dan toggle plus/minus — bukan chevron — yang memang afordansi
accordion single-select. Mengklik item terbuka menutupnya, jadi "semua tertutup"
tetap terjangkau.

**Panelnya menganimasikan `height`, yang secara umum dilarang RULES §11.**
Pengecualian ini disengaja dan disempitkan: aturannya menyasar layer scroll-linked
di mana reflow mendarat tiap frame dan beberapa layer berebut 16ms yang sama.
Ini satu elemen, dibuka klik eksplisit, 280ms, tanpa apa pun beranimasi di
sebelahnya. Dua alternatifnya diukur dan lebih buruk: `max-height` tebakan tetap
reflow dan salah timing kalau tebakannya meleset, sedangkan membuka tanpa
transisi menjatuhkan pembaca ke paragraf yang sedetik lalu tidak ada. Ikon
toggle-nya — yang justru ada di hot path bersama sisa halaman — tetap di
`transform`/`opacity`.

Panel tertutup pakai `inert`, bukan `aria-hidden`: elemennya masih di DOM pada
tinggi nol, dan menyembunyikannya dari a11y tree tanpa mengeluarkannya dari tab
order akan mendamparkan pembaca keyboard di tautan yang tak bisa dibacakan —
jebakan yang sama dengan salinan marquee S8.

Jarak 18px pertanyaan→jawaban datang lewat **pengurangan** (`-mt-3.5`). Item
terbuka `padding: 32px 0` dengan gap 18, tapi tombol di atasnya sudah memakai 32
miliknya sendiri — padding itulah yang membuat seluruh baris jadi tap target dan
tidak bisa ditukar, sedangkan mengecilkannya hanya saat terbuka akan melompatkan
baris 14px tiap toggle. Offset-nya menumpang di elemen dalam, sama seperti
padding-nya: `overflow-hidden` memotongnya dan panel mengukur tinggi kotak ini
termasuk offset, jadi panel tertutup terukur tetap **tepat nol**.

**Catatan S12.** Layer dekorasi murni, jadi ia `ui/PageShine`, bukan section —
tidak ada yang boleh mengumumkannya di outline halaman. Figma menaruhnya di
`y:6826` setinggi 1775 (berakhir 8601), yaitu ~50px dari ujung konten footer di
satu sisi dan ~520px masuk ke FAQ di sisi lain. Hanya salah satu angka itu
selamat kena konten nyata: tinggi FAQ bergantung jawaban mana yang terbuka dan
bagaimana pertanyaannya wrap, jadi offset yang diukur darinya akan bergeser.
Kaki dokumen tidak. Layer-nya dipaku `bottom-0` dan mengambil tinggi dari rasio
artwork-nya sendiri (1920/1775). Anchor `foot` wajib di sini (D16) — ini benda
terakhir di halaman.

**Bug wash gelap menimpa kartu FAQ** (dilaporkan pengguna). Penyebabnya bukan
gradien atau opacity kartunya, melainkan urutan cat: `isolate` di pembungkus
shine memang menahan `-z-10` anaknya, tapi sekaligus membuat grup itu tercat
sebagai **satu unit**, dan sebagai sibling yang lebih belakang ia menimpa segala
sesuatu di `<main>` yang tidak punya level sendiri. Diperbaiki dengan
`relative z-10` di `<main>`. Figma punya tumpang tindih yang sama dan jawaban
yang sama: kartunya opaque dan beam-nya lewat di belakang.

**Catatan S13.** Tiga blok rata tengah tanpa latar sendiri — section-nya
transparan dan beam S12 tembus, yang justru alasan S12 ada.

Gap-nya **dua tingkat, bukan satu**. Section-nya 36 (`56:4698`) dan itu hanya
berlaku antara blok teks dan tombol; headline dan paragraf adalah frame
bersarang (`56:4697`) pada 24 yang lebih rapat. Gap rata untuk ketiganya
menghilangkan pengelompokan itu — pengelompokan yang memberi tahu pembaca bahwa
prosanya milik headline, bukan milik tombol.

**Pil peraknya sempat 169px lawan 264 desain.** Perbaikan pertama (`min-w` di
tombol) tidak berpengaruh sama sekali, dan alasannya layak dicatat: pembungkus
`Reveal`-nya memakai `w-fit`, yaitu `fit-content`, yang **resolve terhadap
konten dan tidak melihat `min-width` anaknya** — pembungkusnya menyusut ke label
169px lalu memotong pil di dalamnya kembali. Lantainya harus ada di keduanya.
264 dipasang sebagai `min-w`, bukan lebar tetap: lebar tetap memotong terjemahan
yang lebih panjang (RULES §9), tapi hug murni juga salah — label Bebas 32 hanya
~129px sehingga padding 20px tidak bisa menjelaskan sisanya, dan pil-nya terbaca
jelas lebih kurus dari desain. Terukur 264×64 di 1920.

`SilverCta` diekstrak karena S13 ternyata menggambar tombol yang sudah dipunyai
S3 (`24:1025`); keduanya hanya beda lebar, jadi lebarnya diserahkan ke pemanggil.

**Catatan S14.** Satu glass pane (`rgba(0,0,0,0.4)` + `blur(10px)`) berisi lima
kolom. Lima kolom jadi **dua baris sebelum jadi satu**: baris Figma butuh jauh
di atas 1600px kalau dibaca harfiah, jadi satu kolom di bawah `md`, dua dari
`md`, dan lima-sejajar baru dari `menu-lg` (1600) — ambang yang sama dengan grid
S10. Rata kanan kolom Contact/Social juga dibatasi ke `menu-lg`: begitu ditumpuk,
semua-rata-kanan cuma terbaca ragged.

**Footer macet dua kolom di semua lebar** — dan penyebabnya bukan di footer.
Token `--breakpoint-menu`/`--breakpoint-menu-lg` ditulis dalam `px`, sedangkan
Tailwind v4 mengurutkan blok `@media` menurut nilai dan **tidak bisa
membandingkan `px` dengan `rem`** — jadi tiap breakpoint px tersortir di atas
*semua* breakpoint rem, `sm` sekalipun. `menu-lg:grid-cols-[…]` mendarat di atas
`md:grid-cols-2`; keduanya cocok di 1600, spesifisitas seri, dan aturan yang
belakangan menang. Diubah ke `rem` supaya berselang di tempatnya: sm · md · lg ·
xl · menu(87.5) · 2xl · menu-lg(100). Ini menaungi **semua** aturan `menu`/
`menu-lg` yang bertabrakan dengan breakpoint rem, bukan cuma footer.

**Emblem harus di sumbu halaman** (dilaporkan pengguna), dan tiga pembacaan
track sempat salah. Figma `56:5026`: keempat kolom luar `fill`, hanya kolom
tengah yang tetap (440). Menulis tengahnya `440fr` mengira `fr` itu lebar —
padahal ia bagian dari ruang **sisa**, jadi lawan empat track `auto` ia mengambil
hampir semuanya. Menggantinya `auto auto … 1fr 1fr` memperbaiki lebar tengah tapi
membuat dua kolom tautan hug, yang menyeret barisnya ke kiri dan meninggalkan
emblem di 763, bukan 960. Yang benar `1fr 1fr 22.92vw 1fr 1fr`:
(1696 − 280 gap − 440)/4 = 244 per kolom, tengahnya buka di 740, titik tengahnya
mendarat di 960.

`1fr` polos, **bukan** `minmax(0,1fr)`. Keduanya hanya beda lantai track, dan
lantai itulah intinya: `1fr` polos menahan minimum `auto` implisitnya, jadi
track yang tidak muat dibekukan di ukuran kontennya dan sisanya dibagi ulang —
persis yang dilakukan `fill` Figma, yang flexbox di baliknya dan `min-width:auto`
miliknya melindungi konten dari himpitan yang sama.

**Alamat email wrap di tengah token** (dilaporkan dua kali). `break-all`
memecahnya "…dwf-or / g"; `break-words` tetap memecahnya "community@dwf- / org",
karena tanda hubung adalah kesempatan break normal dan `overflow-wrap` tidak
menghapusnya. Hanya `whitespace-nowrap` yang menyatakan batasan sebenarnya.

Tapi menolak wrap juga jadi **tuntutan** pada baris: min-content baris nowrap
adalah lebar penuhnya, dan clamp menumbuhkan lebar itu sedikit lebih cepat
daripada bagian kolom tumbuh — 204px diminta lawan 194 tersedia di 1600, 217
lawan 210 di 1700, 245 lawan 244 di 1920. Grid menghormati yang lebih besar,
jadi track Contact membeku lebih lebar dari tiga saudaranya dan menggeser emblem
7px dari sumbu. Diberi `w-0 min-w-full`: `width:0` definit tidak menyumbang apa
pun ke intrinsic sizing, sedangkan `min-width` persentase resolve ke nol selama
pengukuran itu lalu kembali ke lebar kolom penuh setelah kolomnya jadi. Terukur
`off-axis 0` di 1600/1700/1800/1920/2560 dengan alamat tetap satu baris.

Field newsletter juga sempat memiringkan barisnya, dan ini jebakan yang berdiri
sendiri: `<input>` punya `size` bawaan ~20 karakter, dan itu **lebar**, bukan
minimum — `min-w-0` menurunkan lantainya tapi meninggalkan lebar preferensinya,
jadi field-nya tetap meminta ~187px tiap kali kotaknya diukur intrinsik. Itulah
yang membuat min-content kolom Contact 243px di 1600. `w-0 flex-1` menyatakan
maksudnya: input tidak punya lebar sendiri dan mengambil apa yang diberi
`flex-1`. Terukur min-content form 243 → 56, kolom 243 → 204.

Field-nya **form sungguhan**, bukan dekorasi. Figma cuma menggambar kotak dengan
tulisan "Enter email", tapi kotak subscribe yang tidak bisa diketik lebih buruk
daripada tidak ada. Karena belum ada endpoint (B2), submit **mengatakan** begitu
lewat `role="status"` alih-alih menelan alamatnya — sengaja dipilih di atas dua
alternatif: field yang diam-diam tidak melakukan apa-apa adalah kebohongan, dan
menonaktifkannya menghilangkan bentuk desain. Begitu `POST`-nya ada, hanya
`onSubmit` yang berubah.

Email ditulis sebagai **teks, bukan `mailto:`** — alamat di desain tidak punya
TLD (`56:4977`), jadi tautan mail yang dibangun darinya membuka jendela compose
yang tak akan pernah terkirim.

**Catatan audit tipografi (lintas section).** Diminta pengguna, dan hasilnya
bukan soal satu section. Suku tengah `clamp()` adalah yang **benar-benar
dirender di lebar desain**, jadi slope `vw` yang kurang dari cap berarti token
itu tidak pernah mencapai maksimumnya sendiri di layar yang jadi acuan desain.
Empat token pendek diam-diam: `display-lg` 153,6 lawan 156; `display-md` 124,8
lawan 126; `display-xs` 63,36 lawan 64; `news-intro` 63,94 lawan 64. Tidak ada
yang memperingatkan — angkanya cuma meleset beberapa piksel di mana-mana.
Aturannya sekarang: tiap slope adalah `cap / 1920` sampai empat angka, dibagi,
bukan dikira-kira. Setelah itu ke-13 pasang ukuran/leading terukur cocok dengan
Figma di 1920.

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

Copy S2 **sengaja diam**. Entrance hero adalah artwork yang merakit dirinya —
kata-katanya adalah hasil yang dituju layer bergerak, jadi sudah di tempatnya
sebelum batu mulai mundur. `Reveal` sempat dipasang di tagline/headline/CTA dan
dicabut kembali: teks yang ikut beranimasi tiap kali pembaca kembali justru
terbaca sebagai efek, bukan sebagai halaman yang sedang datang, dan ia berebut
momen dengan tiga layer yang bergerak di belakangnya.

**Entrance hero mengulang** (`EntranceGroup`). Turun ke S4 lalu naik lagi, batu
mundur dan tile datang sekali lagi. Yang penting di sini: pemicunya **satu untuk
seluruh panggung**, bukan satu per layer. Tiap layer yang mengamati dirinya
sendiri terlihat masuk akal sampai dicoba dari bawah — batu bawah paling dekat
dengan pembaca yang naik dari S3, jadi ia melewati ambangnya lebih dulu dan mulai
mundur saat tile di atasnya masih di luar layar. Komposisinya merakit diri
bottom-up saat naik dan top-down saat load: tiga animasi yang sama dalam urutan
berbeda, dan itu terbaca sebagai desain yang berbeda. Satu `useInView`, satu
boolean lewat context, jadi semua berangkat serentak dan jeda relatif dari desain
tetap utuh.

`amount` 0.4, bukan 0.25 seperti copy: ambangnya harus cukup rendah supaya
section benar-benar sedang dilihat, tapi masih menyisakan ruang untuk rearm. Naik
dari S3 hero masuk dari tepi atas viewport, jadi 40% tercapai jauh sebelum ia
berhenti — mundurnya batu bermain ke dalam frame yang sedang terisi, bukan
setelahnya.

Blur cross-fade ikut mundur bersama scale-nya. Keduanya satu gerakan: batu yang
mundur tanpa melembut lagi berarti perubahan fokusnya sudah habis terpakai di
kunjungan pertama, dan replay hanya menampilkan separuhnya. Reset dipakai
bersama lewat `RESET_DURATION` di `lib/utils/motion.ts` — dulu privat di
`Reveal`, sekarang dipakai `ParallaxLayer` dan `SofteningImage` juga.

Terverifikasi 360/768/1440/1920, dua putaran penuh: settle `scale 0.82` / tile
`opacity 1, rot −6°` → di S4 balik ke `scale 1` / tile `opacity 0, rot −16°` →
400ms setelah naik `scale 0.925` (sedang bergerak) → settle lagi di angka semula.
Salinan blur batu atas ikut bertukar `[0,1] → [1,0] → [0,1]`. Reduced-motion
mendarat langsung di posisi diam pada load **dan** pada replay (`0.82`/`−6°`
sejak 250ms), tanpa hydration failure — `useInView` `false` di server dan di
render pertama client, jadi kedua sisi melukis keadaan awal yang sama.

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
| 2026-08-21 | Entrance hero mengulang saat pembaca naik lagi ke S1; `EntranceGroup` memicu ketiga layer serentak, bukan per-layer (D13) |
| 2026-08-21 | S5 Stats selesai — roda angka berputar sendiri (`StatsWheel`), daftar `sr-only` terpisah karena roda `aria-hidden` |
| 2026-08-21 | S6 Featured Event selesai — pager 6 event membungkus dua arah; watermark diperbaiki (8% sudah ter-bake di alpha PNG, bukan gagal load) |
| 2026-08-21 | S6 tinggi judul & field dipesan lewat sel grid bertumpuk — panah berhenti lompat (spread 100px → 0px di 6 viewport) |
| 2026-08-21 | S6 overflow horizontal 1024–1700 diperbaiki: baris pindah ke `menu`, lebar kolom jadi proporsional (D14) |
| 2026-08-21 | S7 Intro berita selesai — foto naik saat scroll, kalimat keluar dari blur sambil membesar `0.86 → 1` ke luma `255`; wash sudah ter-bake di PNG |
| 2026-08-21 | Perbaikan S7: naiknya foto tidak terlihat — anchor `cross` mandek di f≈0,5 pada section terakhir halaman, hanya 27px travel. Anchor `foot` baru + travel 6% → 14%; terukur tuntas −134,4px di scroll maksimum |
| 2026-08-22 | S8 Mosaik berita selesai — marquee otomatis 7 slot (`Marquee` + `NewsCard` tiga rasio), berhenti saat hover/fokus, berhenti penuh saat reduced-motion |
| 2026-08-22 | Pause marquee terbukti melempar strip ke awal (`animate` = ganti target, bukan beku); ditulis ulang dengan `useMotionValue` + `useAnimationFrame` (D17) |
| 2026-08-22 | Scrim kartu diperbaiki dari proporsional ke `min(70%,340px)` — 47% pada slot 418px meninggalkan judul tanpa bayangan; judul diberi `line-clamp-2` |
| 2026-08-22 | S8 dikoreksi agar masuk ke S7, bukan mengikutinya — `-mt-[10.42%]` (200/1920, sesuai Figma 4901 vs 4701); terukur `overlap 200`. Panah kartu +135°, bukan −135° |
| 2026-08-22 | Mock berita jadi 7 artikel unik (`news-thumb-06` terpakai); `getLatestNews` default `limit = 7` mengikuti jumlah slot mosaik |
| 2026-08-22 | S9 Official Partners selesai — strip berjalan (lap 90s) karena 8 frame = 2240px tidak muat di 1920 desainnya sendiri; logo sengaja bukan tautan (D21) |
| 2026-08-22 | S10 Resource Library selesai — grid 2×2 mulai `menu-lg` setelah panjang judul diukur di 768/1400/1600 (D22); `auto-rows-fr` menggantikan tinggi manual Figma |
| 2026-08-22 | S11 FAQ selesai — accordion single-select, panel menganimasikan `height` sebagai pengecualian RULES §11 yang disempitkan (D23); jarak 18px lewat `-mt-3.5` |
| 2026-08-22 | S12 Overlay shine selesai — `ui/PageShine`, dipaku `bottom-0` + anchor `foot`, bukan offset dari FAQ yang tingginya berubah |
| 2026-08-22 | S13 CTA akhir selesai — `SilverCta` diekstrak (dipakai bersama S3); gap dua tingkat 36/24 sesuai `56:4697` |
| 2026-08-22 | S14 Footer selesai — glass pane 5 kolom, newsletter jadi form sungguhan yang menolak dengan terang karena B2 (D28) |
| 2026-08-22 | Breakpoint `menu`/`menu-lg` diubah px → rem — Tailwind v4 mengurutkan px di atas *semua* rem, jadi `md:` menang atas `menu-lg:` di 1600 dan menaungi diam-diam (D24) |
| 2026-08-22 | Slope tiap `clamp()` diseragamkan `cap/1920` — 4 token tak pernah mencapai maksimumnya di lebar desain (D25) |
| 2026-08-22 | Bug wash gelap menimpa kartu FAQ diperbaiki: `isolate` membuat grup shine tercat satu unit di atas `<main>` → `relative z-10` (D26) |
| 2026-08-22 | Track footer diperbaiki ke `1fr 1fr 22.92vw 1fr 1fr` setelah dua pembacaan salah (`440fr`, lalu `auto`); emblem 763 → 960 (D27) |
| 2026-08-22 | Email footer `whitespace-nowrap` + `w-0 min-w-full`; input newsletter `w-0 flex-1` — off-axis emblem 33px → 0 di 1600–2560 (D29) |
| 2026-08-22 | Lebar `SilverCta` diperbaiki 169 → 264: `w-fit` pembungkus mengabaikan `min-width` anak, lantainya harus di keduanya (D30) |
