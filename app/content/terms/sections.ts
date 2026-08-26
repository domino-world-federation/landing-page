/**
 * Terms & Conditions copy — Figma node `174:11162` (RULES §9).
 *
 * Page text rather than data, so it lives here and not behind `client.ts`: a
 * legal document is not a feed. The federation edits it the way it edits a
 * heading, and routing it through a mock endpoint would suggest a `/terms`
 * response that nobody is going to build.
 *
 * **The numbers are not in the strings.** Figma types every one of the nine
 * headings as "1." — both in the body (`174:11261` and its eight siblings) and
 * in the table of contents (`174:11230` …). That is a numbered-list artefact,
 * not nine clauses that are all clause one, and it is the same class of defect
 * as the four press releases sharing one date: a document whose sections are
 * all "1." reads as broken rather than as a design choice. The position in this
 * array is the number, and both the body and the contents render it from there,
 * so the two can never disagree.
 *
 * Casing follows D40 — Figma writes four of the nine headings in lower case and
 * leans on `textCase: TITLE` to lift them. The strings carry their own case and
 * the CSS does not force it.
 */

import type { LegalSection } from "@/content/legal"

export const TERMS_SECTIONS: readonly LegalSection[] = [
  {
    id: "acceptance-of-terms",
    heading: "Acceptance of Terms",
    body: "By accessing, browsing, or utilizing the Domino World Federation (DWF) portal, you explicitly accept these unified terms of engagement. If you represent a member federation, your organization agrees to distribute these rules to registered competitive players.",
  },
  {
    id: "member-federation-status",
    heading: "Member Federation Status",
    body: "Federations accepted as Associate or Full Members must continuously adhere to DWF statutes, structural protocols, anti-doping audits, and administrative reports as managed through the executive office.",
  },
  {
    id: "intellectual-property",
    heading: "Intellectual Property",
    body: "All media assets, rulebook publications, official branding icons, tournament databases, global rankings, and the classic DWF geometric logos are the exclusive property of the Domino World Federation. Unauthorized distribution is prohibited.",
  },
  {
    id: "code-of-conduct",
    heading: "Code of Conduct",
    body: "All practitioners, referees, and team delegates must maintain high integrity standards, ethical sportsmanship, and tactical respect. Fair play infractions are referred to the DWF Disciplinary Panel.",
  },
  {
    id: "tournament-participation-rules",
    heading: "Tournament Participation Rules",
    body: "Registration for major events is managed through the federation portal. Upcoming entries are processed strictly within regional capacity guidelines. If no tournament is scheduled, registration routes are disabled automatically.",
  },
  {
    id: "limitation-of-liability",
    heading: "Limitation of Liability",
    body: "DWF acts as a regulatory authority and organizer of competitive rules. DWF accepts no liability for physical hazards, venue arrangements, or contract disputes managed by independent local tournament directors.",
  },
  {
    id: "governing-law",
    heading: "Governing Law",
    body: "These regulatory terms of service are governed exclusively by the laws of Switzerland. All litigation regarding federation rulings shall be brought before the competent courts of Lausanne.",
  },
  {
    id: "changes-to-terms",
    heading: "Changes to Terms",
    body: "DWF reserves the right to modify these operational regulations. Modified terms will be published directly in the Resource Library with updated effective dates.",
  },
  {
    id: "contact",
    heading: "Contact",
    body: "If you have any questions regarding these rules, please submit an official request through our Swiss administrative desk or send inquiries directly to",
    email: "contact@dwf-domino.org",
  },
] as const
