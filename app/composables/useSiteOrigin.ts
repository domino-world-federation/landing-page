/**
 * The site's public origin, without a trailing slash.
 *
 * `NUXT_PUBLIC_SITE_URL` when set, the incoming request's own origin when not.
 * The fallback is correct in development and correct in production too, right
 * up until the app sits behind a proxy that rewrites the host — and then every
 * canonical URL and every sitemap entry quietly announces an internal address
 * that no search engine can reach. Setting the variable removes the question.
 *
 * MUST be called inside setup: it reads the request, which only exists there.
 */
export function useSiteOrigin(): string {
  const configured = useRuntimeConfig().public.siteUrl

  return (configured || useRequestURL().origin).replace(/\/$/, "")
}
