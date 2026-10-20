/**
 * The code of ethics — Figma node `762:1320`, kept out of the template for i18n
 * (RULES §9).
 *
 * Three clauses in a masked column that turns as the reader scrolls, which is
 * the construction About's pillars are drawn as; the design is that frame with
 * the copy swapped, down to the same photograph and the same bite out of its
 * left edge.
 *
 * The copy is the federation's revision of `762:1320` ("Our Standards of
 * Conduct"): each clause now has a name after its number, and the bodies are the
 * federation's own wording rather than the design's.
 *
 * `762:1320` draws ONE photograph for the whole section — and it is the pillars
 * frame's own, since this frame is a copy of it. The repo owner asked for a
 * picture per clause, and the federation supplied one for each (2026-10-20).
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
  /** Set after the number on the same line: "01 — Respect Others". */
  title: string
  body: string
  /** The photograph that stands beside this clause while it is being read. */
  imageUrl: string
  imageAlt: string
}

export const ETHICS_CLAUSES: readonly EthicsClause[] = [
  {
    id: "respect",
    number: "01",
    title: "Respect Others",
    body: "Treat players, opponents, coaches, officials, and everyone involved in dominoes with fairness and respect.",
    imageUrl: "/assets/integrity/conduct-respect.webp",
    imageAlt:
      "Two players shaking hands across a match table, their tiles stood on edge in front of them",
  },
  {
    id: "fair-competition",
    number: "02",
    title: "Protect Fair Competition",
    body: "Compete honestly and reject cheating, corruption, and match manipulation.",
    imageUrl: "/assets/integrity/conduct-fair-competition.webp",
    imageAlt:
      "An official recording the result on a clipboard while two players wait at the table",
  },
  {
    id: "speak-up",
    number: "03",
    title: "Speak Up",
    body: "Raise concerns when something threatens the fairness or safety of the game.",
    imageUrl: "/assets/integrity/conduct-speak-up.webp",
    imageAlt:
      "A player raising a hand at the table to call an official, who turns to listen",
  },
] as const
