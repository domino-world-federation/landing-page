/**
 * The Domino page's FAQ — Figma wireframe `119:4634`. Kept out of JSX for i18n
 * (RULES §9).
 *
 * **No hi-fi design exists for this section** (D42); the questions below are the
 * wireframe's, verbatim.
 *
 * Only the second question has an answer. The wireframe draws items 1 and 3
 * collapsed (`119:4640`, `119:4655`), so their bodies were never written — the
 * same situation the landing page's FAQ is in, and handled the same way: short
 * placeholders in the federation's voice, marked, needing approval before launch
 * (blocker B2). The answer on item 2 is verbatim from `119:4653`, bold and
 * italic runs included.
 *
 * `FaqItem` comes from the accordion rather than from `content/home/faq`, which
 * is where it used to live — a page's copy must not import another page's
 * (D32/D43).
 */

import type { FaqItem } from "~/types/faq"

export const DOMINO_FAQ_COPY = {
  heading: "Frequently Asked Questions",
  /** `572:14518`. The redraw gives this page the same button the landing FAQ and
   *  `/tournaments` already carry, to the same destination. */
  viewMore: "View more",
  viewMoreHref: "/page/faq",
} as const

/**
 * `id`s are prefixed `domino-` because the accordion builds its DOM ids as
 * `faq-panel-${id}`. Nothing puts two accordions on one page today, but the
 * prefix costs nothing and a duplicate id is the kind of bug that surfaces as a
 * screen reader reading the wrong answer rather than as an error.
 */
export const DOMINO_FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: "domino-blocked-game",
    question: "What constitutes a 'blocked' game?",
    // TODO(copy): placeholder — `119:4640` is drawn collapsed and no answer
    // was ever written. Needs approval (blocker B2).
    answer: [
      { text: "A game is " },
      { text: "blocked", strong: true },
      {
        text: " when no player can place a tile and the boneyard is empty. The hand ends there, and the player holding the lowest pip total takes the points still in their opponents' hands.",
      },
    ],
  },
  {
    id: "domino-verbal-communication",
    question: "Are verbal communications allowed in doubles?",
    answer: [
      { text: "No", strong: true },
      { text: ". Verbal communication between doubles partners " },
      { text: "is not allowed during play", strong: true },
      {
        text: ". Players must not provide instructions, coaching, or strategic guidance to their partner while a point is in progress. This rule is in accordance with ",
      },
      // Underlined and in a link colour in the wireframe, but rendered as
      // emphasis rather than as a link: it is a cited document with nowhere to
      // lead. The colour is the wireframe kit's default link style, not a
      // destination anybody specified.
      { text: "The Law of Domino – Tag Team", em: true },
      {
        text: ". Failure to comply may result in penalties in accordance with the tournament rules.",
      },
    ],
  },
  {
    id: "domino-professional-tiles",
    question: "How are professional tiles different?",
    // TODO(copy): placeholder — `119:4655` is drawn collapsed and no answer
    // was ever written. Needs approval (blocker B2).
    answer: [
      { text: "Sanctioned play uses a " },
      { text: "standard 6-6 set", strong: true },
      {
        text: " manufactured to the federation's equipment specification, so weight, dimensions and pip depth are identical at every table. The standard is published as DWF-ES1.",
      },
    ],
  },
] as const
