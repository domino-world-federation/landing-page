/**
 * Berteriak di log kalau situsnya menyajikan data MOCK di produksi.
 *
 * `lib/api/client.ts` jatuh ke `mock/` saat `NUXT_PUBLIC_API_BASE_URL` kosong.
 * Itu perilaku yang benar untuk klon baru — situsnya jalan tanpa backend, dan
 * tidak ada yang perlu dimatikan untuk mengembangkan halaman.
 *
 * Di produksi ia jadi kegagalan yang paling sulit dilihat yang dimiliki project
 * ini: **halamannya tampil sempurna**. Tidak ada galat, tidak ada 500, dan
 * tidak ada satu pun permintaan di tab Network browser — karena mock tidak
 * meminta apa pun. Yang salah cuma ISI-nya, dan itu baru ketahuan kalau ada
 * yang menyadari beritanya bukan berita yang barusan diketik di backoffice.
 *
 * Karena itu peringatannya berisik dan menyebut cara memperbaikinya. Ia tidak
 * menghentikan server: situs yang menyajikan mock tetap situs, dan mati total
 * lebih buruk daripada isi yang salah.
 */
export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()

  if (config.public.apiBaseUrl) return

  if (import.meta.dev) return

  console.warn(
    [
      "",
      "  ┌──────────────────────────────────────────────────────────────┐",
      "  │  MENYAJIKAN DATA MOCK                                        │",
      "  │                                                              │",
      "  │  NUXT_PUBLIC_API_BASE_URL kosong, jadi setiap halaman         │",
      "  │  mengambil isinya dari app/lib/api/mock/ — bukan dari         │",
      "  │  backoffice. Halamannya akan tampil normal.                   │",
      "  │                                                              │",
      "  │  Setel di ecosystem.config.cjs, lalu:                         │",
      "  │      pm2 restart dwf-nuxt --update-env                        │",
      "  └──────────────────────────────────────────────────────────────┘",
      "",
    ].join("\n"),
  )
})
