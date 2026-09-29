/**
 * Who may put this site in a frame: itself, and the backoffice — whose page
 * editor shows the real page in an iframe as its live preview.
 *
 * Nobody else. Without the header any site could frame this one under its own
 * chrome (clickjacking), and the preview mode obeys `postMessage`s, so the
 * list is kept to the one origin that sends them. An empty
 * `NUXT_PUBLIC_BACKOFFICE_ORIGIN` leaves only `'self'`.
 */
export default defineEventHandler((event) => {
  const { backofficeOrigin } = useRuntimeConfig(event).public
  const allowed = ["'self'", backofficeOrigin].filter(Boolean).join(" ")
  setResponseHeader(event, "Content-Security-Policy", `frame-ancestors ${allowed}`)
})
