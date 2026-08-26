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
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  future: { compatibilityVersion: 4 },
})
