/**
 * The federation's own particulars — facts about DWF rather than copy belonging
 * to any one page.
 *
 * Promoted here the moment a second consumer appeared, which is D32/D43's rule
 * rather than a guess: the postal address lived in `content/footer.ts` while the
 * footer was the only thing that printed it, and `/contact` printing it too
 * would otherwise mean either a page importing another component's copy file —
 * the cross-page dependency D43 had to unpick for the FAQ types — or a second
 * copy of the address free to drift from the first.
 *
 * The email addresses did NOT come with it, and deliberately. The design gives
 * two different ones — `community@dwf-org` in the footer (`56:4977`) and
 * `contact@dwf-domino.org` in the terms (`174:11543`) — and they are not a
 * duplicate to be reconciled here: one is malformed and rendered as text, the
 * other is well formed and rendered as a link. Merging them would be deciding
 * which address the federation actually uses, which is the designer's call.
 */

/**
 * Two lines because Figma breaks the address explicitly (`56:4939`), and a
 * postal address is one of the few places a line break carries meaning.
 */
export const FEDERATION_ADDRESS = ["4A Evans Rd", "Singapore 259362"] as const
