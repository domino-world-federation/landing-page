/**
 * Navigation copy, kept out of JSX so it can be extracted for i18n (RULES §9).
 *
 * Order and labels mirror the Figma design (node `42:2180`).
 * Home, About Us, Domino, Tournaments, Development and News are real routes;
 * the rest are
 * still `#` — those pages do not exist yet. `NavMenu`'s `isActive` only ever matches
 * a real one, so a placeholder can never light up as the current page.
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
  { label: "Members", href: "#" },
  { label: "Development", href: "/development" },
  { label: "Governance", href: "#" },
  { label: "Integrity", href: "#" },
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
