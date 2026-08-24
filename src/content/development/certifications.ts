/**
 * Official Certifications copy — Figma node `190:13674`, kept out of JSX for
 * i18n (RULES §9).
 *
 * Copy rather than data: the three referee grades and the three coaching levels
 * are the federation's own published ladder, drawn in full in the design. They
 * are not a feed anybody adds rows to — a fourth grade would be a rule change,
 * not a record — so unlike the board or the news they stay here (RULES §8).
 */

export const CERTIFICATIONS_COPY = {
  eyebrow: "Professional Standards",
  heading: "Official Certifications",
  /**
   * Names for the two halves. Neither is drawn — Figma puts the grades and the
   * ladder side by side with no headings of their own — but both are lists a
   * reader can land on out of context, and an unnamed list in the page outline
   * is worse than a name the design does not print. Rendered `sr-only`.
   */
  gradesLabel: "Referee grades",
  levelsLabel: "Coaching levels",
  /** The word under each grade letter (`192:14576`). */
  gradeWord: "Grade",
} as const

export type RefereeGrade = {
  id: string
  /** The single letter in the badge — "C", "B", "A". */
  letter: string
  name: string
  scope: string
}

/**
 * Ordered as the design stacks them: entry level first, climbing to elite. The
 * letters run C → B → A, which is the ladder's own direction and reads
 * backwards if sorted alphabetically.
 */
export const REFEREE_GRADES: readonly RefereeGrade[] = [
  {
    id: "c",
    letter: "C",
    name: "National Referee",
    scope: "Entry level for regional events",
  },
  {
    id: "b",
    letter: "B",
    name: "Continental Referee",
    scope: "Qualifies for major championships",
  },
  {
    id: "a",
    letter: "A",
    name: "International Elite Referee",
    scope: "World Championship eligibility",
  },
]

export type CoachingLevel = {
  id: string
  /** The gold marker above the title — "Level 1" and its siblings. */
  marker: string
  title: string
  body: string
}

export const COACHING_LEVELS: readonly CoachingLevel[] = [
  {
    id: "l1",
    marker: "Level 1",
    title: "Foundation",
    body: "Focus on core mechanics, etiquette, and basic mathematical probability for school clubs.",
  },
  {
    id: "l2",
    marker: "Level 2",
    title: "Competitive",
    body: "Advanced theory, partnership communication systems, and match psychology.",
  },
  {
    id: "l3",
    marker: "Level 3",
    title: "Master Coach",
    body: "High-performance training for national teams and tactical analysis.",
  },
]
