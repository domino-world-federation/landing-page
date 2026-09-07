/**
 * Federation Support Programs copy — Figma node `202:15013`, kept out of the
 * template for i18n (RULES §9).
 *
 * **The section was taken off the page and is back.** It went out because its
 * form had nothing to submit to (blocker B2) and a card asking a national body
 * for its details in order to do nothing with them is worse than no card. The
 * backend exists now — the application lands in the backoffice's Contact
 * Messages under its own topic — so the reason for removing it is gone.
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
   * **A third field Figma does not draw.**
   *
   * The card asks for a name and an address and stops (`207:15160`), which
   * would send the federation two lines and no application. The alternative was
   * to compose the message here — "X has applied for support" — and that is a
   * sentence the applicant never wrote arriving in an inbox as though they had.
   * Asking them what they need is the smaller invention, and it is the only one
   * that makes the submission worth reading.
   *
   * TODO(design): confirm the application card's fields for `207:15156`.
   */
  needsLabel: "What are you applying for?",
  needsPlaceholder:
    "Which programme, what it would fund, and roughly when you need it.",

  /**
   * The submit button is **not drawn** either. Figma gives the card a heading,
   * an intro and two fields and then stops, which leaves a form with no way to
   * send it — the same defect in the opposite direction from the footer's
   * subscribe box, which Figma drew as decoration with no input at all. D28
   * built that one as a real form because a box that cannot be typed into is
   * worse than none; a form that cannot be submitted is worse than none for the
   * same reason. Its chrome follows the page's outlined button; its label is
   * the card's own verb.
   */
  submit: "Apply for Support",

  /* ---- What the form says back ------------------------------------------ */

  success:
    "Your application has reached the federation. Somebody will write back to the address you gave.",
  /** 429 — the endpoint takes five a minute from one address. */
  throttled:
    "That is several applications in quick succession. Please wait a minute and send the last one again.",
  /** The request left and came back wrong. */
  failed:
    "The application did not go through. Please try again, or write to the federation directly.",
  /**
   * No API base URL configured — the request never left the browser. This is
   * the state the whole site runs in without a backend, and it must keep
   * saying so rather than pretending an application was filed.
   */
  unavailable:
    "Applications are not open through this form yet — please contact the federation directly.",

  /**
   * The topic the application is filed under, spelled exactly as
   * `ContactMessage::TOPICS` stores it.
   *
   * A cross-repo contract like the document categories: a topic the backend
   * does not know is a 422, and all the applicant sees is a form that failed
   * for no reason they can act on.
   */
  topic: "Development Support",
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
