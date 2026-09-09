/**
 * The document categories, spelled exactly as the backoffice stores them.
 *
 * **This is a cross-repo contract, and it has already been broken once.** Until
 * 2026-09-05 the eight `getResources(...)` calls on this site asked for
 * "Rulebook", "Regulations", "Press Release", "Publication", "Statutes",
 * "Governance", "Development" and "Tournament Regulations" — and the backoffice
 * offered "Annual Report", "Media Release", "Regulation", "Tournament Toolkit"
 * and "Partnership". Not one name overlapped, so every document shelf on the
 * public site was empty. Nothing failed: each section hides itself when it has
 * nothing, so the site looked finished and simply had no documents in it.
 *
 * Spelling them in one file is what stops that happening quietly again. A name
 * typed at the call site is a string nobody can grep for against the other repo;
 * a name here is one place to compare with `config/dwf.php`, which carries the
 * same list and a test that spells it out.
 *
 * The value is also PRINTED — it is the small grey line above the title on a
 * document card — so these are display strings, not slugs.
 *
 * **Shortened to six on 2026-09-09.** `Integrity & Ethics` and `Membership
 * Documents` are gone: neither page ever drew a document shelf, so both only
 * ever promised a place to appear that did not exist. `Reports & Publications`
 * became `Publication` and `Media & Press Releases` became `Press Releases`.
 * The backoffice moved its rows in the same change
 * (`2026_09_09_100000_rename_document_categories`).
 *
 * **Most shelves no longer ask by category at all.** They ask by SECTION —
 * `getSectionResources("news.publications")` — because two shelves can draw the
 * same category and the choice of which document goes where is now the
 * backoffice's, not this file's. See `SECTION` below. What is left here is the
 * vocabulary itself, which the press archive still filters by.
 */
export const DOCUMENT_CATEGORY = {
  rules: "Rules & Regulations",
  governance: "Governance Documents",
  development: "Development Resources",
  tournament: "Tournament Documents",
  press: "Press Releases",
  publication: "Publication",
} as const

export type DocumentCategory = (typeof DOCUMENT_CATEGORY)[keyof typeof DOCUMENT_CATEGORY]

/**
 * The document shelves, spelled exactly as the backoffice keys them.
 *
 * A second cross-repo contract with the same failure mode as the one above, and
 * one improvement on it: an unknown key is refused with a 422 rather than
 * answered with an empty array, so a typo here shows up as a visible error
 * instead of a shelf that quietly hides itself.
 *
 * Which documents a shelf holds is chosen in the backoffice, on the "Documents
 * per Page" screen. A shelf nobody has touched yet falls back to the newest
 * documents in its category, so these calls were safe to switch over before a
 * single one had been curated.
 *
 * The press ARCHIVE is deliberately absent: it shows the whole category with no
 * limit, which is what the word means. It still asks by category.
 */
export const DOCUMENT_SECTION = {
  homeResources: "home.resources",
  dominoRulebook: "domino.rulebook",
  governanceStatutes: "governance.statutes",
  governanceRepository: "governance.repository",
  developmentLibrary: "development.library",
  developmentYouth: "development.youth",
  tournamentRegulations: "tournaments.regulations",
  newsPress: "news.press",
  newsPublications: "news.publications",
} as const

export type DocumentSection = (typeof DOCUMENT_SECTION)[keyof typeof DOCUMENT_SECTION]
