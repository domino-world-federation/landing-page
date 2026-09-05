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
 */
export const DOCUMENT_CATEGORY = {
  rules: "Rules & Regulations",
  governance: "Governance Documents",
  integrity: "Integrity & Ethics",
  membership: "Membership Documents",
  development: "Development Resources",
  reports: "Reports & Publications",
  tournament: "Tournament Documents",
  press: "Media & Press Releases",
} as const

export type DocumentCategory = (typeof DOCUMENT_CATEGORY)[keyof typeof DOCUMENT_CATEGORY]
