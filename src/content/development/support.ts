/**
 * Federation Support Programs copy — Figma node `202:15013`, kept out of JSX
 * for i18n (RULES §9).
 */

export const SUPPORT_COPY = {
  eyebrow: "Institutional",
  heading: "Federation Support Programs",
  /**
   * TODO(design): `205:15050` is the Public Plaza Play paragraph verbatim —
   * street furniture in urban squares, under a heading about grants and
   * governance templates for national bodies. It is a paste that was never
   * replaced. Shown as drawn rather than rewritten: inventing what the
   * federation offers its members is a heavier error than displaying the
   * design's own placeholder and marking it (D40, D44).
   */
  intro:
    "Installing permanent, weather-resistant domino infrastructure in urban public spaces to encourage spontaneous play.",
  /**
   * Names the three-item list for assistive tech. Not drawn — the design gives
   * the ticks no heading — and rendered `sr-only`.
   */
  benefitsLabel: "What the programme provides",

  /* ---- The application card (`207:15156`) ------------------------------- */

  formHeading: "Apply for Support",
  formIntro:
    "National bodies currently in the 'Provisional' or 'Associate' membership tier are eligible to apply for the 2025 Development Grant cycle.",
  federationLabel: "Federation Name",
  federationPlaceholder: "National Domino Association of...",
  emailLabel: "Contact Email",
  emailPlaceholder: "admin@federation.org",
  /**
   * The submit button is **not drawn**. Figma gives the card a heading, an
   * intro and two fields and then stops (`207:15160` has no third child), which
   * leaves a form with no way to send it — the same defect in the opposite
   * direction from the footer's subscribe box, which Figma drew as decoration
   * with no input at all. D28 built that one as a real form because a box that
   * cannot be typed into is worse than none; a form that cannot be submitted is
   * worse than none for the same reason, so the button is extrapolated. Its
   * chrome follows the page's outlined button; its label is the card's own verb
   * so nothing is invented but the shape.
   *
   * TODO(design): confirm the submit control for `207:15156`.
   */
  submit: "Apply for Support",
  /**
   * Shown when the form is submitted. There is no endpoint (blocker B2), so it
   * says so rather than swallowing an application — the same choice, and the
   * same single line to replace later, as the footer's newsletter field.
   */
  unavailable:
    "Applications are not open through this form yet — please contact the federation directly.",
} as const

export type SupportBenefit = {
  id: string
  text: string
}

export const SUPPORT_BENEFITS: readonly SupportBenefit[] = [
  { id: "governance", text: "Governance Framework Templates" },
  { id: "equipment", text: "Equipment Subsidy Grants" },
  { id: "advisors", text: "Technical Advisor Exchange" },
]
