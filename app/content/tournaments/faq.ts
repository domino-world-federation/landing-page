/**
 * The tournament page's FAQ — Figma node `385:17867` (RULES §9).
 *
 * **The design's three questions, and an answer mismatch it could not keep.**
 * Figma writes one answer (`385:18061`) and attaches it to "Are verbal
 * communications allowed in doubles?" — but the text answers a different
 * question entirely: it is about changing a registration before the deadline.
 * A page that answers a question about table conduct with a paragraph about
 * registration reads as broken, not as copy awaiting review.
 *
 * So the questions stay as drawn and the answers come from the places in the
 * same file where the designer DID write one for them:
 *
 *  - Registration is answered by S11's `81:701`, which is the same question
 *    ("How do I join a tournament") in the landing page's words.
 *  - Doubles conduct is answered by the Domino wireframe's `119:4653`, which
 *    asks this question word for word.
 *  - Results has no answer anywhere in the file, so it gets a placeholder in
 *    the federation's voice, marked and awaiting approval (blocker B2).
 *
 * The orphaned registration-change paragraph is not printed anywhere. Bringing
 * it in would mean inventing the fourth question it belongs to, which is a
 * decision about federation policy rather than a typo (D40).
 */

import type { FaqItem } from "~/types/faq"

export const TOURNAMENT_FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: "tournament-register",
    question: "How do I register for the tournament?",
    // Verbatim from `81:701`, bold runs included.
    answer: [
      { text: "To join a tournament, " },
      { text: "browse the available tournaments", strong: true },
      { text: " and " },
      { text: "select one you're interested", strong: true },
      { text: " in. If registration is open, " },
      { text: 'click "Register for Tournament"', strong: true },
      {
        text: " and complete the required information before the registration deadline.",
      },
    ],
  },
  {
    id: "tournament-verbal-communication",
    question: "Are verbal communications allowed in doubles?",
    // Verbatim from the Domino wireframe `119:4653`, which asks exactly this.
    answer: [
      { text: "No", strong: true },
      { text: ". Verbal communication between doubles partners " },
      { text: "is not allowed during play", strong: true },
      {
        text: ". Players must not provide instructions, coaching, or strategic guidance to their partner while a point is in progress. This rule is in accordance with ",
      },
      { text: "The Law of Dominio – Tag Team", em: true },
      {
        text: ". Failure to comply may result in penalties in accordance with the tournament rules.",
      },
    ],
  },
  {
    id: "tournament-results",
    question: "When will the tournament results be announced?",
    // TODO(copy): placeholder — `385:17879` is drawn collapsed and no answer
    // exists anywhere in the file. Needs approval (blocker B2).
    answer: [
      { text: "Standings are published " },
      { text: "as each round is scrutineered", strong: true },
      {
        text: ", and the final result is confirmed once the referees' sheets are signed off — usually within an hour of the last hand.",
      },
    ],
  },
] as const

/**
 * Which item starts open. The design draws the second one expanded
 * (`385:17872`) — an accordion where everything is shut opens on a wall of
 * questions with nothing to read.
 */
export const TOURNAMENT_FAQ_DEFAULT_OPEN = TOURNAMENT_FAQ_ITEMS[1]!.id
