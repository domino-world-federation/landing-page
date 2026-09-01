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
  href: string
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Domino", href: "/domino" },
  { label: "Tournaments", href: "/tournaments" },
  { label: "Members", href: "/members" },
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
