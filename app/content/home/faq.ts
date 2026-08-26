/**
 * S11 copy, kept out of JSX for i18n (RULES §9).
 *
 * Two fixes against Figma. The heading reads "FREQUENT ASKED QUESTIONS" on
 * node `81:691` and the second question drops its question mark (`81:698`) —
 * both are typos in the mock rather than house style, so both are corrected
 * here, the same call made for S4's run-together "federationrecognized".
 *
 * Only ONE of the three answers exists in the design: Figma draws items 1 and 3
 * collapsed (`81:693`, `81:702`), so their bodies were never written. The two
 * written here are placeholders in the federation's voice and need approval
 * before launch — see PROGRESS, blocker B2. The answer on item 2 is verbatim
 * from `81:701`, bold runs included.
 *
 * `FaqItem`/`FaqSegment` are the accordion's own types, imported from it rather
 * than declared here. This file was where they used to live, which worked while
 * the FAQ existed on one page only; the Domino page's list would otherwise have
 * had to reach into `content/home/` for its shape — exactly the cross-page
 * dependency D32 exists to prevent (D43).
 */

import type { FaqItem } from "~/types/faq"

export const FAQ_COPY = {
  heading: "Frequently Asked Questions",
} as const

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: "what-is-domino",
    question: "What is Domino?",
    answer: [
      {
        text: "Dominoes is a tile game played everywhere from street corners to sanctioned arenas. The DWF governs its ",
      },
      { text: "competitive form", strong: true },
      {
        text: " — one standard set, one scoring system, and a single rulebook every sanctioned match is played under.",
      },
    ],
  },
  {
    id: "join-a-tournament",
    question: "How do I join a tournament?",
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
    id: "tournament-rules",
    question: "Where can I find the tournament rules?",
    answer: [
      { text: "Every sanctioned match is played under the " },
      { text: "Standard International Rulebook", strong: true },
      {
        text: ", published in the resource library above. National federations may add local provisions for their own competitions, but none of them override the rulebook.",
      },
    ],
  },
] as const

export const FAQ_A11Y = {
  /** `%s` is the question. Read on the toggle, so the button announces what it
   *  opens rather than just "expand". */
  toggleLabel: "%s",
} as const

/**
 * Which item starts open. Figma draws the second one expanded (`81:696`) and
 * that is deliberate: an accordion where everything is shut opens on a wall of
 * questions with nothing to read, so one answer is left showing as a sample of
 * what the others hold.
 */
export const FAQ_DEFAULT_OPEN = FAQ_ITEMS[1]!.id
