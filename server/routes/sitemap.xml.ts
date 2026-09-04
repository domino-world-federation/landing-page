/**
 * `/sitemap.xml` — dibangkitkan, bukan ditulis tangan.
 *
 * Isinya dua bagian yang sumbernya berbeda, dan itu disengaja:
 *
 *   - Rute STATIS diambil dari `/api/v1/seo`, yaitu daftar halaman yang
 *     federasinya sendiri daftarkan di "SEO & Social". Bukan daftar keras di
 *     berkas ini: rute yang ditambahkan ke situs tanpa barisnya di CMS memang
 *     belum siap diumumkan, dan rute yang dihapus dari CMS berhenti diumumkan
 *     tanpa ada yang perlu ingat.
 *   - Rute DINAMIS diambil dari `/news` dan `/tournaments`. Ini yang membuat
 *     sitemap-nya berguna sama sekali: artikel yang terbit hari ini masuk hari
 *     ini, tanpa deploy.
 *
 * **Gagal dengan sopan.** Kalau API tidak bisa dihubungi, yang keluar sitemap
 * berisi beranda saja — bukan 500. Sitemap yang error mengajari perayap untuk
 * berhenti memintanya; sitemap yang kurang lengkap cuma tertinggal sebentar.
 */
type SeoResponse = { pages?: Record<string, unknown> }
type Slugged = { slug?: string; publishedAt?: string; startsAt?: string }

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const api = config.public.apiBaseUrl
  const origin = (
    config.public.siteUrl || getRequestURL(event).origin
  ).replace(/\/$/, "")

  const entries = new Map<string, string | undefined>([["/", undefined]])

  if (api) {
    const base = api.replace(/\/$/, "")

    const [seo, news, tournaments] = await Promise.all([
      $fetch<SeoResponse>(`${base}/seo`).catch(() => null),
      $fetch<Slugged[]>(`${base}/news?limit=48`).catch(() => []),
      $fetch<Slugged[]>(`${base}/tournaments`).catch(() => []),
    ])

    for (const path of Object.keys(seo?.pages ?? {})) {
      // `*` adalah baris cadangan seluruh situs, bukan sebuah halaman.
      if (path.startsWith("/") && !path.includes("[")) entries.set(path, undefined)
    }

    for (const item of news) {
      if (item.slug) entries.set(`/news/${item.slug}`, item.publishedAt)
    }

    for (const item of tournaments) {
      if (item.slug) entries.set(`/tournaments/${item.slug}`, item.startsAt)
    }
  }

  const urls = [...entries]
    .map(([path, lastmod]) => {
      const modified = lastmod ? `\n    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : ""

      return `  <url>\n    <loc>${origin}${path}</loc>${modified}\n  </url>`
    })
    .join("\n")

  setResponseHeader(event, "Content-Type", "application/xml; charset=utf-8")
  // Sejam: cukup lama untuk tidak membebani API, cukup pendek supaya artikel
  // yang terbit pagi ini ditemukan hari ini juga.
  setResponseHeader(event, "Cache-Control", "public, max-age=3600")

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
})
