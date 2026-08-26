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
  answer: readonly FaqSegment[]
}
