/**
 * Navigation copy, kept out of JSX so it can be extracted for i18n (RULES §9).
 *
 * Order and labels mirror the Figma design (node `42:2180`).
 * Every href except home is still `#` — those pages do not exist yet.
 */

export type NavItem = {
  label: string
  href: string
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "#" },
  { label: "Domino", href: "#" },
  { label: "Tournaments", href: "#" },
  { label: "Members", href: "#" },
  { label: "Development", href: "#" },
  { label: "Governance", href: "#" },
  { label: "Integrity", href: "#" },
  { label: "News", href: "#" },
] as const

export const NAV_COPY = {
  /** Read by screen readers; the logo carries no text in the design. */
  logoAlt: "Domino World Federation",
  skipToContent: "Skip to content",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  menuLabel: "Main",
} as const
