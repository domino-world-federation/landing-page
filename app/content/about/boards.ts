/**
 * **The board itself is here too, for now.** RULES §8 puts people behind
 * `lib/api/client.ts` and a board is exactly that — it changes at every
 * election. But the CMS has no `/board-members` endpoint yet, so served from a
 * real API the carousel came through empty.
 *
 * TODO(B2): move these back behind `getBoardMembers` once the endpoint exists.
 * `lib/api/mock` already re-exports this array, so the API path keeps working
 * and there is only ever one copy of the data.
 */
import type { BoardMember } from "~/lib/api/types"

/**
 * Executive Boards copy — Figma node `112:3590`, kept out of JSX for i18n
 * (RULES §9).
 *
 * Only the section's framing is here. The members themselves are data and come
 * through `lib/api/client.ts` (RULES §8): they take office and leave it, each
 * with a portrait of their own, and the carousel draws however many it is given.
 */

/**
 * The Executive Committee as About now prints it — **names and offices, no
 * portraits.**
 *
 * The federation asked for the faces to come off this page (2026-09-26), and
 * that request happens to close a defect recorded below: one of the four
 * portraits still in `BOARD_MEMBERS` is a stock photograph of a real, widely
 * recognisable public figure, captioned here as a fictional vice-president.
 * Nothing on About carries a face any more.
 *
 * `BOARD_MEMBERS` is NOT deleted, and that is deliberate — it is re-exported as
 * `MOCK_BOARD_MEMBERS` and still feeds the carousel on `/tournaments` through
 * `getBoardMembers`. Removing it here would empty a second page that nobody
 * asked to change. The licensing note therefore still stands for that page.
 *
 * Copy rather than a feed, for the same reason the old array was: there is no
 * `/board-members` data behind the endpoint yet. These are real people in real
 * offices, so they belong in the CMS the day it can hold them — the TODO below
 * covers both.
 */
export const EXECUTIVE_COMMITTEE = {
  intro:
    "The organisation is led by an experienced and internationally represented Executive Committee, bringing together leaders from across the global sports community.",

  /** The named offices, in the order the federation listed them. */
  officers: [
    { role: "President", name: "Jacqueline Wong" },
    { role: "General Secretary", name: "Piotre Klima" },
    { role: "Vice President", name: "Raja Sapta Oktohari" },
    { role: "Treasurer", name: "Umar Faheem" },
    { role: "Athlete Chair", name: "Shannon Damsteegt" },
  ],

  /**
   * The members who sit on the committee without a named office. One heading
   * over a list rather than five rows repeating the same title, which is how
   * the federation wrote it and how it reads.
   */
  membersLabel: "Executive Committee Members",
  members: [
    "Daria Ratoblyska",
    "Li Ming",
    "Daniel Loy",
    "Elena Morales Rodríguez",
    "Nosimo Kekan",
  ],

  /**
   * The full stop is ours. The sentence arrived without one, and a paragraph
   * that stops mid-air reads as truncated rather than as a style.
   */
  closing:
    "Together, the Executive Committee will support the organisation’s strategic direction, strengthen international cooperation and contribute to the continued development and promotion of its activities worldwide.",
} as const

export const BOARDS_COPY = {
  heading: "Executive Boards",
  /** The strip has no visible label in the design, so it needs one spoken. */
  carouselLabel: "Executive board members",
  previous: "Previous board members",
  next: "Next board members",
  /**
   * Announced when the strip moves, so a screen-reader user is told the view
   * changed rather than only being able to discover it by arrowing through.
   */
  position: (current: number, total: number) =>
    `Showing member ${current} of ${total}`,
} as const

/**
 * The executive board carousel (`112:3590`).
 *
 * Two defects carried over from the design, both left visible rather than
 * quietly repaired:
 *
 * 1. Figma gives cards THREE and FOUR the same office — "SECRETARY GENERAL"
 *    (`112:3580` and `112:3585` share one text template). The fourth is almost
 *    certainly meant to be a different post; inventing one would be worse than
 *    showing the design's own duplication and marking it, which is the same
 *    call the Pillars copy got.
 *
 * 2. TODO(design): `board-portrait-02.webp` is a stock photograph of a REAL,
 *    widely recognisable public figure, used here as a fictional vice-president.
 *    That is a licensing and misrepresentation problem, not a styling one — a
 *    federation naming a real person to an office they do not hold. It needs a
 *    replacement before this page is published; the `alt` below therefore
 *    describes only what is visible and names nobody.
 *
 * The names are the design's own placeholders and are fictional.
 */
export const BOARD_MEMBERS: BoardMember[] = [
  {
    id: "b1",
    // The break is Figma's (`111:3566`) and is kept because the card is 540px
    // wide with a 48px face: the two-line shape is what the design lays out.
    name: "Dr. Salva\nLopez",
    role: "President",
    portraitUrl: "/assets/about/board-portrait-01.webp",
    portraitAlt:
      "A man in a dark suit seated in a low armchair, turning towards the camera in a dimly lit room",
  },
  {
    id: "b2",
    name: "James\nHenderson",
    role: "Vice President",
    portraitUrl: "/assets/about/board-portrait-02.webp",
    portraitAlt:
      "An older man with grey hair, a beard and round glasses in a leather jacket, resting his hand near his chin against a warm brown backdrop",
  },
  {
    id: "b3",
    name: "Elizabeth\nLi Tze",
    role: "Secretary General",
    portraitUrl: "/assets/about/board-portrait-03.webp",
    portraitAlt:
      "A woman with short grey hair and heavy black glasses in a navy blazer, seated at a wooden table in low sunlight",
  },
  {
    id: "b4",
    // TODO(design): duplicate office — `112:3585` repeats "SECRETARY GENERAL".
    role: "Secretary General",
    name: "Jennifer\nBachdzer",
    portraitUrl: "/assets/about/board-portrait-04.webp",
    portraitAlt:
      "A woman with long dark hair in a navy blazer over a cream top, looking past the camera against a wood-panelled wall",
  },
]
