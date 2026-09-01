/**
 * Navigation copy, kept out of JSX so it can be extracted for i18n (RULES §9).
 *
 * Order and labels mirror the Figma design (node `42:2180`). All nine are real
 * routes now — Governance and Integrity were the last two placeholders, and both
 * pages exist. `NavMenu`'s `isActive` matches on the route, so nothing here can
 * light up as the current page without being one.
 */

export type NavItem = {
  label: string
  /**
   * Absent on an item that only opens a menu. A parent with a destination of its
   * own is a control that does two things from one press — and on a touch screen,
   * where a tap is the only gesture there is, it does the wrong one: it navigates
   * instead of showing the two pages it is there to offer. So Members has no
   * `href`; it opens, and the reader chooses.
   */
  href?: string
  /**
   * A dropdown under this item. The design draws exactly one (`613:23049`,
   * under Members) and the section it sits in is annotated "hover dropdown".
   *
   * Optional rather than an empty array on the other eight: `v-if="item.children"`
   * then reads as "this item has a menu", and an item that grows one later is a
   * data change with no component change behind it.
   */
  children?: readonly NavItem[]
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Domino", href: "/domino" },
  { label: "Tournaments", href: "/tournaments" },
  {
    label: "Members",
    /**
     * No `href` of its own — see the type. The federation directory it used to
     * point at is the first child now, so nothing is unreachable; the press that
     * used to jump there opens the pair instead.
     */
    children: [
      { label: "Federation Members", href: "/federation-members" },
      /** The page does not exist yet — the design draws a Player ID screen
       *  (`629:28717`) and the route is agreed, so the link is written to where
       *  it will live rather than parked on `#`. */
      { label: "Player Membership", href: "/player-membership" },
    ],
  },
  { label: "Development", href: "/development" },
  { label: "Governance", href: "/governance" },
  { label: "Integrity", href: "/integrity" },
  { label: "News", href: "/news" },
] as const

export const NAV_COPY = {
  /** Read by screen readers; the logo carries no text in the design. */
  logoAlt: "Domino World Federation",
  skipToContent: "Skip to content",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  menuLabel: "Main",
} as const
