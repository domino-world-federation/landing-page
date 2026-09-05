/**
 * S4 copy, kept out of JSX for i18n (RULES §9).
 *
 * Wording is verbatim from Figma node `31:1105` in the reference file
 * (`oY2v2wq359rIRK4KaItmxc`), which **redrew this section into a join call**.
 * It used to state what the federation is — "A Global Dominoes Federation / For
 * Every Nation" over a paragraph about standardising competitive play; it now
 * asks the reader to bring their national federation in. The picture behind it
 * did not change, so nothing here is a rename: the whole block is different
 * copy doing a different job, and the button goes from "Discover More" to a
 * named destination.
 */

export const FEATURE_HQ_COPY = {
  /**
   * Two entries because Figma breaks the line explicitly inside one text node
   * (`31:1094`, "READY TO JOIN?\nSTART Your journey with dwf"), and the break is
   * part of the composition — it is what keeps the headline clear of the signage
   * wall on the right. Each entry renders as its own line; on a narrow screen a
   * line may wrap further, which is fine, but the design's own break is never
   * lost.
   *
   * Stored in sentence case even though the design draws it in capitals: the
   * capitals are `uppercase` in the stylesheet, and a translation that needs its
   * own casing rules should not have to undo shouting first.
   */
  headline: ["Ready to Join?", "Start Your Journey with DWF"],
  body: "Bring your national federation into DWF to access international competitions, official recognition, and a growing global network.",
  cta: "Explore DWF ID",
  /**
   * Player membership. **The page does not exist yet** — the design draws a
   * Player ID screen (`629:28717`) and the route is agreed, so the link is
   * written to where it will live rather than parked on `#`. It 404s until the
   * page lands, which is the visible, fixable failure; a `#` is the silent one.
   */
  ctaUrl: "/player-membership",
} as const

export const FEATURE_HQ_ALT = {
  /**
   * Described rather than left decorative, and the picture change strengthened
   * the case rather than weakening it. The headquarters photograph showed the
   * building the federation works from; this one shows the thing the sentence
   * beside it is actually asking about — people at a table, mid-game, under the
   * federation's mark. A reader who cannot see it would otherwise lose the only
   * evidence on the page that this is a game played by people.
   *
   * Named `table` rather than kept as `building`: the key says what the picture
   * IS, so a stale name would be the next reader's wrong assumption. The About
   * page keeps the building shot and its own `HQ_ALT.building` — different
   * picture, different page, untouched.
   */
  table:
    "Players seated around a domino table mid-game, the federation emblem above them",
} as const
