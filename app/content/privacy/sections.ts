/**
 * Privacy Policy copy — Figma node `174:10759` (RULES §9).
 *
 * Page text rather than data, for the same reason the terms are: a legal
 * document is not a feed, and routing it through a mock endpoint would suggest
 * a `/privacy` response that nobody is going to build.
 *
 * **The numbers are not in the strings.** Figma types all eight headings as
 * "1." — in the body (`174:11105` and siblings) and in the contents column
 * (`174:10824` …). A numbered-list artefact, exactly as in the terms; the
 * position in this array is the number, and both the body and the contents
 * render it from there so the two can never disagree.
 *
 * Casing follows D40: the contents column writes every heading in lower case
 * and leans on `textCase: TITLE` to lift them, while the body writes them in
 * title case. The body's is kept and the CSS does not force either.
 *
 * TODO(design): clause 8 puts the secretariat at "Maison du Sport
 * International, Lausanne, Switzerland", while the footer (`56:4939`) gives the
 * federation's address as Evans Rd, Singapore. Two different head offices in
 * one design. Left as drawn — which of them the federation actually occupies is
 * not something to decide here (D44).
 */

import type { LegalSection } from "@/content/legal"

export const PRIVACY_SECTIONS: readonly LegalSection[] = [
  {
    id: "introduction",
    heading: "Introduction",
    body: "Welcome to the Domino World Federation (DWF) privacy center. This document explains our strict policies regarding the capture, processing, and preservation of personal details. DWF protects member information under Swiss and international regulatory criteria.",
  },
  {
    id: "information-we-collect",
    heading: "Information We Collect",
    body: "We register information during federation membership signups, tournament entry applications, rules certifications, and newsletters requests. This information comprises names, email coordinates, geographic location, associated national organizations, and anti-doping compliance profiles.",
  },
  {
    id: "how-we-use-information",
    heading: "How We Use Information",
    body: "Collected parameters are utilized to organize globally sanctioned championships, audit competitive records, publish verified world rankings, verify referee credentials, and ensure anti-doping oversight through licensed sport centers.",
  },
  {
    id: "data-sharing-third-parties",
    heading: "Data Sharing & Third Parties",
    body: "Information is never shared with third-party marketing entities. Verified profiles may be communicated to member federations, regional organizers, and integrity panels exclusively for competitive authentication or fair-play reviews.",
  },
  {
    id: "cookies-tracking",
    heading: "Cookies & Tracking",
    body: "The DWF web portal deploys technical tracking scripts to optimize browsing speed and analyze traffic statistics. You can control active cookie selections inside your web browser configuration at any time.",
  },
  {
    id: "your-legal-rights",
    heading: "Your Legal Rights",
    body: "Under GDPR and Swiss Federal Law on Data Protection, registered subjects preserve complete rights to access, adjust, remove, or limit processing of their details. Contact our Swiss administrative desk to request records.",
  },
  {
    id: "data-security",
    heading: "Data Security",
    body: "We deploy audited physical and electronic firewalls to neutralize unauthorized access. Access to sensitive athlete registration databases is restricted exclusively to authorized administrative directors.",
  },
  {
    id: "contact-information",
    heading: "Contact Information",
    body: "For all data protection requests, contact our secretariat at Maison du Sport International, Lausanne, Switzerland, or send an email directly to",
    email: "contact@dwf-domino.org",
  },
] as const
