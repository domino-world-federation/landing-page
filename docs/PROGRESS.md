# Progress — DWF Website

**Terakhir diperbarui:** 2026-08-24

Legenda: `[ ]` belum · `[~]` berjalan · `[x]` selesai · `[!]` terblokir

---

## Ringkasan

| Fase | Status | Keterangan |
|---|---|---|
| 0 — Persiapan aset | `[x]` | Selesai |
| 1 — Scaffold project | `[x]` | Selesai — build, lint, typecheck lolos |
| 2 — Slicing landing page | `[~]` | 14/14 section selesai; audit penamaan & struktur beres; sisa checklist "setelah semua section" |
| 3 — Integrasi API | `[ ]` | Menunggu backend |
| 4 — Portal | `[~]` | Sembilan halaman selesai: About (11 blok), Domino (5/6, R12), Development (9), News (6, R13), Terms, Contact (tanpa desain, R14), Gallery, Privacy, All News. Portal sendiri belum |

---

## Blocker aktif

| ID | Blocker | Menghambat | Tindakan |
|---|---|---|---|
| B2 | API belum tersedia (dikerjakan tim lain) | Fase 3 | Pakai mock; minta contoh response |

Selesai: ~~B1 MCP Figma 403~~ — tersambung 2026-08-20.
~~B3 `feature-hq-building.png` 8.8 MB~~ — beres 2026-08-21: file 9.2 MB dihapus
dari repo, S4 memakai `feature-hq-composite.png` 1920×1080 dari desainer (lihat
catatan S4). File itu bernama `hq.png` sampai 2026-08-22; entri log lama menyebut
nama tersebut (D31).

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
- `feature-hq-building.png` 9.2 MB, perlu optimasi (PRD R3 — file kemudian
  dihapus; tiga aset lain masih di atas 1 MB, PRD R10)
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
letak bawaan `create-next-app` supaya import relatifnya tetap sederhana. RULES §2
sempat menyebut `styles/` sebagai folder yang ada padahal tidak pernah dibuat;
sejak 2026-08-22 pohon di RULES mencerminkan `app/globals.css` yang sebenarnya.

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
ternyata tidak berlaku untuk S4 — `feature-hq-composite.png` gelap. Kalau nanti ada section
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

**Catatan S4.** `feature-hq-composite.png` (1920×1080, dari desainer) adalah komposit desain
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
stop `transparent 47%`), lalu seluruh overlay dibuang begitu komposit desainer dipakai.

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
bergantian, berputar sendiri tiap 1,7 detik, bukan mengikuti scroll.

Putarannya **spring, bukan `EASE`** (D49). Kurva halaman dibentuk untuk gerak
yang diikuti mata — berangkat segera, mendarat lembut — dan di roda pemilih itu
terbaca menggeser, padahal intinya track ditangkap dan ditahan di tiap notch.
`visualDuration: 0.18` dengan `bounce: 0.3` mendaratkannya hampir sebelum
terbaca sebagai perjalanan, lalu menaruh satu overshoot ~5% satu slot: track
lewat sedikit dari notch dan ditarik kembali masuk. Recoil itu keseluruhan
efeknya. Karena spring tidak punya ujung tetap, `TURN` berhenti berarti "lama
transisi" dan jadi **anggaran** yang harus melampaui *settle*-nya (0,5s) — kalau
tidak, interval menyala dan rewind sambungan mendarat saat track masih bergerak.
Cross-fade emas↔redup tetap tween 0,16s: `opacity` yang overshoot terpotong di 1
dan terbaca sebagai kedip.

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
jebakan yang sama dengan `feature-hq-composite.png` di S4.

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

- [x] Audit penamaan aset & struktur folder (2026-08-22 — lihat di bawah)
- [ ] Petakan kecepatan antar layer secara menyeluruh
- [ ] `prefers-reduced-motion` mematikan parallax penuh
- [ ] Uji parallax di perangkat nyata (60fps, cek baterai)
- [ ] Optimasi tiga aset di atas 1 MB (PRD R10 — ditunda sampai setelah
      presentasi atas keputusan pengguna)
- [ ] Audit Lighthouse (target ≥ 90)
- [ ] Metadata & OG tag
- [ ] Sapuan akhir lintas breakpoint

**Catatan audit penamaan & struktur (2026-08-22).** Dikerjakan setelah 14
section selesai, saat pola pemakaian sudah terlihat seluruhnya — lebih awal dari
itu tidak ada dasar untuk memutuskan mana yang benar-benar reusable.

Empat aset diganti nama (D31): `hq.png` → `feature-hq-composite.png`,
`hero-trophy-hand.png` → `event-trophy-hand.png`, `card-shade.svg` →
`decor-card-streaks.svg`, `icon-arrow.svg` → `global/icon-arrow-left.svg`.
`icon-download.svg` ikut ke `global/`. Dua aset mati dihapus —
`decor-light-beam.png` (1.25 MB, kembaran raster `decor-shine.svg`) dan
`card-dwf2026-badge.png` (334 KB, panelnya digambar CSS). PRD R5 tertutup
karenanya.

Komponen dikelompokkan ulang per halaman (D32): `sections/` + delapan potongan
satu-pemakai dari `ui/` menjadi `components/home/`; empat primitif gerak menjadi
`components/motion/`; `NewsletterField` ke `layout/`; `ui/` tersisa `GoldCta`,
`SilverCta`, `Marquee`. `content/` ikut dicermin jadi `content/home/`, kecuali
`navigation.ts` dan `footer.ts` yang memang lintas halaman.

Verifikasi: `bunx tsc --noEmit` bersih, `bunx eslint src` bersih, `bunx next
build` lolos dengan 2 route statis, dan seluruh 34 path aset yang direferensikan
`src/` terbukti ada di disk dengan nol aset yatim tersisa. Ukuran file sengaja
tidak disentuh — itu R10.

---

## Fase 3 — Integrasi API `[ ]`

Terblokir B2. Section bergantung API: S3, S5, S6, S8, S10.

- [ ] Terima base URL + contoh response
- [ ] Samakan `types.ts` dengan response asli
- [ ] Ganti implementasi mock di `client.ts`
- [ ] Penanganan error & loading state
- [ ] Atur strategi cache / ISR

---

## Fase 4 — Portal `[~]`

Cakupan di PRD §5. Portal sendiri belum dimulai — yang berjalan sembilan
halaman: About (didahulukan karena statis seluruhnya kecuali satu daftar),
Domino, Development, News, Terms & Conditions, Contact, Gallery, Privacy
Policy, dan All News. Statis semua kecuali News, Gallery dan All News, yang
membaca `searchParams`.

Tersisa satu layar yang sudah digambar dan belum dibangun: **FAQ**
(`173:9459`), di atas cangkang side-tab yang sama — jadi tinggal isinya.

### Halaman About — tahap 1 `[x]` — 7/7 blok

Node `69:22` (PRD D33). Dua tahap atas keputusan pengguna; tahap 1 berhenti di
Mission.

| Blok | Node | Status | Catatan |
|---|---|---|---|
| Header | `119:4799` | `[x]` | Menyediakan bandnya sendiri — navbar `fixed`, dan di sini header adalah elemen pertama, bukan hero. Judulnya `SharpeningHeadline` (D37); deskripsi sengaja diam |
| Authority band | `79:616` | `[x]` | `ParallaxLayer speed 8`; tinggi container dikunci `44.27vw` supaya layer absolut tidak merobohkannya |
| Overview | `84:753` | `[x]` | Satu-satunya band putih. Hanya dua blok kanan yang bergerak — lihat catatan |
| Heritage | `88:1163` | `[x]` | Strip melangkah sendiri tiap 1800ms di atas scroll native (D35); data lewat `getHeritageMilestones()` |
| Vision | `102:2793` | `[x]` | Enam layer, lima digambar CSS; hanya tile-nya gambar, dan ia naik bersama glow-nya (D38) |
| Pillars | `107:2847` | `[x]` | Marquee vertikal 30s naik lewat mask tetap |
| Mission | `107:2997` | `[x]` | 4 kartu kaca, `Reveal` bertingkat |

**Yang dipakai ulang tanpa disentuh.** Tidak ada primitif baru yang dibuat:
`Reveal`, `ParallaxLayer`, `EntranceGroup`, `SofteningImage`, `Navbar`, `Footer`,
`cn`, dan token gerak di `lib/utils/motion.ts` semuanya cukup. Itu yang
membuktikan D32 bekerja — `components/about/` dan `content/about/` berdiri
sendiri tanpa menyentuh apa pun milik `home/`.

**Token baru** (`globals.css`): `--color-surface-dark`, `--color-surface-card`,
`--color-ink-body`, `--color-timeline-rule`, `--gradient-gold-text`, skala
tipografi generik delapan token (D34), dan `@keyframes marquee-y`.
`--color-ink-body` dan `--gradient-gold-text` sekalian menggantikan literal yang
sudah ditulis berulang di `home/`; CSS keluarannya identik. `marquee-x` sempat
ada untuk Heritage lalu dihapus bersamanya — tidak ada pemakai lain.

**Gerak, setelah beberapa putaran koreksi pengguna.** Semuanya diminta saat
implementasi pertama sudah jadi:

- **Overview** semula seluruh bandnya bergerak. Sekarang judul kiri diam dan
  hanya STANDARDIZATION & SANCTIONING naik (`y=64`, bukan 40 seperti biasa) —
  karena keduanya satu-satunya yang bergerak, jadi naiknya harus terbaca sendiri
  alih-alih seperti settle. Judul adalah jangkar yang mereka naiki.
- **Heritage** melewati tiga bentuk sebelum yang sekarang: scroller drag/snap
  dengan tombol panah → marquee → **strip melangkah sendiri** (D35). Marquee
  terlalu halus sehingga terbaca sebagai dekorasi; tombol panah membuatnya mati
  sampai ada yang menekan. Sekarang `"use client"` lagi, tapi hanya untuk satu
  `setInterval` di atas scroll native — bukan implementasi ulang scrolling.
  Dwell sempat 3400ms dan diturunkan ke 1800ms atas permintaan pengguna: strip
  berhenti di bawah kursor dan fokus, jadi waktu istirahat cukup untuk menangkap
  satu kartu, bukan untuk membaca tiap katanya.
- **Pillars** semula parallax lewat mask, sekarang marquee vertikal ke atas.
  Mask-nya tetap — memang itu inti section-nya — tapi kini kolomnya yang jalan
  dan jendelanya yang diam.
- **Judul About** semula `Reveal blurFrom`, yang menjernihkan seluruh baris
  sekaligus. Sekarang `SharpeningHeadline`: sapuan per huruf, ramp direset tiap
  baris (D37). Deskripsi di sebelahnya sengaja **tanpa animasi** — dua benda
  tiba berarti tidak ada yang jadi kedatangan.
- **Tile Vision** sempat tidak terlihat bergerak sama sekali melalui dua
  perbaikan yang dikirim tanpa diperiksa mata (tanda `speed`, lalu `anchor`).
  Yang benar ada di D38: glow disatukan ke layer yang sama, dan posisi desain
  diletakkan di tengah rentang, bukan di ujungnya.

Rules putus-putus Heritage sengaja **di luar** scroller: ia adalah tanah yang
dilintasi timeline, dan menggesernya bersama kartu akan membatalkan satu-satunya
petunjuk bahwa ada yang bergerak.

**Cacat copy Figma ditampilkan apa adanya**, dengan `TODO(design)` yang menyebut
node-nya: blok Pillars kedua & ketiga (`104:2798`, `106:2821`) memakai kalimat
yang sama persis, dan `107:2962` tertulis "on all contents". Mengarang teks
pengganti akan lebih buruk daripada menampilkan yang ada dan menandainya.

Tiga aset ternyata salah nama saat diunduh dan diperiksa isinya sebelum ditulis
`alt`-nya (D31 berlaku juga untuk aset baru): jadi
`authority-leadership-group.png`, `vision-globe-tile.png`, dan
`pillars-olympic-rings.png` — yang terakhir sempat bernama
`pillars-tiles-closeup.png` padahal isinya cincin Olimpiade di fasad gedung.

Wiring navigasi: `navigation.ts` dan `footer.ts` menunjuk `/about`; FAQ footer
jadi `/#faq` supaya tetap bekerja dari halaman selain landing.

Verifikasi: `bunx tsc --noEmit` bersih, `bunx eslint src` bersih, `bunx prettier
--check` bersih, `bunx next build` lolos dengan 3 route statis (`/`,
`/_not-found`, `/about`).

- [ ] Sapuan visual 360/768/1440/1920 + reload dengan `prefers-reduced-motion`
      (belum dijalankan)

### Halaman About — tahap 2 `[x]` — 4/4 blok

Empat blok terakhir, dari Mission ke footer. Halaman kini utuh 11 blok.

| Blok | Node | Status | Catatan |
|---|---|---|---|
| Structural Frameworks | `111:3152` | `[x]` | Placeholder desain, dirender apa adanya atas keputusan pengguna — ikon, kalimat, dan `#6c6c6c`-nya. Panel berbatas gradasi ke section berikutnya (D39) |
| Executive Boards | `112:3590` | `[x]` | Carousel di atas `overflow-x` native; `<h2>`-nya prop, bukan dirender client (D41). Data lewat `getBoardMembers()` |
| Sub-Committees | `114:3667` | `[x]` | Grid 3/2/1 kolom. Kartu jadi `<a>` bila punya `href`, `<div>` bila tidak — belum ada yang punya (B2). Data lewat `getSubCommittees()` |
| HQ | `117:3846` | `[x]` | Memakai ulang `feature-hq-composite.png`; nol wash CSS (D22). Kolom teksnya identik S4 — `x525 w870 gap44` |

**Aset dipakai bersama dua halaman.** `feature-hq-composite.png` pindah `home/`
→ `global/` lewat `git mv`, karena `imageRef`-nya sama persis dengan yang dipakai
S4 (RULES §2). Empat potret pengurus diunduh baru ke `about/`; tiga di antaranya
lewat 1 MB dan masuk daftar tunda R10.

**Token baru** (`globals.css`): `--color-ink-placeholder`,
`--text-display-label`, `--text-body-xl`, `--text-heading-section`. Semuanya
generik sesuai D34, dan tiap slope tetap dibagi `cap/1920` empat angka (D25).
`--text-display-label` sengaja **tidak** menumpang `--text-resource-title` yang
angkanya kebetulan sama — nama section S10 di halaman lain akan berbohong.

**Carousel di atas scroll native, sama seperti Heritage.** Tombol panah hanya
menggerakkan `scrollLeft`, jaraknya diukur dari DOM. Posisi diumumkan lewat satu
paragraf `aria-live="polite"`, `snap-proximity` bukan `mandatory` (mandatory
melawan drag), dan `prefers-reduced-motion` dibaca di dalam handler (D15).
Panah kiri dinonaktifkan di awal — `opacity-30`, yang kebetulan persis nilai
yang digambar Figma untuk panah kirinya.

**Dua cacat Figma, dua penanganan berbeda** (D40): judul "Sub-Commitees"
diperbaiki ejaannya; jabatan ganda "SECRETARY GENERAL" dan dua nama komite huruf
kecil dibiarkan terlihat dengan `TODO(design)`.

Verifikasi: `bunx tsc --noEmit` bersih, `bunx eslint src` bersih, `bunx prettier
--check` bersih (`BoardCarousel.tsx` diformat ulang), `bunx next build` lolos —
`/about` tetap prerender statis.

- [ ] Sapuan visual 360/768/1440/1920 + reload dengan `prefers-reduced-motion`
      (belum dijalankan)
- [ ] `board-portrait-02.png` perlu diganti sebelum publikasi — R11

### Halaman Domino `[~]` — 5/6 blok

Halaman ketiga. Item nav "Domino" kini rute sungguhan (`/domino`), jadi pill-nya
menyala sendiri — `isActive` sudah memakai `pathname.startsWith(href)`.

**Desainnya tidak lengkap dan itu sudah diputuskan** (D42). Frame hi-fi
`119:4737` mendeklarasikan 1920×6033 tapi anak-anaknya berhenti di y=2180 — tiga
blok. Wireframe `119:4474` menyebut enam; dua di antaranya dibangun dari
wireframe karena copy-nya lengkap di sana, satu ditunda sebagai R12.

| Blok | Node | Status | Catatan |
|---|---|---|---|
| Header | `119:4809` | `[x]` | Cermin `AboutHeader`; kolom kanan bertingkat dua (subtitle + intro), bukan satu paragraf. Judul menajam per huruf lewat `SharpeningHeadline` |
| Tile band | `131:4824` | `[x]` | Cermin `AuthorityBand`: pembungkus tinggi terkunci, layer `-inset-y-[6%]`, `priority` |
| Format split | `207:15563` | `[x]` | Perak/emas dengan **satu figur membelah jahitannya**. Judul panel doubles dibetulkan, body dibiarkan duplikat (D44) |
| Download & Regulations | `119:4581` (wireframe) | `[x]` | Tanpa hi-fi. Tiga dokumen lewat `getResources(category)`; empat referee guidelines tetap copy |
| FAQ | `119:4634` (wireframe) | `[x]` | Tanpa hi-fi. Section putih penuh, bukan kartu — itu yang digambar wireframe. Dua dari tiga jawaban placeholder (B2) |
| Official Game Rules | `119:4553` (wireframe) | `[!]` | **Tidak dibangun** — R12. Hi-fi tidak digambar dan lima dari tujuh tabnya berlabel "SCORING" duplikat |

**Jahitan format split — bagian yang paling mudah salah.** Kedua panel menaruh
`imageRef` yang **sama** (`8c88e9f6`), kiri di `x625` dan kanan di `x−255`; dalam
koordinat section keduanya jatuh di 705. Jadi itu satu figur, masing-masing panel
memotong bagiannya. Offsetnya dinyatakan sebagai persen **lebar panel**
(`71.02%` vs `−28.98%`, selisih persis 100%) bukan px, supaya jahitannya tetap
bertemu di bawah 1920 — dan kedua separuh berbagi `speed` yang sama, sehingga
scroll tidak pernah merobeknya. Di bawah `lg` figurnya dilepas: jahitan yang jadi
alasannya sudah tidak ada.

**Tiga promosi keluar dari folder halaman** (D43) — konsekuensi RULES §2/D32 yang
baru bisa ketahuan begitu ada halaman kedua yang memakainya:
`SharpeningHeadline` → `components/motion/`, `FaqAccordion` → `components/ui/`,
`about/vision-globe-tile.png` → `global/globe-tile.png`. Ikutannya tipe
`FaqItem`/`FaqSegment` pindah dari `content/home/faq.ts` ke komponennya, karena
`content/domino/faq.ts` kalau tidak harus mengimpor dari folder copy halaman
lain.

**Data & token.** `getResources()` diberi parameter kategori opsional — tanpa
argumen perilakunya tidak berubah, jadi `Resources` di home tidak disentuh; tiga
entri mock baru (satu Rulebook, dua Regulations, semua `fileUrl: "#"` sampai
PDF-nya ada). Satu token warna baru: `--color-surface-silver` untuk stop bawah
gradient panel perak. **Nol token tipografi baru** — skala generik yang
ditambahkan waktu About memang untuk ini.

Aset: satu berkas, `domino/band-table-match.png` 2.8 MB — terbesar di repo dan
`priority`, masuk daftar tunda R10. Figur pembelah tidak diunduh; itu berkas yang
sama dengan tile Vision.

Verifikasi: `bunx tsc --noEmit` bersih, `bunx eslint src` bersih, `bunx prettier
--check` bersih (`FormatPanel.tsx` dan `content/domino/regulations.ts` diformat
ulang), `bunx next build` lolos — `/domino` prerender statis. Grep path basi
setelah tiga pemindahan: `src/` bersih.

- [ ] Sapuan visual 360/768/1440/1920, termasuk jahitan format split di 1440 &
      1920 dan saat di-scroll (belum dijalankan)
- [ ] Reload `/domino` dengan `prefers-reduced-motion` aktif — pastikan tidak ada
      *hydration failed* (belum dijalankan)
- [ ] Dua jawaban FAQ dan tiga `fileUrl` masih placeholder — B2
- [ ] Blok Official Game Rules menunggu desain — R12

### Halaman Development `[x]` — 9/9 blok

Halaman keempat, node `190:13600` (PRD §5). Item nav "Development" kini rute
sungguhan (`/development`), jadi pill-nya menyala sendiri.

**Hi-fi lengkap**, tidak seperti Domino — kesembilan blok digambar, jadi tidak
ada yang ditunda dan tidak ada yang dibangun dari wireframe.

| Blok | Node | Status | Catatan |
|---|---|---|---|
| Header | `190:13657` | `[x]` | Cermin `AboutHeader`; judul Inter 84 menajam per huruf lewat `SharpeningHeadline` |
| Band ruang kelas | `190:13660` | `[x]` | Cermin `AuthorityBand`: pembungkus tinggi terkunci, layer `-inset-y-[6%]`, `priority`. `opacity-80` milik Figma, bukan wash CSS |
| Youth Development | `190:13662` | `[x]` | Satu-satunya band putih. Judul hitam, bukan gradien emas — kontras (RULES §10) |
| Official Certifications | `190:13674` | `[x]` | Gradient `bg → surface-dark`. Tangga level menyatukan strip titik ke tiap baris — lihat catatan |
| Educational Resources | `192:14833` | `[x]` | Memakai ulang `ResourceCard` yang dipromosikan ke `ui/` (D46); data lewat `getResources("Development")` |
| Grassroots Initiatives | `192:14877` | `[x]` | Satu-satunya section rata tengah; 3 kartu 32px radius dengan foto 3:4 di kakinya |
| Development News | `207:15528` | `[x]` | 4 berita lewat `getLatestNews(4, "Development")`; badge panah sama persis dengan S8 |
| Federation Support Programs | `202:15013` | `[x]` | Daftar tick + kartu form putih. Tombol submit diekstrapolasi (D48) |
| CTA akhir | `207:15320` | `[x]` | Bebas 126 + `SilverCta`, berdiri di atas shine |

**Catatan tangga sertifikasi.** Figma menggambar ini sebagai **dua kolom yang
kebetulan sejajar**: strip 116px berisi tiga titik dan tiga garis putus-putus,
lalu kolom teks berisi tiga blok. Kesejajaran itu hanya bertahan selama tiap
blok setinggi yang diberi desain — dan itu berhenti benar begitu satu body
membungkus ke jumlah baris yang berbeda, yang di sini terjadi di tiap lebar.
Jadi strip-nya dilipat **ke dalam** tiap baris: satu daftar, satu item per
level, tiap item sebuah gutter dan sebuah blok. Titiknya duduk di puncak
barisnya sendiri dan garisnya mengisi sisa tinggi lewat `flex-1`, jadi sumbunya
dibangun dari isi, bukan diukur terhadapnya. Garisnya digambar per item, bukan
satu garis menerus, dan itu memang desainnya: `192:14726` memudar jadi nol di
kedua ujung sepanjang segmen 180px, jadi 52px antar blok memang dimaksudkan
kosong. Seluruh gutter `aria-hidden` — daftarnya sudah mengumumkan tiga item
berurutan, dan titik yang dibacakan tidak menambah apa pun.

**Cacat yang ditemukan saat membangun, di kode yang sudah ada.** `Reveal`
dengan `blurFrom` **merender anaknya dua kali** — itu memang cara cross-fade-nya
bekerja — jadi `id` di dalamnya masuk DOM dua kali dan `aria-labelledby`
menunjuk salinan yang `aria-hidden`. Terdeteksi dengan menghitung
`id="*-heading"` pada HTML terender: `grassroots-heading` muncul dua kali.
Diperbaiki dengan melepas `blurFrom` dari dua heading yang memikul `id`;
konvensinya ditulis di RULES §11.

**Perbaikan S10 yang ikut terbawa** (D45). `Resources` memanggil
`getResources()` tanpa argumen dan menggambar apa pun yang kembali, jadi grid
2×2-nya sudah diam-diam jadi **tujuh kartu** sejak halaman Domino menaruh tiga
dokumen di rak yang sama — dan empat dokumen Development akan membuatnya
sebelas. `getResources` sekarang menerima `limit` dan S10 meminta empat.
Terverifikasi di HTML terender: hanya keempat dokumen desainnya yang muncul.

**Tiga promosi/penambahan ke `ui/` dan `lib/`** (D46): `ResourceCard` dan
`PageShine` keluar dari `components/home/`, dan `formatLongDate` ditambahkan ke
`lib/utils/date.ts` di samping `formatEventDate` yang sudah ada — tanggal
perpustakaan dan tanggal berita memakainya berdua. Rasio `PageShine` dikirim
sebagai **nama class literal**, bukan angka, karena Tailwind mengekstrak utility
dengan memindai teks sumber.

**Token baru** (`globals.css`): `--radius-panel` (24), `--radius-feature` (32),
`--text-display-caption` (Bebas 32), `--text-display-item` (Bebas 24),
`--text-heading-card` (Inter 40), `--text-body-2xl` (Inter 64). Tiap slope tetap
`cap/1920` empat angka (D25). `--text-display-year` dipakai ulang untuk nama
grade dan komentarnya diperluas, bukan diganti namanya — mengganti nama token
hidup berarti menyunting tiap call site tanpa hasil.

**Cacat copy Figma ditampilkan apa adanya**, dengan `TODO(design)` yang menyebut
node-nya (D40): kartu grassroots pertama dan ketiga berbagi kicker "Community"
(`192:14935`/`192:14948`) padahal yang ketiga platform digital; paragraf
Federation Support Programs (`205:15050`) adalah paragraf Public Plaza Play
persis. Sebaliknya satu salah ketik **dibetulkan** — "Download CURRICULuM PDF"
(`190:14529`), huruf kecil nyasar di kata yang ejaannya sudah pasti.

Data: empat dokumen `Development` baru di `MOCK_RESOURCES` (satu `zip` — tipe
itu ditambahkan ke union saat halaman ini disiapkan). Empat berita Development
sudah ada sejak sesi sebelumnya. Aset: sembilan berkas, empat di antaranya lewat
1 MB dan masuk daftar tunda R10; nol aset yatim.

Verifikasi: `bunx tsc --noEmit` bersih, `bunx eslint src` bersih, `bunx prettier
--check` bersih, `bunx next build` lolos — `/development` prerender statis,
lima route seluruhnya. `/`, `/about`, `/domino` tetap HTTP 200 setelah dua
promosi komponen.

- [ ] Sapuan visual 360/768/1440/1920 (**belum dijalankan** — sesi ini tidak
      punya alat otomasi browser; blok yang paling perlu dilihat: tangga
      sertifikasi, baris 2×2 berita di sekitar `menu`, dan kartu form di bawah
      `menu`)
- [ ] Reload `/development` dengan `prefers-reduced-motion` aktif — pastikan
      tidak ada *hydration failed* (belum dijalankan)
- [ ] `downloadHref` kurikulum dan empat `fileUrl` masih `#` — B2
- [ ] Tombol submit form menunggu konfirmasi desainer — D48

---

### Halaman News `[x]` — 6/6 blok

Halaman kelima, node `156:7512` (PRD §5). Item nav "News" kini rute sungguhan
(`/news`), jadi pill-nya menyala sendiri — tersisa empat placeholder `#`
(Tournaments, Members, Governance, Integrity).

**Node-nya digali dari kanvas, bukan dari URL** (D33). Ada empat frame `screen`
tak bernama di file ini dan yang membedakannya hanya teks header: `156:7154`
ternyata **Gallery** ("Search Event"), `176:11563` ternyata **FAQ**. Yang benar
menulis "Federation News" dan "Search News".

**Wireframe menyebut tujuh section, hi-fi menggambar enam.** Yang absen adalah
"Newsletter Subscription", dan itu **tidak** ditunda seperti D42 — footer situs
sudah memuatnya sejak S14, jadi membangunnya lagi berarti menggandakan kontrol.

| Blok | Node | Status | Catatan |
|---|---|---|---|
| Header | `156:7513` | `[x]` | Cermin `DevelopmentHeader`; slot kanan diisi search, bukan paragraf intro — itu desainnya |
| Featured band | `156:7584` | `[x]` | Carousel 1920×850, **tidak** berjalan sendiri; cross-fade `opacity` saja, hanya cerita aktif yang di-mount |
| Arsip | `163:8233` | `[x]` | Tab = tautan `?category=`, difilter di server; label tab dari feed, bukan dari desain (D50) |
| Press Releases | `168:8475` | `[x]` | `getResources("Press Release")` — `ResourceDocument` dipakai ulang (D51) |
| Publications | `168:8582` | `[x]` | Kartu 560×488 bersampul; `coverImageUrl` satu-satunya field baru |
| Media Gallery | `168:8680` | `[x]` | Collage 5 kolom yang sengaja meluber ke kanan; badge play **dekorasi**, bukan kontrol (B2) |

**Catatan featured band.** Ia **tidak berpindah sendiri**, dan itu keputusan
sadar yang berlawanan dengan roda stats dua halaman sebelumnya. Desain hanya
menggambar tombol prev/next dan sebuah penghitung — tidak ada isyarat auto-play
— tapi alasan sebenarnya lebih dalam: sebuah angka adalah lirikan dan boleh
bergantian, sedangkan sebuah headline adalah kalimat, dan copy yang menggeser
di tengah bacaan adalah copy yang tak pernah selesai dibaca. Gambarnya
cross-fade, bukan menggeser: hanya `opacity` yang dianimasikan (RULES §12), dan
hanya cerita aktif yang di-mount — enam foto selebar 1920 yang ditumpuk lalu
di-fade berarti mengunduh keenamnya untuk menampilkan satu, jadi
`AnimatePresence` cuma menahan yang keluar selama fade. Penghitungnya membaca
total dari feed, bukan angka enam yang ditulis desain: itu hitungan benda, dan
hitungan yang ditulis ke dalam halaman salah pada saat federasi menandai cerita
ketujuh.

**Catatan arsip.** Filternya **tautan, bukan state** — tiap tab `<a>` ke
`?category=`, `getLatestNews` memfilter di server, seluruh section tetap Server
Component, dan arsip terfilter jadi tautan yang bisa dikirim ke orang lain
(D50). Label tabnya datang dari `getNewsCategories()`, bukan dari kelima nama
yang ditulis Figma: kosakata desain (DWF, Tournaments, Members) dan kosakata
feed (Tournament, Governance, Federation, Ranking, Officiating) berbeda, jadi
daftar desain akan mencetak tab yang memfilter ke nol sambil menyembunyikan
kategori yang berisi artikel. "View more" dulu menaikkan `?show=` enam-enam;
itu **dicabut** begitu `/news/all` dibangun, karena layar itulah tujuan yang
dimaksud desain (D58) — sekarang blok ini menampilkan enam dan tombolnya
membuka arsip, membawa serta filternya. Karena halaman membaca `searchParams`,
`/news` dirender **dinamis** (`ƒ`).

**Catatan galeri.** Collage-nya meluber ke kanan **sesuai desain**: section
dipadding `80px 0 0 80px` tanpa sisi kanan, dan lima kolom 400px dengan empat
gutter 16px berjumlah 2064 melawan 1840 yang disisakan margin kiri — jadi kolom
terakhir sudah terpotong viewport di lebar desainnya sendiri. Diturunkan sebagai
scroller, bukan potongan: gambar yang sama pada ukuran yang sama, dengan
sisanya bisa dijangkau. Badge play-nya `aria-hidden` dan tile-nya `<figure>`,
bukan tombol — belum ada yang bisa diputar (B2), dan tombol play yang tidak
melakukan apa-apa adalah no-op diam yang justru dilarang D28.

**Copy yang dibetulkan dan yang dibiarkan** (garis D40/D44). Dibetulkan: "026
world cup" jadi "2026" dan "Dqf quarter 1 review" jadi "DWF" — keduanya kata
yang sudah pasti. Dibiarkan: judul featured berbunyi "World Championships
**2024**" sementara tanggalnya AUG 12 **2026**, dan empat kartu grid memuat
headline yang sama persis — itu pertentangan dan paste yang belum diganti,
keputusan desainer. Tanggal press release **tidak** dibiarkan: Figma mencetak
"May 12, 2023" di keempat kartu, dan tidak seperti judul yang berulang, empat
baris bertanggal sama terbaca sebagai daftar yang gagal dimuat — tanggal di sini
data, seperti di seluruh `mock/`, jadi disebar ke masa kini situs.

**Aset halaman ini bukan foto domino — R13.** Lima dari enam gambar grid dan
seluruh tile galeri adalah foto pers turnamen catur sungguhan (FIDE Olympiad
Budapest 2024 dan lainnya), dan sampul kartu publikasi adalah dokumen pindaian
milik organisasi lain. **Dipasang apa adanya atas keputusan pengguna.** Yang
tetap dilakukan: nama berkas menyebut isi foto yang sebenarnya, dan `alt`-nya
menggambarkan yang terlihat tanpa menyebut nama, negara, atau ajang siapa pun.

Verifikasi: `bunx tsc --noEmit` bersih, `bunx eslint src` bersih, `bunx next
build` lolos. `/news`, `/news?category=...` dan `/news?show=12` ketiganya HTTP
200; terhitung di HTML: 6 kartu grid, 7 tile galeri, 7 tab dengan 1 aktif.

- [ ] Sapuan visual 360/768/1440/1920 — termasuk luberan collage dan bungkus
      kartu dokumen di 1440 (belum dijalankan)
- [ ] Reload `/news` dengan `prefers-reduced-motion` aktif — pastikan tidak ada
      *hydration failed* (belum dijalankan)
- [ ] Search menolak dengan terang, `fileUrl` masih `#`, tile galeri belum bisa
      diputar — B2
- [ ] Aset foto menunggu keputusan pra-publikasi — R13

### Halaman Terms & Conditions `[x]` — 3/3 blok

Halaman keenam, node `174:11162` (PRD §5). **Node-nya ada di dalam SECTION**
`185:13581`, bukan di level kanvas seperti lima halaman sebelumnya — jadi ia
tidak muncul saat menelusuri kanvas dan harus dicari ke dalam section.

| Blok | Node | Status | Catatan |
|---|---|---|---|
| Header | `174:11163` | `[x]` | Pola band yang sama + dua tambahan khas layar legal: tautan "Back" dan tanggal dokumen di baseline judul |
| Table of Contents | `174:11225` | `[x]` | Sticky; penanda aktif mengikuti scroll lewat `IntersectionObserver` (D53). Kartu "Need Support?" di kakinya |
| Isi dokumen | `174:11257` | `[x]` | Kartu putih radius 20, sembilan klausa dipisah rule 4px |

**Catatan penanda daftar isi.** Figma hanya bisa menggambar satu state, jadi ia
mengecat klausa pertama sebagai aktif — dan menurunkannya apa adanya memberi
halaman penanda yang tidak pernah bergerak, yang lebih buruk daripada tanpa
penanda: ia menyatakan "Anda di klausa 1" sepanjang dokumen 3553px. Dilacak
`IntersectionObserver`, bukan handler scroll, dengan pita sempit di puncak
viewport. Bila pita sesaat tidak memuat klausa mana pun, penandanya **menahan
jawaban terakhir** alih-alih padam (D53).

**Catatan penomoran.** Figma mengetik kesembilan judul sebagai "1." — di badan
maupun di daftar isi. Itu artefak daftar bernomor, bukan sembilan klausa yang
semuanya klausa satu, dan sekelas dengan empat press release bertanggal sama di
halaman News. Nomornya diambil dari posisi di array, jadi badan dan daftar isi
tak mungkin berselisih.

Klausanya disimpan sebagai **copy, bukan data** (`content/terms/sections.ts`) —
dokumen hukum bukan feed. Email penutupnya `contact@dwf-domino.org` **well
formed**, tidak seperti `community@dwf-org` milik footer, jadi ia dirender
sebagai `mailto:` — persis syarat yang disebut catatan footer sendiri.

Komponennya **tetap di `components/terms/`**, belum dipromosikan: D32 minta
komponen pindah saat halaman kedua benar-benar memakainya, dan Privacy belum
dibangun.

### Halaman Contact `[x]` — tanpa desain, R14

Halaman ketujuh, dan **satu-satunya yang tidak punya layar Figma**. Desain
menggambar sepuluh layar dan contact bukan salah satunya; yang ada cuma tombol
CONTACT US dan satu kalimat di kartu "Need Support?" sidebar Terms
(`174:11252`).

Yang **punya sumber** dan tidak dikarang:

| Bagian | Sumber |
|---|---|
| Intro header | Verbatim `174:11254` |
| Lima topik form | Lima jenis pertanyaan yang disebut kalimat itu, urutannya |
| Email | Klausa penutup Terms (`174:11543`) |
| Alamat pos | Footer, lewat `content/federation.ts` |
| Chrome form | `SupportForm` halaman Development |

Yang **dikarang**: susunan halaman, judul tiap blok, dan label field —
ditandai `TODO(design)`, dicatat R14. Ini D48 pada skala jauh lebih besar: di
sana yang diekstrapolasi sebuah tombol, di sini seluruh halaman.

Dua promosi menyusul aturan D32/D43, **pemakai kedua bukan tebakan**:
`SupportForm.Field` → `ui/FormField` (tanpa perubahan, plus varian `multiline`),
dan alamat pos → `content/federation.ts`. Email **tidak** ikut: desain memberi
dua alamat berbeda dan menyatukannya berarti memutuskan mana yang dipakai
federasi. Pemilih topik memakai `<select>` bawaan, bukan listbox buatan —
mengarang chrome satu hal, mengarang perilaku keyboard hal lain.

Form-nya **menolak dengan terang** dan menunjuk ke alamat email (D28, B2) —
ketiga kalinya situs ini mengambil keputusan itu, setelah newsletter footer dan
form bantuan Development.

Verifikasi keduanya: `bunx tsc --noEmit` bersih, `bunx eslint src` bersih,
`bunx next build` lolos — `/terms` dan `/contact` keduanya prerender statis.
Keduanya HTTP 200; terhitung di HTML `/terms`: 9 anchor klausa unik, 9 tautan
daftar isi, penomoran 1–9 benar. `/contact`: kelima topik ada, `mailto:` ada.
Footer ikut diperbarui — "Terms" kini `/terms` dan "News" kini `/news` (yang
kedua terlewat saat halaman News mendarat).

- [ ] Sapuan visual 360/768/1440/1920 untuk kedua halaman (belum dijalankan)
- [ ] Uji penanda daftar isi saat di-scroll dan dengan `prefers-reduced-motion`
      (belum dijalankan)
- [ ] Layar contact perlu ditinjau desainer sebelum publikasi — R14
- [ ] Privacy Policy (`174:10759`) dan FAQ (`173:9459`) sudah digambar, belum
      dibangun

### Halaman Gallery `[x]` — 3/3 blok

Halaman kedelapan, node `156:7154` (PRD §5). Halaman **kedua** yang memakai
cangkang side-tab milik layar legal.

| Blok | Node | Status | Catatan |
|---|---|---|---|
| Header | `156:7155` | `[x]` | Satu-satunya header di file yang membawa **keduanya** — tanggal di baseline judul (pola legal) dan field search (pola News) |
| Kolom event | `156:7217` | `[x]` | Lima tab = tautan `?event=`, difilter di server (pola D50). Kartu Need Support di kakinya |
| Album | `156:7235` dst | `[x]` | Tiga collage 4×2 + satu still film lebar; bentuknya diturunkan dari jumlah isi, bukan field (D56) |

**Dua promosi, dan yang penting adalah apa yang TIDAK ikut.** Kartu "Need
Support?" Gallery sama kata per kata dengan milik Terms, dan baris side-tab-nya
sama piksel per piksel — keduanya naik ke `ui/SupportCard` dan `ui/SideTabs`
(D55). Yang tidak ikut naik adalah artinya: kolom Terms daftar isi yang
menandai posisi pembaca lewat `IntersectionObserver`, kolom Gallery filter yang
menulis ulang halaman lewat URL. Jadi yang dibagi rupanya saja; `SideTab`
bahkan menerima `current` (`"page"` lawan `"true"`) karena keduanya menjawab
pertanyaan `aria-current` yang berbeda. `ui/SideTabs` sengaja **tanpa**
`"use client"` supaya kolom client dan kolom server sama-sama bisa memakainya.

**Catatan collage.** Empat kolom, dua baris, tile video `row-span-2` — lalu
auto-placement CSS menjatuhkan sisa fotonya persis ke sel yang digambar Figma,
jadi tidak ada satu sel pun yang diposisikan tangan. Satu hal desain yang tidak
ditiru: collage-nya 1648 lebar melawan 1452 yang disediakan kolomnya, jadi di
1920 ia meluber ke kanan. Meluberkan **grid** membuat kolom keempatnya separuh
tersembunyi selamanya — beda dari strip halaman News yang bisa didorong — jadi
grid-nya dipaskan ke kolom. Komposisi, gutter dan tinggi baris tetap milik
desain; hanya lebar kolomnya yang lentur.

**Copy yang dibetulkan dan yang dibiarkan.** Dibiarkan: ketiga album turnamen
membawa set foto yang **sama persis** — itu desainnya, dan file-nya cuma punya
enam foto untuk empat album, jadi tidak ada yang lain untuk diberikan
(TODO(design), R13). Dibetulkan: judul album Tokyo. Judul section-nya berbunyi
"world championship - tokyo 2026" sementara tab sidebar-nya sendiri berbunyi
"asian masters - tokyo 2026", dan tanggalnya sama persis dengan London sampai
ke harinya — kedua-duanya paste dari section pertama. Satu string memberi makan
tab dan judul di sini, jadi salah satu harus menang: tab yang menang, karena
tiga dari empat album bernama "World Championship" membuat indeksnya tak
berguna. Tanggalnya digeser lebih awal supaya urutan menurun yang disusun
desain tetap berlaku.

**Aset dipindah ke `global/`.** Ketujuh foto galeri tadinya di `assets/news/`;
sejak halaman ini menyusunnya ulang jadi collage per event, keduanya memakai
berkas yang sama, jadi ia pindah ke `assets/global/` — pola D43, dan `news/`
sebagai nama folder untuk sesuatu yang dipakai dua halaman adalah label yang
keliru. Satu aset baru: `gallery/film-global-final-arena.png`, **satu-satunya
foto galeri yang benar-benar domino** — tapi ia cuma 512×279 di slot 1292×726,
jadi akan terlihat lunak.

Verifikasi: `bunx tsc --noEmit` bersih, `bunx eslint src` bersih, `bunx next
build` lolos — `/gallery` dinamis (`ƒ`) karena membaca `searchParams`, seperti
`/news`. Terhitung di HTML: `/gallery` 4 judul album, 18 `<figure>`, 7 badge
play sungguhan, 1 tab aktif; `?event=the-silent-war` 1 album dan **nol** tautan
"buka album" (tidak ada yang bisa dibuka saat halaman sudah album itu);
`?event=nope` menampilkan pesan kosong dengan daftar tab tetap utuh sebagai
jalan keluar. Footer "Gallery" kini `/gallery`.

- [ ] Sapuan visual 360/768/1440/1920 — terutama collage di 768 saat grid jatuh
      ke dua kolom (belum dijalankan)
- [ ] Tile video dan still film belum bisa diputar — B2
- [ ] `film-global-final-arena.png` 512×279 di slot 1292×726 — minta aset
      resolusi penuh ke desainer

### Halaman Privacy Policy `[x]` — 3/3 blok

Halaman kesembilan, node `174:10759` (PRD §5), di dalam SECTION `185:13580`.

**Layar Terms dengan delapan klausa berbeda di dalamnya** — header, kolom
daftar isi, kartu putih, rule 4px, semuanya sama persis. Itu yang membuktikan
`LegalDocument` layak diangkat (D57): rutenya kini benar-benar copy plus satu
komponen, dan kedua halaman tidak bisa lagi menyimpang seperti dua salinan
buatan tangan.

Penomoran dan penanda daftar isi mewarisi perlakuan Terms (D53): Figma
mengetik kedelapan judul sebagai "1." di badan **dan** di daftar isi, dan
nomornya diambil dari posisi array.

TODO(design): klausa 8 menaruh sekretariat di "Maison du Sport International,
Lausanne, Switzerland" sementara footer memberi alamat federasi di Evans Rd,
Singapore. Dua kantor pusat berbeda dalam satu desain — dibiarkan (D44).

### Halaman All News `[x]` — rute `/news/all`

Halaman kesepuluh, node `185:13184` (PRD §5). Blok arsip halaman News dalam
ukuran penuh: dua kolom kartu alih-alih tiga, filter kategori pindah ke kolom
samping, tautan "Back" ke `/news`.

**Kartunya tidak butuh apa pun yang baru.** Figma menggambarnya 676×380 di sini
dan 572×322 di halaman News — dua angka berbeda, tapi rasionya sama
(1,779 lawan 1,776), jadi `NewsGridCard` dipakai apa adanya.

**Keberadaannya mencabut `?show=`** (D58). Waktu blok arsip dibangun, "View
more" harus melakukan sesuatu dan tidak ada tujuan yang digambar, jadi ia
menumbuhkan `?show=` enam-enam dengan plafon 60 — mekanisme karangan lengkap
dengan validasi untuk angka yang bisa diketik orang asing. Layar ini ternyata
**adalah** tujuan itu. Sekarang satu mekanisme, dan filternya ikut berjalan
supaya membuka arsip dari grid terfilter tidak membuang filternya.

**Copy yang dibetulkan.** Placeholder search-nya di Figma berbunyi "Search
Event" (`185:13193`) — itu string header Gallery yang di-paste ke arsip berita.
"Event" salah tentang isi halaman ini, jadi ia memakai "Search News" seperti
induknya (D40). Tetap menolak dengan terang: belum ada endpoint search (B2).

**Tiga cangkang diangkat** (D57), karena empat halaman kini memakai bentuk yang
sama: `ui/PageHeader` (band header dengan tiga slot opsional — Back, tanggal,
search), `ui/SideTabLayout` (dua kolom 468+1452, sidebar kedua di source dan
ditarik dengan `order`), dan `components/legal/LegalDocument`. Header bergaya
landing di About, Domino, Development, News dan Contact **tidak** ikut: bentuknya
judul-plus-intro dan tak satu pun pernah butuh Back atau tanggal.

Verifikasi keduanya: `bunx tsc --noEmit` bersih, `bunx eslint src` bersih,
`bunx next build` lolos — `/privacy` prerender statis, `/news/all` dinamis
karena membaca `searchParams`. Terhitung di HTML: `/privacy` 8 klausa dengan
penomoran 1–8 benar dan satu `mailto:`; `/news/all` 11 kartu (seluruh mock) dan
1 tab aktif, `?category=Development` menyisakan 5. `/news` sudah tidak memuat
`?show=` sama sekali, "View more"-nya menunjuk `/news/all`, dan "See all media"
kini menunjuk `/gallery`. Footer "Privacy" → `/privacy`.

- [ ] Sapuan visual 360/768/1440/1920 untuk kedua halaman (belum dijalankan)
- [ ] FAQ (`173:9459`) sudah digambar di cangkang yang sama, belum dibangun

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
| 2026-08-22 | Empat aset diganti nama agar menyebut isinya, dua ikon generik pindah ke `global/`, dua aset mati dihapus (~1.6 MB) — PRD R5 tertutup (D31) |
| 2026-08-22 | Komponen dikelompokkan per halaman: `home/`, `layout/`, `motion/`, `ui/`; `content/home/` mengikuti. `ui/` dari 16 file jadi 3 (D32) |
| 2026-08-22 | Node About dicari dari isi layar setelah `node-id` pada URL terbukti tidak ada — halamannya `69:22` (D33) |
| 2026-08-22 | Skala tipografi generik ditambahkan untuk halaman non-landing; token home tetap bernama per-section (D34) |
| 2026-08-22 | Halaman About tahap 1 selesai — 7 blok, rute `/about`, tanpa primitif baru; navigasi navbar & footer disambungkan |
| 2026-08-22 | Heritage & Pillars diubah jadi marquee CSS atas permintaan pengguna — keduanya kembali jadi Server Component tanpa state (D35, D36) |
| 2026-08-22 | Overview dikurangi geraknya: judul kiri diam, hanya dua blok kanan yang naik (`y=64`) |
| 2026-08-22 | Heritage keluar dari marquee: terlalu halus, terbaca sebagai dekorasi. Tombol panah dicoba lalu dibuang — timeline bukan panel kontrol. Jadi strip melangkah sendiri di atas scroll native, dwell 3400ms → 1800ms (D35) |
| 2026-08-22 | Judul About jadi `SharpeningHeadline` — sapuan blur per huruf, ramp direset tiap baris; deskripsinya sengaja diam (D37) |
| 2026-08-22 | Tile Vision: glow disatukan ke layernya dan posisi desain dipindah ke tengah rentang gerak, setelah dua perbaikan sebelumnya dikirim tanpa diperiksa mata dan keduanya meleset (D38) |
| 2026-08-22 | Halaman About tahap 2 selesai — Structural Frameworks, Executive Boards, Sub-Committees, HQ. Halaman utuh 11 blok (D39, D40, D41) |
| 2026-08-22 | `feature-hq-composite.png` pindah ke `global/` — `imageRef` yang sama dipakai S4 dan section HQ About |
| 2026-08-22 | R11 dibuka: potret pengurus kedua adalah foto tokoh publik nyata, harus diganti sebelum publikasi |
| 2026-08-22 | Halaman Domino selesai 5/6 blok — header, tile band, format split, regulations, FAQ. Rute `/domino`, pill nav menyala (D42, D44) |
| 2026-08-22 | Tiga promosi keluar dari folder halaman: `SharpeningHeadline` → `motion/`, `FaqAccordion` → `ui/`, tile globe → `global/`; tipe FAQ ikut pindah ke komponennya (D43) |
| 2026-08-22 | R12 dibuka: blok Official Game Rules tidak dibangun — hi-fi tidak digambar, lima dari tujuh tab wireframe berlabel duplikat |
| 2026-08-24 | Halaman Development selesai 9/9 blok — hi-fi lengkap, tidak ada yang ditunda. Rute `/development`, pill nav menyala |
| 2026-08-24 | S10 diperbaiki: grid 2×2-nya diam-diam sudah jadi tujuh kartu sejak dokumen Domino masuk rak yang sama. `getResources` menerima `limit`, S10 meminta empat (D45) |
| 2026-08-24 | `ResourceCard` dan `PageShine` dipromosikan ke `ui/`; rasio shine dikirim sebagai class literal karena Tailwind memindai teks sumber (D46) |
| 2026-08-24 | Shine `/development` dipaku ke dasar halaman, bukan ke grup di kakinya — tidak ada blok konten yang keluar dari `<main>` (D47) |
| 2026-08-24 | Tombol submit kartu aplikasi diekstrapolasi; desain hanya menggambar dua field lalu berhenti (D48) |
| 2026-08-24 | Bug lama ditemukan: `Reveal blurFrom` merender anaknya dua kali, jadi `id` di dalamnya ganda dan `aria-labelledby` menunjuk salinan `aria-hidden`. Konvensi ditulis di RULES §11 |
| 2026-08-24 | Putaran roda S5 ditukar dari kurva easing halaman ke spring — detent yang menangkap track di tiap notch, bukan geseran halus; `TURN` jadi anggaran settle, bukan lama transisi (D49) |
| 2026-08-24 | Halaman News selesai 6/6 blok — node `156:7512` digali dari kanvas setelah dua screen tak bernama ternyata Gallery dan FAQ (D33). Rute `/news`, pill nav menyala |
| 2026-08-24 | Arsip berita difilter lewat URL, bukan state client; label tab dari feed karena kosakata desain dan kosakata data berbeda (D50) |
| 2026-08-24 | Press release & publikasi memakai ulang `ResourceDocument`; galeri media jadi tipe sendiri karena bukan daftar headline (D51) |
| 2026-08-24 | R13 dibuka: foto halaman News adalah foto pers turnamen catur dan sampul publikasi adalah dokumen organisasi lain — dipasang apa adanya atas keputusan pengguna, harus selesai sebelum publikasi |
| 2026-08-24 | Halaman Terms & Conditions selesai — node `174:11162` ditemukan di dalam SECTION, bukan di level kanvas. Penanda daftar isi mengikuti scroll; penomoran klausa dari posisi, bukan dari string yang semuanya "1." (D53) |
| 2026-08-24 | Halaman Contact dibangun **tanpa layar desain**, dari satu kalimat di kartu Need Support (D54). R14 dibuka — perlu ditinjau desainer sebelum publikasi |
| 2026-08-24 | `SupportForm.Field` dipromosikan ke `ui/FormField` dan alamat pos ke `content/federation.ts` — keduanya karena pemakai kedua muncul (D32/D43) |
| 2026-08-24 | Footer: "Terms" → `/terms`, "News" → `/news`; yang kedua terlewat saat halaman News mendarat |
| 2026-08-24 | Halaman Gallery selesai — empat album, filter event lewat `?event=` di server (pola D50). Bentuk album diturunkan dari jumlah isi, bukan field layout (D56) |
| 2026-08-24 | `SupportCard` dan chrome side-tab dipromosikan ke `ui/` pada pemakai kedua; logikanya sengaja tidak ikut — daftar isi lawan filter (D55) |
| 2026-08-24 | Tujuh foto galeri pindah `assets/news/` → `assets/global/` karena kini dipakai dua halaman (pola D43); footer "Gallery" → `/gallery` |
| 2026-08-24 | Halaman Privacy Policy selesai — layar Terms dengan delapan klausa berbeda; `LegalDocument` diangkat sehingga kedua rute tinggal copy plus satu komponen (D57) |
| 2026-08-24 | Halaman All News selesai (`/news/all`) — `NewsGridCard` dipakai apa adanya karena rasio kartunya sama di kedua lebar |
| 2026-08-24 | `?show=` halaman News **dicabut**: "View more" kini membuka `/news/all`, tujuan yang memang digambar desain (D58) |
| 2026-08-24 | Tiga cangkang diangkat ke `ui/` dan `legal/`: `PageHeader`, `SideTabLayout`, `LegalDocument` (D57). Footer "Privacy" → `/privacy`; "See all media" → `/gallery` |
| 2026-08-24 | Sumber desain pindah ke file Figma `(NEW)` `p1W8bEWU5w3cRYROFNQwKh` — dua belas halaman kini dalam SECTION bernama; node layar yang sudah dibangun terbawa utuh, hanya All News berganti nomor (D59) |
| 2026-08-24 | R12 turun jadi menunggu implementasi: hi-fi Domino menggambar tuntas 8 blok, termasuk "The Rulebook" (`277:15676`) yang dulu ditunda |
| 2026-08-24 | R14 ditulis ulang: layar "Contact Us" (`176:11563`) ternyata ada — dan sudah ada di file lama tanpa nama. `/contact` yang berjalan harus dicocokkan ulang |
| 2026-08-24 | Halaman Tournaments (`366:17181`, 11 blok) baru digambar; Members masih wireframe saja — nav "Tournaments" akhirnya punya tujuan |
| 2026-08-24 | Halaman FAQ selesai (`/faq`, node `173:9459`) — cangkang side-tab keempat, sepuluh pertanyaan desain, filter `?category=` + search `?q=` di server (D60) |
| 2026-08-24 | Tautan "FAQ" di footer akhirnya menunjuk halaman, bukan `/#faq` — sebelumnya setiap halaman mengirim pembaca pulang ke S11 |
| 2026-08-24 | Search FAQ **bekerja** tanpa JavaScript (`<form method="get">`), berbeda dari kotak mati di `/news` dan `/gallery`: yang dicari copy halaman sendiri, bukan endpoint yang belum ada |
| 2026-08-24 | `icon-search.svg` naik `assets/news/` → `assets/global/` pada pemakai ketiga, persis yang dikatakan catatannya sendiri (D32/D43) |
| 2026-08-24 | R15 dibuka: pager 1-2-3 (`174:10695`) tidak dibangun — desain mengandaikan ~30 pertanyaan, yang ada sepuluh; sembilan jawabannya masih placeholder (B2) |
| 2026-08-24 | Halaman Tournaments selesai 8/8 blok (`/tournaments`, node `366:17181`) — hero, highlighted, rail, regulations, Champions Hall, media gallery, tabel Olympic, FAQ. Nav & footer "Tournaments" akhirnya hidup (D61) |
| 2026-08-24 | Kontrak data bertambah: `Champion`, `OlympicResult`, `Tournament` diperluas; empat fungsi client baru — semuanya mock (B2) |
| 2026-08-24 | `ui/DocumentCard` + `ui/DownloadPill` diangkat dari `news/` pada pemakai kedua; `MediaGallery` dipakai dua halaman lewat satu prop warna judul (D32/D43) |
| 2026-08-24 | Rail kartu dibangun sebagai scroller native + panah, bukan carousel transform — sentuhan, keyboard dan scrollbar tangan desain semuanya dapat perilaku yang benar |
| 2026-08-24 | R16 dibuka: Champions Hall desain menamai empat tokoh publik nyata sebagai juara DWF. Foto tidak dipakai, nama tidak masuk repo; kartu jatuh ke panel gradien sampai ada juara asli |
| 2026-08-24 | Acara `e1` jadi "Caribbean Domino Open 2026" — desain menamainya 2024 di S6 dan 2026 di hero dengan tanggal 2026 di keduanya; S6 ikut terkoreksi (D61) |
| 2026-08-24 | Blur 15px pada pita bawah hero Tournaments dan shelf featured News dicabut — `backdrop-filter` bekerja penuh di seluruh kotak sementara gradiennya mulai transparan, jadi tepi atasnya jadi garis lurus memotong artwork (dilaporkan pengguna dari screenshot). Scrim-nya kini gradien saja |
| 2026-08-24 | Kartu Champions Hall diisi artwork poster federasi — slot potret kosong terbaca sebagai gambar gagal muat, bukan sebagai menunggu aset. R16 tetap terbuka: potret juara asli belum ada |
| 2026-08-24 | Foto Champions Hall dipasang atas keputusan pengguna ("gpp buat proto") — diperkecil ke 1400px sisi panjang (30 MB → 9,3 MB). Nama tetap placeholder: nama asli di bawah wajah asli adalah klaim identitas, bukan aset placeholder. R16 diperbarui, tetap terbuka |
| 2026-08-24 | Tile domino hero home berhenti tajam, bukan di `blur(2px)` desain (`24:933`) — dilaporkan "kurang HD". Dua sebab: 2px memang lembut di ~550px, dan `filter` memaksa layer jadi tekstur sendiri sehingga piksel ekstra layar DPI tinggi hilang. Entrance-nya tetap melunak dari 10px; dua batu tetap 4px & 6.5px |
| 2026-08-24 | `SofteningImage` tidak lagi menulis `filter: blur(0px)` — nol berarti tanpa properti `filter` sama sekali, supaya layer istirahatnya tidak lewat filter pass |
