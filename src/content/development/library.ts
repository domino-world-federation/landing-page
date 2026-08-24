/**
 * Educational Resources copy — Figma node `192:14833`, kept out of JSX for i18n
 * (RULES §9).
 *
 * The four documents are data and arrive from `getResources("Development")` —
 * a title, a date, a file type and a size are exactly the shape S10's library
 * already has (RULES §8), which is why this section reuses `ResourceCard`
 * rather than drawing a card of its own.
 */

export const LIBRARY_COPY = {
  eyebrow: "Library",
  heading: "Educational resources",
  /**
   * The per-card link. `%s` is the document title — screen readers announce
   * links out of context, and four cards all saying "Download" would be
   * indistinguishable. Written here rather than borrowed from
   * `content/home/resources.ts`: a page reaching into another page's copy file
   * is the dependency D43 removed, and `ResourceCard` takes this as a prop
   * precisely so neither page owns the other's words.
   */
  downloadLabel: "Download %s",
} as const
