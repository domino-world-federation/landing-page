import tailwindcss from "@tailwindcss/vite"

/**
 * DWF website — Nuxt 4.
 *
 * Nuxt 4's default srcDir is `app/`, so every folder the framework owns
 * (`components/`, `composables/`, `pages/`, `layouts/`, `utils/`) lives in
 * there; `public/`, `server/` and `shared/` stay at the root. The Next build
 * this replaces kept the same split under `src/`.
 */
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxt/image", "@nuxt/fonts", "motion-v/nuxt", "@nuxt/eslint"],

  css: ["~/assets/css/main.css"],

  // Tailwind v4 is configured CSS-first — the tokens live in @theme inside
  // main.css and there is no tailwind.config.ts (RULES §6). The Vite plugin is
  // all the wiring it needs.
  vite: {
    plugins: [tailwindcss()],
  },

  /**
   * Declared explicitly rather than left to the module's CSS scan.
   *
   * @nuxt/fonts provisions families it finds in `font-family` declarations, and
   * ours are only ever reached through a Tailwind `@theme` custom property —
   * `--font-display: "Bebas Neue"` is not a declaration the scanner reads. The
   * weights are the ones DESIGN-TOKENS §1 measured; Bebas Neue ships one.
   */
  fonts: {
    families: [
      { name: "Bebas Neue", provider: "google", weights: [400] },
      { name: "Inter", provider: "google", weights: [400, 500, 600] },
    ],
    defaults: { subsets: ["latin"] },
  },

  image: {
    // STOPGAP — the production box is a KVM guest reporting "Common KVM
    // processor": its flags stop at `clflush`, with no sse4_2/popcnt, so it is
    // below x86-64-v2. sharp's prebuilt libvips refuses to load there and every
    // `/_ipx/` request answers 500, which takes down every image on the site.
    // Building sharp from source is also blocked — the box cannot install
    // libvips-dev. With `none` the transforms are skipped and the files in
    // `public/` are served as-is — so `format` and `quality` below never run,
    // and what is on disk is exactly what goes over the wire.
    //
    // That used to mean 77 MB of raster. D71 answered it where the pipeline
    // could not: every asset is pre-encoded to WebP q95 on disk and the source
    // PNG/JPGs live outside `public/`, which took `public/assets` to 12.7 MB.
    // What is still missing is the per-viewport RESIZE — a phone downloads the
    // same file a 2560px monitor does. REMOVE THIS once the host exposes a
    // modern CPU model, and the ladder below starts doing that half.
    //
    // WHEN YOU DO, ADD `domains` FIRST. Uploaded media is served from its own
    // host in production (`MEDIA_URL`, e.g. `media.dwf-domino.org`). With
    // `none` that is invisible — `<NuxtImg>` just prints the `src`. IPX
    // FETCHES the image to resize it, and `@nuxt/image` refuses any host not
    // listed here as an SSRF guard: every CMS image on the site 403s at once,
    // while the ones bundled in `public/` keep working, which makes it read
    // like a backend fault rather than this line.
    //
    //   domains: ["media.dwf-domino.org"],
    //
    provider: "none",
    // The design is drawn at 1920 and the site runs full-bleed, so the ladder
    // reaches past it for 2x phones and wide monitors.
    screens: {
      xs: 360,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      // 1400 — the width the nav pill needs, and the one breakpoint a
      // `sizes` in the Next build measured against that is not a stock step.
      menu: 1400,
      xxl: 1536,
      "2xl": 1920,
      "3xl": 2560,
    },
    quality: 82,
    format: ["webp"],
  },

  app: {
    head: {
      htmlAttrs: { lang: "en", class: "h-full antialiased" },
      bodyAttrs: { class: "bg-bg flex min-h-full flex-col" },
      link: [{ rel: "icon", href: "/favicon.ico" }],
    },
  },

  /**
   * The API's base URL, empty until one exists (blocker B2).
   *
   * Public because the browser reads it too. `lib/api/client.ts` is the only
   * thing that touches it — while it is empty every getter serves from `mock/`,
   * which is the switch RULES §8 describes.
   *
   * Override at deploy time with `NUXT_PUBLIC_API_BASE_URL`.
   */
  runtimeConfig: {
    /**
     * IPX's own `maxAge`, in seconds — the `cache-control` its transform
     * endpoint sends.
     *
     * Its default is 60, measured on a built server, after which sharp re-runs
     * the resize on the next request. This site's images are its weight (PRD
     * R10 lists 25 assets over 1MB), so a minute means the box re-encodes the
     * hero rocks all day.
     *
     * A day, not a year: the URL carries the modifiers and the source path but
     * no content hash, so replacing a photograph reuses the same URL. That is
     * the trade the nginx `/assets/` rule already makes — spare the box the
     * re-send, and a replaced picture is live within a day without a purge.
     */
    ipx: {
      maxAge: 86_400,
    },

    public: {
      apiBaseUrl: "",

      /**
       * The site's own public origin, without a trailing slash.
       *
       * Used for `<link rel="canonical">` and for the absolute URLs a sitemap
       * has to carry. Empty falls back to the origin of the incoming request,
       * which is right in development and right in production too — UNTIL the
       * app sits behind a proxy that does not forward the original host, at
       * which point every canonical would announce the internal address.
       * Setting it removes that whole class of question.
       *
       * Override at deploy time with `NUXT_PUBLIC_SITE_URL`.
       */
      siteUrl: "",

      /**
       * Whether search engines may index this site.
       *
       * **Closed by default, and that is the safe direction.** Forgetting to
       * open it costs traffic, which Search Console shows within days and which
       * recovers fully. Forgetting to close it lets unfinished content and
       * placeholder copy into the index, and getting it back out takes removal
       * requests and weeks.
       *
       * Open at launch with `NUXT_PUBLIC_ALLOW_INDEXING=true`. Until then every
       * page carries `noindex` and `/robots.txt` refuses everything — and the
       * server says so in its boot log, so nobody has to remember unprompted.
       */
      allowIndexing: false,
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  future: { compatibilityVersion: 4 },
})
