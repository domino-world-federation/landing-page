/**
 * S14 copy, kept out of JSX for i18n (RULES §9).
 *
 * Wording is from Figma node `56:5159`. Most `href`s are still `#` for the same
 * reason the navbar's are (blocker B2): the pages do not exist. Two are real —
 * About Us, and FAQ, which points at S11.
 *
 * The FAQ target is `/#faq` rather than `#faq`: the footer renders on every
 * page now, and a bare fragment would look for the section on whichever page
 * the reader is standing on and find nothing.
 */

export type FooterLink = {
  label: string
  href: string
}

export type FooterGroup = {
  /** The small grey heading above the column (`56:4944`). */
  title: string
  links: readonly FooterLink[]
}

export const FOOTER_GROUPS: readonly FooterGroup[] = [
  {
    title: "Quick Links",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Tournaments", href: "#" },
      { label: "News", href: "#" },
      { label: "FAQ", href: "/#faq" },
      { label: "Gallery", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Domino", href: "#" },
      { label: "Governance", href: "#" },
      { label: "Integrity", href: "#" },
    ],
  },
] as const

/**
 * The five marks in `56:5114`, in the order Figma lays them out.
 *
 * `href` is `#` throughout: the design gives the icons no destination, and the
 * federation's accounts are not known here. Unlike S9's partner logos — which
 * are not links at all, because a logo still identifies a partner when it is
 * inert — a social icon with nothing behind it says nothing, so these stay
 * anchors and carry an `aria-label` naming the network.
 */
export type SocialLink = {
  id: string
  /** Screen-reader name; the icon carries no text. */
  label: string
  iconUrl: string
  href: string
}

export const FOOTER_SOCIALS: readonly SocialLink[] = [
  {
    id: "instagram",
    label: "Instagram",
    iconUrl: "/assets/global/icon-instagram.svg",
    href: "#",
  },
  {
    id: "tiktok",
    label: "TikTok",
    iconUrl: "/assets/global/icon-tiktok.svg",
    href: "#",
  },
  { id: "x", label: "X", iconUrl: "/assets/global/icon-x.svg", href: "#" },
  {
    id: "youtube",
    label: "YouTube",
    iconUrl: "/assets/global/icon-youtube.svg",
    href: "#",
  },
  {
    id: "facebook",
    label: "Facebook",
    iconUrl: "/assets/global/icon-facebook.svg",
    href: "#",
  },
] as const

export const FOOTER_COPY = {
  mission:
    "The global governing body for the sport of dominoes, promoting excellence and integrity worldwide.",
  /**
   * Two lines because Figma breaks the address explicitly (`56:4939`), and a
   * postal address is one of the few places a line break carries meaning.
   */
  address: ["4A Evans Rd", "Singapore 259362"],
  contactTitle: "Contact",
  /**
   * Verbatim from `56:4977` — and malformed: no top-level domain. It is
   * therefore rendered as TEXT rather than a `mailto:`, because a mail link to
   * an address that cannot receive mail is worse than none. Swap it for the
   * real address and it becomes a link (blocker B2).
   */
  contactEmail: "community@dwf-org",
  socialTitle: "Social Media",
  newsletterTitle: "Subscribe to our newsletter",
  newsletterPlaceholder: "Enter email",
  /** Read on the field itself; the design shows a placeholder and no label. */
  newsletterLabel: "Email address",
  newsletterSubmit: "Subscribe",
  /**
   * Shown after a submit. There is no subscription endpoint yet, and a form
   * that silently swallows an address would be a lie — so it says so.
   */
  newsletterUnavailable: "Subscriptions are not open yet — check back soon.",
  copyright: "© 2026 Domino World Federation (DWF). All rights reserved.",
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
  logoAlt: "Domino World Federation",
} as const
