/**
 * `/robots.txt` — dibangkitkan, karena isinya bergantung satu sakelar.
 *
 * Situs ini belum diumumkan, jadi bawaannya MENOLAK seluruh perayap. Yang
 * membukanya `NUXT_PUBLIC_ALLOW_INDEXING=true`, dan itu disengaja jadi
 * tindakan sadar: dua kegagalannya tidak sama beratnya.
 *
 *   - Bawaan tertutup, lupa dibuka → situs tidak muncul di pencarian. Buruk,
 *     tapi ketahuan dari Search Console dalam hitungan hari dan pulih penuh.
 *   - Bawaan terbuka, lupa ditutup → isi yang belum jadi terindeks, lengkap
 *     dengan halaman contoh dan naskah placeholder. Menghapusnya dari indeks
 *     butuh permintaan penghapusan dan berminggu-minggu.
 *
 * Yang kedua lebih mahal, jadi yang aman yang jadi bawaan.
 *
 * BUKAN berkas statis di `public/`: Nitro menyajikan `public/` lebih dulu, jadi
 * berkas di sana akan menang dan sakelarnya tidak akan pernah terbaca.
 */
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const allowed = config.public.allowIndexing === true
  const origin = (config.public.siteUrl || getRequestURL(event).origin).replace(/\/$/, "")

  setResponseHeader(event, "Content-Type", "text/plain; charset=utf-8")

  if (!allowed) {
    return [
      "# Situs ini belum diumumkan.",
      "#",
      "# Yang menahannya bukan berkas ini sendiri: `Disallow` menghentikan",
      "# PERAYAPAN, bukan PENGINDEKSAN, dan URL yang diblokir di sini tetap bisa",
      "# muncul di hasil pencarian kalau ada yang menautkannya. Yang benar-benar",
      "# menahan `<meta name=\"robots\" content=\"noindex\">` di tiap halaman.",
      "#",
      "# Buka dengan NUXT_PUBLIC_ALLOW_INDEXING=true saat siap diumumkan.",
      "User-Agent: *",
      "Disallow: /",
      "",
    ].join("\n")
  }

  return [
    "User-Agent: *",
    "Disallow:",
    "",
    "# Dibangkitkan dari API — artikel yang terbit hari ini masuk hari ini,",
    "# tanpa deploy.",
    `Sitemap: ${origin}/sitemap.xml`,
    "",
  ].join("\n")
})
