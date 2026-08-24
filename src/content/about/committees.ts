/**
 * Sub-Committees copy — Figma node `114:3667`, kept out of JSX for i18n
 * (RULES §9).
 *
 * The committees themselves are data (`lib/api/client.ts`, RULES §8) — the
 * federation adds and retires them, and each will eventually have a page.
 *
 * The heading corrects the design's own spelling: `114:3669` reads
 * "Sub-Commitees" with one `t`. That is a typo in a mock rather than a house
 * style — the word appears nowhere else on the site to compare against, and
 * publishing a misspelt heading on the federation's own About page is not
 * fidelity to the design, it is a defect inherited from it.
 */

export const COMMITTEES_COPY = {
  heading: "Sub-Committees",
  description:
    "Specialized bodies focused on the technical, ethical, and expansion aspects of the federation.",
} as const
