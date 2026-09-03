/**
 * The code of ethics — Figma node `762:1320`, kept out of the template for i18n
 * (RULES §9).
 *
 * Three clauses in a masked column that turns as the reader scrolls, which is
 * the construction About's pillars are drawn as; the design is that frame with
 * the copy swapped, down to the same photograph and the same bite out of its
 * left edge.
 *
 * **Two typos corrected from the design** (D40): `762:1329` reads "Respect fot
 * opponents" and `762:1333` "colusion". Both are slips in a Figma text layer
 * rather than house style — a federation does not publish its own code of ethics
 * misspelt — so they are set right here and recorded rather than reproduced.
 *
 * TODO(design): `762:1320` draws ONE photograph for the whole section — and it
 * is the pillars frame's own, since this frame is a copy of it. The repo owner
 * asked for a picture per clause, so all three are taken from the site's own
 * library rather than invented: two players at a table, a match under broadcast,
 * a hall seen down its rows. Placeholders for whatever the federation means each
 * clause to be shown as.
 *
 * TODO(design): every clause in `762:1320` carries an eyebrow above its number
 * reading "OLYMPIC STAGE" — the eyebrow from the pillars frame this was copied
 * from, left behind when the bodies were replaced. It is not dropped for being
 * wrong so much as for being someone else's: there is no eyebrow this section
 * could carry that the number does not already say. Restore it if real kickers
 * arrive.
 */

export type EthicsClause = {
  id: string
  /** `01`, `02`, `03` — Bebas 72/64 where the pillars frame puts its title. */
  number: string
  body: string
  /** The photograph that stands beside this clause while it is being read. */
  imageUrl: string
  imageAlt: string
}

export const ETHICS_CLAUSES: readonly EthicsClause[] = [
  {
    id: "respect",
    number: "01",
    body: "Respect for opponents, officials, and the historical traditions of dominoes.",
    imageUrl: "/assets/global/gallery-exhibition-match.png",
    imageAlt:
      "Two players facing each other across a match table, tiles laid out between them",
  },
  {
    id: "collusion",
    number: "02",
    body: "Total prohibition of collusion, signaling, or non-competitive behavior.",
    imageUrl: "/assets/global/gallery-match-broadcast.png",
    imageAlt:
      "A match being broadcast from the hall floor, camera and monitors trained on the table",
  },
  {
    id: "reporting",
    number: "03",
    body: "Obligation to report any known integrity breaches through official channels.",
    imageUrl: "/assets/global/gallery-playing-hall.png",
    imageAlt:
      "A tournament hall seen down its rows of tables, officials standing between them",
  },
] as const
