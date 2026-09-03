/**
 * The bite out of a picture's left edge, and where it can stand.
 *
 * Figma draws it twice — `566:13563` on About's pillars and `762:1340` on
 * Integrity's code of ethics — as a 48 x 361 shape on a 760 x 960 frame, which
 * is 6.32% wide and 37.6% tall whatever the frame comes to. The two sections
 * turn it into a marker: it stands beside the block being read, at the top for
 * the first, the middle for the second and the foot for the last.
 *
 * Extracted on the second user (D32/D43). Both sections state the same shape and
 * the same three stops, and they are the design's numbers rather than either
 * section's, so neither one owns them.
 */

/** The shape's own height, as a percentage of the frame it hangs on. */
export const NOTCH_HEIGHT_PCT = 37.6

/**
 * What is held clear at the top and the foot.
 *
 * Not decoration: the frames are rounded 20px, about 2% of their height, and a
 * notch flush to the corner leaves a sliver of photograph outside it.
 */
export const NOTCH_INSET_PCT = 2.5

/**
 * The whole journey, as a percentage of the NOTCH's own height.
 *
 * Stated against the notch because that is what a percentage inside a
 * `transform` resolves against, and a transform is the only way to move it
 * without laying the page out again (RULES §12). Nothing that uses this has to
 * measure the frame.
 *
 * The middle stop falls at the middle of the frame by construction, whatever the
 * inset is, so the stops are evenly spaced without being spaced by hand.
 */
export const NOTCH_TRAVEL_PCT =
  ((100 - NOTCH_HEIGHT_PCT - NOTCH_INSET_PCT * 2) / NOTCH_HEIGHT_PCT) * 100

/**
 * Where the notch stands, given how far through the section the reader is.
 *
 * A FRACTION rather than a step index, so the bite follows the column
 * continuously instead of jumping between three places. The reference moves it
 * with the list rather than in notches, and a marker that arrives after the
 * words it marks is a marker pointing at the wrong thing.
 */
export function notchOffset(fraction: number) {
  return `${Math.min(1, Math.max(0, fraction)) * NOTCH_TRAVEL_PCT}%`
}
