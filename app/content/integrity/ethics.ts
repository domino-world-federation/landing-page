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
}

export const ETHICS_CLAUSES: readonly EthicsClause[] = [
  {
    id: "respect",
    number: "01",
    body: "Respect for opponents, officials, and the historical traditions of dominoes.",
  },
  {
    id: "collusion",
    number: "02",
    body: "Total prohibition of collusion, signaling, or non-competitive behavior.",
  },
  {
    id: "reporting",
    number: "03",
    body: "Obligation to report any known integrity breaches through official channels.",
  },
] as const

export const ETHICS_ALT = {
  /**
   * `762:1339` — the same photograph the pillars column stands beside, cropped
   * harder here (1440 of it inside a 760 frame). It earns a real description
   * rather than `alt=""`: it is the only picture in the section, and the
   * clauses beside it are text the reader can already reach.
   */
  photo:
    "The Olympic rings mounted and lit on the facade of a white building at dusk",
} as const
