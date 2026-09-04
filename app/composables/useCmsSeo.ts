import { getSiteSeo } from "~/lib/api/client"
import type { PageSeo, SiteSeo } from "~/lib/api/types"

/**
 * Applies the meta the federation edits in the CMS, over the meta each page
 * ships with.
 *
 * **Why it overrides rather than fills a gap.** Every page already calls
 * `useSeoMeta` with a hand-written title and description, and those are good —
 * they are the floor, and they are what renders before the API answers or if it
 * never does. But once somebody has typed a title into "SEO & Social", that is
 * the federation's decision and it has to win. `tagPriority` is what makes it:
 * Nuxt renders `app.vue`'s head entries BEFORE the page's, so without a
 * priority the page would quietly overwrite the CMS.
 *
 * **One request for the whole site.** The response is a handful of short
 * strings needed on every route; fetching per navigation would put a round trip
 * in front of every link. `useAsyncData` with a fixed key gives one fetch per
 * server render, reused by the client from the payload.
 *
 * **A route with no row inherits, it does not blank out.** `default` merges
 * under the page's row, so filling only `title` in the CMS leaves the site
 * description in place rather than deleting it.
 *
 * Dynamic routes (`/news/[slug]`) are absent from the CMS by design — their
 * meta is born from the record they render. `pages[path]` simply misses, the
 * merge yields `default`, and the page's own `useSeoMeta` stays on top of it
 * because there is nothing here to override with.
 */
export function useCmsSeo() {
  const route = useRoute()

  // Bawaannya diberi tipe eksplisit: tanpa itu TypeScript menyimpulkan
  // `pages` sebagai `{}` dan pengindeksan dengan path route jadi galat.
  const empty = (): SiteSeo => ({ default: {}, pages: {} })

  const { data } = useAsyncData("cms-seo", () => getSiteSeo(), { default: empty })

  /*
   * Origin dibaca SEKALI di dalam setup, bukan di dalam getter di bawah.
   *
   * Getter `useSeoMeta` dievaluasi belakangan, saat head disusun — di luar
   * konteks setup. Memanggil `useRequestURL()` dari sana melempar "a composable
   * that requires access to the Nuxt instance was called outside of a plugin…",
   * dan yang terlihat cuma seluruh situs 500.
   */
  const origin = useSiteOrigin()

  /**
   * Nothing at all for a route the CMS does not know.
   *
   * This is the whole subtlety, and getting it wrong is silent. The entries
   * here are applied at `tagPriority: 1`, which beats the page's own
   * `useSeoMeta` — that is deliberate, so an edited row wins. But it means
   * falling back to `default` for a route with NO row would stamp the site
   * title over pages that build their meta from the record they render:
   * `/news/{slug}` would announce itself as "Domino World Federation" instead
   * of the story's headline, in the tab AND in every link preview.
   *
   * So `default` is what a row INHERITS for the fields it leaves blank — not a
   * blanket applied to routes the federation never described. A route without
   * a row gets nothing from here, and its own `useSeoMeta` stands.
   */
  const row = computed(() => data.value?.pages[route.path])

  const meta = computed<PageSeo>(() =>
    row.value ? { ...data.value?.default, ...row.value } : {},
  )

  /*
   * Canonical dipasang untuk SETIAP rute, termasuk yang tidak dikenal CMS.
   *
   * Bedanya dengan meta di bawah: canonical bukan pernyataan editorial, ia
   * pernyataan teknis — "alamat resmi halaman ini yang ini". Tanpanya,
   * `/news?category=Tournament`, `/news/`, dan `/news` terbaca mesin pencari
   * sebagai tiga halaman berisi hal yang sama, dan peringkatnya terbagi tiga.
   *
   * `route.path`, bukan `fullPath`: query string justru yang harus dibuang.
   */
  useHead({
    link: [{ rel: "canonical", href: () => `${origin}${route.path}` }],
  })

  useSeoMeta(
    {
      title: () => meta.value.title || undefined,
      description: () => meta.value.description || undefined,

      // Open Graph and Twitter carried the same values rather than their own
      // CMS fields: the module writes one title and one description because
      // that is what the federation would type twice otherwise, and two boxes
      // that always hold the same text is a box nobody fills in the second
      // time.
      ogTitle: () => meta.value.title || undefined,
      ogDescription: () => meta.value.description || undefined,
      ogImage: () => meta.value.ogImageUrl || undefined,
      ogType: () => (row.value ? "website" : undefined),
      ogUrl: () => (row.value ? `${origin}${route.path}` : undefined),

      twitterCard: () =>
        row.value ? (meta.value.ogImageUrl ? "summary_large_image" : "summary") : undefined,
      twitterTitle: () => meta.value.title || undefined,
      twitterDescription: () => meta.value.description || undefined,
      twitterImage: () => meta.value.ogImageUrl || undefined,
    },
    // Beats the page-level `useSeoMeta`. Nuxt's default is 10; a lower number
    // wins, and 1 leaves room for anything that must beat even this.
    { tagPriority: 1 },
  )
}
