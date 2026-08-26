/**
 * The FAQ page's questions — Figma screen `173:9459`, list `174:10653`. Kept
 * out of JSX for i18n (RULES §9).
 *
 * **Questions are the design's, verbatim and in its order.** Answers mostly are
 * not: Figma draws nine of the ten items collapsed, so only `174:10662` — the
 * tournament one — was ever written, and it is here word for word with its bold
 * runs. The rest are placeholders in the federation's voice, marked
 * `TODO(copy)`, needing approval before launch (blocker B2). That is the call
 * `content/home/faq.ts` and `content/domino/faq.ts` already made for the same
 * situation.
 *
 * The first three questions are the landing page's FAQ (`content/home/faq.ts`)
 * word for word — the design repeats them here — so their answers are repeated
 * rather than rewritten, and the two files must be corrected together when B2
 * resolves. They are NOT imported from there: a page's copy importing another
 * page's is the dependency D32/D43 exists to break, and the landing section
 * shows three questions while this page is the whole list.
 *
 * `FaqItem`/`FaqSegment` come from the accordion, which is where they live.
 */

import type { FaqItem } from "~/types/faq"

/**
 * The five drawers the design's side column names (`173:9528` and its
 * siblings). A closed union rather than a string, so a question cannot be filed
 * under a drawer that does not exist.
 */
export type FaqCategory =
  | "general"
  | "dwf"
  | "tournament"
  | "membership"
  | "development"

export type FaqPageItem = FaqItem & {
  category: FaqCategory
}

/**
 * Tab labels, in the design's order.
 *
 * Figma types them lowercase ("general", "dwf") and they render as capitals
 * because Bebas Neue has no lowercase — the case is the row's, not the
 * string's, so the strings are written the way a translator would need them
 * (D40, and the same call `ALL_NEWS_COPY.allTab` makes).
 *
 * Which of these actually appear is decided by the questions, not by this list:
 * see `FaqCategoryTabs`.
 */
export const FAQ_CATEGORIES: readonly { id: FaqCategory; label: string }[] = [
  { id: "general", label: "General" },
  { id: "dwf", label: "DWF" },
  { id: "tournament", label: "Tournament" },
  { id: "membership", label: "Membership" },
  { id: "development", label: "Development" },
] as const

/**
 * `id`s are prefixed `faq-` for the reason the Domino list prefixes its own:
 * the accordion builds DOM ids as `faq-panel-${id}`, and a duplicate id shows
 * up as a screen reader reading the wrong answer rather than as an error.
 */
export const FAQ_PAGE_ITEMS: readonly FaqPageItem[] = [
  {
    id: "faq-what-is-domino",
    question: "What is Domino?",
    category: "general",
    // TODO(copy): placeholder — `174:10654` is drawn collapsed. Same text as
    // the landing page's first answer; approve both together (blocker B2).
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
    id: "faq-join-a-tournament",
    // Figma drops the question mark (`174:10660`); the other nine questions on
    // the screen carry one, so it is a typo rather than house style (D40).
    question: "How do I join a tournament?",
    category: "tournament",
    // Verbatim from `174:10662`, bold runs included — the one answer the
    // design actually wrote.
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
    id: "faq-tournament-rules",
    question: "Where can I find the tournament rules?",
    category: "tournament",
    // TODO(copy): placeholder — `174:10664` is drawn collapsed. Same text as
    // the landing page's third answer; approve both together (blocker B2).
    answer: [
      { text: "Every sanctioned match is played under the " },
      { text: "Standard International Rulebook", strong: true },
      {
        text: ", published in the resource library. National federations may add local provisions for their own competitions, but none of them override the rulebook.",
      },
    ],
  },
  {
    id: "faq-equipment",
    question: "What equipment is needed to play dominoes?",
    category: "general",
    // TODO(copy): placeholder — `174:10668` is drawn collapsed (blocker B2).
    // The equipment standard it names is the one `content/domino/faq.ts`
    // already cites, so the two pages say the same thing.
    answer: [
      { text: "A sanctioned match needs a " },
      { text: "standard double-six set", strong: true },
      {
        text: " manufactured to the federation's equipment specification, DWF-ES1, a table that seats four, and a scoresheet.",
      },
    ],
  },
  {
    id: "faq-tile-count",
    question: "How many tiles are included in a standard domino set?",
    category: "general",
    // TODO(copy): placeholder — `174:10672` is drawn collapsed (blocker B2).
    answer: [
      { text: "A standard double-six set holds " },
      { text: "28 tiles", strong: true },
      {
        text: " — every pairing of two numbers from blank to six, each appearing exactly once.",
      },
    ],
  },
  {
    id: "faq-first-player",
    question: "How is the first player decided?",
    category: "general",
    // TODO(copy): placeholder — `174:10676` is drawn collapsed (blocker B2).
    answer: [
      { text: "The player holding the " },
      { text: "highest double", strong: true },
      {
        text: " opens the first hand. After that the winner of the previous hand leads, and where nobody holds a double the tiles are reshuffled and drawn again.",
      },
    ],
  },
  {
    id: "faq-valid-move",
    question: "How does a player make a valid move?",
    category: "general",
    // TODO(copy): placeholder — `174:10680` is drawn collapsed (blocker B2).
    answer: [
      { text: "A move is valid when the tile placed " },
      { text: "matches an open end of the layout", strong: true },
      {
        text: " — one half of it carries the number showing at that end. Doubles are laid across the line and are played on like any other end.",
      },
    ],
  },
  {
    id: "faq-cannot-move",
    question: "What happens if a player cannot make a move?",
    category: "general",
    // TODO(copy): placeholder — `174:10684` is drawn collapsed (blocker B2).
    answer: [
      { text: "They " },
      { text: "draw from the boneyard", strong: true },
      {
        text: " until a tile they can place comes out. Once the boneyard is empty and nothing matches, the turn passes and play moves on.",
      },
    ],
  },
  {
    id: "faq-boneyard",
    question: "What is the boneyard in dominoes?",
    category: "general",
    // TODO(copy): placeholder — `174:10688` is drawn collapsed (blocker B2).
    answer: [
      { text: "The " },
      { text: "boneyard", strong: true },
      {
        text: " is the pool of tiles left face down once every player has drawn their hand. It is what a player draws from when they cannot move, and when it runs out the only move left is to pass.",
      },
    ],
  },
  {
    id: "faq-round-end",
    question: "How does a round of dominoes end?",
    category: "general",
    // TODO(copy): placeholder — `174:10692` is drawn collapsed (blocker B2).
    // Scored the way `content/domino/faq.ts` describes a blocked game, so the
    // two answers cannot contradict each other.
    answer: [
      { text: "A round ends when a player lays their " },
      { text: "last tile", strong: true },
      {
        text: ", or when nobody can move and the game is blocked. The hand is then scored on the pips still held in the other players' hands.",
      },
    ],
  },
] as const
