/**
 * S14 copy, kept out of JSX for i18n (RULES §9).
 *
 * Wording is from Figma node `56:5159`. Several `href`s are still `#` for the
 * same reason the navbar's are: those pages do not exist. Eight are real —
 * About Us, Tournaments, News, Gallery, Terms, Privacy, Contact and FAQ. Contact is the one
 * entry Figma does not list at all; see the note beside it.
 *
 * **FAQ used to point at `/#faq`**, the landing page's S11, because the FAQ
 * screen (`173:9459`) was drawn and not built — so "FAQ" in the footer of any
 * page sent the reader home to a section holding three of the ten questions.
 * It goes to `/page/faq` now that the page exists.
 */

import { FEDERATION_ADDRESS } from "@/content/federation"

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
      { label: "Tournaments", href: "/tournaments" },
      { label: "News", href: "/news" },
      { label: "FAQ", href: "/page/faq" },
      { label: "Gallery", href: "/gallery" },
      // TODO(design): not in Figma's list (`56:5159`), which stops at Gallery.
      // Added because `/contact` was otherwise reachable from exactly one place
      // on the whole site — a button inside the terms document — and a page
      // that can only be found from inside a legal page is a page nobody finds.
      // Appended rather than slotted next to FAQ so the design's five keep
      // their order and the addition is visibly the addition. Same
      // extrapolation as the page itself, and recorded under the same risk
      // (R14).
      { label: "Contact", href: "/contact" },
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
   * The federation's own, shared with `/contact` — see `content/federation.ts`
   * for why it no longer lives here.
   */
  address: FEDERATION_ADDRESS,
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
    // The cookie policy is still `#` — it is drawn nowhere in the design.
    { label: "Privacy", href: "/page/privacy" },
    { label: "Terms", href: "/page/terms" },
    { label: "Cookie Policy", href: "#" },
  ],
  logoAlt: "Domino World Federation",
} as const
