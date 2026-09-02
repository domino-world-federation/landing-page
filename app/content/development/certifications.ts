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

export type CoachingLevel = {
  id: string
  /** The gold marker above the title — "Level 1" and its siblings. */
  marker: string
  title: string
  body: string
}

export type RefereeGrade = {
  id: string
  /** The single letter in the badge — "C", "B", "A". */
  letter: string
  name: string
  scope: string
  /**
   * The pathway shown beside the grades when this one is selected. The right
   * column is not a fixed ladder any more — it answers the row the reader
   * pressed.
   */
  levels: readonly CoachingLevel[]
}

/**
 * Ordered as the design stacks them: entry level first, climbing to elite. The
 * letters run C → B → A, which is the ladder's own direction and reads
 * backwards if sorted alphabetically.
 */
/**
 * **Each grade carries its own three levels**, where the right column used to
 * hold one fixed ladder for all of them. Pressing a grade is what changes it.
 *
 * TODO(design): only grade C's three are the design's — they are the
 * `COACHING_LEVELS` the section shipped with (`192:14806` and siblings). The six
 * under B and A are written here so the two rows answer with something of their
 * own rather than repeating C's, and they follow the same shape: what the level
 * is called, and the one sentence saying what it covers. They are not the
 * federation's curriculum and should be replaced by it.
 */
export const REFEREE_GRADES: readonly RefereeGrade[] = [
  {
    id: "c",
    letter: "C",
    name: "National Referee",
    scope: "Entry level for regional events",
    levels: [
      {
        id: "c1",
        marker: "Level 1",
        title: "Foundation",
        body: "Focus on core mechanics, etiquette, and basic mathematical probability for school clubs.",
      },
      {
        id: "c2",
        marker: "Level 2",
        title: "Competitive",
        body: "Advanced theory, partnership communication systems, and match psychology.",
      },
      {
        id: "c3",
        marker: "Level 3",
        title: "Master Coach",
        body: "High-performance training for national teams and tactical analysis.",
      },
    ],
  },
  {
    id: "b",
    letter: "B",
    name: "Continental Referee",
    scope: "Qualifies for major championships",
    levels: [
      {
        id: "b1",
        marker: "Level 1",
        title: "Regulation",
        body: "The full sanctioned rule set, its published amendments, and how a ruling is recorded.",
      },
      {
        id: "b2",
        marker: "Level 2",
        title: "Match Control",
        body: "Running a table under continental conditions — timing, disputes, and the appeal that follows one.",
      },
      {
        id: "b3",
        marker: "Level 3",
        title: "Assessment",
        body: "Assessed across a full championship weekend by a serving continental official.",
      },
    ],
  },
  {
    id: "a",
    letter: "A",
    name: "International Elite Referee",
    scope: "World Championship eligibility",
    levels: [
      {
        id: "a1",
        marker: "Level 1",
        title: "Championship Protocol",
        body: "World Championship procedure, from draw supervision to the closing report.",
      },
      {
        id: "a2",
        marker: "Level 2",
        title: "Integrity",
        body: "Working alongside the integrity unit: what is escalated, to whom, and on what evidence.",
      },
      {
        id: "a3",
        marker: "Level 3",
        title: "Elite Panel",
        body: "Nomination to the panel a World Championship is refereed from, renewed each cycle.",
      },
    ],
  },
]
