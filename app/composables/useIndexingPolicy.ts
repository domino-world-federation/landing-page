/**
 * Menandai halaman `noindex` selama situsnya belum diumumkan.
 *
 * Dipasang di `app.vue`, jadi berlaku untuk SETIAP rute — termasuk yang
 * metanya lahir dari record (`/news/[slug]`), yang tidak disentuh `useCmsSeo`.
 *
 * `robots.txt` saja tidak cukup, dan ini kesalahpahaman yang paling sering:
 * `Disallow` menghentikan PERAYAPAN, bukan PENGINDEKSAN. URL yang diblokir di
 * robots.txt tetap bisa muncul di hasil pencarian — tanpa cuplikan, tapi
 * muncul — kalau ada situs lain yang menautkannya. Yang benar-benar menahan
 * tag ini.
 *
 * Ironisnya keduanya saling melemahkan kalau dipakai sendiri-sendiri: perayap
 * yang dilarang MERAYAP tidak akan pernah membaca `noindex` di halamannya.
 * Karena itu robots.txt di sini menolak dengan sopan sementara tiap halaman
 * tetap membawa tagnya — yang datang lewat tautan tetap tertahan.
 */
export function useIndexingPolicy(): void {
  const allowed = useRuntimeConfig().public.allowIndexing === true

  if (allowed) return

  useSeoMeta(
    { robots: "noindex, nofollow, noarchive" },
    // Menang atas apa pun yang dipasang halaman: selama situsnya ditutup, tidak
    // ada halaman yang boleh membuka dirinya sendiri.
    { tagPriority: 1 },
  )
}
