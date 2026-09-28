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
  headerEyebrow: "Integrity Is Everyone’s Responsibility",
  headerIntro:
    "Every player, coach, official, volunteer, and federation has a part in protecting fair competition. Together, we can uphold respect, honesty, and trust throughout dominoes.",
  bandAlt:
    "A tournament hall mid-match, players seated across long rows of tables under overhead lighting",

  principlesHeading: "Core Principles",

  /**
   * The rest of the section — the three clauses and the photograph beside them
   * — lives in `./ethics`, because it is a list the column iterates rather than
   * a heading the section states once.
   */
  ethicsHeading: "Our Standards of Conduct",

  technical: {
    heading: "Protecting the Game",
    intro:
      "Integrity depends on the actions of everyone involved in dominoes. These commitments help protect participants and the credibility of competition.",
    label: "Commitments that protect the game",
  },

  flow: {
    heading: "Integrity in Action",
    /** Not in the design — added by the federation's revision (2026-09-28). */
    intro:
      "Integrity depends on the actions of everyone involved in dominoes. These commitments help protect participants and the credibility of competition.",
    label: "How everyone keeps the game fair",
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
      "If you have a concern about cheating, match manipulation, corruption, abuse, harassment, or discrimination in dominoes, you can share the details here. Include what happened, when and where it happened, and any other information you think may help.",
    reassurance:
      "Whistleblowers are the first line of defense. All reports are handled with 100% anonymity and processed by our secure legal team.",

    formHeading: "Share Your Concern",
    typeLabel: "Type of concern",
    typePlaceholder: "Select the type of concern",
    /**
     * The kinds of report the form accepts. **A contract, not just copy**: the
     * backend refuses any value not in `IntegrityReport::TYPES`, so a change
     * here has to land there in the same release.
     */
    types: [
      "Cheating or match manipulation",
      "Corruption or betting",
      "Abuse, harassment or discrimination",
      "Anti-doping concern",
      "Other",
    ],
    descriptionLabel: "Description",
    descriptionHint: "min. 20 characters",
    descriptionPlaceholder:
      "Tell us what happened, when and where it happened, and who was involved, if known.",
    submit: "Submit Report",
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
    needsType: "Please choose the type of concern you are reporting.",
  },
} as const

/** `601:17856` — the four principles, 2 × 2 in the design. */
export const INTEGRITY_PRINCIPLES = [
  {
    id: "integrity",
    label: "Integrity",
    detail: "Compete honestly and act in ways that protect trust in the game.",
  },
  {
    id: "fair-play",
    label: "Fair Play",
    detail: "Reject cheating, corruption, and match manipulation.",
  },
  {
    id: "respect",
    label: "Respect",
    detail: "Treat opponents and everyone involved in dominoes with dignity.",
  },
  {
    id: "safe-sport",
    label: "Safe Sport",
    detail:
      "Help create an environment free from abuse, harassment, discrimination, and exploitation.",
  },
] as const

/** `601:17895` — the commitments that protect the game. */
export const INTEGRITY_MEASURES = [
  {
    id: "fair-competition",
    title: "Fair Competition",
    detail: "Compete honestly and reject cheating or match manipulation.",
    iconUrl: "/assets/integrity/icon-tech-heuristic.svg",
  },
  {
    id: "information",
    title: "Responsible Information Use",
    detail: "Respect confidential information and use it responsibly.",
    iconUrl: "/assets/integrity/icon-tech-metadata.svg",
  },
  {
    id: "safe-participation",
    title: "Safe Participation",
    detail:
      "Help protect participants from abuse, harassment, and discrimination.",
    iconUrl: "/assets/integrity/icon-tech-rng.svg",
  },
  {
    id: "anti-doping",
    title: "Anti-Doping Commitment",
    detail:
      "Follow the World Anti-Doping Code as DWF works toward full WADA compliance.",
    iconUrl: "/assets/integrity/icon-tech-signal.svg",
  },
] as const

/** `601:17945` — what everyone involved does to keep the game fair. */
export const INTEGRITY_FLOW = [
  {
    id: "know-the-rules",
    number: "01",
    title: "Know the Rules",
    detail:
      "Understand the regulations and ethical responsibilities that protect the sport.",
  },
  {
    id: "compete-fairly",
    number: "02",
    title: "Compete Fairly",
    detail: "Reject cheating, corruption, and match manipulation.",
  },
  {
    id: "protect-trust",
    number: "03",
    title: "Protect Trust",
    detail: "Handle confidential information responsibly.",
  },
  {
    id: "speak-up",
    number: "04",
    title: "Speak Up",
    detail: "Raise concerns and help create a safe, transparent environment.",
  },
] as const
