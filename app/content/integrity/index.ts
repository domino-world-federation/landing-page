/**
 * `/integrity` copy — Figma screen `601:17703` (RULES §9).
 *
 * Everything on this page is the federation stating its own position, so unlike
 * `/governance` there is nothing here that a backend would serve. The one
 * exception is the report form, which will POST somewhere the day there is
 * somewhere to POST to (B2).
 */

export const INTEGRITY_COPY = {
  /** `601:17847`, one entry per line — `SharpeningHeadline` sweeps each line on
   *  its own, so the break has to be stated rather than left to the column. */
  headerTitle: ["A Fair Game", "for All"],
  headerEyebrow: "Zero Tolerance Policy",
  headerIntro:
    "The Domino World Federation maintains the highest standards of competitive integrity, ensuring every match is decided solely by skill, strategy, and the fall of the tiles.",
  bandAlt:
    "A tournament hall mid-match, players seated across long rows of tables under overhead lighting",

  principlesHeading: "Core Principles",

  /**
   * The rest of the section — the three clauses and the photograph beside them
   * — lives in `./ethics`, because it is a list the column iterates rather than
   * a heading the section states once.
   */
  ethicsHeading: "Code of Ethics",

  technical: {
    heading: "Technical Overview",
    intro:
      'Our proprietary "Tile-Trace" engine monitors pattern anomalies in real-time across all DWF-sanctioned digital platforms.',
    label: "How the integrity engine works",
  },

  flow: {
    heading: "Procedural Flow",
    label: "How a report is handled",
  },

  report: {
    heading: "Report an Integrity Issue",
    /**
     * `601:17712` repeats the members page's grassroots paragraph about
     * weather-resistant infrastructure in public plazas, which has nothing to do
     * with reporting an incident. Pasted, like the four identically-dated press
     * releases and the Tokyo album's heading (D40), so it is replaced with a
     * line about what this form is for.
     */
    intro:
      "If you have seen something that threatens the fairness of a match, tell us. It does not have to be proof — a suspicion, recorded early, is what an investigation starts from.",
    reassurance:
      "Whistleblowers are the first line of defense. All reports are handled with 100% anonymity and processed by our secure legal team.",

    formHeading: "Quick Submission",
    typeLabel: "Incident Type",
    typePlaceholder: "Select the incident type",
    /** The kinds of report the form accepts. */
    types: [
      "Match manipulation",
      "Doping",
      "Betting or insider information",
      "Harassment or abuse",
      "Conflict of interest",
      "Something else",
    ],
    descriptionLabel: "Description",
    descriptionHint: "min. 20 characters",
    descriptionPlaceholder: "Provide as much detail as possible",
    submit: "Submit Securely",
    /** Replaces the button's label while the request is in flight. */
    sending: "Submitting…",
    confidentiality:
      "Your identity will be kept strictly confidential and will not be disclosed without your consent, except where required by law.",

    /**
     * **This is the one form on the site where a wrong message does real
     * harm**, and it cuts both ways. Someone who believes they have filed a
     * report about match-fixing or abuse and has not is worse off than someone
     * told to come back later — they stop looking for another way to report it.
     * So `success` is said only after the server has taken it, and the two
     * failures below never imply it might have got through anyway.
     *
     * `success` does not promise a reply. Nothing identifying is stored — no
     * name, no email, no IP — so there is no one to reply to, and saying "we
     * will be in touch" would be inventing a channel that does not exist.
     */
    success:
      "Your report has been received and is now with the integrity unit. Nothing identifying you was stored with it.",
    throttled:
      "That is several reports in a short time. Give it a minute, then submit the next one.",
    failed:
      "Your report did not reach us — nothing was filed. Try again, or email integrity@dwf-domino.org, which is monitored.",
    /**
     * Shown when there is no `NUXT_PUBLIC_API_BASE_URL`: nothing was sent
     * anywhere. The form refuses in the open and names the channel that does
     * exist rather than swallowing a report.
     */
    unavailable:
      "The secure reporting channel is not live yet. Until it is, email integrity@dwf-domino.org — that address is monitored.",
    tooShort: "Please describe what happened in at least 20 characters.",
    needsType: "Please choose the kind of incident you are reporting.",
  },
} as const

/** `601:17856` — the four principles, 2 × 2 in the design. */
export const INTEGRITY_PRINCIPLES = [
  {
    id: "legality",
    label: "Legality",
    detail:
      "Absolute adherence to international sporting laws and regional regulations governing table games.",
  },
  {
    // Figma types "TRANSPARENCT". A typo of the kind D40 fixes.
    id: "transparency",
    label: "Transparency",
    detail:
      "Full disclosure of tournament software, shuffling algorithms, and adjudication processes.",
  },
  {
    id: "fair-play",
    label: "Fair Play",
    detail:
      "Providing equal opportunity for all members regardless of technical infrastructure or geography.",
  },
  {
    id: "anti-cheating",
    label: "Anti Cheating",
    detail:
      "Rigorous protection against external interference and internal data manipulation.",
  },
] as const

/** `601:17895` — what the engine actually does. */
export const INTEGRITY_MEASURES = [
  {
    id: "heuristic",
    title: "Heuristic Analysis",
    detail:
      "Identifying statistical deviations from expected probability curves in player decision-making.",
    iconUrl: "/assets/integrity/icon-tech-heuristic.svg",
  },
  {
    id: "metadata",
    title: "Metadata Fingerprinting",
    detail:
      "Cross-referencing device patterns and latency markers to prevent unauthorized multi-accounting.",
    iconUrl: "/assets/integrity/icon-tech-metadata.svg",
  },
  {
    id: "rng",
    title: "RNG Validation",
    detail:
      "Provably fair cryptographic seeds used for every shuffle, verifiable by participants post-match.",
    iconUrl: "/assets/integrity/icon-tech-rng.svg",
  },
  {
    id: "signal",
    title: "Signal Blocking",
    detail:
      "Physical protocols for in-person tournaments including electronic interference measures.",
    iconUrl: "/assets/integrity/icon-tech-signal.svg",
  },
] as const

/** `601:17945` — what happens to a report once it is filed. */
export const INTEGRITY_FLOW = [
  {
    id: "report",
    number: "01",
    title: "Report",
    detail: "Incident flagged or reported via Integrity Page.",
  },
  {
    id: "inquiry",
    number: "02",
    title: "Inquiry",
    detail: "Confidential data gathering by the Integrity Unit.",
  },
  {
    id: "tribunal",
    number: "03",
    title: "Tribunal",
    detail: "Independent panel review and final sentencing.",
  },
  {
    id: "appeals",
    number: "04",
    title: "Appeals",
    detail: "14-day window for submission to the High Council.",
  },
] as const
