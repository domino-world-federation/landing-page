/**
 * The shape an FAQ list takes, wherever one is rendered.
 *
 * The Next build exported these from `ui/FaqAccordion` itself and four copy
 * files imported them back out of the component. A Vue SFC cannot export a type
 * beside its component, and it should not have to: these describe the copy, not
 * the control, so they live with the other shared shapes and the accordion reads
 * them like everyone else.
 */

/**
 * A run of answer text. The designs bold phrases inside a paragraph rather than
 * linking them, so the emphasis is typographic and belongs in the copy.
 *
 * Segments rather than a markdown string: a translator moving `**` markers
 * around by hand is a parsing bug waiting to happen, and this way the shape is
 * checked by the compiler.
 */
export type FaqSegment = {
  text: string
  /** Rendered as `<strong>`. */
  strong?: boolean
  /**
   * Rendered as `<em>`. Used for a cited document title — the Domino wireframe
   * draws one underlined and in a link colour, but there is nowhere for it to
   * lead, so it is emphasis rather than a control.
   */
  em?: boolean
}

export type FaqItem = {
  id: string
  question: string
  /**
   * Two shapes, and the difference is who wrote the answer.
   *
   * `FaqSegment[]` — copy that lives in this repo (`content/domino/faq.ts` and
   * the FAQ page's own list). Segments rather than markdown for the reason
   * above: a translator moving `**` markers by hand is a parsing bug waiting to
   * happen, and this way the compiler checks it.
   *
   * `string` — sanitised HTML from the CMS, which is what `GET /faqs` sends.
   * The reasoning for segments does not reach this case: the federation writes
   * these in a rich-text editor whose toolbar includes bulleted lists and
   * links, and **a flat run of segments cannot represent either**. The server
   * runs every answer through `Purifier` before storing it, so the HTML that
   * arrives here is already narrowed to bold, italic, underline, strike, lists
   * and links.
   *
   * `FaqAccordion` branches on `typeof`. Both render the same typography — the
   * point of keeping both is that the static pages did not have to be rewritten
   * to make the CMS work.
   */
  answer: readonly FaqSegment[] | string
}
